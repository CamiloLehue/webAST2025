// Utilidades para manejo de imágenes

// Extensiones de imagen soportadas (en minúsculas para comparación)
export const SUPPORTED_IMAGE_EXTENSIONS = [
  '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg', '.tiff', '.tif', '.ico', '.avif'
];

/**
 * Verifica si un archivo es una imagen basándose en su extensión
 */
export const isImageFile = (fileName: string): boolean => {
  const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
  return SUPPORTED_IMAGE_EXTENSIONS.includes(extension);
};

/**
 * Verifica si una URL es externa (http/https)
 */
export const isExternalUrl = (url: string): boolean => {
  return url.startsWith('http://') || url.startsWith('https://');
};

/**
 * Verifica si es una ruta de imagen local
 */
export const isLocalImage = (path: string): boolean => {
  return path.startsWith('/img/') || path.startsWith('./img/') || path.startsWith('img/');
};

/**
 * Normaliza la ruta de una imagen
 */
export const normalizeImagePath = (path: string): string => {
  // Si es una URL externa, retornarla tal como está
  if (isExternalUrl(path)) {
    return path;
  }
  
  // Si es una ruta local, asegurar que comience con /
  if (path.startsWith('img/')) {
    return `/${path}`;
  }
  
  if (path.startsWith('./img/')) {
    return path.replace('./', '/');
  }
  
  return path;
};

/**
 * Obtiene la extensión de un archivo
 */
export const getFileExtension = (fileName: string): string => {
  return fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
};

/**
 * Verifica si un archivo es una imagen SVG
 */
export const isSvgImage = (fileName: string): boolean => {
  return getFileExtension(fileName) === '.svg';
};

/**
 * Obtiene el tipo MIME aproximado basándose en la extensión
 */
export const getMimeTypeFromExtension = (fileName: string): string => {
  const extension = getFileExtension(fileName);
  
  const mimeTypes: { [key: string]: string } = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.bmp': 'image/bmp',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.tiff': 'image/tiff',
    '.tif': 'image/tiff',
    '.ico': 'image/x-icon',
    '.avif': 'image/avif'
  };
  
  return mimeTypes[extension] || 'image/jpeg';
};

/**
 * Valida si una URL de imagen es accesible
 */
export const validateImageUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentType = response.headers.get('content-type') || '';
    return response.ok && contentType.startsWith('image/');
  } catch {
    return false;
  }
};

/**
 * Genera una URL de vista previa para una imagen
 */
export const generateImagePreview = (path: string): string => {
  if (isExternalUrl(path)) {
    return path; // Para URLs externas, usar tal como están
  }
  
  // Para imágenes locales, generar diferentes tamaños si es necesario
  const normalizedPath = normalizeImagePath(path);
  
  // En el futuro, aquí se podría implementar lógica para generar thumbnails
  // Por ahora, retornamos la imagen original
  return normalizedPath;
};

/**
 * Constantes para límites de tamaño de imagen
 */
export const IMAGE_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_WIDTH: 4096,
  MAX_HEIGHT: 4096,
  RECOMMENDED_MAX_SIZE: 5 * 1024 * 1024, // 5MB recomendado
};

/**
 * Verifica si una imagen cumple con los límites de tamaño
 */
export const validateImageSize = (file: File): { isValid: boolean; message?: string } => {
  if (file.size > IMAGE_LIMITS.MAX_FILE_SIZE) {
    return {
      isValid: false,
      message: `El archivo es demasiado grande (${(file.size / (1024 * 1024)).toFixed(2)}MB). Máximo permitido: ${IMAGE_LIMITS.MAX_FILE_SIZE / (1024 * 1024)}MB`
    };
  }
  
  if (file.size > IMAGE_LIMITS.RECOMMENDED_MAX_SIZE) {
    return {
      isValid: true,
      message: `Archivo grande (${(file.size / (1024 * 1024)).toFixed(2)}MB). Se recomienda optimizar la imagen para mejorar el rendimiento.`
    };
  }
  
  return { isValid: true };
};

/**
 * Obtiene información detallada de una imagen
 */
export const getImageInfo = (file: File): Promise<{
  width: number;
  height: number;
  size: number;
  type: string;
  sizeFormatted: string;
}> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
        size: file.size,
        type: file.type,
        sizeFormatted: `${(file.size / (1024 * 1024)).toFixed(2)}MB`
      });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};