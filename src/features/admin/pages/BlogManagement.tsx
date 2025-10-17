import React, { useState } from "react";
import { useBlogManagement } from "../blog-management/hooks/useBlogManagement";
import {
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiEye,
  FiCalendar,
  FiUser,
  FiFileText,
  FiRefreshCw,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const BlogManagement: React.FC = () => {
  const { blogPosts, deleteBlogPost, loading, error, refresh } = useBlogManagement();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "draft"
  >("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredPosts = (blogPosts || [])
    .filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "published" && post.isPublished) ||
        (statusFilter === "draft" && !post.isPublished);
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.updatedAt || a.createdAt).getTime();
      const dateB = new Date(b.publishedAt || b.updatedAt || b.createdAt).getTime();
      return dateB - dateA;
    });

  const handleDeletePost = (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este post?")) {
      deleteBlogPost(id);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setIsRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6 p-5 bg-bg-200 min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Gestión de Blog</h2>
          <p className="mt-1 text-white-100/70">
            Administra los posts y contenido del blog
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center px-4 py-2 bg-bg-300 text-white text-sm font-medium rounded-md hover:bg-bg-400 disabled:opacity-50"
            title="Actualizar lista"
          >
            <FiRefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          <Link
            to="/admin/blog/new"
            className="inline-flex items-center px-4 py-2 bg-accent-100 text-white text-sm font-medium rounded-md hover:bg-accent-200"
          >
            <FiPlus className="mr-2 h-4 w-4" />
            Nuevo Post
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="text-red-600">
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="bg-bg-200 min-h-screen h-full rounded-lg shadow p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-bg-300 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-bg-300 rounded"></div>
              <div className="h-4 bg-bg-300 rounded w-5/6"></div>
              <div className="h-4 bg-bg-300 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-bg-100 p-4 rounded-lg shadow space-y-4 sm:space-y-0 sm:flex sm:items-center sm:space-x-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 text-white placeholder:text-white-100/50 py-2 border border-bg-300 bg-bg-400 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
              />
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as "all" | "published" | "draft"
                  )
                }
                className="px-3 py-2 border border-bg-300 bg-bg-400 text-white rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
              >
                <option value="all">Todos los posts</option>
                <option value="published">Publicados</option>
                <option value="draft">Borradores</option>
              </select>
            </div>
          </div>

          <div className="bg-bg-300 shadow rounded-lg">
            {filteredPosts.length === 0 ? (
              <div className="p-12 text-center">
                <FiFileText className="mx-auto h-12 w-12 text-white" />
                <h3 className="mt-2 text-sm font-medium text-white">
                  No hay posts
                </h3>
                <p className="mt-1 text-sm text-white-100/70">
                  Comienza creando tu primer post del blog.
                </p>
                <div className="mt-6">
                  <Link
                    to="/admin/blog/new"
                    className="inline-flex items-center px-4 py-2 bg-accent-100 text-white text-sm font-medium rounded-md hover:bg-accent-200"
                  >
                    <FiPlus className="mr-2 h-4 w-4" />
                    Nuevo Post
                  </Link>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-bg-200">
                {filteredPosts.map((post) => (
                  <div key={post.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-medium text-white">
                            {post.title}
                          </h3>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              post.isPublished
                                ? "bg-green-950 text-green-200"
                                : "bg-yellow-100/50 text-yellow-100"
                            }`}
                          >
                            {post.isPublished ? "Publicado" : "Borrador"}
                          </span>
                        </div>

                        <p className="text-white-100/70 mb-3 line-clamp-2">
                          {post.excerpt}
                        </p>

                        <div className="flex items-center space-x-4 text-sm text-white-100/70">
                          <div className="flex items-center">
                            <FiUser className="mr-1 h-4 w-4" />
                            {post.author}
                          </div>
                          <div className="flex items-center">
                            <FiCalendar className="mr-1 h-4 w-4" />
                            {formatDate(post.createdAt)}
                          </div>
                          <span className="px-2 py-1 bg-bg-400 text-white-100/70 rounded">
                            {post.category}
                          </span>
                        </div>

                        {post.tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {post.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="inline-block px-2 py-1 text-xs bg-bg-200 text-white-100/50 rounded"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <Link
                          to={`/noticias/${post.slug}`}
                          target="_blank"
                          className="p-2 text-white hover:text-white-100/70"
                          title="Ver post"
                        >
                          <FiEye className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/admin/blog/edit/${post.id}`}
                          className="p-2 text-white hover:text-white-100/70"
                          title="Editar post"
                        >
                          <FiEdit2 className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="p-2 text-white hover:text-red-600"
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
      )}
    </div>
  );
};

export default BlogManagement;
