import { useState, useEffect } from "react";
import type { MenuItem } from "../types/menuTypes";
import { MenuService } from "../services/menuService";
import { useToast } from "../../../../hooks/useToast";

export const useMenuManagement = () => {
  const { showToast } = useToast();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const items = MenuService.getMenuItems();
      setMenuItems(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar el menú");
    } finally {
      setLoading(false);
    }
  };

  const addMenuItem = async (item: Omit<MenuItem, "id">) => {
    try {
      setError(null);
      const newItem = MenuService.addMenuItem(item);
      setMenuItems((prev) => [...prev, newItem]);
      showToast("Elemento del menú agregado exitosamente", "success");
      return newItem;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error al agregar elemento";
      setError(errorMsg);
      showToast(errorMsg, "error");
      throw err;
    }
  };

  const updateMenuItem = async (updatedItem: MenuItem) => {
    try {
      setError(null);
      MenuService.updateMenuItem(updatedItem);
      setMenuItems((prev) =>
        prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
      );
      showToast("Elemento del menú actualizado exitosamente", "success");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error al actualizar elemento";
      setError(errorMsg);
      showToast(errorMsg, "error");
      throw err;
    }
  };

  const deleteMenuItem = async (id: string) => {
    try {
      setError(null);
      MenuService.deleteMenuItem(id);
      setMenuItems((prev) => prev.filter((item) => item.id !== id));
      showToast("Elemento del menú eliminado exitosamente", "success");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error al eliminar elemento";
      setError(errorMsg);
      showToast(errorMsg, "error");
      throw err;
    }
  };

  const reorderMenuItems = async (items: MenuItem[]) => {
    try {
      setError(null);
      MenuService.reorderMenuItems(items);
      setMenuItems(items);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al reordenar elementos"
      );
      throw err;
    }
  };

  return {
    menuItems,
    loading,
    error,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    reorderMenuItems,
    refresh: loadMenuItems,
  };
};
