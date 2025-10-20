import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useHomeManagement } from "../hooks/useHomeManagement";
import type { SliderItem, SliderSection, HeroSection, IASection, VideoSection, ContactSection } from "../types/homeTypes";
import MultimediaSelector from "../../../../components/editor/MultimediaSelector";
import { FiLoader, FiSave, FiEye, FiPlus, FiTrash2, FiChevronUp, FiChevronDown } from "react-icons/fi";
import { useToast } from "../../../../hooks/useToast";
import { useUnsavedChanges } from "../../../../hooks/useUnsavedChanges";
import ConfirmDialog from "../../../../components/common/ConfirmDialog";

const HomeEditor: React.FC = () => {
  const navigate = useNavigate();
  const { homeData, loading, error, isSaving, createHome, updateHome, loadHomeData } = useHomeManagement();
  const { showToast } = useToast();

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [initialData, setInitialData] = useState<string>("");
  const { showConfirmDialog, confirmNavigation, cancelNavigation } = useUnsavedChanges(hasUnsavedChanges);

  const [formData, setFormData] = useState({
    sliderSection: {
      slides: [] as SliderItem[],
      autoplay: true,
      interval: 5000,
    } as SliderSection,
    heroSection: {
      title: "Bienvenido a AST",
      description: "Conectamos tecnología e innovación para transformar sectores productivos clave en Chile y Latinoamérica.",
      backgroundImage: "slider/slider04.JPG",
    } as HeroSection,
    iaSection: {
      title: "Implementamos IA",
      description: "En AST Networks estamos incorporando inteligencia artificial para potenciar nuestras soluciones de monitoreo, automatización y análisis de datos.",
      image: "img/inicio/ia-wisensor.jpg",
      buttonText: "Ver más",
      buttonLink: "#",
    } as IASection,
    videoSection: {
      title: "Puedes ver más sobre nosotros aquí",
      videoUrl: "https://www.youtube.com/embed/fI-tzs7NnNE?si=HCiO3OqtZgFZsa4r",
      description: "",
    } as VideoSection,
    contactSection: {
      title: "Contáctanos",
      contactInfo: {
        phone1: "+56 2 3366 3478",
        phone2: "+56 2 3366 3478",
        email: "ventas@ast.cl",
        schedule: "09:30 - 19:30 de lunes a viernes",
      },
    } as ContactSection,
    isPublished: false,
  });

  useEffect(() => {
    if (homeData) {
      const data = {
        sliderSection: homeData.sliderSection || {
          slides: [],
          autoplay: true,
          interval: 5000,
        },
        heroSection: homeData.heroSection || {
          title: "Bienvenido a AST",
          description: "Conectamos tecnología e innovación para transformar sectores productivos clave en Chile y Latinoamérica.",
          backgroundImage: "slider/slider04.JPG",
        },
        iaSection: homeData.iaSection || {
          title: "Implementamos IA",
          description: "En AST Networks estamos incorporando inteligencia artificial para potenciar nuestras soluciones de monitoreo, automatización y análisis de datos.",
          image: "img/inicio/ia-wisensor.jpg",
          buttonText: "Ver más",
          buttonLink: "#",
        },
        videoSection: homeData.videoSection || {
          title: "Puedes ver más sobre nosotros aquí",
          videoUrl: "https://www.youtube.com/embed/fI-tzs7NnNE?si=HCiO3OqtZgFZsa4r",
          description: "",
        },
        contactSection: homeData.contactSection || {
          title: "Contáctanos",
          contactInfo: {
            phone1: "+56 2 3366 3478",
            phone2: "+56 2 3366 3478",
            email: "ventas@ast.cl",
            schedule: "09:30 - 19:30 de lunes a viernes",
          },
        },
        isPublished: homeData.isPublished || false,
      };
      
      setFormData(data);
      setInitialData(JSON.stringify(data));
      setHasUnsavedChanges(false);
    }
  }, [homeData]);

  // Detectar cambios en el formulario
  useEffect(() => {
    if (initialData) {
      const currentData = JSON.stringify(formData);
      setHasUnsavedChanges(currentData !== initialData);
    }
  }, [formData, initialData]);

  const handleSave = async () => {
    try {
      console.log("HomeData antes de guardar:", homeData);
      console.log("HomeData ID:", homeData?.id);
      
      let savedHome;
      
      if (homeData?.id && homeData.id !== "" && homeData.id !== "undefined") {
        console.log("Actualizando con ID:", homeData.id);
        savedHome = await updateHome(homeData.id, formData);
      } else {
        console.log("Creando nuevo home");
        savedHome = await createHome(formData);
      }
      
      console.log("Home guardado:", savedHome);
      showToast("Guardado exitosamente", "success");
      
      // Resetear el estado de cambios sin guardar
      setInitialData(JSON.stringify(formData));
      setHasUnsavedChanges(false);
      
      // Recargar los datos para asegurar que tenemos el ID correcto
      await loadHomeData();
    } catch (err) {
      console.error("Error saving:", err);
      showToast("Error al guardar: " + (err instanceof Error ? err.message : "Error desconocido"), "error");
    }
  };

  const handlePreview = () => {
    window.open("/", "_blank");
  };

  // Funciones para Slider
  const addSlideItem = () => {
    const newItem: SliderItem = {
      id: `slide-${Date.now()}`,
      image: "",
      title: "",
      description: "",
      order: formData.sliderSection.slides.length,
      isActive: true,
    };
    setFormData((prev) => ({
      ...prev,
      sliderSection: {
        ...prev.sliderSection,
        slides: [...prev.sliderSection.slides, newItem],
      },
    }));
  };

  const updateSlideItem = (index: number, field: keyof SliderItem, value: string | number | boolean) => {
    setFormData((prev) => ({
      ...prev,
      sliderSection: {
        ...prev.sliderSection,
        slides: prev.sliderSection.slides.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        ),
      },
    }));
  };

  const removeSlideItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      sliderSection: {
        ...prev.sliderSection,
        slides: prev.sliderSection.slides.filter((_, i) => i !== index),
      },
    }));
  };

  const moveSlideItem = (index: number, direction: "up" | "down") => {
    const newSlides = [...formData.sliderSection.slides];
    const newIndex = direction === "up" ? index - 1 : index + 1;

    if (newIndex < 0 || newSlides.length) return;

    [newSlides[index], newSlides[newIndex]] = [newSlides[newIndex], newSlides[index]];
    newSlides.forEach((item, idx) => {
      item.order = idx;
    });

    setFormData((prev) => ({ 
      ...prev, 
      sliderSection: {
        ...prev.sliderSection,
        slides: newSlides,
      },
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex items-center space-x-2">
          <FiLoader className="animate-spin h-5 w-5 text-accent-100" />
          <span className="text-bg-200">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-7xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/admin")}
            className="text-bg-200 hover:text-bg-300"
          >
            ← Volver
          </button>
          <h1 className="text-2xl font-bold text-bg-300">Editor de Inicio</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePreview}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <FiEye className="h-4 w-4" />
            <span>Vista Previa</span>
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center space-x-2 px-4 py-2 bg-accent-100 text-white rounded-md hover:bg-accent-200 disabled:opacity-50"
          >
            <FiSave className="h-4 w-4" />
            <span>{isSaving ? "Guardando..." : "Guardar"}</span>
          </button>
        </div>
      </div>

      {/* Publicar */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <input
            id="isPublished"
            type="checkbox"
            checked={formData.isPublished}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, isPublished: e.target.checked }))
            }
            className="h-4 w-4 text-accent-100 focus:ring-accent-100 border-gray-300 rounded"
          />
          <label htmlFor="isPublished" className="ml-2 block text-sm text-bg-300">
            Página publicada (visible para los visitantes)
          </label>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold text-bg-300">Sección Hero (Banner Principal)</h2>
        <div>
          <label className="block text-sm font-medium text-bg-300 mb-2">Título</label>
          <input
            type="text"
            value={formData.heroSection.title}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                heroSection: { ...prev.heroSection, title: e.target.value },
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Bienvenido a AST"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-bg-300 mb-2">Descripción</label>
          <textarea
            value={formData.heroSection.description}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                heroSection: { ...prev.heroSection, description: e.target.value },
              }))
            }
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Descripción del hero"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-bg-300 mb-2">Imagen de Fondo</label>
          <MultimediaSelector
            value={formData.heroSection.backgroundImage}
            onChange={(value: string) =>
              setFormData((prev) => ({
                ...prev,
                heroSection: { ...prev.heroSection, backgroundImage: value },
              }))
            }
            placeholder="Selecciona la imagen de fondo"
            acceptedTypes={["image"]}
          />
        </div>
      </div>

      {/* Slider Section */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-bg-300">Slider (Carrusel de Imágenes)</h2>
          <button
            onClick={addSlideItem}
            className="flex items-center space-x-2 px-4 py-2 bg-accent-100 text-white rounded-md hover:bg-accent-200"
          >
            <FiPlus className="h-4 w-4" />
            <span>Agregar Slide</span>
          </button>
        </div>
        <div className="space-y-4 mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.sliderSection.autoplay}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      sliderSection: {
                        ...prev.sliderSection,
                        autoplay: e.target.checked,
                      },
                    }))
                  }
                  className="h-4 w-4 text-accent-100"
                />
                <span className="text-sm text-bg-300">Autoplay</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-bg-300 mb-1">Intervalo (ms)</label>
              <input
                type="number"
                value={formData.sliderSection.interval}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    sliderSection: {
                      ...prev.sliderSection,
                      interval: parseInt(e.target.value) || 5000,
                    },
                  }))
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                min="1000"
                step="1000"
              />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {formData.sliderSection.slides.map((slide, index) => (
            <div key={slide.id} className="border border-gray-300 rounded-md p-4 space-y-3 bg-gray-50">
              <div className="flex justify-between items-center">
                <span className="font-medium text-bg-300">Slide #{index + 1}</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => moveSlideItem(index, "up")}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-bg-200 disabled:opacity-30"
                  >
                    <FiChevronUp className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => moveSlideItem(index, "down")}
                    disabled={index === formData.sliderSection.slides.length - 1}
                    className="p-1 text-gray-400 hover:text-bg-200 disabled:opacity-30"
                  >
                    <FiChevronDown className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => removeSlideItem(index)}
                    className="p-1 text-red-600 hover:text-red-800"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-bg-300 mb-1">Imagen</label>
                <MultimediaSelector
                  value={slide.image}
                  onChange={(value: string) => updateSlideItem(index, "image", value)}
                  placeholder="Selecciona la imagen del slide"
                  acceptedTypes={["image"]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-bg-300 mb-1">Título</label>
                <input
                  type="text"
                  value={slide.title}
                  onChange={(e) => updateSlideItem(index, "title", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                  placeholder="Título del slide"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-bg-300 mb-1">Descripción</label>
                <textarea
                  value={slide.description}
                  onChange={(e) => updateSlideItem(index, "description", e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                  placeholder="Descripción del slide"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={slide.isActive}
                  onChange={(e) => updateSlideItem(index, "isActive", e.target.checked)}
                  className="h-4 w-4 text-accent-100"
                />
                <label className="ml-2 text-sm text-bg-300">Slide activo</label>
              </div>
            </div>
          ))}
          {formData.sliderSection.slides.length === 0 && (
            <p className="text-center text-gray-500 py-4">No hay slides configurados</p>
          )}
        </div>
      </div>

      {/* AI Section */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold text-bg-300">Sección de IA</h2>
        <div>
          <label className="block text-sm font-medium text-bg-300 mb-2">Título</label>
          <input
            type="text"
            value={formData.iaSection.title}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                iaSection: { ...prev.iaSection, title: e.target.value },
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-bg-300 mb-2">Descripción</label>
          <textarea
            value={formData.iaSection.description}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                iaSection: { ...prev.iaSection, description: e.target.value },
              }))
            }
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-bg-300 mb-2">Imagen</label>
          <MultimediaSelector
            value={formData.iaSection.image}
            onChange={(value: string) =>
              setFormData((prev) => ({
                ...prev,
                iaSection: { ...prev.iaSection, image: value },
              }))
            }
            placeholder="Selecciona la imagen"
            acceptedTypes={["image"]}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-bg-300 mb-2">Texto del Botón</label>
            <input
              type="text"
              value={formData.iaSection.buttonText}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  iaSection: { ...prev.iaSection, buttonText: e.target.value },
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-bg-300 mb-2">Link del Botón</label>
            <input
              type="text"
              value={formData.iaSection.buttonLink}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  iaSection: { ...prev.iaSection, buttonLink: e.target.value },
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Video Section */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold text-bg-300">Sección de Video</h2>
        <div>
          <label className="block text-sm font-medium text-bg-300 mb-2">Título</label>
          <input
            type="text"
            value={formData.videoSection.title}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                videoSection: { ...prev.videoSection, title: e.target.value },
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-bg-300 mb-2">URL del Video (YouTube Embed)</label>
          <input
            type="text"
            value={formData.videoSection.videoUrl}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                videoSection: { ...prev.videoSection, videoUrl: e.target.value },
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="https://www.youtube.com/embed/..."
          />
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold text-bg-300">Sección de Contacto</h2>
        <div>
          <label className="block text-sm font-medium text-bg-300 mb-2">Título</label>
          <input
            type="text"
            value={formData.contactSection.title}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                contactSection: { 
                  ...prev.contactSection, 
                  title: e.target.value 
                },
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-bg-300 mb-2">Teléfono 1</label>
            <input
              type="text"
              value={formData.contactSection.contactInfo.phone1}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contactSection: { 
                    ...prev.contactSection, 
                    contactInfo: {
                      ...prev.contactSection.contactInfo,
                      phone1: e.target.value 
                    }
                  },
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-bg-300 mb-2">Teléfono 2</label>
            <input
              type="text"
              value={formData.contactSection.contactInfo.phone2}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contactSection: { 
                    ...prev.contactSection, 
                    contactInfo: {
                      ...prev.contactSection.contactInfo,
                      phone2: e.target.value 
                    }
                  },
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-bg-300 mb-2">Email</label>
          <input
            type="email"
            value={formData.contactSection.contactInfo.email}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                contactSection: { 
                  ...prev.contactSection, 
                  contactInfo: {
                    ...prev.contactSection.contactInfo,
                    email: e.target.value 
                  }
                },
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-bg-300 mb-2">Horario de Atención</label>
          <input
            type="text"
            value={formData.contactSection.contactInfo.schedule}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                contactSection: { 
                  ...prev.contactSection, 
                  contactInfo: {
                    ...prev.contactSection.contactInfo,
                    schedule: e.target.value 
                  }
                },
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Cambios sin guardar"
        message="Tienes cambios sin guardar. Si sales ahora, se perderán todos los cambios. ¿Estás seguro de que quieres salir?"
        confirmText="Salir sin guardar"
        cancelText="Continuar editando"
        type="warning"
        onConfirm={confirmNavigation}
        onCancel={cancelNavigation}
      />
    </>
  );
};

export default HomeEditor;
