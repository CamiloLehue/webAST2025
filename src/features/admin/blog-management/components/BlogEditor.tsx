import React, { useState, useEffect } from 'react';
import { FiSave, FiEye, FiX, FiImage, FiTag } from 'react-icons/fi';
import type { BlogPost, BlogCategory } from '../types/blogTypes';

interface BlogEditorProps {
  post?: BlogPost;
  categories: BlogCategory[];
  onSave: (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancel: () => void;
  onGenerateSlug: (title: string) => string;
  onValidateSlug: (slug: string, excludeId?: string) => boolean;
}

export const BlogEditor: React.FC<BlogEditorProps> = ({
  post,
  categories,
  onSave,
  onCancel,
  onGenerateSlug,
  onValidateSlug
}) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    author: '',
    category: '',
    tags: [] as string[],
    featuredImage: '',
    isPublished: false,
    publishedAt: null as string | null
  });

  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        author: post.author,
        category: post.category,
        tags: post.tags,
        featuredImage: post.featuredImage || '',
        isPublished: post.isPublished,
        publishedAt: post.publishedAt || null
      });
    }
  }, [post]);

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate slug when title changes
    if (field === 'title' && !post && typeof value === 'string') {
      const newSlug = onGenerateSlug(value);
      setFormData(prev => ({ ...prev, slug: newSlug }));
    }
    
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSlugChange = (slug: string) => {
    // Clean slug format
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
    setFormData(prev => ({ ...prev, slug: cleanSlug }));
    
    if (errors.slug) {
      setErrors(prev => ({ ...prev, slug: '' }));
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'El slug es requerido';
    } else if (!onValidateSlug(formData.slug, post?.id)) {
      newErrors.slug = 'Este slug ya está en uso';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'El contenido es requerido';
    }

    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'El resumen es requerido';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'El autor es requerido';
    }

    if (!formData.category) {
      newErrors.category = 'La categoría es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (publish = false) => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const postData = {
        ...formData,
        isPublished: publish,
        publishedAt: publish ? new Date().toISOString() : formData.publishedAt
      };

      await onSave(postData);
    } catch (error) {
      console.error('Error saving post:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isPreview) {
    return (
      <div className="bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Vista Previa</h2>
          <button
            onClick={() => setIsPreview(false)}
            className="text-gray-500 hover:text-bg-300"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <article className="prose max-w-none">
            {formData.featuredImage && (
              <img
                src={formData.featuredImage}
                alt={formData.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
            )}
            
            <h1>{formData.title}</h1>
            
            <div className="text-sm text-bg-200 mb-4">
              Por {formData.author} • {formData.category}
            </div>
            
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            <div className="text-lg text-bg-300 mb-6 italic">
              {formData.excerpt}
            </div>
            
            <div className="whitespace-pre-wrap">
              {formData.content}
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-xl font-semibold">
          {post ? 'Editar Post' : 'Nuevo Post'}
        </h2>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsPreview(true)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FiEye className="w-4 h-4" />
            <span>Vista Previa</span>
          </button>
          
          <button
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FiSave className="w-4 h-4" />
            <span>Guardar Borrador</span>
          </button>
          
          <button
            onClick={() => handleSave(true)}
            disabled={isSaving}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FiSave className="w-4 h-4" />
            <span>Publicar</span>
          </button>
          
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-bg-300"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-bg-300 mb-2">
            Título *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ingresa el título del post"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-bg-300 mb-2">
            Slug *
          </label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.slug ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="url-amigable-del-post"
          />
          {errors.slug && (
            <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
          )}
        </div>

        {/* Author and Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-bg-300 mb-2">
              Autor *
            </label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => handleInputChange('author', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.author ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nombre del autor"
            />
            {errors.author && (
              <p className="mt-1 text-sm text-red-600">{errors.author}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-bg-300 mb-2">
              Categoría *
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Selecciona una categoría</option>
              {categories.map(category => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category}</p>
            )}
          </div>
        </div>

        {/* Featured Image */}
        <div>
          <label className="block text-sm font-medium text-bg-300 mb-2">
            <FiImage className="inline w-4 h-4 mr-1" />
            Imagen Destacada
          </label>
          <input
            type="url"
            value={formData.featuredImage}
            onChange={(e) => handleInputChange('featuredImage', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://ejemplo.com/imagen.jpg"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-bg-300 mb-2">
            <FiTag className="inline w-4 h-4 mr-1" />
            Etiquetas
          </label>
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Agregar etiqueta"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-white text-bg-300 rounded-lg hover:bg-white-100"
            >
              Agregar
            </button>
          </div>
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <span
                  key={tag}
                  className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  <span>{tag}</span>
                  <button
                    onClick={() => removeTag(tag)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-medium text-bg-300 mb-2">
            Resumen *
          </label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => handleInputChange('excerpt', e.target.value)}
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.excerpt ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Breve descripción del post que aparecerá en las listas"
          />
          {errors.excerpt && (
            <p className="mt-1 text-sm text-red-600">{errors.excerpt}</p>
          )}
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-bg-300 mb-2">
            Contenido *
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => handleInputChange('content', e.target.value)}
            rows={15}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.content ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Contenido completo del post"
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content}</p>
          )}
        </div>
      </div>
    </div>
  );
};