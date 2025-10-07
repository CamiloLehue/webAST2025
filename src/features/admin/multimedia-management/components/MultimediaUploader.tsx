import React, { useState, useRef } from "react";
import type {
  CreateMultimediaRequest,
  MultimediaCategory,
  UploadProgress,
} from "../types/multimediaTypes";
import {
  TbPhoto,
  TbVideo,
  TbFileCode,
  TbFile,
  TbFolder,
  TbX,
  TbCheck,
  TbAlertCircle
} from "react-icons/tb";

interface MultimediaUploaderProps {
  onUpload: (files: CreateMultimediaRequest[]) => Promise<void>;
  uploadProgress: UploadProgress[];
  loading?: boolean;
}

const MultimediaUploaderComponent: React.FC<MultimediaUploaderProps> = ({
  onUpload,
  uploadProgress,
  loading = false,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [defaultCategory, setDefaultCategory] =
    useState<MultimediaCategory>("image");
  const [defaultTags, setDefaultTags] = useState<string>("");
  const [defaultDescription, setDefaultDescription] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      setSelectedFiles((prev) => [...prev, ...files]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    const tags = defaultTags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);

    const uploadRequests: CreateMultimediaRequest[] = selectedFiles.map(
      (file) => ({
        file,
        category: defaultCategory,
        tags: tags.length > 0 ? tags : undefined,
        description: defaultDescription || undefined,
      })
    );

    try {
      await onUpload(uploadRequests);
      setSelectedFiles([]);
      setDefaultTags("");
      setDefaultDescription("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch {
      // Error handling can be implemented here if needed
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileTypeIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <TbPhoto className="w-5 h-5" />;
    if (file.type.startsWith("video/")) return <TbVideo className="w-5 h-5" />;
    if (file.type === "image/svg+xml") return <TbFileCode className="w-5 h-5" />;
    return <TbFile className="w-5 h-5" />;
  };

  return (
    <div className="bg-bg-100 rounded-lg shadow-sm border border-bg-300 p-6 mb-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        Subir Archivos Multimedia
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label
            htmlFor="defaultCategory"
            className="block text-sm font-medium text-white-100 mb-1"
          >
            Categoría por defecto
          </label>
          <select
            id="defaultCategory"
            value={defaultCategory}
            onChange={(e) =>
              setDefaultCategory(e.target.value as MultimediaCategory)
            }
            className="w-full px-3 py-2 border border-bg-300 bg-bg-400 text-white placeholder:text-white-100/70 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          >
            <option value="image">Imagen</option>
            <option value="video">Video</option>
            <option value="svg">SVG</option>
            <option value="document">Documento</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="defaultTags"
            className="block text-sm font-medium text-white-100 mb-1"
          >
            Etiquetas (separadas por coma)
          </label>
          <input
            type="text"
            id="defaultTags"
            value={defaultTags}
            onChange={(e) => setDefaultTags(e.target.value)}
            placeholder="web, banner, hero..."
            className="w-full px-3 py-2 border border-bg-300 bg-bg-400 text-white placeholder:text-white-100/70 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          />
        </div>

        <div>
          <label
            htmlFor="defaultDescription"
            className="block text-sm font-medium text-white-100 mb-1"
          >
            Descripción por defecto
          </label>
          <input
            type="text"
            id="defaultDescription"
            value={defaultDescription}
            onChange={(e) => setDefaultDescription(e.target.value)}
            placeholder="Descripción opcional..."
            className="w-full px-3 py-2 border border-bg-300 bg-bg-400 text-white placeholder:text-white-100/70 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          />
        </div>
      </div>

      {/* Zona de arrastrar y soltar */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? "border-blue-400 bg-blue-50"
            : "border-bg-300 bg-bg-400 text-white placeholder:text-white-100/70 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,.svg,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={loading}
        />

        <div className="space-y-2">
          <div className="text-4xl flex justify-center">
            <TbFolder className="w-16 h-16" />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-900">
              Arrastra archivos aquí o haz clic para seleccionar
            </p>
            <p className="text-sm text-white-100/70">
              Soporta imágenes, videos, SVG y documentos
            </p>
          </div>
        </div>
      </div>

      {/* Lista de archivos seleccionados */}
      {selectedFiles.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-white mb-2">
            Archivos seleccionados ({selectedFiles.length})
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-2 bg-bg-300 hover:bg-bg-400 transition-colors duration-300 rounded border"
              >
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <span className="text-lg">{getFileTypeIcon(file)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white-100 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-white-100/70">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700 p-1"
                  disabled={loading}
                >
                  <TbX className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progreso de subida */}
      {uploadProgress.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-white mb-2">
            Progreso de subida
          </h4>
          <div className="space-y-2">
            {uploadProgress.map((progress, index) => (
              <div key={progress.fileId} className="space-y-1">
                <div className="flex justify-between text-xs text-white-100">
                  <span>Archivo {index + 1}</span>
                  <span>
                    {progress.status === "completed" && (
                      <span className="flex items-center gap-1">
                        <TbCheck className="w-4 h-4 text-green-500" />
                        Completado
                      </span>
                    )}
                    {progress.status === "uploading" && `${progress.progress}%`}
                    {progress.status === "error" && (
                      <span className="flex items-center gap-1">
                        <TbAlertCircle className="w-4 h-4 text-red-500" />
                        Error
                      </span>
                    )}
                  </span>
                </div>
                <div className="w-full bg-bg-400 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      progress.status === "completed"
                        ? "bg-green-500"
                        : progress.status === "error"
                        ? "bg-red-500"
                        : "bg-blue-500"
                    }`}
                    style={{ width: `${progress.progress}%` }}
                  />
                </div>
                {progress.error && (
                  <p className="text-xs text-red-600">{progress.error}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botón de subir */}
      {selectedFiles.length > 0 && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleUpload}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Subiendo..."
              : `Subir ${selectedFiles.length} archivo(s)`}
          </button>
        </div>
      )}
    </div>
  );
};

export default MultimediaUploaderComponent;
