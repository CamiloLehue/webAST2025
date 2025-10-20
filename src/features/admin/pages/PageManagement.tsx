import React, { useState, useEffect } from "react";
import { usePageList } from "../page-management/hooks/usePageList";
import { PageService } from "../page-management/services/pageService";
import { FiEdit2, FiTrash2, FiPlus, FiLoader } from "react-icons/fi";
import { Link } from "react-router-dom";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import { useToast } from "../../../hooks/useToast";

const PageManagement: React.FC = () => {
  const { pageItems, loading, error, filterPageItems, removePageItem } =
    usePageList();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "draft"
  >("all");
  const [filteredPages, setFilteredPages] = useState(pageItems);
  const [confirmDelete, setConfirmDelete] = useState<{
    show: boolean;
    pageId: string;
    pageTitle: string;
  } | null>(null);

  useEffect(() => {
    const filtered = filterPageItems({
      search: searchTerm || undefined,
      status: statusFilter,
      sortBy: "updated",
      sortOrder: "desc",
    });
    setFilteredPages(filtered);
  }, [searchTerm, statusFilter, pageItems, filterPageItems]);

  const handleDeletePage = (id: string, title: string) => {
    setConfirmDelete({ show: true, pageId: id, pageTitle: title });
  };

  const confirmDeletePage = async () => {
    if (confirmDelete) {
      try {
        await PageService.deleteCustomPage(confirmDelete.pageId);
        removePageItem(confirmDelete.pageId);
        setConfirmDelete(null);
        showToast("Página eliminada exitosamente", "success");
      } catch (err) {
        console.error("Error al eliminar la página:", err);
        showToast("Error al eliminar la página", "error");
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
      <div className="flex justify-center items-center h-full  bg-bg-200">
        <div className="flex items-center space-x-2">
          <FiLoader className="animate-spin h-5 w-5 text-accent-100" />
          <span className="text-white-100/70">Cargando páginas...</span>
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
    <div className="space-y-2 p-1 bg-bg-200 min-h-full">
      <div className="flex justify-between items-center  gap-5 bg-bg-100 px-4 ">
        <div>
          <h2 className="text-2xl font-bold text-white text-center text-nowrap">
            Gestión de Páginas
          </h2>
        </div>
        <div className="bg-bg-100 w-full p-4 rounded-lg shadow space-y-4 sm:space-y-0 sm:flex sm:items-center sm:space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar páginas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-white bg-bg-400 placeholder:text-white-100/70 px-3 py-2 border border-bg-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "all" | "published" | "draft")
              }
              className="px-3 py-2 border border-bg-300 text-white bg-bg-400 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
            >
              <option value="all">Todas las páginas</option>
              <option value="published">Publicadas</option>
              <option value="draft">Borradores</option>
            </select>
          </div>
        </div>
        <Link
          to="/admin/pages/new"
          className="inline-flex text-nowrap items-center px-4 py-2 bg-accent-100 text-white text-sm font-medium rounded-md hover:bg-accent-200"
        >
          <FiPlus className="mr-2 h-4 w-4" />
          Nueva Página
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {filteredPages.length === 0 ? (
          <div className="col-span-full">
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400">📄</div>
              <h3 className="mt-2 text-sm font-medium text-white">
                No hay páginas
              </h3>
              <p className="mt-1 text-sm text-white-100/70">
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
              className="bg-gradient-to-b from-bg-400 to-transparent border border-bg-300 shadow overflow-hidden "
            >
              <div className="flex justify-between items-center space-x-2 p-3 bg-bg-400">
                <span
                  className={`ml-2 px-4 py-1 text-xs font-medium rounded-full ${
                    page.isPublished
                      ? "bg-green-950 border-t border-t-green-900 shadow text-green-400"
                      : "bg-yellow-100/20 text-yellow-100 border-t border-t-yellow-100/20 shadow"
                  }`}
                >
                  {page.isPublished ? "Publicado" : "Borrador"}
                </span>
                <div className="flex items-center justify-center space-x-1">
                  <Link
                    to={`/admin/pages/edit/${page.id}`}
                    className="p-2 text-white-100/80 hover:text-white"
                    title="Editar página"
                  >
                    <FiEdit2 className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDeletePage(page.id, page.title)}
                    className="p-2 text-white-100/80 hover:text-primary-100"
                    title="Eliminar página"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="p-2">
                <div className="flex items-center justify-center mb-2">
                  <h3 className="text-lg font-bold text-white-100 truncate border-b-4 border-white/15 px-5 ">
                    {page.title}
                  </h3>
                </div>

                <div className="mb-4 p-3 flex flex-col justify-center items-center space-y-0.5 bg-bg-200 rounded-2xl">
                  <p className="text-sm text-white-100/70 px-4 bg-bg-200">
                    <span className="text-sky-300">{page.contentCount}</span>{" "}
                    bloques de contenido
                  </p>
                  <p className="text-xs text-white-100/70 mt-1 text-nowrap">
                    <span className="text-amber-200">Actualizado</span> el{" "}
                    {formatDate(page.updatedAt)}
                  </p>
                  <p className="text-xs text-white-100/70 text-nowrap ">
                    <span className="text-lime-100">Creado</span> el{" "}
                    {formatDate(page.createdAt)}
                  </p>
                </div>

                <div className="flex items-center justify-center">
                  <Link
                    to={`/${page.slug}`}
                    target="_blank"
                    className="text-white/80 border-t border-bg-300 bg-bg-400 rounded-full px-4 py-2 hover:text-white-100/70 transition-colors duration-300 text-sm font-light"
                  >
                    Ver página en vivo
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* <div className="bg-bg-100 rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-white mb-4">
          Plantillas Rápidas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/pages/new?template=landing-page"
            className="p-4 border border-bg-300 rounded-lg hover:border-bg-200 hover:bg-bg-400 transition-colors"
          >
            <h4 className="font-medium text-white">Página de Aterrizaje</h4>
            <p className="text-sm text-white-100/70 mt-1">
              Hero, características y call-to-action
            </p>
          </Link>
          <Link
            to="/admin/pages/new?template=about-page"
            className="p-4 border border-bg-300 rounded-lg hover:border-bg-200 hover:bg-bg-400 transition-colors"
          >
            <h4 className="font-medium text-white">Sobre Nosotros</h4>
            <p className="text-sm text-white-100/70 mt-1">
              Historia, equipo y valores
            </p>
          </Link>
          <Link
            to="/admin/pages/new?template=contact-page"
            className="p-4 border border-bg-300 rounded-lg hover:border-bg-200 hover:bg-bg-400 transition-colors"
          >
            <h4 className="font-medium text-white">Contacto</h4>
            <p className="text-sm text-white-100/70 mt-1">
              Formulario y información de contacto
            </p>
          </Link>
        </div>
      </div> */}

      <ConfirmDialog
        isOpen={confirmDelete?.show ?? false}
        title="Eliminar Página"
        message={`¿Está seguro de que desea eliminar la página "${confirmDelete?.pageTitle}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
        onConfirm={confirmDeletePage}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};

export default PageManagement;
