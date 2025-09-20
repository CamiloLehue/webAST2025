import { useState, useEffect } from 'react';
import type { BlogPost, BlogCategory, BlogFilters, BlogStats } from '../types/blog.types';
import { BlogService } from '../services/blog.service';

export const useBlogManagement = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const posts = BlogService.getBlogPosts();
      const cats = BlogService.getBlogCategories();
      setBlogPosts(posts);
      setCategories(cats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los datos del blog');
    } finally {
      setLoading(false);
    }
  };

  // Blog Posts Methods
  const createBlogPost = async (postData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);
      const newPost = BlogService.createBlogPost(postData);
      setBlogPosts(prev => [...prev, newPost]);
      return newPost;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el post');
      throw err;
    }
  };

  const updateBlogPost = async (updatedPost: BlogPost) => {
    try {
      setError(null);
      BlogService.updateBlogPost(updatedPost);
      setBlogPosts(prev => prev.map(post => 
        post.id === updatedPost.id ? updatedPost : post
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el post');
      throw err;
    }
  };

  const deleteBlogPost = async (id: string) => {
    try {
      setError(null);
      BlogService.deleteBlogPost(id);
      setBlogPosts(prev => prev.filter(post => post.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el post');
      throw err;
    }
  };

  const getBlogPostBySlug = (slug: string): BlogPost | undefined => {
    return blogPosts.find(post => post.slug === slug);
  };

  const getBlogPostById = (id: string): BlogPost | undefined => {
    return blogPosts.find(post => post.id === id);
  };

  // Categories Methods
  const createBlogCategory = async (categoryData: Omit<BlogCategory, 'id'>) => {
    try {
      setError(null);
      const newCategory = BlogService.createBlogCategory(categoryData);
      setCategories(prev => [...prev, newCategory]);
      return newCategory;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la categoría');
      throw err;
    }
  };

  const updateBlogCategory = async (updatedCategory: BlogCategory) => {
    try {
      setError(null);
      BlogService.updateBlogCategory(updatedCategory);
      setCategories(prev => prev.map(category => 
        category.id === updatedCategory.id ? updatedCategory : category
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar la categoría');
      throw err;
    }
  };

  const deleteBlogCategory = async (id: string) => {
    try {
      setError(null);
      BlogService.deleteBlogCategory(id);
      setCategories(prev => prev.filter(category => category.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar la categoría');
      throw err;
    }
  };

  // Utility Methods
  const filterPosts = (filters: Partial<BlogFilters>): BlogPost[] => {
    let filteredPosts = [...blogPosts];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredPosts = filteredPosts.filter(post =>
        post.title.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.status && filters.status !== 'all') {
      filteredPosts = filteredPosts.filter(post =>
        (filters.status === 'published' && post.isPublished) ||
        (filters.status === 'draft' && !post.isPublished)
      );
    }

    if (filters.category) {
      filteredPosts = filteredPosts.filter(post =>
        post.category === filters.category
      );
    }

    // Sorting
    if (filters.sortBy) {
      filteredPosts.sort((a, b) => {
        let comparison = 0;
        
        switch (filters.sortBy) {
          case 'date':
            comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            break;
          case 'title':
            comparison = a.title.localeCompare(b.title);
            break;
          case 'author':
            comparison = a.author.localeCompare(b.author);
            break;
        }
        
        return filters.sortOrder === 'desc' ? comparison : -comparison;
      });
    }

    return filteredPosts;
  };

  const getPublishedPosts = (): BlogPost[] => {
    return blogPosts
      .filter(post => post.isPublished)
      .sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime());
  };

  const getPostsByCategory = (categorySlug: string): BlogPost[] => {
    return BlogService.getPostsByCategory(categorySlug);
  };

  const getPopularTags = (limit = 10) => {
    return BlogService.getPopularTags(limit);
  };

  const searchPosts = (query: string): BlogPost[] => {
    return BlogService.searchPosts(query);
  };

  const getBlogStats = (): BlogStats => {
    const totalPosts = blogPosts.length;
    const publishedPosts = blogPosts.filter(post => post.isPublished).length;
    const draftPosts = totalPosts - publishedPosts;
    const totalCategories = categories.length;

    return {
      totalPosts,
      publishedPosts,
      draftPosts,
      totalCategories
    };
  };

  const validateSlug = (slug: string, excludeId?: string): boolean => {
    return BlogService.validateSlug(slug, excludeId);
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
    
    // Categories Methods
    createBlogCategory,
    updateBlogCategory,
    deleteBlogCategory,
    
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
    refresh: loadData
  };
};