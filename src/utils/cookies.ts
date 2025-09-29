import Cookies from 'js-cookie';

// Configuración de cookies para tokens JWT
const COOKIE_CONFIG = {
  // Cookie para el token de acceso
  ACCESS_TOKEN: 'cv_booster_access_token',
  // Cookie para información del usuario
  USER_INFO: 'cv_booster_user_info',
  // Configuración de seguridad
  SECURE_OPTIONS: {
    secure: import.meta.env.PROD, // Solo HTTPS en producción
    sameSite: 'strict' as const, // Protección CSRF
    httpOnly: false, // Accesible desde JavaScript (necesario para SPA)
    expires: 1, // 7 días de expiración
  }
};

export class CookieManager {
  /**
   * Guarda el token de acceso en una cookie segura
   */
  static setAccessToken(token: string): void {
    Cookies.set(COOKIE_CONFIG.ACCESS_TOKEN, token, COOKIE_CONFIG.SECURE_OPTIONS);
  }

  /**
   * Obtiene el token de acceso de la cookie
   */
  static getAccessToken(): string | undefined {
    return Cookies.get(COOKIE_CONFIG.ACCESS_TOKEN);
  }

  /**
   * Elimina el token de acceso de la cookie
   */
  static removeAccessToken(): void {
    Cookies.remove(COOKIE_CONFIG.ACCESS_TOKEN);
  }

  /**
   * Guarda información del usuario en una cookie
   */
  static setUserInfo(userInfo: { id: string; email: string }): void {
    Cookies.set(COOKIE_CONFIG.USER_INFO, JSON.stringify(userInfo), COOKIE_CONFIG.SECURE_OPTIONS);
  }

  /**
   * Obtiene la información del usuario de la cookie
   */
  static getUserInfo(): { id: string; email: string } | null {
    const userInfo = Cookies.get(COOKIE_CONFIG.USER_INFO);
    if (!userInfo) return null;
    
    try {
      return JSON.parse(userInfo);
    } catch {
      return null;
    }
  }

  /**
   * Elimina la información del usuario de la cookie
   */
  static removeUserInfo(): void {
    Cookies.remove(COOKIE_CONFIG.USER_INFO);
  }

  /**
   * Limpia todas las cookies de autenticación
   */
  static clearAuth(): void {
    this.removeAccessToken();
    this.removeUserInfo();
  }

  /**
   * Verifica si hay un token válido en las cookies
   */
  static hasValidToken(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    try {
      // Decodificar el JWT para verificar expiración
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp > now;
    } catch {
      return false;
    }
  }

  /**
   * Obtiene el tiempo de expiración del token
   */
  static getTokenExpiration(): Date | null {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return new Date(payload.exp * 1000);
    } catch {
      return null;
    }
  }
}

export default CookieManager;
