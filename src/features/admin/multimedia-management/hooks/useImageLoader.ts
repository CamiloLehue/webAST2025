import { useState, useEffect } from 'react';

interface UseImageLoaderOptions {
  src: string;
  fallbackSrc?: string;
}

interface UseImageLoaderReturn {
  imageSrc: string;
  isLoading: boolean;
  hasError: boolean;
  retryLoad: () => void;
}

export function useImageLoader({ src, fallbackSrc }: UseImageLoaderOptions): UseImageLoaderReturn {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadImage = (imageUrl: string) => {
      setIsLoading(true);
      setHasError(false);

      const img = new Image();
      
      img.onload = () => {
        setImageSrc(imageUrl);
        setIsLoading(false);
        setHasError(false);
      };

      img.onerror = () => {
        console.warn(`Error loading image: ${imageUrl}`);
        
        if (fallbackSrc && imageUrl !== fallbackSrc) {
          // Intentar con fallback
          loadImage(fallbackSrc);
        } else {
          setIsLoading(false);
          setHasError(true);
        }
      };

      img.src = imageUrl;
    };

    loadImage(src);
  }, [src, fallbackSrc]);

  const retryLoad = () => {
    setIsLoading(true);
    setHasError(false);
    
    const img = new Image();
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
      setHasError(false);
    };
    img.onerror = () => {
      setIsLoading(false);
      setHasError(true);
    };
    img.src = src;
  };

  return {
    imageSrc,
    isLoading,
    hasError,
    retryLoad
  };
}

/**
 * Construye la URL completa para acceder a recursos multimedia
 */
export function buildMediaUrl(url: string): string {
  const baseUrl = import.meta.env.VITE_API_IMG_URL?.replace('/api', '') || 'http://10.30.7.14:8001';
  
  // Si la URL ya es absoluta, usarla directamente
  if (url.startsWith('http')) {
    return url;
  }
  
  // Si la URL empieza con /, es relativa al dominio
  if (url.startsWith('/')) {
    return `${baseUrl}${url}`;
  }
  
  // Si no, agregar / al inicio
  return `${baseUrl}/${url}`;
}

/**
 * Hook específico para cargar imágenes multimedia con thumbnails
 */
export function useMultimediaImage(file: { url: string; filename: string; category: string }) {
  // Generar URL del thumbnail (si existe)
  const thumbnailUrl = file.url.replace(/(\.[^.]+)$/, '_thumb$1');
  
  const fullImageUrl = buildMediaUrl(file.url);
  const thumbnailFullUrl = buildMediaUrl(thumbnailUrl);
  
  // Intentar cargar thumbnail primero, luego imagen completa
  const { imageSrc, isLoading, hasError, retryLoad } = useImageLoader({
    src: thumbnailFullUrl,
    fallbackSrc: fullImageUrl
  });

  return {
    imageSrc,
    isLoading,
    hasError,
    retryLoad,
    fullImageUrl,
    thumbnailUrl: thumbnailFullUrl
  };
}