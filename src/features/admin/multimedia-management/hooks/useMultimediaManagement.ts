import { useState, useCallback, useRef } from 'react';
import type {
  MultimediaFile,
  CreateMultimediaRequest,
  UpdateMultimediaRequest,
  MultimediaFilters,
  MultimediaListResponse,
  UploadProgress,
  SortField,
  SortOrder,
  MultimediaCategory
} from '../types/multimediaTypes';
import { multimediaService } from '../services/multimediaService';

interface UseMultimediaManagementReturn {
  // Estado
  files: MultimediaFile[];
  loading: boolean;
  error: string | null;
  uploadProgress: UploadProgress[];
  totalFiles: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;

  // Filtros
  filters: MultimediaFilters;
  setFilters: (filters: Partial<MultimediaFilters>) => void;
  clearFilters: () => void;

  // Acciones
  loadFiles: (filters?: MultimediaFilters) => Promise<void>;
  uploadFile: (request: CreateMultimediaRequest) => Promise<MultimediaFile>;
  uploadMultipleFiles: (files: CreateMultimediaRequest[]) => Promise<MultimediaFile[]>;
  updateFile: (id: string, request: UpdateMultimediaRequest) => Promise<MultimediaFile>;
  deleteFile: (id: string) => Promise<void>;
  deleteMultipleFiles: (ids: string[]) => Promise<void>;
  refreshData: () => Promise<void>;

  // Navegación
  goToPage: (page: number) => Promise<void>;
  nextPage: () => Promise<void>;
  prevPage: () => Promise<void>;

  // Ordenamiento
  sortBy: (field: SortField, order?: SortOrder) => Promise<void>;

  // Utilidades
  getFilesByCategory: (category: MultimediaCategory) => MultimediaFile[];
  formatFileSize: (bytes: number) => string;
  isValidFile: (file: File) => { isValid: boolean; error?: string };
}

const defaultFilters: MultimediaFilters = {
  page: 1,
  limit: 12,
  sortField: 'created_at',
  sortOrder: 'desc'
};

export function useMultimediaManagement(): UseMultimediaManagementReturn {
  // Estado principal
  const [files, setFiles] = useState<MultimediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);

  // Estado de paginación
  const [totalFiles, setTotalFiles] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);

  // Filtros
  const [filters, setFiltersState] = useState<MultimediaFilters>(defaultFilters);

  // Referencias
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cargar archivos
  const loadFiles = useCallback(async (newFilters?: MultimediaFilters) => {
    try {
      // Cancelar petición anterior si existe
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      setLoading(true);
      setError(null);

      const filtersToUse = newFilters || filters;
      const response: MultimediaListResponse = await multimediaService.getMultimediaFiles(filtersToUse);

      setFiles(response.files);
      setTotalFiles(response.total);
      setCurrentPage(response.page);
      setTotalPages(response.totalPages);
      setHasNextPage(response.hasNextPage);
      setHasPrevPage(response.hasPrevPage);

      if (newFilters) {
        setFiltersState(prev => ({ ...prev, ...newFilters }));
      }
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err.message || 'Error al cargar archivos multimedia');
      }
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Subir archivo único
  const uploadFile = useCallback(async (request: CreateMultimediaRequest): Promise<MultimediaFile> => {
    const fileId = `upload_${Date.now()}_${Math.random()}`;
    
    try {
      // Agregar progreso inicial
      setUploadProgress(prev => [...prev, {
        fileId,
        progress: 0,
        status: 'uploading'
      }]);

      const result = await multimediaService.uploadFile(request, (progress) => {
        setUploadProgress(prev => prev.map(item => 
          item.fileId === fileId 
            ? { ...item, progress }
            : item
        ));
      });

      // Actualizar progreso a completado
      setUploadProgress(prev => prev.map(item => 
        item.fileId === fileId 
          ? { ...item, progress: 100, status: 'completed' }
          : item
      ));

      // Remover progreso después de un tiempo
      setTimeout(() => {
        setUploadProgress(prev => prev.filter(item => item.fileId !== fileId));
      }, 2000);

      // Recargar archivos
      await loadFiles();

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al subir archivo';
      
      // Actualizar progreso con error
      setUploadProgress(prev => prev.map(item => 
        item.fileId === fileId 
          ? { ...item, status: 'error', error: errorMessage }
          : item
      ));

      throw err;
    }
  }, [loadFiles]);

  // Subir múltiples archivos
  const uploadMultipleFiles = useCallback(async (fileRequests: CreateMultimediaRequest[]): Promise<MultimediaFile[]> => {
    const results: MultimediaFile[] = [];
    
    for (let i = 0; i < fileRequests.length; i++) {
      const result = await uploadFile(fileRequests[i]);
      results.push(result);
    }

    return results;
  }, [uploadFile]);

  // Actualizar archivo
  const updateFile = useCallback(async (id: string, request: UpdateMultimediaRequest): Promise<MultimediaFile> => {
    try {
      setLoading(true);
      setError(null);

      const updatedFile = await multimediaService.updateMultimediaFile(id, request);
      
      // Actualizar archivo en la lista
      setFiles(prev => prev.map(file => 
        file.id === id ? updatedFile : file
      ));

      return updatedFile;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar archivo';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Eliminar archivo
  const deleteFile = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      await multimediaService.deleteMultimediaFile(id);
      
      // Remover archivo de la lista
      setFiles(prev => prev.filter(file => file.id !== id));
      setTotalFiles(prev => prev - 1);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar archivo';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Eliminar múltiples archivos
  const deleteMultipleFiles = useCallback(async (ids: string[]): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      await multimediaService.deleteMultipleFiles(ids);
      
      // Remover archivos de la lista
      setFiles(prev => prev.filter(file => !ids.includes(file.id)));
      setTotalFiles(prev => prev - ids.length);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar archivos';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Refrescar datos
  const refreshData = useCallback(async () => {
    await loadFiles();
  }, [loadFiles]);

  // Navegación de páginas
  const goToPage = useCallback(async (page: number) => {
    const newFilters = { ...filters, page };
    await loadFiles(newFilters);
  }, [filters, loadFiles]);

  const nextPage = useCallback(async () => {
    if (hasNextPage) {
      await goToPage(currentPage + 1);
    }
  }, [hasNextPage, currentPage, goToPage]);

  const prevPage = useCallback(async () => {
    if (hasPrevPage) {
      await goToPage(currentPage - 1);
    }
  }, [hasPrevPage, currentPage, goToPage]);

  // Ordenamiento
  const sortBy = useCallback(async (field: SortField, order: SortOrder = 'asc') => {
    const newFilters = {
      ...filters,
      sortField: field,
      sortOrder: order,
      page: 1 
    };
    await loadFiles(newFilters);
  }, [filters, loadFiles]);

  const setFilters = useCallback((newFilters: Partial<MultimediaFilters>) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFiltersState(updatedFilters);
  }, [filters]);

  const clearFilters = useCallback(() => {
    setFiltersState(defaultFilters);
  }, []);

  const getFilesByCategory = useCallback((category: MultimediaCategory): MultimediaFile[] => {
    return files.filter(file => file.category === category);
  }, [files]);

  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  const isValidFile = useCallback((file: File) => {
    return multimediaService.validateFile(file);
  }, []);

  return {
    files,
    loading,
    error,
    uploadProgress,
    totalFiles,
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,

    // Filtros
    filters,
    setFilters,
    clearFilters,

    // Acciones
    loadFiles,
    uploadFile,
    uploadMultipleFiles,
    updateFile,
    deleteFile,
    deleteMultipleFiles,
    refreshData,

    // Navegación
    goToPage,
    nextPage,
    prevPage,

    // Ordenamiento
    sortBy,

    // Utilidades
    getFilesByCategory,
    formatFileSize,
    isValidFile
  };
}