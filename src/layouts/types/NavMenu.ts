export interface NavMenuItem {
  title: string;
  path: string;
  submenu?: SubMenuItem[];
  external?: boolean;
  disabled?: boolean;
  target?: string;
  rel?: string;
  icon?: string;
  order?: number;
}

export interface SubMenuItem {
  title: string;
  path: string;
  external?: boolean;
  disabled?: boolean;
  target?: string;
  rel?: string;
  icon?: string;
  order?: number;
}
