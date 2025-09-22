import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { usePageManagement } from "../page-management/hooks/usePageManagement";
import type {
  ContentSection,
  ContentSectionType,
} from "../page-management/types/pageTypes";
import {
  FiSave,
  FiEye,
  FiArrowLeft,
  FiLoader,
  FiTrash2,
  FiMove,
} from "react-icons/fi";

const PageEditor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const template = searchParams.get("template");

  const {
    customPages,
    loading,
    error,
    createCustomPage,
    updateCustomPage,
    createPageFromTemplate,
    generateSlug,
    validateSlug,
  } = usePageManagement();

  const isEditing = !!id;
  const existingPage = isEditing
    ? customPages.find((page) => page.id === id)
    : null;

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    metaTitle: "",
    metaDescription: "",
    isPublished: false,
    content: [] as ContentSection[],
  });

  const [isSaving, setIsSaving] = useState(false);
  const [slugError, setSlugError] = useState("");

  useEffect(() => {
    if (existingPage) {
      setFormData({
        title: existingPage.title,
        slug: existingPage.slug,
        metaTitle: existingPage.metaTitle || "",
        metaDescription: existingPage.metaDescription || "",
        isPublished: existingPage.isPublished,
        content: existingPage.content,
      });
    } else if (template) {
      const tempTitle = "Nueva Página";
      const tempSlug = generateSlug(tempTitle);

      setFormData({
        title: tempTitle,
        slug: tempSlug,
        metaTitle: "",
        metaDescription: "",
        isPublished: false,
        content: [],
      });
    }
  }, [existingPage, template, generateSlug]);

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({ ...prev, title }));
    if (!isEditing) {
      const newSlug = generateSlug(title);
      setFormData((prev) => ({ ...prev, slug: newSlug }));
    }
  };

  const handleSlugChange = async (slug: string) => {
    setFormData((prev) => ({ ...prev, slug }));

    if (slug) {
      const isValid = await validateSlug(slug, isEditing ? id : undefined);
      setSlugError(isValid ? "" : "Este slug ya está en uso");
    }
  };

  // Content Section Management
  const addContentSection = (type: ContentSectionType) => {
    const newSection: ContentSection = {
      id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      data: getDefaultSectionData(type),
      order: formData.content.length,
      gridWidth: 12, // Por defecto ocupa todo el ancho
    };

    setFormData((prev) => ({
      ...prev,
      content: [...prev.content, newSection],
    }));
  };

  const updateContentSection = (sectionId: string, data: ContentSection["data"]) => {
    setFormData((prev) => ({
      ...prev,
      content: prev.content.map((section) =>
        section.id === sectionId ? { ...section, data } : section
      ),
    }));
  };

  const updateFullContentSection = (sectionId: string, updatedSection: Partial<ContentSection>) => {
    setFormData((prev) => ({
      ...prev,
      content: prev.content.map((section) =>
        section.id === sectionId ? { ...section, ...updatedSection } : section
      ),
    }));
  };

  const removeContentSection = (sectionId: string) => {
    setFormData((prev) => ({
      ...prev,
      content: prev.content
        .filter((section) => section.id !== sectionId)
        .map((section, index) => ({ ...section, order: index })),
    }));
  };

  const moveSection = (sectionId: string, direction: "up" | "down") => {
    setFormData((prev) => {
      const sections = [...prev.content];
      const index = sections.findIndex((s) => s.id === sectionId);

      if (index === -1) return prev;

      const newIndex = direction === "up" ? index - 1 : index + 1;

      if (newIndex < 0 || newIndex >= sections.length) return prev;

      // Swap sections
      [sections[index], sections[newIndex]] = [
        sections[newIndex],
        sections[index],
      ];

      // Update order
      sections.forEach((section, idx) => {
        section.order = idx;
      });

      return { ...prev, content: sections };
    });
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      alert("El título es requerido");
      return;
    }

    if (!formData.slug.trim()) {
      alert("El slug es requerido");
      return;
    }

    if (slugError) {
      alert("Por favor corrige los errores antes de guardar");
      return;
    }

    setIsSaving(true);

    try {
      if (isEditing && existingPage) {
        await updateCustomPage({
          ...existingPage,
          ...formData,
        });
      } else {
        if (template) {
          // Create from template
          await createPageFromTemplate(template, {
            title: formData.title,
            slug: formData.slug,
          });
        } else {
          // Create new page
          await createCustomPage(formData);
        }
      }

      navigate("/admin/pages");
    } catch (err) {
      console.error("Error saving page:", err);
      alert("Error al guardar la página");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    if (formData.slug) {
      window.open(`/${formData.slug}`, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex items-center space-x-2">
          <FiLoader className="animate-spin h-5 w-5 text-indigo-600" />
          <span className="text-gray-600">Cargando...</span>
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
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/admin/pages")}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <FiArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? "Editar Página" : "Nueva Página"}
            </h1>
            {template && (
              <p className="text-sm text-gray-600">
                Usando plantilla: {template}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handlePreview}
            disabled={!formData.slug}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-md disabled:opacity-50"
          >
            <FiEye className="mr-2 h-4 w-4" />
            Vista Previa
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving || !!slugError}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSaving ? (
              <FiLoader className="animate-spin mr-2 h-4 w-4" />
            ) : (
              <FiSave className="mr-2 h-4 w-4" />
            )}
            {isSaving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Título *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ingresa el título de la página"
            />
          </div>

          <div>
            <label
              htmlFor="slug"
              className="block text-sm font-medium text-gray-700"
            >
              Slug (URL) *
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                {window.location.origin}/
              </span>
              <input
                type="text"
                id="slug"
                value={formData.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                className={`flex-1 block w-full px-3 py-2 border rounded-none rounded-r-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                  slugError ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="url-de-la-pagina"
              />
            </div>
            {slugError && (
              <p className="mt-1 text-sm text-red-600">{slugError}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="metaTitle"
              className="block text-sm font-medium text-gray-700"
            >
              Meta Título (SEO)
            </label>
            <input
              type="text"
              id="metaTitle"
              value={formData.metaTitle}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, metaTitle: e.target.value }))
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Título para SEO (opcional)"
            />
          </div>

          <div>
            <label
              htmlFor="metaDescription"
              className="block text-sm font-medium text-gray-700"
            >
              Meta Descripción (SEO)
            </label>
            <textarea
              id="metaDescription"
              rows={3}
              value={formData.metaDescription}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  metaDescription: e.target.value,
                }))
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Descripción para SEO (opcional)"
            />
          </div>

          <div className="flex items-center">
            <input
              id="isPublished"
              type="checkbox"
              checked={formData.isPublished}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isPublished: e.target.checked,
                }))
              }
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              htmlFor="isPublished"
              className="ml-2 block text-sm text-gray-900"
            >
              Publicar página
            </label>
          </div>
        </div>

        {/* Content Sections */}
        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Contenido de la Página
            </h3>
            <div className="text-sm text-gray-500">
              {formData.content.length} sección(es)
            </div>
          </div>

          {/* Add Content Section Buttons */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Agregar Sección
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {sectionTypes.map((sectionType) => (
                <button
                  key={sectionType.type}
                  onClick={() => addContentSection(sectionType.type)}
                  className="flex flex-col items-center p-3 border border-gray-300 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                >
                  <span className="text-2xl mb-1">{sectionType.icon}</span>
                  <span className="text-xs text-center">
                    {sectionType.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Sections */}
          {formData.content.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="mx-auto h-12 w-12 text-gray-400 text-4xl">📄</div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No hay contenido
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Comienza agregando una sección de contenido arriba.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {formData.content
                .sort((a, b) => a.order - b.order)
                .map((section, index) => (
                  <ContentSectionEditor
                    key={section.id}
                    section={section}
                    index={index}
                    totalSections={formData.content.length}
                    onUpdate={(dataOrSection) => {
                      // Si es una sección completa (tiene id), actualizar toda la sección
                      if (typeof dataOrSection === 'object' && dataOrSection && 'id' in dataOrSection) {
                        updateFullContentSection(section.id, dataOrSection as Partial<ContentSection>);
                      } else {
                        // Si son solo datos, actualizar solo los datos
                        updateContentSection(section.id, dataOrSection as ContentSection["data"]);
                      }
                    }}
                    onRemove={() => removeContentSection(section.id)}
                    onMove={(direction) => moveSection(section.id, direction)}
                  />
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Section types configuration
const sectionTypes: { type: ContentSectionType; name: string; icon: string }[] =
  [
    { type: "hero", name: "Hero", icon: "🎯" },
    { type: "text", name: "Texto", icon: "📝" },
    { type: "image", name: "Imagen", icon: "🖼️" },
    { type: "gallery", name: "Galería", icon: "🖼️" },
    { type: "video", name: "Video", icon: "🎥" },
    { type: "contact-form", name: "Formulario", icon: "📞" },
    { type: "testimonials", name: "Testimonios", icon: "💬" },
    { type: "features", name: "Características", icon: "⭐" },
    { type: "cta", name: "Call to Action", icon: "🎯" },
    { type: "spacer", name: "Espaciador", icon: "⬜" },
  ];

// Default data for each section type
const getDefaultSectionData = (type: ContentSectionType): ContentSection["data"] => {
  switch (type) {
    case "hero":
      return {
        title: "Título del Hero",
        subtitle: "Subtítulo descriptivo",
        alignment: "center" as const,
        buttonText: "Call to Action",
        buttonLink: "#",
        backgroundImage: "",
        backgroundColor: "",
        textColor: "",
      };
    case "text":
      return {
        content: "Escribe tu contenido aquí...",
        alignment: "left" as const,
        fontSize: "medium" as const,
        padding: "medium" as const,
      };
    case "image":
      return {
        src: "",
        alt: "",
        width: "medium" as const,
        alignment: "center" as const,
        rounded: false,
      };
    case "gallery":
      return {
        images: [],
        columns: 3 as const,
        spacing: "medium" as const,
      };
    case "video":
      return {
        src: "",
        autoplay: false,
        controls: true,
        width: "medium" as const,
      };
    case "contact-form":
      return {
        fields: [
          {
            id: "name",
            type: "text" as const,
            label: "Nombre",
            required: true,
          },
          {
            id: "email",
            type: "email" as const,
            label: "Email",
            required: true,
          },
          {
            id: "message",
            type: "textarea" as const,
            label: "Mensaje",
            required: true,
          },
        ],
        submitButtonText: "Enviar",
        successMessage: "Gracias por tu mensaje",
      };
    case "testimonials":
      return {
        layout: "grid" as const,
        testimonials: [],
      };
    case "features":
      return {
        layout: "grid" as const,
        columns: 3 as const,
        features: [],
      };
    case "cta":
      return {
        title: "¿Listo para comenzar?",
        buttonText: "Comenzar",
        buttonLink: "#",
        alignment: "center" as const,
      };
    case "spacer":
      return {
        height: "medium" as const,
      };
    default:
      // Return a default object with all properties set to empty values for unknown types
      return {
        title: "",
        subtitle: "",
        alignment: undefined,
        buttonText: "",
        buttonLink: "",
        content: "",
        fontSize: "",
        padding: "",
        src: "",
        alt: "",
        width: "medium",
        rounded: false,
        caption: "",
        images: [],
        columns: 0,
        spacing: "",
        autoplay: false,
        controls: false,
        fields: [],
        submitButtonText: "",
        successMessage: "",
        layout: "",
        testimonials: [],
        features: [],
        description: "",
        height: "",
      };
  }
};

// Content Section Editor Component
interface ContentSectionEditorProps {
  section: ContentSection;
  index: number;
  totalSections: number;
  onUpdate: (dataOrSection: ContentSection["data"] | Partial<ContentSection>) => void;
  onRemove: () => void;
  onMove: (direction: "up" | "down") => void;
}

const ContentSectionEditor: React.FC<ContentSectionEditorProps> = ({
  section,
  index,
  totalSections,
  onUpdate,
  onRemove,
  onMove,
}) => {
  const sectionTypeNames: Record<string, string> = {
    hero: "🎯 Hero",
    text: "📝 Texto",
    image: "🖼️ Imagen",
    gallery: "🖼️ Galería",
    video: "🎥 Video",
    "contact-form": "📞 Formulario",
    testimonials: "💬 Testimonios",
    features: "⭐ Características",
    cta: "🎯 Call to Action",
    spacer: "⬜ Espaciador",
  };

  return (
    <div className="border border-gray-200 rounded-lg">
      <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <span className="font-medium text-gray-900">
            Sección {index + 1}:{" "}
            {sectionTypeNames[section.type] || section.type}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onMove("up")}
            disabled={index === 0}
            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            title="Mover arriba"
          >
            <FiMove className="h-4 w-4 transform rotate-180" />
          </button>
          <button
            onClick={() => onMove("down")}
            disabled={index === totalSections - 1}
            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            title="Mover abajo"
          >
            <FiMove className="h-4 w-4" />
          </button>
          <button
            onClick={onRemove}
            className="p-1 text-gray-400 hover:text-red-600"
            title="Eliminar sección"
          >
            <FiTrash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Grid Width Control */}
        <div className="border-b border-gray-100 pb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ancho en Grid (columnas de 12)
          </label>
          <select
            value={section.gridWidth || 12}
            onChange={(e) => {
              const updatedSection = {
                ...section,
                gridWidth: parseInt(e.target.value)
              };
              // Necesitamos actualizar toda la sección, no solo los datos
              if (onUpdate) {
                onUpdate(updatedSection);
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value={12}>12 columnas (ancho completo)</option>
            <option value={6}>6 columnas (mitad)</option>
            <option value={4}>4 columnas (tercio)</option>
            <option value={3}>3 columnas (cuarto)</option>
            <option value={8}>8 columnas (dos tercios)</option>
            <option value={9}>9 columnas (tres cuartos)</option>
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Controla cuánto espacio horizontal ocupa esta sección. Las secciones se agruparán en filas automáticamente.
          </p>
        </div>

        <ContentSectionForm
          type={section.type}
          data={section.data}
          onChange={onUpdate}
        />
      </div>
    </div>
  );
};

// Content Section Form Component
interface ContentSectionFormProps {
  type: ContentSectionType;
  data: any;
  onChange: (data: any) => void;
}

const ContentSectionForm: React.FC<ContentSectionFormProps> = ({
  type,
  data,
  onChange,
}) => {
  const updateField = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  switch (type) {
    case "hero":
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Título
            </label>
            <input
              type="text"
              value={data.title || ""}
              onChange={(e) => updateField("title", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Título del hero"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Subtítulo
            </label>
            <textarea
              rows={2}
              value={data.subtitle || ""}
              onChange={(e) => updateField("subtitle", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Subtítulo del hero"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Imagen de Fondo
            </label>
            <input
              type="text"
              value={data.backgroundImage || ""}
              onChange={(e) => updateField("backgroundImage", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="URL de la imagen de fondo"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Color de Fondo
            </label>
            <input
              type="text"
              value={data.backgroundColor || ""}
              onChange={(e) => updateField("backgroundColor", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Color de fondo (ej: #ff0000, red)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Color del Texto
            </label>
            <input
              type="text"
              value={data.textColor || ""}
              onChange={(e) => updateField("textColor", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Color del texto (ej: #ffffff, white)"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Texto del Botón
              </label>
              <input
                type="text"
                value={data.buttonText || ""}
                onChange={(e) => updateField("buttonText", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Texto del botón"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Enlace del Botón
              </label>
              <input
                type="text"
                value={data.buttonLink || ""}
                onChange={(e) => updateField("buttonLink", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="/ruta-del-enlace"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Alineación
            </label>
            <select
              value={data.alignment || "center"}
              onChange={(e) => updateField("alignment", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="left">Izquierda</option>
              <option value="center">Centro</option>
              <option value="right">Derecha</option>
            </select>
          </div>
        </div>
      );

    case "text":
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Título (Opcional)
            </label>
            <input
              type="text"
              value={data.title || ""}
              onChange={(e) => updateField("title", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Título de la sección"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contenido
            </label>
            <textarea
              rows={6}
              value={data.content || ""}
              onChange={(e) => updateField("content", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Escribe el contenido aquí..."
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Alineación
              </label>
              <select
                value={data.alignment || "left"}
                onChange={(e) => updateField("alignment", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="left">Izquierda</option>
                <option value="center">Centro</option>
                <option value="right">Derecha</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tamaño de Fuente
              </label>
              <select
                value={data.fontSize || "medium"}
                onChange={(e) => updateField("fontSize", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="small">Pequeño</option>
                <option value="medium">Mediano</option>
                <option value="large">Grande</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Espaciado
              </label>
              <select
                value={data.padding || "medium"}
                onChange={(e) => updateField("padding", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="small">Pequeño</option>
                <option value="medium">Mediano</option>
                <option value="large">Grande</option>
              </select>
            </div>
          </div>
        </div>
      );

    case "image":
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              URL de la Imagen
            </label>
            <input
              type="url"
              value={data.src || ""}
              onChange={(e) => updateField("src", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Texto Alternativo
            </label>
            <input
              type="text"
              value={data.alt || ""}
              onChange={(e) => updateField("alt", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Descripción de la imagen"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Pie de Imagen (Opcional)
            </label>
            <input
              type="text"
              value={data.caption || ""}
              onChange={(e) => updateField("caption", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Pie de imagen"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tamaño
              </label>
              <select
                value={data.width || "medium"}
                onChange={(e) => updateField("width", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="small">Pequeño</option>
                <option value="medium">Mediano</option>
                <option value="large">Grande</option>
                <option value="full">Ancho completo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Alineación
              </label>
              <select
                value={data.alignment || "center"}
                onChange={(e) => updateField("alignment", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="left">Izquierda</option>
                <option value="center">Centro</option>
                <option value="right">Derecha</option>
              </select>
            </div>
          </div>
          <div className="flex items-center">
            <input
              id={`rounded-${data.id}`}
              type="checkbox"
              checked={data.rounded || false}
              onChange={(e) => updateField("rounded", e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              htmlFor={`rounded-${data.id}`}
              className="ml-2 block text-sm text-gray-900"
            >
              Bordes redondeados
            </label>
          </div>
        </div>
      );

    case "cta":
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Título
            </label>
            <input
              type="text"
              value={data.title || ""}
              onChange={(e) => updateField("title", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Título del call to action"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              rows={3}
              value={data.description || ""}
              onChange={(e) => updateField("description", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Descripción del call to action"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Texto del Botón
              </label>
              <input
                type="text"
                value={data.buttonText || ""}
                onChange={(e) => updateField("buttonText", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Texto del botón"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Enlace del Botón
              </label>
              <input
                type="text"
                value={data.buttonLink || ""}
                onChange={(e) => updateField("buttonLink", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="/ruta-del-enlace"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Alineación
            </label>
            <select
              value={data.alignment || "center"}
              onChange={(e) => updateField("alignment", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="left">Izquierda</option>
              <option value="center">Centro</option>
              <option value="right">Derecha</option>
            </select>
          </div>
        </div>
      );

    case "spacer":
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Altura del Espaciador
            </label>
            <select
              value={data.height || "medium"}
              onChange={(e) => updateField("height", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="small">Pequeño (2rem)</option>
              <option value="medium">Mediano (4rem)</option>
              <option value="large">Grande (6rem)</option>
              <option value="xl">Extra Grande (8rem)</option>
            </select>
          </div>
        </div>
      );

    default:
      return (
        <div className="text-center py-6 text-gray-500">
          <p>Editor para tipo "{type}" en desarrollo</p>
          <p className="text-sm mt-1">Los datos se guardarán automáticamente</p>
          <div className="mt-4">
            <textarea
              rows={4}
              value={JSON.stringify(data, null, 2)}
              onChange={(e) => {
                try {
                  const newData = JSON.parse(e.target.value);
                  onChange(newData);
                } catch {
                  // Invalid JSON, ignore
                }
              }}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
              placeholder="Datos en formato JSON"
            />
          </div>
        </div>
      );
  }
};

export default PageEditor;
