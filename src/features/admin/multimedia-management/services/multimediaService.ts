import type {
  MultimediaFile,
  CreateMultimediaRequest,
  UpdateMultimediaRequest,
  MultimediaFilters,
  MultimediaListResponse,
  FileValidationResult,
  MultimediaCategory
} from '../types/multimediaTypes';

import {
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE
} from '../types/multimediaTypes';

const API_URL = import.meta.env.VITE_API_URL;

class MultimediaService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('admin_token');
    return {
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  private getJsonHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      ...this.getAuthHeaders()
    };
  }

  /**
   * Valida un archivo antes de subirlo
   */
  validateFile(file: File): FileValidationResult {
    // Verificar tipo de archivo
    let category: MultimediaCategory | undefined;
    let maxSize: number;

    if ((ALLOWED_FILE_TYPES.images as readonly string[]).includes(file.type)) {
      category = 'image';
      maxSize = MAX_FILE_SIZE.image;
    } else if ((ALLOWED_FILE_TYPES.videos as readonly string[]).includes(file.type)) {
      category = 'video';
      maxSize = MAX_FILE_SIZE.video;
    } else if ((ALLOWED_FILE_TYPES.svg as readonly string[]).includes(file.type)) {
      category = 'svg';
      maxSize = MAX_FILE_SIZE.svg;
    } else if ((ALLOWED_FILE_TYPES.documents as readonly string[]).includes(file.type)) {
      category = 'document';
      maxSize = MAX_FILE_SIZE.document;
    } else {
      return {
        isValid: false,
        error: `Tipo de archivo no permitido: ${file.type}`
      };
    }

    // Verificar tamaño
    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024));
      return {
        isValid: false,
        error: `El archivo es demasiado grande. Máximo permitido: ${maxSizeMB}MB`
      };
    }

    return {
      isValid: true,
      category
    };
  }

  /**
   * Obtiene la lista de archivos multimedia con filtros
   */
  async getMultimediaFiles(filters?: MultimediaFilters): Promise<MultimediaListResponse> {
    try {
      const {
        page = 1,
        limit = 12,
        search,
        category,
        tags,
        sortField = 'created_at',
        sortOrder = 'desc'
      } = filters || {};

      const skip = (page - 1) * limit;
      const params = new URLSearchParams({
        skip: skip.toString(),
        limit: limit.toString(),
        sortField,
        sortOrder
      });

      if (search && search.trim()) {
        params.append('search', search.trim());
      }
      if (category) {
        params.append('category', category);
      }
      if (tags && tags.length > 0) {
        params.append('tags', tags.join(','));
      }

      const [filesResponse, countResponse] = await Promise.all([
        fetch(`${API_URL}/multimedia?${params.toString()}`, {
          method: 'GET',
          headers: this.getAuthHeaders()
        }),
        fetch(`${API_URL}/multimedia/count?${params.toString()}`, {
          method: 'GET',
          headers: this.getAuthHeaders()
        })
      ]);

      if (!filesResponse.ok) {
        throw new Error(`Error ${filesResponse.status}: ${filesResponse.statusText}`);
      }
      if (!countResponse.ok) {
        throw new Error(`Error ${countResponse.status}: ${countResponse.statusText}`);
      }

      const files = await filesResponse.json();
      const { total } = await countResponse.json();
      const totalPages = Math.ceil(total / limit);

      return {
        files,
        total,
        page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      };
    } catch (error) {
      console.error('Error al obtener archivos multimedia:', error);
      throw error;
    }
  }

  /**
   * Sube un archivo multimedia
   */
  async uploadFile(
    request: CreateMultimediaRequest,
    onProgress?: (progress: number) => void
  ): Promise<MultimediaFile> {
    try {
      // Validar archivo
      const validation = this.validateFile(request.file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      const formData = new FormData();
      formData.append('file', request.file);
      formData.append('category', request.category);
      
      if (request.tags && request.tags.length > 0) {
        formData.append('tags', JSON.stringify(request.tags));
      }
      if (request.description) {
        formData.append('description', request.description);
      }
      if (request.alt) {
        formData.append('alt', request.alt);
      }

      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        if (onProgress) {
          xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
              const progress = Math.round((event.loaded / event.total) * 100);
              onProgress(progress);
            }
          });
        }

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const result = JSON.parse(xhr.responseText);
              resolve(result);
            } catch {
              reject(new Error('Error al procesar la respuesta del servidor'));
            }
          } else {
            reject(new Error(`Error ${xhr.status}: ${xhr.statusText}`));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Error de red al subir el archivo'));
        });

        xhr.open('POST', `${API_URL}/multimedia/upload`);
        
        // Agregar headers de autorización
        const token = localStorage.getItem('admin_token');
        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }

        xhr.send(formData);
      });
    } catch (error) {
      console.error('Error al subir archivo:', error);
      throw error;
    }
  }

  /**
   * Sube múltiples archivos
   */
  async uploadMultipleFiles(
    files: CreateMultimediaRequest[],
    onProgress?: (fileIndex: number, progress: number) => void
  ): Promise<MultimediaFile[]> {
    const results: MultimediaFile[] = [];
    
    for (let i = 0; i < files.length; i++) {
      try {
        const result = await this.uploadFile(files[i], (progress) => {
          onProgress?.(i, progress);
        });
        results.push(result);
      } catch (error) {
        console.error(`Error al subir archivo ${i + 1}:`, error);
        throw error;
      }
    }

    return results;
  }

  /**
   * Obtiene un archivo multimedia por ID
   */
  async getMultimediaFile(id: string): Promise<MultimediaFile> {
    try {
      const response = await fetch(`${API_URL}/multimedia/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener archivo multimedia:', error);
      throw error;
    }
  }

  /**
   * Actualiza un archivo multimedia
   */
  async updateMultimediaFile(id: string, request: UpdateMultimediaRequest): Promise<MultimediaFile> {
    try {
      const response = await fetch(`${API_URL}/multimedia/${id}`, {
        method: 'PUT',
        headers: this.getJsonHeaders(),
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al actualizar archivo multimedia:', error);
      throw error;
    }
  }

  /**
   * Elimina un archivo multimedia
   */
  async deleteMultimediaFile(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/multimedia/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error al eliminar archivo multimedia:', error);
      throw error;
    }
  }

  /**
   * Elimina múltiples archivos multimedia
   */
  async deleteMultipleFiles(ids: string[]): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/multimedia/bulk-delete`, {
        method: 'DELETE',
        headers: this.getJsonHeaders(),
        body: JSON.stringify({ ids })
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error al eliminar archivos multimedia:', error);
      throw error;
    }
  }

  /**
   * Obtiene todas las etiquetas disponibles
   */
  async getTags(): Promise<string[]> {
    try {
      const response = await fetch(`${API_URL}/multimedia/tags`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener etiquetas:', error);
      throw error;
    }
  }

  /**
   * Obtiene estadísticas de uso de multimedia
   */
  async getStats(): Promise<{
    totalFiles: number;
    totalSize: number;
    byCategory: Record<MultimediaCategory, number>;
    recentUploads: number;
  }> {
    try {
      const response = await fetch(`${API_URL}/multimedia/stats`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  }
}

export const multimediaService = new MultimediaService();
export default multimediaService;