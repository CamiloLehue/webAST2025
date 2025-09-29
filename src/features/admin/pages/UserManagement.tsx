import React, { useState, useEffect, useCallback } from 'react';
import type { User, UserFilters, CreateUserRequest, UpdateUserRequest } from '../user-management/types/userTypes';
import { useUserManagement } from '../user-management/hooks/useUserManagement';
import { UserTable, UserForm, Pagination } from '../user-management/components';
import UserFiltersComponent from '../user-management/components/UserFilters';

const UserManagement: React.FC = () => {
  const {
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
    toggleUserStatus,
    clearError
  } = useUserManagement();

  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    limit: 10,
    sortBy: 'created_at',
    sortOrder: 'desc'
  });

  // Fetch users on component mount and when filters change
  useEffect(() => {
    fetchUsers(filters);
  }, [fetchUsers, filters]);

  const handleFiltersChange = useCallback((newFilters: UserFilters) => {
    setFilters(newFilters);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  const handleCreateUser = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleFormSubmit = async (userData: CreateUserRequest | UpdateUserRequest) => {
    try {
      if (editingUser) {
        await updateUser(editingUser.id, userData as UpdateUserRequest);
      } else {
        await createUser(userData as CreateUserRequest);
      }
      setShowForm(false);
      setEditingUser(null);
      // Refresh the list
      fetchUsers(filters);
    } catch (err) {
      // Error is handled by the hook
      console.error('Error saving user:', err);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingUser(null);
    clearError();
  };

  const handleDeleteUser = async (user: User) => {
    if (window.confirm(`¿Está seguro de que desea eliminar al usuario "${user.name}"?`)) {
      try {
        await deleteUser(user.id);
        // Refresh the list
        fetchUsers(filters);
      } catch (err) {
        console.error('Error deleting user:', err);
      }
    }
  };

  const handleToggleStatus = async (user: User) => {
    try {
      await toggleUserStatus(user.id);
      // Refresh the list
      fetchUsers(filters);
    } catch (err) {
      console.error('Error toggling user status:', err);
    }
  };

  if (showForm) {
    return (
      <div className="container mx-auto px-4 py-8">
        <UserForm
          user={editingUser || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          loading={loading}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-600 mt-1">
            Administra los usuarios y sus roles en el sistema
          </p>
        </div>
        
        <button
          onClick={handleCreateUser}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          Crear Usuario
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={clearError}
              className="text-red-700 hover:text-red-900"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <UserFiltersComponent
        onFiltersChange={handleFiltersChange}
        loading={loading}
      />

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Usuarios ({total})
          </h2>
        </div>

        <UserTable
          users={users}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          onToggleStatus={handleToggleStatus}
          loading={loading}
        />

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default UserManagement;