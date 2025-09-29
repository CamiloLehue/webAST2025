const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    active: boolean;
    created_at: string;
    updated_at: string;
  };
}

export interface ApiError {
  detail: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: credentials.email,
          password: credentials.password,
        }),
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.detail || 'Error en el login');
      }

      const data: LoginResponse = await response.json();
      
      // Guardar token en localStorage
      localStorage.setItem('admin_token', data.access_token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
      
      return data;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<LoginResponse['user']> {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        throw new Error('No hay token de acceso');
      }

      const response = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expirado o inválido
          this.logout();
          throw new Error('Sesión expirada');
        }
        const errorData: ApiError = await response.json();
        throw new Error(errorData.detail || 'Error al obtener usuario');
      }

      const user: LoginResponse['user'] = await response.json();
      
      // Actualizar usuario en localStorage
      localStorage.setItem('admin_user', JSON.stringify(user));
      
      return user;
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
      throw error;
    }
  }

  logout(): void {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  }

  getStoredToken(): string | null {
    return localStorage.getItem('admin_token');
  }

  getStoredUser(): LoginResponse['user'] | null {
    try {
      const userStr = localStorage.getItem('admin_user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    const token = this.getStoredToken();
    const user = this.getStoredUser();
    return !!(token && user);
  }
}

export const authService = new AuthService();
export default authService;