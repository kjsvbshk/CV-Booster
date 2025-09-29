import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/logo.svg';

const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

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

    // Validar email
    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // Validar términos y condiciones
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Debes aceptar los términos y condiciones';
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
      await register({
        email: formData.email,
        password: formData.password
      });
      
      // Redirigir al dashboard después del registro exitoso
      navigate('/app');
    } catch (error: any) {
      console.error('Error en el registro:', error);
      
      // Manejar errores específicos del servidor
      if (error.message?.includes('Email already registered')) {
        setErrors({ email: 'Este correo electrónico ya está registrado' });
      } else {
        setErrors({ general: error.message || 'Error al crear la cuenta. Inténtalo de nuevo.' });
      }
    } finally {
      setIsLoading(false);
    }
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
                <h1 className="text-3xl font-bold text-sunglo-800 dark:text-sunglo-100 mb-2">
                  ¡Crea tu cuenta!
                </h1>
                <p className="text-sunglo-600 dark:text-sunglo-300">
                  Únete a CV-Booster y transforma tu carrera profesional
                </p>
              </div>

              {errors.general && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-lg"
                >
                  {errors.general}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-sunglo-700 dark:text-sunglo-300 mb-2">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sunglo-400 dark:text-sunglo-500 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="tu@email.com"
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl bg-white dark:bg-sunglo-700 text-sunglo-800 dark:text-sunglo-100 placeholder-sunglo-400 dark:placeholder-sunglo-400 focus:outline-none transition-colors duration-200 ${
                        errors.email
                          ? 'border-red-400 dark:border-red-600'
                          : 'border-sunglo-200 dark:border-sunglo-600 focus:border-sunglo-400 dark:focus:border-sunglo-400'
                      }`}
                      required
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-sunglo-700 dark:text-sunglo-300 mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sunglo-400 dark:text-sunglo-500 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Mínimo 6 caracteres"
                      className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl bg-white dark:bg-sunglo-700 text-sunglo-800 dark:text-sunglo-100 placeholder-sunglo-400 dark:placeholder-sunglo-400 focus:outline-none transition-colors duration-200 ${
                        errors.password
                          ? 'border-red-400 dark:border-red-600'
                          : 'border-sunglo-200 dark:border-sunglo-600 focus:border-sunglo-400 dark:focus:border-sunglo-400'
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sunglo-400 dark:text-sunglo-500 hover:text-sunglo-600 dark:hover:text-sunglo-300"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-sunglo-700 dark:text-sunglo-300 mb-2">
                    Confirmar Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sunglo-400 dark:text-sunglo-500 w-5 h-5" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Repite tu contraseña"
                      className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl bg-white dark:bg-sunglo-700 text-sunglo-800 dark:text-sunglo-100 placeholder-sunglo-400 dark:placeholder-sunglo-400 focus:outline-none transition-colors duration-200 ${
                        errors.confirmPassword
                          ? 'border-red-400 dark:border-red-600'
                          : 'border-sunglo-200 dark:border-sunglo-600 focus:border-sunglo-400 dark:focus:border-sunglo-400'
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sunglo-400 dark:text-sunglo-500 hover:text-sunglo-600 dark:hover:text-sunglo-300"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        name="acceptTerms"
                        id="acceptTerms"
                        checked={formData.acceptTerms}
                        onChange={handleInputChange}
                        className={`w-4 h-4 rounded focus:ring-sunglo-500 dark:focus:ring-sunglo-400 ${
                          errors.acceptTerms
                            ? 'text-red-600 bg-red-100 dark:bg-red-900 border-red-400 dark:border-red-600'
                            : 'text-sunglo-500 bg-sunglo-100 dark:bg-sunglo-700 border-sunglo-300 dark:border-sunglo-600'
                        }`}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="acceptTerms" className="text-sunglo-600 dark:text-sunglo-300">
                        Acepto los{' '}
                        <a href="#" className="text-sunglo-500 dark:text-sunglo-400 hover:text-sunglo-700 dark:hover:text-sunglo-300 underline">
                          términos y condiciones
                        </a>{' '}
                        y la{' '}
                        <a href="#" className="text-sunglo-500 dark:text-sunglo-400 hover:text-sunglo-700 dark:hover:text-sunglo-300 underline">
                          política de privacidad
                        </a>
                      </label>
                    </div>
                  </div>
                  {errors.acceptTerms && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.acceptTerms}</p>
                  )}
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
                      <span>Creando cuenta...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Crear cuenta</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </form>

              <div className="text-center text-sunglo-600 dark:text-sunglo-300">
                ¿Ya tienes una cuenta?{' '}
                <Link
                  to="/login"
                  className="text-sunglo-500 dark:text-sunglo-400 hover:text-sunglo-700 dark:hover:text-sunglo-300 font-semibold"
                >
                  Inicia sesión aquí
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
              <p className="text-lg opacity-90 mb-6">
                Transforma tu carrera profesional con el poder de la IA
              </p>
              <div className="space-y-4 text-left">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <span>Optimización automática de CVs</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <span>Análisis inteligente de ofertas</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <span>Adaptación a ATS</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <span>Resultados instantáneos</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
