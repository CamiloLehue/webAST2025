import type { 
  User, 
  CreateUserRequest, 
  UpdateUserRequest, 
  ChangePasswordRequest,
  UserFilters,
  UserListResponse
} from '../types/userTypes';

const API_URL = import.meta.env.VITE_API_URL;

class UserService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('admin_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  async getUsers(filters?: UserFilters): Promise<UserListResponse> {
    try {
      const { page = 1, limit = 10, search, role, active } = filters || {};
      const skip = (page - 1) * limit;
      
      const params = new URLSearchParams({
        skip: skip.toString(),
        limit: limit.toString(),
      });
      
      if (search && search.trim()) {
        params.append('search', search.trim());
      }
      if (role) {
        params.append('role', role);
      }
      if (active !== undefined) {
        params.append('active', active.toString());
      }

      // Ejecutar ambas consultas en paralelo
      const [usersResponse, countResponse] = await Promise.all([
        fetch(`${API_URL}/usuarios?${params.toString()}`, {
          method: 'GET',
          headers: this.getAuthHeaders()
        }),
        fetch(`${API_URL}/usuarios/count?${params.toString()}`, {
          method: 'GET',
          headers: this.getAuthHeaders()
        })
      ]);

      if (!usersResponse.ok || !countResponse.ok) {
        throw new Error(`Error al obtener usuarios: ${usersResponse.statusText}`);
      }

      const users = await usersResponse.json();
      const { total } = await countResponse.json();

      return {
        users,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error('Error en getUsers:', error);
      throw error;
    }
  }

  async getUserById(id: string): Promise<User> {
    try {
      const response = await fetch(`${API_URL}/usuarios/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Error al obtener usuario: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error en getUserById:', error);
      throw error;
    }
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    try {
      const response = await fetch(`${API_URL}/usuarios`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error al crear usuario: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error('Error en createUser:', error);
      throw error;
    }
  }

  async updateUser(id: string, userData: UpdateUserRequest): Promise<User> {
    try {
      const response = await fetch(`${API_URL}/usuarios/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error al actualizar usuario: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error en updateUser:', error);
      throw error;
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/usuarios/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error al eliminar usuario: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error en deleteUser:', error);
      throw error;
    }
  }

  async changePassword(id: string, passwordData: ChangePasswordRequest): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/usuarios/${id}/cambiar-password`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(passwordData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error al cambiar contraseña: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error en changePassword:', error);
      throw error;
    }
  }

  async toggleUserStatus(id: string): Promise<User> {
    try {
      const response = await fetch(`${API_URL}/usuarios/${id}/toggle-status`, {
        method: 'PATCH',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error al cambiar estado del usuario: ${response.statusText}`);
      }

      // Obtener el usuario actualizado
      return await this.getUserById(id);
    } catch (error) {
      console.error('Error en toggleUserStatus:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await fetch(`${API_URL}/usuarios/me`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Error al obtener usuario actual: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error en getCurrentUser:', error);
      throw error;
    }
  }
}

export const userService = new UserService();
export default userService;