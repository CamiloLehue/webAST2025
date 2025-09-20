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

export interface MenuFormData {
  title: string;
  path: string;
  external: boolean;
  disabled: boolean;
  order: number;
  contentType: 'page' | 'blog' | 'external' | 'custom';
}