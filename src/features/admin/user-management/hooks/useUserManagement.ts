import { useState, useCallback } from 'react';
import type { 
  User, 
  UserFilters, 
  UserListResponse,
  CreateUserRequest,
  UpdateUserRequest,
  ChangePasswordRequest
} from '../types/userTypes';
import { userService } from '../services/userService';

export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchUsers = useCallback(async (filters?: UserFilters) => {
    setLoading(true);
    setError(null);
    try {
      const response: UserListResponse = await userService.getUsers(filters);
      setUsers(response.users);
      setTotalPages(response.totalPages);
      setTotal(response.total);
      setCurrentPage(response.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = useCallback(async (userData: CreateUserRequest): Promise<User> => {
    setLoading(true);
    setError(null);
    try {
      const newUser = await userService.createUser(userData);
      setUsers(prevUsers => [newUser, ...prevUsers]);
      return newUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear usuario';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (id: string, userData: UpdateUserRequest): Promise<User> => {
    setLoading(true);
    setError(null);
    try {
      const updatedUser = await userService.updateUser(id, userData);
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === id ? updatedUser : user
        )
      );
      return updatedUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar usuario';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await userService.deleteUser(id);
      setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar usuario';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const changePassword = useCallback(async (id: string, passwordData: ChangePasswordRequest): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await userService.changePassword(id, passwordData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cambiar contraseña';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleUserStatus = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const updatedUser = await userService.toggleUserStatus(id);
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === id ? updatedUser : user
        )
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cambiar estado del usuario';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getCurrentUser = useCallback(async (): Promise<User> => {
    setLoading(true);
    setError(null);
    try {
      const user = await userService.getCurrentUser();
      return user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener usuario actual';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    users,
    loading,
    error,
    totalPages,
    total,
    currentPage,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    changePassword,
    toggleUserStatus,
    getCurrentUser,
    clearError
  };
};