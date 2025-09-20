import React from 'react';
import { useParams } from 'react-router-dom';
import { useContent } from '../hooks/useContent';
import type { ContentBlock } from '../types/content';

const DynamicPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { pages } = useContent();

  const page = pages.find(p => p.slug === slug && p.isPublished);

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Página no encontrada</h1>
          <p className="text-gray-600">La página que buscas no existe o no está publicada.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* SEO Meta Tags (estas se pueden manejar con un hook o biblioteca como React Helmet) */}
      <title>{page.metaTitle || page.title}</title>
      
      {page.content
        .sort((a, b) => a.order - b.order)
        .map((block) => (
          <ContentBlockRenderer key={block.id} block={block} />
        ))}
    </div>
  );
};

interface ContentBlockRendererProps {
  block: ContentBlock;
}

const ContentBlockRenderer: React.FC<ContentBlockRendererProps> = ({ block }) => {
  switch (block.type) {
    case 'hero':
      return <HeroBlock data={block.data} />;
    case 'text':
      return <TextBlock data={block.data} />;
    case 'image':
      return <ImageBlock data={block.data} />;
    case 'gallery':
      return <GalleryBlock data={block.data} />;
    case 'cards':
      return <CardsBlock data={block.data} />;
    case 'contact':
      return <ContactBlock data={block.data} />;
    default:
      return <div>Tipo de bloque no soportado: {block.type}</div>;
  }
};

// Hero Block Component
const HeroBlock: React.FC<{ data: Record<string, unknown> }> = ({ data }) => {
  const title = data.title as string;
  const subtitle = data.subtitle as string;
  const backgroundImage = data.backgroundImage as string;

  return (
    <section 
      className="relative bg-gray-900 py-24 px-6 sm:py-32 lg:px-8"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {backgroundImage && (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-50" />
      )}
      <div className="relative mx-auto max-w-2xl text-center">
        {title && (
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="mt-6 text-lg leading-8 text-gray-300">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
};

// Text Block Component
const TextBlock: React.FC<{ data: Record<string, unknown> }> = ({ data }) => {
  const content = data.content as string;

  if (!content) return null;

  return (
    <section className="py-16 px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="prose prose-lg mx-auto text-gray-700">
          {content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};

// Image Block Component
const ImageBlock: React.FC<{ data: Record<string, unknown> }> = ({ data }) => {
  const src = data.src as string;
  const alt = data.alt as string;
  const caption = data.caption as string;

  if (!src) return null;

  return (
    <section className="py-16 px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <figure>
          <img
            src={src}
            alt={alt || ''}
            className="w-full rounded-lg shadow-lg"
          />
          {caption && (
            <figcaption className="mt-4 text-center text-gray-600 text-sm">
              {caption}
            </figcaption>
          )}
        </figure>
      </div>
    </section>
  );
};

// Gallery Block Component (placeholder)
const GalleryBlock: React.FC<{ data: Record<string, unknown> }> = ({ data }) => {
  const images = (data.images as Array<{ src: string; alt: string }>) || [];

  if (images.length === 0) {
    return (
      <section className="py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-gray-500">Galería de imágenes (sin imágenes configuradas)</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <img
              key={index}
              src={image.src}
              alt={image.alt}
              className="w-full h-64 object-cover rounded-lg shadow"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Cards Block Component (placeholder)
const CardsBlock: React.FC<{ data: Record<string, unknown> }> = ({ data }) => {
  const title = data.title as string;
  const cards = (data.cards as Array<{ title: string; description: string; icon?: string }>) || [];

  return (
    <section className="py-16 px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {title && (
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {title}
          </h2>
        )}
        {cards.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-500">Sección de tarjetas (sin tarjetas configuradas)</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cards.map((card, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                {card.icon && (
                  <div className="text-3xl mb-4">{card.icon}</div>
                )}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {card.title}
                </h3>
                <p className="text-gray-600">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

// Contact Block Component (placeholder)
const ContactBlock: React.FC<{ data: Record<string, unknown> }> = ({ data }) => {
  const title = data.title as string;
  const subtitle = data.subtitle as string;

  return (
    <section className="py-16 px-6 lg:px-8 bg-gray-50">
      <div className="mx-auto max-w-2xl text-center">
        {title && (
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="text-lg text-gray-600 mb-8">
            {subtitle}
          </p>
        )}
        <div className="bg-white rounded-lg shadow p-8">
          <p className="text-gray-600">
            Formulario de contacto (en desarrollo)
          </p>
          <div className="mt-6 space-y-4">
            <div className="text-left">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Tu nombre"
              />
            </div>
            <div className="text-left">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input 
                type="email" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="tu@email.com"
              />
            </div>
            <div className="text-left">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mensaje
              </label>
              <textarea 
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Tu mensaje..."
              />
            </div>
            <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">
              Enviar Mensaje
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DynamicPage;