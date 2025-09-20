import React from 'react';
import type { MenuItem } from '../types/menu.types';
import { FiEdit2, FiTrash2, FiMove, FiExternalLink, FiEye, FiEyeOff } from 'react-icons/fi';

interface MenuItemCardProps {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  onEdit,
  onDelete
}) => {
  const handleDelete = () => {
    if (confirm(`¿Estás seguro de que quieres eliminar "${item.title}"?`)) {
      onDelete(item.id);
    }
  };

  const getContentTypeLabel = (type?: string) => {
    switch (type) {
      case 'page': return 'Página';
      case 'blog': return 'Blog';
      case 'external': return 'Externo';
      case 'custom': return 'Personalizado';
      default: return 'Página';
    }
  };

  const getContentTypeColor = (type?: string) => {
    switch (type) {
      case 'page': return 'bg-blue-100 text-blue-800';
      case 'blog': return 'bg-green-100 text-green-800';
      case 'external': return 'bg-purple-100 text-purple-800';
      case 'custom': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="cursor-move">
            <FiMove className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h4 className="text-lg font-medium text-gray-900">
                {item.title}
              </h4>
              
              {item.external && (
                <FiExternalLink className="h-4 w-4 text-gray-400" />
              )}
              
              {item.disabled ? (
                <FiEyeOff className="h-4 w-4 text-red-500" title="Deshabilitado" />
              ) : (
                <FiEye className="h-4 w-4 text-green-500" title="Activo" />
              )}
            </div>
            
            <div className="space-y-1">
              <p className="text-gray-600 font-mono text-sm">{item.path}</p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Orden: {item.order}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getContentTypeColor(item.contentType)}`}>
                  {getContentTypeLabel(item.contentType)}
                </span>
                {item.submenu && item.submenu.length > 0 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                    {item.submenu.length} subelementos
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => onEdit(item)}
            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
            title="Editar elemento"
          >
            <FiEdit2 className="h-4 w-4" />
          </button>
          
          <button
            onClick={handleDelete}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Eliminar elemento"
          >
            <FiTrash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};