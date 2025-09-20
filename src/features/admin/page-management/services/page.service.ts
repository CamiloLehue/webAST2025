import type { CustomPage, ContentSection, PageTemplate } from '../types/page.types';

export class PageService {
  private static readonly STORAGE_KEY = 'ast_custom_pages';
  private static readonly TEMPLATES_KEY = 'ast_page_templates';

  // Pages CRUD Operations
  static getCustomPages(): CustomPage[] {
    try {
      const pages = localStorage.getItem(this.STORAGE_KEY);
      return pages ? JSON.parse(pages) : [];
    } catch (error) {
      console.error('Error loading custom pages:', error);
      return [];
    }
  }

  static getCustomPageById(id: string): CustomPage | undefined {
    const pages = this.getCustomPages();
    return pages.find(page => page.id === id);
  }

  static getCustomPageBySlug(slug: string): CustomPage | undefined {
    const pages = this.getCustomPages();
    return pages.find(page => page.slug === slug);
  }

  static createCustomPage(pageData: Omit<CustomPage, 'id' | 'createdAt' | 'updatedAt'>): CustomPage {
    const pages = this.getCustomPages();
    
    // Validate slug uniqueness
    if (pages.some(page => page.slug === pageData.slug)) {
      throw new Error('Ya existe una página con este slug');
    }

    const newPage: CustomPage = {
      ...pageData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    pages.push(newPage);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(pages));
    
    return newPage;
  }

  static updateCustomPage(updatedPage: CustomPage): void {
    const pages = this.getCustomPages();
    const index = pages.findIndex(page => page.id === updatedPage.id);
    
    if (index === -1) {
      throw new Error('Página no encontrada');
    }

    // Validate slug uniqueness (excluding current page)
    if (pages.some(page => page.slug === updatedPage.slug && page.id !== updatedPage.id)) {
      throw new Error('Ya existe una página con este slug');
    }

    pages[index] = {
      ...updatedPage,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(pages));
  }

  static deleteCustomPage(id: string): void {
    const pages = this.getCustomPages();
    const filteredPages = pages.filter(page => page.id !== id);
    
    if (filteredPages.length === pages.length) {
      throw new Error('Página no encontrada');
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredPages));
  }

  // Content Sections Management
  static addSection(pageId: string, section: Omit<ContentSection, 'id' | 'order'>): CustomPage {
    const page = this.getCustomPageById(pageId);
    if (!page) {
      throw new Error('Página no encontrada');
    }

    const newSection: ContentSection = {
      ...section,
      id: crypto.randomUUID(),
      order: page.content.length
    };

    page.content.push(newSection);
    this.updateCustomPage(page);
    
    return page;
  }

  static updateSection(pageId: string, sectionId: string, sectionData: Partial<ContentSection>): CustomPage {
    const page = this.getCustomPageById(pageId);
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

    this.updateCustomPage(page);
    return page;
  }

  static deleteSection(pageId: string, sectionId: string): CustomPage {
    const page = this.getCustomPageById(pageId);
    if (!page) {
      throw new Error('Página no encontrada');
    }

    page.content = page.content.filter(section => section.id !== sectionId);
    
    // Reorder sections
    page.content.forEach((section, index) => {
      section.order = index;
    });

    this.updateCustomPage(page);
    return page;
  }

  static reorderSections(pageId: string, sectionIds: string[]): CustomPage {
    const page = this.getCustomPageById(pageId);
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
    this.updateCustomPage(page);
    
    return page;
  }

  // Templates Management
  static getPageTemplates(): PageTemplate[] {
    try {
      const templates = localStorage.getItem(this.TEMPLATES_KEY);
      return templates ? JSON.parse(templates) : this.getDefaultTemplates();
    } catch (error) {
      console.error('Error loading page templates:', error);
      return this.getDefaultTemplates();
    }
  }

  static createPageFromTemplate(templateId: string, pageData: { title: string; slug: string }): CustomPage {
    const templates = this.getPageTemplates();
    const template = templates.find(t => t.id === templateId);
    
    if (!template) {
      throw new Error('Template no encontrado');
    }

    const sections: ContentSection[] = template.sections.map((section, index) => ({
      ...section,
      id: crypto.randomUUID(),
      order: index
    }));

    return this.createCustomPage({
      title: pageData.title,
      slug: pageData.slug,
      content: sections,
      isPublished: false
    });
  }

  // Utility Methods
  static validateSlug(slug: string, excludeId?: string): boolean {
    const pages = this.getCustomPages();
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

  static searchPages(query: string): CustomPage[] {
    const pages = this.getCustomPages();
    const searchTerm = query.toLowerCase();

    return pages.filter(page =>
      page.title.toLowerCase().includes(searchTerm) ||
      page.slug.toLowerCase().includes(searchTerm) ||
      JSON.stringify(page.content).toLowerCase().includes(searchTerm)
    );
  }

  static getPublishedPages(): CustomPage[] {
    return this.getCustomPages()
      .filter(page => page.isPublished)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
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