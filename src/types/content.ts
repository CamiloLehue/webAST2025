export interface MenuItem {
  id: string;
  title: string;
  path: string;
  submenu?: MenuItem[];
  external: boolean;
  disabled: boolean;
  order: number;
  contentType?: 'page' | 'blog' | 'external' | 'custom';
  pageId?: string;
  icon?: string;
}

export interface PageContent {
  id: string;
  title: string;
  slug: string;
  content: ContentBlock[];
  metaTitle?: string;
  metaDescription?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  author: string;
}

export interface ContentBlock {
  id: string;
  type: 'hero' | 'text' | 'image' | 'gallery' | 'cards' | 'contact' | 'custom';
  data: Record<string, unknown>;
  order: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  author: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
}