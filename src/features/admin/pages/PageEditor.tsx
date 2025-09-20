import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useContent } from '../../../hooks/useContent';
import { useAuth } from '../../../hooks/useAuth';
import type { ContentBlock } from '../../../types/content';
import { FiSave, FiEye, FiArrowLeft, FiTrash2, FiMove } from 'react-icons/fi';

const PageEditor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const template = searchParams.get('template');
  const { user } = useAuth();
  const { pages, createPage, updatePage } = useContent();
  
  const isEditing = !!id;
  const existingPage = isEditing ? pages.find(page => page.id === id) : null;

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    metaTitle: '',
    metaDescription: '',
    isPublished: false,
    content: [] as ContentBlock[]
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (existingPage) {
      setFormData({
        title: existingPage.title,
        slug: existingPage.slug,
        metaTitle: existingPage.metaTitle || '',
        metaDescription: existingPage.metaDescription || '',
        isPublished: existingPage.isPublished,
        content: existingPage.content
      });
    } else if (template) {
      // Cargar plantilla predefinida
      const templateContent = getTemplateContent(template);
      setFormData(prev => ({
        ...prev,
        content: templateContent
      }));
    }
  }, [existingPage, template]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: !isEditing ? generateSlug(title) : prev.slug
    }));
  };

  const addContentBlock = (type: ContentBlock['type']) => {
    const newBlock: ContentBlock = {
      id: `block-${Date.now()}`,
      type,
      data: getDefaultBlockData(type),
      order: formData.content.length + 1
    };

    setFormData(prev => ({
      ...prev,
      content: [...prev.content, newBlock]
    }));
  };

  const updateContentBlock = (blockId: string, data: Record<string, unknown>) => {
    setFormData(prev => ({
      ...prev,
      content: prev.content.map(block =>
        block.id === blockId ? { ...block, data } : block
      )
    }));
  };

  const deleteContentBlock = (blockId: string) => {
    setFormData(prev => ({
      ...prev,
      content: prev.content.filter(block => block.id !== blockId)
    }));
  };

  const handleSave = async (publish = false) => {
    if (!formData.title.trim()) {
      alert('El título es obligatorio');
      return;
    }

    setIsSaving(true);

    const pageData = {
      ...formData,
      isPublished: publish,
      author: user?.name || 'Admin'
    };

    try {
      if (isEditing && existingPage) {
        updatePage({
          ...existingPage,
          ...pageData
        });
      } else {
        createPage(pageData);
      }

      navigate('/admin/pages');
    } catch (error) {
      console.error('Error saving page:', error);
      alert('Error al guardar la página');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/pages')}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <FiArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Editar Página' : 'Nueva Página'}
            </h2>
            <p className="text-gray-600">
              {isEditing ? 'Modifica tu página existente' : 'Crea una nueva página personalizada'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            <FiSave className="mr-2 h-4 w-4" />
            Guardar Borrador
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            <FiEye className="mr-2 h-4 w-4" />
            {formData.isPublished ? 'Actualizar' : 'Publicar'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Page Info */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título de la Página
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Escribe el título de tu página..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug (URL)
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                  /
                </span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="url-de-la-pagina"
                />
              </div>
            </div>
          </div>

          {/* Content Blocks */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Contenido</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {formData.content.length} bloques
                </span>
              </div>
            </div>

            {formData.content.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Comienza a construir tu página
                </h3>
                <p className="text-gray-600 mb-6">
                  Agrega bloques de contenido para crear tu página personalizada
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.content
                  .sort((a, b) => a.order - b.order)
                  .map((block, index) => (
                    <ContentBlockEditor
                      key={block.id}
                      block={block}
                      index={index}
                      onUpdate={(data) => updateContentBlock(block.id, data)}
                      onDelete={() => deleteContentBlock(block.id)}
                    />
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Add Content Block */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Agregar Contenido</h3>
            <div className="space-y-2">
              {[
                { type: 'hero', label: 'Sección Hero', icon: '🎯' },
                { type: 'text', label: 'Texto', icon: '📝' },
                { type: 'image', label: 'Imagen', icon: '🖼️' },
                { type: 'gallery', label: 'Galería', icon: '🎨' },
                { type: 'cards', label: 'Tarjetas', icon: '📋' },
                { type: 'contact', label: 'Contacto', icon: '📞' }
              ].map((blockType) => (
                <button
                  key={blockType.type}
                  onClick={() => addContentBlock(blockType.type as ContentBlock['type'])}
                  className="w-full flex items-center px-3 py-2 text-sm text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100"
                >
                  <span className="mr-2">{blockType.icon}</span>
                  {blockType.label}
                </button>
              ))}
            </div>
          </div>

          {/* SEO Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">SEO</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Título
                </label>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  placeholder={formData.title}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Descripción
                </label>
                <textarea
                  value={formData.metaDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  placeholder="Descripción de la página para motores de búsqueda..."
                />
              </div>
            </div>
          </div>

          {/* Page Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Estado</h3>
            <div className={`p-3 rounded-md ${
              formData.isPublished ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
            }`}>
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  formData.isPublished ? 'bg-green-400' : 'bg-yellow-400'
                }`} />
                <span className="text-sm font-medium">
                  {formData.isPublished ? 'Publicado' : 'Borrador'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Content Block Editor Component
interface ContentBlockEditorProps {
  block: ContentBlock;
  index: number;
  onUpdate: (data: Record<string, unknown>) => void;
  onDelete: () => void;
}

const ContentBlockEditor: React.FC<ContentBlockEditorProps> = ({
  block,
  index,
  onUpdate,
  onDelete
}) => {
  const blockTypes = {
    hero: '🎯',
    text: '📝',
    image: '🖼️',
    gallery: '🎨',
    cards: '📋',
    contact: '📞',
    custom: '⚙️'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FiMove className="h-4 w-4 text-gray-400 cursor-move" />
          <span className="text-lg">{blockTypes[block.type]}</span>
          <h4 className="font-medium text-gray-900 capitalize">
            Bloque {block.type}
          </h4>
          <span className="text-sm text-gray-500">#{index + 1}</span>
        </div>
        <button
          onClick={onDelete}
          className="p-1 text-gray-400 hover:text-red-600"
        >
          <FiTrash2 className="h-4 w-4" />
        </button>
      </div>

      <BlockContentEditor
        type={block.type}
        data={block.data}
        onUpdate={onUpdate}
      />
    </div>
  );
};

// Block Content Editor based on type
interface BlockContentEditorProps {
  type: ContentBlock['type'];
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
}

const BlockContentEditor: React.FC<BlockContentEditorProps> = ({
  type,
  data,
  onUpdate
}) => {
  switch (type) {
    case 'hero':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título Principal
            </label>
            <input
              type="text"
              value={(data.title as string) || ''}
              onChange={(e) => onUpdate({ ...data, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Título del hero..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subtítulo
            </label>
            <textarea
              value={(data.subtitle as string) || ''}
              onChange={(e) => onUpdate({ ...data, subtitle: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Subtítulo o descripción..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Imagen de Fondo
            </label>
            <input
              type="url"
              value={(data.backgroundImage as string) || ''}
              onChange={(e) => onUpdate({ ...data, backgroundImage: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>
        </div>
      );

    case 'text':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contenido
            </label>
            <textarea
              value={(data.content as string) || ''}
              onChange={(e) => onUpdate({ ...data, content: e.target.value })}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Escribe tu contenido aquí..."
            />
          </div>
        </div>
      );

    case 'image':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL de la Imagen
            </label>
            <input
              type="url"
              value={(data.src as string) || ''}
              onChange={(e) => onUpdate({ ...data, src: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Texto Alternativo
            </label>
            <input
              type="text"
              value={(data.alt as string) || ''}
              onChange={(e) => onUpdate({ ...data, alt: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Descripción de la imagen"
            />
          </div>
        </div>
      );

    default:
      return (
        <div className="text-center py-4 text-gray-500">
          Editor para tipo "{type}" en desarrollo
        </div>
      );
  }
};

// Template content generators
const getTemplateContent = (template: string): ContentBlock[] => {
  switch (template) {
    case 'landing':
      return [
        {
          id: 'hero-1',
          type: 'hero',
          data: {
            title: 'Bienvenido a Nuestra Empresa',
            subtitle: 'Ofrecemos soluciones innovadoras para tu negocio',
            backgroundImage: ''
          },
          order: 1
        },
        {
          id: 'text-1',
          type: 'text',
          data: {
            content: 'Somos una empresa líder en nuestro sector...'
          },
          order: 2
        }
      ];

    case 'about':
      return [
        {
          id: 'text-1',
          type: 'text',
          data: {
            content: 'Nuestra historia comenzó hace más de 10 años...'
          },
          order: 1
        }
      ];

    case 'contact':
      return [
        {
          id: 'contact-1',
          type: 'contact',
          data: {
            title: 'Contáctanos',
            subtitle: 'Estamos aquí para ayudarte'
          },
          order: 1
        }
      ];

    default:
      return [];
  }
};

// Default block data generator
const getDefaultBlockData = (type: ContentBlock['type']): Record<string, unknown> => {
  switch (type) {
    case 'hero':
      return {
        title: 'Título del Hero',
        subtitle: 'Subtítulo o descripción',
        backgroundImage: ''
      };
    case 'text':
      return {
        content: 'Escribe tu contenido aquí...'
      };
    case 'image':
      return {
        src: '',
        alt: '',
        caption: ''
      };
    case 'gallery':
      return {
        images: []
      };
    case 'cards':
      return {
        title: 'Nuestros Servicios',
        cards: []
      };
    case 'contact':
      return {
        title: 'Contáctanos',
        subtitle: 'Estamos aquí para ayudarte'
      };
    default:
      return {};
  }
};

export default PageEditor;