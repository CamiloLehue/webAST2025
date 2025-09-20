import React, { useState } from "react";
import { FiPlus, FiRefreshCw } from "react-icons/fi";
import { useMenuManagement } from "./hooks";
import { MenuItemForm } from "./components";
import { MenuItemCard } from "./components";
import type { MenuItem } from "./types";

const MenuManagementPage: React.FC = () => {
  const {
    menuItems,
    loading,
    error,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    refresh,
  } = useMenuManagement();

  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setShowAddForm(false);
  };

  const handleSaveItem = async (item: MenuItem | Omit<MenuItem, "id">) => {
    try {
      if ("id" in item) {
        await updateMenuItem(item);
        setEditingItem(null);
      } else {
        await addMenuItem(item);
        setShowAddForm(false);
      }
    } catch (error) {
      console.error("Error saving menu item:", error);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await deleteMenuItem(id);
    } catch (error) {
      console.error("Error deleting menu item:", error);
    }
  };

  const handleCancel = () => {
    setEditingItem(null);
    setShowAddForm(false);
  };

  const sortedMenuItems = [...menuItems].sort((a, b) => a.order - b.order);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-200 h-24 rounded-lg"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Menú</h2>
          <p className="mt-1 text-gray-600">
            Administra los elementos del menú principal de navegación
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={refresh}
            disabled={loading}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            <FiRefreshCw className="mr-2 h-4 w-4" />
            Actualizar
          </button>

          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
          >
            <FiPlus className="mr-2 h-4 w-4" />
            Agregar Elemento
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
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
      )}

      {/* Add/Edit Form */}
      {(showAddForm || editingItem) && (
        <MenuItemForm
          item={editingItem || undefined}
          onSave={handleSaveItem}
          onCancel={handleCancel}
        />
      )}

      {/* Menu Items List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">
              Elementos del Menú ({menuItems.length})
            </h3>
            <span className="text-sm text-gray-500">
              Arrastra para reordenar
            </span>
          </div>
        </div>

        {menuItems.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay elementos en el menú
            </h3>
            <p className="text-gray-500 mb-6">
              Comienza agregando tu primer elemento al menú de navegación.
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
            >
              <FiPlus className="mr-2 h-4 w-4" />
              Agregar Primer Elemento
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {sortedMenuItems.map((item) => (
              <div key={item.id} className="p-1">
                <MenuItemCard
                  item={item}
                  onEdit={handleEditItem}
                  onDelete={handleDeleteItem}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      {menuItems.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="text-sm font-medium text-gray-900 mb-4">
            Estadísticas
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Total de elementos:</span>
              <span className="ml-2 font-medium">{menuItems.length}</span>
            </div>
            <div>
              <span className="text-gray-500">Activos:</span>
              <span className="ml-2 font-medium text-green-600">
                {menuItems.filter((item) => !item.disabled).length}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Deshabilitados:</span>
              <span className="ml-2 font-medium text-red-600">
                {menuItems.filter((item) => item.disabled).length}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Enlaces externos:</span>
              <span className="ml-2 font-medium text-purple-600">
                {menuItems.filter((item) => item.external).length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagementPage;
