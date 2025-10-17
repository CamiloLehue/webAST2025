import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { FiImage, FiLink, FiX, FiSearch, FiTag } from "react-icons/fi";
import { TbPhoto, TbVideo, TbFileCode, TbFile } from "react-icons/tb";
import { multimediaService } from "../../features/admin/multimedia-management/services/multimediaService";
import type { MultimediaFile } from "../../features/admin/multimedia-management/types/multimediaTypes";

interface MultimediaSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  acceptedTypes?: string[]; 
}

const MultimediaSelector: React.FC<MultimediaSelectorProps> = ({
  value,
  onChange,
  placeholder = "URL de la imagen o selecciona del multimedia",
  acceptedTypes = ["image", "video", "svg"]
}) => {
  const [showSelector, setShowSelector] = useState(false);
  const [useUrl, setUseUrl] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [files, setFiles] = useState<MultimediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalFiles, setTotalFiles] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const itemsPerPage = 24;

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const loadFiles = useCallback(async (page: number = 1, append: boolean = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      const response = await multimediaService.getMultimediaFiles({ 
        page,
        limit: itemsPerPage,
        sortField: 'created_at',
        sortOrder: 'desc',
        search: debouncedSearchTerm || undefined
      });
      
      if (append) {
        setFiles(prev => [...prev, ...response.files]);
      } else {
        setFiles(response.files);
      }
      
      setTotalFiles(response.total);
      setHasMore(page * itemsPerPage < response.total);
      setCurrentPage(page);
      setHasLoaded(true);
    } catch (err) {
      setError("Error al cargar archivos");
      console.error("Error loading files:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (showSelector && !hasLoaded && !loading) {
      loadFiles();
    }
  }, [showSelector, hasLoaded, loading, loadFiles]);

  useEffect(() => {
    if (showSelector && hasLoaded) {
      loadFiles(1, false);
    }
  }, [debouncedSearchTerm, showSelector, hasLoaded, loadFiles]);

  const loadMoreFiles = () => {
    if (!loadingMore && hasMore) {
      loadFiles(currentPage + 1, true);
    }
  };

  const filteredFiles = files.filter((file: MultimediaFile) => {
    return acceptedTypes.includes(file.category);
  });

  const getImageUrl = (file: MultimediaFile) => {
    const baseUrl = import.meta.env.VITE_API_IMG_URL?.replace("/api", "") || "http://10.30.7.14:8001";
    
    if (file.url.startsWith("http")) {
      return file.url;
    }
    
    if (file.url.startsWith("/")) {
      return `${baseUrl}${file.url}`;
    }
    
    return `${baseUrl}/${file.url}`;
  };

  const handleFileSelect = (file: MultimediaFile) => {
    const url = getImageUrl(file);
    onChange(url);
    setShowSelector(false);
    setSearchTerm(""); 
  };

  const handleCloseSelector = () => {
    setShowSelector(false);
    setSearchTerm("");
    setCurrentPage(1);
    setFiles([]);
    setHasLoaded(false);
  };

  const handleUrlChange = (url: string) => {
    onChange(url);
    setUseUrl(false);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "image":
        return <TbPhoto className="w-4 h-4" />;
      case "video":
        return <TbVideo className="w-4 h-4" />;
      case "svg":
        return <TbFileCode className="w-4 h-4" />;
      default:
        return <TbFile className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "image":
        return "bg-blue-100 text-blue-800";
      case "video":
        return "bg-purple-100 text-purple-800";
      case "svg":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderPreview = (file: MultimediaFile) => {
    if (file.category === "image") {
      return (
        <img
          src={getImageUrl(file)}
          alt={file.alt || file.original_name}
          className="w-full h-32 object-cover rounded-lg"
          loading="lazy"
        />
      );
    }
    
    if (file.category === "video") {
      return (
        <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
          <TbVideo className="w-8 h-8 text-gray-400" />
        </div>
      );
    }
    
    return (
      <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
        {getCategoryIcon(file.category)}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
        />
        <button
          type="button"
          onClick={() => setShowSelector(true)}
          className="px-3 py-2 bg-accent-100 text-white rounded-md hover:bg-accent-200 transition-colors flex items-center gap-2"
        >
          <FiImage className="w-4 h-4" />
          Galería
        </button>
        <button
          type="button"
          onClick={() => setUseUrl(!useUrl)}
          className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          <FiLink className="w-4 h-4" />
          URL
        </button>
      </div>

      {useUrl && (
        <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://ejemplo.com/imagen.jpg"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleUrlChange((e.target as HTMLInputElement).value);
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                const input = document.querySelector('input[type="url"]') as HTMLInputElement;
                if (input?.value) {
                  handleUrlChange(input.value);
                }
              }}
              className="px-3 py-2 bg-accent-100 text-white rounded-md hover:bg-accent-200 transition-colors"
            >
              Usar URL
            </button>
          </div>
        </div>
      )}

      {value && (
        <div className="relative">
          <div className="border border-gray-200 rounded-md p-2 bg-gray-50">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 truncate flex-1">
                {value}
              </span>
              <button
                type="button"
                onClick={() => onChange("")}
                className="ml-2 text-gray-400 hover:text-red-500"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {showSelector && createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-white-100">
              <h3 className="text-lg font-semibold">Seleccionar Multimedia</h3>
              <button
                onClick={handleCloseSelector}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 border-b ">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, categoría, etiqueta o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
                />
                {searchTerm !== debouncedSearchTerm && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent-100"></div>
                  </div>
                )}
                {searchTerm && searchTerm === debouncedSearchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-100"></div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-32 text-red-500">
                  <p>Error al cargar archivos: {error}</p>
                </div>
              ) : filteredFiles.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-gray-500">
                  <p>No se encontraron archivos</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
                    {filteredFiles.map((file) => (
                      <div
                        key={file.id}
                        className="border border-gray-200 rounded-lg p-2 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleFileSelect(file)}
                      >
                        {renderPreview(file)}
                        <div className="mt-2">
                          <div className="flex flex-wrap items-center gap-1 mb-1">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(file.category)}`}>
                              {getCategoryIcon(file.category)}
                              {file.category}
                            </span>
                            {file.tags && file.tags.length > 0 && file.tags.slice(0, 2).map((tag, index) => (
                              <span 
                                key={index}
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
                                title={file.tags.join(', ')}
                              >
                                <FiTag className="w-3 h-3" />
                                {tag}
                              </span>
                            ))}
                            {file.tags && file.tags.length > 2 && (
                              <span 
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
                                title={file.tags.join(', ')}
                              >
                                <FiTag className="w-3 h-3" />
                                +{file.tags.length - 2}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 truncate" title={file.original_name}>
                            {file.original_name}
                          </p>
                          <p className="text-xs text-gray-400 truncate" title={file.filename}>
                            {file.filename}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {hasMore && (
                    <div className="flex justify-center mt-6">
                      <button
                        onClick={loadMoreFiles}
                        disabled={loadingMore}
                        className="px-6 py-2 bg-accent-100 text-white rounded-md hover:bg-accent-200 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {loadingMore ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Cargando...
                          </>
                        ) : (
                          `Cargar más (${filteredFiles.length} de ${totalFiles})`
                        )}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="p-4 border-t bg-gray-50 rounded-b-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {searchTerm ? (
                    <>Resultados: {filteredFiles.length} de {totalFiles} archivos encontrados</>
                  ) : (
                    <>Mostrando {filteredFiles.length} de {totalFiles} archivos</>
                  )}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={handleCloseSelector}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default MultimediaSelector;