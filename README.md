# CV-Booster

Sistema inteligente para transformar ofertas de trabajo utilizando IA, desarrollado con React, TypeScript, FastAPI y bases de datos.

## 🚀 Características Principales

- **Transformación inteligente** de ofertas de trabajo con IA
- **Subida de archivos** PDF y Markdown con drag & drop
- **Análisis automático** de compatibilidad CV-Oferta
- **Modo oscuro/claro** con persistencia
- **Diseño responsivo** y moderno
- **Autenticación JWT** segura
- **API REST** con FastAPI
- **Base de datos** PostgreSQL/SQLite

## 🏗️ Arquitectura del Proyecto

```
CV-Booster/
├── frontend/              # Aplicación React (Frontend)
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── context/       # Contextos de React
│   │   ├── services/      # Servicios de API
│   │   └── types/         # Tipos de TypeScript
│   └── package.json
├── backend/               # API FastAPI (Backend) - Próximamente
│   ├── app/
│   │   ├── models/        # Modelos de base de datos
│   │   ├── routes/        # Endpoints de la API
│   │   └── services/      # Lógica de negocio
│   └── requirements.txt
└── README.md
```

## 🛠️ Tecnologías

### Frontend
- **React 19** con TypeScript
- **Vite** para desarrollo rápido
- **Tailwind CSS** para estilos
- **Framer Motion** para animaciones
- **PDF.js** para procesamiento de PDFs

### Backend (Próximamente)
- **FastAPI** para la API REST
- **PostgreSQL/SQLite** para base de datos
- **JWT** para autenticación
- **Pydantic** para validación de datos

### IA/ML
- **OpenAI API** para análisis de texto
- **Hugging Face** para procesamiento de lenguaje natural
- **Análisis de sentimientos** en ofertas de trabajo

## 🚀 Instalación y Desarrollo

### Frontend
```bash
# Instalar dependencias
npm run install:frontend

# Desarrollo
npm run dev

# Build
npm run build
```

### Backend (Próximamente)
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## 📋 Requisitos del Proyecto

- ✅ **Frontend responsivo** con excelente UX/UI
- 🔄 **Endpoints CRUD** en FastAPI (en desarrollo)
- 🔄 **Autenticación JWT** (en desarrollo)
- 🔄 **Integración con IA** (en desarrollo)
- 🔄 **Despliegue en producción** (en desarrollo)

## 🎯 Funcionalidades Implementadas

### Frontend
- ✅ Subida de archivos PDF y Markdown
- ✅ Editor de ofertas de trabajo
- ✅ Modo oscuro/claro
- ✅ Animaciones fluidas
- ✅ Diseño responsivo
- ✅ Validación de formularios

### Próximas Funcionalidades
- 🔄 Sistema de autenticación
- 🔄 Dashboard de usuario
- 🔄 Historial de transformaciones
- 🔄 Análisis con IA
- 🔄 API REST completa

## 📝 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo del frontend
- `npm run build` - Build de producción
- `npm run install:frontend` - Instalar dependencias del frontend
- `npm run lint` - Linting del código

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.