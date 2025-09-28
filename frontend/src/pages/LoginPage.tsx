import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import logo from '../assets/logo.svg';

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login data:', formData);
    // Aquí implementaremos la lógica de login
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
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-sunglo-700 dark:text-sunglo-300 mb-2">Correo Electrónico</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Ingresa tu correo"
                  className="w-full p-4 border-2 border-sunglo-200 dark:border-sunglo-600 rounded-xl bg-white dark:bg-sunglo-700 text-sunglo-800 dark:text-sunglo-100 placeholder-sunglo-400 dark:placeholder-sunglo-400 focus:border-sunglo-400 dark:focus:border-sunglo-400 focus:outline-none transition-colors duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-sunglo-700 dark:text-sunglo-300 mb-2">Contraseña</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="********"
                  className="w-full p-4 border-2 border-sunglo-200 dark:border-sunglo-600 rounded-xl bg-white dark:bg-sunglo-700 text-sunglo-800 dark:text-sunglo-100 placeholder-sunglo-400 dark:placeholder-sunglo-400 focus:border-sunglo-400 dark:focus:border-sunglo-400 focus:outline-none transition-colors duration-200"
                  required
                />
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

              <button type="submit" className="w-full py-4 bg-sunglo-500 hover:bg-sunglo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                Iniciar sesión
              </button>
            </form>
            
            <form onSubmit={handleGoogleLogin} className="mt-6">
              <button type="submit" className="w-full py-4 bg-white dark:bg-sunglo-700 text-sunglo-600 dark:text-sunglo-300 font-semibold rounded-xl border-2 border-sunglo-200 dark:border-sunglo-600 hover:border-sunglo-400 dark:hover:border-sunglo-400 transition-all duration-300 flex items-center justify-center space-x-2">
                <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIyLjU2IDEyLjI1QzIyLjU2IDExLjQ3IDIyLjQ5IDEwLjcyIDIyLjM2IDEwSDEyVjE0LjI2SDE3LjkyQzE3LjY2IDE1LjYzIDE2Ljg4IDE2Ljc5IDE1LjcxIDE3LjU3VjIwLjM0SDE5LjI5QzIxLjM3IDE4LjQyIDIyLjU2IDE1LjUyIDIyLjU2IDEyLjI1WiIgZmlsbD0iIzQyODVGNCIvPgo8cGF0aCBkPSJNMTIgMjNDMTQuOTcgMjMgMTcuNDYgMjIuMDIgMTkuMjggMjAuMzRMMTUuNzEgMTcuNTdDMTQuNzMgMTguMjMgMTMuNDggMTguNjMgMTIgMTguNjNDOS4xNCAxOC42MyA2LjcxIDE2LjcgNS44NCAxNC4wOUgyLjE4VjE2LjkzQzMuOTkgMjAuNTMgNy43IDIzIDEyIDIzWiIgZmlsbD0iIzM0QTg1MyIvPgo8cGF0aCBkPSJNNS44NCAxNC4wOUM1LjYyIDEzLjQzIDUuNDkgMTIuNzMgNS40OSAxMkM1LjQ5IDExLjI3IDUuNjIgMTAuNTcgNS44NCA5LjkxVjcuMDdIMi4xOEMxLjQzIDguNTUgMSAxMC4yMiAxIDEyQzEgMTMuNzggMS40MyAxNS40NSAyLjE4IDE2LjkzTDUuODQgMTQuMDlaIiBmaWxsPSIjRkJCNzA1Ii8+CjxwYXRoIGQ9Ik0xMiA1LjM4QzEzLjYyIDUuMzggMTUuMDYgNS45NCAxNi4yMSA3LjAyTDE5LjI4IDMuOTVDMTcuNDUgMi4wOSAxNC45NyAxIDEyIDFDNy43IDEgMy45OSAzLjQ3IDIuMTggNy4wN0w1Ljg0IDkuOTFDNi43MSA3LjQ5IDkuMTQgNS4zOCAxMiA1LjM4WiIgZmlsbD0iI0VBNDMzNSIvPgo8L3N2Zz4K" alt="Google" className="w-5 h-5" />
                <span>Iniciar sesión con Google</span>
              </button>
            </form>

            <div className="text-center text-sunglo-600 dark:text-sunglo-300">
              ¿No tienes una cuenta? <a href="#" className="text-sunglo-500 dark:text-sunglo-400 hover:text-sunglo-700 dark:hover:text-sunglo-300 font-semibold">Regístrate gratis</a>
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
