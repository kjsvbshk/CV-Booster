// Tipos para las peticiones de la API

// Request para analizar oferta de trabajo
export interface AnalyzeJobRequest {
  job_description: string;
  keywords?: string;
}

// Response del análisis de oferta de trabajo
export interface AnalyzeJobResponse {
  job_id: string;
  extractor_json: Record<string, any>;
  message: string;
}

// Request para generar CV
export interface GenerateCVRequest {
  job_id: string;
  cv: File; // Archivo CV es obligatorio, no puede ser null o undefined
  confirm_keywords?: string;
  options?: string; // Instrucciones adicionales
}

// Response de la generación de CV
export interface GenerateCVResponse {
  extractor_json: Record<string, any>;
  cv_markdown: string;
  postprocess_checks: Record<string, any>;
  obfuscation_mapping: Record<string, any>;
}

// Tipos para autenticación
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
}

export interface User {
  id: string;
  email: string;
  is_active: boolean;
  is_email_confirmed: boolean;
  created_at?: string;
  updated_at?: string;
}

// Tipos legacy para compatibilidad (deprecated)
export interface TransformRequest {
  fileContent?: string;
  jobOffer: string;
  instructions?: string;
  fileName?: string;
}

export interface TransformResponse {
  success: boolean;
  jobId: string;
  message: string;
}

export interface ResultResponse {
  success: boolean;
  status: 'processing' | 'completed' | 'failed';
  result?: string;
  error?: string;
  progress?: number;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// Estados del polling
export type PollingStatus = 'idle' | 'polling' | 'completed' | 'error';

// Configuración de la API
export interface ApiConfig {
  baseURL: string;
  timeout: number;
  retryAttempts: number;
  pollingInterval: number;
}

// Tipos para el historial de uso
export interface UsageHistoryItem {
  id: number;
  request_id: string;
  model: string;
  endpoint: string;
  latency_ms: number;
  result: string;
  result_length: number;
  created_at: string;
}

export interface UsageHistoryPagination {
  total_records: number;
  returned_records: number;
  limit: number;
  offset: number;
  has_more: boolean;
}

export interface UsageHistoryFilters {
  endpoint_filter: string | null;
  model_filter: string | null;
  include_full_result: boolean;
}

export interface UsageHistoryResponse {
  success: boolean;
  data: {
    history: UsageHistoryItem[];
    pagination: UsageHistoryPagination;
    filters_applied: UsageHistoryFilters;
  };
}
