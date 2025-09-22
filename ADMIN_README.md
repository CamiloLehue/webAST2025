# Sistema Administrativo - AST Web

Este proyecto incluye un panel administrativo completo que permite gestionar todo el contenido del sitio web de manera dinámica.

## 🚀 Características Principales

### Panel Administrativo
- **Dashboard**: Vista general con estadísticas y acciones rápidas
- **Gestión de Menú**: Agregar, editar y eliminar elementos del menú de navegación
- **Sistema de Blog**: CRUD completo para artículos con editor de contenido
- **Páginas Dinámicas**: Crear páginas personalizadas con bloques de contenido
- **Autenticación**: Sistema de login seguro con roles de usuario

### Sistema de Blog
- ✅ Crear, editar y eliminar posts
- ✅ Sistema de categorías y etiquetas
- ✅ Imágenes destacadas
- ✅ Borradores y publicación
- ✅ Vista pública del blog
- ✅ Páginas individuales de posts

### Páginas Dinámicas
- ✅ Editor de bloques de contenido
- ✅ Múltiples tipos de bloques (Hero, Texto, Imagen, Galería, etc.)
- ✅ Plantillas predefinidas
- ✅ SEO optimizado
- ✅ Vista previa en tiempo real

## 🔐 Acceso Administrativo

### Credenciales de Prueba

**Administrador:**
- Email: `admin@ast.com`
- Contraseña: `admin123`

**Editor:**
- Email: `editor@ast.com`
- Contraseña: `editor123`

### URL del Panel Admin
```
http://localhost:5173/admin/login
```

## 📁 Estructura del Proyecto

```
src/
├── features/admin/          # Componentes del panel administrativo
│   └── pages/
│       ├── AdminDashboard.tsx
│       ├── AdminLogin.tsx
│       ├── BlogEditor.tsx
│       ├── BlogManagement.tsx
│       ├── MenuManagement.tsx
│       ├── PageEditor.tsx
│       └── PageManagement.tsx
├── features/blog/           # Componentes del blog público
│   └── pages/
│       ├── BlogPage.tsx
│       └── BlogPostPage.tsx
├── context/                 # Contextos de estado global
│   ├── AuthContext.tsx
│   └── ContentContext.tsx
├── components/
│   ├── DynamicPage.tsx      # Renderizador de páginas dinámicas
│   └── ProtectedRoute.tsx   # Protección de rutas admin
├── layouts/
│   └── AdminLayout.tsx      # Layout del panel admin
├── hooks/                   # Hooks personalizados
│   ├── useAuth.ts
│   └── useContent.ts
└── types/
    └── content.ts           # Tipos TypeScript
```

## 🎯 Cómo Usar el Sistema

### 1. Gestión del Menú de Navegación

1. Ve a `/admin/menu`
2. Haz clic en "Agregar Elemento" para nuevos items
3. Configura:
   - **Título**: Nombre que aparece en el menú
   - **Ruta**: URL de la página (ej: `/mi-pagina`)
   - **Tipo de Contenido**: Página, Blog, Enlace Externo, etc.
   - **Orden**: Posición en el menú
4. Guarda los cambios

### 2. Crear Páginas Personalizadas

1. Ve a `/admin/pages`
2. Haz clic en "Nueva Página"
3. Selecciona una plantilla o comienza desde cero
4. Agrega bloques de contenido:
   - **Hero**: Sección principal con título y fondo
   - **Texto**: Párrafos de contenido
   - **Imagen**: Imágenes con descripción
   - **Galería**: Colección de imágenes
   - **Tarjetas**: Secciones con información estructurada
   - **Contacto**: Formularios de contacto
5. Configura SEO (meta título y descripción)
6. Publica o guarda como borrador

### 3. Gestionar el Blog

1. Ve a `/admin/blog`
2. Haz clic en "Nuevo Post"
3. Completa la información:
   - **Título**: Título del artículo
   - **Slug**: URL amigable (se genera automáticamente)
   - **Resumen**: Descripción corta
   - **Contenido**: Texto principal (soporta Markdown)
   - **Imagen Destacada**: URL de la imagen principal
   - **Categoría**: Clasificación del post
   - **Etiquetas**: Tags relacionados
4. Publica o guarda como borrador

### 4. Plantillas Disponibles

#### Página de Aterrizaje
- Sección Hero con call-to-action
- Bloques de características
- Perfecto para servicios o productos

#### Sobre Nosotros
- Historia de la empresa
- Información del equipo
- Valores corporativos

#### Contacto
- Formulario de contacto
- Información de la empresa
- Mapa de ubicación

## 🛠 Personalización

### Agregar Nuevos Tipos de Bloques

1. Edita `src/types/content.ts` para agregar el nuevo tipo
2. Actualiza `PageEditor.tsx` para incluir el editor del bloque
3. Modifica `DynamicPage.tsx` para renderizar el nuevo bloque

### Modificar Estilos

El sistema usa Tailwind CSS. Puedes personalizar:
- Colores del tema en el panel admin
- Layouts de los bloques de contenido
- Estilos del blog público

### Integrar con Backend

Actualmente el sistema usa localStorage para persistencia. Para producción:

1. Reemplaza las funciones en `ContentContext.tsx`
2. Implementa llamadas a tu API REST/GraphQL
3. Actualiza el sistema de autenticación

## 🚀 Comandos de Desarrollo

```bash
# Instalar dependencias
bun install

# Iniciar servidor de desarrollo
bun dev

# Construir para producción
bun build

# Vista previa de producción
bun preview
```

## 📝 Notas Importantes

### Persistencia de Datos
- Los datos se almacenan en localStorage del navegador
- En producción, integra con tu backend preferido
- Los menús se cargan desde `MenuNavItems.json` inicialmente

### SEO
- Las páginas dinámicas incluyen meta tags básicos
- Considera usar React Helmet para SEO avanzado
- Los slugs se generan automáticamente pero son editables

### Seguridad
- El sistema de autenticación es básico para demostración
- En producción, implementa JWT o similar
- Valida permisos en el backend

### Escalabilidad
- El sistema está diseñado para ser modular
- Fácil agregar nuevos tipos de contenido
- Componentes reutilizables

## 🤝 Contribuir

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -am 'Agrega nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para detalles.