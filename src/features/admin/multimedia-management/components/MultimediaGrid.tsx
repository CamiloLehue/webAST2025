import React, { useState } from 'react';
import type { MultimediaFile, UpdateMultimediaRequest } from '../types/multimediaTypes';

interface MultimediaGridProps {
  files: MultimediaFile[];
  loading?: boolean;
  onUpdate: (id: string, request: UpdateMultimediaRequest) => Promise<MultimediaFile>;
  onDelete: (id: string) => Promise<void>;
  onDeleteMultiple: (ids: string[]) => Promise<void>;
  formatFileSize: (bytes: number) => string;
}

interface MultimediaItemProps {
  file: MultimediaFile;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, request: UpdateMultimediaRequest) => Promise<MultimediaFile>;
  onDelete: (id: string) => Promise<void>;
  formatFileSize: (bytes: number) => string;
}

const MultimediaItem: React.FC<MultimediaItemProps> = ({
  file,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  formatFileSize
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    filename: file.filename,
    description: file.description || '',
    alt: file.alt || '',
    tags: file.tags.join(', ')
  });
  const [showPreview, setShowPreview] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const tags = editForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      await onUpdate(file.id, {
        filename: editForm.filename,
        description: editForm.description || undefined,
        alt: editForm.alt || undefined,
        tags
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error al actualizar archivo:', error);
    }
  };

  const handleCancel = () => {
    setEditForm({
      filename: file.filename,
      description: file.description || '',
      alt: file.alt || '',
      tags: file.tags.join(', ')
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (confirm('¿Estás seguro de que quieres eliminar este archivo?')) {
      await onDelete(file.id);
    }
  };

  const getCategoryIcon = () => {
    switch (file.category) {
      case 'image': return '🖼️';
      case 'video': return '🎥';
      case 'svg': return '🎨';
      case 'document': return '📄';
      default: return '📁';
    }
  };

  const getCategoryColor = () => {
    switch (file.category) {
      case 'image': return 'bg-blue-100 text-blue-800';
      case 'video': return 'bg-purple-100 text-purple-800';
      case 'svg': return 'bg-green-100 text-green-800';
      case 'document': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderPreview = () => {
    if (file.category === 'image' || file.category === 'svg') {
      return (
        <img
          src={file.thumbnailUrl || file.url}
          alt={file.alt || file.filename}
          className="w-full h-32 object-cover"
          loading="lazy"
        />
      );
    } else if (file.category === 'video') {
      return (
        <video
          src={file.url}
          className="w-full h-32 object-cover"
          muted
          preload="metadata"
        >
          Tu navegador no soporta el elemento video.
        </video>
      );
    } else {
      return (
        <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl mb-2">{getCategoryIcon()}</div>
            <div className="text-xs text-gray-500">
              {file.mimeType}
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className={`bg-white rounded-lg border-2 transition-all ${
      isSelected ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-gray-300'
    }`}>
      {/* Checkbox de selección */}
      <div className="absolute top-2 left-2 z-10">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(file.id)}
          className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
        />
      </div>

      {/* Preview del archivo */}
      <div className="relative">
        {renderPreview()}
        
        {/* Overlay con acciones */}
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 hover:opacity-100">
          <div className="flex space-x-2">
            <button
              onClick={() => setShowPreview(true)}
              className="p-2 bg-white rounded-full text-gray-700 hover:text-blue-600"
              title="Ver preview"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <button
              onClick={handleEdit}
              className="p-2 bg-white rounded-full text-gray-700 hover:text-blue-600"
              title="Editar"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              className="p-2 bg-white rounded-full text-gray-700 hover:text-red-600"
              title="Eliminar"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Información del archivo */}
      <div className="p-3">
        {isEditing ? (
          <div className="space-y-2">
            <input
              type="text"
              value={editForm.filename}
              onChange={(e) => setEditForm({ ...editForm, filename: e.target.value })}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
              placeholder="Nombre del archivo"
            />
            <input
              type="text"
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
              placeholder="Descripción"
            />
            <input
              type="text"
              value={editForm.alt}
              onChange={(e) => setEditForm({ ...editForm, alt: e.target.value })}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
              placeholder="Texto alternativo"
            />
            <input
              type="text"
              value={editForm.tags}
              onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
              placeholder="Etiquetas (separadas por coma)"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Guardar
              </button>
              <button
                onClick={handleCancel}
                className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-900 truncate flex-1">
                {file.filename}
              </h4>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor()}`}>
                {getCategoryIcon()} {file.category}
              </span>
            </div>
            
            {file.description && (
              <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                {file.description}
              </p>
            )}

            <div className="text-xs text-gray-500 space-y-1">
              <div>Tamaño: {formatFileSize(file.size)}</div>
              <div>Subido: {new Date(file.created_at).toLocaleDateString()}</div>
              {file.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {file.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                  {file.tags.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{file.tags.length - 3} más
                    </span>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Modal de preview */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-full overflow-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">{file.filename}</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              {file.category === 'image' || file.category === 'svg' ? (
                <img
                  src={file.url}
                  alt={file.alt || file.filename}
                  className="max-w-full max-h-96 mx-auto"
                />
              ) : file.category === 'video' ? (
                <video
                  src={file.url}
                  controls
                  className="max-w-full max-h-96 mx-auto"
                >
                  Tu navegador no soporta el elemento video.
                </video>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">{getCategoryIcon()}</div>
                  <p className="text-gray-600">Vista previa no disponible</p>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Descargar archivo
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MultimediaGridComponent: React.FC<MultimediaGridProps> = ({
  files,
  loading = false,
  onUpdate,
  onDelete,
  onDeleteMultiple,
  formatFileSize
}) => {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedFiles.length === files.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(files.map(file => file.id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedFiles.length === 0) return;
    
    const confirmMessage = `¿Estás seguro de que quieres eliminar ${selectedFiles.length} archivo(s)?`;
    if (confirm(confirmMessage)) {
      await onDeleteMultiple(selectedFiles);
      setSelectedFiles([]);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="bg-gray-200 rounded-lg animate-pulse">
            <div className="h-32 bg-gray-300 rounded-t-lg"></div>
            <div className="p-3 space-y-2">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-3 bg-gray-300 rounded w-3/4"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📁</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No hay archivos multimedia
        </h3>
        <p className="text-gray-500">
          Sube algunos archivos para comenzar a gestionar tu biblioteca multimedia.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Controles de selección múltiple */}
      {files.length > 0 && (
        <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedFiles.length === files.length}
                ref={(input) => {
                  if (input) input.indeterminate = selectedFiles.length > 0 && selectedFiles.length < files.length;
                }}
                onChange={toggleSelectAll}
                className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Seleccionar todos ({files.length})
              </span>
            </label>
            
            {selectedFiles.length > 0 && (
              <span className="text-sm text-gray-600">
                {selectedFiles.length} archivo(s) seleccionado(s)
              </span>
            )}
          </div>

          {selectedFiles.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              Eliminar seleccionados
            </button>
          )}
        </div>
      )}

      {/* Grid de archivos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {files.map((file) => (
          <div key={file.id} className="relative">
            <MultimediaItem
              file={file}
              isSelected={selectedFiles.includes(file.id)}
              onSelect={toggleFileSelection}
              onUpdate={onUpdate}
              onDelete={onDelete}
              formatFileSize={formatFileSize}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultimediaGridComponent;