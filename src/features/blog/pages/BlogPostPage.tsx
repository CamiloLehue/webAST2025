import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useBlogManagement } from "../../admin/blog-management/hooks/useBlogManagement";
import {
  FiCalendar,
  FiUser,
  FiArrowLeft,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";
import MarkdownContent from "../../../components/content/MarkdownContent";
import { useBreakpoints } from "../../../context/ProviderBreakpoints";

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { blogPosts, loading, error } = useBlogManagement();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [expandedTags, setExpandedTags] = useState<string[]>([]);
  const { isSmallDevice } = useBreakpoints();
  const post = (blogPosts || []).find((p) => p.slug === slug && p.isPublished);

  const allCategories = [
    ...new Set(
      (blogPosts || []).filter((p) => p.isPublished).map((p) => p.category)
    ),
  ].filter(Boolean);

  const allTags = [
    ...new Set(
      (blogPosts || []).filter((p) => p.isPublished).flatMap((p) => p.tags)
    ),
  ].filter(Boolean);

  const relatedPosts = (blogPosts || [])
    .filter(
      (p) =>
        p.isPublished &&
        p.id !== post?.id &&
        (p.category === post?.category ||
          p.tags.some((tag) => post?.tags.includes(tag)))
    )
    .sort(
      (a, b) =>
        new Date(b.publishedAt || b.createdAt).getTime() -
        new Date(a.publishedAt || a.createdAt).getTime()
    )
    .slice(0, 4);

  const fallbackRelatedPosts =
    relatedPosts.length === 0
      ? (blogPosts || [])
          .filter((p) => p.isPublished && p.id !== post?.id)
          .sort(
            (a, b) =>
              new Date(b.publishedAt || b.createdAt).getTime() -
              new Date(a.publishedAt || a.createdAt).getTime()
          )
          .slice(0, 4)
      : relatedPosts;
  const navigate = useNavigate();

  const toggleCategoryExpansion = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleTagExpansion = (tag: string) => {
    setExpandedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const getPostsByCategory = (category: string) => {
    return (blogPosts || [])
      .filter(
        (p) => p.isPublished && p.category === category && p.id !== post?.id
      )
      .sort(
        (a, b) =>
          new Date(b.publishedAt || b.createdAt).getTime() -
          new Date(a.publishedAt || a.createdAt).getTime()
      )
      .slice(0, 5);
  };

  const getPostsByTag = (tag: string) => {
    return (blogPosts || [])
      .filter((p) => p.isPublished && p.tags.includes(tag) && p.id !== post?.id)
      .sort(
        (a, b) =>
          new Date(b.publishedAt || b.createdAt).getTime() -
          new Date(a.publishedAt || a.createdAt).getTime()
      )
      .slice(0, 5);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 min-w-7xl mt-5">
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
    <div
      className={`w-full min-h-screen  bg-white-100 rounded-t-lg  mt-5
        ${isSmallDevice ? "" : "min-w-7xl"}`}
    >
      <div className="px-5">
        <div className="max-w-7xl mx-auto py-4 px-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-sm text-primary-100 border border-white font-medium bg-white hover:border-primary-100 px-2 rounded py-1 transition-colors duration-300"
          >
            <FiArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 ">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          <div className="lg:col-span-3">
            <article className=" bg-white rounded-2xl p-10 mb-5">
              {post.featuredImage && (
                <div className="aspect-video overflow-hidden rounded-lg mb-8">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <header className="mb-8 bg-">
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

                <h1
                  className={` font-bold text-bg-100 mb-4
                  ${isSmallDevice ? "text-xl text-balance" : "text-4xl"}
                `}
                >
                  {post.title}
                </h1>

                {post.excerpt && (
                  <p className="text-lg text-bg-200 leading-relaxed bg-white-100 border-s-2 border-s-bg-300 ps-5 py-2 italic">
                    {post.excerpt}
                  </p>
                )}
              </header>

              <MarkdownContent
                content={post.content}
                className="prose prose-lg max-w-none"
              />

              {post.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-bg-300/10">
                  <h3 className="text-sm font-medium text-bg-300 mb-3">
                    Etiquetas:
                  </h3>
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

              <nav className="mt-12 pt-8 border-t border-white-100">
                <div className="flex justify-between items-center">
                  <div className="text-center">
                    <Link
                      to="/noticias"
                      className="inline-flex items-center text-xs px-3 py-3 hover:text-primary-100 hover:border-bg-300/10 border border-bg-300/20 font-medium rounded-md text-bg-300 bg-white transition-colors"
                    >
                      Ver todas las noticias
                    </Link>
                  </div>
                </div>
              </nav>
            </article>
          </div>

          <div className="lg:col-span-1 mt-12 lg:mt-0">
            <div className="space-y-8">
              {allCategories.length > 0 && (
                <div className="bg-white rounded-2xl shadow-md shadow-bg-300/10 p-6">
                  <h3 className="text-xl font-bold text-bg-100 mb-6 flex items-center">
                    <div className="w-8 h-8 bg-primary-100/10 rounded-lg flex items-center justify-center mr-3">
                      <svg
                        className="w-4 h-4 text-primary-100"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                    </div>
                    Categorías
                  </h3>
                  <div className="space-y-3">
                    {allCategories.map((category) => {
                      const categoryPosts = getPostsByCategory(category);
                      const isExpanded = expandedCategories.includes(category);
                      const totalCount = (blogPosts || []).filter(
                        (p) => p.category === category && p.isPublished
                      ).length;

                      return (
                        <div key={category}>
                          <button
                            onClick={() => toggleCategoryExpansion(category)}
                            className="group flex items-center justify-between w-full p-3 rounded-xl hover:bg-primary-100/5 transition-all duration-300 border border-transparent hover:border-primary-100/20"
                          >
                            <div className="flex items-center">
                              <span className="text-bg-300 group-hover:text-primary-100 font-medium transition-colors mr-2">
                                {category}
                              </span>
                              <span className="bg-bg-300/10 group-hover:bg-primary-100/20 text-bg-300 group-hover:text-primary-100 text-xs font-semibold px-2 py-1 rounded-full transition-all">
                                {totalCount}
                              </span>
                            </div>
                            {categoryPosts.length > 0 && (
                              <div className="text-bg-300 group-hover:text-primary-100 transition-colors">
                                {isExpanded ? (
                                  <FiChevronDown className="w-4 h-4" />
                                ) : (
                                  <FiChevronRight className="w-4 h-4" />
                                )}
                              </div>
                            )}
                          </button>

                          {isExpanded && categoryPosts.length > 0 && (
                            <div className="mt-3 ml-4 space-y-2 border-l border-bg-300/20 pl-4">
                              {categoryPosts.map((categoryPost) => (
                                <Link
                                  key={categoryPost.id}
                                  to={`/noticias/${categoryPost.slug}`}
                                  className="block group"
                                >
                                  <div className="flex gap-3 p-2 rounded-lg hover:bg-primary-100/5 transition-all duration-300">
                                    {categoryPost.featuredImage && (
                                      <div className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden">
                                        <img
                                          src={categoryPost.featuredImage}
                                          alt={categoryPost.title}
                                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                      </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-medium text-sm text-bg-100 group-hover:text-primary-100 line-clamp-2 transition-colors leading-tight mb-1">
                                        {categoryPost.title}
                                      </h4>
                                      <span className="text-xs text-bg-200 flex items-center">
                                        <FiCalendar className="w-3 h-3 mr-1" />
                                        {
                                          formatDate(
                                            categoryPost.publishedAt ||
                                              categoryPost.createdAt
                                          ).split(",")[0]
                                        }
                                      </span>
                                    </div>
                                  </div>
                                </Link>
                              ))}
                              {categoryPosts.length === 5 && (
                                <div className="pt-2">
                                  <Link
                                    to={`/noticias?category=${encodeURIComponent(
                                      category
                                    )}`}
                                    className="text-xs text-primary-100 hover:text-primary-200 font-medium"
                                  >
                                    Ver todos los artículos de {category} →
                                  </Link>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {allTags.length > 0 && (
                <div className="bg-white rounded-2xl shadow-md shadow-bg-300/10 p-6">
                  <h3 className="text-xl font-bold text-bg-100 mb-6 flex items-center">
                    <div className="w-8 h-8 bg-accent-100/10 rounded-lg flex items-center justify-center mr-3">
                      <svg
                        className="w-4 h-4 text-accent-100"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                        />
                      </svg>
                    </div>
                    Tags Populares
                  </h3>
                  <div className="space-y-3">
                    {allTags.slice(0, 10).map((tag, index) => {
                      const tagPosts = getPostsByTag(tag);
                      const isExpanded = expandedTags.includes(tag);
                      const count = (blogPosts || [])
                        .filter((p) => p.isPublished)
                        .filter((p) => p.tags.includes(tag)).length;

                      return (
                        <div key={index}>
                          <button
                            onClick={() => toggleTagExpansion(tag)}
                            className="group flex items-center justify-between w-full p-3 rounded-xl hover:bg-accent-100/5 transition-all duration-300 border border-transparent hover:border-accent-100/20"
                          >
                            <div className="flex items-center">
                              <span className="text-bg-300 hover:text-accent-100 font-medium transition-colors mr-2">
                                #{tag}
                              </span>
                              <span className="bg-bg-300/10 group-hover:bg-accent-100/20 text-bg-300 group-hover:text-accent-100 text-xs font-semibold px-2 py-1 rounded-full transition-all">
                                {count}
                              </span>
                            </div>
                            {tagPosts.length > 0 && (
                              <div className="text-bg-300 group-hover:text-accent-100 transition-colors">
                                {isExpanded ? (
                                  <FiChevronDown className="w-4 h-4" />
                                ) : (
                                  <FiChevronRight className="w-4 h-4" />
                                )}
                              </div>
                            )}
                          </button>

                          {isExpanded && tagPosts.length > 0 && (
                            <div className="mt-3 ml-4 space-y-2 border-l border-bg-300/20 pl-4">
                              {tagPosts.map((tagPost) => (
                                <Link
                                  key={tagPost.id}
                                  to={`/noticias/${tagPost.slug}`}
                                  className="block group"
                                >
                                  <div className="flex gap-3 p-2 rounded-lg hover:bg-accent-100/5 transition-all duration-300">
                                    {tagPost.featuredImage && (
                                      <div className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden">
                                        <img
                                          src={tagPost.featuredImage}
                                          alt={tagPost.title}
                                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                      </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-medium text-sm text-bg-100 group-hover:text-accent-100 line-clamp-2 transition-colors leading-tight mb-1">
                                        {tagPost.title}
                                      </h4>
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs text-bg-200 flex items-center">
                                          <FiCalendar className="w-3 h-3 mr-1" />
                                          {
                                            formatDate(
                                              tagPost.publishedAt ||
                                                tagPost.createdAt
                                            ).split(",")[0]
                                          }
                                        </span>
                                        {tagPost.category && (
                                          <span className="text-xs bg-primary-100/10 text-primary-100 px-1 py-0.5 rounded">
                                            {tagPost.category}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </Link>
                              ))}
                              {tagPosts.length === 5 && (
                                <div className="pt-2">
                                  <Link
                                    to={`/noticias?tag=${encodeURIComponent(
                                      tag
                                    )}`}
                                    className="text-xs text-accent-100 hover:text-accent-200 font-medium"
                                  >
                                    Ver todos los artículos con #{tag} →
                                  </Link>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {fallbackRelatedPosts.length > 0 && (
                <div className="bg-white rounded-2xl shadow-md shadow-bg-300/10 p-6">
                  <h3 className="text-xl font-bold text-bg-100 mb-6 text-nowrap flex items-center">
                    <div className="w-8 h-8 bg-primary-200/10 rounded-lg flex items-center justify-center mr-3">
                      <svg
                        className="w-4 h-4 text-primary-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                        />
                      </svg>
                    </div>
                    Noticias Relacionadas
                  </h3>
                  <div className="space-y-4">
                    {fallbackRelatedPosts.map((relatedPost) => (
                      <Link
                        key={relatedPost.id}
                        to={`/noticias/${relatedPost.slug}`}
                        className="group block"
                      >
                        <article className="flex gap-4 p-3 rounded-xl hover:bg-primary-100/5 transition-all duration-300 border border-transparent hover:border-primary-100/20">
                          {relatedPost.featuredImage && (
                            <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                              <img
                                src={relatedPost.featuredImage}
                                alt={relatedPost.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm text-bg-100 group-hover:text-primary-100 line-clamp-2 transition-colors leading-tight">
                              {relatedPost.title}
                            </h4>
                            <div className="flex flex-col justify-center items-start gap-2 mt-2">
                              <span className="text-[8px] text-bg-200 flex items-center">
                                <FiCalendar className="w-3 h-3 mr-1" />
                                {
                                  formatDate(
                                    relatedPost.publishedAt ||
                                      relatedPost.createdAt
                                  ).split(",")[0]
                                }
                              </span>
                              {relatedPost.category && (
                                <span className="text-xs bg-primary-100/10 text-primary-100 px-2 py-1 rounded">
                                  {relatedPost.category}
                                </span>
                              )}
                            </div>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-bg-300/10">
                    <Link
                      to="/noticias"
                      className="group flex items-center justify-center w-full py-3 px-4 text-sm font-medium text-primary-100 hover:text-white hover:bg-primary-100 rounded-xl border border-primary-100/20 hover:border-primary-100 transition-all duration-300"
                    >
                      Ver todas las noticias
                      <svg
                        className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
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

export default BlogPostPage;
