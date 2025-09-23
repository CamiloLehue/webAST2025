import React from 'react';
import { FiEdit2, FiTrash2, FiEye, FiCalendar, FiUser, FiTag, FiImage } from 'react-icons/fi';
import type { BlogPost, BlogCategory } from '../types/blogTypes';

interface BlogPostListProps {
  posts: BlogPost[];
  categories: BlogCategory[];
  onEdit: (post: BlogPost) => void;
  onDelete: (postId: string) => void;
  onView?: (post: BlogPost) => void;
  loading?: boolean;
}

export const BlogPostList: React.FC<BlogPostListProps> = ({
  posts,
  categories,
  onEdit,
  onDelete,
  onView,
  loading = false
}) => {
  const getCategoryName = (categorySlug: string) => {
    const category = categories.find(cat => cat.slug === categorySlug);
    return category?.name || categorySlug;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDelete = (post: BlogPost) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el post "${post.title}"?`)) {
      onDelete(post.id);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="h-6 bg-white-100 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-white-100 rounded w-1/2 mb-4"></div>
                <div className="h-20 bg-white-100 rounded w-full"></div>
              </div>
              <div className="ml-4">
                <div className="h-20 w-32 bg-white-100 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📝</div>
        <h3 className="text-lg font-medium text-bg-100 mb-2">No hay posts disponibles</h3>
        <p className="text-gray-500">Comienza creando tu primer post del blog.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <div key={post.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-center space-x-3 mb-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      post.isPublished
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {post.isPublished ? 'Publicado' : 'Borrador'}
                  </span>
                  
                  <span className="inline-flex items-center text-xs text-gray-500">
                    <FiTag className="w-3 h-3 mr-1" />
                    {getCategoryName(post.category)}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-bg-100 mb-2 line-clamp-2">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-bg-200 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Meta info */}
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center">
                    <FiUser className="w-4 h-4 mr-1" />
                    {post.author}
                  </span>
                  
                  <span className="flex items-center">
                    <FiCalendar className="w-4 h-4 mr-1" />
                    {formatDate(post.publishedAt || post.createdAt)}
                  </span>
                  
                  {post.tags.length > 0 && (
                    <span className="flex items-center">
                      <FiTag className="w-4 h-4 mr-1" />
                      {post.tags.slice(0, 2).join(', ')}
                      {post.tags.length > 2 && ` +${post.tags.length - 2}`}
                    </span>
                  )}
                </div>

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.slice(0, 4).map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 4 && (
                      <span className="px-2 py-1 bg-white text-bg-200 text-xs rounded-full">
                        +{post.tags.length - 4} más
                      </span>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center space-x-3">
                  {onView && (
                    <button
                      onClick={() => onView(post)}
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      <FiEye className="w-4 h-4 mr-1" />
                      Ver
                    </button>
                  )}
                  
                  <button
                    onClick={() => onEdit(post)}
                    className="inline-flex items-center text-sm text-bg-200 hover:text-gray-800"
                  >
                    <FiEdit2 className="w-4 h-4 mr-1" />
                    Editar
                  </button>
                  
                  <button
                    onClick={() => handleDelete(post)}
                    className="inline-flex items-center text-sm text-red-600 hover:text-red-800"
                  >
                    <FiTrash2 className="w-4 h-4 mr-1" />
                    Eliminar
                  </button>
                </div>
              </div>

              {/* Featured Image */}
              {post.featuredImage && (
                <div className="ml-6 flex-shrink-0">
                  <div className="w-32 h-24 rounded-lg overflow-hidden bg-white">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}
              
              {!post.featuredImage && (
                <div className="ml-6 flex-shrink-0">
                  <div className="w-32 h-24 rounded-lg bg-white flex items-center justify-center">
                    <FiImage className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};