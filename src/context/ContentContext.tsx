import React, { createContext, useEffect, useState } from "react";
import type { MenuItem, PageContent } from "../types/content";
import { menuService } from "../services/menuService";
import { useToast } from "../hooks/useToast";

interface ContentContextType {
  menuItems: MenuItem[];
  pages: PageContent[];
  loading: boolean;
  error: string | null;
  updateMenuItem: (item: MenuItem) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
  addMenuItem: (item: Omit<MenuItem, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  addSubmenuItem: (item: Omit<MenuItem, "id" | "createdAt" | "updatedAt">, parentId: string) => Promise<void>;
  updateSubmenuItem: (parentId: string, submenuId: string, item: Partial<MenuItem>) => Promise<void>;
  deleteSubmenuItem: (parentId: string, submenuId: string) => Promise<void>;
  refreshMenuItems: () => Promise<void>;
  createPage: (
    page: Omit<PageContent, "id" | "createdAt" | "updatedAt">
  ) => void;
  updatePage: (page: PageContent) => void;
  deletePage: (id: string) => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export { ContentContext };

interface ContentProviderProps {
  children: React.ReactNode;
}

export const ContentProvider: React.FC<ContentProviderProps> = ({
  children,
}) => {
  const { showToast } = useToast();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [pages, setPages] = useState<PageContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos iniciales
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const items = await menuService.getMenuItems();
        if (isMounted) {
          setMenuItems(items);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Error al cargar menús');
          console.error('Error loading menu items:', err);
          setLoading(false);
        }
      }
    };

    loadData();
    loadPages();

    return () => {
      isMounted = false;
    };
  }, []);

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const items = await menuService.getMenuItems();
      setMenuItems(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar menús');
      console.error('Error loading menu items:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadPages = () => {
    const savedPages = localStorage.getItem("ast_pages");
    if (savedPages) {
      try {
        setPages(JSON.parse(savedPages));
      } catch {
        setPages([]);
      }
    }
  };

  const updateMenuItem = async (item: MenuItem): Promise<void> => {
    try {
      setError(null);
      const updatedItem = await menuService.updateMenuItem(item.id, item);
      setMenuItems((prev) =>
        prev.map((menuItem) => (menuItem.id === item.id ? updatedItem : menuItem))
      );
      showToast('Elemento del menú actualizado exitosamente', 'success');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al actualizar menú';
      setError(errorMsg);
      showToast(errorMsg, 'error');
      throw err;
    }
  };

  const deleteMenuItem = async (id: string): Promise<void> => {
    try {
      setError(null);
      await menuService.deleteMenuItem(id);
      setMenuItems((prev) => prev.filter((item) => item.id !== id));
      showToast('Elemento del menú eliminado exitosamente', 'success');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al eliminar menú';
      setError(errorMsg);
      showToast(errorMsg, 'error');
      throw err;
    }
  };

  const addMenuItem = async (item: Omit<MenuItem, "id" | "createdAt" | "updatedAt">): Promise<void> => {
    try {
      setError(null);
      const menuItemData = {
        ...item,
        contentType: item.contentType || 'page' as const
      };
      const newItem = await menuService.createMenuItem(menuItemData);
      setMenuItems((prev) =>
        [...prev, newItem].sort((a, b) => a.order - b.order)
      );
      showToast('Elemento del menú agregado exitosamente', 'success');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al crear menú';
      setError(errorMsg);
      showToast(errorMsg, 'error');
      throw err;
    }
  };

  const addSubmenuItem = async (item: Omit<MenuItem, "id" | "createdAt" | "updatedAt">, parentId: string): Promise<void> => {
    try {
      setError(null);
      const submenuItemData = {
        ...item,
        contentType: item.contentType || 'page' as const
      };
      const newSubmenuItem = await menuService.createSubmenuItem(submenuItemData, parentId);
      
      setMenuItems((prev) =>
        prev.map((menuItem) => {
          if (menuItem.id === parentId) {
            return {
              ...menuItem,
              submenu: [...(menuItem.submenu || []), newSubmenuItem].sort((a, b) => a.order - b.order)
            };
          }
          return menuItem;
        })
      );
      showToast('Submenú agregado exitosamente', 'success');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al crear submenu';
      setError(errorMsg);
      showToast(errorMsg, 'error');
      throw err;
    }
  };

  const updateSubmenuItem = async (parentId: string, submenuId: string, item: Partial<MenuItem>): Promise<void> => {
    try {
      setError(null);
      const updatedSubmenu = await menuService.updateSubmenuItem(parentId, submenuId, item);
      
      setMenuItems((prev) =>
        prev.map((menuItem) => {
          if (menuItem.id === parentId) {
            return {
              ...menuItem,
              submenu: menuItem.submenu?.map((sub) =>
                sub.id === submenuId ? updatedSubmenu : sub
              )
            };
          }
          return menuItem;
        })
      );
      showToast('Submenú actualizado exitosamente', 'success');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al actualizar submenu';
      setError(errorMsg);
      showToast(errorMsg, 'error');
      throw err;
    }
  };

  const deleteSubmenuItem = async (parentId: string, submenuId: string): Promise<void> => {
    try {
      setError(null);
      await menuService.deleteSubmenuItem(parentId, submenuId);
      
      setMenuItems((prev) =>
        prev.map((menuItem) => {
          if (menuItem.id === parentId) {
            return {
              ...menuItem,
              submenu: menuItem.submenu?.filter((sub) => sub.id !== submenuId)
            };
          }
          return menuItem;
        })
      );
      showToast('Submenú eliminado exitosamente', 'success');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al eliminar submenu';
      setError(errorMsg);
      showToast(errorMsg, 'error');
      throw err;
    }
  };

  const refreshMenuItems = async (): Promise<void> => {
    await loadMenuItems();
  };

  const createPage = (
    page: Omit<PageContent, "id" | "createdAt" | "updatedAt">
  ) => {
    const newPage: PageContent = {
      ...page,
      id: `page-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updatedPages = [...pages, newPage];
    setPages(updatedPages);
    localStorage.setItem("ast_pages", JSON.stringify(updatedPages));
  };

  const updatePage = (page: PageContent) => {
    const updatedPage = {
      ...page,
      updatedAt: new Date().toISOString(),
    };
    const updatedPages = pages.map((p) => (p.id === page.id ? updatedPage : p));
    setPages(updatedPages);
    localStorage.setItem("ast_pages", JSON.stringify(updatedPages));
  };

  const deletePage = (id: string) => {
    const updatedPages = pages.filter((page) => page.id !== id);
    setPages(updatedPages);
    localStorage.setItem("ast_pages", JSON.stringify(updatedPages));
  };

  const value: ContentContextType = {
    menuItems,
    pages,
    loading,
    error,
    updateMenuItem,
    deleteMenuItem,
    addMenuItem,
    addSubmenuItem,
    updateSubmenuItem,
    deleteSubmenuItem,
    refreshMenuItems,
    createPage,
    updatePage,
    deletePage,
  };

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  );
};
