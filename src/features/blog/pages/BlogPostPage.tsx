import React from "react";
import { useParams, Link } from "react-router-dom";
import { useBlogManagement } from "../../admin/blog-management/hooks/useBlogManagement";
import { FiCalendar, FiUser, FiArrowLeft } from "react-icons/fi";

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { blogPosts, loading, error } = useBlogManagement();

  // Proteger contra arrays undefined
  const post = (blogPosts || []).find((p) => p.slug === slug && p.isPublished);

  // Manejo de estados de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-300 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              <div className="h-4 bg-gray-300 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Manejo de errores
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-bg-100 mb-4">
            Error al cargar el post
          </h1>
          <p className="text-bg-200 mb-6">{error}</p>
          <Link
            to="/noticias"
            className="inline-flex items-center text-primary-600 hover:text-primary-700"
          >
            <FiArrowLeft className="mr-2 h-4 w-4" />
            Volver a las noticias
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-bg-100 mb-4">
            Post no encontrado
          </h1>
          <p className="text-bg-200 mb-6">
            El artículo que buscas no existe o no está publicado.
          </p>
          <Link
            to="/noticias"
            className="inline-flex items-center text-accent-100 hover:text-accent-200 font-medium"
          >
            <FiArrowLeft className="mr-2 h-4 w-4" />
            Volver a las noticias
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-full min-h-screen bg-white-100">
      {/* Back to noticias */}
      <div className=" ">
        <div className="max-w-4xl mx-auto  py-4">
          <Link
            to="/noticias"
            className="inline-flex items-center text-sm text-primary-100 border border-white font-medium bg-white hover:border-primary-100 px-2 rounded py-1 transition-colors duration-300"
          >
            <FiArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5 bg-white rounded-2xl">
        {/* Featured Image */}
        {post.featuredImage && (
          <div className="aspect-video overflow-hidden rounded-lg mb-8">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Post Header */}
        <header className="mb-8">
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center">
              <FiCalendar className="mr-1 h-4 w-4" />
              {formatDate(post.publishedAt || post.createdAt)}
            </div>
            <div className="flex items-center">
              <FiUser className="mr-1 h-4 w-4" />
              {post.author}
            </div>
            {post.category && (
              <span className="px-3 py-1 bg-white text-accent-200 rounded-full text-xs font-medium">
                {post.category}
              </span>
            )}
          </div>

          <h1 className="text-4xl font-bold text-bg-100 mb-4">{post.title}</h1>

          {post.excerpt && (
            <p className="text-xl text-bg-200 leading-relaxed">
              {post.excerpt}
            </p>
          )}
        </header>

        {/* Post Content */}
        <div className="prose prose-lg max-w-none">
          {post.content.split("\n").map((paragraph, index) => {
            if (paragraph.trim() === "") return <br key={index} />;

            return (
              <p key={index} className="mb-4 text-bg-300 leading-relaxed">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-bg-300/10">
            <h3 className="text-sm font-medium text-bg-300 mb-3">Etiquetas:</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block px-3 py-1 text-sm bg-white-100 text-bg-300 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Post Footer */}
        <footer className="mt-12 pt-8 border-t border-bg-300/10">
          <div className="bg-white-100 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <FiUser className="h-6 w-6 text-primary-100" />
                </div>
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-medium text-bg-100">
                  {post.author}
                </h4>
                <p className="text-bg-200">Autor de este artículo</p>
              </div>
            </div>
          </div>
        </footer>

        {/* Navigation to other posts */}
        <nav className="mt-12 pt-8 border-t border-white-100">
          <div className="flex justify-between items-center">
            <div className="text-center">
              <Link
                to="/noticias"
                className="inline-flex items-center text-xs px-3 py-3 hover:text-primary-100 hover:border-bg-300/10 border border-bg-300/20  font-medium rounded-md text-bg-300 bg-white  transition-colors"
              >
                Ver todas las noticias
              </Link>
            </div>
          </div>
        </nav>
      </article>
    </div>
  );
};

export default BlogPostPage;
