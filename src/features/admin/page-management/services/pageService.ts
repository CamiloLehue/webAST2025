import type { CustomPage, ContentSection, PageTemplate, PageFilters, PageStats } from '../types/pageTypes';

const API_URL = import.meta.env.VITE_API_URL;

export class PageService {
  // Pages CRUD Operations
  static async getCustomPages(): Promise<CustomPage[]> {
    if (!API_URL) {
      throw new Error("API_URL not defined");
    }

    const response = await fetch(`${API_URL}/paginas`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch pages from API: ${response.status} ${response.statusText}`
      );
    }

    const pages: CustomPage[] = await response.json();
    return pages;
  }

  static async getCustomPageById(id: string): Promise<CustomPage | undefined> {
    const pages = await this.getCustomPages();
    return pages.find(page => page.id === id);
  }

  static async getCustomPageBySlug(slug: string): Promise<CustomPage | undefined> {
    const pages = await this.getCustomPages();
    return pages.find(page => page.slug === slug);
  }

  static async createCustomPage(
    pageData: Omit<CustomPage, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<CustomPage> {
    if (!API_URL) {
      throw new Error("API_URL not defined");
    }

    const now = new Date().toISOString();
    const newPage: CustomPage = {
      ...pageData,
      id: `page-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      updatedAt: now,
    };

    const response = await fetch(`${API_URL}/paginas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPage),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to create page via API: ${response.status} ${response.statusText}`
      );
    }

    const createdPage: CustomPage = await response.json();
    return createdPage;
  }

  static async updateCustomPage(updatedPage: CustomPage): Promise<void> {
    if (!API_URL) {
      throw new Error("API_URL not defined");
    }

    const pageWithTimestamp = {
      ...updatedPage,
      updatedAt: new Date().toISOString(),
    };

    const response = await fetch(`${API_URL}/paginas/${updatedPage.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pageWithTimestamp),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to update page via API: ${response.status} ${response.statusText}`
      );
    }
  }

  static async deleteCustomPage(id: string): Promise<void> {
    if (!API_URL) {
      throw new Error("API_URL not defined");
    }

    const response = await fetch(`${API_URL}/paginas/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(
        `Failed to delete page via API: ${response.status} ${response.statusText}`
      );
    }
  }

  // Content Sections Management
  static async addSection(pageId: string, section: Omit<ContentSection, 'id' | 'order'>): Promise<CustomPage> {
    const page = await this.getCustomPageById(pageId);
    if (!page) {
      throw new Error('Página no encontrada');
    }

    const newSection: ContentSection = {
      ...section,
      id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      order: page.content.length
    };

    page.content.push(newSection);
    await this.updateCustomPage(page);
    
    return page;
  }

  static async updateSection(pageId: string, sectionId: string, sectionData: Partial<ContentSection>): Promise<CustomPage> {
    const page = await this.getCustomPageById(pageId);
    if (!page) {
      throw new Error('Página no encontrada');
    }

    const sectionIndex = page.content.findIndex(section => section.id === sectionId);
    if (sectionIndex === -1) {
      throw new Error('Sección no encontrada');
    }

    page.content[sectionIndex] = {
      ...page.content[sectionIndex],
      ...sectionData
    };

    await this.updateCustomPage(page);
    return page;
  }

  static async deleteSection(pageId: string, sectionId: string): Promise<CustomPage> {
    const page = await this.getCustomPageById(pageId);
    if (!page) {
      throw new Error('Página no encontrada');
    }

    page.content = page.content.filter(section => section.id !== sectionId);
    
    // Reorder sections
    page.content.forEach((section, index) => {
      section.order = index;
    });

    await this.updateCustomPage(page);
    return page;
  }

  static async reorderSections(pageId: string, sectionIds: string[]): Promise<CustomPage> {
    const page = await this.getCustomPageById(pageId);
    if (!page) {
      throw new Error('Página no encontrada');
    }

    const reorderedContent: ContentSection[] = [];
    
    sectionIds.forEach((sectionId, index) => {
      const section = page.content.find(s => s.id === sectionId);
      if (section) {
        reorderedContent.push({
          ...section,
          order: index
        });
      }
    });

    page.content = reorderedContent;
    await this.updateCustomPage(page);
    
    return page;
  }

  // Templates Management
  static async getPageTemplates(): Promise<PageTemplate[]> {
    if (!API_URL) {
      throw new Error("API_URL not defined");
    }

    try {
      // Use AbortController to timeout quickly and avoid excessive console errors
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout
      
      const response = await fetch(`${API_URL}/page-templates`, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        // Specifically handle 404 without logging as an error
        if (response.status === 404) {
          // Silently fall back to default templates for 404
          return this.getDefaultTemplates();
        }
        
        // For other errors, throw to be caught below
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const templates: PageTemplate[] = await response.json();
      return templates.length > 0 ? templates : this.getDefaultTemplates();
    } catch (error) {
      // Check if it's an abort error (timeout) or fetch error (network issue)
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          // Timeout - likely no backend running
          console.info('Backend API not responding, using default page templates');
        } else if (error.message.includes('fetch')) {
          // Network error - likely no backend running
          console.info('Backend API not available, using default page templates');
        } else if (!error.message.includes('404')) {
          // Other errors that aren't 404
          console.warn('Page templates API error, using defaults:', error.message);
        }
      }
      return this.getDefaultTemplates();
    }
  }

  static async createPageFromTemplate(templateId: string, pageData: { title: string; slug: string }): Promise<CustomPage> {
    const templates = await this.getPageTemplates();
    const template = templates.find(t => t.id === templateId);
    
    if (!template) {
      throw new Error('Template no encontrado');
    }

    const sections: ContentSection[] = template.sections.map((section, index) => ({
      ...section,
      id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${index}`,
      order: index
    }));

    return await this.createCustomPage({
      title: pageData.title,
      slug: pageData.slug,
      content: sections,
      isPublished: false
    });
  }

  // Utility Methods
  static async validateSlug(slug: string, excludeId?: string): Promise<boolean> {
    const pages = await this.getCustomPages();
    return !pages.some(page => page.slug === slug && page.id !== excludeId);
  }

  static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  static async searchPages(query: string): Promise<CustomPage[]> {
    const pages = await this.getCustomPages();
    const searchTerm = query.toLowerCase();

    return pages.filter(page =>
      page.title.toLowerCase().includes(searchTerm) ||
      page.slug.toLowerCase().includes(searchTerm) ||
      JSON.stringify(page.content).toLowerCase().includes(searchTerm)
    );
  }

  static async getPublishedPages(): Promise<CustomPage[]> {
    const pages = await this.getCustomPages();
    return pages
      .filter(page => page.isPublished)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  // Statistics and filters
  static async getPageStats(): Promise<PageStats> {
    const pages = await this.getCustomPages();
    return {
      totalPages: pages.length,
      publishedPages: pages.filter(page => page.isPublished).length,
      draftPages: pages.filter(page => !page.isPublished).length,
    };
  }

  static async getFilteredPages(filters: PageFilters): Promise<CustomPage[]> {
    let pages = await this.getCustomPages();

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      pages = pages.filter(page =>
        page.title.toLowerCase().includes(searchTerm) ||
        page.slug.toLowerCase().includes(searchTerm)
      );
    }

    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      pages = pages.filter(page => 
        filters.status === 'published' ? page.isPublished : !page.isPublished
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      pages.sort((a, b) => {
        let valueA: string | Date;
        let valueB: string | Date;

        switch (filters.sortBy) {
          case 'title':
            valueA = a.title.toLowerCase();
            valueB = b.title.toLowerCase();
            break;
          case 'created':
            valueA = new Date(a.createdAt);
            valueB = new Date(b.createdAt);
            break;
          case 'updated':
          default:
            valueA = new Date(a.updatedAt);
            valueB = new Date(b.updatedAt);
            break;
        }

        if (valueA < valueB) return filters.sortOrder === 'asc' ? -1 : 1;
        if (valueA > valueB) return filters.sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return pages;
  }

  // Default Templates
  private static getDefaultTemplates(): PageTemplate[] {
    return [
      {
        id: 'landing-page',
        name: 'Landing Page',
        description: 'Página de aterrizaje con hero, características y CTA',
        sections: [
          {
            type: 'hero',
            data: {
              title: 'Bienvenido a nuestra empresa',
              subtitle: 'Ofrecemos las mejores soluciones para tu negocio',
              alignment: 'center',
              buttonText: 'Conocer más',
              buttonLink: '#features'
            },
            order: 0
          },
          {
            type: 'features',
            data: {
              title: 'Nuestras Características',
              layout: 'grid',
              columns: 3,
              features: [
                {
                  id: '1',
                  title: 'Característica 1',
                  description: 'Descripción de la primera característica'
                },
                {
                  id: '2',
                  title: 'Característica 2',
                  description: 'Descripción de la segunda característica'
                },
                {
                  id: '3',
                  title: 'Característica 3',
                  description: 'Descripción de la tercera característica'
                }
              ]
            },
            order: 1
          },
          {
            type: 'cta',
            data: {
              title: '¿Listo para comenzar?',
              description: 'Contáctanos hoy mismo y descubre cómo podemos ayudarte',
              buttonText: 'Contactar',
              buttonLink: '/contact',
              alignment: 'center'
            },
            order: 2
          }
        ]
      },
      {
        id: 'about-page',
        name: 'Página Sobre Nosotros',
        description: 'Página corporativa con información de la empresa',
        sections: [
          {
            type: 'hero',
            data: {
              title: 'Sobre Nosotros',
              subtitle: 'Conoce nuestra historia y valores',
              alignment: 'center'
            },
            order: 0
          },
          {
            type: 'text',
            data: {
              title: 'Nuestra Historia',
              content: 'Escribe aquí la historia de tu empresa, sus valores y misión.',
              alignment: 'left',
              fontSize: 'medium',
              padding: 'large'
            },
            order: 1
          },
          {
            type: 'testimonials',
            data: {
              title: 'Lo que dicen nuestros clientes',
              layout: 'grid',
              testimonials: [
                {
                  id: '1',
                  name: 'Cliente 1',
                  company: 'Empresa 1',
                  content: 'Excelente servicio y atención al cliente.'
                },
                {
                  id: '2',
                  name: 'Cliente 2',
                  company: 'Empresa 2',
                  content: 'Muy profesionales y confiables.'
                }
              ]
            },
            order: 2
          }
        ]
      },
      {
        id: 'contact-page',
        name: 'Página de Contacto',
        description: 'Página con formulario de contacto',
        sections: [
          {
            type: 'hero',
            data: {
              title: 'Contáctanos',
              subtitle: 'Estamos aquí para ayudarte',
              alignment: 'center'
            },
            order: 0
          },
          {
            type: 'contact-form',
            data: {
              title: 'Envíanos un mensaje',
              description: 'Completa el formulario y te responderemos pronto',
              submitButtonText: 'Enviar mensaje',
              successMessage: 'Gracias por tu mensaje. Te responderemos pronto.',
              fields: [
                {
                  id: 'name',
                  type: 'text',
                  label: 'Nombre',
                  required: true
                },
                {
                  id: 'email',
                  type: 'email',
                  label: 'Email',
                  required: true
                },
                {
                  id: 'message',
                  type: 'textarea',
                  label: 'Mensaje',
                  required: true
                }
              ]
            },
            order: 1
          }
        ]
      }
    ];
  }
}