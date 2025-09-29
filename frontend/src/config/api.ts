// Configuración de la API
export const API_CONFIG = {
  // URL base del backend FastAPI (usando proxy para evitar CORS)
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  
  // Configuración de timeouts
  TIMEOUT: 300000, // 5 minutos - tiempo suficiente para procesamiento de IA
  
  // Configuración de polling
  POLLING_INTERVAL: 2000, // 2 segundos
  MAX_POLLING_ATTEMPTS: 30, // Máximo 1 minuto de polling
  
  // Headers por defecto
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
  
  // Configuración específica para axios
  AXIOS_CONFIG: {
    timeout: 300000, // 5 minutos - tiempo suficiente para procesamiento de IA
    withCredentials: false,
    validateStatus: (status: number) => status < 500, // Resolver para códigos < 500
  }
};

// Función para verificar si estamos en desarrollo
export const isDevelopment = import.meta.env.DEV;

// Función para obtener la URL base según el entorno
export const getApiBaseUrl = (): string => {
  if (isDevelopment) {
    return API_CONFIG.BASE_URL;
  }
  
  // En producción, usar la URL del backend real
  return import.meta.env.VITE_API_BASE_URL || 'https://tu-backend-produccion.com/api';
};
