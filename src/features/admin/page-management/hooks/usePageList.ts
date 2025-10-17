import { useState, useEffect, useCallback } from "react";
import type { PageListItem } from "../types/pageTypes";
import { PageService } from "../services/pageService";

export const usePageList = () => {
  const [pageItems, setPageItems] = useState<PageListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPageItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const items = await PageService.getPageListItems();
      setPageItems(items);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al cargar la lista de páginas"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPageItems();
  }, [loadPageItems]);

  // Filtrar páginas localmente
  const filterPageItems = useCallback((
    filters: {
      search?: string;
      status?: "all" | "published" | "draft";
      sortBy?: "title" | "updated" | "created";
      sortOrder?: "asc" | "desc";
    }
  ): PageListItem[] => {
    let filtered = [...pageItems];

    // Filtrar por búsqueda
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (page) =>
          page.title.toLowerCase().includes(searchLower) ||
          page.slug.toLowerCase().includes(searchLower)
      );
    }

    // Filtrar por estado de publicación
    if (filters.status && filters.status !== "all") {
      const isPublished = filters.status === "published";
      filtered = filtered.filter((page) => page.isPublished === isPublished);
    }

    // Ordenar
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let comparison = 0;
        switch (filters.sortBy) {
          case "title":
            comparison = a.title.localeCompare(b.title);
            break;
          case "updated":
            comparison =
              new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
            break;
          case "created":
            comparison =
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            break;
        }
        return filters.sortOrder === "desc" ? -comparison : comparison;
      });
    }

    return filtered;
  }, [pageItems]);

  // Método para eliminar una página (actualiza el estado local)
  const removePageItem = useCallback((id: string) => {
    setPageItems((prev) => prev.filter((page) => page.id !== id));
  }, []);

  // Método para refrescar la lista después de cambios
  const refreshPageItems = useCallback(() => {
    loadPageItems();
  }, [loadPageItems]);

  return {
    pageItems,
    loading,
    error,
    filterPageItems,
    removePageItem,
    refreshPageItems,
  };
};
