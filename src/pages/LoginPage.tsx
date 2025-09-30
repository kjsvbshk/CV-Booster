import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAuthCheck } from '../hooks/useAuthCheck';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/logo.svg';

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const { redirectIfAuthenticated } = useAuthCheck();
  const navigate = useNavigate();

  // Redirigir si ya está autenticado (solo al cargar la página)
  useEffect(() => {
    redirectIfAuthenticated();
  }, [redirectIfAuthenticated]);

  // Redirigir después de un login exitoso
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await login({
        email: formData.email,
        password: formData.password
      });
      
      // La redirección se maneja automáticamente en el useEffect
    } catch (error: any) {
      console.error('Error en el login:', error);
      
      // Manejar errores específicos del servidor
      if (error.message?.includes('Invalid credentials')) {
        setErrors({ general: 'Credenciales inválidas. Verifica tu email y contraseña.' });
      } else {
        setErrors({ general: error.message || 'Error al iniciar sesión. Inténtalo de nuevo.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Google login');
    // Aquí implementaremos la lógica de Google login
  };

  return (
    <div className="min-h-screen bg-gradient-to-br dark:from-sunglo-900 from-sunglo-50 via-sunglo-100 to-sunglo-200 dark:via-sunglo-800 dark:to-sunglo-700 flex items-center justify-center p-4">
      <motion.div
        className="bg-white dark:bg-sunglo-800 rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/2 p-8 lg:p-12">
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="text-center lg:text-left">
                <h1 className="text-3xl font-bold text-sunglo-800 dark:text-sunglo-100 mb-2">¡Bienvenido de nuevo!</h1>
                <p className="text-sunglo-600 dark:text-sunglo-300">Por favor, ingresa tus datos.</p>
              </div>

              {errors.general && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-lg flex items-center space-x-2"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{errors.general}</span>
                </motion.div>
              )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-sunglo-700 dark:text-sunglo-300 mb-2">Correo Electrónico</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Ingresa tu correo"
                  className={`w-full p-4 border-2 rounded-xl bg-white dark:bg-sunglo-700 text-sunglo-800 dark:text-sunglo-100 placeholder-sunglo-400 dark:placeholder-sunglo-400 focus:outline-none transition-colors duration-200 ${
                    errors.email
                      ? 'border-red-400 dark:border-red-600'
                      : 'border-sunglo-200 dark:border-sunglo-600 focus:border-sunglo-400 dark:focus:border-sunglo-400'
                  }`}
                  required
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-sunglo-700 dark:text-sunglo-300 mb-2">Contraseña</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="********"
                    className={`w-full p-4 pr-12 border-2 rounded-xl bg-white dark:bg-sunglo-700 text-sunglo-800 dark:text-sunglo-100 placeholder-sunglo-400 dark:placeholder-sunglo-400 focus:outline-none transition-colors duration-200 ${
                      errors.password
                        ? 'border-red-400 dark:border-red-600'
                        : 'border-sunglo-200 dark:border-sunglo-600 focus:border-sunglo-400 dark:focus:border-sunglo-400'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sunglo-400 hover:text-sunglo-600 dark:text-sunglo-500 dark:hover:text-sunglo-300 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="remember"
                    id="check"
                    checked={formData.remember}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-sunglo-500 bg-sunglo-100 dark:bg-sunglo-700 border-sunglo-300 dark:border-sunglo-600 rounded focus:ring-sunglo-500 dark:focus:ring-sunglo-400"
                  />
                  <label htmlFor="check" className="ml-2 text-sm text-sunglo-600 dark:text-sunglo-300">Recordarme</label>
                </div>
                <a href="#" className="text-sm text-sunglo-500 dark:text-sunglo-400 hover:text-sunglo-700 dark:hover:text-sunglo-300">¿Olvidaste tu contraseña?</a>
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className={`w-full py-4 font-semibold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
                  isLoading
                    ? 'bg-sunglo-300 dark:bg-sunglo-600 text-sunglo-500 dark:text-sunglo-400 cursor-not-allowed'
                    : 'bg-sunglo-500 hover:bg-sunglo-600 text-white hover:shadow-xl'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Iniciando sesión...</span>
                  </>
                ) : (
                  <>
                    <span>Iniciar sesión</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </form>
            
            <form onSubmit={handleGoogleLogin} className="mt-6">
              <button type="submit" className="w-full py-4 bg-white dark:bg-sunglo-700 text-sunglo-600 dark:text-sunglo-300 font-semibold rounded-xl border-2 border-sunglo-200 dark:border-sunglo-600 hover:border-sunglo-400 dark:hover:border-sunglo-400 transition-all duration-300 flex items-center justify-center space-x-2">
                <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIyLjU2IDEyLjI1QzIyLjU2IDExLjQ3IDIyLjQ5IDEwLjcyIDIyLjM2IDEwSDEyVjE0LjI2SDE3LjkyQzE3LjY2IDE1LjYzIDE2Ljg4IDE2Ljc5IDE1LjcxIDE3LjU3VjIwLjM0SDE5LjI5QzIxLjM3IDE4LjQyIDIyLjU2IDE1LjUyIDIyLjU2IDEyLjI1WiIgZmlsbD0iIzQyODVGNCIvPgo8cGF0aCBkPSJNMTIgMjNDMTQuOTcgMjMgMTcuNDYgMjIuMDIgMTkuMjggMjAuMzRMMTUuNzEgMTcuNTdDMTQuNzMgMTguMjMgMTMuNDggMTguNjMgMTIgMTguNjNDOS4xNCAxOC42MyA2LjcxIDE2LjcgNS44NCAxNC4wOUgyLjE4VjE2LjkzQzMuOTkgMjAuNTMgNy43IDIzIDEyIDIzWiIgZmlsbD0iIzM0QTg1MyIvPgo8cGF0aCBkPSJNNS44NCAxNC4wOUM1LjYyIDEzLjQzIDUuNDkgMTIuNzMgNS40OSAxMkM1LjQ5IDExLjI3IDUuNjIgMTAuNTcgNS44NCA5LjkxVjcuMDdIMi4xOEMxLjQzIDguNTUgMSAxMC4yMiAxIDEyQzEgMTMuNzggMS40MyAxNS40NSAyLjE4IDE2LjkzTDUuODQgMTQuMDlaIiBmaWxsPSIjRkJCNzA1Ii8+CjxwYXRoIGQ9Ik0xMiA1LjM4QzEzLjYyIDUuMzggMTUuMDYgNS45NCAxNi4yMSA3LjAyTDE5LjI4IDMuOTVDMTcuNDUgMi4wOSAxNC45NyAxIDEyIDFDNy43IDEgMy45OSAzLjQ3IDIuMTggNy4wN0w1Ljg0IDkuOTFDNi43MSA3LjQ5IDkuMTQgNS4zOCAxMiA1LjM4WiIgZmlsbD0iI0VBNDMzNSIvPgo8L3N2Zz4K" alt="Google" className="w-5 h-5" />
                <span>Iniciar sesión con Google</span>
              </button>
            </form>

            <div className="text-center text-sunglo-600 dark:text-sunglo-300">
              ¿No tienes una cuenta?{' '}
              <Link
                to="/register"
                className="text-sunglo-500 dark:text-sunglo-400 hover:text-sunglo-700 dark:hover:text-sunglo-300 font-semibold"
              >
                Regístrate gratis
              </Link>
            </div>
            </motion.div>
          </div>

          <div className="lg:w-1/2 bg-gradient-to-br from-sunglo-500 to-sunglo-600 dark:from-sunglo-700 dark:to-sunglo-800 p-8 lg:p-12 flex items-center justify-center">
            <motion.div
              className="text-center text-white"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
                <img src={logo} alt="CV-Booster Logo" className="h-20 w-auto" />
              </div>
              <h2 className="text-3xl font-bold mb-4">CV-Booster</h2>
              <p className="text-lg opacity-90">Transforma tu carrera profesional con el poder de la IA</p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
