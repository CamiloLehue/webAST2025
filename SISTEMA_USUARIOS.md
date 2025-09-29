# Sistema de Gestión de Usuarios y Roles - AST Technology

Este documento describe el nuevo sistema de gestión de usuarios y roles implementado para la aplicación web de AST Technology.

## 📋 Funcionalidades Implementadas

### 🔐 Sistema de Roles
- **Administrador**: Acceso completo al sistema, incluyendo gestión de usuarios
- **Editor**: Acceso limitado, solo puede editar contenido pero no gestionar usuarios

### 👥 Gestión de Usuarios
- **Crear usuarios**: Formulario completo con validaciones
- **Editar usuarios**: Modificar información, rol y estado
- **Eliminar usuarios**: Con confirmación de seguridad
- **Activar/Desactivar usuarios**: Control de acceso
- **Listado con filtros**: Búsqueda por nombre, email, rol y estado
- **Paginación**: Para manejar grandes cantidades de usuarios

### 🛡️ Sistema de Permisos
Los permisos se asignan automáticamente según el rol:

#### Administrador
- ✅ Crear usuarios
- ✅ Editar usuarios
- ✅ Eliminar usuarios
- ✅ Ver usuarios
- ✅ Gestionar roles
- ✅ Acceso al panel admin
- ✅ Editar contenido
- ✅ Publicar contenido
- ✅ Eliminar contenido

#### Editor
- ❌ Crear usuarios
- ❌ Editar usuarios
- ❌ Eliminar usuarios
- ❌ Ver usuarios
- ❌ Gestionar roles
- ✅ Acceso al panel admin
- ✅ Editar contenido
- ✅ Publicar contenido
- ❌ Eliminar contenido

## 📁 Estructura del Feature

```
src/features/admin/user-management/
├── types/
│   └── userTypes.ts          # Tipos TypeScript y constantes
├── services/
│   └── userService.ts        # Servicios para llamadas a API
├── hooks/
│   └── useUserManagement.ts  # Hook personalizado para gestión
├── components/
│   ├── UserForm.tsx          # Formulario de usuario
│   ├── UserTable.tsx         # Tabla de usuarios
│   ├── UserFilters.tsx       # Filtros de búsqueda
│   └── Pagination.tsx        # Componente de paginación
└── index.ts                  # Exportaciones del feature
```

## 🌐 Endpoints de API

El sistema se conecta al backend mediante los siguientes endpoints:

### Base URL
```
VITE_API_URL=http://localhost:8000/api
```

### Endpoints de Usuarios
- **GET** `/usuarios` - Obtener lista de usuarios con filtros
- **GET** `/usuarios/{id}` - Obtener usuario por ID
- **GET** `/usuarios/me` - Obtener usuario actual
- **POST** `/usuarios` - Crear nuevo usuario
- **PUT** `/usuarios/{id}` - Actualizar usuario
- **DELETE** `/usuarios/{id}` - Eliminar usuario
- **PATCH** `/usuarios/{id}/toggle-status` - Cambiar estado de usuario
- **PUT** `/usuarios/{id}/cambiar-password` - Cambiar contraseña

### Parámetros de Filtro (Query Parameters)
- `search`: Búsqueda por nombre o email
- `role`: Filtrar por rol (administrador/editor)
- `status`: Filtrar por estado (activo/inactivo/suspendido)
- `sortBy`: Ordenar por (name/email/createdAt/lastLogin)
- `sortOrder`: Orden (asc/desc)
- `page`: Página actual
- `limit`: Elementos por página

## 🔧 Configuración y Uso

### 1. Acceso al Sistema
Los usuarios pueden acceder con las siguientes credenciales de demo:

**Administrador:**
- Email: admin@ast.com
- Password: admin123

**Editor:**
- Email: editor@ast.com
- Password: editor123

### 2. Navegación
- Panel de administración: `/admin`
- Gestión de usuarios: `/admin/users` (solo para administradores)

### 3. Funcionalidades por Rol

#### Para Administradores:
1. **Crear Usuario**: Botón "Crear Usuario" en `/admin/users`
2. **Editar Usuario**: Clic en "Editar" en la tabla
3. **Eliminar Usuario**: Clic en "Eliminar" con confirmación
4. **Cambiar Estado**: Activar/Desactivar usuarios
5. **Filtrar y Buscar**: Usar los filtros superiores

#### Para Editores:
- Acceso limitado sin gestión de usuarios
- Solo pueden editar contenido del blog y páginas

## 🎨 Componentes UI

### UserForm
- Formulario reactivo con validaciones
- Soporte para creación y edición
- Validación de emails y contraseñas
- Manejo de errores

### UserTable
- Tabla responsive con información completa
- Badges de estado y rol con colores
- Acciones contextuales
- Formato de fechas localizado

### UserFilters
- Búsqueda en tiempo real con debounce
- Filtros por rol y estado
- Ordenamiento configurable
- Paginación ajustable

### Pagination
- Navegación inteligente de páginas
- Botones de anterior/siguiente
- Indicador de página actual
- Responsive para móviles

## 🔄 Estado y Context

El sistema utiliza:
- **AuthContext**: Para autenticación y permisos
- **useUserManagement**: Hook personalizado para operaciones CRUD
- Estados locales para formularios y filtros

## 📱 Responsive Design

- Diseño mobile-first
- Tablas con scroll horizontal en móviles
- Formularios adaptados a pantallas pequeñas
- Navegación touch-friendly

## 🧪 Testing y Validaciones

### Validaciones Implementadas
- Formato de email válido
- Contraseñas mínimo 6 caracteres
- Confirmación de contraseña
- Campos obligatorios
- Validación de roles y estados

### Manejo de Errores
- Mensajes de error claros
- Indicadores de carga
- Confirmaciones para acciones destructivas
- Rollback en caso de error

## 🚀 Próximas Mejoras

1. **Cambio de contraseña**: Formulario dedicado
2. **Auditoría**: Log de acciones de usuarios
3. **Roles personalizados**: Sistema más flexible
4. **Notificaciones**: Email para nuevos usuarios
5. **Sesiones**: Gestión de sesiones activas
6. **2FA**: Autenticación de dos factores

## 📞 Contacto y Soporte

Para preguntas sobre la implementación:
- Desarrollador: CamiloLehue
- Repository: webAST2025
- Branch: lastConfigs