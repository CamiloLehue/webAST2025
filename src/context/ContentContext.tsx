import React, { createContext, useEffect, useState } from 'react';
import type { MenuItem, PageContent } from '../types/content';
import menuItemsData from '../layouts/json/MenuNavItems.json';

interface ContentContextType {
  menuItems: MenuItem[];
  pages: PageContent[];
  updateMenuItem: (item: MenuItem) => void;
  deleteMenuItem: (id: string) => void;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  createPage: (page: Omit<PageContent, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePage: (page: PageContent) => void;
  deletePage: (id: string) => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export { ContentContext };

interface ContentProviderProps {
  children: React.ReactNode;
}

export const ContentProvider: React.FC<ContentProviderProps> = ({ children }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [pages, setPages] = useState<PageContent[]>([]);

  useEffect(() => {
    // Convertir los datos existentes al nuevo formato
    const convertedMenuItems: MenuItem[] = menuItemsData.map((item, index) => ({
      id: `menu-${index + 1}`,
      title: item.title,
      path: item.path,
      submenu: item.submenu?.map((subItem, subIndex) => ({
        id: `submenu-${index + 1}-${subIndex + 1}`,
        title: subItem.title,
        path: subItem.path,
        external: false,
        disabled: false,
        order: subIndex + 1,
        contentType: 'page' as const
      })),
      external: item.external,
      disabled: item.disabled,
      order: item.order,
      contentType: 'page' as const
    }));

    setMenuItems(convertedMenuItems);

    // Cargar datos del localStorage si existen
    const savedPages = localStorage.getItem('ast_pages');
    if (savedPages) {
      try {
        setPages(JSON.parse(savedPages));
      } catch {
        setPages([]);
      }
    }
  }, []);

  // Funciones para gestionar menús
  const updateMenuItem = (item: MenuItem) => {
    setMenuItems(prev => prev.map(menuItem => 
      menuItem.id === item.id ? item : menuItem
    ));
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
  };

  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...item,
      id: `menu-${Date.now()}`
    };
    setMenuItems(prev => [...prev, newItem].sort((a, b) => a.order - b.order));
  };

  // Funciones para gestionar páginas
  const createPage = (page: Omit<PageContent, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPage: PageContent = {
      ...page,
      id: `page-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updatedPages = [...pages, newPage];
    setPages(updatedPages);
    localStorage.setItem('ast_pages', JSON.stringify(updatedPages));
  };

  const updatePage = (page: PageContent) => {
    const updatedPage = {
      ...page,
      updatedAt: new Date().toISOString()
    };
    const updatedPages = pages.map(p => p.id === page.id ? updatedPage : p);
    setPages(updatedPages);
    localStorage.setItem('ast_pages', JSON.stringify(updatedPages));
  };

  const deletePage = (id: string) => {
    const updatedPages = pages.filter(page => page.id !== id);
    setPages(updatedPages);
    localStorage.setItem('ast_pages', JSON.stringify(updatedPages));
  };

  const value: ContentContextType = {
    menuItems,
    pages,
    updateMenuItem,
    deleteMenuItem,
    addMenuItem,
    createPage,
    updatePage,
    deletePage
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};