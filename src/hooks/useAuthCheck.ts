import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CookieManager } from '../utils/cookies';

/**
 * Hook personalizado para verificar el estado de autenticación
 * y manejar redirecciones automáticas
 */
export const useAuthCheck = () => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Verificar si hay un token válido en las cookies
        const hasValidToken = CookieManager.hasValidToken();
        const token = CookieManager.getAccessToken();
        const userInfo = CookieManager.getUserInfo();

        if (hasValidToken && token && userInfo) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          // Limpiar cookies si el token no es válido
          CookieManager.clearAuth();
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error);
        setIsAuthenticated(false);
        CookieManager.clearAuth();
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, []);

  /**
   * Redirige al login si no está autenticado
   */
  const requireAuth = () => {
    if (!isChecking && !isAuthenticated) {
      navigate('/login', { 
        state: { from: location.pathname },
        replace: true 
      });
    }
  };

  /**
   * Redirige al dashboard si ya está autenticado
   */
  const redirectIfAuthenticated = () => {
    if (!isChecking && isAuthenticated) {
      const from = location.state?.from || '/app';
      navigate(from, { replace: true });
    }
  };

  return {
    isChecking,
    isAuthenticated,
    requireAuth,
    redirectIfAuthenticated,
  };
};

export default useAuthCheck;
