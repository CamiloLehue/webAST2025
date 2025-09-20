import type { MenuItem } from "../types/menuTypes";

export class MenuService {
  private static STORAGE_KEY = "ast_menu_items";

  static getMenuItems(): MenuItem[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }

      // Si no hay datos guardados, cargar desde el JSON inicial
      return this.getInitialMenuItems();
    } catch (error) {
      console.error("Error loading menu items:", error);
      return this.getInitialMenuItems();
    }
  }

  static saveMenuItems(items: MenuItem[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Error saving menu items:", error);
      throw new Error("Error al guardar los elementos del menú");
    }
  }

  static addMenuItem(item: Omit<MenuItem, "id">): MenuItem {
    const newItem: MenuItem = {
      ...item,
      id: `menu-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    const items = this.getMenuItems();
    const updatedItems = [...items, newItem];
    this.saveMenuItems(updatedItems);

    return newItem;
  }

  static updateMenuItem(updatedItem: MenuItem): void {
    const items = this.getMenuItems();
    const updatedItems = items.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    this.saveMenuItems(updatedItems);
  }

  static deleteMenuItem(id: string): void {
    const items = this.getMenuItems();
    const updatedItems = items.filter((item) => item.id !== id);
    this.saveMenuItems(updatedItems);
  }

  static reorderMenuItems(items: MenuItem[]): void {
    const reorderedItems = items.map((item, index) => ({
      ...item,
      order: index + 1,
    }));
    this.saveMenuItems(reorderedItems);
  }

  private static getInitialMenuItems(): MenuItem[] {
    // Datos iniciales basados en MenuNavItems.json
    return [
      {
        id: "menu-1",
        title: "Inicio",
        path: "/",
        external: false,
        disabled: false,
        order: 1,
        contentType: "page",
      },
      {
        id: "menu-2",
        title: "Sobre Nosotros",
        path: "/sobre-nosotros",
        external: false,
        disabled: false,
        order: 2,
        contentType: "page",
        submenu: [
          {
            id: "submenu-1",
            title: "Sobre Nosotros",
            path: "/sobre-nosotros",
            external: false,
            disabled: false,
            order: 1,
          },
          {
            id: "submenu-2",
            title: "Contacto",
            path: "/contacto",
            external: false,
            disabled: false,
            order: 2,
          },
        ],
      },
      {
        id: "menu-3",
        title: "Productos",
        path: "/productos",
        external: false,
        disabled: false,
        order: 3,
        contentType: "page",
      },
      {
        id: "menu-4",
        title: "Servicios",
        path: "/servicios",
        external: false,
        disabled: false,
        order: 4,
        contentType: "page",
      },
      {
        id: "menu-5",
        title: "Multimedia",
        path: "/multimedia",
        external: false,
        disabled: false,
        order: 5,
        contentType: "page",
      },
      {
        id: "menu-6",
        title: "Noticias",
        path: "/noticias",
        external: false,
        disabled: false,
        order: 6,
        contentType: "page",
      },
    ];
  }
}
