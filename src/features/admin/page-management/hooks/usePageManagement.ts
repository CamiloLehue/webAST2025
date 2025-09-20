import { useState, useEffect } from "react";
import type {
  CustomPage,
  ContentSection,
  PageTemplate,
  PageFilters,
  PageStats,
} from "../types/pageTypes";
import { PageService } from "../services/pageService";

export const usePageManagement = () => {
  const [customPages, setCustomPages] = useState<CustomPage[]>([]);
  const [pageTemplates, setPageTemplates] = useState<PageTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const pages = await PageService.getCustomPages();
      const templates = await PageService.getPageTemplates();
      setCustomPages(pages);
      setPageTemplates(templates);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al cargar los datos de páginas"
      );
    } finally {
      setLoading(false);
    }
  };

  // Pages CRUD Methods
  const createCustomPage = async (
    pageData: Omit<CustomPage, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      setError(null);
      const newPage = await PageService.createCustomPage(pageData);
      setCustomPages((prev) => [...prev, newPage]);
      return newPage;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear la página");
      throw err;
    }
  };

  const updateCustomPage = async (updatedPage: CustomPage) => {
    try {
      setError(null);
      await PageService.updateCustomPage(updatedPage);
      setCustomPages((prev) =>
        prev.map((page) => (page.id === updatedPage.id ? updatedPage : page))
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al actualizar la página"
      );
      throw err;
    }
  };

  const deleteCustomPage = async (id: string) => {
    try {
      setError(null);
      await PageService.deleteCustomPage(id);
      setCustomPages((prev) => prev.filter((page) => page.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al eliminar la página"
      );
      throw err;
    }
  };

  const getCustomPageById = (id: string): CustomPage | undefined => {
    return customPages.find((page) => page.id === id);
  };

  const getCustomPageBySlug = (slug: string): CustomPage | undefined => {
    return customPages.find((page) => page.slug === slug);
  };

  // Content Sections Management
  const addSection = async (
    pageId: string,
    section: Omit<ContentSection, "id" | "order">
  ) => {
    try {
      setError(null);
      const updatedPage = await PageService.addSection(pageId, section);
      setCustomPages((prev) =>
        prev.map((page) => (page.id === pageId ? updatedPage : page))
      );
      return updatedPage;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al agregar la sección"
      );
      throw err;
    }
  };

  const updateSection = async (
    pageId: string,
    sectionId: string,
    sectionData: Partial<ContentSection>
  ) => {
    try {
      setError(null);
      const updatedPage = await PageService.updateSection(
        pageId,
        sectionId,
        sectionData
      );
      setCustomPages((prev) =>
        prev.map((page) => (page.id === pageId ? updatedPage : page))
      );
      return updatedPage;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al actualizar la sección"
      );
      throw err;
    }
  };

  const deleteSection = async (pageId: string, sectionId: string) => {
    try {
      setError(null);
      const updatedPage = await PageService.deleteSection(pageId, sectionId);
      setCustomPages((prev) =>
        prev.map((page) => (page.id === pageId ? updatedPage : page))
      );
      return updatedPage;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al eliminar la sección"
      );
      throw err;
    }
  };

  const reorderSections = async (pageId: string, sectionIds: string[]) => {
    try {
      setError(null);
      const updatedPage = await PageService.reorderSections(pageId, sectionIds);
      setCustomPages((prev) =>
        prev.map((page) => (page.id === pageId ? updatedPage : page))
      );
      return updatedPage;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al reordenar las secciones"
      );
      throw err;
    }
  };

  // Template Management
  const createPageFromTemplate = async (
    templateId: string,
    pageData: { title: string; slug: string }
  ) => {
    try {
      setError(null);
      const newPage = await PageService.createPageFromTemplate(
        templateId,
        pageData
      );
      setCustomPages((prev) => [...prev, newPage]);
      return newPage;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al crear página desde template"
      );
      throw err;
    }
  };

  // Utility Methods
  const filterPages = async (filters: PageFilters): Promise<CustomPage[]> => {
    try {
      return await PageService.getFilteredPages(filters);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al filtrar las páginas"
      );
      return customPages;
    }
  };

  const getPublishedPages = async (): Promise<CustomPage[]> => {
    try {
      return await PageService.getPublishedPages();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al cargar páginas publicadas"
      );
      return customPages.filter((page) => page.isPublished);
    }
  };

  const searchPages = async (query: string): Promise<CustomPage[]> => {
    try {
      return await PageService.searchPages(query);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al buscar páginas"
      );
      return [];
    }
  };

  const getPageStats = async (): Promise<PageStats> => {
    try {
      return await PageService.getPageStats();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al cargar estadísticas de páginas"
      );
      return {
        totalPages: customPages.length,
        publishedPages: customPages.filter((page) => page.isPublished).length,
        draftPages: customPages.filter((page) => !page.isPublished).length,
      };
    }
  };

  const validateSlug = async (
    slug: string,
    excludeId?: string
  ): Promise<boolean> => {
    try {
      return await PageService.validateSlug(slug, excludeId);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al validar el slug"
      );
      return false;
    }
  };

  const generateSlug = (title: string): string => {
    return PageService.generateSlug(title);
  };

  return {
    // Data
    customPages,
    pageTemplates,
    loading,
    error,

    // Pages CRUD Methods
    createCustomPage,
    updateCustomPage,
    deleteCustomPage,
    getCustomPageById,
    getCustomPageBySlug,

    // Content Sections Management
    addSection,
    updateSection,
    deleteSection,
    reorderSections,

    // Template Management
    createPageFromTemplate,

    // Utility Methods
    filterPages,
    getPublishedPages,
    searchPages,
    getPageStats,
    validateSlug,
    generateSlug,

    // Actions
    refresh: loadData,
  };
};