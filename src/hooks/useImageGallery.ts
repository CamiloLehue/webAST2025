import { useState, useCallback } from 'react';
import { isExternalUrl } from '../utils/imageUtils';
import { fetchRealImages } from '../api/imageGalleryApi';

interface ImageItem {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: ImageItem[];
}

export const useImageGallery = () => {
  const [loading, setLoading] = useState(false);
  
  const fetchImages = useCallback(async (path: string[] = []): Promise<ImageItem[]> => {
    setLoading(true);
    
    try {
      // Usar la API real en lugar de datos simulados
      const images = await fetchRealImages(path);
      
      setLoading(false);
      return images;
    } catch (error) {
      console.error('Error fetching images:', error);
      setLoading(false);
      return [];
    }
  }, []);

  return {
    fetchImages,
    loading,
    isExternalUrl,
  };
};

export type { ImageItem };