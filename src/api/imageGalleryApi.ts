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
      { name: 'fotos comprimidas', path: '/img/fotos comprimidas', isDirectory: true },
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

    // Estructura de /img/fotos comprimidas (archivos reales)
    'img/fotos comprimidas': [
      // Archivos en la raíz
      { name: 'DSC07272.webp', path: '/img/fotos comprimidas/DSC07272.webp', isDirectory: false },
      { name: 'DSC07284.webp', path: '/img/fotos comprimidas/DSC07284.webp', isDirectory: false },
      { name: 'DSC07290.webp', path: '/img/fotos comprimidas/DSC07290.webp', isDirectory: false },
      { name: 'DSC07299.webp', path: '/img/fotos comprimidas/DSC07299.webp', isDirectory: false },
      { name: 'DSC07316.webp', path: '/img/fotos comprimidas/DSC07316.webp', isDirectory: false },
      { name: 'DSC07329.webp', path: '/img/fotos comprimidas/DSC07329.webp', isDirectory: false },
      { name: 'DSC07336.webp', path: '/img/fotos comprimidas/DSC07336.webp', isDirectory: false },
      { name: 'DSC07358.webp', path: '/img/fotos comprimidas/DSC07358.webp', isDirectory: false },
      { name: 'V08A8983.webp', path: '/img/fotos comprimidas/V08A8983.webp', isDirectory: false },
      { name: 'V08A8994.webp', path: '/img/fotos comprimidas/V08A8994.webp', isDirectory: false },
      { name: 'V08A9022 (1).webp', path: '/img/fotos comprimidas/V08A9022 (1).webp', isDirectory: false },
      { name: 'V08A9022.webp', path: '/img/fotos comprimidas/V08A9022.webp', isDirectory: false },
      { name: 'V08A9185 (1).webp', path: '/img/fotos comprimidas/V08A9185 (1).webp', isDirectory: false },
      { name: 'V08A9185.webp', path: '/img/fotos comprimidas/V08A9185.webp', isDirectory: false },
      // Subcarpetas
      { name: 'Datacenter', path: '/img/fotos comprimidas/Datacenter', isDirectory: true },
      { name: 'Inicio', path: '/img/fotos comprimidas/Inicio', isDirectory: true },
      { name: 'IoT', path: '/img/fotos comprimidas/IoT', isDirectory: true },
      { name: 'Network IP', path: '/img/fotos comprimidas/Network IP', isDirectory: true },
      { name: 'Nuestra empresa', path: '/img/fotos comprimidas/Nuestra empresa', isDirectory: true },
      { name: 'RoIP', path: '/img/fotos comprimidas/RoIP', isDirectory: true },
      { name: 'Satelital', path: '/img/fotos comprimidas/Satelital', isDirectory: true },
      { name: 'Wisensor', path: '/img/fotos comprimidas/Wisensor', isDirectory: true },
      { name: 'Wisensor IA', path: '/img/fotos comprimidas/Wisensor IA', isDirectory: true },
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

    // Subcarpetas de fotos comprimidas
    'img/fotos comprimidas/Datacenter': [
      { name: '10.webp', path: '/img/fotos comprimidas/Datacenter/10.webp', isDirectory: false },
      { name: '11.webp', path: '/img/fotos comprimidas/Datacenter/11.webp', isDirectory: false },
      { name: '12 (1).webp', path: '/img/fotos comprimidas/Datacenter/12 (1).webp', isDirectory: false },
      { name: '12.webp', path: '/img/fotos comprimidas/Datacenter/12.webp', isDirectory: false },
      { name: '13.webp', path: '/img/fotos comprimidas/Datacenter/13.webp', isDirectory: false },
      { name: '14.webp', path: '/img/fotos comprimidas/Datacenter/14.webp', isDirectory: false },
      { name: '15.webp', path: '/img/fotos comprimidas/Datacenter/15.webp', isDirectory: false },
      { name: '16.webp', path: '/img/fotos comprimidas/Datacenter/16.webp', isDirectory: false },
      { name: '17.webp', path: '/img/fotos comprimidas/Datacenter/17.webp', isDirectory: false },
      { name: '18.webp', path: '/img/fotos comprimidas/Datacenter/18.webp', isDirectory: false },
      { name: '19.webp', path: '/img/fotos comprimidas/Datacenter/19.webp', isDirectory: false },
      { name: '2.webp', path: '/img/fotos comprimidas/Datacenter/2.webp', isDirectory: false },
      { name: '20.webp', path: '/img/fotos comprimidas/Datacenter/20.webp', isDirectory: false },
      { name: '21.webp', path: '/img/fotos comprimidas/Datacenter/21.webp', isDirectory: false },
      { name: '22.webp', path: '/img/fotos comprimidas/Datacenter/22.webp', isDirectory: false },
      { name: '23.webp', path: '/img/fotos comprimidas/Datacenter/23.webp', isDirectory: false },
      { name: '24.webp', path: '/img/fotos comprimidas/Datacenter/24.webp', isDirectory: false },
      { name: '3.webp', path: '/img/fotos comprimidas/Datacenter/3.webp', isDirectory: false },
      { name: '4.webp', path: '/img/fotos comprimidas/Datacenter/4.webp', isDirectory: false },
      { name: '5.webp', path: '/img/fotos comprimidas/Datacenter/5.webp', isDirectory: false },
      { name: '6.webp', path: '/img/fotos comprimidas/Datacenter/6.webp', isDirectory: false },
      { name: '7.webp', path: '/img/fotos comprimidas/Datacenter/7.webp', isDirectory: false },
      { name: '8.webp', path: '/img/fotos comprimidas/Datacenter/8.webp', isDirectory: false },
      { name: '9.webp', path: '/img/fotos comprimidas/Datacenter/9.webp', isDirectory: false },
      { name: 'IMG_2571-3.webp', path: '/img/fotos comprimidas/Datacenter/IMG_2571-3.webp', isDirectory: false },
      { name: 'IMG_2572-2.webp', path: '/img/fotos comprimidas/Datacenter/IMG_2572-2.webp', isDirectory: false },
      { name: 'IMG_2576-2.webp', path: '/img/fotos comprimidas/Datacenter/IMG_2576-2.webp', isDirectory: false },
      { name: 'IMG_2604-2.webp', path: '/img/fotos comprimidas/Datacenter/IMG_2604-2.webp', isDirectory: false },
      { name: 'IMG_2638 fig.webp', path: '/img/fotos comprimidas/Datacenter/IMG_2638 fig.webp', isDirectory: false },
    ],

    'img/fotos comprimidas/Inicio': [
      { name: '_DSC8202.webp', path: '/img/fotos comprimidas/Inicio/_DSC8202.webp', isDirectory: false },
      { name: 'aqua-chile-9282ac7b84a200b31d3b9df1d454fa56.jpg', path: '/img/fotos comprimidas/Inicio/aqua-chile-9282ac7b84a200b31d3b9df1d454fa56.jpg', isDirectory: false },
      { name: 'aquasur-2024-6c5da33079ecdb2758aac272ffef3124.jpg', path: '/img/fotos comprimidas/Inicio/aquasur-2024-6c5da33079ecdb2758aac272ffef3124.jpg', isDirectory: false },
      { name: 'ast-estara-en-la-seguridad-expo-2024-cfd732e1436558d24d1674f1337d7180.jpg', path: '/img/fotos comprimidas/Inicio/ast-estara-en-la-seguridad-expo-2024-cfd732e1436558d24d1674f1337d7180.jpg', isDirectory: false },
      { name: 'caleta-bay-fd6c128733fc1d31f48a431ee6dfe1bc.jpg', path: '/img/fotos comprimidas/Inicio/caleta-bay-fd6c128733fc1d31f48a431ee6dfe1bc.jpg', isDirectory: false },
      { name: 'cermaq-d891bf1b077927ebafb0401ff8dc98c2.jpg', path: '/img/fotos comprimidas/Inicio/cermaq-d891bf1b077927ebafb0401ff8dc98c2.jpg', isDirectory: false },
      { name: 'corfo-172a0351dd06161e7774ba5a3abe865b.png', path: '/img/fotos comprimidas/Inicio/corfo-172a0351dd06161e7774ba5a3abe865b.png', isDirectory: false },
      { name: 'cultivos-yadran-5804a7bec176070ba227bdeaa23c5913.jpg', path: '/img/fotos comprimidas/Inicio/cultivos-yadran-5804a7bec176070ba227bdeaa23c5913.jpg', isDirectory: false },
      { name: 'estaremos-en-expomin-2025-f8b9c9905a91ffd593f4ddc8293eb900.png', path: '/img/fotos comprimidas/Inicio/estaremos-en-expomin-2025-f8b9c9905a91ffd593f4ddc8293eb900.png', isDirectory: false },
      { name: 'exitosa-participacion-de-ast-en-fidae-2024-cd48d72165d061eea4c7b63d8da8a64b.jpeg', path: '/img/fotos comprimidas/Inicio/exitosa-participacion-de-ast-en-fidae-2024-cd48d72165d061eea4c7b63d8da8a64b.jpeg', isDirectory: false },
      { name: 'experiencia-seguridad-expo-2024-a0098fd07db7692267fca4f4169c9ba2.jpeg', path: '/img/fotos comprimidas/Inicio/experiencia-seguridad-expo-2024-a0098fd07db7692267fca4f4169c9ba2.jpeg', isDirectory: false },
      { name: 'Gemini_Generated_Image_uqzkvfuqzkvfuqzk.webp', path: '/img/fotos comprimidas/Inicio/Gemini_Generated_Image_uqzkvfuqzkvfuqzk.webp', isDirectory: false },
      { name: 'IMG_2638 fig.webp', path: '/img/fotos comprimidas/Inicio/IMG_2638 fig.webp', isDirectory: false },
      { name: 'infraestructura-ba5e0fe03c25fc5d2e03355af56955e9.jpg', path: '/img/fotos comprimidas/Inicio/infraestructura-ba5e0fe03c25fc5d2e03355af56955e9.jpg', isDirectory: false },
      { name: 'infraestructuraaa-ba5e0fe03c25fc5d2e03355af56955e9.jpg', path: '/img/fotos comprimidas/Inicio/infraestructuraaa-ba5e0fe03c25fc5d2e03355af56955e9.jpg', isDirectory: false },
      { name: 'marine-farm-2fedb611e8aa09832408a9b1f5677f0b.jpg', path: '/img/fotos comprimidas/Inicio/marine-farm-2fedb611e8aa09832408a9b1f5677f0b.jpg', isDirectory: false },
      { name: 'marine-farm-f5b61ec1453268c098f92980c6da0a3b.jpg', path: '/img/fotos comprimidas/Inicio/marine-farm-f5b61ec1453268c098f92980c6da0a3b.jpg', isDirectory: false },
      { name: 'mowi-e7118babee579ee2c4adf51f96fd4237.png', path: '/img/fotos comprimidas/Inicio/mowi-e7118babee579ee2c4adf51f96fd4237.png', isDirectory: false },
      { name: 'multiexports-foods-422e03c48915d7ed9e8f891d7c75d412.jpg', path: '/img/fotos comprimidas/Inicio/multiexports-foods-422e03c48915d7ed9e8f891d7c75d412.jpg', isDirectory: false },
      { name: 'pollutionRGB-4846741 copy.webp', path: '/img/fotos comprimidas/Inicio/pollutionRGB-4846741 copy.webp', isDirectory: false },
      { name: 'salmones-austral-159fc249207cc45fd95a7e17308aaba1.jpg', path: '/img/fotos comprimidas/Inicio/salmones-austral-159fc249207cc45fd95a7e17308aaba1.jpg', isDirectory: false },
      { name: 'salmones-aysen-8b7f5d739331a762aa3aaaa02120f825.jpg', path: '/img/fotos comprimidas/Inicio/salmones-aysen-8b7f5d739331a762aa3aaaa02120f825.jpg', isDirectory: false },
      { name: 'salmones-humboldt-b9f94c77652c9a76fc8a442748cd54bd.jpg', path: '/img/fotos comprimidas/Inicio/salmones-humboldt-b9f94c77652c9a76fc8a442748cd54bd.jpg', isDirectory: false },
      { name: 'super-salmon-434d707f9a5c1cb8836dde8f27dee4fe.jpg', path: '/img/fotos comprimidas/Inicio/super-salmon-434d707f9a5c1cb8836dde8f27dee4fe.jpg', isDirectory: false },
      { name: 'trusal-9a48bb6f434ea2cdb7c907ec71313405.jpg', path: '/img/fotos comprimidas/Inicio/trusal-9a48bb6f434ea2cdb7c907ec71313405.jpg', isDirectory: false },
      { name: 'V08A9207.webp', path: '/img/fotos comprimidas/Inicio/V08A9207.webp', isDirectory: false },
      { name: 'V08A9638.webp', path: '/img/fotos comprimidas/Inicio/V08A9638.webp', isDirectory: false },
      { name: 'SVG', path: '/img/fotos comprimidas/Inicio/SVG', isDirectory: true },
    ],

    'img/fotos comprimidas/IoT': [
      { name: '_DSC8098 2.webp', path: '/img/fotos comprimidas/IoT/_DSC8098 2.webp', isDirectory: false },
      { name: '2.webp', path: '/img/fotos comprimidas/IoT/2.webp', isDirectory: false },
      { name: 'LoRaWAN_Logo.svg_.png', path: '/img/fotos comprimidas/IoT/LoRaWAN_Logo.svg_.png', isDirectory: false },
      { name: 'Placa GPS.webp', path: '/img/fotos comprimidas/IoT/Placa GPS.webp', isDirectory: false },
    ],

    'img/fotos comprimidas/Network IP': [
      { name: 'equipamiento-de-red-36b09b3d3ab0175d3e86e2b7efefbbbe.jpg', path: '/img/fotos comprimidas/Network IP/equipamiento-de-red-36b09b3d3ab0175d3e86e2b7efefbbbe.jpg', isDirectory: false },
      { name: 'equipamiento-de-red-ba441cd4df34d166bc3a655b090eccd0.jpg', path: '/img/fotos comprimidas/Network IP/equipamiento-de-red-ba441cd4df34d166bc3a655b090eccd0.jpg', isDirectory: false },
      { name: 'equipamiento-de-red-c66f26ab5ddca9833364d8497a752ef8.jpg', path: '/img/fotos comprimidas/Network IP/equipamiento-de-red-c66f26ab5ddca9833364d8497a752ef8.jpg', isDirectory: false },
      { name: 'equipamiento-de-red-e70de62089437170ecc38a7487295dbb.jpg', path: '/img/fotos comprimidas/Network IP/equipamiento-de-red-e70de62089437170ecc38a7487295dbb.jpg', isDirectory: false },
      { name: 'equipamiento-de-red-f3e0eb8f4ae5f3afd35b5e4b6e5a2d78.jpg', path: '/img/fotos comprimidas/Network IP/equipamiento-de-red-f3e0eb8f4ae5f3afd35b5e4b6e5a2d78.jpg', isDirectory: false },
      { name: 'netowkr2.webp', path: '/img/fotos comprimidas/Network IP/netowkr2.webp', isDirectory: false },
      { name: 'network1.png', path: '/img/fotos comprimidas/Network IP/network1.png', isDirectory: false },
      { name: 'V08A8832.webp', path: '/img/fotos comprimidas/Network IP/V08A8832.webp', isDirectory: false },
      { name: 'V08A9022.webp', path: '/img/fotos comprimidas/Network IP/V08A9022.webp', isDirectory: false },
    ],
    'img/fotos comprimidas/Nuestra empresa': [
      { name: 'V08A8948.webp', path: '/img/fotos comprimidas/Nuestra empresa/V08A8948.webp', isDirectory: false },
    ],
    'img/fotos comprimidas/RoIP': [
      { name: 'Recurso 1@4x2.webp', path: '/img/fotos comprimidas/RoIP/Recurso 1@4x2.webp', isDirectory: false },
      { name: 'Recurso 2@4x.png', path: '/img/fotos comprimidas/RoIP/Recurso 2@4x.png', isDirectory: false },
      { name: 'Recurso 3@4x.webp', path: '/img/fotos comprimidas/RoIP/Recurso 3@4x.webp', isDirectory: false },
    ],
    'img/fotos comprimidas/Satelital': [
      { name: 'image35 2.jpg', path: '/img/fotos comprimidas/Satelital/image35 2.jpg', isDirectory: false },
      { name: 'image37 (1).jpg', path: '/img/fotos comprimidas/Satelital/image37 (1).jpg', isDirectory: false },
      { name: 'image37 2.jpg', path: '/img/fotos comprimidas/Satelital/image37 2.jpg', isDirectory: false },
      { name: 'image37.jpg', path: '/img/fotos comprimidas/Satelital/image37.jpg', isDirectory: false },
      { name: 'image38.jpg', path: '/img/fotos comprimidas/Satelital/image38.jpg', isDirectory: false },
      { name: 'image58.jpg', path: '/img/fotos comprimidas/Satelital/image58.jpg', isDirectory: false },
    ],
    'img/fotos comprimidas/Wisensor': [
      { name: '1 (1).webp', path: '/img/fotos comprimidas/Wisensor/1 (1).webp', isDirectory: false },
      { name: '1.webp', path: '/img/fotos comprimidas/Wisensor/1.webp', isDirectory: false },
      { name: '2.webp', path: '/img/fotos comprimidas/Wisensor/2.webp', isDirectory: false },
      { name: '20201203_140523 (1).webp', path: '/img/fotos comprimidas/Wisensor/20201203_140523 (1).webp', isDirectory: false },
      { name: '20201203_140523.webp', path: '/img/fotos comprimidas/Wisensor/20201203_140523.webp', isDirectory: false },
      { name: '3v2.webp', path: '/img/fotos comprimidas/Wisensor/3v2.webp', isDirectory: false },
      { name: '4v2.webp', path: '/img/fotos comprimidas/Wisensor/4v2.webp', isDirectory: false },
      { name: '5v2.webp', path: '/img/fotos comprimidas/Wisensor/5v2.webp', isDirectory: false },
      { name: '6v2.webp', path: '/img/fotos comprimidas/Wisensor/6v2.webp', isDirectory: false },
      { name: '7v2.webp', path: '/img/fotos comprimidas/Wisensor/7v2.webp', isDirectory: false },
      { name: 'aplicaciones 2.png', path: '/img/fotos comprimidas/Wisensor/aplicaciones 2.png', isDirectory: false },
      { name: 'Artboard 1a2 1.png', path: '/img/fotos comprimidas/Wisensor/Artboard 1a2 1.png', isDirectory: false },
      { name: 'Wisensor.png', path: '/img/fotos comprimidas/Wisensor/Wisensor.png', isDirectory: false },
      { name: 'SVG', path: '/img/fotos comprimidas/Wisensor/SVG', isDirectory: true },
    ],
    'img/fotos comprimidas/Wisensor IA': [
      { name: 'SVG', path: '/img/fotos comprimidas/Wisensor IA/SVG', isDirectory: true },
    ],
    'img/fotos comprimidas/Inicio/SVG': [],
    'img/fotos comprimidas/Wisensor/SVG': [],
    'img/fotos comprimidas/Wisensor IA/SVG': [],
    
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
    'img/services/empresa-sustentable': [
      { name: 'iconCasa.png', path: '/img/services/empresa-sustentable/iconCasa.png', isDirectory: false },
      { name: 'iconTorre.png', path: '/img/services/empresa-sustentable/iconTorre.png', isDirectory: false },
      { name: 'image03.png', path: '/img/services/empresa-sustentable/image03.png', isDirectory: false },
      { name: 'image04.png', path: '/img/services/empresa-sustentable/image04.png', isDirectory: false },
    ],
    'img/services/networkip': [
      { name: 'image01.png', path: '/img/services/networkip/image01.png', isDirectory: false },
      { name: 'image02.png', path: '/img/services/networkip/image02.png', isDirectory: false },
    ],
    'img/services/satelital': [],
    'img/services/seguridad': [
      { name: 'cam.png', path: '/img/services/seguridad/cam.png', isDirectory: false },
      { name: 'cam2.png', path: '/img/services/seguridad/cam2.png', isDirectory: false },
      { name: 'cam3.png', path: '/img/services/seguridad/cam3.png', isDirectory: false },
      { name: 'campana.png', path: '/img/services/seguridad/campana.png', isDirectory: false },
      { name: 'hero.png', path: '/img/services/seguridad/hero.png', isDirectory: false },
    ],
    'img/services/wireless': [
      { name: 'image01.png', path: '/img/services/wireless/image01.png', isDirectory: false },
      { name: 'image02.png', path: '/img/services/wireless/image02.png', isDirectory: false },
      { name: 'image03.png', path: '/img/services/wireless/image03.png', isDirectory: false },
    ],
    'img/services/wisensor': [
      { name: 'aplicaciones.png', path: '/img/services/wisensor/aplicaciones.png', isDirectory: false },
      { name: 'Artboard.png', path: '/img/services/wisensor/Artboard.png', isDirectory: false },
      { name: 'wisensor-app.png', path: '/img/services/wisensor/wisensor-app.png', isDirectory: false },
      { name: 'wisensor-app2.png', path: '/img/services/wisensor/wisensor-app2.png', isDirectory: false },
      { name: 'Wisensor.png', path: '/img/services/wisensor/Wisensor.png', isDirectory: false },
    ],
    'img/services/wisensoria': [
      { name: 'hero.png', path: '/img/services/wisensoria/hero.png', isDirectory: false },
      { name: 'image01.png', path: '/img/services/wisensoria/image01.png', isDirectory: false },
      { name: 'image02.png', path: '/img/services/wisensoria/image02.png', isDirectory: false },
      { name: 'image03.png', path: '/img/services/wisensoria/image03.png', isDirectory: false },
      { name: 'image04.png', path: '/img/services/wisensoria/image04.png', isDirectory: false },
    ],
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
 * Función para subir una imagen al servidor
 */
export const uploadImage = async (
  file: File, 
  directory?: string
): Promise<{ success: boolean; imagePath?: string; error?: string }> => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    
    if (directory) {
      formData.append('directory', directory);
    }

    const response = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error uploading image');
    }

    const result = await response.json();
    return {
      success: true,
      imagePath: result.imagePath,
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

/**
 * Función para eliminar una imagen del servidor
 */
export const deleteImage = async (imagePath: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch('/api/delete-image', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imagePath }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error deleting image');
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting image:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

/**
 * Función para redimensionar una imagen (requiere backend con procesamiento de imágenes)
 */
export const resizeImage = async (
  imagePath: string,
  width: number,
  height: number,
  maintainAspectRatio: boolean = true
): Promise<{ success: boolean; newImagePath?: string; error?: string }> => {
  try {
    const response = await fetch('/api/resize-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imagePath,
        width,
        height,
        maintainAspectRatio,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error resizing image');
    }

    const result = await response.json();
    return {
      success: true,
      newImagePath: result.newImagePath,
    };
  } catch (error) {
    console.error('Error resizing image:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
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