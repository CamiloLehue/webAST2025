import React, { useState } from 'react';
import { useContent } from '../../../hooks/useContent';
import { FiEdit2, FiTrash2, FiPlus, FiCopy } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const PageManagement: React.FC = () => {
  const { pages, deletePage } = useContent();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  const filteredPages = pages.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'published' && page.isPublished) ||
                         (statusFilter === 'draft' && !page.isPublished);
    return matchesSearch && matchesStatus;
  });

  const handleDeletePage = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta página?')) {
      deletePage(id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Páginas</h2>
          <p className="mt-1 text-gray-600">
            Administra las páginas personalizadas del sitio web
          </p>
        </div>
        <Link
          to="/admin/pages/new"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'published' | 'draft')}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
              <div className="mx-auto h-12 w-12 text-gray-400">
                📄
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay páginas</h3>
              <p className="mt-1 text-sm text-gray-500">
                Comienza creando tu primera página personalizada.
              </p>
              <div className="mt-6">
                <Link
                  to="/admin/pages/new"
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
                >
                  <FiPlus className="mr-2 h-4 w-4" />
                  Nueva Página
                </Link>
              </div>
            </div>
          </div>
        ) : (
          filteredPages.map((page) => (
            <div key={page.id} className="bg-white rounded-lg shadow overflow-hidden">
              {/* Page Preview */}
              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">📄</div>
                  <p className="text-sm text-gray-500">Vista previa</p>
                </div>
              </div>

              {/* Page Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {page.title}
                  </h3>
                  <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                    page.isPublished 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {page.isPublished ? 'Publicado' : 'Borrador'}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 flex items-center">
                    <FiCopy className="mr-1 h-3 w-3" />
                    /{page.slug}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Actualizado el {formatDate(page.updatedAt)}
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    {page.content.length} bloques de contenido
                  </p>
                  <p className="text-xs text-gray-500">
                    Autor: {page.author}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <Link
                    to={`/${page.slug}`}
                    target="_blank"
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    Ver página
                  </Link>
                  
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/admin/pages/edit/${page.id}`}
                      className="p-2 text-gray-400 hover:text-gray-600"
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
        <h3 className="text-lg font-medium text-gray-900 mb-4">Plantillas Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/pages/new?template=landing"
            className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
          >
            <h4 className="font-medium text-gray-900">Página de Aterrizaje</h4>
            <p className="text-sm text-gray-600 mt-1">
              Hero, características y call-to-action
            </p>
          </Link>
          <Link
            to="/admin/pages/new?template=about"
            className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
          >
            <h4 className="font-medium text-gray-900">Sobre Nosotros</h4>
            <p className="text-sm text-gray-600 mt-1">
              Historia, equipo y valores
            </p>
          </Link>
          <Link
            to="/admin/pages/new?template=contact"
            className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
          >
            <h4 className="font-medium text-gray-900">Contacto</h4>
            <p className="text-sm text-gray-600 mt-1">
              Formulario y información de contacto
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PageManagement;