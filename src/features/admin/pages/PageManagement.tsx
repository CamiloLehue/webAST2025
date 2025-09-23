import React, { useState, useEffect } from "react";
import { usePageManagement } from "../page-management/hooks/usePageManagement";
import { FiEdit2, FiTrash2, FiPlus, FiCopy, FiLoader } from "react-icons/fi";
import { Link } from "react-router-dom";

const PageManagement: React.FC = () => {
  const {
    customPages: pages,
    loading,
    error,
    deleteCustomPage,
    filterPages,
  } = usePageManagement();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "draft"
  >("all");
  const [filteredPages, setFilteredPages] = useState(pages);

  useEffect(() => {
    const applyFilters = async () => {
      if (searchTerm || statusFilter !== "all") {
        const filtered = await filterPages({
          search: searchTerm || undefined,
          status: statusFilter,
          sortBy: "updated",
          sortOrder: "desc",
        });
        setFilteredPages(filtered);
      } else {
        setFilteredPages(pages);
      }
    };

    applyFilters();
  }, [searchTerm, statusFilter, pages, filterPages]);

  const handleDeletePage = async (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta página?")) {
      try {
        await deleteCustomPage(id);
      } catch (err) {
        console.error("Error al eliminar la página:", err);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex items-center space-x-2">
          <FiLoader className="animate-spin h-5 w-5 text-accent-100" />
          <span className="text-bg-200">Cargando páginas...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error al cargar las páginas
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-bg-100">
            Gestión de Páginas
          </h2>
          <p className="mt-1 text-bg-200">
            Administra las páginas personalizadas del sitio web
          </p>
        </div>
        <Link
          to="/admin/pages/new"
          className="inline-flex items-center px-4 py-2 bg-accent-100 text-white text-sm font-medium rounded-md hover:bg-accent-200"
        >
          <FiPlus className="mr-2 h-4 w-4" />
          Nueva Página
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4 sm:space-y-0 sm:flex sm:items-center sm:space-x-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar páginas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
          />
        </div>
        <div>
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "all" | "published" | "draft")
            }
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
          >
            <option value="all">Todas las páginas</option>
            <option value="published">Publicadas</option>
            <option value="draft">Borradores</option>
          </select>
        </div>
      </div>

      {/* Pages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPages.length === 0 ? (
          <div className="col-span-full">
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400">📄</div>
              <h3 className="mt-2 text-sm font-medium text-bg-100">
                No hay páginas
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Comienza creando tu primera página personalizada.
              </p>
              <div className="mt-6">
                <Link
                  to="/admin/pages/new"
                  className="inline-flex items-center px-4 py-2 bg-accent-100 text-white text-sm font-medium rounded-md hover:bg-accent-200"
                >
                  <FiPlus className="mr-2 h-4 w-4" />
                  Nueva Página
                </Link>
              </div>
            </div>
          </div>
        ) : (
          filteredPages.map((page) => (
            <div
              key={page.id}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              {/* Page Preview */}
              <div className="aspect-video bg-white flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">📄</div>
                  <p className="text-sm text-gray-500">Vista previa</p>
                </div>
              </div>

              {/* Page Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-medium text-bg-100 truncate">
                    {page.title}
                  </h3>
                  <span
                    className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                      page.isPublished
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {page.isPublished ? "Publicado" : "Borrador"}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-bg-200 flex items-center">
                    <FiCopy className="mr-1 h-3 w-3" />/{page.slug}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Actualizado el {formatDate(page.updatedAt)}
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-bg-200">
                    {page.content.length} bloques de contenido
                  </p>
                  <p className="text-xs text-gray-500">
                    Creado el {formatDate(page.createdAt)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <Link
                    to={`/${page.slug}`}
                    target="_blank"
                    className="text-accent-100 hover:text-accent-200 text-sm font-medium"
                  >
                    Ver página
                  </Link>

                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/admin/pages/edit/${page.id}`}
                      className="p-2 text-gray-400 hover:text-bg-200"
                      title="Editar página"
                    >
                      <FiEdit2 className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDeletePage(page.id)}
                      className="p-2 text-gray-400 hover:text-red-600"
                      title="Eliminar página"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Templates */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-bg-100 mb-4">
          Plantillas Rápidas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/pages/new?template=landing-page"
            className="p-4 border border-white-100 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
          >
            <h4 className="font-medium text-bg-100">Página de Aterrizaje</h4>
            <p className="text-sm text-bg-200 mt-1">
              Hero, características y call-to-action
            </p>
          </Link>
          <Link
            to="/admin/pages/new?template=about-page"
            className="p-4 border border-white-100 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
          >
            <h4 className="font-medium text-bg-100">Sobre Nosotros</h4>
            <p className="text-sm text-bg-200 mt-1">
              Historia, equipo y valores
            </p>
          </Link>
          <Link
            to="/admin/pages/new?template=contact-page"
            className="p-4 border border-white-100 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
          >
            <h4 className="font-medium text-bg-100">Contacto</h4>
            <p className="text-sm text-bg-200 mt-1">
              Formulario y información de contacto
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PageManagement;
