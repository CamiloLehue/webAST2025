export interface HomeData {
  id: string;
  slider: SliderItem[];
  heroSection: HeroSection;
  aiSection: AISection;
  videoSection: VideoSection;
  contactSection: ContactSection;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SliderItem {
  id: string;
  image: string;
  title: string;
  description: string;
  order: number;
  isActive: boolean;
}

export interface HeroSection {
  title: string;
  description: string;
  backgroundImage: string;
}

export interface AISection {
  title: string;
  description: string;
  image: string;
  buttonText: string;
  buttonLink: string;
}

export interface VideoSection {
  title: string;
  videoUrl: string;
  description?: string;
}

export interface ContactSection {
  phone1: string;
  phone2: string;
  email: string;
  schedule: string;
}

export interface HomeUpdateSchema {
  slider?: SliderItem[];
  heroSection?: HeroSection;
  aiSection?: AISection;
  videoSection?: VideoSection;
  contactSection?: ContactSection;
  isPublished?: boolean;
}
