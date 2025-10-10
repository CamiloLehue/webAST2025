export interface HomeData {
  id: string;
  heroSection: HeroSection;
  sliderSection: SliderSection;
  iaSection: IASection;
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

export interface SliderSection {
  slides: SliderItem[];
  autoplay: boolean;
  interval: number;
}

export interface HeroSection {
  title: string;
  description: string;
  backgroundImage: string;
}

export interface IASection {
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
  title: string;
  contactInfo: {
    phone1: string;
    phone2: string;
    email: string;
    schedule: string;
  };
}

export interface HomeUpdateSchema {
  heroSection?: HeroSection;
  sliderSection?: SliderSection;
  iaSection?: IASection;
  videoSection?: VideoSection;
  contactSection?: ContactSection;
  isPublished?: boolean;
}
