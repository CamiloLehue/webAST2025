import type { BlogPost, BlogCategory } from "../types/blogTypes";
const API_URL = import.meta.env.VITE_API_URL;

export class BlogService {
  static async getBlogPosts(): Promise<BlogPost[]> {
    if (!API_URL) {
      throw new Error("API_URL not defined");
    }

    const response = await fetch(`${API_URL}/noticias`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch blog posts from API: ${response.status} ${response.statusText}`
      );
    }

    const posts: BlogPost[] = await response.json();
    return posts;
  }

  static async createBlogPost(
    postData: Omit<BlogPost, "id" | "createdAt" | "updatedAt">
  ): Promise<BlogPost> {
    if (!API_URL) {
      throw new Error("API_URL not defined");
    }

    const now = new Date().toISOString();
    const newPost: BlogPost = {
      ...postData,
      id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      updatedAt: now,
      publishedAt: postData.isPublished ? now : undefined,
    };

    const response = await fetch(`${API_URL}/noticias`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPost),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to create blog post via API: ${response.status} ${response.statusText}`
      );
    }

    const createdPost: BlogPost = await response.json();
    return createdPost;
  }

  static async updateBlogPost(updatedPost: BlogPost): Promise<void> {
    if (!API_URL) {
      throw new Error("API_URL not defined");
    }

    const postWithTimestamp = {
      ...updatedPost,
      updatedAt: new Date().toISOString(),
      publishedAt:
        updatedPost.isPublished && !updatedPost.publishedAt
          ? new Date().toISOString()
          : updatedPost.publishedAt,
    };

    const response = await fetch(`${API_URL}/noticias/${updatedPost.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postWithTimestamp),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to update blog post via API: ${response.status} ${response.statusText}`
      );
    }
  }

  static async deleteBlogPost(id: string): Promise<void> {
    if (!API_URL) {
      throw new Error("API_URL not defined");
    }

    const response = await fetch(`${API_URL}/noticias/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(
        `Failed to delete blog post via API: ${response.status} ${response.statusText}`
      );
    }
  }

  static async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const posts = await this.getBlogPosts();
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

  static async validateSlug(
    slug: string,
    excludeId?: string
  ): Promise<boolean> {
    const posts = await this.getBlogPosts();
    return !posts.some((post) => post.slug === slug && post.id !== excludeId);
  }

  // Blog Categories Methods (extracted from posts)
  static async getBlogCategories(): Promise<BlogCategory[]> {
    const posts = await this.getBlogPosts();

    // Extraer categorías únicas de las noticias
    const categoriesMap = new Map<string, BlogCategory>();

    posts.forEach((post) => {
      if (post.category && !categoriesMap.has(post.category)) {
        categoriesMap.set(post.category, {
          id: `category-${this.generateSlug(post.category)}`,
          name: post.category,
          slug: this.generateSlug(post.category),
          description: `Categoría: ${post.category}`,
          color: this.generateCategoryColor(post.category),
        });
      }
    });

    return Array.from(categoriesMap.values());
  }

  // Generar color basado en el nombre de la categoría
  private static generateCategoryColor(categoryName: string): string {
    const colors = [
      "#3B82F6", // blue
      "#10B981", // green
      "#F59E0B", // amber
      "#EF4444", // red
      "#8B5CF6", // violet
      "#F97316", // orange
      "#06B6D4", // cyan
      "#84CC16", // lime
      "#EC4899", // pink
      "#6B7280", // gray
    ];

    // Generar un índice basado en el hash del nombre
    let hash = 0;
    for (let i = 0; i < categoryName.length; i++) {
      hash = categoryName.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  }

  // Utility Methods
  static async getPostsByCategory(categorySlug: string): Promise<BlogPost[]> {
    const posts = await this.getBlogPosts();
    return posts.filter(
      (post) =>
        post.category.toLowerCase().replace(/\s+/g, "-") === categorySlug
    );
  }

  static async getPopularTags(
    limit = 10
  ): Promise<Array<{ tag: string; count: number }>> {
    const posts = await this.getBlogPosts();
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

  static async searchPosts(query: string): Promise<BlogPost[]> {
    const posts = await this.getBlogPosts();
    const searchTerm = query.toLowerCase();

    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
    );
  }
}
