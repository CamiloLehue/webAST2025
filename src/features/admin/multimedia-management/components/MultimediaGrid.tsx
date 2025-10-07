import React, { useState } from "react";
import type {
  MultimediaFile,
  UpdateMultimediaRequest,
} from "../types/multimediaTypes";
import { useMultimediaImage } from "../hooks/useImageLoader";
import {
  TbPhoto,
  TbVideo,
  TbFileCode,
  TbFile,
  TbFolder,
  TbEye,
  TbEdit,
  TbTrash,
  TbX
} from "react-icons/tb";

interface MultimediaGridProps {
  files: MultimediaFile[];
  loading?: boolean;
  onUpdate: (
    id: string,
    request: UpdateMultimediaRequest
  ) => Promise<MultimediaFile>;
  onDelete: (id: string) => Promise<void>;
  onDeleteMultiple: (ids: string[]) => Promise<void>;
  formatFileSize: (bytes: number) => string;
}

interface MultimediaItemProps {
  file: MultimediaFile;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUpdate: (
    id: string,
    request: UpdateMultimediaRequest
  ) => Promise<MultimediaFile>;
  onDelete: (id: string) => Promise<void>;
  formatFileSize: (bytes: number) => string;
}

const MultimediaItem: React.FC<MultimediaItemProps> = ({
  file,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  formatFileSize,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    filename: file.filename,
    description: file.description || "",
    alt: file.alt || "",
    tags: file.tags.join(", "),
  });
  const [showPreview, setShowPreview] = useState(false);

  const { imageSrc, isLoading, hasError, retryLoad } = useMultimediaImage(file);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const tags = editForm.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);
      await onUpdate(file.id, {
        filename: editForm.filename,
        description: editForm.description || undefined,
        alt: editForm.alt || undefined,
        tags,
      });
      setIsEditing(false);
    } catch {
      // Error handling can be implemented here if needed
    }
  };

  const handleCancel = () => {
    setEditForm({
      filename: file.filename,
      description: file.description || "",
      alt: file.alt || "",
      tags: file.tags.join(", "),
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (confirm("¿Estás seguro de que quieres eliminar este archivo?")) {
      await onDelete(file.id);
    }
  };

  // Construir URL completa para la imagen
  const getImageUrl = () => {
    const baseUrl =
      import.meta.env.VITE_API_IMG_URL?.replace("/api", "") ||
      "http://10.30.7.14:8001";

    // Si la URL ya es absoluta, usarla directamente
    if (file.url.startsWith("http")) {
      return file.url;
    }

    // Si la URL empieza con /, es relativa al dominio
    if (file.url.startsWith("/")) {
      return `${baseUrl}${file.url}`;
    }

    // Si no, agregar / al inicio
    return `${baseUrl}/${file.url}`;
  };

  const getCategoryIcon = () => {
    switch (file.category) {
      case "image":
        return <TbPhoto className="w-4 h-4" />;
      case "video":
        return <TbVideo className="w-4 h-4" />;
      case "svg":
        return <TbFileCode className="w-4 h-4" />;
      case "document":
        return <TbFile className="w-4 h-4" />;
      default:
        return <TbFolder className="w-4 h-4" />;
    }
  };

  const getCategoryColor = () => {
    switch (file.category) {
      case "image":
        return "bg-blue-100 text-blue-800";
      case "video":
        return "bg-purple-100 text-purple-800";
      case "svg":
        return "bg-green-100 text-green-800";
      case "document":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderPreview = () => {
    if (file.category === "image" || file.category === "svg") {
      return (
        <div className="relative w-full h-32 bg-bg-100">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}

          {hasError ? (
            <div
              className="w-full h-32 bg-bg-200 flex items-center justify-center cursor-pointer"
              onClick={retryLoad}
            >
              <div className="text-center">
                <div className="text-3xl mb-2 flex justify-center">{getCategoryIcon()}</div>
                <div className="text-xs text-white-100">Error al cargar</div>
                <div className="text-xs text-blue-500">
                  Click para reintentar
                </div>
              </div>
            </div>
          ) : (
            <img
              src={imageSrc}
              alt={file.alt || file.filename}
              className={`w-full h-32 object-cover transition-opacity duration-200 ${
                isLoading ? "opacity-0" : "opacity-100"
              }`}
              loading="lazy"
            />
          )}
        </div>
      );
    } else if (file.category === "video") {
      return (
        <video
          src={imageSrc}
          className="w-full h-32 object-cover"
          muted
          preload="metadata"
        >
          Tu navegador no soporta el elemento video.
        </video>
      );
    } else {
      return (
        <div className="w-full h-32 bg-bg-300 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl mb-2 flex justify-center">{getCategoryIcon()}</div>
            <div className="text-xs text-white-100">{file.mime_type}</div>
          </div>
        </div>
      );
    }
  };

  return (
    <div
      className={`bg-bg-200 min-h-70 rounded-2xl overflow-hidden border-2 transition-all  border-t-white-100/20 ${
        isSelected
          ? "border-accent-100 shadow-md"
          : "border-bg-300 hover:border-bg-300"
      }`}
    >
      {/* Checkbox de selección */}
      <div className="absolute top-2 left-2 z-10">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(file.id)}
          className="w-4 h-4 text-blue-600 bg-bg-400 border-bg-300 rounded focus:ring-blue-500"
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
              className="p-2 bg-bg-200 rounded-full text-white-100 hover:text-blue-300"
              title="Ver preview"
            >
              <TbEye className="w-4 h-4" />
            </button>
            <button
              onClick={handleEdit}
              className="p-2 bg-bg-200 rounded-full text-white-100 hover:text-blue-300"
              title="Editar"
            >
              <TbEdit className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 bg-bg-200 rounded-full text-white-100 hover:text-red-300"
              title="Eliminar"
            >
              <TbTrash className="w-4 h-4" />
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
              onChange={(e) =>
                setEditForm({ ...editForm, filename: e.target.value })
              }
              className="w-full px-2 py-1 text-sm border border-bg-300 text-white-100 rounded"
              placeholder="Nombre del archivo"
            />
            <input
              type="text"
              value={editForm.description}
              onChange={(e) =>
                setEditForm({ ...editForm, description: e.target.value })
              }
              className="w-full px-2 py-1 text-sm border border-bg-300 text-white-100 rounded"
              placeholder="Descripción"
            />
            <input
              type="text"
              value={editForm.alt}
              onChange={(e) =>
                setEditForm({ ...editForm, alt: e.target.value })
              }
              className="w-full px-2 py-1 text-sm border border-bg-300 text-white-100 rounded"
              placeholder="Texto alternativo"
            />
            <input
              type="text"
              value={editForm.tags}
              onChange={(e) =>
                setEditForm({ ...editForm, tags: e.target.value })
              }
              className="w-full px-2 py-1 text-sm border border-bg-300 text-white-100 rounded"
              placeholder="Etiquetas (separadas por coma)"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="px-3 py-1 text-sm bg-bg-300 text-white rounded hover:bg-blue-700"
              >
                Guardar
              </button>
              <button
                onClick={handleCancel}
                className="px-3 py-1 text-sm bg-bg-100 text-white-100 rounded hover:bg-primary-100"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-white truncate flex-1">
                {file.filename}
              </h4>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor()}`}
              >
                {getCategoryIcon()} {file.category}
              </span>
            </div>

            {file.description && (
              <p className="text-xs text-white-100 mb-2 line-clamp-2">
                {file.description}
              </p>
            )}

            <div className="text-xs text-white-100/70 space-y-1">
              <div>Tamaño: {formatFileSize(file.size)}</div>
              <div>
                Subido: {new Date(file.created_at).toLocaleDateString()}
              </div>
              {file.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {file.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-bg-400 text-white-100"
                    >
                      {tag}
                    </span>
                  ))}
                  {file.tags.length > 3 && (
                    <span className="text-xs text-white-100/70">
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
                className="text-gray-500 hover:text-white-100"
              >
                <TbX className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4">
              {file.category === "image" || file.category === "svg" ? (
                <img
                  src={getImageUrl()}
                  alt={file.alt || file.filename}
                  className="max-w-full max-h-96 mx-auto"
                />
              ) : file.category === "video" ? (
                <video
                  src={getImageUrl()}
                  controls
                  className="max-w-full max-h-96 mx-auto"
                >
                  Tu navegador no soporta el elemento video.
                </video>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4 flex justify-center">{getCategoryIcon()}</div>
                  <p className="text-white-100">Vista previa no disponible</p>
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
  formatFileSize,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedFiles.length === files.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(files.map((file) => file.id));
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
          <div key={index} className="bg-bg-400 rounded-lg animate-pulse">
            <div className="h-32 bg-bg-200 rounded-t-lg"></div>
            <div className="p-3 space-y-2">
              <div className="h-4 bg-bg-200 rounded"></div>
              <div className="h-3 bg-bg-200 rounded w-3/4"></div>
              <div className="h-3 bg-bg-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4 flex justify-center">
          <TbFolder className="w-24 h-24" />
        </div>
        <h3 className="text-lg font-medium text-white-100 mb-2">
          No hay archivos multimedia
        </h3>
        <p className="text-white-100">
          Sube algunos archivos para comenzar a gestionar tu biblioteca
          multimedia.
        </p>
      </div>
    );
  }

  return (
    <div>
      {files.length > 0 && (
        <div className="flex items-center justify-between mb-4 p-3 bg-bg-200 rounded-lg">
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedFiles.length === files.length}
                ref={(input) => {
                  if (input)
                    input.indeterminate =
                      selectedFiles.length > 0 &&
                      selectedFiles.length < files.length;
                }}
                onChange={toggleSelectAll}
                className="w-4 h-4 text-blue-600 bg-bg-400/50 border-bg-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-white-100">
                Seleccionar todos ({files.length})
              </span>
            </label>

            {selectedFiles.length > 0 && (
              <span className="text-sm text-white-100/70">
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
