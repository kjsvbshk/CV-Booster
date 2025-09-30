import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, Database, Zap, FileText, Calendar, Hash, ExternalLink, X, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import type { UsageHistoryResponse, UsageHistoryItem } from '../types/api';
import logo from '../assets/logo.svg';

const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [historyData, setHistoryData] = useState<UsageHistoryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [modalItem, setModalItem] = useState<UsageHistoryItem | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await apiService.getUsageHistory();
      setHistoryData(data);
    } catch (err: any) {
      console.error('Error loading history:', err);
      if (err.status === 404) {
        setError('El endpoint de historial no está disponible en el servidor');
      } else if (err.status === 401) {
        setError('No tienes permisos para acceder al historial');
      } else {
        setError(err.message || 'Error al cargar el historial');
      }
    } finally {
      setIsLoading(false);
    }
  };


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatLatency = (latency: number) => {
    if (latency < 1000) {
      return `${latency}ms`;
    }
    return `${(latency / 1000).toFixed(1)}s`;
  };

  const getEndpointIcon = (endpoint: string) => {
    if (endpoint.includes('analyze_job')) {
      return <Database className="w-4 h-4" />;
    } else if (endpoint.includes('generate_cv')) {
      return <FileText className="w-4 h-4" />;
    }
    return <Zap className="w-4 h-4" />;
  };

  const getEndpointName = (endpoint: string) => {
    if (endpoint.includes('analyze_job')) {
      return 'Análisis de Oferta';
    } else if (endpoint.includes('generate_cv')) {
      return 'Generación de CV';
    }
    return endpoint;
  };

  const truncateResult = (result: string, maxLength: number = 200) => {
    if (result.length <= maxLength) return result;
    return result.substring(0, maxLength) + '...';
  };


  const formatJsonToText = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return jsonString;
    }
  };

  const renderAnalysisResult = (item: UsageHistoryItem) => {
    if (item.endpoint.includes('analyze_job')) {
      const formattedJson = formatJsonToText(item.result);
      return (
        <div className="space-y-3">
          <div className="bg-sunglo-100 dark:bg-sunglo-600 rounded-lg p-3">
            <h5 className="font-semibold text-sunglo-800 dark:text-sunglo-200 mb-2">Análisis de Oferta</h5>
            <pre className="text-sm text-sunglo-700 dark:text-sunglo-300 whitespace-pre-wrap overflow-x-auto">
              {truncateResult(formattedJson, 300)}
            </pre>
          </div>
        </div>
      );
    }
    
    // Para CVs generados, mostrar preview del markdown
    if (item.endpoint.includes('generate_cv')) {
      return (
        <div className="space-y-3">
          <div className="bg-sunglo-100 dark:bg-sunglo-600 rounded-lg p-3">
            <h5 className="font-semibold text-sunglo-800 dark:text-sunglo-200 mb-2">CV Generado</h5>
            <div className="text-sm text-sunglo-700 dark:text-sunglo-300">
              <div className="prose prose-sm max-w-none">
                <div dangerouslySetInnerHTML={{ 
                  __html: item.result
                    .replace(/^# (.*$)/gim, '<h1 class="text-lg font-bold text-sunglo-800 dark:text-sunglo-100 mb-2">$1</h1>')
                    .replace(/^## (.*$)/gim, '<h2 class="text-base font-semibold text-sunglo-700 dark:text-sunglo-200 mb-1">$1</h2>')
                    .replace(/^### (.*$)/gim, '<h3 class="text-sm font-medium text-sunglo-600 dark:text-sunglo-300 mb-1">$1</h3>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-sunglo-800 dark:text-sunglo-100">$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em class="italic text-sunglo-600 dark:text-sunglo-300">$1</em>')
                    .replace(/\n/g, '<br>')
                    .substring(0, 300) + '...'
                }} />
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    // Fallback para otros tipos de resultados
    return (
      <pre className="text-sm text-sunglo-700 dark:text-sunglo-300 whitespace-pre-wrap overflow-x-auto">
        {truncateResult(item.result, 300)}
      </pre>
    );
  };

  const openModal = (item: UsageHistoryItem) => {
    setModalItem(item);
  };

  const closeModal = () => {
    setModalItem(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br dark:from-sunglo-900 from-sunglo-50 via-sunglo-100 to-sunglo-200 dark:via-sunglo-800 dark:to-sunglo-700 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sunglo-500 mx-auto mb-4"></div>
          <p className="text-sunglo-600 dark:text-sunglo-300">Cargando historial...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br dark:from-sunglo-900 from-sunglo-50 via-sunglo-100 to-sunglo-200 dark:via-sunglo-800 dark:to-sunglo-700 py-8 px-4">
      <div className="container-responsive">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={() => navigate('/app')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 text-sunglo-600 dark:text-sunglo-300 hover:text-sunglo-800 dark:hover:text-sunglo-100 hover:bg-sunglo-100 dark:hover:bg-sunglo-700 rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver</span>
            </motion.button>
            <div className="flex items-center space-x-3">
              <img src={logo} alt="CV-Booster Logo" className="h-10 w-auto" />
              <h1 className="text-3xl font-bold dark:text-sunglo-100 text-sunglo-800">
                Historial de Uso
              </h1>
            </div>
          </div>
        </motion.div>

        {/* Error Display */}
        {error && (
          <motion.div 
            className="max-w-4xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-xl p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <p className="text-red-700 dark:text-red-300 font-medium">
                  Error: {error}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats */}
        {historyData && historyData.data && historyData.data.pagination && (
          <motion.div 
            className="max-w-4xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-sunglo-800 rounded-xl p-6 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-sunglo-100 dark:bg-sunglo-700 rounded-lg">
                    <Hash className="w-5 h-5 text-sunglo-600 dark:text-sunglo-300" />
                  </div>
                  <div>
                    <p className="text-sm text-sunglo-600 dark:text-sunglo-400">Total de Registros</p>
                    <p className="text-2xl font-bold text-sunglo-800 dark:text-sunglo-100">
                      {historyData.data.pagination.total_records || 0}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-sunglo-800 rounded-xl p-6 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-sunglo-100 dark:bg-sunglo-700 rounded-lg">
                    <Clock className="w-5 h-5 text-sunglo-600 dark:text-sunglo-300" />
                  </div>
                  <div>
                    <p className="text-sm text-sunglo-600 dark:text-sunglo-400">Tiempo Promedio</p>
                    <p className="text-2xl font-bold text-sunglo-800 dark:text-sunglo-100">
                      {historyData.data.history && historyData.data.history.length > 0 
                        ? formatLatency(
                            historyData.data.history.reduce((acc, item) => acc + item.latency_ms, 0) / 
                            historyData.data.history.length
                          )
                        : '0ms'
                      }
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-sunglo-800 rounded-xl p-6 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-sunglo-100 dark:bg-sunglo-700 rounded-lg">
                    <FileText className="w-5 h-5 text-sunglo-600 dark:text-sunglo-300" />
                  </div>
                  <div>
                    <p className="text-sm text-sunglo-600 dark:text-sunglo-400">CVs Generados</p>
                    <p className="text-2xl font-bold text-sunglo-800 dark:text-sunglo-100">
                      {historyData.data.history ? 
                        historyData.data.history.filter(item => item.endpoint.includes('generate_cv')).length 
                        : 0
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* History List */}
        {historyData && historyData.data && historyData.data.history && historyData.data.history.length > 0 ? (
          <motion.div 
            className="max-w-4xl mx-auto space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {historyData.data.history.map((item: UsageHistoryItem, index: number) => (
              <motion.div
                key={item.id}
                className="bg-white dark:bg-sunglo-800 rounded-xl shadow-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-sunglo-100 dark:bg-sunglo-700 rounded-lg">
                        {getEndpointIcon(item.endpoint)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-sunglo-800 dark:text-sunglo-100">
                          {getEndpointName(item.endpoint)}
                        </h3>
                        <p className="text-sm text-sunglo-600 dark:text-sunglo-400">
                          ID: {item.request_id.substring(0, 8)}...
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm text-sunglo-600 dark:text-sunglo-400">Latencia</p>
                        <p className="font-semibold text-sunglo-800 dark:text-sunglo-100">
                          {formatLatency(item.latency_ms)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-sunglo-600 dark:text-sunglo-400">Tamaño</p>
                        <p className="font-semibold text-sunglo-800 dark:text-sunglo-100">
                          {item.result_length} chars
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 text-sm text-sunglo-600 dark:text-sunglo-400">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(item.created_at)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-sunglo-600 dark:text-sunglo-400">
                      <Zap className="w-4 h-4" />
                      <span>{item.model}</span>
                    </div>
                  </div>
                  
                  <div className="bg-sunglo-50 dark:bg-sunglo-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-sunglo-800 dark:text-sunglo-200">
                        {item.endpoint.includes('analyze_job') ? 'Análisis de Oferta' : 'Resultado'}
                      </h4>
                      <motion.button
                        onClick={() => openModal(item)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center space-x-1 text-sunglo-600 dark:text-sunglo-400 hover:text-sunglo-800 dark:hover:text-sunglo-200 transition-colors duration-200 px-3 py-1 rounded-lg hover:bg-sunglo-100 dark:hover:bg-sunglo-600"
                      >
                        <span className="text-sm font-medium">Ver más</span>
                        <ExternalLink className="w-4 h-4" />
                      </motion.button>
                    </div>
                    {renderAnalysisResult(item)}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="max-w-4xl mx-auto text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-white dark:bg-sunglo-800 rounded-xl p-8 shadow-lg">
              <Database className="w-16 h-16 text-sunglo-400 dark:text-sunglo-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-sunglo-800 dark:text-sunglo-100 mb-2">
                No hay historial disponible
              </h3>
              <p className="text-sunglo-600 dark:text-sunglo-400">
                Aún no has realizado ninguna operación. ¡Comienza a usar CV-Booster!
              </p>
            </div>
          </motion.div>
        )}

        {/* Modal para contenido completo */}
        <AnimatePresence>
          {modalItem && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            >
              <motion.div
                className="bg-white dark:bg-sunglo-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header del modal */}
                <div className="flex items-center justify-between p-6 border-b border-sunglo-200 dark:border-sunglo-700">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-sunglo-100 dark:bg-sunglo-700 rounded-lg">
                      {getEndpointIcon(modalItem.endpoint)}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-sunglo-800 dark:text-sunglo-100">
                        {getEndpointName(modalItem.endpoint)}
                      </h3>
                      <p className="text-sm text-sunglo-600 dark:text-sunglo-400">
                        {formatDate(modalItem.created_at)} • {formatLatency(modalItem.latency_ms)}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    onClick={closeModal}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-sunglo-400 hover:text-sunglo-600 dark:hover:text-sunglo-300 transition-colors duration-200"
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>

                {/* Contenido del modal */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-sunglo-50 dark:bg-sunglo-700 rounded-lg p-3">
                        <p className="text-sm text-sunglo-600 dark:text-sunglo-400">Modelo</p>
                        <p className="font-semibold text-sunglo-800 dark:text-sunglo-200">{modalItem.model}</p>
                      </div>
                      <div className="bg-sunglo-50 dark:bg-sunglo-700 rounded-lg p-3">
                        <p className="text-sm text-sunglo-600 dark:text-sunglo-400">Tamaño</p>
                        <p className="font-semibold text-sunglo-800 dark:text-sunglo-200">{modalItem.result_length} caracteres</p>
                      </div>
                      <div className="bg-sunglo-50 dark:bg-sunglo-700 rounded-lg p-3">
                        <p className="text-sm text-sunglo-600 dark:text-sunglo-400">Request ID</p>
                        <p className="font-mono text-xs text-sunglo-800 dark:text-sunglo-200">{modalItem.request_id}</p>
                      </div>
                    </div>

                    <div className="bg-sunglo-50 dark:bg-sunglo-700 rounded-lg p-4">
                      <h4 className="font-semibold text-sunglo-800 dark:text-sunglo-200 mb-3">
                        {modalItem.endpoint.includes('analyze_job') ? 'Análisis Completo' : 'Contenido Completo'}
                      </h4>
                      {modalItem.endpoint.includes('analyze_job') ? (
                        <pre className="text-sm text-sunglo-700 dark:text-sunglo-300 whitespace-pre-wrap overflow-x-auto">
                          {formatJsonToText(modalItem.result)}
                        </pre>
                      ) : modalItem.endpoint.includes('generate_cv') ? (
                        <div className="prose prose-sm max-w-none">
                          <pre className="text-sunglo-700 dark:text-sunglo-300 whitespace-pre-wrap overflow-x-auto">
                            {modalItem.result}
                          </pre>
                        </div>
                      ) : (
                        <pre className="text-sm text-sunglo-700 dark:text-sunglo-300 whitespace-pre-wrap overflow-x-auto">
                          {modalItem.result}
                        </pre>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HistoryPage;
