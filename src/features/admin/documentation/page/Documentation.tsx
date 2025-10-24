import React, { useState, useEffect } from 'react';
import { FiBook, FiMenu, FiUser, FiImage, FiLayout, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';


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
    id: 'introduccion',
    title: 'Introducción al Panel',
    icon: <FiBook className="w-5 h-5" />,
    description: 'Bienvenido al panel de administración. Aquí aprenderás todo lo necesario para gestionar tu sitio web.',
    subsections: [
      { 
        id: 'intro-panel', 
        title: 'Primeros Pasos',
        description: 'Conoce la interfaz básica y cómo navegar por el panel'
      },
      { 
        id: 'intro-acceso', 
        title: 'Acceso y Seguridad',
        description: 'Aprende a acceder de forma segura y proteger tu cuenta'
      },
      {
        id: 'intro-dashboard',
        title: 'Dashboard Principal',
        description: 'Comprende los elementos clave del panel de control'
      }
    ]
  },
  {
    id: 'paginas',
    title: 'Gestión de Páginas',
    icon: <FiLayout className="w-5 h-5" />,
    description: 'Administra las páginas principales de tu sitio web.',
    subsections: [
      {
        id: 'paginas-crear',
        title: 'Crear Páginas',
        description: 'Crea nuevas páginas para tu sitio'
      },
      {
        id: 'paginas-editar',
        title: 'Editar Páginas',
        description: 'Modifica el contenido existente'
      },
      {
        id: 'paginas-seo',
        title: 'SEO y Metadatos',
        description: 'Optimiza tus páginas para buscadores'
      }
    ]
  },
  {
    id: 'blog',
    title: 'Gestión de Blog',
    icon: <FiBook className="w-5 h-5" />,
    description: 'Aprende a crear y gestionar contenido en el blog de tu sitio.',
    subsections: [
      { 
        id: 'blog-crear', 
        title: 'Crear Entradas',
        description: 'Guía paso a paso para crear nuevas publicaciones'
      },
      { 
        id: 'blog-editar', 
        title: 'Editar Entradas',
        description: 'Cómo modificar y actualizar publicaciones existentes'
      },
      { 
        id: 'blog-categorias', 
        title: 'Gestión de Categorías',
        description: 'Organiza tu contenido eficientemente'
      },
      { 
        id: 'blog-media', 
        title: 'Gestión de Medios',
        description: 'Maneja imágenes y archivos multimedia'
      }
    ]
  },
  {
    id: 'multimedia',
    title: 'Gestión Multimedia',
    icon: <FiImage className="w-5 h-5" />,
    description: 'Administra todos los archivos multimedia de tu sitio.',
    subsections: [
      {
        id: 'multimedia-subir',
        title: 'Subir Archivos',
        description: 'Aprende a subir y organizar archivos'
      },
      {
        id: 'multimedia-galeria',
        title: 'Gestión de Galería',
        description: 'Organiza y edita tus imágenes'
      },
      {
        id: 'multimedia-optimizacion',
        title: 'Optimización',
        description: 'Optimiza tus archivos multimedia'
      }
    ]
  },
  {
    id: 'usuarios',
    title: 'Gestión de Usuarios',
    icon: <FiUser className="w-5 h-5" />,
    description: 'Administra los usuarios y sus permisos.',
    subsections: [
      {
        id: 'usuarios-crear',
        title: 'Crear Usuarios',
        description: 'Añade nuevos usuarios al sistema'
      },
      {
        id: 'usuarios-roles',
        title: 'Roles y Permisos',
        description: 'Gestiona los niveles de acceso'
      },
      {
        id: 'usuarios-seguridad',
        title: 'Seguridad',
        description: 'Configuraciones de seguridad'
      }
    ]
  }
];

const Documentation: React.FC = () => {
  const [activeSection, setActiveSection] = useState('introduccion');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);



  // Efecto para detectar la sección activa basada en el scroll
  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.flatMap(section => [
        { id: section.id, element: document.getElementById(section.id) },
        ...section.subsections.map(sub => ({
          id: sub.id,
          element: document.getElementById(sub.id)
        }))
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

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const markSectionComplete = (sectionId: string) => {
    if (!completedSections.includes(sectionId)) {
      setCompletedSections(prev => [...prev, sectionId]);
      setShowCompletionMessage(true);
      setTimeout(() => setShowCompletionMessage(false), 3000);

      // Guardar progreso en localStorage
      const updatedSections = [...completedSections, sectionId];
      localStorage.setItem('completedSections', JSON.stringify(updatedSections));
    }
  };

  // Recuperar progreso guardado
  useEffect(() => {
    const savedSections = localStorage.getItem('completedSections');
    if (savedSections) {
      setCompletedSections(JSON.parse(savedSections));
    }
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Cerrar el menú móvil si está abierto
      setShowMobileMenu(false);
      
      // Actualizar la sección activa inmediatamente
      setActiveSection(sectionId);

      // Usar scrollIntoView para un scroll más confiable
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      // Ajustar por el header fijo después del scroll
      const headerOffset = 80;
      setTimeout(() => {
        window.scrollBy({
          top: -headerOffset,
          behavior: 'smooth'
        });

        // Efecto visual de resaltado
        element.classList.add('highlight-section');
        setTimeout(() => {
          element.classList.remove('highlight-section');
        }, 1000);
      }, 100);
    }
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Botón de menú móvil */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-bg-100 text-white rounded-lg shadow-lg"
      >
        <FiMenu className="w-6 h-6" />
      </button>

      {/* Mensaje de completado */}
      {showCompletionMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-out">
          ¡Sección completada!
        </div>
      )}

      {/* Barra lateral de navegación */}
      <nav className={`fixed top-0 lg:relative w-64 bg-white shadow-lg h-screen transition-transform duration-300 transform ${
        showMobileMenu ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`} style={{ zIndex: 40 }}>
        <div className="p-6 h-full overflow-y-auto">
          <h2 className="text-2xl font-bold text-bg-200 mb-2">Guía del Panel</h2>
          <p className="text-sm text-gray-600 mb-6">
            Documentación completa para usuarios principiantes
          </p>

          {/* Progreso general */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">Tu Progreso</h3>
            {(() => {
              const totalSections = sections.reduce(
                (total, section) => total + section.subsections.length + 1,
                0
              );
              return (
                <>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${(completedSections.length / totalSections) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-blue-600 mt-2">
                    {completedSections.length} de {totalSections} secciones completadas
                  </p>
                </>
              );
            })()}
          </div>

          {/* Menú de navegación */}
          <div className="space-y-6">
            {sections.map((section) => (
              <div key={section.id} className="space-y-2">
                <button
                  onClick={() => scrollToSection(section.id)}
                  className={`flex items-center w-full p-2 rounded-lg transition-colors cursor-pointer transform hover:scale-102 relative z-50 ${
                    activeSection === section.id
                      ? 'bg-bg-100 text-white shadow-md'
                      : 'hover:bg-gray-100'
                  }`}
                  role="menuitem"
                  aria-expanded={activeSection === section.id}
                >
                  <span className="mr-3 transition-transform duration-200">{section.icon}</span>
                  <span className="flex-1 text-left font-medium">{section.title}</span>
                  {completedSections.includes(section.id) && (
                    <FiCheckCircle className="text-green-500 ml-2" />
                  )}
                </button>
                
                {/* Subsecciones */}
                <div className="ml-8 space-y-1 transition-all duration-200">
                  {section.subsections.map((subsection) => (
                    <button
                      key={subsection.id}
                      onClick={() => {
                        scrollToSection(subsection.id);
                        setActiveSection(section.id);
                      }}
                      className={`flex items-center w-full text-sm p-1.5 rounded transition-all duration-200 cursor-pointer
                        ${activeSection === section.id 
                          ? 'text-bg-200 hover:bg-gray-100'
                          : 'text-gray-600 hover:text-bg-200'
                        }
                        hover:pl-3 hover:bg-gray-50`}
                      role="menuitem"
                    >
                      <span className="flex-1 text-left">{subsection.title}</span>
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

      {/* Contenido principal */}

      {/* Contenido principal */}
      <main className="flex-1 p-6 lg:p-8 h-screen overflow-y-scroll">
        <div className="max-w-4xl mx-auto">
          {/* Introducción */}
          <section id="introduccion" className="mb-16">
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <div className="flex justify-between items-start mb-6">
                <h1 className="text-4xl font-bold text-bg-200">
                  Bienvenido al Panel de Administración
                </h1>
                <button
                  onClick={() => markSectionComplete('introduccion')}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center ${
                    completedSections.includes('introduccion')
                      ? 'bg-green-100 text-green-700'
                      : 'bg-bg-100 text-white hover:bg-bg-200'
                  }`}
                >
                  <FiCheckCircle className={`w-5 h-5 mr-2 ${
                    completedSections.includes('introduccion') ? 'text-green-500' : ''
                  }`} />
                  {completedSections.includes('introduccion') ? 'Completado' : 'Marcar como completado'}
                </button>
              </div>
              <p className="text-lg text-gray-600 mb-6">
                Esta guía te ayudará a aprender paso a paso cómo gestionar tu sitio web. 
                Cada sección incluye ejemplos prácticos y consejos útiles.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-blue-800 mb-3">
                    ¿Eres nuevo?
                  </h3>
                  <p className="text-blue-700 mb-4">
                    Comienza con los conceptos básicos:
                  </p>
                  <ul className="space-y-2">
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
                      <span>Mantén copias de seguridad</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div id="intro-panel" className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6 text-bg-200">Primeros Pasos</h2>

            {/* Acceso y Seguridad */}
            <div id="intro-acceso" className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-semibold">Acceso y Seguridad</h3>
                <button
                  onClick={() => markSectionComplete('intro-acceso')}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center ${
                    completedSections.includes('intro-acceso')
                      ? 'bg-green-100 text-green-700'
                      : 'bg-bg-100 text-white hover:bg-bg-200'
                  }`}
                >
                  <FiCheckCircle className={`w-5 h-5 mr-2 ${
                    completedSections.includes('intro-acceso') ? 'text-green-500' : ''
                  }`} />
                  {completedSections.includes('intro-acceso') ? 'Completado' : 'Marcar como completado'}
                </button>
              </div>
              <div className="space-y-6">
                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="text-xl font-medium mb-4">Autenticación Segura</h4>
                  <ul className="list-disc list-inside space-y-3">
                    <li>Utiliza contraseñas fuertes y únicas</li>
                    <li>Activa la autenticación de dos factores</li>
                    <li>Mantén actualizada tu información de contacto</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Dashboard Principal */}
            <div id="intro-dashboard" className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-semibold">Dashboard Principal</h3>
                <button
                  onClick={() => markSectionComplete('intro-dashboard')}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center ${
                    completedSections.includes('intro-dashboard')
                      ? 'bg-green-100 text-green-700'
                      : 'bg-bg-100 text-white hover:bg-bg-200'
                  }`}
                >
                  <FiCheckCircle className={`w-5 h-5 mr-2 ${
                    completedSections.includes('intro-dashboard') ? 'text-green-500' : ''
                  }`} />
                  {completedSections.includes('intro-dashboard') ? 'Completado' : 'Marcar como completado'}
                </button>
              </div>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="text-xl font-medium mb-4">Resumen General</h4>
                    <ul className="list-disc list-inside space-y-2">
                      <li>Estadísticas de visitas</li>
                      <li>Últimas actividades</li>
                      <li>Estado del sistema</li>
                    </ul>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="text-xl font-medium mb-4">Accesos Rápidos</h4>
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
                  <h3 className="text-xl font-semibold mb-2">Accediendo al Panel</h3>
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
                  <h3 className="text-xl font-semibold mb-2">Navegación Básica</h3>
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
            <h2 className="text-3xl font-bold mb-6 text-bg-200">Gestión de Páginas</h2>
            
            <div id="paginas-crear" className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-semibold">Crear Nuevas Páginas</h3>
                <button
                  onClick={() => markSectionComplete('paginas-crear')}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center ${
                    completedSections.includes('paginas-crear')
                      ? 'bg-green-100 text-green-700'
                      : 'bg-bg-100 text-white hover:bg-bg-200'
                  }`}
                >
                  <FiCheckCircle className={`w-5 h-5 mr-2 ${
                    completedSections.includes('paginas-crear') ? 'text-green-500' : ''
                  }`} />
                  {completedSections.includes('paginas-crear') ? 'Completado' : 'Marcar como completado'}
                </button>
              </div>
              
              <div className="space-y-8">
                {/* Proceso de creación */}
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="text-xl font-medium mb-4">Proceso de Creación</h4>
                  <ol className="list-decimal list-inside space-y-4">
                    <li className="text-gray-700">
                      Accede a la sección de páginas
                      <div className="mt-2 p-4 bg-gray-50 rounded-md">
                        <p className="text-sm text-gray-600">
                          Encuentra "Páginas" en el menú principal del panel de administración
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
                  <h4 className="text-xl font-medium mb-4">Editor de Contenido</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium mb-2">Herramientas Disponibles</h5>
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
                      <h5 className="font-medium text-blue-700 mb-2">Contenido</h5>
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

            {/* Edición de Páginas */}
            <div id="paginas-editar" className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-semibold">Editar Páginas Existentes</h3>
                <button
                  onClick={() => markSectionComplete('paginas-editar')}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center ${
                    completedSections.includes('paginas-editar')
                      ? 'bg-green-100 text-green-700'
                      : 'bg-bg-100 text-white hover:bg-bg-200'
                  }`}
                >
                  <FiCheckCircle className={`w-5 h-5 mr-2 ${
                    completedSections.includes('paginas-editar') ? 'text-green-500' : ''
                  }`} />
                  {completedSections.includes('paginas-editar') ? 'Completado' : 'Marcar como completado'}
                </button>
              </div>
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="text-xl font-medium mb-4">Proceso de Edición</h4>
                  <ol className="list-decimal list-inside space-y-3">
                    <li>Seleccionar la página a editar</li>
                    <li>Realizar modificaciones necesarias</li>
                    <li>Previsualizar cambios</li>
                    <li>Publicar actualizaciones</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* SEO y Optimización */}
            <div id="paginas-seo" className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-semibold">SEO y Metadatos</h3>
                <button
                  onClick={() => markSectionComplete('paginas-seo')}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center ${
                    completedSections.includes('paginas-seo')
                      ? 'bg-green-100 text-green-700'
                      : 'bg-bg-100 text-white hover:bg-bg-200'
                  }`}
                >
                  <FiCheckCircle className={`w-5 h-5 mr-2 ${
                    completedSections.includes('paginas-seo') ? 'text-green-500' : ''
                  }`} />
                  {completedSections.includes('paginas-seo') ? 'Completado' : 'Marcar como completado'}
                </button>
              </div>

              <div className="space-y-6">
                {/* Configuración SEO */}
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="text-xl font-medium mb-4">Configuración SEO</h4>
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
                      <h6 className="font-medium mb-2">Ejemplo de Meta Título:</h6>
                      <code className="text-sm block">
                        Servicios de Desarrollo Web | Tu Empresa - Palabras Clave
                      </code>
                      <p className="text-sm text-gray-600 mt-2">
                        Límite recomendado: 60 caracteres
                      </p>
                    </div>
                  </div>
                </div>

                {/* Optimización de Contenido */}
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="text-xl font-medium mb-4">Optimización de Contenido</h4>
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
            <h2 className="text-3xl font-bold mb-6 text-bg-200">Gestión de Blog</h2>
            
            <div id="blog-crear" className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-semibold">Crear Nuevas Entradas</h3>
                <button
                  onClick={() => markSectionComplete('blog-crear')}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center ${
                    completedSections.includes('blog-crear')
                      ? 'bg-green-100 text-green-700'
                      : 'bg-bg-100 text-white hover:bg-bg-200'
                  }`}
                >
                  <FiCheckCircle className={`w-5 h-5 mr-2 ${
                    completedSections.includes('blog-crear') ? 'text-green-500' : ''
                  }`} />
                  {completedSections.includes('blog-crear') ? 'Completado' : 'Marcar como completado'}
                </button>
              </div>

              {/* Aquí continúa el contenido existente de blog-crear */}
              
              <div className="space-y-8">
                {/* Paso 1 */}
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="text-xl font-medium mb-4">Paso 1: Iniciar Nueva Entrada</h4>
                  <ol className="list-decimal list-inside space-y-3">
                    <li className="text-gray-700">
                      Localiza el botón "Nueva Entrada" en la sección de Blog
                      <div className="mt-2 p-4 bg-gray-50 rounded-md">
                        <p className="text-sm text-gray-600">
                          Generalmente encontrarás este botón en la esquina superior derecha de la página principal del blog
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
                  <h4 className="text-xl font-medium mb-4">Paso 2: Configuración Básica</h4>
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
                  <h4 className="text-xl font-medium mb-4">Paso 3: Editor de Contenido</h4>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-medium mb-2">Barra de Herramientas</h5>
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
                      <h5 className="font-medium text-blue-700 mb-2">Estructura</h5>
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
            <div id="blog-editar" className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-semibold">Editar Entradas</h3>
                <button
                  onClick={() => markSectionComplete('blog-editar')}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center ${
                    completedSections.includes('blog-editar')
                      ? 'bg-green-100 text-green-700'
                      : 'bg-bg-100 text-white hover:bg-bg-200'
                  }`}
                >
                  <FiCheckCircle className={`w-5 h-5 mr-2 ${
                    completedSections.includes('blog-editar') ? 'text-green-500' : ''
                  }`} />
                  {completedSections.includes('blog-editar') ? 'Completado' : 'Marcar como completado'}
                </button>
              </div>
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="text-xl font-medium mb-4">Proceso de Edición</h4>
                  <ol className="list-decimal list-inside space-y-3">
                    <li>Localizar la entrada</li>
                    <li>Realizar cambios</li>
                    <li>Previsualizar</li>
                    <li>Actualizar</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Gestión de Categorías */}
            <div id="blog-categorias" className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-semibold">Gestión de Categorías</h3>
                <button
                  onClick={() => markSectionComplete('blog-categorias')}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center ${
                    completedSections.includes('blog-categorias')
                      ? 'bg-green-100 text-green-700'
                      : 'bg-bg-100 text-white hover:bg-bg-200'
                  }`}
                >
                  <FiCheckCircle className={`w-5 h-5 mr-2 ${
                    completedSections.includes('blog-categorias') ? 'text-green-500' : ''
                  }`} />
                  {completedSections.includes('blog-categorias') ? 'Completado' : 'Marcar como completado'}
                </button>
              </div>
              <div className="space-y-6">
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="text-xl font-medium mb-4">Organización de Contenido</h4>
                  <ul className="list-disc list-inside space-y-3">
                    <li>Crear categorías</li>
                    <li>Asignar etiquetas</li>
                    <li>Organizar jerarquías</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Gestión de Medios */}
            <div id="blog-media" className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-semibold">Gestión de Medios</h3>
                <button
                  onClick={() => markSectionComplete('blog-media')}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center ${
                    completedSections.includes('blog-media')
                      ? 'bg-green-100 text-green-700'
                      : 'bg-bg-100 text-white hover:bg-bg-200'
                  }`}
                >
                  <FiCheckCircle className={`w-5 h-5 mr-2 ${
                    completedSections.includes('blog-media') ? 'text-green-500' : ''
                  }`} />
                  {completedSections.includes('blog-media') ? 'Completado' : 'Marcar como completado'}
                </button>
              </div>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="text-xl font-medium mb-4">Gestión de Archivos</h4>
                    <ul className="list-disc list-inside space-y-2">
                      <li>Subir archivos</li>
                      <li>Organizar medios</li>
                      <li>Optimizar imágenes</li>
                    </ul>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="text-xl font-medium mb-4">Mejores Prácticas</h4>
                    <ul className="list-disc list-inside space-y-2">
                      <li>Nombrar archivos</li>
                      <li>Establecer metadatos</li>
                      <li>Organizar bibliotecas</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Sección Multimedia */}
          <section id="multimedia" className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-bg-200">Gestión Multimedia</h2>
            
            <div id="multimedia-subir" className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-semibold">Subir Archivos</h3>
                <button
                  onClick={() => markSectionComplete('multimedia-subir')}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center ${
                    completedSections.includes('multimedia-subir')
                      ? 'bg-green-100 text-green-700'
                      : 'bg-bg-100 text-white hover:bg-bg-200'
                  }`}
                >
                  <FiCheckCircle className={`w-5 h-5 mr-2 ${
                    completedSections.includes('multimedia-subir') ? 'text-green-500' : ''
                  }`} />
                  {completedSections.includes('multimedia-subir') ? 'Completado' : 'Marcar como completado'}
                </button>
              </div>

              <div className="space-y-8">
                {/* Métodos de subida */}
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="text-xl font-medium mb-4">Métodos de Subida</h4>
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
                  <h4 className="text-xl font-medium mb-4">Organización de Archivos</h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium mb-2">Estructura de Carpetas</h5>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <ul className="list-disc list-inside space-y-2 text-gray-600">
                          <li>Imágenes
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

            {/* Gestión de Galería */}
            <div id="multimedia-galeria" className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-semibold">Gestión de Galería</h3>
                <button
                  onClick={() => markSectionComplete('multimedia-galeria')}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center ${
                    completedSections.includes('multimedia-galeria')
                      ? 'bg-green-100 text-green-700'
                      : 'bg-bg-100 text-white hover:bg-bg-200'
                  }`}
                >
                  <FiCheckCircle className={`w-5 h-5 mr-2 ${
                    completedSections.includes('multimedia-galeria') ? 'text-green-500' : ''
                  }`} />
                  {completedSections.includes('multimedia-galeria') ? 'Completado' : 'Marcar como completado'}
                </button>
              </div>

              <div className="space-y-6">
                {/* Funciones de galería */}
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="text-xl font-medium mb-4">Funciones de Galería</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium mb-2">Organización</h5>
                      <ul className="list-disc list-inside space-y-2">
                        <li>Crear álbumes</li>
                        <li>Ordenar por fecha</li>
                        <li>Filtrar por tipo</li>
                        <li>Búsqueda avanzada</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Edición</h5>
                      <ul className="list-disc list-inside space-y-2">
                        <li>Recortar imágenes</li>
                        <li>Ajustar tamaño</li>
                        <li>Aplicar filtros</li>
                        <li>Edición en lote</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Tips de optimización */}
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="text-blue-800 font-semibold mb-3">
                    Tips de Optimización
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-blue-700 mb-2">Imágenes</h5>
                      <ul className="list-disc list-inside space-y-2 text-blue-600">
                        <li>Comprime sin perder calidad</li>
                        <li>Usa formatos adecuados</li>
                        <li>Optimiza para web</li>
                        <li>Ajusta dimensiones</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-blue-700 mb-2">Rendimiento</h5>
                      <ul className="list-disc list-inside space-y-2 text-blue-600">
                        <li>Carga lazy loading</li>
                        <li>Caché de imágenes</li>
                        <li>CDN para distribución</li>
                        <li>Versiones responsivas</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Optimización de Medios */}
            <div id="multimedia-optimizacion" className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-semibold">Optimización de Medios</h3>
                <button
                  onClick={() => markSectionComplete('multimedia-optimizacion')}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center ${
                    completedSections.includes('multimedia-optimizacion')
                      ? 'bg-green-100 text-green-700'
                      : 'bg-bg-100 text-white hover:bg-bg-200'
                  }`}
                >
                  <FiCheckCircle className={`w-5 h-5 mr-2 ${
                    completedSections.includes('multimedia-optimizacion') ? 'text-green-500' : ''
                  }`} />
                  {completedSections.includes('multimedia-optimizacion') ? 'Completado' : 'Marcar como completado'}
                </button>
              </div>

              <div className="space-y-6">
                {/* Técnicas de optimización */}
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="text-xl font-medium mb-4">Técnicas de Optimización</h4>
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
                  <h4 className="text-xl font-medium mb-4">Herramientas y Servicios</h4>
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
            <h2 className="text-3xl font-bold mb-6 text-bg-200">Gestión de Usuarios</h2>
            
            {/* Crear Usuarios */}
            <div id="usuarios-crear" className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-semibold">Crear Usuarios</h3>
                <button
                  onClick={() => markSectionComplete('usuarios-crear')}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center ${
                    completedSections.includes('usuarios-crear')
                      ? 'bg-green-100 text-green-700'
                      : 'bg-bg-100 text-white hover:bg-bg-200'
                  }`}
                >
                  <FiCheckCircle className={`w-5 h-5 mr-2 ${
                    completedSections.includes('usuarios-crear') ? 'text-green-500' : ''
                  }`} />
                  {completedSections.includes('usuarios-crear') ? 'Completado' : 'Marcar como completado'}
                </button>
              </div>
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="text-xl font-medium mb-4">Proceso de Creación</h4>
                  <ol className="list-decimal list-inside space-y-3">
                    <li>Datos básicos del usuario</li>
                    <li>Asignación de roles</li>
                    <li>Configuración de permisos</li>
                    <li>Envío de credenciales</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Roles y Permisos */}
            <div id="usuarios-roles" className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-semibold">Roles y Permisos</h3>
                <button
                  onClick={() => markSectionComplete('usuarios-roles')}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center ${
                    completedSections.includes('usuarios-roles')
                      ? 'bg-green-100 text-green-700'
                      : 'bg-bg-100 text-white hover:bg-bg-200'
                  }`}
                >
                  <FiCheckCircle className={`w-5 h-5 mr-2 ${
                    completedSections.includes('usuarios-roles') ? 'text-green-500' : ''
                  }`} />
                  {completedSections.includes('usuarios-roles') ? 'Completado' : 'Marcar como completado'}
                </button>
              </div>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="text-xl font-medium mb-4">Tipos de Roles</h4>
                    <ul className="list-disc list-inside space-y-2">
                      <li>Administrador</li>
                      <li>Editor</li>
                      <li>Autor</li>
                      <li>Colaborador</li>
                    </ul>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="text-xl font-medium mb-4">Gestión de Permisos</h4>
                    <ul className="list-disc list-inside space-y-2">
                      <li>Asignar permisos</li>
                      <li>Crear roles personalizados</li>
                      <li>Modificar accesos</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Seguridad */}
            <div id="usuarios-seguridad" className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-semibold">Seguridad</h3>
                <button
                  onClick={() => markSectionComplete('usuarios-seguridad')}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center ${
                    completedSections.includes('usuarios-seguridad')
                      ? 'bg-green-100 text-green-700'
                      : 'bg-bg-100 text-white hover:bg-bg-200'
                  }`}
                >
                  <FiCheckCircle className={`w-5 h-5 mr-2 ${
                    completedSections.includes('usuarios-seguridad') ? 'text-green-500' : ''
                  }`} />
                  {completedSections.includes('usuarios-seguridad') ? 'Completado' : 'Marcar como completado'}
                </button>
              </div>
              <div className="space-y-6">
                <div className="border-l-4 border-red-500 pl-4">
                  <h4 className="text-xl font-medium mb-4">Medidas de Seguridad</h4>
                  <ul className="list-disc list-inside space-y-3">
                    <li>Autenticación de dos factores</li>
                    <li>Políticas de contraseñas</li>
                    <li>Registro de actividades</li>
                    <li>Bloqueo de cuentas</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Crear Usuarios */}
            <div id="usuarios-crear" className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-semibold">Crear Usuarios</h3>
                <button
                  onClick={() => markSectionComplete('usuarios-crear')}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center ${
                    completedSections.includes('usuarios-crear')
                      ? 'bg-green-100 text-green-700'
                      : 'bg-bg-100 text-white hover:bg-bg-200'
                  }`}
                >
                  <FiCheckCircle className={`w-5 h-5 mr-2 ${
                    completedSections.includes('usuarios-crear') ? 'text-green-500' : ''
                  }`} />
                  {completedSections.includes('usuarios-crear') ? 'Completado' : 'Marcar como completado'}
                </button>
              </div>

              <div className="space-y-8">
                {/* Proceso de creación */}
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="text-xl font-medium mb-4">Proceso de Creación</h4>
                  <ol className="list-decimal list-inside space-y-4">
                    <li className="text-gray-700">
                      Información básica
                      <ul className="list-disc list-inside ml-6 mt-2">
                        <li>Nombre completo</li>
                        <li>Correo electrónico</li>
                        <li>Nombre de usuario</li>
                        <li>Contraseña segura</li>
                      </ul>
                    </li>
                    <li className="text-gray-700">
                      Asignación de roles
                      <ul className="list-disc list-inside ml-6 mt-2">
                        <li>Administrador</li>
                        <li>Editor</li>
                        <li>Autor</li>
                        <li>Colaborador</li>
                      </ul>
                    </li>
                    <li className="text-gray-700">
                      Configuración adicional
                      <ul className="list-disc list-inside ml-6 mt-2">
                        <li>Zona horaria</li>
                        <li>Idioma preferido</li>
                        <li>Notificaciones</li>
                      </ul>
                    </li>
                  </ol>
                </div>

                {/* Validación y seguridad */}
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="text-xl font-medium mb-4">Validación y Seguridad</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium mb-2">Requisitos de Contraseña</h5>
                      <ul className="list-disc list-inside space-y-2">
                        <li>Mínimo 8 caracteres</li>
                        <li>Mayúsculas y minúsculas</li>
                        <li>Números y símbolos</li>
                        <li>Sin información personal</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Verificación</h5>
                      <ul className="list-disc list-inside space-y-2">
                        <li>Correo de confirmación</li>
                        <li>Validación de datos</li>
                        <li>Captcha anti-spam</li>
                        <li>Revisión de permisos</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Roles y Permisos */}
            <div id="usuarios-roles" className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-semibold">Roles y Permisos</h3>
                <button
                  onClick={() => markSectionComplete('usuarios-roles')}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center ${
                    completedSections.includes('usuarios-roles')
                      ? 'bg-green-100 text-green-700'
                      : 'bg-bg-100 text-white hover:bg-bg-200'
                  }`}
                >
                  <FiCheckCircle className={`w-5 h-5 mr-2 ${
                    completedSections.includes('usuarios-roles') ? 'text-green-500' : ''
                  }`} />
                  {completedSections.includes('usuarios-roles') ? 'Completado' : 'Marcar como completado'}
                </button>
              </div>

              <div className="space-y-6">
                {/* Tipos de roles */}
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="text-xl font-medium mb-4">Tipos de Roles</h4>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-medium mb-2">Roles Predefinidos</h5>
                        <ul className="list-disc list-inside space-y-2">
                          <li>Super Administrador
                            <ul className="list-disc list-inside ml-4 text-sm text-gray-600">
                              <li>Control total del sistema</li>
                              <li>Gestión de roles</li>
                            </ul>
                          </li>
                          <li>Administrador
                            <ul className="list-disc list-inside ml-4 text-sm text-gray-600">
                              <li>Gestión de contenidos</li>
                              <li>Gestión de usuarios</li>
                            </ul>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Roles Personalizados</h5>
                        <ul className="list-disc list-inside space-y-2">
                          <li>Creación de roles</li>
                          <li>Asignación de permisos</li>
                          <li>Restricciones específicas</li>
                          <li>Herencia de roles</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Matriz de permisos */}
                <div className="border-l-4 border-yellow-500 pl-4">
                  <h4 className="text-xl font-medium mb-4">Matriz de Permisos</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-2 text-left">Permiso</th>
                          <th className="px-4 py-2 text-center">Admin</th>
                          <th className="px-4 py-2 text-center">Editor</th>
                          <th className="px-4 py-2 text-center">Autor</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="px-4 py-2 border-t">Crear páginas</td>
                          <td className="px-4 py-2 border-t text-center">✓</td>
                          <td className="px-4 py-2 border-t text-center">✓</td>
                          <td className="px-4 py-2 border-t text-center">-</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 border-t">Editar usuarios</td>
                          <td className="px-4 py-2 border-t text-center">✓</td>
                          <td className="px-4 py-2 border-t text-center">-</td>
                          <td className="px-4 py-2 border-t text-center">-</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 border-t">Gestionar medios</td>
                          <td className="px-4 py-2 border-t text-center">✓</td>
                          <td className="px-4 py-2 border-t text-center">✓</td>
                          <td className="px-4 py-2 border-t text-center">✓</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Seguridad */}
            <div id="usuarios-seguridad" className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-semibold">Seguridad</h3>
                <button
                  onClick={() => markSectionComplete('usuarios-seguridad')}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center ${
                    completedSections.includes('usuarios-seguridad')
                      ? 'bg-green-100 text-green-700'
                      : 'bg-bg-100 text-white hover:bg-bg-200'
                  }`}
                >
                  <FiCheckCircle className={`w-5 h-5 mr-2 ${
                    completedSections.includes('usuarios-seguridad') ? 'text-green-500' : ''
                  }`} />
                  {completedSections.includes('usuarios-seguridad') ? 'Completado' : 'Marcar como completado'}
                </button>
              </div>

              <div className="space-y-6">
                {/* Medidas de seguridad */}
                <div className="border-l-4 border-red-500 pl-4">
                  <h4 className="text-xl font-medium mb-4">Medidas de Seguridad</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium mb-2">Autenticación</h5>
                      <ul className="list-disc list-inside space-y-2">
                        <li>Doble factor (2FA)</li>
                        <li>Contraseñas seguras</li>
                        <li>Bloqueo por intentos</li>
                        <li>Recuperación segura</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Monitoreo</h5>
                      <ul className="list-disc list-inside space-y-2">
                        <li>Registro de actividades</li>
                        <li>Detección de amenazas</li>
                        <li>Alertas de seguridad</li>
                        <li>Auditorías periódicas</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Políticas de seguridad */}
                <div className="bg-red-50 p-6 rounded-lg">
                  <h4 className="text-red-800 font-semibold mb-3">
                    Políticas de Seguridad
                  </h4>
                  <div className="space-y-4">
                    <ul className="list-disc list-inside text-red-700">
                      <li>Actualización regular de contraseñas</li>
                      <li>Sesiones con tiempo límite</li>
                      <li>Restricción de IPs sospechosas</li>
                      <li>Cifrado de datos sensibles</li>
                      <li>Backups automáticos</li>
                    </ul>
                    <div className="bg-white p-4 rounded border border-red-200 mt-4">
                      <h5 className="font-medium text-red-800 mb-2">Recomendaciones</h5>
                      <ul className="list-disc list-inside text-red-600">
                        <li>Habilitar autenticación de dos factores</li>
                        <li>Usar contraseñas únicas y complejas</li>
                        <li>Mantener el software actualizado</li>
                        <li>Revisar registros regularmente</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Pie de página */}
          <div className="mt-12 p-6 bg-gray-100 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">¿Necesitas más ayuda?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Recursos Adicionales</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>Video tutoriales</li>
                  <li>Guías descargables</li>
                  <li>Preguntas frecuentes</li>
                  <li>Base de conocimientos</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Soporte Técnico</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>Chat en vivo</li>
                  <li>Correo electrónico</li>
                  <li>Teléfono de soporte</li>
                  <li>Foro de la comunidad</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 text-sm text-gray-600">
              <p><strong>Última actualización:</strong> Octubre 2025</p>
              <p><strong>Versión del sistema:</strong> 2.0.0</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Documentation;