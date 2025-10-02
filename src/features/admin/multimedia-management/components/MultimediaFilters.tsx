import React, { useState, useEffect } from 'react';
import type { MultimediaFilters, MultimediaCategory, SortField, SortOrder } from '../types/multimediaTypes';

interface MultimediaFiltersProps {
  onFiltersChange: (filters: MultimediaFilters) => void;
  availableTags: string[];
  loading?: boolean;
}

const MultimediaFiltersComponent: React.FC<MultimediaFiltersProps> = ({
  onFiltersChange,
  availableTags,
  loading = false
}) => {
  const [filters, setFilters] = useState<MultimediaFilters>({
    search: '',
    category: undefined,
    tags: [],
    sortField: 'created_at',
    sortOrder: 'desc',
    page: 1,
    limit: 12
  });

  const [searchTimeout, setSearchTimeout] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

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
  }, [filters.category, filters.tags, filters.sortField, filters.sortOrder]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...filters, search: e.target.value, page: 1 };
    setFilters(newFilters);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value as MultimediaCategory | '';
    const newFilters = { 
      ...filters, 
      category: category === '' ? undefined : category,
      page: 1 
    };
    setFilters(newFilters);
  };

  const handleSortFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sortField = e.target.value as SortField;
    const newFilters = { ...filters, sortField, page: 1 };
    setFilters(newFilters);
  };

  const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sortOrder = e.target.value as SortOrder;
    const newFilters = { ...filters, sortOrder, page: 1 };
    setFilters(newFilters);
  };

  const handleTagToggle = (tag: string) => {
    const newSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    
    setSelectedTags(newSelectedTags);
    const newFilters = { ...filters, tags: newSelectedTags, page: 1 };
    setFilters(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: MultimediaFilters = {
      search: '',
      category: undefined,
      tags: [],
      sortField: 'created_at',
      sortOrder: 'desc',
      page: 1,
      limit: 12
    };
    setFilters(clearedFilters);
    setSelectedTags([]);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = filters.search || filters.category || selectedTags.length > 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
            disabled={loading}
          >
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {/* Buscador */}
        <div className="lg:col-span-2">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Buscar archivos
          </label>
          <input
            type="text"
            id="search"
            value={filters.search || ''}
            onChange={handleSearchChange}
            placeholder="Nombre de archivo, descripción..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          />
        </div>

        {/* Categoría */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Categoría
          </label>
          <select
            id="category"
            value={filters.category || ''}
            onChange={handleCategoryChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          >
            <option value="">Todas las categorías</option>
            <option value="image">Imágenes</option>
            <option value="video">Videos</option>
            <option value="svg">SVG</option>
            <option value="document">Documentos</option>
          </select>
        </div>

        {/* Campo de ordenamiento */}
        <div>
          <label htmlFor="sortField" className="block text-sm font-medium text-gray-700 mb-1">
            Ordenar por
          </label>
          <select
            id="sortField"
            value={filters.sortField || 'created_at'}
            onChange={handleSortFieldChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          >
            <option value="filename">Nombre A-Z</option>
            <option value="created_at">Fecha de creación</option>
            <option value="size">Tamaño</option>
            <option value="category">Categoría</option>
          </select>
        </div>

        {/* Orden */}
        <div>
          <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-1">
            Orden
          </label>
          <select
            id="sortOrder"
            value={filters.sortOrder || 'desc'}
            onChange={handleSortOrderChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          >
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
          </select>
        </div>
      </div>

      {/* Etiquetas */}
      {availableTags.length > 0 && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Etiquetas
          </label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map(tag => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-blue-100 text-blue-800 border-2 border-blue-200'
                    : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                }`}
                disabled={loading}
              >
                {tag}
                {selectedTags.includes(tag) && (
                  <span className="ml-1">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultimediaFiltersComponent;