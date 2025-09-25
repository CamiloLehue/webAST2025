import React, { useState, useMemo } from "react";
import { useBlogManagement } from "../../admin/blog-management/hooks/useBlogManagement";
import { Link } from "react-router-dom";
import { FiCalendar, FiUser, FiArrowRight, FiSearch, FiFilter, FiX } from "react-icons/fi";
import NewsHeroSection from "../../../components/hero/NewsHeroSection";

interface BlogFilters {
  search: string;
  category: string;
  tag: string;
  dateRange: string;
  sortBy: 'date' | 'title';
  sortOrder: 'desc' | 'asc';
}

const BlogPage: React.FC = () => {
  const { blogPosts, loading, error } = useBlogManagement();
  
  const [filters, setFilters] = useState<BlogFilters>({
    search: '',
    category: '',
    tag: '',
    dateRange: '',
    sortBy: 'date',
    sortOrder: 'desc'
  });

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const publishedPosts = useMemo(() => {
    let filtered = (blogPosts || []).filter((post) => post.isPublished);

    // Filtro por búsqueda
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm) ||
          post.excerpt.toLowerCase().includes(searchTerm) ||
          post.author.toLowerCase().includes(searchTerm)
      );
    }

    // Filtro por categoría
    if (filters.category) {
      filtered = filtered.filter((post) => post.category === filters.category);
    }

    // Filtro por etiqueta
    if (filters.tag) {
      filtered = filtered.filter((post) => 
        post.tags.some(tag => tag.toLowerCase().includes(filters.tag.toLowerCase()))
      );
    }

    // Filtro por rango de fecha
    if (filters.dateRange) {
      const now = new Date();
      const startDate = new Date();
      
      switch (filters.dateRange) {
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          startDate.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      if (filters.dateRange !== 'all') {
        filtered = filtered.filter((post) => {
          const postDate = new Date(post.publishedAt || post.createdAt);
          return postDate >= startDate;
        });
      }
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      let comparison = 0;
      
      if (filters.sortBy === 'date') {
        const dateA = new Date(a.publishedAt || a.createdAt).getTime();
        const dateB = new Date(b.publishedAt || b.createdAt).getTime();
        comparison = dateB - dateA;
      } else if (filters.sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      }
      
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [blogPosts, filters]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Obtener listas para los filtros
  const categories = useMemo(() => [
    ...new Set(blogPosts?.filter(p => p.isPublished).map((post) => post.category))
  ].filter(Boolean), [blogPosts]);

  const allTags = useMemo(() => [
    ...new Set(blogPosts?.filter(p => p.isPublished).flatMap((post) => post.tags))
  ].filter(Boolean), [blogPosts]);

  // Función para limpiar filtros
  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      tag: '',
      dateRange: '',
      sortBy: 'date',
      sortOrder: 'desc'
    });
  };

  // Contar filtros activos
  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => 
    key !== 'sortBy' && key !== 'sortOrder' && value !== ''
  ).length;

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-bg-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-bg-300 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-bg-100 rounded-lg p-6">
                  <div className="h-48 bg-bg-300 rounded mb-4"></div>
                  <div className="h-4 bg-bg-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-bg-300 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-bg-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-red-600">
              <h3 className="text-lg font-medium">
                Error al cargar las noticias
              </h3>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen ">
      <NewsHeroSection posts={publishedPosts} />
      <div className="bg-white-100 ">
        <div className="max-w-7xl mx-auto px-4  py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-bg-100 ">
              Últimas Noticias
            </h1>
            <p className="text-base text-bg-200">
              Mantente al día con las últimas noticias y artículos
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Botón para mostrar filtros en móviles */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center gap-2 bg-primary-100 text-white px-4 py-2 rounded-lg hover:bg-primary-200 transition-colors"
          >
            <FiFilter className="h-4 w-4" />
            Filtros {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </button>
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          <div className="lg:col-span-3">
            {/* Resultados y ordenamiento */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <p className="text-bg-200 mb-2 sm:mb-0">
                {publishedPosts.length} {publishedPosts.length === 1 ? 'artículo encontrado' : 'artículos encontrados'}
              </p>
              <div className="flex items-center gap-2">
                <label className="text-sm text-bg-200">Ordenar por:</label>
                <select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-');
                    setFilters(prev => ({ ...prev, sortBy: sortBy as 'date' | 'title', sortOrder: sortOrder as 'desc' | 'asc' }));
                  }}
                  className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-primary-100"
                >
                  <option value="date-desc">Más reciente</option>
                  <option value="date-asc">Más antiguo</option>
                  <option value="title-asc">Título A-Z</option>
                  <option value="title-desc">Título Z-A</option>
                </select>
              </div>
            </div>

            {/* Filtros activos */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-sm text-bg-200">Filtros activos:</span>
                {filters.search && (
                  <span className="inline-flex items-center gap-1 bg-primary-100 text-white text-xs px-2 py-1 rounded">
                    Búsqueda: {filters.search}
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                      className="hover:text-gray-200"
                    >
                      <FiX className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {filters.category && (
                  <span className="inline-flex items-center gap-1 bg-primary-100 text-white text-xs px-2 py-1 rounded">
                    Categoría: {filters.category}
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, category: '' }))}
                      className="hover:text-gray-200"
                    >
                      <FiX className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {filters.tag && (
                  <span className="inline-flex items-center gap-1 bg-primary-100 text-white text-xs px-2 py-1 rounded">
                    Etiqueta: {filters.tag}
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, tag: '' }))}
                      className="hover:text-gray-200"
                    >
                      <FiX className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {filters.dateRange && (
                  <span className="inline-flex items-center gap-1 bg-primary-100 text-white text-xs px-2 py-1 rounded">
                    Período: {filters.dateRange === 'week' ? 'Última semana' : 
                              filters.dateRange === 'month' ? 'Último mes' :
                              filters.dateRange === 'quarter' ? 'Últimos 3 meses' :
                              'Último año'}
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, dateRange: '' }))}
                      className="hover:text-gray-200"
                    >
                      <FiX className="h-3 w-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="text-xs text-red-600 hover:text-red-800 underline"
                >
                  Limpiar todos
                </button>
              </div>
            )}

            {publishedPosts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h2 className="text-2xl font-bold text-bg-100 mb-4">
                  {activeFiltersCount > 0 ? 'No se encontraron artículos' : 'No hay posts publicados'}
                </h2>
                <p className="text-bg-200">
                  {activeFiltersCount > 0 
                    ? 'Intenta ajustar los filtros para ver más resultados.'
                    : '¡Mantente al pendiente para ver nuestros próximos artículos!'
                  }
                </p>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 text-primary-100 hover:text-primary-200 underline"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {publishedPosts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-2xl shadow-md shadow-bg-300/10  overflow-hidden"
                  >
                    {post.featuredImage && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-6 ">
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap justify-between gap-2 mb-4">
                          <div className="flex flex-wrap gap-2">
                            {post.tags.slice(0, 3).map((tag, index) => (
                              <button
                                key={index}
                                onClick={() => setFilters(prev => ({ ...prev, tag }))}
                                className="inline-block px-2 py-1 text-xs bg-white-100 text-bg-300 rounded hover:bg-primary-100 hover:text-white transition-colors cursor-pointer"
                              >
                                #{tag}
                              </button>
                            ))}
                            {post.tags.length > 3 && (
                              <span className="text-xs text-bg-200">+{post.tags.length - 3} más</span>
                            )}
                          </div>
                          {post.category && (
                            <button
                              onClick={() => setFilters(prev => ({ ...prev, category: post.category }))}
                              className="px-2 py-1 bg-white-100 text-primary-100 rounded text-xs font-medium hover:bg-primary-100 hover:text-white transition-colors cursor-pointer"
                            >
                              {post.category}
                            </button>
                          )}
                        </div>
                      )}
                      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                        <div className="flex items-center justify-center text-nowrap">
                          <FiCalendar className="mr-1 h-4 w-4" />
                          {formatDate(post.publishedAt || post.createdAt)}
                        </div>
                        <div className="flex items-center">
                          <FiUser className="mr-1 h-4 w-4" />
                          {post.author}
                        </div>
                      </div>

                      <h2 className="text-2xl font-bold text-bg-100 mb-3">
                        <Link
                          to={`/noticias/${post.slug}`}
                          className="hover:text-primary-100 transition-colors"
                        >
                          {post.title}
                        </Link>
                      </h2>

                      <p className="text-bg-200 mb-4 line-clamp-3 min-h-16">
                        {post.excerpt.slice(0, 160)}...
                      </p>

                      <div className="flex justify-end items-end">
                        <Link
                          to={`/noticias/${post.slug}`}
                          className="inline-flex items-center text-primary-100 hover:text-white hover:bg-primary-100 transition-colors duration-300 font-medium  px-4 rounded py-1"
                        >
                          Leer más
                          <FiArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar con filtros */}
          <div className={`mt-12 lg:mt-0 ${showMobileFilters || 'hidden lg:block'}`}>
            <div className="space-y-6">
              {/* Búsqueda */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-bg-100 mb-4 flex items-center gap-2">
                  <FiSearch className="h-5 w-5" />
                  Buscar
                </h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar artículos..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-100"
                  />
                  <FiSearch className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Filtro por categoría */}
              {categories.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-bg-100 mb-4">
                    Categorías
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, category: '' }))}
                      className={`block w-full text-left px-3 py-2 rounded transition-colors ${
                        filters.category === '' 
                          ? 'bg-primary-100 text-white' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      Todas las categorías
                    </button>
                    {categories.map((category) => {
                      const count = (blogPosts || []).filter(
                        (post) => post.isPublished && post.category === category
                      ).length;
                      return (
                        <button
                          key={category}
                          onClick={() => setFilters(prev => ({ ...prev, category }))}
                          className={`flex items-center justify-between w-full text-left px-3 py-2 rounded transition-colors ${
                            filters.category === category 
                              ? 'bg-primary-100 text-white' 
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          <span className="text-bg-300">{category}</span>
                          <span className="text-gray-500 text-sm">
                            ({count})
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Filtro por etiquetas */}
              {allTags.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-bg-100 mb-4">
                    Etiquetas populares
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {allTags.slice(0, 12).map((tag, index) => (
                      <button
                        key={index}
                        onClick={() => setFilters(prev => ({ ...prev, tag }))}
                        className={`px-3 py-1 text-sm rounded-full transition-colors ${
                          filters.tag === tag
                            ? 'bg-primary-100 text-white'
                            : 'bg-gray-100 text-bg-300 hover:bg-gray-200'
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Filtro por fecha */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-bg-100 mb-4">
                  Filtrar por fecha
                </h3>
                <div className="space-y-2">
                  {[
                    { value: '', label: 'Todos los períodos' },
                    { value: 'week', label: 'Última semana' },
                    { value: 'month', label: 'Último mes' },
                    { value: 'quarter', label: 'Últimos 3 meses' },
                    { value: 'year', label: 'Último año' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFilters(prev => ({ ...prev, dateRange: option.value }))}
                      className={`block w-full text-left px-3 py-2 rounded transition-colors ${
                        filters.dateRange === option.value 
                          ? 'bg-primary-100 text-white' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Posts recientes - solo si no hay filtros activos */}
              {activeFiltersCount === 0 && publishedPosts.length > 3 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-bg-100 mb-4">
                    Posts Recientes
                  </h3>
                  <div className="space-y-4">
                    {publishedPosts.slice(0, 3).map((post) => (
                      <div key={post.id}>
                        <Link
                          to={`/noticias/${post.slug}`}
                          className="block hover:text-accent-100 transition-colors"
                        >
                          <h4 className="font-medium text-bg-100 line-clamp-2 mb-1">
                            {post.title}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {formatDate(post.publishedAt || post.createdAt)}
                          </p>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
