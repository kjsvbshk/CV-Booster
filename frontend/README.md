# CV-Booster Frontend

Frontend de la aplicación CV-Booster desarrollado con React, TypeScript y Tailwind CSS.

## 🚀 Características

- **Transformación de ofertas de trabajo** con IA
- **Subida de archivos PDF y Markdown** con drag & drop
- **Modo oscuro/claro** con persistencia
- **Diseño responsivo** y moderno
- **Animaciones fluidas** con Framer Motion
- **Integración con servicios de IA**

## 🛠️ Tecnologías

- **React 19** con TypeScript
- **Vite** para desarrollo rápido
- **Tailwind CSS** para estilos
- **Framer Motion** para animaciones
- **PDF.js** para procesamiento de PDFs
- **Lucide React** para iconos

## 📦 Instalación

```bash
cd frontend
npm install
```

## 🚀 Desarrollo

```bash
npm run dev
```

## 🏗️ Build

```bash
npm run build
```

## 📁 Estructura

```
frontend/
├── src/
│   ├── components/          # Componentes React
│   ├── context/            # Contextos de React
│   ├── services/           # Servicios de API
│   ├── types/              # Tipos de TypeScript
│   ├── utils/              # Utilidades
│   ├── App.tsx
│   └── main.tsx
├── public/                 # Archivos estáticos
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## 🔧 Variables de Entorno

```env
VITE_API_URL=http://localhost:8000/api
VITE_AI_SERVICE_URL=https://api.openai.com/v1
VITE_JWT_SECRET=your-secret-key
```

## 📝 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run preview` - Preview del build
- `npm run lint` - Linting del código
