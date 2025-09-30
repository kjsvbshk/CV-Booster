# CV-Booster - Sistema de Optimización de CVs con IA

## 📋 Descripción del Sistema

**CV-Booster** es una aplicación web moderna que utiliza inteligencia artificial para optimizar currículums vitae (CVs) basándose en ofertas de trabajo específicas. El sistema analiza las ofertas de trabajo, extrae palabras clave relevantes y tecnologías, y genera CVs adaptados que maximizan las posibilidades de pasar los filtros ATS (Applicant Tracking Systems).

### 🎯 Objetivos del Sistema

- **Análisis inteligente** de ofertas de trabajo para extraer requisitos clave
- **Optimización automática** de CVs para posiciones específicas
- **Adaptación ATS** para mejorar la visibilidad en sistemas de reclutamiento
- **Interfaz intuitiva** que facilita el proceso de optimización
- **Historial de uso** para seguimiento de optimizaciones realizadas

### ✨ Características Principales

- **Autenticación completa** con JWT y cookies seguras
- **Análisis de ofertas** con extracción de keywords y tecnologías
- **Generación de CVs** adaptados usando IA
- **Interfaz moderna** con modo oscuro y responsive design
- **Protección de rutas** y gestión de sesiones
- **Historial de uso** con visualización detallada de resultados
- **Validación de formularios** en tiempo real

## 🏗️ Arquitectura del Sistema

### Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                        CV-Booster System                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────┐ │
│  │   Frontend      │    │    Backend      │    │   Database  │ │
│  │   (React)       │    │   (FastAPI)     │    │ (PostgreSQL)│ │
│  │                 │    │                 │    │             │ │
│  │ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────┐ │ │
│  │ │   Vercel    │ │    │ │   Render    │ │    │ │  Cloud  │ │ │
│  │ │   (CDN)     │ │    │ │  (Server)   │ │    │ │   DB    │ │ │
│  │ └─────────────┘ │    │ └─────────────┘ │    │ └─────────┘ │ │
│  └─────────────────┘    └─────────────────┘    └─────────────┘ │
│           │                        │                    │      │
│           └────────────────────────┼────────────────────┘      │
│                                    │                          │
│  ┌─────────────────────────────────┼─────────────────────────┐ │
│  │            AI Services          │                         │ │
│  │  ┌─────────────────────────────┐│                         │ │
│  │  │    Analysis Model           ││                         │ │
│  │  │  (Job Description Parser)   ││                         │ │
│  │  └─────────────────────────────┘│                         │ │
│  │  ┌─────────────────────────────┐│                         │ │
│  │  │   Generation Model          ││                         │ │
│  │  │    (CV Optimizer)           ││                         │ │
│  │  └─────────────────────────────┘│                         │ │
│  └─────────────────────────────────┼─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Flujo de Usuario

```
1. Login/Register
   │
   ▼
2. Dashboard Principal
   │
   ▼
3. Subir CV + Oferta de Trabajo
   │
   ▼
4. Análisis de Oferta
   │
   ▼
5. Confirmación de Keywords
   │
   ▼
6. Generación de CV Optimizado
   │
   ▼
7. Descarga/Visualización de Resultado
   │
   ▼
8. Historial de Uso
```

## 🚀 Instrucciones para Levantar en Local

### Prerrequisitos

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Git** para clonar el repositorio

### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd CV-Booster
```

### 2. Instalar Dependencias

```bash
# Instalar dependencias del frontend
npm install
```

### 3. Configurar Variables de Entorno

Crear archivo `.env.local` en la raíz del proyecto:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000
VITE_NODE_ENV=development

# Opcional: Configuración específica para desarrollo
VITE_DEBUG=true
```

### 4. Ejecutar el Frontend

```bash
# Modo desarrollo
npm run dev

# El servidor se ejecutará en http://localhost:5173
```

### 5. Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo con hot reload
npm run build           # Construir para producción
npm run preview         # Previsualizar build de producción
npm run lint            # Verificar código con ESLint
npm run lint:fix        # Corregir errores de ESLint automáticamente
npm run type-check      # Verificar tipos TypeScript
npm run clean           # Limpiar directorio dist
```

### 6. Configuración del Proxy (Desarrollo)

El proyecto incluye configuración de proxy en `vite.config.ts` para desarrollo local:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',  // Backend local
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

## 📁 Estructura del Proyecto

```
CV-Booster/
├── public/                 # Archivos estáticos
│   └── logo.svg
├── src/
│   ├── components/         # Componentes reutilizables
│   │   ├── DarkModeToggle.tsx
│   │   ├── FileUpload.tsx
│   │   ├── Instructions.tsx
│   │   ├── JobOffer.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── Result.tsx
│   │   └── TransformButton.tsx
│   ├── contexts/           # Contextos de React
│   │   └── AuthContext.tsx
│   ├── hooks/             # Hooks personalizados
│   │   └── useAuthCheck.ts
│   ├── pages/             # Páginas de la aplicación
│   │   ├── AppPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── HistoryPage.tsx
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── services/          # Servicios de API
│   │   └── api.ts
│   ├── types/             # Tipos TypeScript
│   │   └── api.ts
│   ├── utils/             # Utilidades
│   │   └── cookies.ts
│   ├── config/            # Configuraciones
│   │   └── api.ts
│   ├── assets/            # Recursos estáticos
│   │   └── logo.svg
│   ├── App.tsx            # Componente principal
│   ├── main.tsx           # Punto de entrada
│   └── index.css          # Estilos globales
├── api/                   # Función serverless para proxy
│   └── proxy.js
├── dist/                  # Build de producción (generado)
├── node_modules/          # Dependencias (generado)
├── .env.example          # Ejemplo de variables de entorno
├── .gitignore            # Archivos a ignorar en Git
├── eslint.config.js      # Configuración de ESLint
├── index.html            # HTML principal
├── package.json          # Dependencias y scripts
├── postcss.config.js     # Configuración de PostCSS
├── tailwind.config.js    # Configuración de Tailwind
├── tsconfig.json         # Configuración de TypeScript
├── tsconfig.app.json     # Configuración de TypeScript para app
├── tsconfig.node.json    # Configuración de TypeScript para Node
├── vercel.json           # Configuración de Vercel
└── vite.config.ts        # Configuración de Vite
```

## 🛠️ Stack Tecnológico

### Frontend
- **React 19** - Framework de UI
- **TypeScript** - Tipado estático
- **Vite** - Bundler y dev server
- **Tailwind CSS** - Framework de estilos
- **Framer Motion** - Animaciones
- **React Router v7** - Enrutamiento
- **Axios** - Cliente HTTP
- **js-cookie** - Gestión de cookies
- **Lucide React** - Iconos

### Herramientas de Desarrollo
- **ESLint** - Linter de código
- **PostCSS** - Procesador de CSS
- **Terser** - Minificador de JavaScript
- **Autoprefixer** - Prefijos CSS automáticos

### Despliegue
- **Vercel** - Hosting del frontend
- **Render** - Hosting del backend
- **PostgreSQL** - Base de datos

## 🔐 Autenticación

La aplicación usa un sistema de autenticación basado en JWT con cookies seguras:

- **Login/Registro** con validación de formularios
- **Protección de rutas** automática
- **Persistencia de sesión** con cookies
- **Logout** con limpieza de estado

## 🎨 Estilos y Temas

- **Tailwind CSS** para estilos utilitarios
- **Modo oscuro** con `dark:` prefix
- **Responsive design** con breakpoints
- **Animaciones** con Framer Motion
- **Iconos** vectoriales (Lucide React)

## 📱 Responsive Design

- **Mobile First** approach
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Componentes adaptativos** para todos los dispositivos
- **Touch-friendly** interfaces

## 🚀 Despliegue en Producción

### Vercel (Frontend)

1. **Conectar repositorio** a Vercel
2. **Configurar variables de entorno**:
   - `VITE_API_BASE_URL`: URL del backend en producción
   - `VITE_NODE_ENV`: `production`
3. **Deploy automático** en cada push a main

### Configuración de Vercel

```json
{
  "version": 2,
  "name": "cv-booster-frontend",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/proxy.js"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "env": {
    "VITE_API_BASE_URL": "/api",
    "VITE_NODE_ENV": "production"
  }
}
```

## 🧪 Testing y Calidad de Código

### ESLint
```bash
npm run lint        # Verificar código
npm run lint:fix    # Corregir automáticamente
```

### TypeScript
```bash
npm run type-check  # Verificar tipos
```

### Build de Producción
```bash
npm run build       # Construir para producción
npm run preview     # Previsualizar build
```

## 🔄 Flujo de Datos

```
Usuario
  │
  ▼
┌─────────────────┐
│   Frontend      │
│   (React SPA)   │
└─────────┬───────┘
          │
          │ HTTP/HTTPS
          ▼
┌─────────────────┐
│   API Gateway   │
│   (Vercel)      │
└─────────┬───────┘
          │
          │ Proxy
          ▼
┌─────────────────┐
│   Backend API   │
│   (FastAPI)     │
└─────────┬───────┘
          │
          │
          ▼
┌─────────────────┐
│   AI Services   │
│   (Analysis +   │
│   Generation)   │
└─────────┬───────┘
          │
          │
          ▼
┌─────────────────┐
│   Database      │
│   (PostgreSQL)  │
└─────────────────┘
```

## 🛡️ Seguridad

- **JWT** para autenticación
- **Cookies seguras** con flags httpOnly y secure
- **CORS** configurado correctamente
- **Validación** de formularios en frontend y backend
- **Sanitización** de inputs
- **HTTPS** en producción

## 📊 Performance

- **Code splitting** automático
- **Lazy loading** de componentes
- **Tree shaking** para eliminar código no usado
- **Chunks manuales** para mejor caching
- **Minificación** y compresión
- **CDN** global con Vercel

## 📄 Licencia

Este proyecto es privado y confidencial.

---

**Versión del documento**: 1.0.0  
**Última actualización**: Diciembre 2024