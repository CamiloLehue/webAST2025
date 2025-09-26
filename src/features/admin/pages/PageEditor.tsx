import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { usePageManagement } from "../page-management/hooks/usePageManagement";
import RichTextEditor from "../../../components/editor/RichTextEditor";
import ImageSelector from "../../../components/editor/ImageSelector";
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

  const addContentSection = (type: ContentSectionType) => {
    const newSection: ContentSection = {
      id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      data: getDefaultSectionData(type),
      order: formData.content.length,
      gridWidth: 12,
    };

    setFormData((prev) => ({
      ...prev,
      content: [...prev.content, newSection],
    }));
  };

  const updateContentSection = (
    sectionId: string,
    data: ContentSection["data"]
  ) => {
    setFormData((prev) => ({
      ...prev,
      content: prev.content.map((section) =>
        section.id === sectionId ? { ...section, data } : section
      ),
    }));
  };

  const updateFullContentSection = (
    sectionId: string,
    updatedSection: Partial<ContentSection>
  ) => {
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

      [sections[index], sections[newIndex]] = [
        sections[newIndex],
        sections[index],
      ];

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
          await createPageFromTemplate(template, {
            title: formData.title,
            slug: formData.slug,
          });
        } else {
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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/admin/pages")}
            className="p-2 text-gray-400 hover:text-bg-200"
          >
            <FiArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-bg-100">
              {isEditing ? "Editar Página" : "Nueva Página"}
            </h1>
            {template && (
              <p className="text-sm text-bg-200">
                Usando plantilla: {template}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handlePreview}
            disabled={!formData.slug}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-bg-300 bg-white hover:bg-gray-50 rounded-md disabled:opacity-50"
          >
            <FiEye className="mr-2 h-4 w-4" />
            Vista Previa
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving || !!slugError}
            className="inline-flex items-center px-4 py-2 bg-accent-100 text-white rounded-md hover:bg-accent-200 disabled:opacity-50"
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

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-bg-300"
            >
              Título *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
              placeholder="Ingresa el título de la página"
            />
          </div>

          <div>
            <label
              htmlFor="slug"
              className="block text-sm font-medium text-bg-300"
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
                className={`flex-1 block w-full px-3 py-2 border rounded-none rounded-r-md focus:outline-none focus:ring-accent-100 focus:border-accent-100 ${
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
              className="block text-sm font-medium text-bg-300"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
              placeholder="Título para SEO (opcional)"
            />
          </div>

          <div>
            <label
              htmlFor="metaDescription"
              className="block text-sm font-medium text-bg-300"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
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
              className="h-4 w-4 text-accent-100 focus:ring-accent-100 border-gray-300 rounded"
            />
            <label
              htmlFor="isPublished"
              className="ml-2 block text-sm text-bg-100"
            >
              Publicar página
            </label>
          </div>
        </div>

        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-bg-100">
              Contenido de la Página
            </h3>
            <div className="text-sm text-gray-500">
              {formData.content.length} sección(es)
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-medium text-bg-300 mb-3">
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

          {formData.content.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="mx-auto h-12 w-12 text-gray-400 text-4xl">📄</div>
              <h3 className="mt-2 text-sm font-medium text-bg-100">
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
                      if (
                        typeof dataOrSection === "object" &&
                        dataOrSection &&
                        "id" in dataOrSection
                      ) {
                        updateFullContentSection(
                          section.id,
                          dataOrSection as Partial<ContentSection>
                        );
                      } else {
                        updateContentSection(
                          section.id,
                          dataOrSection as ContentSection["data"]
                        );
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

const sectionTypes: { type: ContentSectionType; name: string; icon: string }[] =
  [
    { type: "hero", name: "Hero", icon: "🎯" },
    { type: "hero-multi", name: "Hero Múltiple", icon: "🎨" },
    { type: "logo-section", name: "Logo/Título", icon: "🏢" },
    { type: "content-section", name: "Contenido", icon: "📄" },
    { type: "curved-section", name: "Sección Curva", icon: "🌊" },
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

const getDefaultSectionData = (
  type: ContentSectionType
): ContentSection["data"] => {
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
    case "hero-multi":
      return {
        title: "Título del Hero",
        description: "Descripción del servicio o producto",
        images: [],
        altText: "Imagen del hero",
        buttonText: "Ver video",
        buttonLink: "#",
        alignment: "center" as const,
        backgroundColor: "",
        textColor: "",
      };
    case "logo-section":
      return {
        logoSrc: "AST-Logo-white.png",
        logoAlt: "AST Logo",
        title: "TÍTULO DE LA SECCIÓN",
        backgroundColor: "#primary-100",
        textColor: "white",
        height: "medium" as const,
      };
    case "content-section":
      return {
        title: "Título de la sección",
        description: "Descripción del contenido...",
        images: [],
        altText: "Imagen de contenido",
        layout: "text-left" as const,
        autoSlide: false,
        className: "mt-10 h-full",
      };
    case "curved-section":
      return {
        title: "",
        content: "Contenido de la sección con fondo curvo...",
        iconSrc: "",
        iconAlt: "Ícono",
        backgroundColor: "#bg-400",
        textColor: "black",
        clipPath: "ellipse(100% 100% at 50% 100%)",
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return {} as any;
  }
};

interface ContentSectionEditorProps {
  section: ContentSection;
  index: number;
  totalSections: number;
  onUpdate: (
    dataOrSection: ContentSection["data"] | Partial<ContentSection>
  ) => void;
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
    "hero-multi": "🎨 Hero Múltiple",
    "logo-section": "🏢 Logo/Título",
    "content-section": "📄 Contenido",
    "curved-section": "🌊 Sección Curva",
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
    <div className="border border-white-100 rounded-lg">
      <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-white-100">
        <div className="flex items-center space-x-3">
          <span className="font-medium text-bg-100">
            Sección {index + 1}:{" "}
            {sectionTypeNames[section.type] || section.type}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onMove("up")}
            disabled={index === 0}
            className="p-1 text-gray-400 hover:text-bg-200 disabled:opacity-50"
            title="Mover arriba"
          >
            <FiMove className="h-4 w-4 transform rotate-180" />
          </button>
          <button
            onClick={() => onMove("down")}
            disabled={index === totalSections - 1}
            className="p-1 text-gray-400 hover:text-bg-200 disabled:opacity-50"
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
        <div className="border-b border-white pb-4">
          <label className="block text-sm font-medium text-bg-300 mb-2">
            Ancho en Grid (columnas de 12)
          </label>
          <select
            value={section.gridWidth || 12}
            onChange={(e) => {
              const updatedSection = {
                ...section,
                gridWidth: parseInt(e.target.value),
              };
              if (onUpdate) {
                onUpdate(updatedSection);
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
          >
            <option value={12}>12 columnas (ancho completo)</option>
            <option value={6}>6 columnas (mitad)</option>
            <option value={4}>4 columnas (tercio)</option>
            <option value={3}>3 columnas (cuarto)</option>
            <option value={8}>8 columnas (dos tercios)</option>
            <option value={9}>9 columnas (tres cuartos)</option>
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Controla cuánto espacio horizontal ocupa esta sección. Las secciones
            se agruparán en filas automáticamente.
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

interface ContentSectionFormProps {
  type: ContentSectionType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (data: any) => void;
}

const ContentSectionForm: React.FC<ContentSectionFormProps> = ({
  type,
  data,
  onChange,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateField = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  switch (type) {
    case "hero":
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-bg-300">
              Título
            </label>
            <input
              type="text"
              value={data.title || ""}
              onChange={(e) => updateField("title", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
              placeholder="Título del hero"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-bg-300">
              Subtítulo
            </label>
            <RichTextEditor
              value={data.subtitle || ""}
              onChange={(value) => updateField("subtitle", value)}
              placeholder="Subtítulo del hero"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-bg-300">
              Imagen de Fondo
            </label>
            <ImageSelector
              value={data.backgroundImage || ""}
              onChange={(value) => updateField("backgroundImage", value)}
              placeholder="URL de la imagen de fondo o selecciona de la galería"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-bg-300">
              Color de Fondo
            </label>
            <input
              type="text"
              value={data.backgroundColor || ""}
              onChange={(e) => updateField("backgroundColor", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
              placeholder="Color de fondo (ej: #ff0000, red)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-bg-300">
              Color del Texto
            </label>
            <input
              type="text"
              value={data.textColor || ""}
              onChange={(e) => updateField("textColor", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
              placeholder="Color del texto (ej: #ffffff, white)"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-bg-300">
                Texto del Botón
              </label>
              <input
                type="text"
                value={data.buttonText || ""}
                onChange={(e) => updateField("buttonText", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
                placeholder="Texto del botón"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-bg-300">
                Enlace del Botón
              </label>
              <input
                type="text"
                value={data.buttonLink || ""}
                onChange={(e) => updateField("buttonLink", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
                placeholder="/ruta-del-enlace"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-bg-300">
              Alineación
            </label>
            <select
              value={data.alignment || "center"}
              onChange={(e) => updateField("alignment", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
            >
              <option value="left">Izquierda</option>
              <option value="center">Centro</option>
              <option value="right">Derecha</option>
            </select>
          </div>
        </div>
      );

    case "hero-multi":
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-bg-300">
              Título
            </label>
            <input
              type="text"
              value={data.title as string || ""}
              onChange={(e) => updateField("title", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
              placeholder="Título del hero"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-bg-300">
              Descripción
            </label>
            <RichTextEditor
              value={data.description as string || ""}
              onChange={(value) => updateField("description", value)}
              placeholder="Descripción del servicio"
              rows={4}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-bg-300">
              Texto Alternativo
            </label>
            <input
              type="text"
              value={data.altText as string || ""}
              onChange={(e) => updateField("altText", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
              placeholder="Texto alternativo para las imágenes"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-bg-300">
              Imágenes
            </label>
            <div className="mt-2 space-y-2">
              {((data.images as string[]) || []).map((imageUrl: string, index: number) => (
                <div key={index} className="flex space-x-2 items-center">
                  <div className="flex-1">
                    <ImageSelector
                      value={imageUrl}
                      onChange={(value) => {
                        const newImages = [...((data.images as string[]) || [])];
                        newImages[index] = value;
                        updateField("images", newImages);
                      }}
                      placeholder="URL de la imagen o selecciona de la galería"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newImages = ((data.images as string[]) || []).filter(
                        (_: string, i: number) => i !== index
                      );
                      updateField("images", newImages);
                    }}
                    className="px-3 py-2 text-sm text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const newImages = [...((data.images as string[]) || []), ""];
                  updateField("images", newImages);
                }}
                className="w-full px-3 py-2 text-sm border-2 border-dashed border-gray-300 rounded-md text-bg-200 hover:border-gray-400"
              >
                + Agregar imagen
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-bg-300">
                Texto del Botón
              </label>
              <input
                type="text"
                value={data.buttonText as string || ""}
                onChange={(e) => updateField("buttonText", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
                placeholder="Ver video"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-bg-300">
                Enlace del Botón
              </label>
              <input
                type="text"
                value={data.buttonLink as string || ""}
                onChange={(e) => updateField("buttonLink", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
                placeholder="#"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-bg-300">
              Alineación
            </label>
            <select
              value={data.alignment as string || "center"}
              onChange={(e) => updateField("alignment", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
            >
              <option value="left">Izquierda</option>
              <option value="center">Centro</option>
              <option value="right">Derecha</option>
            </select>
          </div>
        </div>
      );

    case "logo-section":
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-bg-300">
              Logo (URL)
            </label>
            <ImageSelector
              value={data.logoSrc || ""}
              onChange={(value) => updateField("logoSrc", value)}
              placeholder="Logo desde la galería o URL externa"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-bg-300">
              Texto Alternativo del Logo
            </label>
            <input
              type="text"
              value={data.logoAlt || ""}
              onChange={(e) => updateField("logoAlt", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
              placeholder="AST Logo"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-bg-300">
              Título
            </label>
            <input
              type="text"
              value={data.title || ""}
              onChange={(e) => updateField("title", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
              placeholder="TÍTULO DE LA SECCIÓN"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-bg-300">
                Color de Fondo
              </label>
              <input
                type="text"
                value={data.backgroundColor || ""}
                onChange={(e) => updateField("backgroundColor", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
                placeholder="#primary-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-bg-300">
                Color del Texto
              </label>
              <input
                type="text"
                value={data.textColor || ""}
                onChange={(e) => updateField("textColor", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
                placeholder="white"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-bg-300">
              Altura de la Sección
            </label>
            <select
              value={data.height || "medium"}
              onChange={(e) => updateField("height", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
            >
              <option value="small">Pequeña (h-20)</option>
              <option value="medium">Mediana (h-28)</option>
              <option value="large">Grande (h-36)</option>
            </select>
          </div>
        </div>
      );

    case "content-section":
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-bg-300">
              Título (Opcional)
            </label>
            <input
              type="text"
              value={data.title || ""}
              onChange={(e) => updateField("title", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
              placeholder="Título de la sección"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-bg-300">
              Descripción
            </label>
            <RichTextEditor
              value={data.description || ""}
              onChange={(value) => updateField("description", value)}
              placeholder="Descripción del contenido..."
              rows={6}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-bg-300">
              Texto Alternativo
            </label>
            <input
              type="text"
              value={data.altText || ""}
              onChange={(e) => updateField("altText", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
              placeholder="Texto alternativo para las imágenes"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-bg-300">
              Imágenes
            </label>
            <div className="mt-2 space-y-2">
              {(data.images || []).map((imageUrl: string, index: number) => (
                <div key={index} className="flex space-x-2 items-center">
                  <ImageSelector
                    value={imageUrl}
                    onChange={(value) => {
                      const newImages = [...(data.images || [])];
                      newImages[index] = value;
                      updateField("images", newImages);
                    }}
                    placeholder={`Imagen ${index + 1} desde la galería o URL externa`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newImages = (data.images || []).filter(
                        (_: string, i: number) => i !== index
                      );
                      updateField("images", newImages);
                    }}
                    className="px-3 py-2 text-sm text-red-600 hover:text-red-800"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const newImages = [...(data.images || []), ""];
                  updateField("images", newImages);
                }}
                className="w-full px-3 py-2 text-sm border-2 border-dashed border-gray-300 rounded-md text-bg-200 hover:border-gray-400"
              >
                + Agregar imagen
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-bg-300">
              Layout
            </label>
            <select
              value={data.layout || "text-left"}
              onChange={(e) => updateField("layout", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
            >
              <option value="text-left">Texto a la Izquierda</option>
              <option value="text-right">Texto a la Derecha</option>
              <option value="text-center">Texto al Centro</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-bg-300">
              Clase CSS Adicional
            </label>
            <input
              type="text"
              value={data.className || ""}
              onChange={(e) => updateField("className", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
              placeholder="mt-10 h-full"
            />
          </div>
          <div className="flex items-center">
            <input
              id="autoSlide"
              type="checkbox"
              checked={data.autoSlide || false}
              onChange={(e) => updateField("autoSlide", e.target.checked)}
              className="h-4 w-4 text-accent-100 focus:ring-accent-100 border-gray-300 rounded"
            />
            <label
              htmlFor="autoSlide"
              className="ml-2 block text-sm text-bg-100"
            >
              Deslizamiento automático
            </label>
          </div>
        </div>
      );

    case "curved-section":
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-bg-300">
              Título (Opcional)
            </label>
            <input
              type="text"
              value={data.title || ""}
              onChange={(e) => updateField("title", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
              placeholder="Título de la sección"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-bg-300">
              Contenido
            </label>
            <RichTextEditor
              value={data.content || ""}
              onChange={(value) => updateField("content", value)}
              placeholder="Contenido de la sección..."
              rows={6}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-bg-300">
                Ícono (URL)
              </label>
              <input
                type="text"
                value={data.iconSrc || ""}
                onChange={(e) => updateField("iconSrc", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
                placeholder="/public/svg/services/satelital/cell_tower.svg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-bg-300">
                Texto Alternativo del Ícono
              </label>
              <input
                type="text"
                value={data.iconAlt || ""}
                onChange={(e) => updateField("iconAlt", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
                placeholder="Ícono descriptivo"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-bg-300">
                Color de Fondo
              </label>
              <input
                type="text"
                value={data.backgroundColor || ""}
                onChange={(e) => updateField("backgroundColor", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
                placeholder="#bg-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-bg-300">
                Color del Texto
              </label>
              <input
                type="text"
                value={data.textColor || ""}
                onChange={(e) => updateField("textColor", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
                placeholder="black"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-bg-300">
              Clip Path CSS
            </label>
            <input
              type="text"
              value={data.clipPath || ""}
              onChange={(e) => updateField("clipPath", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
              placeholder="ellipse(100% 100% at 50% 100%)"
            />
          </div>
        </div>
      );

    case "text":
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-bg-300">
              Título (Opcional)
            </label>
            <input
              type="text"
              value={data.title || ""}
              onChange={(e) => updateField("title", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
              placeholder="Título de la sección"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-bg-300">
              Contenido
            </label>
            <RichTextEditor
              value={data.content || ""}
              onChange={(value) => updateField("content", value)}
              placeholder="Escribe el contenido aquí..."
              rows={6}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-bg-300">
                Alineación
              </label>
              <select
                value={data.alignment || "left"}
                onChange={(e) => updateField("alignment", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
              >
                <option value="left">Izquierda</option>
                <option value="center">Centro</option>
                <option value="right">Derecha</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-bg-300">
                Tamaño de Fuente
              </label>
              <select
                value={data.fontSize || "medium"}
                onChange={(e) => updateField("fontSize", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
              >
                <option value="small">Pequeño</option>
                <option value="medium">Mediano</option>
                <option value="large">Grande</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-bg-300">
                Espaciado
              </label>
              <select
                value={data.padding || "medium"}
                onChange={(e) => updateField("padding", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
              >
                <option value="small">Pequeño</option>
                <option value="medium">Mediano</option>
                <option value="large">Grande</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-bg-300">
              Color de Fondo
            </label>
            <input
              type="text"
              value={data.backgroundColor || ""}
              onChange={(e) => updateField("backgroundColor", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
              placeholder="Color de fondo (ej: #f5f5f5, transparent)"
            />
          </div>
        </div>
      );

    case "image":
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-bg-300">
              URL de la Imagen
            </label>
            <ImageSelector
              value={data.src || ""}
              onChange={(value) => updateField("src", value)}
              placeholder="Imagen desde la galería o URL externa"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-bg-300">
              Texto Alternativo
            </label>
            <input
              type="text"
              value={data.alt || ""}
              onChange={(e) => updateField("alt", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
              placeholder="Descripción de la imagen"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-bg-300">
              Pie de Imagen (Opcional)
            </label>
            <input
              type="text"
              value={data.caption || ""}
              onChange={(e) => updateField("caption", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
              placeholder="Pie de imagen"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-bg-300">
                Tamaño
              </label>
              <select
                value={data.width || "medium"}
                onChange={(e) => updateField("width", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
              >
                <option value="small">Pequeño</option>
                <option value="medium">Mediano</option>
                <option value="large">Grande</option>
                <option value="full">Ancho completo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-bg-300">
                Alineación
              </label>
              <select
                value={data.alignment || "center"}
                onChange={(e) => updateField("alignment", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
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
              className="h-4 w-4 text-accent-100 focus:ring-accent-100 border-gray-300 rounded"
            />
            <label
              htmlFor={`rounded-${data.id}`}
              className="ml-2 block text-sm text-bg-100"
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
            <label className="block text-sm font-medium text-bg-300">
              Título
            </label>
            <input
              type="text"
              value={data.title || ""}
              onChange={(e) => updateField("title", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
              placeholder="Título del call to action"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-bg-300">
              Descripción
            </label>
            <RichTextEditor
              value={data.description || ""}
              onChange={(value) => updateField("description", value)}
              placeholder="Descripción del call to action"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-bg-300">
                Texto del Botón
              </label>
              <input
                type="text"
                value={data.buttonText || ""}
                onChange={(e) => updateField("buttonText", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
                placeholder="Texto del botón"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-bg-300">
                Enlace del Botón
              </label>
              <input
                type="text"
                value={data.buttonLink || ""}
                onChange={(e) => updateField("buttonLink", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
                placeholder="/ruta-del-enlace"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-bg-300">
              Alineación
            </label>
            <select
              value={data.alignment || "center"}
              onChange={(e) => updateField("alignment", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
            >
              <option value="left">Izquierda</option>
              <option value="center">Centro</option>
              <option value="right">Derecha</option>
            </select>
          </div>
        </div>
      );

    case "video":
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-bg-300">
              URL del Video
            </label>
            <input
              type="url"
              value={data.src || ""}
              onChange={(e) => updateField("src", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
              placeholder="https://ejemplo.com/video.mp4"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-bg-300">
              Título (Opcional)
            </label>
            <input
              type="text"
              value={data.title || ""}
              onChange={(e) => updateField("title", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
              placeholder="Título del video"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-bg-300">
              Descripción (Opcional)
            </label>
            <RichTextEditor
              value={data.description || ""}
              onChange={(value) => updateField("description", value)}
              placeholder="Descripción del video"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-bg-300">
                Tamaño
              </label>
              <select
                value={data.width || "medium"}
                onChange={(e) => updateField("width", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
              >
                <option value="small">Pequeño</option>
                <option value="medium">Mediano</option>
                <option value="large">Grande</option>
                <option value="full">Ancho completo</option>
              </select>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  id="autoplay"
                  type="checkbox"
                  checked={data.autoplay || false}
                  onChange={(e) => updateField("autoplay", e.target.checked)}
                  className="h-4 w-4 text-accent-100 focus:ring-accent-100 border-gray-300 rounded"
                />
                <label
                  htmlFor="autoplay"
                  className="ml-2 block text-sm text-bg-100"
                >
                  Reproducción automática
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="controls"
                  type="checkbox"
                  checked={data.controls !== false}
                  onChange={(e) => updateField("controls", e.target.checked)}
                  className="h-4 w-4 text-accent-100 focus:ring-accent-100 border-gray-300 rounded"
                />
                <label
                  htmlFor="controls"
                  className="ml-2 block text-sm text-bg-100"
                >
                  Mostrar controles
                </label>
              </div>
            </div>
          </div>
        </div>
      );

    case "gallery":
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-bg-300">
                Columnas
              </label>
              <select
                value={data.columns || 3}
                onChange={(e) =>
                  updateField("columns", parseInt(e.target.value))
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
              >
                <option value={2}>2 columnas</option>
                <option value={3}>3 columnas</option>
                <option value={4}>4 columnas</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-bg-300">
                Espaciado
              </label>
              <select
                value={data.spacing || "medium"}
                onChange={(e) => updateField("spacing", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
              >
                <option value="small">Pequeño</option>
                <option value="medium">Mediano</option>
                <option value="large">Grande</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-bg-300">
              Imágenes
            </label>
            <div className="mt-2 space-y-2">
              {(data.images || []).map((image: { src: string; alt: string; caption?: string }, index: number) => (
                <div
                  key={index}
                  className="flex space-x-2 items-center p-3 border border-white-100 rounded-md"
                >
                  <div className="flex-1">
                    <ImageSelector
                      value={image.src || ""}
                      onChange={(value) => {
                        const newImages = [...(data.images || [])];
                        newImages[index] = { ...image, src: value };
                        updateField("images", newImages);
                      }}
                      placeholder={`Imagen ${index + 1} desde la galería o URL externa`}
                    />
                  </div>
                  <input
                    type="text"
                    value={image.alt || ""}
                    onChange={(e) => {
                      const newImages = [...(data.images || [])];
                      newImages[index] = { ...image, alt: e.target.value };
                      updateField("images", newImages);
                    }}
                    className="w-32 px-2 py-1 text-sm border border-gray-300 rounded"
                    placeholder="Alt text"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newImages = (data.images || []).filter(
                        (_: { src: string; alt: string; caption?: string }, i: number) => i !== index
                      );
                      updateField("images", newImages);
                    }}
                    className="px-2 py-1 text-sm text-red-600 hover:text-red-800"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const newImages = [
                    ...(data.images || []),
                    { src: "", alt: "", caption: "" },
                  ];
                  updateField("images", newImages);
                }}
                className="w-full px-3 py-2 text-sm border-2 border-dashed border-gray-300 rounded-md text-bg-200 hover:border-gray-400"
              >
                + Agregar imagen
              </button>
            </div>
          </div>
        </div>
      );

    case "contact-form":
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-bg-300">
              Título
            </label>
            <input
              type="text"
              value={data.title || ""}
              onChange={(e) => updateField("title", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
              placeholder="Título del formulario"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-bg-300">
              Descripción
            </label>
            <RichTextEditor
              value={data.description || ""}
              onChange={(value) => updateField("description", value)}
              placeholder="Descripción del formulario"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-bg-300">
              Texto del Botón
            </label>
            <input
              type="text"
              value={data.submitButtonText || ""}
              onChange={(e) => updateField("submitButtonText", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
              placeholder="Enviar"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-bg-300">
              Campos del formulario
            </label>
            <div className="mt-2 space-y-2">
              {(data.fields || []).map((field: { id: string; type: string; label: string; required: boolean }, index: number) => (
                <div
                  key={index}
                  className="p-3 border border-white-100 rounded-md"
                >
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <input
                      type="text"
                      value={field.label || ""}
                      onChange={(e) => {
                        const newFields = [...(data.fields || [])];
                        newFields[index] = { ...field, label: e.target.value };
                        updateField("fields", newFields);
                      }}
                      className="px-2 py-1 text-sm border border-gray-300 rounded"
                      placeholder="Etiqueta"
                    />
                    <select
                      value={field.type || "text"}
                      onChange={(e) => {
                        const newFields = [...(data.fields || [])];
                        newFields[index] = { ...field, type: e.target.value };
                        updateField("fields", newFields);
                      }}
                      className="px-2 py-1 text-sm border border-gray-300 rounded"
                    >
                      <option value="text">Texto</option>
                      <option value="email">Email</option>
                      <option value="tel">Teléfono</option>
                      <option value="textarea">Área de texto</option>
                      <option value="select">Selección</option>
                    </select>
                    <div className="flex items-center space-x-2">
                      <label className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={field.required || false}
                          onChange={(e) => {
                            const newFields = [...(data.fields || [])];
                            newFields[index] = {
                              ...field,
                              required: e.target.checked,
                            };
                            updateField("fields", newFields);
                          }}
                          className="h-3 w-3 text-accent-100"
                        />
                        <span className="ml-1">Requerido</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const newFields = (data.fields || []).filter(
                            (_: { id: string; type: string; label: string; required: boolean }, i: number) => i !== index
                          );
                          updateField("fields", newFields);
                        }}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const newFields = [
                    ...(data.fields || []),
                    {
                      id: `field-${Date.now()}`,
                      type: "text",
                      label: "",
                      required: false,
                    },
                  ];
                  updateField("fields", newFields);
                }}
                className="w-full px-3 py-2 text-sm border-2 border-dashed border-gray-300 rounded-md text-bg-200 hover:border-gray-400"
              >
                + Agregar campo
              </button>
            </div>
          </div>
        </div>
      );

    case "testimonials":
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-bg-300">
              Título
            </label>
            <input
              type="text"
              value={data.title || ""}
              onChange={(e) => updateField("title", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
              placeholder="Título de la sección"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-bg-300">
              Layout
            </label>
            <select
              value={data.layout || "grid"}
              onChange={(e) => updateField("layout", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
            >
              <option value="grid">Grid</option>
              <option value="carousel">Carousel</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-bg-300">
              Testimonios
            </label>
            <p className="text-sm text-gray-500 mb-2">
              Gestión avanzada de testimonios disponible próximamente
            </p>
            <textarea
              rows={6}
              value={JSON.stringify(data.testimonials || [], null, 2)}
              onChange={(e) => {
                try {
                  const testimonials = JSON.parse(e.target.value);
                  updateField("testimonials", testimonials);
                } catch {
                  // json invalido porsiacaso
                }
              }}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
              placeholder="Array de testimonios en formato JSON"
            />
          </div>
        </div>
      );

    case "features":
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-bg-300">
              Título
            </label>
            <input
              type="text"
              value={data.title || ""}
              onChange={(e) => updateField("title", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
              placeholder="Título de la sección"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-bg-300">
              Descripción
            </label>
            <textarea
              rows={3}
              value={data.description || ""}
              onChange={(e) => updateField("description", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
              placeholder="Descripción de la sección"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-bg-300">
                Layout
              </label>
              <select
                value={data.layout || "grid"}
                onChange={(e) => updateField("layout", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
              >
                <option value="grid">Grid</option>
                <option value="list">Lista</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-bg-300">
                Columnas
              </label>
              <select
                value={data.columns || 3}
                onChange={(e) =>
                  updateField("columns", parseInt(e.target.value))
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
              >
                <option value={2}>2 columnas</option>
                <option value={3}>3 columnas</option>
                <option value={4}>4 columnas</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-bg-300">
              Características
            </label>
            <p className="text-sm text-gray-500 mb-2">
              Gestión avanzada de características disponible próximamente
            </p>
            <textarea
              rows={6}
              value={JSON.stringify(data.features || [], null, 2)}
              onChange={(e) => {
                try {
                  const features = JSON.parse(e.target.value);
                  updateField("features", features);
                } catch {
                  // json invalido porsiacaso
                }
              }}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
              placeholder="Array de características en formato JSON"
            />
          </div>
        </div>
      );

    case "spacer":
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-bg-300">
              Altura del Espaciador
            </label>
            <select
              value={data.height || "medium"}
              onChange={(e) => updateField("height", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
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
                  // json invalido porsiacaso
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
