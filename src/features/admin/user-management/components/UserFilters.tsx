import React, { useState, useEffect } from 'react';
import type { UserFilters } from '../types/userTypes';

interface UserFiltersProps {
  onFiltersChange: (filters: UserFilters) => void;
  loading?: boolean;
}

const UserFiltersComponent: React.FC<UserFiltersProps> = ({
  onFiltersChange,
  loading = false
}) => {
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    role: undefined,
    active: undefined,
    sortBy: 'created_at',
    sortOrder: 'desc',
    page: 1,
    limit: 10
  });

  const [searchTimeout, setSearchTimeout] = useState<number | null>(null);

  useEffect(() => {
    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout for search
    const timeout = window.setTimeout(() => {
      onFiltersChange(filters);
    }, 500);

    setSearchTimeout(timeout);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search]);

  useEffect(() => {
    // For non-search filters, apply immediately
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    onFiltersChange(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.role, filters.active, filters.sortBy, filters.sortOrder, filters.page, filters.limit]);

  const handleFilterChange = (key: keyof UserFilters, value: string | number | boolean | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      ...(key !== 'page' && { page: 1 }) // Reset page when other filters change
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      role: undefined,
      active: undefined,
      sortBy: 'created_at',
      sortOrder: 'desc',
      page: 1,
      limit: 10
    });
  };

  return (
    <div className="bg-bg-100 p-4 rounded-lg shadow-sm border border-bg-300 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-white mb-1">
            Buscar
          </label>
          <input
            type="text"
            id="search"
            placeholder="Nombre o email..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full px-3 py-2 bg-bg-400 placeholder:text-white/60 text-white border border-bg-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>

        {/* Role Filter */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-white mb-1">
            Rol
          </label>
          <select
            id="role"
            value={filters.role || ''}
            onChange={(e) => handleFilterChange('role', e.target.value || undefined)}
            className="w-full px-3 py-2 text-white bg-bg-400 border border-bg-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            <option value="">Todos los roles</option>
            <option value="admin">
              Administrador
            </option>
            <option value="editor">
              Editor
            </option>
          </select>
        </div>

        {/* Active Filter */}
        <div>
          <label htmlFor="active" className="block text-sm font-medium text-white mb-1">
            Estado
          </label>
          <select
            id="active"
            value={filters.active === undefined ? '' : filters.active.toString()}
            onChange={(e) => handleFilterChange('active', e.target.value === '' ? undefined : e.target.value === 'true')}
            className="w-full px-3 py-2 text-white bg-bg-400 border border-bg-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            <option value="">Todos los estados</option>
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </select>
        </div>

        {/* Sort */}
        <div>
          <label htmlFor="sort" className="block text-sm font-medium text-white mb-1">
            Ordenar por
          </label>
          <div className="flex space-x-2">
            <select
              id="sort"
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="flex-1 px-3 text-white bg-bg-400 py-2 border border-bg-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="name">Nombre</option>
              <option value="email">Email</option>
              <option value="created_at">Fecha de creación</option>
              <option value="updated_at">Última actualización</option>
            </select>
            
            <select
              value={filters.sortOrder}
              onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
              className="px-3 py-2 text-white bg-bg-400 border  border-bg-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="asc">Ascendente</option>
              <option value="desc">Descendente</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="limit" className="text-sm font-medium text-white">
            Mostrar:
          </label>
          <select
            id="limit"
            value={filters.limit}
            onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
            className="px-3 py-1 text-white bg-bg-400 border border-bg-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span className="text-sm text-white">usuarios por página</span>
        </div>

        <button
          type="button"
          onClick={handleClearFilters}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          disabled={loading}
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  );
};

export default UserFiltersComponent;