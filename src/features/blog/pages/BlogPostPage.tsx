import React from "react";
import { useParams, Link } from "react-router-dom";
import { useContent } from "../../../hooks/useContent";
import { FiCalendar, FiUser, FiArrowLeft } from "react-icons/fi";

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { blogPosts } = useContent();

  const post = blogPosts.find((p) => p.slug === slug && p.isPublished);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Post no encontrado
          </h1>
          <p className="text-gray-600 mb-6">
            El artículo que buscas no existe o no está publicado.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
          >
            <FiArrowLeft className="mr-2 h-4 w-4" />
            Volver al blog
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
      {/* Back to blog */}
      <div className=" ">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/blog"
            className="inline-flex items-center text-primary-100 hover:text-bg-400 font-medium bg-bg-300/10 px-5 rounded-full py-1 transition-colors duration-300"
          >
            <FiArrowLeft className="mr-2 h-4 w-4" />
            Volver a Noticias
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
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
                {post.category}
              </span>
            )}
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-xl text-gray-600 leading-relaxed">
              {post.excerpt}
            </p>
          )}
        </header>

        {/* Post Content */}
        <div className="prose prose-lg max-w-none">
          {post.content.split("\n").map((paragraph, index) => {
            if (paragraph.trim() === "") return <br key={index} />;

            return (
              <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-white-100">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Etiquetas:
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Post Footer */}
        <footer className="mt-12 pt-8 border-t border-white-100">
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <FiUser className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-medium text-gray-900">
                  {post.author}
                </h4>
                <p className="text-gray-600">Autor de este artículo</p>
              </div>
            </div>
          </div>
        </footer>

        {/* Navigation to other posts */}
        <nav className="mt-12 pt-8 border-t border-white-100">
          <div className="flex justify-between items-center">
            <div className="text-center">
              <Link
                to="/blog"
                className="inline-flex items-center px-6 py-3 border border-bg-300/20 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-primary-100/10 transition-colors"
              >
                Ver todos las noticias
              </Link>
            </div>
          </div>
        </nav>
      </article>
    </div>
  );
};

export default BlogPostPage;
