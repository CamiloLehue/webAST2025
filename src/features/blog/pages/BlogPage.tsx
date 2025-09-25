import React from "react";
import { useBlogManagement } from "../../admin/blog-management/hooks/useBlogManagement";
import { Link } from "react-router-dom";
import { FiCalendar, FiUser, FiArrowRight } from "react-icons/fi";
import NewsHeroSection from "../../../components/hero/NewsHeroSection";

const BlogPage: React.FC = () => {
  const { blogPosts, loading, error } = useBlogManagement();

  const publishedPosts = (blogPosts || [])
    .filter((post) => post.isPublished)
    .sort(
      (a, b) =>
        new Date(b.publishedAt || b.createdAt).getTime() -
        new Date(a.publishedAt || a.createdAt).getTime()
    );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const categories = [
    ...new Set(publishedPosts.map((post) => post.category)),
  ].filter(Boolean);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-bg-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-bg-300 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-bg-100 rounded-lg p-6">
                  <div className="h-48 bg-bg-300 rounded mb-4"></div>
                  <div className="h-4 bg-bg-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-bg-300 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-bg-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-red-600">
              <h3 className="text-lg font-medium">
                Error al cargar las noticias
              </h3>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen ">
      <NewsHeroSection posts={publishedPosts} />
      <div className="bg-white-100 ">
        <div className="max-w-7xl mx-auto px-4  py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-bg-100 ">
              Últimas Noticias
            </h1>
            <p className="text-base text-bg-200">
              Mantente al día con las últimas noticias y artículos
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          <div className="lg:col-span-3">
            {publishedPosts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h2 className="text-2xl font-bold text-bg-100 mb-4">
                  No hay posts publicados
                </h2>
                <p className="text-bg-200">
                  ¡Mantente al pendiente para ver nuestros próximos artículos!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-5">
                {publishedPosts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-2xl shadow-md shadow-bg-300/10  overflow-hidden"
                  >
                    {post.featuredImage && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-6 ">
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap justify-between gap-2 mb-4">
                          <div className="flex gap-2">
                            {post.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="inline-block px-2 py-1 text-xs bg-white-100 text-bg-300 rounded"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                          {post.category && (
                            <span className="px-2 py-1 bg-white-100 text-primary-100 rounded text-xs font-medium">
                              {post.category}
                            </span>
                          )}
                        </div>
                      )}
                      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                        <div className="flex items-center justify-center text-nowrap">
                          <FiCalendar className="mr-1 h-4 w-4" />
                          {formatDate(post.publishedAt || post.createdAt)}
                        </div>
                        <div className="flex items-center">
                          <FiUser className="mr-1 h-4 w-4" />
                          {post.author}
                        </div>
                      </div>

                      <h2 className="text-2xl font-bold text-bg-100 mb-3">
                        <Link
                          to={`/noticias/${post.slug}`}
                          className="hover:text-primary-100 transition-colors"
                        >
                          {post.title}
                        </Link>
                      </h2>

                      <p className="text-bg-200 mb-4 line-clamp-3 min-h-16">
                        {post.excerpt.slice(0, 160)}...
                      </p>

                      <div className="flex justify-end items-end">
                        <Link
                          to={`/noticias/${post.slug}`}
                          className="inline-flex items-center text-primary-100 hover:text-white hover:bg-primary-100 transition-colors duration-300 font-medium  px-4 rounded py-1"
                        >
                          Leer más
                          <FiArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="mt-12 lg:mt-0">
            <div className="space-y-8">
              {categories.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-bg-100 mb-4">
                    Categorías
                  </h3>
                  <div className="space-y-2">
                    {categories.map((category) => {
                      const count = publishedPosts.filter(
                        (post) => post.category === category
                      ).length;
                      return (
                        <div
                          key={category}
                          className="flex items-center justify-between"
                        >
                          <span className="text-bg-300">{category}</span>
                          <span className="text-gray-500 text-sm">
                            ({count})
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {publishedPosts.length > 3 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-bg-100 mb-4">
                    Posts Recientes
                  </h3>
                  <div className="space-y-4">
                    {publishedPosts.slice(0, 3).map((post) => (
                      <div key={post.id}>
                        <Link
                          to={`/noticias/${post.slug}`}
                          className="block hover:text-accent-100 transition-colors"
                        >
                          <h4 className="font-medium text-bg-100 line-clamp-2 mb-1">
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
