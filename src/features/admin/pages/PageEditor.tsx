import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { usePageManagement } from '../page-management/hooks/usePageManagement';
import type { ContentSection } from '../page-management/types/pageTypes';
import { FiSave, FiEye, FiArrowLeft, FiLoader } from 'react-icons/fi';

const PageEditor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const template = searchParams.get('template');
  
  const { 
    customPages, 
    loading, 
    error,
    createCustomPage, 
    updateCustomPage,
    createPageFromTemplate,
    generateSlug,
    validateSlug
  } = usePageManagement();
  
  const isEditing = !!id;
  const existingPage = isEditing ? customPages.find(page => page.id === id) : null;

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    metaTitle: '',
    metaDescription: '',
    isPublished: false,
    content: [] as ContentSection[]
  });

  const [isSaving, setIsSaving] = useState(false);
  const [slugError, setSlugError] = useState('');

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
      const tempTitle = 'Nueva Página';
      const tempSlug = generateSlug(tempTitle);
      
      setFormData({
        title: tempTitle,
        slug: tempSlug,
        metaTitle: '',
        metaDescription: '',
        isPublished: false,
        content: []
      });
    }
  }, [existingPage, template, generateSlug]);

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({ ...prev, title }));
    if (!isEditing) {
      const newSlug = generateSlug(title);
      setFormData(prev => ({ ...prev, slug: newSlug }));
    }
  };

  const handleSlugChange = async (slug: string) => {
    setFormData(prev => ({ ...prev, slug }));
    
    if (slug) {
      const isValid = await validateSlug(slug, isEditing ? id : undefined);
      setSlugError(isValid ? '' : 'Este slug ya está en uso');
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      alert('El título es requerido');
      return;
    }

    if (!formData.slug.trim()) {
      alert('El slug es requerido');
      return;
    }

    if (slugError) {
      alert('Por favor corrige los errores antes de guardar');
      return;
    }

    setIsSaving(true);
    
    try {
      if (isEditing && existingPage) {
        await updateCustomPage({
          ...existingPage,
          ...formData
        });
      } else {
        if (template) {
          // Create from template
          await createPageFromTemplate(template, {
            title: formData.title,
            slug: formData.slug
          });
        } else {
          // Create new page
          await createCustomPage(formData);
        }
      }
      
      navigate('/admin/pages');
    } catch (err) {
      console.error('Error saving page:', err);
      alert('Error al guardar la página');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    if (formData.slug) {
      window.open(`/${formData.slug}`, '_blank');
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
            onClick={() => navigate('/admin/pages')}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <FiArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Editar Página' : 'Nueva Página'}
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
            {isSaving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
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
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
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
                  slugError ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="url-de-la-pagina"
              />
            </div>
            {slugError && (
              <p className="mt-1 text-sm text-red-600">{slugError}</p>
            )}
          </div>

          <div>
            <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700">
              Meta Título (SEO)
            </label>
            <input
              type="text"
              id="metaTitle"
              value={formData.metaTitle}
              onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Título para SEO (opcional)"
            />
          </div>

          <div>
            <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700">
              Meta Descripción (SEO)
            </label>
            <textarea
              id="metaDescription"
              rows={3}
              value={formData.metaDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Descripción para SEO (opcional)"
            />
          </div>

          <div className="flex items-center">
            <input
              id="isPublished"
              type="checkbox"
              checked={formData.isPublished}
              onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-900">
              Publicar página
            </label>
          </div>
        </div>

        {/* Content Sections Info */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Contenido</h3>
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Editor de contenido en desarrollo
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    El editor visual de secciones estará disponible próximamente. 
                    Por ahora, las páginas se crean con el contenido de la plantilla seleccionada.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {formData.content.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                Esta página tiene {formData.content.length} secciones de contenido.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageEditor;