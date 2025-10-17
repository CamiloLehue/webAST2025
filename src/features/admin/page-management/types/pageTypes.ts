export interface CustomPage {
  id: string;
  title: string;
  slug: string;
  content: ContentSection[];
  isPublished: boolean;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PageListItem {
  id: string;
  title: string;
  slug: string;
  isPublished: boolean;
  contentCount: number; 
  createdAt: string;
  updatedAt: string;
}

export interface ContentSection {
  id: string;
  type: ContentSectionType;
  data: HeroSection | HeroMultiSection | LogoSection | ContentSectionData | CurvedSection | TextSection | ImageSection | GallerySection | VideoSection | ContactFormSection | TestimonialsSection | FeaturesSection | CTASection | SpacerSection | ClientsCarouselSection | TeamCardsSection;
  order: number;
  gridWidth?: number; 
}

export type ContentSectionType = 
  | 'hero'
  | 'hero-multi'
  | 'logo-section'
  | 'content-section'
  | 'curved-section'
  | 'text'
  | 'image'
  | 'gallery'
  | 'video'
  | 'contact-form'
  | 'testimonials'
  | 'features'
  | 'cta'
  | 'spacer'
  | 'clients-carousel'
  | 'team-cards';

export interface HeroSection {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  textColor?: string;
  buttonText?: string;
  buttonLink?: string;
  alignment: 'left' | 'center' | 'right';
}

export interface TextSection {
  title?: string;
  content: string;
  alignment: 'left' | 'center' | 'right';
  fontSize: 'small' | 'medium' | 'large';
  backgroundColor?: string;
  padding: 'small' | 'medium' | 'large';
}

export interface ImageSection {
  src: string;
  alt: string;
  caption?: string;
  width: 'small' | 'medium' | 'large' | 'full';
  alignment: 'left' | 'center' | 'right';
  rounded: boolean;
}

export interface GallerySection {
  images: {
    src: string;
    alt: string;
    caption?: string;
  }[];
  columns: 2 | 3 | 4;
  spacing: 'small' | 'medium' | 'large';
}

export interface VideoSection {
  src: string;
  title?: string;
  description?: string;
  autoplay: boolean;
  controls: boolean;
  width: 'small' | 'medium' | 'large' | 'full';
}

export interface ContactFormSection {
  title?: string;
  description?: string;
  fields: FormField[];
  submitButtonText: string;
  successMessage: string;
}

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; 
}

export interface TestimonialsSection {
  title?: string;
  testimonials: Testimonial[];
  layout: 'grid' | 'carousel';
}

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  company?: string;
  avatar?: string;
  content: string;
  rating?: number;
}

export interface FeaturesSection {
  title?: string;
  description?: string;
  features: Feature[];
  layout: 'grid' | 'list';
  columns: 2 | 3 | 4;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon?: string;
  image?: string;
}

export interface CTASection {
  title: string;
  description?: string;
  buttonText: string;
  buttonLink: string;
  backgroundColor?: string;
  textColor?: string;
  alignment: 'left' | 'center' | 'right';
}

export interface SpacerSection {
  height: 'small' | 'medium' | 'large' | 'xl';
}

export interface HeroMultiSection {
  title: string;
  description?: string;
  images: string[]; 
  altText: string;
  buttonText?: string;
  buttonLink?: string;
  alignment: 'left' | 'center' | 'right';
  backgroundColor?: string;
  textColor?: string;
}

export interface LogoSection {
  logoSrc: string;
  logoAlt: string;
  title: string;
  backgroundColor?: string;
  textColor?: string;
  height?: 'small' | 'medium' | 'large';
}

export interface ContentSectionData {
  title?: string;
  description: string;
  images: string[];
  altText: string;
  layout: 'text-left' | 'text-right' | 'text-center';
  autoSlide?: boolean;
  className?: string;
}

export interface CurvedSection {
  title?: string;
  content: string;
  iconSrc?: string;
  iconAlt?: string;
  backgroundColor?: string;
  textColor?: string;
  clipPath?: string;
}

export interface ClientsCarouselSection {
  title?: string;
  clients: ClientItem[];
  backgroundColor?: string;
  autoplay?: boolean;
  speed?: 'slow' | 'medium' | 'fast';
}

export interface ClientItem {
  id: string;
  name: string;
  logo: string;
}

export interface TeamCardsSection {
  title?: string;
  backgroundColor?: string;
  clipPath?: string;
  members: TeamMember[];
  columns?: 3 | 4 | 5;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  phone?: string;
  email?: string;
}

export interface PageTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  sections: Omit<ContentSection, 'id'>[];
}

export interface PageFilters {
  search?: string;
  status?: 'all' | 'published' | 'draft';
  sortBy?: 'title' | 'created' | 'updated';
  sortOrder?: 'asc' | 'desc';
}

export interface PageStats {
  totalPages: number;
  publishedPages: number;
  draftPages: number;
}