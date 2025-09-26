import { useState, useEffect } from "react";
import {
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import type { BlogPost } from "../../features/admin/blog-management/types/blogTypes";

interface NewsHeroSectionProps {
  posts: BlogPost[];
}

function NewsHeroSection({ posts }: NewsHeroSectionProps) {
  const [currentPostIndex, setCurrentPostIndex] = useState(0);

  const latestPosts = posts.filter((post) => post.isPublished).slice(0, 4);

  useEffect(() => {
    if (currentPostIndex >= latestPosts.length) {
      setCurrentPostIndex(0);
    }
  }, [latestPosts.length, currentPostIndex]);

  useEffect(() => {
    if (latestPosts.length > 1) {
      const interval = setInterval(() => {
        setCurrentPostIndex((prevIndex) =>
          prevIndex === latestPosts.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [latestPosts.length]);

  const nextPost = () => {
    setCurrentPostIndex(
      currentPostIndex === latestPosts.length - 1 ? 0 : currentPostIndex + 1
    );
  };

  const prevPost = () => {
    setCurrentPostIndex(
      currentPostIndex === 0 ? latestPosts.length - 1 : currentPostIndex - 1
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (latestPosts.length === 0) {
    return (
      <section className="bg-bg-400 flex flex-row justify-center items-center h-130 overflow-hidden border-t border-t-bg-200 border-b-4 border-primary-100">
        <div className="grid grid-cols-4 gap-5 w-full">
          <div className="col-span-2 w-full h-full flex justify-center items-center">
            <article className="flex flex-col items-end justify-center w-full">
              <div className="max-w-2xl h-full flex flex-col gap-5">
                <h2 className="text-white text-5xl font-bold">Noticias</h2>
                <p className="text-white-100 text-lg">
                  Mantente informado con las últimas noticias y actualizaciones
                  de nuestra empresa.
                </p>
              </div>
            </article>
          </div>
          <div className="relative col-span-2 w-full h-full overflow-hidden flex items-center justify-center">
            <div className="text-white text-center">
              <div className="text-6xl mb-4">📰</div>
              <p className="text-white-100 text-xl">
                No hay noticias disponibles
              </p>
            </div>
            <div className="absolute left-0 top-0 bg-gradient-to-r from-bg-400 to-transparent h-full w-1/3"></div>
          </div>
        </div>
      </section>
    );
  }

  const currentPost = latestPosts[currentPostIndex];

  if (!currentPost) {
    return (
      <section className="bg-bg-400 flex flex-row justify-center items-center h-130 overflow-hidden border-t border-t-bg-200 border-b-4 border-primary-100">
        <div className="grid grid-cols-4 gap-5 w-full">
          <div className="col-span-2 w-full h-full flex justify-center items-center">
            <article className="flex flex-col items-end justify-center w-full">
              <div className="max-w-2xl h-full flex flex-col gap-5">
                <h2 className="text-white text-5xl font-bold">Noticias</h2>
                <p className="text-white-100 text-lg">Cargando noticias...</p>
              </div>
            </article>
          </div>
          <div className="relative col-span-2 w-full h-full overflow-hidden flex items-center justify-center">
            <div className="text-white text-center">
              <div className="text-6xl mb-4">📰</div>
              <p className="text-white-100 text-xl">Cargando...</p>
            </div>
            <div className="absolute left-0 top-0 bg-gradient-to-r from-bg-400 to-transparent h-full w-1/3"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-bg-400 flex flex-row justify-center items-center h-130 overflow-hidden border-t border-t-bg-200 border-b-4 border-primary-100">
      <div className="grid grid-cols-4 gap-5 w-full">
        <div className="col-span-2 w-full h-full flex justify-center items-center">
          <article className="flex flex-col items-end justify-center w-full">
            <div className="max-w-2xl h-full flex flex-col gap-5">
              <div className="flex items-center gap-2 text-primary-100">
                <FiCalendar className="w-4 h-4" />
                <span className="text-sm">
                  {formatDate(currentPost.publishedAt || currentPost.createdAt)}
                </span>
                {currentPost.category && (
                  <>
                    <span className="text-white-100">•</span>
                    <span className="text-sm bg-primary-100/20 px-2 py-1 rounded">
                      {currentPost.category}
                    </span>
                  </>
                )}
              </div>
              <h2 className="text-white text-5xl font-bold line-clamp-3">
                {currentPost.title}
              </h2>
              <p className="text-white-100 text-lg line-clamp-4">
                {currentPost.excerpt.length > 200
                  ? currentPost.excerpt.substring(0, 200) + "..."
                  : currentPost.excerpt}
              </p>
            </div>
            <div className="w-full max-w-sm mt-5 mx-auto">
              <Link
                to={`/noticias/${currentPost.slug}`}
                className="inline-flex items-center text-primary-100 hover:text-white-100 transition-colors duration-300 font-medium border px-4 py-1 w-max"
              >
                Leer más
                <FiArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </article>
        </div>
        <div className="relative col-span-2 w-full h-full overflow-hidden">
          <img
            draggable={false}
            src={
              currentPost.featuredImage ||
              "https://via.placeholder.com/800x600.png?text=Noticia"
            }
            alt={currentPost.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute left-0 top-0 bg-gradient-to-r from-bg-400 to-transparent h-full w-1/3"></div>

          {latestPosts.length > 1 && (
            <>
              <button
                onClick={prevPost}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors duration-300"
                aria-label="Noticia anterior"
              >
                <FiChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextPost}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors duration-300"
                aria-label="Siguiente noticia"
              >
                <FiChevronRight className="w-6 h-6" />
              </button>

              <div className="absolute bottom-4 right-4 flex space-x-2 z-20">
                {latestPosts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPostIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      index === currentPostIndex
                        ? "bg-primary-100"
                        : "bg-white/50"
                    }`}
                    aria-label={`Ir a noticia ${index + 1}`}
                  />
                ))}
              </div>

              <div className="absolute bottom-4 left-4 bg-black/30 rounded px-2 py-1">
                <span className="text-white text-sm">
                  {currentPostIndex + 1} / {latestPosts.length}
                </span>
              </div>
            </>
          )}

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <p className="text-white text-sm opacity-75">
              Por {currentPost.author}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NewsHeroSection;
