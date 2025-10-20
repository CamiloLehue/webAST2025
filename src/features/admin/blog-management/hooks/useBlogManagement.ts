import { useState, useEffect, useCallback } from "react";
import type {
  BlogPost,
  BlogCategory,
  BlogFilters,
  BlogStats,
} from "../types/blogTypes";
import { BlogService } from "../services/blogService";
import { useToast } from "../../../../hooks/useToast";

export const useBlogManagement = () => {
  const { showToast } = useToast();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadDataSafe = async () => {
      try {
        setLoading(true);
        setError(null);
        // Usar skipCache en admin para obtener datos frescos siempre
        const posts = await BlogService.getBlogPosts(true);
        const cats = await BlogService.getBlogCategories();
        
        if (isMounted) {
          setBlogPosts(posts);
          setCategories(cats);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Error al cargar los datos del blog"
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDataSafe();

    return () => {
      isMounted = false;
    };
  }, []);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Siempre obtener datos frescos sin caché en el admin
      const posts = await BlogService.getBlogPosts(true);
      const cats = await BlogService.getBlogCategories();
      setBlogPosts(posts);
      setCategories(cats);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al cargar los datos del blog"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Blog Posts Methods
  const createBlogPost = async (
    postData: Omit<BlogPost, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      setError(null);
      const newPost = await BlogService.createBlogPost(postData);
      // Recargar todos los posts para asegurar orden correcto
      await loadData();
      showToast("Post creado exitosamente", "success");
      return newPost;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error al crear el post";
      setError(errorMsg);
      showToast(errorMsg, "error");
      throw err;
    }
  };

  const updateBlogPost = async (updatedPost: BlogPost) => {
    try {
      setError(null);
      await BlogService.updateBlogPost(updatedPost);
      // Recargar todos los posts para asegurar orden correcto
      await loadData();
      showToast("Post actualizado exitosamente", "success");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error al actualizar el post";
      setError(errorMsg);
      showToast(errorMsg, "error");
      throw err;
    }
  };

  const deleteBlogPost = async (id: string) => {
    try {
      setError(null);
      await BlogService.deleteBlogPost(id);
      // Recargar todos los posts para asegurar lista actualizada
      await loadData();
      showToast("Post eliminado exitosamente", "success");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error al eliminar el post";
      setError(errorMsg);
      showToast(errorMsg, "error");
      throw err;
    }
  };

  const getBlogPostBySlug = (slug: string): BlogPost | undefined => {
    return blogPosts.find((post) => post.slug === slug);
  };

  const getBlogPostById = (id: string): BlogPost | undefined => {
    return blogPosts.find((post) => post.id === id);
  };

  // Categories are now extracted from posts, no CRUD operations needed

  // Utility Methods
  const filterPosts = (filters: Partial<BlogFilters>): BlogPost[] => {
    let filteredPosts = [...blogPosts];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredPosts = filteredPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm) ||
          post.content.toLowerCase().includes(searchTerm) ||
          post.excerpt.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.status && filters.status !== "all") {
      filteredPosts = filteredPosts.filter(
        (post) =>
          (filters.status === "published" && post.isPublished) ||
          (filters.status === "draft" && !post.isPublished)
      );
    }

    if (filters.category) {
      filteredPosts = filteredPosts.filter(
        (post) => post.category === filters.category
      );
    }

    // Sorting
    if (filters.sortBy) {
      filteredPosts.sort((a, b) => {
        let comparison = 0;

        switch (filters.sortBy) {
          case "date":
            comparison =
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            break;
          case "title":
            comparison = a.title.localeCompare(b.title);
            break;
          case "author":
            comparison = a.author.localeCompare(b.author);
            break;
        }

        return filters.sortOrder === "desc" ? comparison : -comparison;
      });
    }

    return filteredPosts;
  };

  const getPublishedPosts = (): BlogPost[] => {
    return blogPosts
      .filter((post) => post.isPublished)
      .sort(
        (a, b) =>
          new Date(b.publishedAt || b.createdAt).getTime() -
          new Date(a.publishedAt || a.createdAt).getTime()
      );
  };

  const getPostsByCategory = async (
    categorySlug: string
  ): Promise<BlogPost[]> => {
    return await BlogService.getPostsByCategory(categorySlug);
  };

  const getPopularTags = async (limit = 10) => {
    return await BlogService.getPopularTags(limit);
  };

  const searchPosts = async (query: string): Promise<BlogPost[]> => {
    return await BlogService.searchPosts(query);
  };

  const getBlogStats = (): BlogStats => {
    const totalPosts = blogPosts.length;
    const publishedPosts = blogPosts.filter((post) => post.isPublished).length;
    const draftPosts = totalPosts - publishedPosts;
    const totalCategories = categories.length;

    return {
      totalPosts,
      publishedPosts,
      draftPosts,
      totalCategories,
    };
  };

  const validateSlug = async (
    slug: string,
    excludeId?: string
  ): Promise<boolean> => {
    return await BlogService.validateSlug(slug, excludeId);
  };

  const generateSlug = (title: string): string => {
    return BlogService.generateSlug(title);
  };

  return {
    // Data
    blogPosts,
    categories,
    loading,
    error,

    // Blog Posts Methods
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
    getBlogPostBySlug,
    getBlogPostById,

    // Categories are read-only (extracted from posts)

    // Utility Methods
    filterPosts,
    getPublishedPosts,
    getPostsByCategory,
    getPopularTags,
    searchPosts,
    getBlogStats,
    validateSlug,
    generateSlug,

    // Actions
    refresh: loadData,
  };
};
