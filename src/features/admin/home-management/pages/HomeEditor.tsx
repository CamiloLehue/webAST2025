import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useHomeManagement } from "../hooks/useHomeManagement";
import type { SliderItem, HeroSection, AISection, VideoSection, ContactSection } from "../types/homeTypes";
import MultimediaSelector from "../../../../components/editor/MultimediaSelector";
import { FiLoader, FiSave, FiEye, FiPlus, FiTrash2, FiChevronUp, FiChevronDown } from "react-icons/fi";

const HomeEditor: React.FC = () => {
  const navigate = useNavigate();
  const { homeData, loading, error, isSaving, createHome, updateHome } = useHomeManagement();

  const [formData, setFormData] = useState({
    slider: [] as SliderItem[],
    heroSection: {
      title: "Bienvenido a AST",
      description: "Conectamos tecnología e innovación para transformar sectores productivos clave en Chile y Latinoamérica.",
      backgroundImage: "slider/slider04.JPG",
    } as HeroSection,
    aiSection: {
      title: "Implementamos IA",
      description: "En AST Networks estamos incorporando inteligencia artificial para potenciar nuestras soluciones de monitoreo, automatización y análisis de datos.",
      image: "img/inicio/ia-wisensor.jpg",
      buttonText: "Ver más",
      buttonLink: "#",
    } as AISection,
    videoSection: {
      title: "Puedes ver más sobre nosotros aquí",
      videoUrl: "https://www.youtube.com/embed/fI-tzs7NnNE?si=HCiO3OqtZgFZsa4r",
      description: "",
    } as VideoSection,
    contactSection: {
      phone1: "+56 2 3366 3478",
      phone2: "+56 2 3366 3478",
      email: "ventas@ast.cl",
      schedule: "09:30 - 19:30 de lunes a viernes",
    } as ContactSection,
    isPublished: false,
  });

  useEffect(() => {
    if (homeData) {
      setFormData({
        slider: homeData.slider || [],
        heroSection: homeData.heroSection || {
          title: "Bienvenido a AST",
          description: "Conectamos tecnología e innovación para transformar sectores productivos clave en Chile y Latinoamérica.",
          backgroundImage: "slider/slider04.JPG",
        },
        aiSection: homeData.aiSection || {
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
          phone1: "+56 2 3366 3478",
          phone2: "+56 2 3366 3478",
          email: "ventas@ast.cl",
          schedule: "09:30 - 19:30 de lunes a viernes",
        },
        isPublished: homeData.isPublished || false,
      });
    }
  }, [homeData]);

  const handleSave = async () => {
    try {
      if (homeData?.id) {
        await updateHome(homeData.id, formData);
      } else {
        await createHome(formData);
      }
      alert("Guardado exitosamente");
    } catch (err) {
      console.error("Error saving:", err);
      alert("Error al guardar");
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
      order: formData.slider.length,
      isActive: true,
    };
    setFormData((prev) => ({
      ...prev,
      slider: [...prev.slider, newItem],
    }));
  };

  const updateSlideItem = (index: number, field: keyof SliderItem, value: string | number | boolean) => {
    setFormData((prev) => ({
      ...prev,
      slider: prev.slider.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeSlideItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      slider: prev.slider.filter((_, i) => i !== index),
    }));
  };

  const moveSlideItem = (index: number, direction: "up" | "down") => {
    const newSlider = [...formData.slider];
    const newIndex = direction === "up" ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= newSlider.length) return;

    [newSlider[index], newSlider[newIndex]] = [newSlider[newIndex], newSlider[index]];
    newSlider.forEach((item, idx) => {
      item.order = idx;
    });

    setFormData((prev) => ({ ...prev, slider: newSlider }));
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
        <div className="space-y-4">
          {formData.slider.map((slide, index) => (
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
                    disabled={index === formData.slider.length - 1}
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
          {formData.slider.length === 0 && (
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
            value={formData.aiSection.title}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                aiSection: { ...prev.aiSection, title: e.target.value },
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-bg-300 mb-2">Descripción</label>
          <textarea
            value={formData.aiSection.description}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                aiSection: { ...prev.aiSection, description: e.target.value },
              }))
            }
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-bg-300 mb-2">Imagen</label>
          <MultimediaSelector
            value={formData.aiSection.image}
            onChange={(value: string) =>
              setFormData((prev) => ({
                ...prev,
                aiSection: { ...prev.aiSection, image: value },
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
              value={formData.aiSection.buttonText}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  aiSection: { ...prev.aiSection, buttonText: e.target.value },
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-bg-300 mb-2">Link del Botón</label>
            <input
              type="text"
              value={formData.aiSection.buttonLink}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  aiSection: { ...prev.aiSection, buttonLink: e.target.value },
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-bg-300 mb-2">Teléfono 1</label>
            <input
              type="text"
              value={formData.contactSection.phone1}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contactSection: { ...prev.contactSection, phone1: e.target.value },
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-bg-300 mb-2">Teléfono 2</label>
            <input
              type="text"
              value={formData.contactSection.phone2}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contactSection: { ...prev.contactSection, phone2: e.target.value },
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
            value={formData.contactSection.email}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                contactSection: { ...prev.contactSection, email: e.target.value },
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-bg-300 mb-2">Horario de Atención</label>
          <input
            type="text"
            value={formData.contactSection.schedule}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                contactSection: { ...prev.contactSection, schedule: e.target.value },
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default HomeEditor;
