import React, { useCallback, useState } from 'react';
import { FiUpload, FiX, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { useImageUpload } from '../../hooks/useImageUpload';

interface ImageUploaderProps {
  directory?: string;
  onUploadSuccess?: (imagePath: string) => void;
  onUploadError?: (error: string) => void;
  acceptedFormats?: string[];
  maxSizeMB?: number;
  className?: string;
  showPreview?: boolean;
  resize?: {
    width: number;
    height: number;
    maintainAspectRatio?: boolean;
  };
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  directory,
  onUploadSuccess,
  onUploadError,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  maxSizeMB = 10,
  className = '',
  showPreview = true,
  resize,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  
  const { uploadState, handleImageUpload, resetState } = useImageUpload();

  const handleFiles = useCallback(async (files: FileList) => {
    const file = files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!acceptedFormats.includes(file.type)) {
      const error = `Formato no soportado. Acepta: ${acceptedFormats.map(f => f.split('/')[1]).join(', ')}`;
      onUploadError?.(error);
      return;
    }

    // Validar tamaño
    if (file.size > maxSizeMB * 1024 * 1024) {
      const error = `El archivo es muy grande. Máximo: ${maxSizeMB}MB`;
      onUploadError?.(error);
      return;
    }

    setFileName(file.name);

    // Crear preview
    if (showPreview) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }

    // Subir archivo
    const result = await handleImageUpload(file, directory, { resize });
    
    if (result.success && result.imagePath) {
      onUploadSuccess?.(result.imagePath);
    } else {
      onUploadError?.(result.error || 'Error uploading image');
    }
  }, [acceptedFormats, maxSizeMB, directory, resize, showPreview, handleImageUpload, onUploadSuccess, onUploadError]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  const clearUpload = useCallback(() => {
    setPreview(null);
    setFileName('');
    resetState();
  }, [resetState]);

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${dragActive ? 'border-accent-100 bg-accent-50' : 'border-gray-300 hover:border-gray-400'}
          ${uploadState.uploading ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={acceptedFormats.join(',')}
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploadState.uploading}
        />

        {uploadState.uploading ? (
          <div className="flex flex-col items-center space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-100"></div>
            <div className="text-sm text-gray-600">
              Subiendo imagen... {uploadState.progress}%
            </div>
            {uploadState.progress > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-accent-100 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadState.progress}%` }}
                ></div>
              </div>
            )}
          </div>
        ) : uploadState.success ? (
          <div className="flex flex-col items-center space-y-3">
            <FiCheck className="h-8 w-8 text-green-500" />
            <div className="text-sm text-green-600">
              ¡Imagen subida exitosamente!
            </div>
            <button
              onClick={clearUpload}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Subir otra imagen
            </button>
          </div>
        ) : uploadState.error ? (
          <div className="flex flex-col items-center space-y-3">
            <FiAlertCircle className="h-8 w-8 text-red-500" />
            <div className="text-sm text-red-600">
              {uploadState.error}
            </div>
            <button
              onClick={clearUpload}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Intentar de nuevo
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-3">
            <FiUpload className="h-8 w-8 text-gray-400" />
            <div className="text-sm text-gray-600">
              <span className="font-medium">Click para subir</span> o arrastra una imagen aquí
            </div>
            <div className="text-xs text-gray-500">
              Formatos: {acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')} 
              (Max: {maxSizeMB}MB)
            </div>
          </div>
        )}
      </div>

      {/* Preview de la imagen */}
      {preview && showPreview && (
        <div className="mt-4 relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">{fileName}</span>
            <button
              onClick={() => setPreview(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>
          <div className="relative rounded-lg overflow-hidden max-h-48">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;