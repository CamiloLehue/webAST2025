import { useState } from "react";

// Slider Configuration Parameters
const SLIDER_CONFIG = {
  slideWidth: 800,
  slideHeight: 500,
  slideSpacing: 20,
  offsetPosition: 300,
  transitionDuration: 500,
  padding: 0,
  backgroundColor: "transparent",
  buttonSize: "w-6 h-6",
  indicatorSize: "w-3 h-3",
  zIndexActive: "z-10",
  zIndexInactive: "z-0",
  titleSizeActive: "text-lg",
  titleSizeInactive: "text-sm",
  descriptionSizeActive: "text-sm",
  descriptionSizeInactive: "text-xs",
};

function Slider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const SLIDER_ITEMS = [
    {
      image: "public/slider/slider01.JPG",
      title: "Innovación Tecnológica",
      description: "Liderando el futuro con soluciones avanzadas",
    },
    {
      image: "public/slider/slider01.JPG",
      title: "Sostenibilidad",
      description: "Comprometidos con el medio ambiente",
    },
    {
      image: "public/slider/slider01.JPG",
      title: "Excelencia",
      description: "Calidad garantizada en cada proyecto",
    },
    {
      image: "public/slider/slider01.JPG",
      title: "Equipo Profesional",
      description: "Expertos dedicados a tu éxito",
    },
    {
      image: "public/slider/slider01.JPG",
      title: "Resultados",
      description: "Entregando valor real a nuestros clientes",
    },
  ];

  const scrollToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    const newIndex = (currentIndex + 1) % SLIDER_ITEMS.length;
    scrollToSlide(newIndex);
  };

  const prevSlide = () => {
    const newIndex =
      currentIndex === 0 ? SLIDER_ITEMS.length - 1 : currentIndex - 1;
    scrollToSlide(newIndex);
  };

  return (
    <div className={`relative w-full p-${SLIDER_CONFIG.padding} ${SLIDER_CONFIG.backgroundColor}`}>
      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all"
      >
        <svg
          className={SLIDER_CONFIG.buttonSize}
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
        className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all"
      >
        <svg
          className={SLIDER_CONFIG.buttonSize}
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

      <div
        className="relative w-full overflow-hidden"
        style={{ margin: "0 auto" }}
      >
        <div
          className={`flex items-center space-x-${SLIDER_CONFIG.slideSpacing} transition-transform duration-${SLIDER_CONFIG.transitionDuration} ease-in-out`}
          style={{
            transform: `translateX(calc(-${currentIndex * SLIDER_CONFIG.slideWidth}px - ${SLIDER_CONFIG.offsetPosition}px))`,
            width: `${SLIDER_ITEMS.length * SLIDER_CONFIG.slideWidth}px`,
          }}
        >
          {SLIDER_ITEMS.map((item, index) => {
            const isCenter = index === currentIndex;

            return (
              <div
                key={index}
                onClick={() => scrollToSlide(index)}
                className={`relative cursor-pointer transition-all  duration-300 ${
                  isCenter ? SLIDER_CONFIG.zIndexActive : SLIDER_CONFIG.zIndexInactive
                }`}
                style={{
                  width: `${SLIDER_CONFIG.slideWidth}px`,
                  height: `${SLIDER_CONFIG.slideHeight}px`,
                  flexShrink: 0,
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
                  <h3
                    className={`font-bold text-white ${
                      isCenter ? SLIDER_CONFIG.titleSizeActive : SLIDER_CONFIG.titleSizeInactive
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={`text-white ${isCenter ? SLIDER_CONFIG.descriptionSizeActive : SLIDER_CONFIG.descriptionSizeInactive}`}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Indicators */}
      <div className="flex justify-center mt-4 gap-2">
        {SLIDER_ITEMS.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToSlide(index)}
            className={`${SLIDER_CONFIG.indicatorSize} rounded-full transition-all ${
              index === currentIndex
                ? "bg-blue-600"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default Slider;
