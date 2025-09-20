import React, { useState } from 'react';
import { useContent } from '../../../hooks/useContent';
import { FiEdit2, FiTrash2, FiPlus, FiEye, FiCalendar, FiUser, FiFileText } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const BlogManagement: React.FC = () => {
  const { blogPosts, deleteBlogPost } = useContent();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'published' && post.isPublished) ||
                         (statusFilter === 'draft' && !post.isPublished);
    return matchesSearch && matchesStatus;
  });

  const handleDeletePost = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este post?')) {
      deleteBlogPost(id);
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
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Blog</h2>
          <p className="mt-1 text-gray-600">
            Administra los posts y contenido del blog
          </p>
        </div>
        <Link
          to="/admin/blog/new"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
        >
          <FiPlus className="mr-2 h-4 w-4" />
          Nuevo Post
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4 sm:space-y-0 sm:flex sm:items-center sm:space-x-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar posts..."
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
            <option value="all">Todos los posts</option>
            <option value="published">Publicados</option>
            <option value="draft">Borradores</option>
          </select>
        </div>
      </div>

      {/* Posts List */}
      <div className="bg-white shadow rounded-lg">
        {filteredPosts.length === 0 ? (
          <div className="p-12 text-center">
            <FiFileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay posts</h3>
            <p className="mt-1 text-sm text-gray-500">
              Comienza creando tu primer post del blog.
            </p>
            <div className="mt-6">
              <Link
                to="/admin/blog/new"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
              >
                <FiPlus className="mr-2 h-4 w-4" />
                Nuevo Post
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredPosts.map((post) => (
              <div key={post.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {post.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        post.isPublished 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.isPublished ? 'Publicado' : 'Borrador'}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <FiUser className="mr-1 h-4 w-4" />
                        {post.author}
                      </div>
                      <div className="flex items-center">
                        <FiCalendar className="mr-1 h-4 w-4" />
                        {formatDate(post.createdAt)}
                      </div>
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded">
                        {post.category}
                      </span>
                    </div>
                    
                    {post.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {post.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Link
                      to={`/blog/${post.slug}`}
                      target="_blank"
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="Ver post"
                    >
                      <FiEye className="h-4 w-4" />
                    </Link>
                    <Link
                      to={`/admin/blog/edit/${post.id}`}
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="Editar post"
                    >
                      <FiEdit2 className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="p-2 text-gray-400 hover:text-red-600"
                      title="Eliminar post"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogManagement;