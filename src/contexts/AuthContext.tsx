import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { apiService } from '../services/api';
import { CookieManager } from '../utils/cookies';
import type { User, LoginRequest, RegisterRequest, AuthResponse } from '../types/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!token;

  // Cargar token de cookies al inicializar
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Verificar si hay un token válido en las cookies
        if (CookieManager.hasValidToken()) {
          const savedToken = CookieManager.getAccessToken();
          const savedUserInfo = CookieManager.getUserInfo();
          
          if (savedToken) {
            setToken(savedToken);
            apiService.setAuthToken(savedToken);
            
            // Si tenemos información del usuario en cookies, usarla
            if (savedUserInfo) {
              setUser({
                id: savedUserInfo.id,
                email: savedUserInfo.email,
                is_active: true,
                is_email_confirmed: true
              });
            }
          }
        } else {
          // Token expirado, limpiar cookies
          CookieManager.clearAuth();
        }
      } catch (error) {
        console.error('Error inicializando autenticación:', error);
        CookieManager.clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Cargar información del usuario cuando hay token
  useEffect(() => {
    if (token && !user) {
      refreshUser();
    }
  }, [token, user]);

  const login = async (data: LoginRequest): Promise<void> => {
    try {
      setIsLoading(true);
      const response: AuthResponse = await apiService.login(data);
      
      // Guardar token en cookies
      setToken(response.access_token);
      CookieManager.setAccessToken(response.access_token);
      
      // Configurar token en axios
      apiService.setAuthToken(response.access_token);
      
      // Cargar información del usuario con un pequeño delay para asegurar que el token esté propagado
      setTimeout(async () => {
        try {
          await refreshUser();
        } catch (error) {
          console.error('Error al cargar usuario después del login:', error);
          // No lanzar el error aquí para no interrumpir el flujo de login
        }
      }, 100);
      
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest): Promise<void> => {
    try {
      setIsLoading(true);
      await apiService.register(data);
      // Después del registro, hacer login automático
      await login(data);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      if (token) {
        await apiService.logout();
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      // Limpiar estado local y cookies independientemente del resultado del servidor
      setUser(null);
      setToken(null);
      CookieManager.clearAuth();
      apiService.clearAuthToken();
    }
  };

  const refreshUser = async (): Promise<void> => {
    if (!token) return;
    
    try {
      const userData = await apiService.getCurrentUser();
      setUser(userData);
      
      // Guardar información del usuario en cookies para persistencia
      CookieManager.setUserInfo({
        id: userData.id,
        email: userData.email
      });
    } catch (error) {
      console.error('Error al cargar usuario:', error);
      // Si hay error al cargar el usuario, probablemente el token expiró
      await logout();
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
