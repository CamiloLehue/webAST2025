import React, { useState } from "react";
import { useContent } from "../../../hooks/useContent";
import type { MenuItem } from "../../../types/content";
import {
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiExternalLink,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";

const MenuManagement: React.FC = () => {
  const { 
    menuItems, 
    updateMenuItem, 
    deleteMenuItem, 
    addMenuItem,
    addSubmenuItem,
    updateSubmenuItem,
    deleteSubmenuItem,
    loading,
    error 
  } = useContent();
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [addingSubmenuTo, setAddingSubmenuTo] = useState<string | null>(null);

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
  };

  const handleSaveItem = async (item: MenuItem, parentId?: string) => {
    try {
      if (parentId) {
        await updateSubmenuItem(parentId, item.id, item);
      } else {
        await updateMenuItem(item);
      }
      setEditingItem(null);
    } catch (error) {
      console.error('Error al guardar elemento:', error);
    }
  };

  const handleDeleteItem = async (id: string, parentId?: string) => {
    if (
      confirm("¿Estás seguro de que quieres eliminar este elemento del menú?")
    ) {
      try {
        if (parentId) {
          await deleteSubmenuItem(parentId, id);
        } else {
          await deleteMenuItem(id);
        }
      } catch (error) {
        console.error('Error al eliminar elemento:', error);
      }
    }
  };

  const handleAddItem = async (item: Omit<MenuItem, "id">, parentId?: string) => {
    try {
      if (parentId) {
        await addSubmenuItem(item, parentId);
        setAddingSubmenuTo(null);
      } else {
        await addMenuItem(item);
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Error al agregar elemento:', error);
    }
  };

  const renderMenuItem = (
    item: MenuItem,
    level: number = 0,
    parentId?: string
  ) => {
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isExpanded = expandedItems.has(item.id);

    return (
      <div key={item.id}>
        <div
          className={`p-6 ${
            level > 0 ? "bg-accent-100/15 border-l-8 border-bg-400/20" : ""
          }`}
        >
          {editingItem?.id === item.id ? (
            <MenuItemForm
              item={editingItem}
              onSave={(item) => handleSaveItem(item as MenuItem, parentId)}
              onCancel={() => setEditingItem(null)}
            />
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {hasSubmenu && (
                    <button
                      onClick={() => toggleExpanded(item.id)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      {isExpanded ? (
                        <FiChevronDown className="h-4 w-4 text-gray-600" />
                      ) : (
                        <FiChevronRight className="h-4 w-4 text-gray-600" />
                      )}
                    </button>
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4
                      className={`text-lg font-medium text-bg-100 ${
                        level > 0 ? "text-base" : ""
                      }`}
                    >
                      {item.title}
                    </h4>
                    {item.external && (
                      <FiExternalLink className="h-4 w-4 text-bg-300" />
                    )}
                    {item.disabled && (
                      <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                        Deshabilitado
                      </span>
                    )}
                    {level > 0 && (
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        Submenú
                      </span>
                    )}
                  </div>
                  <p className="text-bg-200">{item.path}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span>Orden: {item.order}</span>
                    <span>Tipo: {item.contentType || "page"}</span>
                    {hasSubmenu && (
                      <span>{item.submenu!.length} subelementos</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {level === 0 && (
                  <button
                    onClick={() => setAddingSubmenuTo(item.id)}
                    className="p-2 text-bg-300 hover:text-blue-600"
                    title="Agregar submenú"
                  >
                    <FiPlus className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => handleEditItem(item)}
                  className="p-2 text-bg-300 hover:text-bg-200"
                >
                  <FiEdit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteItem(item.id, parentId)}
                  className="p-2 text-bg-300 hover:text-primary-100"
                >
                  <FiTrash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {addingSubmenuTo === item.id && (
          <div className="px-6 pb-6">
            <div className="ml-12 border-l-2 border-blue-200 pl-6">
              <h4 className="text-sm font-medium text-gray-700 mb-4">
                Agregar submenú a "{item.title}"
              </h4>
              <MenuItemForm
                onSave={(submenuItem) =>
                  handleAddItem(submenuItem as Omit<MenuItem, "id">, item.id)
                }
                onCancel={() => setAddingSubmenuTo(null)}
              />
            </div>
          </div>
        )}

        {hasSubmenu && isExpanded && (
          <div className="border-l-[12px] border-accent-100">
            {item
              .submenu!.sort((a, b) => a.order - b.order)
              .map((subItem) => renderMenuItem(subItem, level + 1, item.id))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 p-5">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-700">Cargando menús...</p>
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-bg-100">Gestión de Menú</h2>
          <p className="mt-1 text-bg-200">
            Administra los elementos del menú principal de navegación y sus
            submenús de www.ast.cl/
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-4 py-2 bg-accent-100 text-white text-sm font-medium rounded-md hover:bg-accent-200"
        >
          <FiPlus className="mr-2 h-4 w-4" />
          Agregar Elemento Principal
        </button>
      </div>

      {showAddForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-bg-100 mb-4">
            Nuevo Elemento Principal
          </h3>
          <MenuItemForm
            onSave={(item) => handleAddItem(item as Omit<MenuItem, "id">)}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-white-100">
          <h3 className="text-lg font-medium text-bg-100">
            Elementos del Menú
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Haz clic en las flechas para expandir/contraer submenús
          </p>
        </div>
        <div className="divide-y divide-white-100">
          {menuItems
            .sort((a, b) => a.order - b.order)
            .map((item) => renderMenuItem(item))}
        </div>
      </div>
    </div>
  );
};

interface MenuItemFormProps {
  item?: MenuItem;
  onSave: (item: MenuItem | Omit<MenuItem, "id">) => void;
  onCancel: () => void;
}

const MenuItemForm: React.FC<MenuItemFormProps> = ({
  item,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    title: item?.title || "",
    path: item?.path || "",
    external: item?.external || false,
    disabled: item?.disabled || false,
    order: item?.order || 1,
    contentType: item?.contentType || ("page" as const),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (item) {
      onSave({
        ...item,
        ...formData,
      });
    } else {
      onSave(formData);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-50 p-6 rounded-lg space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-bg-300 mb-1">
            Título
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-bg-300 mb-1">
            Ruta
          </label>
          <input
            type="text"
            value={formData.path}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, path: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
            placeholder="/mi-pagina"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-bg-300 mb-1">
            Tipo de Contenido
          </label>
          <select
            value={formData.contentType}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                contentType: e.target.value as
                  | "page"
                  | "blog"
                  | "external"
                  | "custom",
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
          >
            <option value="page">Página</option>
            <option value="blog">Blog</option>
            <option value="external">Enlace Externo</option>
            <option value="custom">Personalizado</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-bg-300 mb-1">
            Orden
          </label>
          <input
            type="number"
            value={formData.order}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                order: parseInt(e.target.value),
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-100 focus:border-accent-100"
            min="1"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.external}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, external: e.target.checked }))
            }
            className="rounded border-gray-300 text-accent-100 focus:ring-accent-100"
          />
          <span className="ml-2 text-sm text-bg-300">Enlace externo</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.disabled}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, disabled: e.target.checked }))
            }
            className="rounded border-gray-300 text-accent-100 focus:ring-accent-100"
          />
          <span className="ml-2 text-sm text-bg-300">Deshabilitado</span>
        </label>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-bg-300 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-accent-100 border border-transparent rounded-md hover:bg-accent-200"
        >
          {item ? "Actualizar" : "Crear"}
        </button>
      </div>
    </form>
  );
};

export default MenuManagement;
