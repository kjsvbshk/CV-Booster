import axios, { AxiosError } from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import { CookieManager } from '../utils/cookies';
import type { 
  TransformRequest, 
  TransformResponse, 
  ResultResponse, 
  ApiError,
  AnalyzeJobRequest,
  AnalyzeJobResponse,
  GenerateCVRequest,
  GenerateCVResponse,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RegisterResponse,
  User,
  UsageHistoryResponse
} from '../types/api';
import { API_CONFIG } from '../config/api';

class ApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
      timeout: API_CONFIG.AXIOS_CONFIG.timeout,
      withCredentials: API_CONFIG.AXIOS_CONFIG.withCredentials,
      validateStatus: API_CONFIG.AXIOS_CONFIG.validateStatus,
      headers: API_CONFIG.DEFAULT_HEADERS
    });

    // Interceptor para requests
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Agregar token de autenticación si está disponible en cookies
        const token = CookieManager.getAccessToken();
        if (token && CookieManager.hasValidToken()) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor para responses
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        // Manejar errores de autenticación
        if (error.response?.status === 401) {
          // Limpiar cookies y redirigir al login
          CookieManager.clearAuth();
          this.clearAuthToken();
          
          // Solo redirigir si no estamos ya en la página de login
          if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(this.handleAxiosError(error));
      }
    );
  }

  /**
   * Configura el token de autenticación en las peticiones
   */
  setAuthToken(token: string): void {
    this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Limpia el token de autenticación
   */
  clearAuthToken(): void {
    delete this.axiosInstance.defaults.headers.common['Authorization'];
  }

  private handleAxiosError(error: AxiosError): ApiError {
    const apiError: ApiError = {
      message: this.getErrorMessage(error),
      status: error.response?.status || 500,
      code: error.code
    };
    return apiError;
  }

  private async makeRequest<T>(method: 'GET' | 'POST', endpoint: string, data?: any, isFormData: boolean = false): Promise<T> {
    try {
      const config = {
        method,
        url: endpoint,
        data: data,
        headers: isFormData ? {} : API_CONFIG.DEFAULT_HEADERS
      };

      const response = await this.axiosInstance.request<T>(config);
      return response.data;
    } catch (error: any) {
      console.error(`Error in ${method} ${endpoint}:`, error);
      throw error;
    }
  }

  private getErrorMessage(error: any): string {
    // Manejar errores de axios
    if (error.response) {
      const status = error.response.status;
      switch (status) {
        case 400:
          return 'Datos de entrada inválidos. Verifica la información enviada.';
        case 401:
          return 'No autorizado. Verifica tus credenciales.';
        case 403:
          return 'Acceso denegado. No tienes permisos para esta acción.';
        case 404:
          return 'Recurso no encontrado. Verifica la URL del endpoint.';
        case 408:
          return 'Tiempo de espera agotado. El servidor tardó demasiado en responder.';
        case 429:
          return 'Demasiadas peticiones. Intenta de nuevo más tarde.';
        case 500:
          return 'Error interno del servidor. Intenta de nuevo más tarde.';
        case 502:
          return 'Error de conexión con el servidor. El servidor no está disponible.';
        case 503:
          return 'Servicio no disponible temporalmente. Intenta de nuevo más tarde.';
        default:
          return `Error del servidor (${status}). Intenta de nuevo.`;
      }
    } else if (error.request) {
      // Error de red
      return 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
    } else if (error.code === 'ECONNABORTED') {
      return 'Tiempo de espera agotado. El servidor tardó demasiado en responder.';
    } else {
      return error.message || 'Error al procesar la petición. Intenta de nuevo.';
    }
  }

  /**
   * Analiza una oferta de trabajo (Paso 1 del flujo)
   */
  async analyzeJob(data: AnalyzeJobRequest): Promise<AnalyzeJobResponse> {
    try {
      const formData = new URLSearchParams();
      formData.append('job_description', data.job_description);
      if (data.keywords) {
        formData.append('keywords', data.keywords);
      }
      
      const response = await this.axiosInstance.post<AnalyzeJobResponse>('/cv-boost/analyze_job', formData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout: 300000, // 5 minutos para análisis
      });
      
      return response.data;
    } catch (error: any) {
      throw this.handleAxiosError(error);
    }
  }

  /**
   * Genera el CV adaptado (Paso 2 del flujo)
   */
  async generateCV(data: GenerateCVRequest): Promise<GenerateCVResponse> {
    const formData = new FormData();
    formData.append('job_id', data.job_id);
    formData.append('cv', data.cv);
    
    // Solo agregar confirm_keywords si tiene valor
    if (data.confirm_keywords && data.confirm_keywords.trim() !== '') {
      formData.append('confirm_keywords', data.confirm_keywords);
    }
    
    // Solo agregar options si tiene valor
    if (data.options && data.options.trim() !== '') {
      formData.append('options', data.options);
    }
    
    try {
      const response = await this.axiosInstance.post<GenerateCVResponse>('/cv-boost/generate_cv/strict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 300000, // 5 minutos para generación de CV
      });
      return response.data;
    } catch (error: any) {
      throw this.handleAxiosError(error);
    }
  }

  /**
   * Envía los datos para transformar el CV (DEPRECATED - usar analyzeJob + generateCV)
   */
  async transformCV(data: TransformRequest): Promise<TransformResponse> {
    console.log('Enviando datos para transformar:', data);
    return await this.makeRequest<TransformResponse>('POST', '/transform', data);
  }

  /**
   * Obtiene el resultado del procesamiento
   */
  async getResult(jobId: string): Promise<ResultResponse> {
    console.log('Obteniendo resultado para jobId:', jobId);
    return await this.makeRequest<ResultResponse>('GET', `/result/${jobId}`);
  }

  /**
   * Inicia el polling automático para obtener el resultado
   */
  async pollForResult(
    jobId: string, 
    onUpdate: (result: ResultResponse) => void,
    onComplete: (result: ResultResponse) => void,
    onError: (error: ApiError) => void
  ): Promise<void> {
    let pollingActive = true;
    let pollCount = 0;
    const maxPolls = 30; // Máximo 1 minuto de polling

    const poll = async (): Promise<void> => {
      if (!pollingActive) return;

      try {
        pollCount++;
        console.log(`Polling intento ${pollCount} para jobId: ${jobId}`);
        
        const result = await this.getResult(jobId);
        onUpdate(result);

        if (result.status === 'completed') {
          console.log('Procesamiento completado');
          pollingActive = false;
          onComplete(result);
          return;
        }

        if (result.status === 'failed') {
          console.log('Procesamiento falló');
          pollingActive = false;
          onError({
            message: result.error || 'El procesamiento falló',
            status: 500
          });
          return;
        }

        // Si hemos alcanzado el máximo de polls, parar
        if (pollCount >= maxPolls) {
          console.log('Máximo de polls alcanzado');
          pollingActive = false;
          onError({
            message: 'Tiempo de espera agotado. El procesamiento está tardando más de lo esperado.',
            status: 408
          });
          return;
        }

        // Si aún está procesando, continuar el polling
        if (pollingActive) {
          console.log(`Continuando polling en ${API_CONFIG.POLLING_INTERVAL}ms`);
          setTimeout(poll, API_CONFIG.POLLING_INTERVAL);
        }
      } catch (error) {
        console.error('Error en polling:', error);
        pollingActive = false;
        onError(error as ApiError);
      }
    };

    // Iniciar el polling
    console.log('Iniciando polling para jobId:', jobId);
    setTimeout(poll, API_CONFIG.POLLING_INTERVAL);
  }

  /**
   * Verifica si el servidor está disponible
   */
  async healthCheck(): Promise<boolean> {
    try {
      console.log('Verificando salud del servidor...');
      await this.axiosInstance.get('/');
      console.log('Servidor está disponible');
      return true;
    } catch (error) {
      console.error('Servidor no disponible:', error);
      return false;
    }
  }

  // ==================== MÉTODOS DE AUTENTICACIÓN ====================

  /**
   * Inicia sesión con email y contraseña
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await this.axiosInstance.post<AuthResponse>('/auth/login-user', data);
      return response.data;
    } catch (error: any) {
      throw this.handleAxiosError(error);
    }
  }

  /**
   * Registra un nuevo usuario
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await this.axiosInstance.post<RegisterResponse>('/auth/register-user', data);
      return response.data;
    } catch (error: any) {
      throw this.handleAxiosError(error);
    }
  }

  /**
   * Cierra la sesión del usuario
   */
  async logout(): Promise<{ ok: boolean; message: string }> {
    try {
      const response = await this.axiosInstance.post('/auth/logout-user');
      return response.data;
    } catch (error: any) {
      throw this.handleAxiosError(error);
    }
  }

  /**
   * Obtiene la información del usuario actual
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await this.axiosInstance.get<User>('/auth/me');
      return response.data;
    } catch (error: any) {
      throw this.handleAxiosError(error);
    }
  }

  /**
   * Obtiene el historial de uso del usuario
   */
  async getUsageHistory(): Promise<UsageHistoryResponse> {
    try {
      const response = await this.axiosInstance.get<UsageHistoryResponse>('/cv-boost/usage_history');
      return response.data;
    } catch (error: any) {
      throw this.handleAxiosError(error);
    }
  }
}

// Instancia singleton del servicio
export const apiService = new ApiService();
export default apiService;