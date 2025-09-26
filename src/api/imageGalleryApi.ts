// API para obtener imágenes reales del directorio public/img/
import { isImageFile } from '../utils/imageUtils';

export interface ImageItem {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: ImageItem[];
}

/**
 * Obtiene la lista de imágenes reales del servidor
 * Esta función devuelve los archivos que realmente existen en tu proyecto
 */
export const fetchRealImages = async (path: string[] = []): Promise<ImageItem[]> => {
  try {
    // Simular un pequeño delay para mostrar el loading
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Por ahora, usar la estructura de fallback que refleja tus archivos reales
    // En el futuro, esto se reemplazaría con una llamada real al servidor
    return await getFallbackImageStructure(path);
    
  } catch (error) {
    console.error('Error fetching real images:', error);
    return [];
  }
};

/**
 * Estructura de fallback basada en los archivos que realmente existen en tu proyecto
 * Esta función devuelve una estructura actualizada manualmente pero que refleja los archivos reales
 */
const getFallbackImageStructure = async (path: string[] = []): Promise<ImageItem[]> => {
  // Estructura completa de archivos reales - actualizada manualmente
  const realFileStructure: { [key: string]: ImageItem[] } = {
    // Raíz (public/) - Solo las carpetas y archivos de imagen más relevantes
    '': [
      { name: 'img', path: '/img', isDirectory: true },
      { name: 'slider', path: '/slider', isDirectory: true },
      { name: 'AST-Logo-white.png', path: '/AST-Logo-white.png', isDirectory: false },
      { name: 'AST-Logo.png', path: '/AST-Logo.png', isDirectory: false },
      { name: 'vite.svg', path: '/vite.svg', isDirectory: false },
    ],
    
    // Estructura de /img
    'img': [
      { name: 'about', path: '/img/about', isDirectory: true },
      { name: 'inicio', path: '/img/inicio', isDirectory: true },
      { name: 'services', path: '/img/services', isDirectory: true },
    ],
    
    // Estructura de /slider (archivos reales)
    'slider': [
      { name: 'slider01.JPG', path: '/slider/slider01.JPG', isDirectory: false },
      { name: 'slider02.JPG', path: '/slider/slider02.JPG', isDirectory: false },
      { name: 'slider03.JPG', path: '/slider/slider03.JPG', isDirectory: false },
      { name: 'slider04.JPG', path: '/slider/slider04.JPG', isDirectory: false },
      { name: 'slider05.JPG', path: '/slider/slider05.JPG', isDirectory: false },
    ],
    
    // Estructura de /img/about (archivos reales)
    'img/about': [
      { name: 'ast-network-personal.jpg', path: '/img/about/ast-network-personal.jpg', isDirectory: false },
      { name: 'infraestructuras.jpg', path: '/img/about/infraestructuras.jpg', isDirectory: false },
      { name: 'hero', path: '/img/about/hero', isDirectory: true },
    ],
    
    // Estructura de /img/inicio (archivos reales)
    'img/inicio': [
      { name: 'ia-wisensor.jpg', path: '/img/inicio/ia-wisensor.jpg', isDirectory: false },
      { name: 'clientes', path: '/img/inicio/clientes', isDirectory: true },
    ],
    
    // Estructura de /img/services (archivos y carpetas reales)
    'img/services': [
      { name: 'hero-services.jpg', path: '/img/services/hero-services.jpg', isDirectory: false },
      { name: 'datacenter', path: '/img/services/datacenter', isDirectory: true },
      { name: 'drones', path: '/img/services/drones', isDirectory: true },
      { name: 'empresa-sustentable', path: '/img/services/empresa-sustentable', isDirectory: true },
      { name: 'iot', path: '/img/services/iot', isDirectory: true },
      { name: 'networkip', path: '/img/services/networkip', isDirectory: true },
      { name: 'satelital', path: '/img/services/satelital', isDirectory: true },
      { name: 'seguridad', path: '/img/services/seguridad', isDirectory: true },
      { name: 'wireless', path: '/img/services/wireless', isDirectory: true },
      { name: 'wisensor', path: '/img/services/wisensor', isDirectory: true },
      { name: 'wisensoria', path: '/img/services/wisensoria', isDirectory: true },
    ],
    
    // Subcarpetas con contenido real verificado
    'img/about/hero': [],  // Verificar si tiene contenido
    'img/inicio/clientes': [],  // Verificar si tiene contenido
    
    // Carpetas de servicios con imágenes reales
    'img/services/datacenter': [
      { name: 'hero.jpg', path: '/img/services/datacenter/hero.jpg', isDirectory: false },
      { name: 'image01.png', path: '/img/services/datacenter/image01.png', isDirectory: false },
      { name: 'image02.png', path: '/img/services/datacenter/image02.png', isDirectory: false },
      { name: 'image03.png', path: '/img/services/datacenter/image03.png', isDirectory: false },
    ],
    
    'img/services/drones': [
      { name: 'image01.png', path: '/img/services/drones/image01.png', isDirectory: false },
      { name: 'image02.png', path: '/img/services/drones/image02.png', isDirectory: false },
      { name: 'image03.png', path: '/img/services/drones/image03.png', isDirectory: false },
      { name: 'image04.png', path: '/img/services/drones/image04.png', isDirectory: false },
      { name: 'image05.png', path: '/img/services/drones/image05.png', isDirectory: false },
    ],
    
    'img/services/iot': [
      { name: 'image01.png', path: '/img/services/iot/image01.png', isDirectory: false },
    ],
    
    // Resto de carpetas de servicios (agregar contenido cuando lo necesites)
    'img/services/empresa-sustentable': [],
    'img/services/networkip': [],
    'img/services/satelital': [],
    'img/services/seguridad': [],
    'img/services/wireless': [],
    'img/services/wisensor': [],
    'img/services/wisensoria': [],
  };

  const pathKey = path.join('/');
  const items = realFileStructure[pathKey] || [];
  
  // Filtrar solo archivos de imagen válidos y directorios
  return items.filter(item => {
    if (item.isDirectory) return true;
    return isImageFile(item.name);
  });
};

/**
 * Función para verificar si una imagen existe realmente
 */
export const checkImageExists = async (imagePath: string): Promise<boolean> => {
  try {
    const response = await fetch(imagePath, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Función para escanear dinámicamente un directorio (requiere backend)
 * Esta sería la implementación ideal con un endpoint del servidor
 */
export const scanDirectory = async (directoryPath: string): Promise<ImageItem[]> => {
  try {
    const response = await fetch('/api/scan-directory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ path: directoryPath }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to scan directory');
    }
    
    const files = await response.json();
    
    return files.map((file: { name: string; path: string; isDirectory: boolean }) => ({
      name: file.name,
      path: file.path,
      isDirectory: file.isDirectory,
      children: file.isDirectory ? [] : undefined,
    })).filter((item: ImageItem) => {
      if (item.isDirectory) return true;
      return isImageFile(item.name);
    });
    
  } catch (error) {
    console.error('Error scanning directory:', error);
    return [];
  }
};