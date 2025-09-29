export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  created_at?: string;
  updated_at?: string;
  last_login?: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  active?: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const UserRole = {
  ADMINISTRATOR: 'admin',
  EDITOR: 'editor'
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export const UserStatus = {
  ACTIVE: true,
  INACTIVE: false
} as const;

export type UserStatus = boolean;

export interface UserFilters {
  search?: string;
  role?: UserRole;
  active?: boolean;
  sortBy?: 'name' | 'email' | 'created_at' | 'updated_at';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  totalPages: number;
}

export interface UserPermissions {
  canCreateUsers: boolean;
  canEditUsers: boolean;
  canDeleteUsers: boolean;
  canViewUsers: boolean;
  canManageRoles: boolean;
  canAccessAdmin: boolean;
  canEditContent: boolean;
  canPublishContent: boolean;
  canDeleteContent: boolean;
}

export const getRolePermissions = (role: UserRole): UserPermissions => {
  switch (role) {
    case UserRole.ADMINISTRATOR:
      return {
        canCreateUsers: true,
        canEditUsers: true,
        canDeleteUsers: true,
        canViewUsers: true,
        canManageRoles: true,
        canAccessAdmin: true,
        canEditContent: true,
        canPublishContent: true,
        canDeleteContent: true,
      };
    case UserRole.EDITOR:
      return {
        canCreateUsers: false,
        canEditUsers: false,
        canDeleteUsers: false,
        canViewUsers: false,
        canManageRoles: false,
        canAccessAdmin: true,
        canEditContent: true,
        canPublishContent: true,
        canDeleteContent: false,
      };
    default:
      return {
        canCreateUsers: false,
        canEditUsers: false,
        canDeleteUsers: false,
        canViewUsers: false,
        canManageRoles: false,
        canAccessAdmin: false,
        canEditContent: false,
        canPublishContent: false,
        canDeleteContent: false,
      };
  }
};

export const getRoleDisplayName = (role: UserRole): string => {
  switch (role) {
    case UserRole.ADMINISTRATOR:
      return 'Administrador';
    case UserRole.EDITOR:
      return 'Editor';
    default:
      return 'Sin rol';
  }
};

export const getStatusDisplayName = (active: boolean): string => {
  return active ? 'Activo' : 'Inactivo';
};