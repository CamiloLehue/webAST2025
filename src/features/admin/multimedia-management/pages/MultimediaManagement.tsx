import React, { useState, useEffect, useCallback } from "react";
import type {
  MultimediaFilters,
  CreateMultimediaRequest,
} from "../types/multimediaTypes";
import { useMultimediaManagement } from "../hooks/useMultimediaManagement";
import {
  MultimediaFilters as MultimediaFiltersComponent,
  MultimediaUploader,
  MultimediaGrid,
  Pagination,
} from "../components";

const MultimediaManagement: React.FC = () => {
  const {
    files,
    loading,
    error,
    uploadProgress,
    totalFiles,
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    filters,
    loadFiles,
    uploadMultipleFiles,
    updateFile,
    deleteFile,
    deleteMultipleFiles,
    refreshData,
    goToPage,
    formatFileSize,
  } = useMultimediaManagement();

  const [showUploader, setShowUploader] = useState(false);

  // Solo cargar datos una vez al montar el componente
  useEffect(() => {
    refreshData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intencionalmente vacío para ejecutar solo al montar

  const handleFiltersChange = useCallback(
    (newFilters: MultimediaFilters) => {
      loadFiles(newFilters);
    },
    [loadFiles]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      goToPage(page);
    },
    [goToPage]
  );

  const handleUpload = useCallback(
    async (fileRequests: CreateMultimediaRequest[]) => {
      await uploadMultipleFiles(fileRequests);
      setShowUploader(false);
    },
    [uploadMultipleFiles]
  );

  const handleToggleUploader = () => {
    setShowUploader(!showUploader);
  };

  return (
    <div className="min-h-screen bg-bg-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-white">
                Gestión Multimedia
              </h1>
              <p className="mt-1 text-sm text-white-100">
                Administra tu biblioteca de archivos multimedia
              </p>
            </div>
            <div className="flex  sm:flex-row gap-1 w-full justify-center items-end">
              <button
                onClick={handleToggleUploader}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white transition-colors ${
                  showUploader
                    ? "bg-bg-100 hover:bg-bg-400"
                    : "bg-accent-100 hover:bg-accent-200"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {showUploader ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  )}
                </svg>
                {showUploader ? "Cerrar subida" : "Subir archivos"}
              </button>
              <button
                onClick={refreshData}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-bg-300 text-sm font-medium rounded-md text-white-100 bg-bg-300 hover:bg-bg-400  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Actualizar
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Uploader */}
        {showUploader && (
          <MultimediaUploader
            onUpload={handleUpload}
            uploadProgress={uploadProgress}
            loading={loading}
          />
        )}

        {/* Filtros */}
        <MultimediaFiltersComponent
          onFiltersChange={handleFiltersChange}
          availableTags={[]}
          loading={loading}
        />

        {/* Información de resultados */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-white-100">
            {loading ? (
              "Cargando..."
            ) : (
              <>
                Mostrando{" "}
                <span className="font-medium">
                  {(currentPage - 1) * (filters.limit || 12) + 1}
                </span>{" "}
                a{" "}
                <span className="font-medium">
                  {Math.min(currentPage * (filters.limit || 12), totalFiles)}
                </span>{" "}
                de <span className="font-medium">{totalFiles}</span> archivo(s)
              </>
            )}
          </div>
        </div>

        <div className="bg-bg-300 rounded-lg shadow-sm border border-bg-300 p-6 mb-6">
          <MultimediaGrid
            files={files}
            loading={loading}
            onUpdate={updateFile}
            onDelete={deleteFile}
            onDeleteMultiple={deleteMultipleFiles}
            formatFileSize={formatFileSize}
          />
        </div>

        {/* Paginación */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
          onPageChange={handlePageChange}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default MultimediaManagement;
