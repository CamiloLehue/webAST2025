import { useState, useCallback } from 'react';
import { uploadImage, deleteImage, resizeImage } from '../api/imageGalleryApi';
import { validateImageSize, getImageInfo, IMAGE_LIMITS } from '../utils/imageUtils';

interface UploadState {
  uploading: boolean;
  progress: number;
  error: string | null;
  success: boolean;
}

interface ImageUploadResult {
  success: boolean;
  imagePath?: string;
  error?: string;
}

export const useImageUpload = () => {
  const [uploadState, setUploadState] = useState<UploadState>({
    uploading: false,
    progress: 0,
    error: null,
    success: false,
  });

  const resetState = useCallback(() => {
    setUploadState({
      uploading: false,
      progress: 0,
      error: null,
      success: false,
    });
  }, []);

  const handleImageUpload = useCallback(async (
    file: File,
    directory?: string,
    options?: {
      resize?: { width: number; height: number; maintainAspectRatio?: boolean };
      validateSize?: boolean;
    }
  ): Promise<ImageUploadResult> => {
    resetState();
    
    try {
      setUploadState(prev => ({ ...prev, uploading: true, progress: 0 }));

      // Validar tamaño si está habilitado
      if (options?.validateSize !== false) {
        const sizeValidation = validateImageSize(file);
        if (!sizeValidation.isValid) {
          throw new Error(sizeValidation.message);
        }
      }

      // Obtener información de la imagen
      const imageInfo = await getImageInfo(file);
      console.log('Image info:', imageInfo);

      // Mostrar advertencia para imágenes grandes
      if (imageInfo.size > IMAGE_LIMITS.RECOMMENDED_MAX_SIZE) {
        console.warn(`Large image detected: ${imageInfo.sizeFormatted}`);
      }

      setUploadState(prev => ({ ...prev, progress: 30 }));

      // Subir imagen
      const uploadResult = await uploadImage(file, directory);
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'Upload failed');
      }

      setUploadState(prev => ({ ...prev, progress: 70 }));

      let finalImagePath = uploadResult.imagePath!;

      // Redimensionar si es necesario
      if (options?.resize && uploadResult.imagePath) {
        const resizeResult = await resizeImage(
          uploadResult.imagePath,
          options.resize.width,
          options.resize.height,
          options.resize.maintainAspectRatio
        );

        if (resizeResult.success && resizeResult.newImagePath) {
          finalImagePath = resizeResult.newImagePath;
        } else {
          console.warn('Resize failed, using original image:', resizeResult.error);
        }
      }

      setUploadState(prev => ({ 
        ...prev, 
        uploading: false, 
        progress: 100, 
        success: true 
      }));

      return {
        success: true,
        imagePath: finalImagePath,
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown upload error';
      
      setUploadState(prev => ({
        ...prev,
        uploading: false,
        error: errorMessage,
      }));

      return {
        success: false,
        error: errorMessage,
      };
    }
  }, [resetState]);

  const handleImageDelete = useCallback(async (imagePath: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setUploadState(prev => ({ ...prev, uploading: true }));
      
      const result = await deleteImage(imagePath);
      
      setUploadState(prev => ({ 
        ...prev, 
        uploading: false,
        success: result.success,
        error: result.error || null
      }));

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Delete failed';
      
      setUploadState(prev => ({
        ...prev,
        uploading: false,
        error: errorMessage,
      }));

      return { success: false, error: errorMessage };
    }
  }, []);

  return {
    uploadState,
    handleImageUpload,
    handleImageDelete,
    resetState,
  };
};

export type { UploadState, ImageUploadResult };