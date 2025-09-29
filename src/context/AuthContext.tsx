import React, { createContext, useEffect, useState } from 'react';
import type { UserRole, UserPermissions } from '../features/admin/user-management/types/userTypes';
import { getRolePermissions } from '../features/admin/user-management/types/userTypes';
import { authService, type LoginCredentials } from '../services/authService';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  permissions: UserPermissions | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  hasPermission: (permission: keyof UserPermissions) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Calculate permissions based on user role
  const permissions = user ? getRolePermissions(user.role) : null;

  const hasPermission = (permission: keyof UserPermissions): boolean => {
    if (!permissions) return false;
    return permissions[permission];
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Verificar si hay una sesión guardada
        const storedUser = authService.getStoredUser();
        const token = authService.getStoredToken();
        
        if (storedUser && token) {
          try {
            // Verificar que el token aún sea válido obteniendo el usuario actual
            const currentUser = await authService.getCurrentUser();
            // Mapear rol de BD a tipo del frontend
            const mappedUser = {
              ...currentUser,
              role: mapBackendRoleToFrontend(currentUser.role)
            };
            setUser(mappedUser);
          } catch (error) {
            // Token inválido o expirado, limpiar storage
            console.warn('Token inválido o expirado:', error);
            authService.logout();
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error al inicializar autenticación:', error);
        setError('Error al inicializar la sesión');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Función para mapear roles de BD a frontend
  const mapBackendRoleToFrontend = (backendRole: string): UserRole => {
    switch (backendRole) {
      case 'administrador':
        return 'admin';
      case 'admin':
        return 'admin';
      case 'editor':
        return 'editor';
      default:
        return 'editor'; // Por defecto, asignar rol de editor
    }
  };

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.login(credentials);
      // Mapear rol de BD a tipo del frontend
      const mappedUser = {
        ...response.user,
        role: mapBackendRoleToFrontend(response.user.role)
      };
      setUser(mappedUser);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error en el login';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setError(null);
  };

  const value: AuthContextType = {
    user,
    permissions,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading,
    error,
    hasPermission
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};