import React, { useState, useEffect, useCallback } from "react";
import { FiImage, FiLink, FiX, FiFolder, FiAlertTriangle } from "react-icons/fi";
import { useImageGallery } from "../../hooks/useImageGallery";

interface ImageSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

interface ImageItem {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: ImageItem[];
}

// Función para estimar el tamaño de una imagen basándose en patrones conocidos
const getImageSizeWarning = (imageName: string): string | null => {
  const largeImages = [
    'hero.png', 'image01.png', 'image02.png', 'image03.png', 'wisensor-app2.png'
  ];
  
  if (largeImages.some(name => imageName.includes(name))) {
    return "⚠️ Imagen grande (>2MB) - puede tardar en cargar";
  }
  
  return null;
};

const ImageSelector: React.FC<ImageSelectorProps> = ({
  value,
  onChange,
  placeholder = "URL de la imagen o selecciona de la galería",
}) => {
  const [showSelector, setShowSelector] = useState(false);
  const [useUrl, setUseUrl] = useState(false);
  const [availableImages, setAvailableImages] = useState<ImageItem[]>([]);
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  
  const { fetchImages, loading, isExternalUrl } = useImageGallery();

  const fetchAvailableImages = useCallback(async (path: string[]) => {
    try {
      const images = await fetchImages(path);
      setAvailableImages(images as ImageItem[]);
    } catch (error) {
      console.error("Error fetching images:", error);
      setAvailableImages([]);
    }
  }, [fetchImages]);

  useEffect(() => {
    if (showSelector && !useUrl) {
      fetchAvailableImages(currentPath);
    } else if (!showSelector) {
      setAvailableImages([]);
    }
  }, [showSelector, useUrl, currentPath, fetchAvailableImages]);

  useEffect(() => {
    if (value) {
      const isExternal = isExternalUrl(value);
      if (isExternal !== useUrl) {
        setUseUrl(isExternal);
      }
    }
  }, [value, isExternalUrl, useUrl]);

  const handleImageSelect = (imagePath: string) => {
    onChange(imagePath);
    setShowSelector(false);
    setCurrentPath([]); 
  };

  const handleCloseSelector = () => {
    setShowSelector(false);
    setCurrentPath([]); 
    setAvailableImages([]); 
  };

  const navigateToFolder = (folderName: string) => {
    setCurrentPath([...currentPath, folderName]);
  };

  const navigateBack = () => {
    setCurrentPath(currentPath.slice(0, -1));
  };

  const getCurrentPathString = () => {
    return currentPath.length > 0 ? `/img/${currentPath.join("/")}` : "/img";
  };

  return (
    <div className="space-y-2">
      <div className="flex space-x-2">
        <input
          type={useUrl ? "url" : "text"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
          placeholder={placeholder}
          readOnly={!useUrl && showSelector}
        />
        <button
          type="button"
          onClick={() => setShowSelector(true)}
          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md border border-gray-300 transition-colors"
          title="Seleccionar imagen"
        >
          <FiImage className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center space-x-4 text-sm">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            checked={useUrl}
            onChange={() => setUseUrl(true)}
            className="text-accent-100 focus:ring-accent-100"
          />
          <FiLink className="h-4 w-4" />
          <span>URL externa</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            checked={!useUrl}
            onChange={() => setUseUrl(false)}
            className="text-accent-100 focus:ring-accent-100"
          />
          <FiImage className="h-4 w-4" />
          <span>Galería local</span>
        </label>
      </div>

      {/* Selector de imágenes */}
      {showSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-white-100">
              <div className="flex items-center space-x-2">
                <FiImage className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-medium">Seleccionar Imagen</h3>
                <span className="text-sm text-gray-500">
                  {getCurrentPathString()}
                </span>
              </div>
              <button
                onClick={handleCloseSelector}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>

            <div className="p-4">
              {currentPath.length > 0 && (
                <button
                  onClick={navigateBack}
                  className="mb-4 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm flex items-center space-x-1"
                >
                  <span>← Volver a</span>
                  <span>
                    {currentPath.length > 1
                      ? currentPath[currentPath.length - 2]
                      : "raíz"}
                  </span>
                </button>
              )}

              {/* Lista de imágenes y carpetas */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="col-span-full text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-100 mx-auto"></div>
                    <p className="mt-2 text-gray-500">Cargando imágenes...</p>
                  </div>
                ) : availableImages.length === 0 ? (
                  <div className="col-span-full text-center py-8">
                    <FiImage className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No hay imágenes en esta carpeta</p>
                  </div>
                ) : (
                  availableImages.map((item, index) => (
                    <div key={index} className="relative group">
                      {item.isDirectory ? (
                        <button
                          onClick={() => navigateToFolder(item.name)}
                          className="w-full aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 flex flex-col items-center justify-center transition-colors"
                        >
                          <FiFolder className="h-8 w-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600 text-center px-2">
                            {item.name}
                          </span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleImageSelect(item.path)}
                          className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-transparent hover:border-accent-100 transition-colors group relative"
                        >
                          {getImageSizeWarning(item.name) && (
                            <div className="absolute top-1 right-1 z-10 bg-yellow-100 text-yellow-800 text-xs px-1 py-0.5 rounded opacity-75">
                              <FiAlertTriangle className="h-3 w-3" />
                            </div>
                          )}
                          <img
                            src={item.path}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              const container = target.parentElement!;
                              container.innerHTML = `
                                <div class="w-full h-full flex flex-col items-center justify-center bg-gray-100">
                                  <svg class="h-8 w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z"></path>
                                  </svg>
                                  <span class="text-xs text-gray-500 px-2 text-center">${item.name}</span>
                                  <span class="text-xs text-red-500 px-2 text-center mt-1">Error de carga</span>
                                </div>
                              `;
                              console.warn(`Error loading image: ${item.path}`, e);
                            }}
                            onLoad={() => {
                              console.log(`Successfully loaded: ${item.path}`);
                            }}
                          />
                          <div className="absolute inset-0 bg-black/5 bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                            <div className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity px-2 text-center">
                              <div>{item.name}</div>
                              {getImageSizeWarning(item.name) && (
                                <div className="text-yellow-200 mt-1 text-xs">
                                  {getImageSizeWarning(item.name)}
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageSelector;