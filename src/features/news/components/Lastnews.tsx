import React, { useState } from "react";

function Lastnews() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 5;

  const NEWS_ITEMS = [
    {
      id: 1,
      date: "2024-09-15",
      url: "#",
      image: "slider/slider04.JPG",
      title: "Te damos la bienvenida a AST Networks",
      subtitle: "Bienvenido",
      description:
        "Conectamos tecnología e innovación para transformar sectores productivos clave en Chile y Latinoamérica.",
    },
    {
      id: 2,
      date: "2024-09-10",
      url: "#",
      image: "slider/slider02.JPG",
      title: "Sostenibilidad y Medio Ambiente",
      subtitle: "AST - Soluciones de vanguardia",
      description:
        "Comprometidos con el medio ambiente y la sostenibilidad empresarial",
    },
    {
      id: 3,
      date: "2024-09-05",
      url: "#",
      image: "slider/slider03.JPG",
      title: "Soluciones Tecnológicas a tu Medida",
      subtitle: "Servicios",
      description:
        "Ofrecemos soluciones en conectividad, seguridad, monitoreo y datacenter, potenciadas con inteligencia artificial.",
    },
    {
      id: 4,
      date: "2024-08-30",
      url: "#",
      image: "slider/slider05.JPG",
      title: "Equipo Profesional de Expertos",
      subtitle: "AST - Recursos Humanos",
      description: "Expertos dedicados a tu éxito empresarial y tecnológico",
    },
    {
      id: 5,
      date: "2024-08-25",
      url: "#",
      image: "slider/slider01.JPG",
      title: "Resultados Medibles",
      subtitle: "AST - Soluciones de vanguardia",
      description:
        "Entregando valor real y resultados medibles a nuestros clientes",
    },
    {
      id: 6,
      date: "2024-08-20",
      url: "#",
      image: "slider/slider04.JPG",
      title: "Innovación en Inteligencia Artificial",
      subtitle: "Tecnología",
      description:
        "Implementamos IA para optimizar procesos y mejorar la eficiencia operacional",
    },
    {
      id: 7,
      date: "2024-08-15",
      url: "#",
      image: "slider/slider02.JPG",
      title: "Seguridad Cibern�tica Avanzada",
      subtitle: "Ciberseguridad",
      description:
        "Protegemos tu información con las últimas tecnologías en seguridad",
    },
    {
      id: 8,
      date: "2024-08-10",
      url: "#",
      image: "slider/slider03.JPG",
      title: "Datacenter de Nueva Generación",
      subtitle: "Infraestructura",
      description: "Centros de datos modernos y eficientes para tu empresa",
    },
    {
      id: 9,
      date: "2024-08-05",
      url: "#",
      image: "slider/slider05.JPG",
      title: "Conectividad Sin Límites",
      subtitle: "Networking",
      description: "Soluciones de conectividad para empresas en expansión",
    },
    {
      id: 10,
      date: "2024-07-30",
      url: "#",
      image: "slider/slider01.JPG",
      title: "Monitoreo 24/7",
      subtitle: "Servicios",
      description: "Supervisión continua de tu infraestructura tecnológica",
    },
    {
      id: 11,
      date: "2024-07-25",
      url: "#",
      image: "slider/slider04.JPG",
      title: "Transformación Digital",
      subtitle: "Consultoría",
      description:
        "Acompañamos tu proceso de transformación digital empresarial",
    },
    {
      id: 12,
      date: "2024-07-20",
      url: "#",
      image: "slider/slider02.JPG",
      title: "Cloud Computing Empresarial",
      subtitle: "Cloud",
      description: "Migración y gestión de servicios en la nube",
    },
    {
      id: 13,
      date: "2024-07-15",
      url: "#",
      image: "slider/slider03.JPG",
      title: "Automatización de Procesos",
      subtitle: "Automatización",
      description: "Optimiza tus procesos con soluciones automatizadas",
    },
    {
      id: 14,
      date: "2024-07-10",
      url: "#",
      image: "slider/slider05.JPG",
      title: "Soporte Técnico Especializado",
      subtitle: "Soporte",
      description: "Equipo técnico disponible para resolver tus consultas",
    },
    {
      id: 15,
      date: "2024-07-05",
      url: "#",
      image: "slider/slider01.JPG",
      title: "Análisis de Datos Avanzado",
      subtitle: "Big Data",
      description: "Convierte tus datos en insights valiosos para tu negocio",
    },
  ];

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
          {getVisibleItems().map((item, index) => (
            <article
              key={index}
              className="relative w-80 rounded-2xl  overflow-hidden h-96 flex-shrink-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-full w-full">
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-5 h-50 flex flex-col justify-end  text-white ">
                <div className="mb-2">
                  <span className="text-xs bg-primary-100 px-2 py-1 rounded-full">
                    {item.subtitle}
                  </span>
                </div>
                <h4 className="text-lg font-bold mb-2 line-clamp-2 h-14 ">
                  {item.title.slice(0, 50)}
                </h4>
                <p className="text-base text-white-100">{item.date}</p>
              </div>
            </article>
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
      </div>
    </div>
  );
}

export default Lastnews;
