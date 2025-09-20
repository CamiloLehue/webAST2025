import type { BlogPost, BlogCategory } from "../types/blogTypes";
// const API_URL = import.meta.env.VITE_API_URL;

export class BlogService {
  private static POSTS_STORAGE_KEY = "ast_blog_posts";
  private static CATEGORIES_STORAGE_KEY = "ast_blog_categories";

  // Blog Posts Methods
  static getBlogPosts(): BlogPost[] {
    try {
      const stored = localStorage.getItem(this.POSTS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      return this.getInitialBlogPosts();
    } catch (error) {
      console.error("Error loading blog posts:", error);
      return this.getInitialBlogPosts();
    }
  }

  // static async getBlogPosts(): Promise<BlogPost[]> {
  // try {
  //   if (!API_URL) throw new Error("API_URL not defined");

  //   const response = await fetch(`${API_URL}/posts`);
  //   if (!response.ok) {
  //     throw new Error("Failed to fetch blog posts from API");
  //   }

  //   const menu: BlogPost[] = await response.json();
  //   return menu;
  // } catch (error) {
  //   console.warn("API error, loading fallback JSON", error);
  // }
  // try {
  //   const stored = localStorage.getItem(this.POSTS_STORAGE_KEY);
  //   if (stored) {
  //     return JSON.parse(stored);
  //   }
  //   return this.getInitialBlogPosts();
  // } catch (error) {
  //   console.error("Error loading blog posts:", error);
  //   return this.getInitialBlogPosts();
  // }
  // return this.getInitialBlogPosts();
  // }

  static saveBlogPosts(posts: BlogPost[]): void {
    try {
      localStorage.setItem(this.POSTS_STORAGE_KEY, JSON.stringify(posts));
    } catch (error) {
      console.error("Error saving blog posts:", error);
      throw new Error("Error al guardar los posts del blog");
    }
  }

  static createBlogPost(
    postData: Omit<BlogPost, "id" | "createdAt" | "updatedAt">
  ): BlogPost {
    const now = new Date().toISOString();
    const newPost: BlogPost = {
      ...postData,
      id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      updatedAt: now,
      publishedAt: postData.isPublished ? now : undefined,
    };

    const posts = this.getBlogPosts();
    const updatedPosts = [...posts, newPost];
    this.saveBlogPosts(updatedPosts);

    return newPost;
  }

  static updateBlogPost(updatedPost: BlogPost): void {
    const posts = this.getBlogPosts();
    const updatedPosts = posts.map((post) =>
      post.id === updatedPost.id
        ? {
            ...updatedPost,
            updatedAt: new Date().toISOString(),
            publishedAt:
              updatedPost.isPublished && !post.isPublished
                ? new Date().toISOString()
                : updatedPost.publishedAt,
          }
        : post
    );
    this.saveBlogPosts(updatedPosts);
  }

  static deleteBlogPost(id: string): void {
    const posts = this.getBlogPosts();
    const updatedPosts = posts.filter((post) => post.id !== id);
    this.saveBlogPosts(updatedPosts);
  }

  static getBlogPostBySlug(slug: string): BlogPost | undefined {
    const posts = this.getBlogPosts();
    return posts.find((post) => post.slug === slug);
  }

  static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }

  static validateSlug(slug: string, excludeId?: string): boolean {
    const posts = this.getBlogPosts();
    return !posts.some((post) => post.slug === slug && post.id !== excludeId);
  }

  // Blog Categories Methods
  static getBlogCategories(): BlogCategory[] {
    try {
      const stored = localStorage.getItem(this.CATEGORIES_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      return this.getInitialCategories();
    } catch (error) {
      console.error("Error loading blog categories:", error);
      return this.getInitialCategories();
    }
  }

  static saveBlogCategories(categories: BlogCategory[]): void {
    try {
      localStorage.setItem(
        this.CATEGORIES_STORAGE_KEY,
        JSON.stringify(categories)
      );
    } catch (error) {
      console.error("Error saving blog categories:", error);
      throw new Error("Error al guardar las categorías del blog");
    }
  }

  static createBlogCategory(
    categoryData: Omit<BlogCategory, "id">
  ): BlogCategory {
    const newCategory: BlogCategory = {
      ...categoryData,
      id: `category-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      slug: this.generateSlug(categoryData.name),
    };

    const categories = this.getBlogCategories();
    const updatedCategories = [...categories, newCategory];
    this.saveBlogCategories(updatedCategories);

    return newCategory;
  }

  static updateBlogCategory(updatedCategory: BlogCategory): void {
    const categories = this.getBlogCategories();
    const updatedCategories = categories.map((category) =>
      category.id === updatedCategory.id ? updatedCategory : category
    );
    this.saveBlogCategories(updatedCategories);
  }

  static deleteBlogCategory(id: string): void {
    const categories = this.getBlogCategories();
    const updatedCategories = categories.filter(
      (category) => category.id !== id
    );
    this.saveBlogCategories(updatedCategories);
  }

  // Utility Methods
  static getPostsByCategory(categorySlug: string): BlogPost[] {
    const posts = this.getBlogPosts();
    return posts.filter(
      (post) =>
        post.category.toLowerCase().replace(/\s+/g, "-") === categorySlug
    );
  }

  static getPopularTags(limit = 10): Array<{ tag: string; count: number }> {
    const posts = this.getBlogPosts();
    const tagCounts: Record<string, number> = {};

    posts.forEach((post) => {
      post.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    return Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  static searchPosts(query: string): BlogPost[] {
    const posts = this.getBlogPosts();
    const searchTerm = query.toLowerCase();

    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
    );
  }

  // Initial Data
  private static getInitialBlogPosts(): BlogPost[] {
    return [
      {
        id: "post-1",
        title: "Bienvenidos a nuestro blog",
        slug: "bienvenidos-a-nuestro-blog",
        excerpt:
          "Este es el primer post de nuestro blog corporativo donde compartiremos noticias y novedades.",
        content: `# Bienvenidos a nuestro blog

Este es el primer post de nuestro blog corporativo donde compartiremos noticias, novedades y artículos de interés sobre nuestra industria.

## ¿Qué encontrarás aquí?

- Noticias de la empresa
- Novedades del sector
- Tutoriales y guías
- Casos de éxito

Esperamos que este contenido sea de tu interés y te invitamos a suscribirte para recibir las últimas actualizaciones.`,
        featuredImage:
          "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop",
        category: "Noticias",
        tags: ["bienvenida", "blog", "empresa"],
        isPublished: true,
        publishedAt: "2025-09-15T10:00:00Z",
        createdAt: "2025-09-15T10:00:00Z",
        updatedAt: "2025-09-15T10:00:00Z",
        author: "Admin",
      },
    ];
  }

  private static getInitialCategories(): BlogCategory[] {
    return [
      {
        id: "cat-1",
        name: "Noticias",
        slug: "noticias",
        description: "Últimas noticias de la empresa",
        color: "#3B82F6",
      },
      {
        id: "cat-2",
        name: "Tecnología",
        slug: "tecnologia",
        description: "Artículos sobre tecnología e innovación",
        color: "#10B981",
      },
      {
        id: "cat-3",
        name: "Casos de Éxito",
        slug: "casos-de-exito",
        description: "Historias de éxito de nuestros clientes",
        color: "#F59E0B",
      },
    ];
  }
}
