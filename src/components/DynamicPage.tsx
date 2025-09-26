/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { PageService } from "../features/admin/page-management/services/pageService";
import ExistingHeroSection from "./hero/HeroSection";
import ExistingContentSection from "./content/ContentSection";
import MarkdownContent from "./content/MarkdownContent";
import type {
  ContentSection,
  CustomPage,
} from "../features/admin/page-management/types/pageTypes";

const DynamicPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<CustomPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      if (!slug) {
        console.log("No slug provided");
        setError("No se proporcionó un slug");
        setLoading(false);
        return;
      }

      console.log("Fetching page for slug:", slug);

      try {
        setLoading(true);
        const foundPage = await PageService.getCustomPageBySlug(slug);

        console.log("Page found:", foundPage);

        if (foundPage) {
          console.log("Page found, published status:", foundPage.isPublished);
          setPage(foundPage);
        } else {
          console.log("Page not found");
          setPage(null);
        }
      } catch (err) {
        console.error("Error fetching page:", err);
        setError("Error al cargar la página");
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-100 mx-auto mb-4"></div>
          <p className="text-bg-200">Cargando página...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-bg-400 mb-4">Error</h1>
          <p className="text-bg-200">{error}</p>
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-bg-400 mb-4">
            Página no encontrada
          </h1>
          <p className="text-bg-200">
            La página que buscas no existe o no está publicada.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* SEO Meta Tags (estas se pueden manejar con un hook o biblioteca como React Helmet) */}
      <title>{page.metaTitle || page.title}</title>

      <GridLayoutRenderer
        sections={page.content.sort((a, b) => a.order - b.order)}
      />
    </div>
  );
};

// Grid Layout Renderer Component
interface GridLayoutRendererProps {
  sections: ContentSection[];
}

const GridLayoutRenderer: React.FC<GridLayoutRendererProps> = ({
  sections,
}) => {
  // Agrupar secciones en filas según su ancho de grid
  const groupSectionsIntoRows = (sections: ContentSection[]) => {
    const rows: ContentSection[][] = [];
    let currentRow: ContentSection[] = [];
    let currentRowWidth = 0;

    sections.forEach((section) => {
      // Obtener el ancho de grid de la sección (por defecto 12 = ancho completo)
      const sectionWidth = (section as any).gridWidth || 12;

      // Si la sección no cabe en la fila actual, crear nueva fila
      if (currentRowWidth + sectionWidth > 12) {
        if (currentRow.length > 0) {
          rows.push(currentRow);
        }
        currentRow = [section];
        currentRowWidth = sectionWidth;
      } else {
        // La sección cabe en la fila actual
        currentRow.push(section);
        currentRowWidth += sectionWidth;
      }
    });

    // Agregar la última fila si tiene contenido
    if (currentRow.length > 0) {
      rows.push(currentRow);
    }

    return rows;
  };

  const rows = groupSectionsIntoRows(sections);

  return (
    <>
      {rows.map((row, rowIndex) => (
        <div key={`row-${rowIndex}`} className="grid grid-cols-12 w-full">
          {row.map((section) => {
            const gridWidth = (section as any).gridWidth || 12;

            // Mapear los anchos a clases CSS específicas para asegurar que Tailwind las incluya
            const colSpanClasses: Record<number, string> = {
              1: "col-span-1",
              2: "col-span-2",
              3: "col-span-3",
              4: "col-span-4",
              5: "col-span-5",
              6: "col-span-6",
              7: "col-span-7",
              8: "col-span-8",
              9: "col-span-9",
              10: "col-span-10",
              11: "col-span-11",
              12: "col-span-12",
            };

            const colSpanClass = colSpanClasses[gridWidth] || "col-span-12";

            return (
              <div key={section.id} className={colSpanClass}>
                <ContentSectionRenderer section={section} />
              </div>
            );
          })}
        </div>
      ))}
    </>
  );
};

interface ContentSectionRendererProps {
  section: ContentSection;
}

const ContentSectionRenderer: React.FC<ContentSectionRendererProps> = ({
  section,
}) => {
  switch (section.type) {
    case "hero":
      return <HeroSection data={section.data} />;
    case "hero-multi":
      return <HeroMultiSection data={section.data} />;
    case "logo-section":
      return <LogoSection data={section.data} />;
    case "content-section":
      return <ContentSectionComponent data={section.data} />;
    case "curved-section":
      return <CurvedSection data={section.data} />;
    case "text":
      return <TextSection data={section.data} />;
    case "image":
      return <ImageSection data={section.data} />;
    case "gallery":
      return <GallerySection data={section.data} />;
    case "video":
      return <VideoSection data={section.data} />;
    case "contact-form":
      return <ContactFormSection data={section.data} />;
    case "testimonials":
      return <TestimonialsSection data={section.data} />;
    case "features":
      return <FeaturesSection data={section.data} />;
    case "cta":
      return <CTASection data={section.data} />;
    case "spacer":
      return <SpacerSection data={section.data} />;
    default:
      return <div>Tipo de sección no soportado: {section.type}</div>;
  }
};

// Hero Section Component
const HeroSection: React.FC<{ data: any }> = ({ data }) => {
  const title = data.title as string;
  const subtitle = data.subtitle as string;
  const backgroundImage = data.backgroundImage as string;
  const backgroundColor = data.backgroundColor as string;
  const textColor = data.textColor as string;
  const buttonText = data.buttonText as string;
  const buttonLink = data.buttonLink as string;
  const alignment = data.alignment as string;

  // Debug logs
  console.log("Hero Section Data:", data);
  console.log("Background Image URL:", backgroundImage);
  console.log("Background Color:", backgroundColor);

  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  // Detectar si la imagen es local o externa
  const isExternal = backgroundImage?.startsWith('http://') || backgroundImage?.startsWith('https://');
  const processedBackgroundImage = backgroundImage && backgroundImage.trim() !== ""
    ? (isExternal ? backgroundImage : `/${backgroundImage.replace(/^\/+/, '')}`)
    : "";

  const backgroundImageStyle =
    processedBackgroundImage
      ? `url("${processedBackgroundImage}")`
      : undefined;

  return (
    <section
      className={`relative py-24 px-6 sm:py-32 lg:px-8 min-h-[650px] ${
        backgroundColor || backgroundImage ? "" : "bg-white"
      }`}
      style={{
        backgroundImage: backgroundImageStyle,
        backgroundColor:
          backgroundColor && backgroundColor.trim() !== ""
            ? backgroundColor
            : undefined,
        backgroundSize: backgroundImage ? "cover" : undefined,
        backgroundPosition: backgroundImage ? "center" : undefined,
        backgroundRepeat: backgroundImage ? "no-repeat" : undefined,
      }}
    >
      {backgroundImage && (
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent " />
      )}
      <div
        className={`relative mx-auto max-w-7xl ${
          alignmentClasses[alignment as keyof typeof alignmentClasses] ||
          "text-center"
        }`}
      >
        {title && (
          <h1
            className="font-bold tracking-tight text-3xl max-w-2xl"
            style={{
              color:
                textColor ||
                (backgroundImage || backgroundColor ? "white" : "inherit"),
            }}
          >
            {title}
          </h1>
        )}
        {subtitle && (
          <div
            className="text-lg leading-8 max-w-2xl mt-5"
            style={{
              color:
                textColor ||
                (backgroundImage || backgroundColor ? "#d1d5db" : "inherit"),
            }}
          >
            <MarkdownContent 
              content={subtitle} 
              className="prose prose-lg max-w-none text-inherit"
            />
          </div>
        )}
        {buttonText && buttonLink && (
          <div className="mt-10">
            <a
              href={buttonLink}
              className="text-sm font-semibold text-white shadow-sm hover:bg-primary-100"
            >
              {buttonText}
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

// Text Section Component
const TextSection: React.FC<{ data: any }> = ({ data }) => {
  const title = data.title as string;
  const content = data.content as string;
  const alignment = data.alignment as string;
  const fontSize = data.fontSize as string;
  const backgroundColor = data.backgroundColor as string;
  const padding = data.padding as string;

  if (!content) return null;

  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const fontSizeClasses = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };

  const paddingClasses = {
    small: "py-8",
    medium: "py-16",
    large: "py-24",
  };

  return (
    <section
      className={`px-6 lg:px-8 ${
        paddingClasses[padding as keyof typeof paddingClasses] || "py-16"
      }`}
      style={{ backgroundColor: backgroundColor || undefined }}
    >
      <div className="mx-auto max-w-3xl">
        {title && (
          <h2
            className={`text-3xl font-bold mb-8 ${
              alignmentClasses[alignment as keyof typeof alignmentClasses] ||
              "text-left"
            }`}
          >
            {title}
          </h2>
        )}
        <div
          className={`prose prose-lg mx-auto text-bg-300 ${
            fontSizeClasses[fontSize as keyof typeof fontSizeClasses] ||
            "text-base"
          } ${
            alignmentClasses[alignment as keyof typeof alignmentClasses] ||
            "text-left"
          }`}
        >
          <MarkdownContent content={content} />
        </div>
      </div>
    </section>
  );
};

// Image Section Component
const ImageSection: React.FC<{ data: any }> = ({ data }) => {
  const src = data.src as string;
  const alt = data.alt as string;
  const caption = data.caption as string;
  const width = data.width as string;
  const alignment = data.alignment as string;
  const rounded = data.rounded as boolean;

  if (!src) return null;

  // Detectar si la imagen es local o externa
  const isExternal = src.startsWith('http://') || src.startsWith('https://');
  const imageSrc = isExternal ? src : `/${src.replace(/^\/+/, '')}`;

  const widthClasses = {
    small: "max-w-md",
    medium: "max-w-2xl",
    large: "max-w-4xl",
    full: "max-w-full",
  };

  const alignmentClasses = {
    left: "mr-auto",
    center: "mx-auto",
    right: "ml-auto",
  };

  return (
    <section className="py-16 px-6 lg:px-8">
      <div
        className={`${
          widthClasses[width as keyof typeof widthClasses] || "max-w-4xl"
        } ${
          alignmentClasses[alignment as keyof typeof alignmentClasses] ||
          "mx-auto"
        }`}
      >
        <figure>
          <img
            src={imageSrc}
            alt={alt || ""}
            className={`w-full rounded-2xl min-h-90 object-cover shadow-lg ${
              rounded ? "rounded-lg" : ""
            }`}
          />
          {caption && (
            <figcaption className="mt-4 text-center text-bg-200 text-sm">
              {caption}
            </figcaption>
          )}
        </figure>
      </div>
    </section>
  );
};

// Gallery Section Component
const GallerySection: React.FC<{ data: any }> = ({ data }) => {
  const images =
    (data.images as Array<{ src: string; alt: string; caption?: string }>) ||
    [];
  const columns = data.columns as number;
  const spacing = data.spacing as string;

  if (images.length === 0) {
    return (
      <section className="py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-gray-500">
            Galería de imágenes (sin imágenes configuradas)
          </p>
        </div>
      </section>
    );
  }

  const columnsClasses = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-2 lg:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-4",
  };

  const spacingClasses = {
    small: "gap-4",
    medium: "gap-6",
    large: "gap-8",
  };

  return (
    <section className="py-16 px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div
          className={`grid grid-cols-1 ${
            columnsClasses[columns as keyof typeof columnsClasses] ||
            "md:grid-cols-2 lg:grid-cols-3"
          } ${
            spacingClasses[spacing as keyof typeof spacingClasses] || "gap-6"
          }`}
        >
          {images.map((image, index) => {
            // Detectar si la imagen es local o externa
            const isExternal = image.src.startsWith('http://') || image.src.startsWith('https://');
            const imageSrc = isExternal ? image.src : `/${image.src.replace(/^\/+/, '')}`;
            
            return (
              <figure key={index}>
                <img
                  src={imageSrc}
                  alt={image.alt}
                  className="w-full h-64 object-cover rounded-lg shadow"
                  loading="lazy"
                />
                {image.caption && (
                  <figcaption className="mt-2 text-center text-bg-200 text-sm">
                    {image.caption}
                  </figcaption>
                )}
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Video Section Component
const VideoSection: React.FC<{ data: any }> = ({ data }) => {
  const src = data.src as string;
  const title = data.title as string;
  const description = data.description as string;
  const autoplay = data.autoplay as boolean;
  const controls = data.controls as boolean;
  const width = data.width as string;

  if (!src) return null;

  const widthClasses = {
    small: "max-w-md",
    medium: "max-w-2xl",
    large: "max-w-4xl",
    full: "max-w-full",
  };

  return (
    <section className="py-16 px-6 lg:px-8">
      <div
        className={`mx-auto ${
          widthClasses[width as keyof typeof widthClasses] || "max-w-4xl"
        }`}
      >
        {title && (
          <h2 className="text-3xl font-bold text-center mb-4">{title}</h2>
        )}
        {description && (
          <div className="text-center text-bg-200 mb-8">
            <MarkdownContent 
              content={description} 
              className="prose prose-lg max-w-none text-inherit mx-auto"
            />
          </div>
        )}
        <div className="relative rounded-lg overflow-hidden shadow-lg">
          <video
            src={src}
            autoPlay={autoplay}
            controls={controls}
            className="w-full"
          >
            Tu navegador no soporta el elemento de video.
          </video>
        </div>
      </div>
    </section>
  );
};

// Contact Form Section Component
const ContactFormSection: React.FC<{ data: any }> = ({ data }) => {
  const title = data.title as string;
  const description = data.description as string;
  const fields =
    (data.fields as Array<{
      id: string;
      type: string;
      label: string;
      placeholder?: string;
      required: boolean;
      options?: string[];
    }>) || [];
  const submitButtonText = data.submitButtonText as string;

  return (
    <section className="py-16 px-6 lg:px-8 bg-gray-50">
      <div className="mx-auto max-w-2xl">
        {title && (
          <h2 className="text-3xl font-bold text-center mb-4">{title}</h2>
        )}
        {description && (
          <div className="text-center text-bg-200 mb-8">
            <MarkdownContent 
              content={description} 
              className="prose prose-lg max-w-none text-inherit mx-auto"
            />
          </div>
        )}
        <div className="bg-white rounded-lg shadow p-8">
          <form className="space-y-4">
            {fields.map((field) => (
              <div key={field.id}>
                <label className="block text-sm font-medium text-bg-300 mb-1">
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    placeholder={field.placeholder}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-100"
                  />
                ) : field.type === "select" ? (
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-100">
                    <option value="">Selecciona una opción</option>
                    {field.options?.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-100"
                  />
                )}
              </div>
            ))}
            <button
              type="submit"
              className="w-full bg-accent-100 text-white py-2 px-4 rounded-md hover:bg-accent-200 transition-colors"
            >
              {submitButtonText || "Enviar"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

// Testimonials Section Component
const TestimonialsSection: React.FC<{ data: any }> = ({ data }) => {
  const title = data.title as string;
  const testimonials =
    (data.testimonials as Array<{
      id: string;
      name: string;
      role?: string;
      company?: string;
      avatar?: string;
      content: string;
      rating?: number;
    }>) || [];
  const layout = data.layout as string;

  if (testimonials.length === 0) {
    return (
      <section className="py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-gray-500">
            Sección de testimonios (sin testimonios configurados)
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 lg:px-8 bg-gray-50">
      <div className="mx-auto max-w-6xl">
        {title && (
          <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
        )}
        <div
          className={`${
            layout === "carousel"
              ? "flex overflow-x-auto gap-6"
              : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          }`}
        >
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-lg shadow-md p-6 flex-shrink-0 w-80"
            >
              <div className="flex items-center mb-4">
                {testimonial.avatar && (
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                )}
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  {testimonial.role && (
                    <p className="text-bg-200 text-sm">
                      {testimonial.role}
                      {testimonial.company && ` at ${testimonial.company}`}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-bg-300 mb-4">
                <MarkdownContent content={testimonial.content} />
              </div>
              {testimonial.rating && (
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-xl ${
                        i < testimonial.rating!
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Features Section Component
const FeaturesSection: React.FC<{ data: any }> = ({ data }) => {
  const title = data.title as string;
  const description = data.description as string;
  const features =
    (data.features as Array<{
      id: string;
      title: string;
      description: string;
      icon?: string;
      image?: string;
    }>) || [];
  const layout = data.layout as string;
  const columns = data.columns as number;

  if (features.length === 0) {
    return (
      <section className="py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-gray-500">
            Sección de características (sin características configuradas)
          </p>
        </div>
      </section>
    );
  }

  const columnsClasses = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-2 lg:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <section className="py-16 px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {title && (
          <h2 className="text-3xl font-bold text-center mb-4">{title}</h2>
        )}
        {description && (
          <div className="text-center text-bg-200 mb-12">
            <MarkdownContent content={description} />
          </div>
        )}
        <div
          className={`${
            layout === "list"
              ? "space-y-8"
              : `grid grid-cols-1 ${
                  columnsClasses[columns as keyof typeof columnsClasses] ||
                  "md:grid-cols-2 lg:grid-cols-3"
                } gap-8`
          }`}
        >
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`${
                layout === "list" ? "flex items-start space-x-4" : "text-center"
              }`}
            >
              {feature.icon && (
                <div
                  className={`text-3xl mb-4 ${layout === "list" ? "mt-1" : ""}`}
                >
                  {feature.icon}
                </div>
              )}
              {feature.image && (
                <img
                  src={feature.image}
                  alt={feature.title}
                  className={`w-16 h-16 object-cover rounded-lg mb-4 ${
                    layout === "list" ? "mt-1" : "mx-auto"
                  }`}
                />
              )}
              <div className={layout === "list" ? "flex-1" : ""}>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <div className="text-bg-200">
                  <MarkdownContent content={feature.description} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// CTA Section Component
const CTASection: React.FC<{ data: any }> = ({ data }) => {
  const title = data.title as string;
  const description = data.description as string;
  const buttonText = data.buttonText as string;
  const buttonLink = data.buttonLink as string;
  const backgroundColor = data.backgroundColor as string;
  const textColor = data.textColor as string;
  const alignment = data.alignment as string;

  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <section
      className="py-16 px-6 lg:px-8"
      style={{ backgroundColor: backgroundColor || "#1f2937" }}
    >
      <div
        className={`mx-auto max-w-4xl ${
          alignmentClasses[alignment as keyof typeof alignmentClasses] ||
          "text-center"
        }`}
      >
        <h2
          className="text-3xl font-bold mb-4"
          style={{ color: textColor || "white" }}
        >
          {title}
        </h2>
        {description && (
          <div className="text-lg mb-8" style={{ color: textColor || "#d1d5db" }}>
            <MarkdownContent content={description} />
          </div>
        )}
        {buttonText && buttonLink && (
          <a
            href={buttonLink}
            className="inline-block bg-accent-100 text-white px-8 py-3 rounded-md font-semibold hover:bg-accent-200 transition-colors"
          >
            {buttonText}
          </a>
        )}
      </div>
    </section>
  );
};

// Spacer Section Component
const SpacerSection: React.FC<{ data: any }> = ({ data }) => {
  const height = data.height as string;

  const heightClasses = {
    small: "h-8",
    medium: "h-16",
    large: "h-24",
    xl: "h-32",
  };

  return (
    <div
      className={heightClasses[height as keyof typeof heightClasses] || "h-16"}
    />
  );
};

// New Section Components

// Hero Multi Section Component (uses existing HeroSection component)
const HeroMultiSection: React.FC<{ data: any }> = ({ data }) => {
  return (
    <ExistingHeroSection
      title={data.title || ""}
      description={data.description || ""}
      buttonText={data.buttonText}
      buttonLink={data.buttonLink}
      images={data.images || []}
      altText={data.altText || "Hero Image"}
      onButtonClick={() => {
        if (data.buttonLink && data.buttonLink !== "#") {
          window.open(data.buttonLink, "_blank");
        }
      }}
    />
  );
};

// Logo Section Component
const LogoSection: React.FC<{ data: any }> = ({ data }) => {
  const height = data.height || "medium";
  const heightClasses = {
    small: "h-20",
    medium: "h-28", 
    large: "h-36",
  };

  return (
    <section 
      className={`w-full py-2 ${heightClasses[height as keyof typeof heightClasses]} flex justify-center items-center`}
      style={{ backgroundColor: data.backgroundColor || "#primary-100" }}
    >
      <div className="flex justify-center items-center">
        <img 
          src={data.logoSrc || "AST-Logo-white.png"} 
          alt={data.logoAlt || "Logo"} 
          className="h-20" 
        />
        <div 
          className="h-10 w-0.5 mx-10"
          style={{ backgroundColor: data.textColor || "white" }}
        ></div>
        <h4 
          className="font-black text-3xl"
          style={{ color: data.textColor || "white" }}
        >
          {data.title || "TÍTULO"}
        </h4>
      </div>
    </section>
  );
};

// Content Section Component (uses existing ContentSection component)
const ContentSectionComponent: React.FC<{ data: any }> = ({ data }) => {
  // Procesar la descripción con MarkdownContent si contiene Markdown/HTML
  const processedDescription = data.description ? (
    <MarkdownContent 
      content={data.description} 
      className="prose prose-lg max-w-none text-inherit"
    />
  ) : "";

  return (
    <section className="max-w-7xl mx-auto w-full py-10">
      <div className="flex flex-col gap-10 justify-center items-center w-full">
        <ExistingContentSection
          title={data.title || ""}
          description={processedDescription}
          images={data.images || []}
          altText={data.altText || "Content Image"}
          layout={data.layout || "text-left"}
          className={data.className || "mt-10 h-full"}
          autoSlide={data.autoSlide !== false}
        />
      </div>
    </section>
  );
};

// Curved Section Component
const CurvedSection: React.FC<{ data: any }> = ({ data }) => {
  return (
    <section className="relative h-100 mt-50">
      <div
        className="absolute left-0 -top-0 w-full h-100"
        style={{
          backgroundColor: data.backgroundColor || "#bg-400",
          clipPath: data.clipPath || "ellipse(100% 100% at 50% 100%)",
        }}
      ></div>
      <div className="relative -top-30 z-10 w-full max-w-6xl mx-auto h-full flex flex-col justify-center items-center text-center text-white px-5">
        <div className="flex justify-center items-center gap-10 w-full py-10 text-black">
          <article className="relative shadow-lg bg-white rounded-2xl w-full mb-4 flex flex-col justify-center items-center gap-5 py-20">
            {data.iconSrc && (
              <img
                src={data.iconSrc}
                alt={data.iconAlt || "Ícono"}
                className="absolute -top-18 w-30 h-30"
              />
            )}
            {data.title && (
              <h3 
                className="text-2xl font-bold mb-4"
                style={{ color: data.textColor || "black" }}
              >
                {data.title}
              </h3>
            )}
            <div 
              className="max-w-4xl text-lg leading-6"
              style={{ color: data.textColor || "black" }}
            >
              <MarkdownContent 
                content={data.content || ""} 
                className="prose prose-lg max-w-none text-inherit"
              />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default DynamicPage;
