import { useState } from "react";
import { useBlogManagement } from "../../admin/blog-management/hooks/useBlogManagement";
import { Link } from "react-router-dom";

function Lastnews() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 5;
  const maxNewsItems = 10;

  const { blogPosts, loading, error } = useBlogManagement();

  const publishedPosts = (blogPosts || [])
    .filter((post) => post.isPublished)
    .sort(
      (a, b) =>
        new Date(b.publishedAt || b.createdAt).getTime() -
        new Date(a.publishedAt || a.createdAt).getTime()
    )
    .slice(0, maxNewsItems);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const NEWS_ITEMS = publishedPosts.length > 0 ? publishedPosts : [];

  const maxIndex = Math.max(0, NEWS_ITEMS.length - itemsPerView);

  const scrollToSlide = (index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, maxIndex)));
  };

  const nextSlide = () => {
    if (currentIndex < maxIndex) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const getVisibleItems = () => {
    return NEWS_ITEMS.slice(currentIndex, currentIndex + itemsPerView);
  };

  if (loading) {
    return (
      <div className="relative max-w-7xl mx-auto flex flex-col gap-5 h-109">
        <h3 className="text-2xl text-white font-bold">Últimas noticias</h3>
        <div className="relative h-full flex gap-5">
          {Array.from({ length: itemsPerView }).map((_, index) => (
            <div
              key={index}
              className="w-80 h-96 bg-white/10 rounded-2xl animate-pulse flex-shrink-0"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative max-w-7xl mx-auto flex flex-col gap-5 h-109">
        <h3 className="text-2xl text-white font-bold">Últimas noticias</h3>
        <div className="relative h-full flex items-center justify-center">
          <div className="text-white text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-white-100">Error al cargar las noticias</p>
          </div>
        </div>
      </div>
    );
  }

  if (NEWS_ITEMS.length === 0) {
    return (
      <div className="relative max-w-7xl mx-auto flex flex-col gap-5 h-109">
        <h3 className="text-2xl text-white font-bold">Últimas noticias</h3>
        <div className="relative h-full flex items-center justify-center">
          <div className="text-white text-center">
            <div className="text-6xl mb-4">📰</div>
            <p className="text-white-100 text-xl">
              No hay noticias disponibles
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative max-w-7xl mx-auto flex flex-col gap-5 h-109">
      <h3 className="text-2xl text-white font-bold">Últimas noticias</h3>
      <div className="relative h-full ">
        <button
          onClick={prevSlide}
          disabled={currentIndex === 0}
          className={`absolute left-4 top-1/2 transform -translate-y-1/2 z-50 rounded-full p-3 shadow-lg transition-all w-12 h-12 flex items-center justify-center ${
            currentIndex === 0
              ? "bg-white/50 cursor-not-allowed text-black/50"
              : "border-4 border-white text-white hover:bg-white hover:text-black"
          }`}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          disabled={currentIndex >= maxIndex}
          className={`absolute right-4 top-1/2 transform -translate-y-1/2 z-50 rounded-full p-3 shadow-lg transition-all w-12 h-12 flex items-center justify-center ${
            currentIndex >= maxIndex
              ? "bg-white/50 cursor-not-allowed text-black/50"
              : "border-4 border-white  hover:bg-white text-white hover:text-black"
          }`}
        >
          <svg
            className="w-6 h-6"
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
        </button>

        <div className="relative left-0 top-0 flex gap-5 transition-transform duration-300 ease-in-out ">
          {getVisibleItems().map((item) => (
            <Link
              key={item.id}
              to={`/noticias/${item.slug}`}
              className="relative w-80 rounded-2xl overflow-hidden h-96 flex-shrink-0 shadow-lg hover:shadow-xl transition-shadow duration-300 block"
            >
              <div className="relative h-full w-full overflow-hidden">
                <img
                  src={
                    item.featuredImage ||
                    "https://via.placeholder.com/320x384.png?text=Noticia"
                  }
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover scale-135"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-5 h-50 flex flex-col justify-end text-white">
                <div className="mb-2">
                  <span className="text-xs bg-primary-100 px-2 py-1 rounded-full">
                    {item.category || "General"}
                  </span>
                </div>
                <h4 className="text-lg font-bold mb-2 line-clamp-2 h-14">
                  {item.title.slice(0, 50)}
                  {item.title.length > 50 ? "..." : ""}
                </h4>
                <p className="text-base text-white-100">
                  {formatDate(item.publishedAt || item.createdAt)}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex
                  ? "bg-black w-20"
                  : "border-2 border-white/70 hover:bg-white"
              }`}
            />
          ))}
        </div>

        {(blogPosts?.length || 0) > maxNewsItems && (
          <div className="flex justify-center mt-6">
            <Link
              to="/noticias"
              className="inline-flex items-center px-6 py-3 bg-primary-100 hover:bg-primary-200 text-white font-medium rounded-lg transition-colors duration-300"
            >
              Ver todas las noticias
              <svg
                className="ml-2 w-4 h-4"
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
        )}
      </div>
    </div>
  );
}

export default Lastnews;
