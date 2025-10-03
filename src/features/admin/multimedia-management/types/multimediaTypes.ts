export interface MultimediaFile {
  id: string;
  filename: string;
  original_name: string;
  file_path: string;
  url: string;
  category: MultimediaCategory;
  mime_type: string;
  size: number;
  width?: number;
  height?: number;
  duration?: number;
  tags: string[];
  description?: string;
  alt?: string;
  created_at: string;
  updated_at?: string;
}

export interface CreateMultimediaRequest {
  file: File;
  category: MultimediaCategory;
  tags?: string[];
  description?: string;
  alt?: string;
}

export interface UpdateMultimediaRequest {
  filename?: string;
  category?: MultimediaCategory;
  tags?: string[];
  description?: string;
  alt?: string;
}

export const MultimediaCategory = {
  IMAGE: 'image',
  VIDEO: 'video',
  SVG: 'svg',
  DOCUMENT: 'document'
} as const;

export type MultimediaCategory = typeof MultimediaCategory[keyof typeof MultimediaCategory];

export const SortOrder = {
  ASC: 'asc',
  DESC: 'desc'
} as const;

export type SortOrder = typeof SortOrder[keyof typeof SortOrder];

export const SortField = {
  NAME: 'filename',
  DATE: 'created_at',
  SIZE: 'size',
  CATEGORY: 'category'
} as const;

export type SortField = typeof SortField[keyof typeof SortField];

export interface MultimediaFilters {
  search?: string;
  category?: MultimediaCategory;
  tags?: string[];
  sortField?: SortField;
  sortOrder?: SortOrder;
  page?: number;
  limit?: number;
}

export interface MultimediaListResponse {
  files: MultimediaFile[];
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface UploadProgress {
  fileId: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

// Tipos de archivos permitidos
export const ALLOWED_FILE_TYPES = {
  images: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/avif',
    'image/bmp',
    'image/tiff'
  ],
  videos: [
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/avi',
    'video/mov',
    'video/wmv',
    'video/flv',
    'video/mkv'
  ],
  svg: [
    'image/svg+xml'
  ],
  documents: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
} as const;

export const MAX_FILE_SIZE = {
  image: 10 * 1024 * 1024, // 10MB
  video: 100 * 1024 * 1024, // 100MB
  svg: 1 * 1024 * 1024, // 1MB
  document: 20 * 1024 * 1024 // 20MB
} as const;

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  category?: MultimediaCategory;
}