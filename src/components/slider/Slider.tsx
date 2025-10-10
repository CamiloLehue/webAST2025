import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface SliderItem {
  id: string;
  image: string;
  title: string;
  description: string;
  order: number;
  isActive: boolean;
}

interface SliderProps {
  slides?: SliderItem[];
  autoplay?: boolean;
  interval?: number;
}

const SLIDER_CONFIG = {
  centerSlideWidth: 70,
  sideSlideWidth: 20, 
  centerSlideHeight: 100, 
  sideSlideHeight: 70,
  slideSpacing: 2,
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
  autoPlayInterval: 8000, 
  containerHeight: 580, 
};

function Slider({ slides, autoplay = true, interval = 8000 }: SliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoplay);

  // Datos por defecto si no se proporcionan slides
  const DEFAULT_SLIDER_ITEMS = [
    {
      id: "default-1",
      image: "slider/slider04.JPG",
      title: "Te damos la bienvenida a AST Networks",
      description:
        "Conectamos tecnología e innovación para transformar sectores productivos clave en Chile y Latinoamérica.",
    },
    {
      id: "default-2",
      image: "slider/slider01.JPG",
      title: "Sostenibilidad",
      description: "Comprometidos con el medio ambiente",
      order: 1,
      isActive: true,
    },
    {
      id: "default-3",
      image: "slider/slider02.JPG",
      title: "Soluciones Tecnológicas a tu Medida",
      description:
        "Ofrecemos soluciones en conectividad, seguridad, monitoreo y datacenter, potenciadas con inteligencia artificial para optimizar procesos y mejorar la eficiencia de tu operación en Chile y Latinoamérica.",
      order: 2,
      isActive: true,
    },
    {
      id: "default-4",
      image: "slider/slider03.JPG",
      title: "Equipo Profesional",
      description: "Expertos dedicados a tu éxito",
      order: 3,
      isActive: true,
    },
    {
      id: "default-5",
      image: "slider/slider05.JPG",
      title: "Resultados",
      description: "Entregando valor real a nuestros clientes",
      order: 4,
      isActive: true,
    },
  ];

  // Usar slides proporcionados o datos por defecto, filtrar solo activos y ordenar
  const SLIDER_ITEMS = slides && slides.length > 0
    ? slides.filter(slide => slide.isActive).sort((a, b) => a.order - b.order)
    : DEFAULT_SLIDER_ITEMS;

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

  useEffect(() => {
    if (!isAutoPlaying) return;

    const autoplayInterval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDER_ITEMS.length);
    }, interval);

    return () => clearInterval(autoplayInterval);
  }, [isAutoPlaying, SLIDER_ITEMS.length, interval]);

  const handleUserInteraction = () => {
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div
      className={`relative w-full p-${SLIDER_CONFIG.padding} ${SLIDER_CONFIG.backgroundColor}`}
    >
      {/* Navigation buttons */}
      <button
        onClick={() => {
          handleUserInteraction();
          prevSlide();
        }}
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
        onClick={() => {
          handleUserInteraction();
          nextSlide();
        }}
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
            <div className="relative h-full overflow-hidden rounded-2xl bg-gray-900">
              <AnimatePresence initial={false}>
                <motion.img
                  key={currentIndex}
                  src={SLIDER_ITEMS[currentIndex].image}
                  alt={SLIDER_ITEMS[currentIndex].title}
                  className="absolute inset-0 w-full h-full object-cover shadow-lg"
                  initial={{ scale: 1, opacity: 0 }}
                  animate={{ 
                    scale: 1.08, // Zoom gradual del 100% al 108%
                    opacity: 1 
                  }}
                  exit={{ scale: 1.1, opacity: 0 }}
                  transition={{ 
                    scale: { 
                      duration: 8, // Zoom más lento durante todo el ciclo
                      ease: "linear" 
                    },
                    opacity: { duration: 0.8, ease: "easeInOut" }
                  }}
                />
              </AnimatePresence>
              
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent rounded-b-2xl z-10">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={`content-${currentIndex}`}
                    className="relative bottom-10 left-10 flex flex-col gap-2 max-w-2xl"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -30, opacity: 0 }}
                    transition={{ 
                      duration: 0.6, 
                      ease: [0.4, 0, 0.2, 1],
                      delay: 0.2 // Pequeño delay para que aparezca después de la imagen
                    }}
                  >
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
                  </motion.div>
                </AnimatePresence>
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
            onClick={() => {
              handleUserInteraction();
              scrollToSlide(index);
            }}
            className={`${
              SLIDER_CONFIG.indicatorSize
            } rounded-full transition-all duration-300 ${
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
