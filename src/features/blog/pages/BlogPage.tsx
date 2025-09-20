import React from 'react';
import { useContent } from '../../../hooks/useContent';
import { Link } from 'react-router-dom';
import { FiCalendar, FiUser, FiArrowRight } from 'react-icons/fi';

const BlogPage: React.FC = () => {
  const { blogPosts } = useContent();

  const publishedPosts = blogPosts
    .filter(post => post.isPublished)
    .sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime());

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const categories = [...new Set(publishedPosts.map(post => post.category))].filter(Boolean);

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              Nuestro Blog
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Mantente al día con las últimas noticias y artículos
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {publishedPosts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  No hay posts publicados
                </h2>
                <p className="text-gray-600">
                  ¡Mantente al pendiente para ver nuestros próximos artículos!
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {publishedPosts.map((post) => (
                  <article key={post.id} className="bg-white rounded-lg shadow overflow-hidden">
                    {post.featuredImage && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="p-6">
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center">
                          <FiCalendar className="mr-1 h-4 w-4" />
                          {formatDate(post.publishedAt || post.createdAt)}
                        </div>
                        <div className="flex items-center">
                          <FiUser className="mr-1 h-4 w-4" />
                          {post.author}
                        </div>
                        {post.category && (
                          <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs font-medium">
                            {post.category}
                          </span>
                        )}
                      </div>

                      <h2 className="text-2xl font-bold text-gray-900 mb-3">
                        <Link 
                          to={`/blog/${post.slug}`}
                          className="hover:text-indigo-600 transition-colors"
                        >
                          {post.title}
                        </Link>
                      </h2>

                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>

                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <Link
                        to={`/blog/${post.slug}`}
                        className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        Leer más
                        <FiArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="mt-12 lg:mt-0">
            <div className="space-y-8">
              {/* Categories */}
              {categories.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Categorías
                  </h3>
                  <div className="space-y-2">
                    {categories.map((category) => {
                      const count = publishedPosts.filter(post => post.category === category).length;
                      return (
                        <div key={category} className="flex items-center justify-between">
                          <span className="text-gray-700">{category}</span>
                          <span className="text-gray-500 text-sm">({count})</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Recent Posts */}
              {publishedPosts.length > 3 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Posts Recientes
                  </h3>
                  <div className="space-y-4">
                    {publishedPosts.slice(0, 3).map((post) => (
                      <div key={post.id}>
                        <Link
                          to={`/blog/${post.slug}`}
                          className="block hover:text-indigo-600 transition-colors"
                        >
                          <h4 className="font-medium text-gray-900 line-clamp-2 mb-1">
                            {post.title}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {formatDate(post.publishedAt || post.createdAt)}
                          </p>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;