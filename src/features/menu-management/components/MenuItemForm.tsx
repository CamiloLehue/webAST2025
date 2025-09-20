import React, { useState } from 'react';
import type { MenuItem, MenuFormData } from '../types/menu.types';
import { FiSave, FiX } from 'react-icons/fi';

interface MenuItemFormProps {
  item?: MenuItem;
  onSave: (item: MenuItem | Omit<MenuItem, 'id'>) => void;
  onCancel: () => void;
}

export const MenuItemForm: React.FC<MenuItemFormProps> = ({ 
  item, 
  onSave, 
  onCancel 
}) => {
  const [formData, setFormData] = useState<MenuFormData>({
    title: item?.title || '',
    path: item?.path || '',
    external: item?.external || false,
    disabled: item?.disabled || false,
    order: item?.order || 1,
    contentType: item?.contentType || 'page'
  });

  const [errors, setErrors] = useState<Partial<Record<keyof MenuFormData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof MenuFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es obligatorio';
    }

    if (!formData.path.trim()) {
      newErrors.path = 'La ruta es obligatoria';
    } else if (!formData.path.startsWith('/') && !formData.external) {
      newErrors.path = 'La ruta debe comenzar con /';
    }

    if (formData.order < 1) {
      newErrors.order = 'El orden debe ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (item) {
      onSave({
        ...item,
        ...formData
      });
    } else {
      onSave(formData);
    }
  };

  const handleInputChange = (field: keyof MenuFormData, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          {item ? 'Editar Elemento' : 'Nuevo Elemento'}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          <FiX className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.title ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Nombre del elemento"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ruta *
          </label>
          <input
            type="text"
            value={formData.path}
            onChange={(e) => handleInputChange('path', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.path ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="/mi-pagina o https://ejemplo.com"
          />
          {errors.path && (
            <p className="mt-1 text-sm text-red-600">{errors.path}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Contenido
          </label>
          <select
            value={formData.contentType}
            onChange={(e) => handleInputChange('contentType', e.target.value as MenuFormData['contentType'])}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="page">Página</option>
            <option value="blog">Blog</option>
            <option value="external">Enlace Externo</option>
            <option value="custom">Personalizado</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Orden *
          </label>
          <input
            type="number"
            value={formData.order}
            onChange={(e) => handleInputChange('order', parseInt(e.target.value) || 1)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.order ? 'border-red-300' : 'border-gray-300'
            }`}
            min="1"
          />
          {errors.order && (
            <p className="mt-1 text-sm text-red-600">{errors.order}</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.external}
            onChange={(e) => handleInputChange('external', e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="ml-2 text-sm text-gray-700">Enlace externo</span>
        </label>
        
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.disabled}
            onChange={(e) => handleInputChange('disabled', e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="ml-2 text-sm text-gray-700">Deshabilitado</span>
        </label>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <FiSave className="mr-2 h-4 w-4" />
          {item ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
};