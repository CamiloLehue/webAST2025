import React, { useState, useEffect, useMemo } from "react";
import {
  FiBook,
  FiMenu,
  FiUser,
  FiImage,
  FiLayout,
  FiCheckCircle,
  FiAlertCircle,
  FiSearch,
  FiX,
  FiRotateCcw,
  FiPrinter,
  FiChevronUp,
  FiDownload,
} from "react-icons/fi";

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  subsections: {
    id: string;
    title: string;
    description: string;
  }[];
}

const sections: Section[] = [
  {
    id: "introduccion",
    title: "Introducción al Panel",
    icon: <FiBook className="w-5 h-5" />,
    description:
      "Bienvenido al panel de administración. Aquí aprenderás todo lo necesario para gestionar tu sitio web.",
    subsections: [
      {
        id: "intro-panel",
        title: "Primeros Pasos",
        description: "Conoce la interfaz básica y cómo navegar por el panel",
      },
      {
        id: "intro-acceso",
        title: "Acceso y Seguridad",
        description: "Aprende a acceder de forma segura y proteger tu cuenta",
      },
      {
        id: "intro-dashboard",
        title: "Dashboard Principal",
        description: "Comprende los elementos clave del panel de control",
      },
    ],
  },
  {
    id: "paginas",
    title: "Gestión de Páginas",
    icon: <FiLayout className="w-5 h-5" />,
    description:
      "Administra las páginas personalizadas con sistema de secciones modulares.",
    subsections: [
      {
        id: "paginas-crear",
        title: "Crear Páginas",
        description: "Crea páginas con secciones personalizables",
      },
      {
        id: "paginas-secciones",
        title: "Tipos de Secciones",
        description: "Conoce los 16 tipos de secciones disponibles",
      },
      {
        id: "paginas-editar",
        title: "Editar y Reordenar",
        description: "Gestiona el contenido y orden de secciones",
      },
      {
        id: "paginas-seo",
        title: "SEO y Metadatos",
        description: "Optimiza tus páginas para buscadores",
      },
    ],
  },
  {
    id: "blog",
    title: "Gestión de Blog",
    icon: <FiBook className="w-5 h-5" />,
    description:
      "Sistema completo de blog con categorías automáticas y editor rico en funciones.",
    subsections: [
      {
        id: "blog-crear",
        title: "Crear Entradas",
        description: "Guía paso a paso para crear publicaciones",
      },
      {
        id: "blog-editar",
        title: "Editar Entradas",
        description: "Cómo modificar publicaciones existentes",
      },
      {
        id: "blog-categorias",
        title: "Gestión de Categorías",
        description: "Sistema automático de categorías por contenido",
      },
      {
        id: "blog-estados",
        title: "Publicación y Estados",
        description: "Maneja borradores y publicaciones",
      },
    ],
  },
  {
    id: "multimedia",
    title: "Gestión Multimedia",
    icon: <FiImage className="w-5 h-5" />,
    description:
      "Sistema avanzado de gestión de archivos multimedia con categorización y filtros.",
    subsections: [
      {
        id: "multimedia-subir",
        title: "Subir Archivos",
        description: "Carga individual y masiva con progreso en tiempo real",
      },
      {
        id: "multimedia-categorias",
        title: "Categorías y Filtros",
        description: "Organiza por imágenes, videos, SVG y documentos",
      },
      {
        id: "multimedia-editar",
        title: "Editar Metadatos",
        description: "Modifica nombres, tags y descripciones",
      },
      {
        id: "multimedia-optimizacion",
        title: "Límites y Validación",
        description: "Tamaños máximos y tipos permitidos",
      },
    ],
  },
  {
    id: "usuarios",
    title: "Gestión de Usuarios",
    icon: <FiUser className="w-5 h-5" />,
    description:
      "Sistema de usuarios con roles y permisos diferenciados (Admin y Editor).",
    subsections: [
      {
        id: "usuarios-crear",
        title: "Crear Usuarios",
        description: "Añade nuevos usuarios al sistema",
      },
      {
        id: "usuarios-roles",
        title: "Roles y Permisos",
        description: "Administrador vs Editor - Diferencias clave",
      },
      {
        id: "usuarios-editar",
        title: "Editar y Estado",
        description: "Gestiona información y activa/desactiva usuarios",
      },
      {
        id: "usuarios-seguridad",
        title: "Seguridad y Contraseñas",
        description: "Cambio de contraseñas y buenas prácticas",
      },
    ],
  },
  {
    id: "menu",
    title: "Gestión de Menú",
    icon: <FiMenu className="w-5 h-5" />,
    description:
      "Administra la navegación principal del sitio web con submenús anidados.",
    subsections: [
      {
        id: "menu-estructura",
        title: "Estructura del Menú",
        description: "Comprende la organización jerárquica",
      },
      {
        id: "menu-editar",
        title: "Crear y Editar Items",
        description: "Añade y modifica elementos del menú",
      },
      {
        id: "menu-reordenar",
        title: "Reordenar Elementos",
        description: "Cambia el orden de navegación",
      },
    ],
  },
  {
    id: "home",
    title: "Gestión del Home",
    icon: <FiLayout className="w-5 h-5" />,
    description: "Personaliza completamente la página principal del sitio web.",
    subsections: [
      {
        id: "home-hero",
        title: "Sección Hero",
        description: "Configura el banner principal",
      },
      {
        id: "home-slider",
        title: "Slider de Contenido",
        description: "Gestiona el carrusel de imágenes y textos",
      },
      {
        id: "home-secciones",
        title: "Secciones Especiales",
        description: "IA, Video y Contacto",
      },
    ],
  },
];

const Documentation: React.FC = () => {
  const [activeSection, setActiveSection] = useState("introduccion");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Efecto para detectar la sección activa basada en el scroll
  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.flatMap((section) => [
        { id: section.id, element: document.getElementById(section.id) },
        ...section.subsections.map((sub) => ({
          id: sub.id,
          element: document.getElementById(sub.id),
        })),
      ]);

      // Encontrar la sección más cercana al viewport
      let nearestSection = null;
      let minDistance = Infinity;

      sectionElements.forEach(({ id, element }) => {
        if (!element) return;
        const rect = element.getBoundingClientRect();
        const distance = Math.abs(rect.top - 100); // 100px desde la parte superior

        if (distance < minDistance) {
          minDistance = distance;
          nearestSection = id;
        }
      });

      if (nearestSection) {
        setActiveSection(nearestSection);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const markSectionComplete = (sectionId: string) => {
    if (!completedSections.includes(sectionId)) {
      setCompletedSections((prev) => [...prev, sectionId]);
      setShowCompletionMessage(true);
      setTimeout(() => setShowCompletionMessage(false), 3000);

      // Guardar progreso en localStorage
      const updatedSections = [...completedSections, sectionId];
      localStorage.setItem(
        "completedSections",
        JSON.stringify(updatedSections)
      );
    }
  };

  useEffect(() => {
    const savedSections = localStorage.getItem("completedSections");
    if (savedSections) {
      setCompletedSections(JSON.parse(savedSections));
    }

    const savedTheme = localStorage.getItem("docTheme");
    if (savedTheme === "dark") {
      setDarkMode(true);
    }
  }, []);

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;

    const query = searchQuery.toLowerCase();
    return sections
      .map((section) => ({
        ...section,
        subsections: section.subsections.filter(
          (sub) =>
            sub.title.toLowerCase().includes(query) ||
            sub.description.toLowerCase().includes(query)
        ),
      }))
      .filter(
        (section) =>
          section.title.toLowerCase().includes(query) ||
          section.description.toLowerCase().includes(query) ||
          section.subsections.length > 0
      );
  }, [searchQuery]);

  const resetProgress = () => {
    if (
      window.confirm(
        "¿Estás seguro de que quieres resetear todo tu progreso? Esta acción no se puede deshacer."
      )
    ) {
      setCompletedSections([]);
      localStorage.removeItem("completedSections");
      setShowCompletionMessage(true);
      setTimeout(() => setShowCompletionMessage(false), 3000);
    }
  };

  // const toggleDarkMode = () => {
  //   const newMode = !darkMode;
  //   setDarkMode(newMode);
  //   localStorage.setItem("docTheme", newMode ? "dark" : "light");
  // };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const printDocumentation = () => {
    window.print();
  };

  const downloadDocumentation = () => {
    // Crear el contenido HTML completo de la documentación
    const documentContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Guía del Panel - Documentación</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
    h1 { color: #2563eb; font-size: 28px; margin-top: 30px; }
    h2 { color: #1e40af; font-size: 24px; margin-top: 25px; }
    h3 { color: #3b82f6; font-size: 20px; margin-top: 20px; }
    h4 { color: #60a5fa; font-size: 18px; margin-top: 15px; }
    p { margin: 10px 0; }
    ul, ol { margin: 10px 0; padding-left: 30px; }
    li { margin: 5px 0; }
    .section { margin-bottom: 40px; page-break-inside: avoid; }
    .subsection { margin-bottom: 30px; }
    .info-box { background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 15px 0; }
    .warning-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 15px 0; }
    .success-box { background: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 15px 0; }
  </style>
</head>
<body>
  <h1>Guía del Panel de Administración</h1>
  <p><strong>Documentación completa para usuarios principiantes</strong></p>
  
  ${sections.map(section => `
    <div class="section">
      <h2>${section.title}</h2>
      <p>${section.description}</p>
      ${section.subsections.map(sub => `
        <div class="subsection">
          <h3>${sub.title}</h3>
          <p>${sub.description}</p>
        </div>
      `).join('')}
    </div>
  `).join('')}
  
  <div class="section">
    <h2>Soporte y Ayuda</h2>
    <p>Si necesitas ayuda adicional, no dudes en contactar al equipo de soporte.</p>
  </div>
</body>
</html>
    `;

    // Crear el blob con formato compatible con Word
    const blob = new Blob([documentContent], { 
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    });
    
    // Crear URL y descargar
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Documentacion_Panel_Administracion.doc';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setShowSearch(true);
      }
      if (e.key === "Escape" && showSearch) {
        setShowSearch(false);
        setSearchQuery("");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [showSearch]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Cerrar el menú móvil si está abierto
      setShowMobileMenu(false);

      // Actualizar la sección activa inmediatamente
      setActiveSection(sectionId);

      // Usar scrollIntoView para un scroll más confiable
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // Ajustar por el header fijo después del scroll
      const headerOffset = 80;
      setTimeout(() => {
        window.scrollBy({
          top: -headerOffset,
          behavior: "smooth",
        });

        // Efecto visual de resaltado
        element.classList.add("highlight-section");
        setTimeout(() => {
          element.classList.remove("highlight-section");
        }, 1000);
      }, 100);
    }
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <div
      className={`flex min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-bg-100 text-white rounded-lg shadow-lg"
      >
        <FiMenu className="w-6 h-6" />
      </button>

      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => setShowSearch(!showSearch)}
          className={`p-2 ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
          } rounded-lg shadow hover:scale-105 transition-transform`}
          title="Buscar (Ctrl+K)"
        >
          <FiSearch className="w-5 h-5" />
        </button>

        {/* <button
          onClick={toggleDarkMode}
          className={`p-2 ${
            darkMode ? "bg-gray-800 text-yellow-400" : "bg-white text-gray-800"
          } rounded-lg shadow-lg hover:scale-105 transition-transform`}
          title="Cambiar tema"
        >
          {darkMode ? (
            <FiSun className="w-5 h-5" />
          ) : (
            <FiMoon className="w-5 h-5" />
          )}
        </button> */}

        <button
          onClick={printDocumentation}
          className={`p-2 ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
          } rounded-lg shadow-lg hover:scale-105 transition-transform hidden md:block`}
          title="Imprimir documentación"
        >
          <FiPrinter className="w-5 h-5" />
        </button>

        <button
          onClick={downloadDocumentation}
          className={`p-2 ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
          } rounded-lg shadow-lg hover:scale-105 transition-transform hidden md:block`}
          title="Descargar como DOCX"
        >
          <FiDownload className="w-5 h-5" />
        </button>

        <button
          onClick={resetProgress}
          className={`p-2 ${
            darkMode ? "bg-gray-800 text-red-400" : "bg-white text-red-600"
          } rounded-lg shadow hover:scale-105 transition-transform`}
          title="Resetear progreso"
        >
          <FiRotateCcw className="w-5 h-5" />
        </button>
      </div>

      {showSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow-2xl w-full max-w-2xl mx-4`}
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <FiSearch
                  className={`w-5 h-5 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Buscar en la documentación..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`flex-1 outline-none ${
                    darkMode
                      ? "bg-gray-800 text-white"
                      : "bg-white text-gray-800"
                  }`}
                  autoFocus
                />
                <button
                  onClick={() => {
                    setShowSearch(false);
                    setSearchQuery("");
                  }}
                >
                  <FiX
                    className={`w-5 h-5 ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                </button>
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto p-4">
              {filteredSections.length === 0 ? (
                <p
                  className={`text-center ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  } py-8`}
                >
                  No se encontraron resultados
                </p>
              ) : (
                filteredSections.map((section) => (
                  <div key={section.id} className="mb-4">
                    <h3
                      className={`font-semibold ${
                        darkMode ? "text-white" : "text-gray-800"
                      } mb-2`}
                    >
                      {section.title}
                    </h3>
                    {section.subsections.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => {
                          scrollToSection(sub.id);
                          setShowSearch(false);
                          setSearchQuery("");
                        }}
                        className={`block w-full text-left px-4 py-2 rounded hover:bg-blue-50 ${
                          darkMode
                            ? "hover:bg-gray-700 text-gray-300"
                            : "text-gray-600"
                        } transition-colors`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{sub.title}</span>
                          {completedSections.includes(sub.id) && (
                            <FiCheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                        <p
                          className={`text-sm ${
                            darkMode ? "text-gray-500" : "text-gray-400"
                          } mt-1`}
                        >
                          {sub.description}
                        </p>
                      </button>
                    ))}
                  </div>
                ))
              )}
            </div>
            <div
              className={`p-4 border-t ${
                darkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <p
                className={`text-xs ${
                  darkMode ? "text-gray-500" : "text-gray-400"
                } text-center`}
              >
                Presiona ESC para cerrar • Ctrl+K para abrir
              </p>
            </div>
          </div>
        </div>
      )}

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 p-3 bg-bg-100 text-white rounded-full shadow-lg hover:scale-110 transition-transform"
          title="Volver arriba"
        >
          <FiChevronUp className="w-6 h-6" />
        </button>
      )}

      {showCompletionMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-out">
          ¡Sección completada!
        </div>
      )}

      <nav
        className={`fixed top-0 lg:relative w-64 ${
          darkMode ? "bg-gray-800" : "bg-white"
        } shadow-lg h-screen transition-transform duration-300 transform ${
          showMobileMenu
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
        style={{ zIndex: 40 }}
      >
        <div className="p-6 h-full overflow-y-auto">
          <h2
            className={`text-2xl font-bold ${
              darkMode ? "text-blue-400" : "text-bg-200"
            } mb-2`}
          >
            Guía del Panel
          </h2>
          <p
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            } mb-6`}
          >
            Documentación completa para usuarios principiantes
          </p>

          <div
            className={`mb-6 p-4 ${
              darkMode ? "bg-gray-700" : "bg-blue-50"
            } rounded-lg`}
          >
            <h3
              className={`text-sm font-semibold ${
                darkMode ? "text-blue-400" : "text-blue-800"
              } mb-2`}
            >
              Tu Progreso
            </h3>
            {(() => {
              const totalSections = sections.reduce(
                (total, section) => total + section.subsections.length,
                0
              );
              return (
                <>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          (completedSections.length / totalSections) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-blue-600 mt-2">
                    {completedSections.length} de {totalSections} secciones
                    completadas
                  </p>
                </>
              );
            })()}
          </div>

          <div className="space-y-6">
            {sections.map((section) => (
              <div key={section.id} className="space-y-2">
                <button
                  onClick={() => scrollToSection(section.id)}
                  className={`flex items-center w-full p-2 rounded-lg transition-colors cursor-pointer transform hover:scale-102 relative z-50 ${
                    activeSection === section.id
                      ? "border border-accent-100 text-white shadow-md"
                      : "hover:bg-gray-100"
                  }`}
                  role="menuitem"
                  aria-expanded={activeSection === section.id}
                >
                  <span className="mr-3 transition-transform duration-200 text-accent-100">
                    {section.icon}
                  </span>
                  <span className="flex-1 text-left font-medium text-accent-100">
                    {section.title}
                  </span>
                  {completedSections.includes(section.id) && (
                    <FiCheckCircle className="text-green-500 ml-2" />
                  )}
                </button>

                <div className="ml-8 space-y-1 transition-all duration-200">
                  {section.subsections.map((subsection) => (
                    <button
                      key={subsection.id}
                      onClick={() => {
                        scrollToSection(subsection.id);
                        setActiveSection(section.id);
                      }}
                      className={`flex items-center w-full text-sm p-1.5 rounded transition-all duration-200 cursor-pointer
                        ${
                          activeSection === section.id
                            ? "text-bg-200 hover:bg-gray-100"
                            : "text-gray-600 hover:text-bg-200"
                        }
                        hover:pl-3 hover:bg-gray-50`}
                      role="menuitem"
                    >
                      <span className="flex-1 text-left text-nowrap">
                        {subsection.title}
                      </span>
                      {completedSections.includes(subsection.id) && (
                        <FiCheckCircle className="text-green-500 w-4 h-4 ml-2" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </nav>

      <main
        className={`flex-1 p-6 lg:p-8 h-screen overflow-y-scroll ${
          darkMode ? "bg-gray-900" : ""
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <section id="introduccion" className="mb-16">
            <div
              className={`${
                darkMode ? "bg-gray-800" : "bg-white"
              } rounded-lg shadow-sm p-8 mb-8`}
            >
              <div className="flex justify-between items-start mb-6">
                <h1
                  className={`text-4xl font-bold ${
                    darkMode ? "text-blue-400" : "text-bg-200"
                  }`}
                >
                  Bienvenido al Panel de Administración
                </h1>
                <button
                  onClick={() => markSectionComplete("introduccion")}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center ${
                    completedSections.includes("introduccion")
                      ? "bg-green-100 text-green-700"
                      : "bg-bg-100 text-white hover:bg-bg-200"
                  }`}
                >
                  <FiCheckCircle
                    className={`w-5 h-5 mr-2 ${
                      completedSections.includes("introduccion")
                        ? "text-green-500"
                        : ""
                    }`}
                  />
                  {completedSections.includes("introduccion")
                    ? "Completado"
                    : "Marcar como completado"}
                </button>
              </div>
              <p
                className={`text-lg ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                } mb-6`}
              >
                Esta guía te ayudará a aprender paso a paso cómo gestionar tu
                sitio web. Cada sección incluye ejemplos prácticos y consejos
                útiles.
              </p>

              <div
                className={`${
                  darkMode
                    ? "bg-blue-900 border-blue-700"
                    : "bg-blue-50 border-blue-200"
                } border-l-4 border-blue-500 p-4 mb-6 rounded`}
              >
                <div className="flex items-start">
                  <div>
                    <h4
                      className={`font-semibold ${
                        darkMode ? "text-blue-300" : "text-blue-800"
                      } mb-2 flex items-center gap-2`}
                    >
                      <FiAlertCircle className="w-5 h-5" />
                      Funcionalidades
                    </h4>
                    <ul
                      className={`text-sm ${
                        darkMode ? "text-blue-200" : "text-blue-700"
                      } space-y-2`}
                    >
                      <li className="flex items-start gap-2">
                        <FiSearch className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>Buscador:</strong> Presiona{" "}
                          <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">
                            Ctrl+K
                          </kbd>{" "}
                          para buscar en toda la documentación
                        </span>
                      </li>

                      <li className="flex items-start gap-2">
                        <FiRotateCcw className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>Resetear:</strong> Limpia tu progreso cuando
                          quieras empezar de nuevo
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-blue-800 mb-3">
                    ¿Eres nuevo?
                  </h3>
                  <p className="text-blue-700 mb-4">
                    Comienza con los conceptos básicos:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center ">
                      <FiCheckCircle className="text-blue-500 mr-2" />
                      <span className="text-blue-500 font-bold bg-amber-100 rounded px-2 py-2">
                        {" "}
                        Abra una nueva ventana y siga los pasos en tiempo real.
                      </span>
                    </li>
                    <li className="flex items-center">
                      <FiCheckCircle className="text-blue-500 mr-2" />
                      Acceso al panel
                    </li>
                    <li className="flex items-center">
                      <FiCheckCircle className="text-blue-500 mr-2" />
                      Navegación básica
                    </li>
                    <li className="flex items-center">
                      <FiCheckCircle className="text-blue-500 mr-2" />
                      Primeros pasos
                    </li>
                  </ul>
                </div>
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-green-800 mb-3">
                    Consejos Útiles
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <FiAlertCircle className="text-green-500 mr-2 mt-1" />
                      <span>Guarda tus cambios frecuentemente</span>
                    </li>
                    <li className="flex items-start">
                      <FiAlertCircle className="text-green-500 mr-2 mt-1" />
                      <span>Previsualiza antes de publicar</span>
                    </li>
                    <li className="flex items-start">
                      <FiAlertCircle className="text-green-500 mr-2 mt-1" />
                      <span>Mantén copias de seguridad en mongoDB</span>
                    </li>
                    <li className="flex items-start">
                      <FiAlertCircle className="text-green-500 mr-2 mt-1" />
                      <span>Cierra tu sesión al finalizar</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div
              id="intro-panel"
              className="bg-white rounded-lg shadow-sm p-8 mb-8"
            >
              <h2 className="text-3xl font-bold mb-6 text-bg-200">
                Primeros Pasos
              </h2>

              {/* Acceso y Seguridad */}
              <div
                id="intro-acceso"
                className="bg-white rounded-lg shadow-sm p-8 mb-8"
              >
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-semibold">Acceso y Seguridad</h3>
                  <button
                    onClick={() => markSectionComplete("intro-acceso")}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center ${
                      completedSections.includes("intro-acceso")
                        ? "bg-green-100 text-green-700"
                        : "bg-bg-100 text-white hover:bg-bg-200"
                    }`}
                  >
                    <FiCheckCircle
                      className={`w-5 h-5 mr-2 ${
                        completedSections.includes("intro-acceso")
                          ? "text-green-500"
                          : ""
                      }`}
                    />
                    {completedSections.includes("intro-acceso")
                      ? "Completado"
                      : "Marcar como completado"}
                  </button>
                </div>
                <div className="space-y-6">
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="text-xl font-medium mb-4">
                      Autenticación Segura
                    </h4>
                    <ul className="list-disc list-inside space-y-3">
                      <li>Utiliza contraseñas fuertes y únicas</li>
                      <li>Activa la autenticación de dos factores</li>
                      <li>Mantén actualizada tu información de contacto</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Dashboard Principal */}
              <div
                id="intro-dashboard"
                className="bg-white rounded-lg shadow-sm p-8 mb-8"
              >
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-semibold">
                    Dashboard Principal
                  </h3>
                  <button
                    onClick={() => markSectionComplete("intro-dashboard")}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center ${
                      completedSections.includes("intro-dashboard")
                        ? "bg-green-100 text-green-700"
                        : "bg-bg-100 text-white hover:bg-bg-200"
                    }`}
                  >
                    <FiCheckCircle
                      className={`w-5 h-5 mr-2 ${
                        completedSections.includes("intro-dashboard")
                          ? "text-green-500"
                          : ""
                      }`}
                    />
                    {completedSections.includes("intro-dashboard")
                      ? "Completado"
                      : "Marcar como completado"}
                  </button>
                </div>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="text-xl font-medium mb-4">
                        Resumen General
                      </h4>
                      <ul className="list-disc list-inside space-y-2">
                        <li>Estadísticas de visitas</li>
                        <li>Últimas actividades</li>
                        <li>Estado del sistema</li>
                      </ul>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="text-xl font-medium mb-4">
                        Accesos Rápidos
                      </h4>
                      <ul className="list-disc list-inside space-y-2">
                        <li>Crear nuevo contenido</li>
                        <li>Gestionar usuarios</li>
                        <li>Ver estadísticas</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="text-xl font-semibold mb-2">
                    Accediendo al Panel
                  </h3>
                  <ol className="list-decimal list-inside space-y-3">
                    <li className="text-gray-700">
                      Ingresa a la URL del panel administrativo
                      <div className="ml-6 mt-2 p-3 bg-gray-50 rounded-md">
                        <code className="text-sm">https://ast.cl/admin</code>
                      </div>
                    </li>
                    <li className="text-gray-700">
                      Introduce tus credenciales:
                      <ul className="list-disc list-inside ml-6 mt-2">
                        <li>Usuario o correo electrónico</li>
                        <li>Contraseña</li>
                        <li>Código de autenticación (si está habilitado)</li>
                      </ul>
                    </li>
                  </ol>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="text-xl font-semibold mb-2">
                    Navegación Básica
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Menú Principal</h4>
                      <ul className="list-disc list-inside space-y-2">
                        <li>Dashboard - Resumen general</li>
                        <li>Blog - Gestión de contenidos</li>
                        <li>Multimedia - Archivos y medios</li>
                        <li>Usuarios - Gestión de accesos</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Acciones Comunes</h4>
                      <ul className="list-disc list-inside space-y-2">
                        <li>Crear nuevo contenido</li>
                        <li>Editar elementos existentes</li>
                        <li>Buscar y filtrar</li>
                        <li>Guardar cambios</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="text-yellow-800 font-semibold mb-2">
                    Consejos de Seguridad
                  </h4>
                  <ul className="list-disc list-inside text-yellow-700">
                    <li>Cambia tu contraseña regularmente</li>
                    <li>No compartas tus credenciales</li>
                    <li>Cierra sesión al terminar</li>
                    <li>Usa una conexión segura</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Sección Páginas */}
          <section id="paginas" className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-bg-200">
              Gestión de Páginas
            </h2>

            <div
              id="paginas-crear"
              className="bg-white rounded-lg shadow-sm p-8 mb-8"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-semibold">Crear Nuevas Páginas</h3>
                <button
                  onClick={() => markSectionComplete("paginas-crear")}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center ${
                    completedSections.includes("paginas-crear")
                      ? "bg-green-100 text-green-700"
                      : "bg-bg-100 text-white hover:bg-bg-200"
                  }`}
                >
                  <FiCheckCircle
                    className={`w-5 h-5 mr-2 ${
                      completedSections.includes("paginas-crear")
                        ? "text-green-500"
                        : ""
                    }`}
                  />
                  {completedSections.includes("paginas-crear")
                    ? "Completado"
                    : "Marcar como completado"}
                </button>
              </div>

              <div className="space-y-8">
                {/* Proceso de creación */}
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="text-xl font-medium mb-4">
                    Proceso de Creación
                  </h4>
                  <ol className="list-decimal list-inside space-y-4">
                    <li className="text-gray-700">
                      Accede a la sección de páginas
                      <div className="mt-2 p-4 bg-gray-50 rounded-md">
                        <p className="text-sm text-gray-600">
                          Encuentra "Páginas" en el menú principal del panel de
                          administración
                        </p>
                      </div>
                    </li>
                    <li className="text-gray-700">
                      Haz clic en "Nueva Página"
                      <ul className="list-disc list-inside ml-6 mt-2">
                        <li>Página en blanco</li>
                        <li>Usar plantilla</li>
                        <li>Duplicar existente</li>
                      </ul>
                    </li>
                    <li className="text-gray-700">
                      Configura los ajustes básicos
                      <ul className="list-disc list-inside ml-6 mt-2">
                        <li>Título de la página</li>
                        <li>URL amigable</li>
                        <li>Plantilla de diseño</li>
                      </ul>
                    </li>
                  </ol>
                </div>

                {/* Editor de contenido */}
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="text-xl font-medium mb-4">
                    Editor de Contenido
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium mb-2">
                        Herramientas Disponibles
                      </h5>
                      <ul className="list-disc list-inside space-y-2">
                        <li>Editor visual (WYSIWYG)</li>
                        <li>Editor de código</li>
                        <li>Bloques personalizados</li>
                        <li>Componentes reutilizables</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Elementos de Página</h5>
                      <ul className="list-disc list-inside space-y-2">
                        <li>Encabezados y textos</li>
                        <li>Imágenes y galerías</li>
                        <li>Formularios</li>
                        <li>Widgets incrustados</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Consejos y mejores prácticas */}
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="text-blue-800 font-semibold mb-3">
                    Mejores Prácticas
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-blue-700 mb-2">Diseño</h5>
                      <ul className="list-disc list-inside space-y-2 text-blue-600">
                        <li>Mantén un diseño consistente</li>
                        <li>Usa espaciado adecuado</li>
                        <li>Optimiza para móviles</li>
                        <li>Prueba en diferentes dispositivos</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-blue-700 mb-2">
                        Contenido
                      </h5>
                      <ul className="list-disc list-inside space-y-2 text-blue-600">
                        <li>Estructura clara y lógica</li>
                        <li>Contenido relevante y actual</li>
                        <li>Enlaces internos efectivos</li>
                        <li>Llamadas a la acción claras</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tipos de Secciones */}
            <div
              id="paginas-secciones"
              className="bg-white rounded-lg shadow-sm p-8 mb-8"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-semibold">
                  Tipos de Secciones Disponibles
                </h3>
                <button
                  onClick={() => markSectionComplete("paginas-secciones")}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center ${
                    completedSections.includes("paginas-secciones")
                      ? "bg-green-100 text-green-700"
                      : "bg-bg-100 text-white hover:bg-bg-200"
                  }`}
                >
                  <FiCheckCircle
                    className={`w-5 h-5 mr-2 ${
                      completedSections.includes("paginas-secciones")
                        ? "text-green-500"
                        : ""
                    }`}
                  />
                  {completedSections.includes("paginas-secciones")
                    ? "Completado"
                    : "Marcar como completado"}
                </button>
              </div>

              <div className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Secciones de Contenido Básico */}
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="text-xl font-medium mb-4">
                      Contenido Básico
                    </h4>
                    <ul className="space-y-3">
                      <li>
                        <strong>Hero:</strong> Banner principal con título,
                        subtítulo, imagen y botón
                      </li>
                      <li>
                        <strong>Hero Multi:</strong> Hero con múltiples
                        variantes
                      </li>
                      <li>
                        <strong>Logo Section:</strong> Sección para mostrar
                        logos
                      </li>
                      <li>
                        <strong>Text:</strong> Bloques de texto con formato
                      </li>
                      <li>
                        <strong>Spacer:</strong> Espaciado personalizable entre
                        secciones
                      </li>
                    </ul>
                  </div>

                  {/* Secciones Multimedia */}
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="text-xl font-medium mb-4">Multimedia</h4>
                    <ul className="space-y-3">
                      <li>
                        <strong>Image:</strong> Imagen individual con opciones
                        de alineación
                      </li>
                      <li>
                        <strong>Gallery:</strong> Galería de imágenes con
                        columnas configurables
                      </li>
                      <li>
                        <strong>Video:</strong> Reproductor de video con
                        controles
                      </li>
                      <li>
                        <strong>Clients Carousel:</strong> Carrusel de
                        clientes/logos
                      </li>
                    </ul>
                  </div>

                  {/* Secciones Interactivas */}
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="text-xl font-medium mb-4">Interactivas</h4>
                    <ul className="space-y-3">
                      <li>
                        <strong>Contact Form:</strong> Formulario de contacto
                        personalizable
                      </li>
                      <li>
                        <strong>CTA:</strong> Llamadas a la acción destacadas
                      </li>
                      <li>
                        <strong>Features:</strong> Características con íconos y
                        descripciones
                      </li>
                      <li>
                        <strong>Testimonials:</strong> Testimonios de clientes
                      </li>
                    </ul>
                  </div>

                  {/* Secciones Especiales */}
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <h4 className="text-xl font-medium mb-4">Especiales</h4>
                    <ul className="space-y-3">
                      <li>
                        <strong>Content Section:</strong> Sección de contenido
                        compleja
                      </li>
                      <li>
                        <strong>Curved Section:</strong> Sección con bordes
                        curvos
                      </li>
                      <li>
                        <strong>Team Cards:</strong> Tarjetas de equipo/personal
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Configuración de Secciones */}
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="text-blue-800 font-semibold mb-3">
                    Configuración Común
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4 text-blue-700">
                    <div>
                      <h5 className="font-medium mb-2">Propiedades</h5>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Orden de visualización</li>
                        <li>Ancho de grid (columnas)</li>
                        <li>ID único de sección</li>
                        <li>Tipo de contenido</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Gestión</h5>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Reordenar arrastrando</li>
                        <li>Editar en modal</li>
                        <li>Duplicar sección</li>
                        <li>Eliminar sección</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Edición de Páginas */}
            <div
              id="paginas-editar"
              className="bg-white rounded-lg shadow-sm p-8 mb-8"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-semibold">
                  Editar y Reordenar Páginas
                </h3>
                <button
                  onClick={() => markSectionComplete("paginas-editar")}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center ${
                    completedSections.includes("paginas-editar")
                      ? "bg-green-100 text-green-700"
                      : "bg-bg-100 text-white hover:bg-bg-200"
                  }`}
                >
                  <FiCheckCircle
                    className={`w-5 h-5 mr-2 ${
                      completedSections.includes("paginas-editar")
                        ? "text-green-500"
                        : ""
                    }`}
                  />
                  {completedSections.includes("paginas-editar")
                    ? "Completado"
                    : "Marcar como completado"}
                </button>
              </div>
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="text-xl font-medium mb-4">
                    Proceso de Edición
                  </h4>
                  <ol className="list-decimal list-inside space-y-3">
                    <li>
                      <strong>Acceder a la edición:</strong> Click en el ícono
                      de editar en la lista de páginas
                    </li>
                    <li>
                      <strong>Información básica:</strong>
                      <ul className="list-disc list-inside ml-6 mt-2">
                        <li>Título de la página</li>
                        <li>Slug (URL amigable)</li>
                        <li>Estado de publicación</li>
                        <li>Meta título y descripción</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Gestionar secciones:</strong>
                      <ul className="list-disc list-inside ml-6 mt-2">
                        <li>Añadir nueva sección desde el selector</li>
                        <li>Editar sección existente (modal con formulario)</li>
                        <li>Reordenar arrastrando las secciones</li>
                        <li>Eliminar secciones no deseadas</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Guardar cambios:</strong> Los cambios se envían a
                      la API y se actualizan en tiempo real
                    </li>
                  </ol>
                </div>

                <div className="bg-yellow-50 p-6 rounded-lg">
                  <h4 className="text-yellow-800 font-semibold mb-3">
                    Consejos Importantes
                  </h4>
                  <ul className="list-disc list-inside text-yellow-700 space-y-2">
                    <li>
                      El slug debe ser único y no contener espacios (usa
                      guiones)
                    </li>
                    <li>
                      Las páginas en borrador no son visibles públicamente
                    </li>
                    <li>
                      Cada sección tiene su propio formulario de configuración
                    </li>
                    <li>
                      El orden de las secciones se actualiza automáticamente al
                      reordenar
                    </li>
                    <li>Puedes previsualizar la página antes de publicar</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* SEO y Optimización */}
            <div
              id="paginas-seo"
              className="bg-white rounded-lg shadow-sm p-8 mb-8"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-semibold">SEO y Metadatos</h3>
                <button
                  onClick={() => markSectionComplete("paginas-seo")}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center ${
                    completedSections.includes("paginas-seo")
                      ? "bg-green-100 text-green-700"
                      : "bg-bg-100 text-white hover:bg-bg-200"
                  }`}
                >
                  <FiCheckCircle
                    className={`w-5 h-5 mr-2 ${
                      completedSections.includes("paginas-seo")
                        ? "text-green-500"
                        : ""
                    }`}
                  />
                  {completedSections.includes("paginas-seo")
                    ? "Completado"
                    : "Marcar como completado"}
                </button>
              </div>

              <div className="space-y-6">
                {/* Configuración SEO */}
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="text-xl font-medium mb-4">
                    Configuración SEO
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium mb-2">Metadatos Básicos</h5>
                      <ul className="list-disc list-inside space-y-2">
                        <li>Título SEO (meta title)</li>
                        <li>Descripción meta</li>
                        <li>Palabras clave</li>
                        <li>URLs amigables</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h6 className="font-medium mb-2">
                        Ejemplo de Meta Título:
                      </h6>
                      <code className="text-sm block">
                        Servicios de Desarrollo Web | Tu Empresa - Palabras
                        Clave
                      </code>
                      <p className="text-sm text-gray-600 mt-2">
                        Límite recomendado: 60 caracteres
                      </p>
                    </div>
                  </div>
                </div>

                {/* Optimización de Contenido */}
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="text-xl font-medium mb-4">
                    Optimización de Contenido
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium mb-2">Estructura</h5>
                      <ul className="list-disc list-inside space-y-2">
                        <li>Encabezados jerárquicos (H1-H6)</li>
                        <li>Párrafos concisos</li>
                        <li>Listas organizadas</li>
                        <li>Enlaces internos relevantes</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Multimedia</h5>
                      <ul className="list-disc list-inside space-y-2">
                        <li>Textos alternativos en imágenes</li>
                        <li>Nombres de archivo descriptivos</li>
                        <li>Optimización de imágenes</li>
                        <li>Videos con transcripciones</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Tips de SEO */}
                <div className="bg-yellow-50 p-6 rounded-lg">
                  <h4 className="text-yellow-800 font-semibold mb-3">
                    Tips para Mejor SEO
                  </h4>
                  <ul className="list-disc list-inside text-yellow-700 space-y-2">
                    <li>Mantén el contenido actualizado y relevante</li>
                    <li>Usa palabras clave de manera natural</li>
                    <li>Optimiza para búsquedas móviles</li>
                    <li>Crea contenido único y valioso</li>
                    <li>Monitorea el rendimiento con analytics</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Sección Blog */}
          <section id="blog" className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-bg-200">
              Gestión de Blog
            </h2>

            <div
              id="blog-crear"
              className="bg-white rounded-lg shadow-sm p-8 mb-8"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-semibold">
                  Crear Nuevas Entradas
                </h3>
                <button
                  onClick={() => markSectionComplete("blog-crear")}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center ${
                    completedSections.includes("blog-crear")
                      ? "bg-green-100 text-green-700"
                      : "bg-bg-100 text-white hover:bg-bg-200"
                  }`}
                >
                  <FiCheckCircle
                    className={`w-5 h-5 mr-2 ${
                      completedSections.includes("blog-crear")
                        ? "text-green-500"
                        : ""
                    }`}
                  />
                  {completedSections.includes("blog-crear")
                    ? "Completado"
                    : "Marcar como completado"}
                </button>
              </div>

              {/* Aquí continúa el contenido existente de blog-crear */}

              <div className="space-y-8">
                {/* Paso 1 */}
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="text-xl font-medium mb-4">
                    Paso 1: Iniciar Nueva Entrada
                  </h4>
                  <ol className="list-decimal list-inside space-y-3">
                    <li className="text-gray-700">
                      Localiza el botón "Nueva Entrada" en la sección de Blog
                      <div className="mt-2 p-4 bg-gray-50 rounded-md">
                        <p className="text-sm text-gray-600">
                          Generalmente encontrarás este botón en la esquina
                          superior derecha de la página principal del blog
                        </p>
                      </div>
                    </li>
                    <li className="text-gray-700">
                      Selecciona el tipo de entrada:
                      <ul className="list-disc list-inside ml-6 mt-2">
                        <li>Artículo estándar</li>
                        <li>Noticia</li>
                        <li>Tutorial</li>
                        <li>Caso de estudio</li>
                      </ul>
                    </li>
                  </ol>
                </div>

                {/* Paso 2 */}
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="text-xl font-medium mb-4">
                    Paso 2: Configuración Básica
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium mb-2">Título de la Entrada</h5>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm text-gray-600 mb-2">
                          Tips para un buen título:
                        </p>
                        <ul className="list-disc list-inside text-sm text-gray-600">
                          <li>Sé conciso y claro</li>
                          <li>Incluye palabras clave relevantes</li>
                          <li>Mantén un límite de 60 caracteres</li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium mb-2">URL Amigable</h5>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm text-gray-600 mb-2">
                          Se genera automáticamente, pero puedes personalizarla:
                        </p>
                        <code className="text-sm block mb-2">
                          https://ast.cl/blog/titulo-de-tu-entrada
                        </code>
                        <p className="text-sm text-gray-600">
                          Usa guiones para separar palabras
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Paso 3 */}
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="text-xl font-medium mb-4">
                    Paso 3: Editor de Contenido
                  </h4>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-medium mb-2">
                          Barra de Herramientas
                        </h5>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                          <li>Formato de texto</li>
                          <li>Insertar enlaces</li>
                          <li>Añadir medios</li>
                          <li>Bloques especiales</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Accesos Rápidos</h5>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                          <li>Ctrl + B: Negrita</li>
                          <li>Ctrl + I: Cursiva</li>
                          <li>Ctrl + K: Insertar enlace</li>
                          <li>Ctrl + S: Guardar</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Consejos */}
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="text-blue-800 font-semibold mb-3">
                    Consejos para Crear Contenido
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-blue-700 mb-2">
                        Estructura
                      </h5>
                      <ul className="list-disc list-inside space-y-2 text-blue-600">
                        <li>Usa títulos y subtítulos</li>
                        <li>Párrafos cortos y concisos</li>
                        <li>Incluye listas cuando sea posible</li>
                        <li>Añade imágenes relevantes</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-blue-700 mb-2">SEO</h5>
                      <ul className="list-disc list-inside space-y-2 text-blue-600">
                        <li>Incluye palabras clave naturalmente</li>
                        <li>Optimiza títulos y descripciones</li>
                        <li>Usa alt-text en imágenes</li>
                        <li>Enlaces internos relevantes</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Editar Entradas */}
            <div
              id="blog-editar"
              className="bg-white rounded-lg shadow-sm p-8 mb-8"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-semibold">Editar Entradas</h3>
                <button
                  onClick={() => markSectionComplete("blog-editar")}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center ${
                    completedSections.includes("blog-editar")
                      ? "bg-green-100 text-green-700"
                      : "bg-bg-100 text-white hover:bg-bg-200"
                  }`}
                >
                  <FiCheckCircle
                    className={`w-5 h-5 mr-2 ${
                      completedSections.includes("blog-editar")
                        ? "text-green-500"
                        : ""
                    }`}
                  />
                  {completedSections.includes("blog-editar")
                    ? "Completado"
                    : "Marcar como completado"}
                </button>
              </div>
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="text-xl font-medium mb-4">
                    Proceso de Edición
                  </h4>
                  <ol className="list-decimal list-inside space-y-3">
                    <li>
                      <strong>Localizar la entrada:</strong> Busca en la lista o
                      usa filtros
                      <ul className="list-disc list-inside ml-6 mt-2">
                        <li>Búsqueda por título o contenido</li>
                        <li>Filtro por estado (publicado/borrador)</li>
                        <li>Filtro por categoría</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Realizar cambios:</strong>
                      <ul className="list-disc list-inside ml-6 mt-2">
                        <li>Editar título, slug, contenido</li>
                        <li>Cambiar imagen destacada</li>
                        <li>Modificar categoría y tags</li>
                        <li>Actualizar extracto</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Validación automática:</strong>
                      <ul className="list-disc list-inside ml-6 mt-2">
                        <li>El slug se valida para ser único</li>
                        <li>Se actualiza automáticamente updatedAt</li>
                        <li>Si se publica, se establece publishedAt</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Guardar:</strong> Los cambios se envían a la API y
                      se invalida el caché
                    </li>
                  </ol>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg">
                  <h4 className="text-purple-800 font-semibold mb-3">
                    Sistema de Caché
                  </h4>
                  <p className="text-purple-700 mb-2">
                    El sistema utiliza un{" "}
                    <strong>sistema de caché inteligente</strong>:
                  </p>
                  <ul className="list-disc list-inside text-purple-700 space-y-2">
                    <li>
                      En el admin, siempre se obtienen datos frescos
                      (skipCache=true)
                    </li>
                    <li>
                      Al crear, actualizar o eliminar, se invalida el caché
                      automáticamente
                    </li>
                    <li>
                      Esto asegura que siempre veas la información más
                      actualizada
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Gestión de Categorías */}
            <div
              id="blog-categorias"
              className="bg-white rounded-lg shadow-sm p-8 mb-8"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-semibold">
                  Sistema de Categorías Automático
                </h3>
                <button
                  onClick={() => markSectionComplete("blog-categorias")}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center ${
                    completedSections.includes("blog-categorias")
                      ? "bg-green-100 text-green-700"
                      : "bg-bg-100 text-white hover:bg-bg-200"
                  }`}
                >
                  <FiCheckCircle
                    className={`w-5 h-5 mr-2 ${
                      completedSections.includes("blog-categorias")
                        ? "text-green-500"
                        : ""
                    }`}
                  />
                  {completedSections.includes("blog-categorias")
                    ? "Completado"
                    : "Marcar como completado"}
                </button>
              </div>
              <div className="space-y-6">
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="text-xl font-medium mb-4">Cómo Funciona</h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium mb-2">
                        Extracción Automática
                      </h5>
                      <ul className="list-disc list-inside space-y-2">
                        <li>
                          Las categorías se extraen automáticamente de los posts
                          existentes
                        </li>
                        <li>No requiere gestión manual de categorías</li>
                        <li>
                          Se actualizan dinámicamente al crear/editar posts
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">
                        Propiedades de Categoría
                      </h5>
                      <ul className="list-disc list-inside space-y-2">
                        <li>
                          <strong>ID:</strong> Generado automáticamente desde el
                          slug
                        </li>
                        <li>
                          <strong>Nombre:</strong> Texto de la categoría
                        </li>
                        <li>
                          <strong>Slug:</strong> Versión URL-friendly del nombre
                        </li>
                        <li>
                          <strong>Descripción:</strong> Generada automáticamente
                        </li>
                        <li>
                          <strong>Color:</strong> Asignado por hash del nombre
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">
                        Función de Generación de Slug
                      </h5>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm text-gray-600 mb-2">
                          Convierte texto a formato URL:
                        </p>
                        <ul className="list-disc list-inside text-sm text-gray-600">
                          <li>Minúsculas</li>
                          <li>Sin caracteres especiales</li>
                          <li>Espacios reemplazados por guiones</li>
                          <li>Guiones múltiples simplificados</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="text-blue-800 font-semibold mb-3">
                    Tags vs Categorías
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4 text-blue-700">
                    <div>
                      <h5 className="font-medium mb-2">Tags</h5>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Array de strings en cada post</li>
                        <li>Múltiples tags por post</li>
                        <li>Se gestionan individualmente</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Categorías</h5>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Una categoría por post</li>
                        <li>Se extraen automáticamente</li>
                        <li>Colores generados por hash</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Estados y Publicación */}
            <div
              id="blog-estados"
              className="bg-white rounded-lg shadow-sm p-8 mb-8"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-semibold">
                  Publicación y Estados
                </h3>
                <button
                  onClick={() => markSectionComplete("blog-estados")}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center ${
                    completedSections.includes("blog-estados")
                      ? "bg-green-100 text-green-700"
                      : "bg-bg-100 text-white hover:bg-bg-200"
                  }`}
                >
                  <FiCheckCircle
                    className={`w-5 h-5 mr-2 ${
                      completedSections.includes("blog-estados")
                        ? "text-green-500"
                        : ""
                    }`}
                  />
                  {completedSections.includes("blog-estados")
                    ? "Completado"
                    : "Marcar como completado"}
                </button>
              </div>
              <div className="space-y-6">
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="text-xl font-medium mb-4">
                    Estados de Publicación
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium mb-2">
                        Borrador (isPublished: false)
                      </h5>
                      <ul className="list-disc list-inside space-y-2">
                        <li>No visible públicamente</li>
                        <li>Solo accesible desde el admin</li>
                        <li>publishedAt está vacío o null</li>
                        <li>Se puede editar libremente</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">
                        Publicado (isPublished: true)
                      </h5>
                      <ul className="list-disc list-inside space-y-2">
                        <li>Visible públicamente</li>
                        <li>publishedAt se establece automáticamente</li>
                        <li>Aparece en listados públicos</li>
                        <li>Indexado para SEO</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4">
                  <h4 className="text-xl font-medium mb-4">
                    Fechas de Gestión
                  </h4>
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      <strong>createdAt:</strong> Fecha de creación (se
                      establece una vez)
                    </li>
                    <li>
                      <strong>updatedAt:</strong> Última modificación (se
                      actualiza en cada edición)
                    </li>
                    <li>
                      <strong>publishedAt:</strong> Fecha de publicación (se
                      establece al publicar)
                    </li>
                  </ul>
                </div>

                <div className="bg-yellow-50 p-6 rounded-lg">
                  <h4 className="text-yellow-800 font-semibold mb-3">
                    Flujo de Trabajo Recomendado
                  </h4>
                  <ol className="list-decimal list-inside text-yellow-700 space-y-2">
                    <li>Crear post en estado borrador</li>
                    <li>Escribir y revisar contenido</li>
                    <li>Añadir imágenes y formato</li>
                    <li>Verificar SEO y metadatos</li>
                    <li>Cambiar a publicado cuando esté listo</li>
                    <li>Sistema establece publishedAt automáticamente</li>
                  </ol>
                </div>
              </div>
            </div>
          </section>

          {/* Sección Multimedia */}
          <section id="multimedia" className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-bg-200">
              Gestión Multimedia
            </h2>

            <div
              id="multimedia-subir"
              className="bg-white rounded-lg shadow-sm p-8 mb-8"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-semibold">Subir Archivos</h3>
                <button
                  onClick={() => markSectionComplete("multimedia-subir")}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center ${
                    completedSections.includes("multimedia-subir")
                      ? "bg-green-100 text-green-700"
                      : "bg-bg-100 text-white hover:bg-bg-200"
                  }`}
                >
                  <FiCheckCircle
                    className={`w-5 h-5 mr-2 ${
                      completedSections.includes("multimedia-subir")
                        ? "text-green-500"
                        : ""
                    }`}
                  />
                  {completedSections.includes("multimedia-subir")
                    ? "Completado"
                    : "Marcar como completado"}
                </button>
              </div>

              <div className="space-y-8">
                {/* Métodos de subida */}
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="text-xl font-medium mb-4">
                    Métodos de Subida
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium mb-2">Subida Individual</h5>
                      <ul className="list-disc list-inside space-y-2">
                        <li>Seleccionar archivo</li>
                        <li>Arrastrar y soltar</li>
                        <li>Pegar desde portapapeles</li>
                        <li>URL remota</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Subida Masiva</h5>
                      <ul className="list-disc list-inside space-y-2">
                        <li>Múltiples archivos</li>
                        <li>Carpetas completas</li>
                        <li>Importación por lotes</li>
                        <li>Sincronización automática</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Organización */}
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="text-xl font-medium mb-4">
                    Organización de Archivos
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium mb-2">
                        Estructura de Carpetas
                      </h5>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <ul className="list-disc list-inside space-y-2 text-gray-600">
                          <li>
                            Imágenes
                            <ul className="list-disc list-inside ml-4">
                              <li>Blog</li>
                              <li>Productos</li>
                              <li>Banners</li>
                            </ul>
                          </li>
                          <li>Documentos</li>
                          <li>Videos</li>
                          <li>Descargas</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mejores prácticas */}
                <div className="bg-yellow-50 p-6 rounded-lg">
                  <h4 className="text-yellow-800 font-semibold mb-3">
                    Mejores Prácticas
                  </h4>
                  <ul className="list-disc list-inside text-yellow-700 space-y-2">
                    <li>Nombra los archivos de manera descriptiva</li>
                    <li>Organiza por fecha y categoría</li>
                    <li>Mantén un sistema de etiquetas</li>
                    <li>Haz copias de seguridad regulares</li>
                    <li>Revisa y limpia archivos obsoletos</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Categorías y Filtros */}
            <div
              id="multimedia-categorias"
              className="bg-white rounded-lg shadow-sm p-8 mb-8"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-semibold">
                  Categorías y Sistema de Filtros
                </h3>
                <button
                  onClick={() => markSectionComplete("multimedia-categorias")}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center ${
                    completedSections.includes("multimedia-categorias")
                      ? "bg-green-100 text-green-700"
                      : "bg-bg-100 text-white hover:bg-bg-200"
                  }`}
                >
                  <FiCheckCircle
                    className={`w-5 h-5 mr-2 ${
                      completedSections.includes("multimedia-categorias")
                        ? "text-green-500"
                        : ""
                    }`}
                  />
                  {completedSections.includes("multimedia-categorias")
                    ? "Completado"
                    : "Marcar como completado"}
                </button>
              </div>

              <div className="space-y-6">
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="text-xl font-medium mb-4">
                    Categorías Disponibles
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium mb-2">image (Imágenes)</h5>
                      <ul className="list-disc list-inside space-y-2">
                        <li>JPEG, JPG, PNG, GIF</li>
                        <li>WebP, AVIF, BMP, TIFF</li>
                        <li>Tamaño máximo: 10MB</li>
                        <li>Dimensiones automáticas (width/height)</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">video (Videos)</h5>
                      <ul className="list-disc list-inside space-y-2">
                        <li>MP4, WebM, OGG, AVI</li>
                        <li>MOV, WMV, FLV, MKV</li>
                        <li>Tamaño máximo: 100MB</li>
                        <li>Duración automática</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">
                        svg (Gráficos Vectoriales)
                      </h5>
                      <ul className="list-disc list-inside space-y-2">
                        <li>Solo SVG+XML</li>
                        <li>Tamaño máximo: 1MB</li>
                        <li>Escalable sin pérdida</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">
                        document (Documentos)
                      </h5>
                      <ul className="list-disc list-inside space-y-2">
                        <li>PDF, Word (DOC/DOCX)</li>
                        <li>Excel (XLS/XLSX)</li>
                        <li>Tamaño máximo: 20MB</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="text-xl font-medium mb-4">
                    Sistema de Filtros
                  </h4>
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      <strong>Búsqueda:</strong> Por nombre de archivo o
                      descripción
                    </li>
                    <li>
                      <strong>Categoría:</strong> Filtra por tipo de archivo
                    </li>
                    <li>
                      <strong>Tags:</strong> Busca por etiquetas asignadas
                    </li>
                    <li>
                      <strong>Ordenamiento:</strong> Por nombre, fecha, tamaño o
                      categoría
                    </li>
                    <li>
                      <strong>Orden:</strong> Ascendente o descendente
                    </li>
                    <li>
                      <strong>Paginación:</strong> Límite configurable por
                      página
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="text-blue-800 font-semibold mb-3">
                    Ejemplo de Filtros
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <pre className="text-sm overflow-x-auto">
                      {`{
  search: "logo",
  category: "image",
  tags: ["banner", "principal"],
  sortField: "created_at",
  sortOrder: "desc",
  page: 1,
  limit: 12
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Editar Metadatos */}
            <div
              id="multimedia-editar"
              className="bg-white rounded-lg shadow-sm p-8 mb-8"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-semibold">Editar Metadatos</h3>
                <button
                  onClick={() => markSectionComplete("multimedia-editar")}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center ${
                    completedSections.includes("multimedia-editar")
                      ? "bg-green-100 text-green-700"
                      : "bg-bg-100 text-white hover:bg-bg-200"
                  }`}
                >
                  <FiCheckCircle
                    className={`w-5 h-5 mr-2 ${
                      completedSections.includes("multimedia-editar")
                        ? "text-green-500"
                        : ""
                    }`}
                  />
                  {completedSections.includes("multimedia-editar")
                    ? "Completado"
                    : "Marcar como completado"}
                </button>
              </div>

              <div className="space-y-6">
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="text-xl font-medium mb-4">Campos Editables</h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium mb-2">Información Básica</h5>
                      <ul className="list-disc list-inside space-y-2">
                        <li>
                          <strong>filename:</strong> Nombre del archivo (sin
                          extensión)
                        </li>
                        <li>
                          <strong>category:</strong> Cambiar categoría si es
                          necesario
                        </li>
                        <li>
                          <strong>description:</strong> Descripción del archivo
                        </li>
                        <li>
                          <strong>alt:</strong> Texto alternativo para
                          accesibilidad
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Organización</h5>
                      <ul className="list-disc list-inside space-y-2">
                        <li>
                          <strong>tags:</strong> Array de etiquetas para
                          búsqueda
                        </li>
                        <li>
                          Las etiquetas facilitan encontrar archivos
                          relacionados
                        </li>
                        <li>Puedes asignar múltiples tags por archivo</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4">
                  <h4 className="text-xl font-medium mb-4">
                    Campos de Solo Lectura
                  </h4>
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      <strong>id:</strong> Identificador único
                    </li>
                    <li>
                      <strong>original_name:</strong> Nombre original del
                      archivo
                    </li>
                    <li>
                      <strong>file_path:</strong> Ruta en el servidor
                    </li>
                    <li>
                      <strong>url:</strong> URL pública del archivo
                    </li>
                    <li>
                      <strong>mime_type:</strong> Tipo MIME del archivo
                    </li>
                    <li>
                      <strong>size:</strong> Tamaño en bytes
                    </li>
                    <li>
                      <strong>width/height:</strong> Dimensiones (solo imágenes)
                    </li>
                    <li>
                      <strong>duration:</strong> Duración (solo videos)
                    </li>
                    <li>
                      <strong>created_at/updated_at:</strong> Fechas de gestión
                    </li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg">
                  <h4 className="text-purple-800 font-semibold mb-3">
                    Mejores Prácticas
                  </h4>
                  <ul className="list-disc list-inside text-purple-700 space-y-2">
                    <li>
                      Usa nombres descriptivos que identifiquen el contenido
                    </li>
                    <li>Siempre incluye texto alternativo en imágenes</li>
                    <li>Asigna tags relevantes para facilitar búsquedas</li>
                    <li>Mantén descripciones claras y concisas</li>
                    <li>Revisa y actualiza metadatos regularmente</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Optimización de Medios */}
            <div
              id="multimedia-optimizacion"
              className="bg-white rounded-lg shadow-sm p-8 mb-8"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-semibold">
                  Optimización de Medios
                </h3>
                <button
                  onClick={() => markSectionComplete("multimedia-optimizacion")}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center ${
                    completedSections.includes("multimedia-optimizacion")
                      ? "bg-green-100 text-green-700"
                      : "bg-bg-100 text-white hover:bg-bg-200"
                  }`}
                >
                  <FiCheckCircle
                    className={`w-5 h-5 mr-2 ${
                      completedSections.includes("multimedia-optimizacion")
                        ? "text-green-500"
                        : ""
                    }`}
                  />
                  {completedSections.includes("multimedia-optimizacion")
                    ? "Completado"
                    : "Marcar como completado"}
                </button>
              </div>

              <div className="space-y-6">
                {/* Técnicas de optimización */}
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="text-xl font-medium mb-4">
                    Técnicas de Optimización
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium mb-2">Imágenes</h5>
                      <ul className="list-disc list-inside space-y-2">
                        <li>Compresión inteligente</li>
                        <li>Formatos modernos (WebP)</li>
                        <li>Redimensionamiento automático</li>
                        <li>Eliminación de metadatos</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Videos</h5>
                      <ul className="list-disc list-inside space-y-2">
                        <li>Codificación eficiente</li>
                        <li>Streaming adaptativo</li>
                        <li>Miniaturas optimizadas</li>
                        <li>Compresión por calidad</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Herramientas y servicios */}
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="text-xl font-medium mb-4">
                    Herramientas y Servicios
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium mb-2">Optimización Local</h5>
                      <ul className="list-disc list-inside space-y-2">
                        <li>Compresores integrados</li>
                        <li>Plugins de optimización</li>
                        <li>Scripts automáticos</li>
                        <li>Procesamiento por lotes</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Servicios en la Nube</h5>
                      <ul className="list-disc list-inside space-y-2">
                        <li>CDN con optimización</li>
                        <li>APIs de procesamiento</li>
                        <li>Almacenamiento escalable</li>
                        <li>Backups automáticos</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Consejos de rendimiento */}
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h4 className="text-purple-800 font-semibold mb-3">
                    Consejos de Rendimiento
                  </h4>
                  <ul className="list-disc list-inside text-purple-700 space-y-2">
                    <li>Monitorea el tamaño de archivos</li>
                    <li>Implementa carga diferida</li>
                    <li>Usa dimensiones responsivas</li>
                    <li>Prioriza la velocidad de carga</li>
                    <li>Mantén copias de respaldo</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Sección Usuarios */}
          <section id="usuarios" className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-bg-200">
              Gestión de Usuarios
            </h2>

            {/* Crear Usuarios */}
            <div
              id="usuarios-crear"
              className="bg-white rounded-lg shadow-sm p-8 mb-8"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-semibold">Crear Usuarios</h3>
                <button
                  onClick={() => markSectionComplete("usuarios-crear")}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center ${
                    completedSections.includes("usuarios-crear")
                      ? "bg-green-100 text-green-700"
                      : "bg-bg-100 text-white hover:bg-bg-200"
                  }`}
                >
                  <FiCheckCircle
                    className={`w-5 h-5 mr-2 ${
                      completedSections.includes("usuarios-crear")
                        ? "text-green-500"
                        : ""
                    }`}
                  />
                  {completedSections.includes("usuarios-crear")
                    ? "Completado"
                    : "Marcar como completado"}
                </button>
              </div>
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="text-xl font-medium mb-4">
                    Proceso de Creación
                  </h4>
                  <ol className="list-decimal list-inside space-y-4">
                    <li>
                      <strong>Campos requeridos:</strong>
                      <ul className="list-disc list-inside ml-6 mt-2">
                        <li>
                          <strong>name:</strong> Nombre completo del usuario
                        </li>
                        <li>
                          <strong>email:</strong> Correo electrónico único
                        </li>
                        <li>
                          <strong>password:</strong> Contraseña (se enviará hash
                          al backend)
                        </li>
                        <li>
                          <strong>role:</strong> 'admin' o 'editor'
                        </li>
                      </ul>
                    </li>
                    <li>
                      <strong>Validaciones automáticas:</strong>
                      <ul className="list-disc list-inside ml-6 mt-2">
                        <li>Email debe ser único en el sistema</li>
                        <li>Contraseña debe cumplir requisitos de seguridad</li>
                        <li>Role debe ser válido</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Estado inicial:</strong>
                      <ul className="list-disc list-inside ml-6 mt-2">
                        <li>active: true por defecto</li>
                        <li>
                          created_at y updated_at se generan automáticamente
                        </li>
                        <li>last_login inicialmente vacío</li>
                      </ul>
                    </li>
                  </ol>
                </div>

                <div className="bg-gray-50 p-4 rounded-md">
                  <h5 className="font-medium mb-2">Estructura de Usuario:</h5>
                  <pre className="text-sm overflow-x-auto bg-gray-800 text-white p-4 rounded">
                    {`{
  "id": "user-123",
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "[hash]",
  "role": "editor",
  "active": true,
  "created_at": "2025-10-24T...",
  "updated_at": "2025-10-24T...",
  "last_login": null
}`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Roles y Permisos */}
            <div
              id="usuarios-roles"
              className="bg-white rounded-lg shadow-sm p-8 mb-8"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-semibold">
                  Roles y Sistema de Permisos
                </h3>
                <button
                  onClick={() => markSectionComplete("usuarios-roles")}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center ${
                    completedSections.includes("usuarios-roles")
                      ? "bg-green-100 text-green-700"
                      : "bg-bg-100 text-white hover:bg-bg-200"
                  }`}
                >
                  <FiCheckCircle
                    className={`w-5 h-5 mr-2 ${
                      completedSections.includes("usuarios-roles")
                        ? "text-green-500"
                        : ""
                    }`}
                  />
                  {completedSections.includes("usuarios-roles")
                    ? "Completado"
                    : "Marcar como completado"}
                </button>
              </div>
              <div className="space-y-6">
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="text-xl font-medium mb-4">
                    Roles Disponibles
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-purple-700 mb-2">
                        Administrador (admin)
                      </h5>
                      <p className="text-sm text-gray-600 mb-2">
                        Control total del sistema
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Gestión completa de usuarios ✓</li>
                        <li>Crear y eliminar usuarios ✓</li>
                        <li>Gestionar roles y permisos ✓</li>
                        <li>Editar todo el contenido ✓</li>
                        <li>Publicar contenido ✓</li>
                        <li>Eliminar contenido ✓</li>
                        <li>Acceso al admin ✓</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-green-700 mb-2">
                        Editor (editor)
                      </h5>
                      <p className="text-sm text-gray-600 mb-2">
                        Gestión de contenido
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Gestión completa de usuarios ✗</li>
                        <li>Crear y eliminar usuarios ✗</li>
                        <li>Gestionar roles y permisos ✗</li>
                        <li>Editar todo el contenido ✓</li>
                        <li>Publicar contenido ✓</li>
                        <li>Eliminar contenido ✗</li>
                        <li>Acceso al admin ✓</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <h4 className="text-xl font-medium mb-4">
                    Matriz Completa de Permisos
                  </h4>
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left">Permiso</th>
                        <th className="px-4 py-2 text-center">Admin</th>
                        <th className="px-4 py-2 text-center">Editor</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td
                          className="px-4 py-2 border-t font-medium"
                          colSpan={3}
                        >
                          Usuarios
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 border-t">canCreateUsers</td>
                        <td className="px-4 py-2 border-t text-center text-green-600">
                          ✓
                        </td>
                        <td className="px-4 py-2 border-t text-center text-red-600">
                          ✗
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 border-t">canEditUsers</td>
                        <td className="px-4 py-2 border-t text-center text-green-600">
                          ✓
                        </td>
                        <td className="px-4 py-2 border-t text-center text-red-600">
                          ✗
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 border-t">canDeleteUsers</td>
                        <td className="px-4 py-2 border-t text-center text-green-600">
                          ✓
                        </td>
                        <td className="px-4 py-2 border-t text-center text-red-600">
                          ✗
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 border-t">canViewUsers</td>
                        <td className="px-4 py-2 border-t text-center text-green-600">
                          ✓
                        </td>
                        <td className="px-4 py-2 border-t text-center text-red-600">
                          ✗
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 border-t">canManageRoles</td>
                        <td className="px-4 py-2 border-t text-center text-green-600">
                          ✓
                        </td>
                        <td className="px-4 py-2 border-t text-center text-red-600">
                          ✗
                        </td>
                      </tr>
                      <tr>
                        <td
                          className="px-4 py-2 border-t font-medium"
                          colSpan={3}
                        >
                          Contenido
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 border-t">canAccessAdmin</td>
                        <td className="px-4 py-2 border-t text-center text-green-600">
                          ✓
                        </td>
                        <td className="px-4 py-2 border-t text-center text-green-600">
                          ✓
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 border-t">canEditContent</td>
                        <td className="px-4 py-2 border-t text-center text-green-600">
                          ✓
                        </td>
                        <td className="px-4 py-2 border-t text-center text-green-600">
                          ✓
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 border-t">
                          canPublishContent
                        </td>
                        <td className="px-4 py-2 border-t text-center text-green-600">
                          ✓
                        </td>
                        <td className="px-4 py-2 border-t text-center text-green-600">
                          ✓
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 border-t">canDeleteContent</td>
                        <td className="px-4 py-2 border-t text-center text-green-600">
                          ✓
                        </td>
                        <td className="px-4 py-2 border-t text-center text-red-600">
                          ✗
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="text-blue-800 font-semibold mb-3">
                    Uso de Permisos en el Código
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-600 mb-2">
                      Los permisos se verifican con:
                    </p>
                    <pre className="text-sm overflow-x-auto bg-gray-800 text-white p-4 rounded">
                      {`const { hasPermission } = useAuth();

if (hasPermission('canCreateUsers')) {
  // Mostrar botón de crear usuario
}

// En el AuthContext:
getRolePermissions(user.role)`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Editar y Estado */}
            <div
              id="usuarios-editar"
              className="bg-white rounded-lg shadow-sm p-8 mb-8"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-semibold">
                  Editar y Gestionar Estado
                </h3>
                <button
                  onClick={() => markSectionComplete("usuarios-editar")}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center ${
                    completedSections.includes("usuarios-editar")
                      ? "bg-green-100 text-green-700"
                      : "bg-bg-100 text-white hover:bg-bg-200"
                  }`}
                >
                  <FiCheckCircle
                    className={`w-5 h-5 mr-2 ${
                      completedSections.includes("usuarios-editar")
                        ? "text-green-500"
                        : ""
                    }`}
                  />
                  {completedSections.includes("usuarios-editar")
                    ? "Completado"
                    : "Marcar como completado"}
                </button>
              </div>
              <div className="space-y-6">
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="text-xl font-medium mb-4">Campos Editables</h4>
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      <strong>name:</strong> Actualizar nombre del usuario
                    </li>
                    <li>
                      <strong>email:</strong> Cambiar email (debe ser único)
                    </li>
                    <li>
                      <strong>password:</strong> Actualizar contraseña (opcional
                      en edición)
                    </li>
                    <li>
                      <strong>role:</strong> Cambiar rol del usuario
                    </li>
                    <li>
                      <strong>active:</strong> Activar o desactivar cuenta
                    </li>
                  </ul>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4">
                  <h4 className="text-xl font-medium mb-4">Toggle de Estado</h4>
                  <div className="space-y-4">
                    <p>Función rápida para activar/desactivar usuarios:</p>
                    <ul className="list-disc list-inside space-y-2">
                      <li>
                        <strong>Activo (active: true):</strong> Usuario puede
                        iniciar sesión
                      </li>
                      <li>
                        <strong>Inactivo (active: false):</strong> Acceso
                        bloqueado temporalmente
                      </li>
                      <li>No se eliminan datos, solo se restringe acceso</li>
                      <li>Se puede reactivar en cualquier momento</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-yellow-50 p-6 rounded-lg">
                  <h4 className="text-yellow-800 font-semibold mb-3">
                    Filtros y Búsqueda
                  </h4>
                  <ul className="list-disc list-inside text-yellow-700 space-y-2">
                    <li>
                      <strong>search:</strong> Busca en nombre y email
                    </li>
                    <li>
                      <strong>role:</strong> Filtra por 'admin' o 'editor'
                    </li>
                    <li>
                      <strong>active:</strong> Filtra por estado activo/inactivo
                    </li>
                    <li>
                      <strong>sortBy:</strong> name, email, created_at,
                      updated_at
                    </li>
                    <li>
                      <strong>sortOrder:</strong> asc o desc
                    </li>
                    <li>
                      <strong>Paginación:</strong> page y limit configurables
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Seguridad y Contraseñas */}
            <div
              id="usuarios-seguridad"
              className="bg-white rounded-lg shadow-sm p-8 mb-8"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-semibold">
                  Seguridad y Contraseñas
                </h3>
                <button
                  onClick={() => markSectionComplete("usuarios-seguridad")}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center ${
                    completedSections.includes("usuarios-seguridad")
                      ? "bg-green-100 text-green-700"
                      : "bg-bg-100 text-white hover:bg-bg-200"
                  }`}
                >
                  <FiCheckCircle
                    className={`w-5 h-5 mr-2 ${
                      completedSections.includes("usuarios-seguridad")
                        ? "text-green-500"
                        : ""
                    }`}
                  />
                  {completedSections.includes("usuarios-seguridad")
                    ? "Completado"
                    : "Marcar como completado"}
                </button>
              </div>
              <div className="space-y-6">
                <div className="border-l-4 border-red-500 pl-4">
                  <h4 className="text-xl font-medium mb-4">
                    Cambio de Contraseña
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium mb-2">Proceso de Cambio</h5>
                      <ol className="list-decimal list-inside space-y-2">
                        <li>
                          <strong>Solicitud cambio:</strong> Administrador{" "}
                        </li>
                      </ol>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">
                        Requisitos de Seguridad
                      </h5>
                      <ul className="list-disc list-inside space-y-2">
                        <li>Mínimo 8 caracteres recomendados</li>
                        <li>Combinación de letras, números y símbolos</li>
                        <li>No reutilizar contraseñas anteriores</li>
                        <li>
                          Las contraseñas nunca se almacenan en texto plano
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 p-6 rounded-lg">
                  <h4 className="text-red-800 font-semibold mb-3">
                    Buenas Prácticas de Seguridad
                  </h4>
                  <ul className="list-disc list-inside text-red-700 space-y-2">
                    <li>Usar contraseñas únicas para cada sistema</li>
                    <li>No compartir credenciales entre usuarios</li>
                    <li>Cerrar sesión al terminar de trabajar</li>
                    <li>Revisar el registro de actividades periódicamente</li>
                    <li>
                      Desactivar usuarios inactivos o que ya no requieren acceso
                    </li>
                    <li>Mantener actualizada la información de contacto</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Sección Menú */}
          <section id="menu" className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-bg-200">
              Gestión de Menú
            </h2>

            {/* Estructura del Menú */}
            <div
              id="menu-estructura"
              className="bg-white rounded-lg shadow-sm p-8 mb-8"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-semibold">Estructura del Menú</h3>
                <button
                  onClick={() => markSectionComplete("menu-estructura")}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center ${
                    completedSections.includes("menu-estructura")
                      ? "bg-green-100 text-green-700"
                      : "bg-bg-100 text-white hover:bg-bg-200"
                  }`}
                >
                  <FiCheckCircle
                    className={`w-5 h-5 mr-2 ${
                      completedSections.includes("menu-estructura")
                        ? "text-green-500"
                        : ""
                    }`}
                  />
                  {completedSections.includes("menu-estructura")
                    ? "Completado"
                    : "Marcar como completado"}
                </button>
              </div>
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="text-xl font-medium mb-4">
                    Componentes del Menú
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium mb-2">
                        Propiedades de Cada Item
                      </h5>
                      <ul className="list-disc list-inside space-y-2">
                        <li>
                          <strong>ID único:</strong> Identificador del elemento
                        </li>
                        <li>
                          <strong>Título:</strong> Texto visible en el menú
                        </li>
                        <li>
                          <strong>Ruta (path):</strong> URL de destino
                        </li>
                        <li>
                          <strong>Orden:</strong> Posición en el menú
                        </li>
                        <li>
                          <strong>Tipo de contenido:</strong> page, blog,
                          external, custom
                        </li>
                        <li>
                          <strong>Estado:</strong> Habilitado o deshabilitado
                        </li>
                        <li>
                          <strong>Externo:</strong> Si abre en nueva pestaña
                        </li>
                        <li>
                          <strong>Submenú:</strong> Array de items hijos
                          (opcional)
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-md">
                  <h5 className="font-medium mb-2">Ejemplo de Estructura:</h5>
                  <pre className="text-sm overflow-x-auto bg-gray-800 text-white p-4 rounded">
                    {`{
  "id": "menu-2",
  "title": "Sobre Nosotros",
  "path": "/sobre-nosotros",
  "order": 2,
  "contentType": "page",
  "disabled": false,
  "external": false,
  "submenu": [
    {
      "id": "submenu-1",
      "title": "Sobre Nosotros",
      "path": "/sobre-nosotros",
      "order": 1
    }
  ]
}`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Crear y Editar */}
            <div
              id="menu-editar"
              className="bg-white rounded-lg shadow-sm p-8 mb-8"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-semibold">Crear y Editar Items</h3>
                <button
                  onClick={() => markSectionComplete("menu-editar")}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center ${
                    completedSections.includes("menu-editar")
                      ? "bg-green-100 text-green-700"
                      : "bg-bg-100 text-white hover:bg-bg-200"
                  }`}
                >
                  <FiCheckCircle
                    className={`w-5 h-5 mr-2 ${
                      completedSections.includes("menu-editar")
                        ? "text-green-500"
                        : ""
                    }`}
                  />
                  {completedSections.includes("menu-editar")
                    ? "Completado"
                    : "Marcar como completado"}
                </button>
              </div>
              <div className="space-y-6">
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="text-xl font-medium mb-4">
                    Funciones CRUD del Menú
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium mb-2">Crear Nuevo Item</h5>
                      <ol className="list-decimal list-inside space-y-2">
                        <li>Click en "Agregar Item" o "Nueva entrada"</li>
                        <li>Completa título y ruta</li>
                        <li>Selecciona tipo de contenido</li>
                        <li>Define si es externo</li>
                        <li>Guarda el nuevo item</li>
                      </ol>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">
                        Editar Item Existente
                      </h5>
                      <ul className="list-disc list-inside space-y-2">
                        <li>Modifica título, ruta o configuración</li>
                        <li>Los cambios se guardan en LocalStorage</li>
                        <li>
                          Se actualiza automáticamente en el menú del sitio
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Eliminar Item</h5>
                      <ul className="list-disc list-inside space-y-2">
                        <li>Click en el botón de eliminar</li>
                        <li>Confirma la eliminación</li>
                        <li>Si tiene submenú, todos los hijos se eliminan</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-6 rounded-lg">
                  <h4 className="text-yellow-800 font-semibold mb-3">
                    Nota Importante
                  </h4>
                  <p className="text-yellow-700">
                    El sistema usa <strong>LocalStorage</strong> para almacenar
                    el menú. Si no hay menú guardado, carga los items iniciales
                    predefinidos automáticamente.
                  </p>
                </div>
              </div>
            </div>

            {/* Reordenar */}
            <div
              id="menu-reordenar"
              className="bg-white rounded-lg shadow-sm p-8 mb-8"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-semibold">Reordenar Elementos</h3>
                <button
                  onClick={() => markSectionComplete("menu-reordenar")}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center ${
                    completedSections.includes("menu-reordenar")
                      ? "bg-green-100 text-green-700"
                      : "bg-bg-100 text-white hover:bg-bg-200"
                  }`}
                >
                  <FiCheckCircle
                    className={`w-5 h-5 mr-2 ${
                      completedSections.includes("menu-reordenar")
                        ? "text-green-500"
                        : ""
                    }`}
                  />
                  {completedSections.includes("menu-reordenar")
                    ? "Completado"
                    : "Marcar como completado"}
                </button>
              </div>
              <div className="space-y-6">
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="text-xl font-medium mb-4">
                    Sistema de Ordenamiento
                  </h4>
                  <ul className="list-disc list-inside space-y-3">
                    <li>
                      <strong>Cambio de orden:</strong> El orden se actualiza
                      automáticamente
                    </li>
                    <li>
                      <strong>Índice basado en orden:</strong> Los items se
                      ordenan del 1 en adelante
                    </li>
                    <li>
                      <strong>Persistencia:</strong> El nuevo orden se guarda en
                      LocalStorage
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Sección Home */}
          <section id="home" className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-bg-200">
              Gestión del Home
            </h2>

            {/* Hero Section */}
            <div
              id="home-hero"
              className="bg-white rounded-lg shadow-sm p-8 mb-8"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-semibold">Sección Hero</h3>
                <button
                  onClick={() => markSectionComplete("home-hero")}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center ${
                    completedSections.includes("home-hero")
                      ? "bg-green-100 text-green-700"
                      : "bg-bg-100 text-white hover:bg-bg-200"
                  }`}
                >
                  <FiCheckCircle
                    className={`w-5 h-5 mr-2 ${
                      completedSections.includes("home-hero")
                        ? "text-green-500"
                        : ""
                    }`}
                  />
                  {completedSections.includes("home-hero")
                    ? "Completado"
                    : "Marcar como completado"}
                </button>
              </div>
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="text-xl font-medium mb-4">
                    Configuración del Hero
                  </h4>
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      <strong>Título:</strong> Texto principal destacado
                    </li>
                    <li>
                      <strong>Descripción:</strong> Subtítulo o texto secundario
                    </li>
                    <li>
                      <strong>Imagen de fondo:</strong> URL de la imagen
                      principal
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Slider Section */}
            <div
              id="home-slider"
              className="bg-white rounded-lg shadow-sm p-8 mb-8"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-semibold">Slider de Contenido</h3>
                <button
                  onClick={() => markSectionComplete("home-slider")}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center ${
                    completedSections.includes("home-slider")
                      ? "bg-green-100 text-green-700"
                      : "bg-bg-100 text-white hover:bg-bg-200"
                  }`}
                >
                  <FiCheckCircle
                    className={`w-5 h-5 mr-2 ${
                      completedSections.includes("home-slider")
                        ? "text-green-500"
                        : ""
                    }`}
                  />
                  {completedSections.includes("home-slider")
                    ? "Completado"
                    : "Marcar como completado"}
                </button>
              </div>
              <div className="space-y-6">
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="text-xl font-medium mb-4">
                    Gestión de Slides
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium mb-2">
                        Propiedades de cada Slide
                      </h5>
                      <ul className="list-disc list-inside space-y-2">
                        <li>
                          <strong>ID único:</strong> Identificador del slide
                        </li>
                        <li>
                          <strong>Imagen:</strong> URL de la imagen del slide
                        </li>
                        <li>
                          <strong>Título:</strong> Título del contenido
                        </li>
                        <li>
                          <strong>Descripción:</strong> Texto descriptivo
                        </li>
                        <li>
                          <strong>Orden:</strong> Posición en el carrusel
                        </li>
                        <li>
                          <strong>Estado activo:</strong> Si se muestra o no
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Configuración Global</h5>
                      <ul className="list-disc list-inside space-y-2">
                        <li>
                          <strong>Autoplay:</strong> Reproducción automática
                        </li>
                        <li>
                          <strong>Intervalo:</strong> Tiempo entre slides (en
                          ms)
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Secciones Especiales */}
            <div
              id="home-secciones"
              className="bg-white rounded-lg shadow-sm p-8 mb-8"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-semibold">
                  Secciones Especiales del Home
                </h3>
                <button
                  onClick={() => markSectionComplete("home-secciones")}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center ${
                    completedSections.includes("home-secciones")
                      ? "bg-green-100 text-green-700"
                      : "bg-bg-100 text-white hover:bg-bg-200"
                  }`}
                >
                  <FiCheckCircle
                    className={`w-5 h-5 mr-2 ${
                      completedSections.includes("home-secciones")
                        ? "text-green-500"
                        : ""
                    }`}
                  />
                  {completedSections.includes("home-secciones")
                    ? "Completado"
                    : "Marcar como completado"}
                </button>
              </div>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="text-xl font-medium mb-4">Sección IA</h4>
                    <ul className="list-disc list-inside space-y-2">
                      <li>Título de la sección</li>
                      <li>Descripción del contenido</li>
                      <li>Imagen representativa</li>
                      <li>Texto del botón</li>
                      <li>Link de destino</li>
                    </ul>
                  </div>
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <h4 className="text-xl font-medium mb-4">Sección Video</h4>
                    <ul className="list-disc list-inside space-y-2">
                      <li>Título del video</li>
                      <li>URL del video</li>
                      <li>Descripción opcional</li>
                    </ul>
                  </div>
                </div>
                <div className="border-l-4 border-red-500 pl-4">
                  <h4 className="text-xl font-medium mb-4">Sección Contacto</h4>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Título de la sección</li>
                    <li>
                      Información de contacto:
                      <ul className="list-disc list-inside ml-6">
                        <li>Teléfono 1</li>
                        <li>Teléfono 2</li>
                        <li>Email</li>
                        <li>Horario de atención</li>
                      </ul>
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="text-blue-800 font-semibold mb-3">
                    Estado de Publicación
                  </h4>
                  <p className="text-blue-700">
                    El Home completo tiene un estado de{" "}
                    <strong>isPublished</strong> que controla si todos los
                    cambios están visibles públicamente o en modo borrador.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Pie de página */}
          <div className="mt-12 p-6 bg-gray-100 rounded-lg">
            <div className="mt-6 text-sm text-gray-600">
              <p>
                <strong>Última actualización:</strong> Octubre 2025
              </p>
              <p>
                <strong>Versión del sistema:</strong> 2.0.0
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Documentation;
