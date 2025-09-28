import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, Brain, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br dark:from-sunglo-900 from-sunglo-50 via-sunglo-100 to-sunglo-200 dark:via-sunglo-800 dark:to-sunglo-700">
      {/* Header */}
      <motion.header
        className="bg-white/95 dark:bg-sunglo-800/95 backdrop-blur-sm border-b border-sunglo-200 dark:border-sunglo-700"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <a href="#" className="flex items-center space-x-3 text-sunglo-800 dark:text-sunglo-100 font-bold text-xl">
              <img src={logo} alt="CV-Booster Logo" className="h-10 w-auto" />
              <span>CV-Booster</span>
            </a>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-sunglo-600 dark:text-sunglo-300 hover:text-sunglo-800 dark:hover:text-sunglo-100 transition-colors">Inicio</a>
              <a href="#" className="text-sunglo-600 dark:text-sunglo-300 hover:text-sunglo-800 dark:hover:text-sunglo-100 transition-colors">Características</a>
              <a href="#" className="text-sunglo-600 dark:text-sunglo-300 hover:text-sunglo-800 dark:hover:text-sunglo-100 transition-colors">Acerca de</a>
            </nav>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section
        className="py-20 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            className="text-5xl md:text-6xl font-bold text-sunglo-800 dark:text-sunglo-100 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Transforma tu carrera profesional
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-sunglo-600 dark:text-sunglo-300 mb-12 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Utiliza el poder de la inteligencia artificial para optimizar tu CV y destacar en el mercado laboral.
            Analiza ofertas de trabajo y mejora tu perfil profesional de manera inteligente.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <motion.button
              onClick={handleGoToLogin}
              className="px-8 py-4 bg-sunglo-500 hover:bg-sunglo-600 text-white font-semibold rounded-xl flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Comenzar ahora</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>

            <button className="px-8 py-4 bg-white dark:bg-sunglo-800 text-sunglo-600 dark:text-sunglo-300 font-semibold rounded-xl border-2 border-sunglo-200 dark:border-sunglo-600 hover:border-sunglo-400 dark:hover:border-sunglo-400 transition-all duration-300">
              Ver demo
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-sunglo-800/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-4xl font-bold text-center mb-16 text-sunglo-800 dark:text-sunglo-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Características principales
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FileText className="w-12 h-12" />,
                title: "Análisis de CV",
                description: "Analiza tu CV y identifica áreas de mejora usando inteligencia artificial."
              },
              {
                icon: <Brain className="w-12 h-12" />,
                title: "IA Avanzada",
                description: "Utiliza modelos de IA de última generación para análisis precisos."
              },
              {
                icon: <Users className="w-12 h-12" />,
                title: "Comunidad",
                description: "Conecta con otros profesionales y comparte experiencias."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-sunglo-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-sunglo-200 dark:border-sunglo-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 + index * 0.2 }}
                whileHover={{ y: -5 }}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-sunglo-100 dark:bg-sunglo-700 rounded-full flex items-center justify-center mx-auto mb-6 text-sunglo-600 dark:text-sunglo-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-sunglo-800 dark:text-sunglo-100 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-sunglo-600 dark:text-sunglo-300">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-20 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-4xl font-bold mb-6 text-sunglo-800 dark:text-sunglo-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            ¿Listo para transformar tu carrera?
          </motion.h2>

          <motion.p
            className="text-xl mb-8 text-sunglo-600 dark:text-sunglo-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Únete a miles de profesionales que ya están usando CV-Booster para destacar en el mercado laboral.
          </motion.p>

          <motion.button
            onClick={handleGoToLogin}
            className="px-8 py-4 bg-sunglo-500 hover:bg-sunglo-600 text-white font-semibold rounded-xl flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300 mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Comenzar gratis</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        className="py-12 px-4 sm:px-6 lg:px-8 bg-sunglo-800 dark:bg-sunglo-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.6 }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img src={logo} alt="CV-Booster Logo" className="h-8 w-auto" />
            <h3 className="text-xl font-bold text-sunglo-100">CV-Booster</h3>
          </div>
          <p className="text-sunglo-300">
            © 2024 CV-Booster. Todos los derechos reservados.
          </p>
        </div>
      </motion.footer>
    </div>
  );
};

export default HomePage;
