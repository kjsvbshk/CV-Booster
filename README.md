# CV-Booster Frontend

Aplicación frontend para CV-Booster, una herramienta de optimización de CVs usando IA.

## 🚀 Características

- **Autenticación completa** con JWT y cookies seguras
- **Optimización de CVs** con análisis de ofertas de trabajo
- **Interfaz moderna** con Tailwind CSS y Framer Motion
- **Responsive design** para todos los dispositivos
- **Modo oscuro** integrado
- **Protección de rutas** automática

## 🛠️ Tecnologías

- **React 19** con TypeScript
- **Vite** como bundler
- **Tailwind CSS** para estilos
- **Framer Motion** para animaciones
- **React Router** para navegación
- **Axios** para peticiones HTTP
- **js-cookie** para gestión de cookies

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualizar build de producción
npm run preview
```

## 🔧 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Construcción para producción
- `npm run preview` - Previsualizar build
- `npm run lint` - Verificar código con ESLint
- `npm run lint:fix` - Corregir errores de ESLint
- `npm run type-check` - Verificar tipos TypeScript
- `npm run clean` - Limpiar directorio dist

## 🌐 Variables de Entorno

Crea un archivo `.env.local` basado en `env.example`:

```env
VITE_API_BASE_URL=https://cv-booster-backend.onrender.com
VITE_NODE_ENV=production
```

## 🚀 Despliegue en Vercel

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en el dashboard de Vercel
3. El build se ejecutará automáticamente

### Variables de Entorno en Vercel

- `VITE_API_BASE_URL`: URL base de la API (`https://cv-booster-backend.onrender.com`)
- `VITE_NODE_ENV`: Entorno de ejecución (`production`)

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── auth/           # Componentes de autenticación
│   ├── DarkModeToggle.tsx
│   ├── FileUpload.tsx
│   ├── Instructions.tsx
│   ├── JobOffer.tsx
│   ├── ProtectedRoute.tsx
│   ├── Result.tsx
│   └── TransformButton.tsx
├── contexts/           # Contextos de React
│   └── AuthContext.tsx
├── hooks/             # Hooks personalizados
│   └── useAuthCheck.ts
├── pages/             # Páginas de la aplicación
│   ├── AppPage.tsx
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   └── RegisterPage.tsx
├── services/          # Servicios de API
│   └── api.ts
├── types/             # Tipos TypeScript
│   └── api.ts
├── utils/             # Utilidades
│   └── cookies.ts
├── config/            # Configuraciones
│   └── api.ts
├── App.tsx            # Componente principal
├── main.tsx           # Punto de entrada
└── index.css          # Estilos globales
```

## 🔐 Autenticación

La aplicación usa un sistema de autenticación basado en JWT con cookies seguras:

- **Login/Registro** con validación de formularios
- **Protección de rutas** automática
- **Persistencia de sesión** con cookies
- **Logout** con limpieza de estado

## 🎨 Estilos

- **Tailwind CSS** para estilos utilitarios
- **Modo oscuro** con `dark:` prefix
- **Responsive design** con breakpoints
- **Animaciones** con Framer Motion

## 📱 Responsive Design

- **Mobile First** approach
- **Breakpoints**: sm, md, lg, xl
- **Componentes adaptativos** para todos los tamaños

## 🚀 Optimizaciones de Producción

- **Code splitting** automático
- **Minificación** con Terser
- **Tree shaking** para eliminar código no usado
- **Chunks manuales** para mejor caching
- **Source maps** deshabilitados en producción

## 🔧 Configuración de Vercel

El proyecto incluye configuración específica para Vercel:

- `vercel.json` - Configuración de despliegue
- `.vercelignore` - Archivos a ignorar
- **Build command**: `npm run build`
- **Output directory**: `dist`

## 📄 Licencia

Este proyecto es privado y confidencial.