/**
 * Utilidad para procesar URLs de imágenes
 * Convierte URLs locales a URLs del servidor usando VITE_API_IMG_URL
 */

export const processImageUrl = (imageUrl: string | undefined | null): string => {
  if (!imageUrl || imageUrl.trim() === "") {
    return "";
  }

  const baseUrl = import.meta.env.VITE_API_IMG_URL?.replace("/api", "") || "http://10.30.7.14:8001";
  const isExternal = imageUrl.startsWith("http://") || imageUrl.startsWith("https://");
  
  if (isExternal) {
    return imageUrl;
  }
  
  if (imageUrl.startsWith("/")) {
    return `${baseUrl}${imageUrl}`;
  }
  
  return `${baseUrl}/${imageUrl}`;
};

/**
 * Hook para procesar URLs de imágenes de manera reactiva
 */
export const useImageUrl = (imageUrl: string | undefined | null): string => {
  return processImageUrl(imageUrl);
};