const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface MenuItem {
  id: string;
  title: string;
  path: string;
  submenu?: MenuItem[];
  external: boolean;
  disabled: boolean;
  order: number;
  contentType?: 'page' | 'blog' | 'external' | 'custom';
  pageId?: string;
  icon?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MenuItemCreate {
  title: string;
  path: string;
  external: boolean;
  disabled: boolean;
  order: number;
  contentType: 'page' | 'blog' | 'external' | 'custom';
  pageId?: string;
  icon?: string;
}

export interface MenuItemUpdate {
  title?: string;
  path?: string;
  external?: boolean;
  disabled?: boolean;
  order?: number;
  contentType?: 'page' | 'blog' | 'external' | 'custom';
  pageId?: string;
  icon?: string;
}

export interface SubmenuItemCreate {
  parentId: string;
  title: string;
  path: string;
  external: boolean;
  disabled: boolean;
  order: number;
  contentType: 'page' | 'blog' | 'external' | 'custom';
  pageId?: string;
  icon?: string;
}

export interface MenuStructure {
  mainMenuItems: MenuItem[];
  totalItems: number;
  lastUpdated: string;
}

export interface ApiResponse<T> {
  data: T;
  res: boolean;
  msg: string;
}

class MenuService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('admin_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }


  async getMenuItems(): Promise<MenuItem[]> {
    try {
      const response = await fetch(`${API_URL}/menu-items`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return this.handleResponse<MenuItem[]>(response);
    } catch (error) {
      console.error('Error al obtener elementos del menú:', error);
      throw error;
    }
  }

  async getMenuStructure(): Promise<MenuStructure> {
    try {
      const response = await fetch(`${API_URL}/menu-structure`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return this.handleResponse<MenuStructure>(response);
    } catch (error) {
      console.error('Error al obtener estructura del menú:', error);
      throw error;
    }
  }

  async createMenuItem(menuItem: MenuItemCreate): Promise<MenuItem> {
    try {
      const response = await fetch(`${API_URL}/menu-items`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(menuItem),
      });

      const result = await this.handleResponse<ApiResponse<MenuItem>>(response);
      return result.data;
    } catch (error) {
      console.error('Error al crear elemento del menú:', error);
      throw error;
    }
  }

  async updateMenuItem(id: string, menuItem: MenuItemUpdate): Promise<MenuItem> {
    try {
      const response = await fetch(`${API_URL}/menu-items/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(menuItem),
      });

      const result = await this.handleResponse<ApiResponse<MenuItem>>(response);
      return result.data;
    } catch (error) {
      console.error('Error al actualizar elemento del menú:', error);
      throw error;
    }
  }

  async deleteMenuItem(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/menu-items/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      await this.handleResponse<ApiResponse<null>>(response);
    } catch (error) {
      console.error('Error al eliminar elemento del menú:', error);
      throw error;
    }
  }


  async getSubmenuItems(parentId: string): Promise<MenuItem[]> {
    try {
      const response = await fetch(`${API_URL}/menu-items/${parentId}/submenu`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return this.handleResponse<MenuItem[]>(response);
    } catch (error) {
      console.error('Error al obtener submenu items:', error);
      throw error;
    }
  }

  async createSubmenuItem(submenuItem: Omit<SubmenuItemCreate, 'parentId'>, parentId: string): Promise<MenuItem> {
    try {
      const submenuData: SubmenuItemCreate = {
        ...submenuItem,
        parentId,
      };

      const response = await fetch(`${API_URL}/menu-items/${parentId}/submenu`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(submenuData),
      });

      const result = await this.handleResponse<ApiResponse<MenuItem>>(response);
      return result.data;
    } catch (error) {
      console.error('Error al crear submenu item:', error);
      throw error;
    }
  }

  async updateSubmenuItem(
    parentId: string, 
    submenuId: string, 
    submenuItem: MenuItemUpdate
  ): Promise<MenuItem> {
    try {
      const response = await fetch(`${API_URL}/menu-items/${parentId}/submenu/${submenuId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(submenuItem),
      });

      const result = await this.handleResponse<ApiResponse<MenuItem>>(response);
      return result.data;
    } catch (error) {
      console.error('Error al actualizar submenu item:', error);
      throw error;
    }
  }

  async deleteSubmenuItem(parentId: string, submenuId: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/menu-items/${parentId}/submenu/${submenuId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      await this.handleResponse<ApiResponse<null>>(response);
    } catch (error) {
      console.error('Error al eliminar submenu item:', error);
      throw error;
    }
  }


  async reorderMenuItems(items: { id: string; order: number }[]): Promise<void> {
    try {
      const promises = items.map(item =>
        this.updateMenuItem(item.id, { order: item.order })
      );
      
      await Promise.all(promises);
    } catch (error) {
      console.error('Error al reordenar elementos del menú:', error);
      throw error;
    }
  }

  async reorderSubmenuItems(
    parentId: string, 
    items: { id: string; order: number }[]
  ): Promise<void> {
    try {
      const promises = items.map(item =>
        this.updateSubmenuItem(parentId, item.id, { order: item.order })
      );
      
      await Promise.all(promises);
    } catch (error) {
      console.error('Error al reordenar submenu items:', error);
      throw error;
    }
  }
}

export const menuService = new MenuService();
export default menuService;