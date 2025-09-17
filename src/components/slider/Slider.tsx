import { useState } from "react";

// Slider Configuration Parameters
const SLIDER_CONFIG = {
  // Layout percentages
  centerSlideWidth: 70, // 60% for center slide
  sideSlideWidth: 20, // 20% for side slides
  centerSlideHeight: 100, // 100% height for center slide
  sideSlideHeight: 70, // 70% height for side slides
  // Visual settings
  slideSpacing: 2, // Gap between slides (in rem/tailwind units)
  transitionDuration: 500,
  padding: 1,
  backgroundColor: "transparent",
  buttonSize: "w-8 h-8",
  indicatorSize: "w-3 h-3",
  zIndexActive: "z-10",
  zIndexInactive: "z-0",
  titleSizeActive: "text-5xl",
  subtitleSizeActive: "text-2xl",
  titleSizeInactive: "text-sm",
  descriptionSizeActive: "text-lg",
  descriptionSizeInactive: "text-xs",

  // Container height
  containerHeight: 550, // Base height in pixels
};

function Slider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const SLIDER_ITEMS = [
    {
      image: "public/slider/slider04.JPG",
      title: "Te damos la bienvenida a AST Networks",
      subtitle: "Bienvenido",
      description:
        "Conectamos tecnología e innovación para transformar sectores productivos clave en Chile y Latinoamérica.",
    },
    {
      image: "public/slider/slider01.JPG",
      title: "Sostenibilidad",
      subtitle: "AST - Soluciones de vanguardia",
      description: "Comprometidos con el medio ambiente",
    },
    {
      image: "public/slider/slider01.JPG",
      title: "Soluciones Tecnológicas a tu Medida",
      subtitle: "Servicios",
      description:
        "Ofrecemos soluciones en conectividad, seguridad, monitoreo y datacenter, potenciadas con inteligencia artificial para optimizar procesos y mejorar la eficiencia de tu operación en Chile y Latinoamérica.",
    },
    {
      image: "public/slider/slider01.JPG",
      title: "Equipo Profesional",
      subtitle: "AST - Soluciones de vanguardia",
      description: "Expertos dedicados a tu éxito",
    },
    {
      image: "public/slider/slider01.JPG",
      title: "Resultados",
      subtitle: "AST - Soluciones de vanguardia",
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
    <div
      className={`relative w-full p-${SLIDER_CONFIG.padding} ${SLIDER_CONFIG.backgroundColor}`}
    >
      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all"
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
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all"
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
        style={{ height: `${SLIDER_CONFIG.containerHeight}px` }}
      >
        <div className="flex items-center justify-center gap-4 h-full px-16">
          <div
            className="flex-shrink-0 cursor-pointer transition-all duration-300 opacity-60 hover:opacity-80"
            style={{
              width: `${SLIDER_CONFIG.sideSlideWidth}%`,
              height: `${SLIDER_CONFIG.sideSlideHeight}%`,
            }}
            onClick={prevSlide}
          >
            <img
              src={
                SLIDER_ITEMS[
                  (currentIndex - 1 + SLIDER_ITEMS.length) % SLIDER_ITEMS.length
                ].image
              }
              alt={
                SLIDER_ITEMS[
                  (currentIndex - 1 + SLIDER_ITEMS.length) % SLIDER_ITEMS.length
                ].title
              }
              className="w-full h-full object-cover rounded-2xl shadow-md"
            />
          </div>

          <div
            className={`flex-shrink-0 cursor-pointer transition-all duration-300 ${SLIDER_CONFIG.zIndexActive}`}
            style={{
              width: `${SLIDER_CONFIG.centerSlideWidth}%`,
              height: `${SLIDER_CONFIG.centerSlideHeight}%`,
            }}
          >
            <div className="relative h-full">
              <img
                src={SLIDER_ITEMS[currentIndex].image}
                alt={SLIDER_ITEMS[currentIndex].title}
                className="w-full h-full object-cover rounded-2xl shadow-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent rounded-b-2xl">
                <div className="relative bottom-10 left-10 flex flex-col gap-2 max-w-2xl">
                  <h2
                    className={`font-bold text-white mb-1 ${SLIDER_CONFIG.subtitleSizeActive}`}
                  >
                    {SLIDER_ITEMS[currentIndex].subtitle}
                  </h2>
                  <h1
                    className={`font-bold max-w-xl leading-14 text-white ${SLIDER_CONFIG.titleSizeActive}`}
                  >
                    {SLIDER_ITEMS[currentIndex].title}
                  </h1>
                  <p
                    className={`text-white ${SLIDER_CONFIG.descriptionSizeActive}`}
                  >
                    {SLIDER_ITEMS[currentIndex].description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            className="flex-shrink-0 cursor-pointer transition-all duration-300 opacity-60 hover:opacity-80"
            style={{
              width: `${SLIDER_CONFIG.sideSlideWidth}%`,
              height: `${SLIDER_CONFIG.sideSlideHeight}%`,
            }}
            onClick={nextSlide}
          >
            <img
              src={SLIDER_ITEMS[(currentIndex + 1) % SLIDER_ITEMS.length].image}
              alt={SLIDER_ITEMS[(currentIndex + 1) % SLIDER_ITEMS.length].title}
              className="w-full h-full object-cover rounded-2xl shadow-md"
            />
          </div>
        </div>
      </div>

      {/* Indicators */}
      <div className="relative flex justify-center -mt-6 z-10 gap-2">
        {SLIDER_ITEMS.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToSlide(index)}
            className={`${
              SLIDER_CONFIG.indicatorSize
            } rounded-full transition-all ${
              index === currentIndex
                ? "bg-primary-100 w-20"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default Slider;
