import React from 'react';
import { motion } from 'framer-motion';
import { Download, Eye, EyeOff, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import type { GenerateCVResponse } from '../types/api';

interface ResultProps {
  content: string;
  isLoading: boolean;
  fullResponse?: GenerateCVResponse; // Respuesta completa del backend
}

const Result: React.FC<ResultProps> = ({ content, isLoading, fullResponse }) => {
  const [showDetails, setShowDetails] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'cv' | 'analysis' | 'checks'>('cv');

  const handleDownload = (): void => {
    if (!content) return;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cv-adaptado.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderCvContent = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold dark:text-sunglo-100 text-sunglo-800 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          CV Adaptado
        </h3>
        <motion.button
          onClick={handleDownload}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 dark:bg-sunglo-700 bg-sunglo-500 dark:text-sunglo-100 text-white rounded-lg font-medium shadow-md hover:dark:bg-sunglo-600 hover:bg-sunglo-600 transition-all duration-300"
        >
          <Download className="w-4 h-4" />
          Descargar
        </motion.button>
      </div>
      <div className="bg-white dark:bg-sunglo-900 rounded-lg p-4 border dark:border-sunglo-700 border-sunglo-200">
        <pre className="whitespace-pre-wrap text-sm dark:text-sunglo-200 text-sunglo-800 font-mono leading-relaxed overflow-x-auto">
          {content}
        </pre>
      </div>
    </div>
  );

  const renderAnalysisDetails = () => {
    if (!fullResponse?.extractor_json) return null;

    const analysis = fullResponse.extractor_json;
    
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold dark:text-sunglo-100 text-sunglo-800 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Análisis de la Oferta
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-sunglo-900 rounded-lg p-4 border dark:border-sunglo-700 border-sunglo-200">
            <h4 className="font-medium dark:text-sunglo-200 text-sunglo-700 mb-2">Rol Detectado</h4>
            <p className="text-sm dark:text-sunglo-300 text-sunglo-600">{analysis.rol_detectado || 'No detectado'}</p>
          </div>
          
          <div className="bg-white dark:bg-sunglo-900 rounded-lg p-4 border dark:border-sunglo-700 border-sunglo-200">
            <h4 className="font-medium dark:text-sunglo-200 text-sunglo-700 mb-2">Nivel de Seniority</h4>
            <p className="text-sm dark:text-sunglo-300 text-sunglo-600 capitalize">{analysis.seniority || 'No detectado'}</p>
          </div>
          
          <div className="bg-white dark:bg-sunglo-900 rounded-lg p-4 border dark:border-sunglo-700 border-sunglo-200">
            <h4 className="font-medium dark:text-sunglo-200 text-sunglo-700 mb-2">Confianza</h4>
            <div className="flex items-center gap-2">
              <div className="w-full bg-sunglo-200 dark:bg-sunglo-700 rounded-full h-2">
                <div 
                  className="bg-sunglo-500 dark:bg-sunglo-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(analysis.confidence_score || 0) * 100}%` }}
                />
              </div>
              <span className="text-sm dark:text-sunglo-300 text-sunglo-600">
                {Math.round((analysis.confidence_score || 0) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {analysis.tecnologias && analysis.tecnologias.length > 0 && (
          <div className="bg-white dark:bg-sunglo-900 rounded-lg p-4 border dark:border-sunglo-700 border-sunglo-200">
            <h4 className="font-medium dark:text-sunglo-200 text-sunglo-700 mb-2">Tecnologías Detectadas</h4>
            <div className="flex flex-wrap gap-2">
              {analysis.tecnologias.map((tech: any, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-sunglo-100 dark:bg-sunglo-800 text-sunglo-700 dark:text-sunglo-300 rounded-full text-sm"
                >
                  {tech.name} ({Math.round(tech.confidence * 100)}%)
                </span>
              ))}
            </div>
          </div>
        )}

        {analysis.keywords_ats && analysis.keywords_ats.length > 0 && (
          <div className="bg-white dark:bg-sunglo-900 rounded-lg p-4 border dark:border-sunglo-700 border-sunglo-200">
            <h4 className="font-medium dark:text-sunglo-200 text-sunglo-700 mb-2">Keywords ATS</h4>
            <div className="flex flex-wrap gap-2">
              {analysis.keywords_ats.map((keyword: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderPostProcessChecks = () => {
    if (!fullResponse?.postprocess_checks) return null;

    const checks = fullResponse.postprocess_checks;
    
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold dark:text-sunglo-100 text-sunglo-800 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Verificaciones Post-Procesamiento
        </h3>
        
        <div className="bg-white dark:bg-sunglo-900 rounded-lg p-4 border dark:border-sunglo-700 border-sunglo-200">
          <h4 className="font-medium dark:text-sunglo-200 text-sunglo-700 mb-2">Nuevas Líneas Detectadas</h4>
          <p className="text-sm dark:text-sunglo-300 text-sunglo-600 mb-2">
            Se detectaron {checks.new_lines?.length || 0} nuevas líneas en el CV adaptado.
          </p>
          {checks.new_lines && checks.new_lines.length > 0 && (
            <div className="max-h-32 overflow-y-auto">
              {checks.new_lines.slice(0, 5).map((line: string, index: number) => (
                <div key={index} className="text-xs dark:text-sunglo-400 text-sunglo-500 p-1 bg-sunglo-50 dark:bg-sunglo-800 rounded mb-1">
                  {line}
                </div>
              ))}
              {checks.new_lines.length > 5 && (
                <p className="text-xs dark:text-sunglo-400 text-sunglo-500 italic">
                  ... y {checks.new_lines.length - 5} más
                </p>
              )}
            </div>
          )}
        </div>

        {fullResponse.obfuscation_mapping && (
          <div className="bg-white dark:bg-sunglo-900 rounded-lg p-4 border dark:border-sunglo-700 border-sunglo-200">
            <h4 className="font-medium dark:text-sunglo-200 text-sunglo-700 mb-2">Datos Ofuscados</h4>
            <div className="text-sm dark:text-sunglo-300 text-sunglo-600">
              <p>Emails ofuscados: {fullResponse.obfuscation_mapping.emails?.length || 0}</p>
              <p>Teléfonos ofuscados: {fullResponse.obfuscation_mapping.phones?.length || 0}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="w-full"
    >
      <div className="flex items-center justify-between mb-4">
        <label className="block text-sm font-medium dark:text-sunglo-200 text-sunglo-700">
          Resultado del Procesamiento
        </label>
        {content && fullResponse && (
          <motion.button
            onClick={() => setShowDetails(!showDetails)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-3 py-1 text-sm dark:bg-sunglo-700 bg-sunglo-100 dark:text-sunglo-200 text-sunglo-700 rounded-lg hover:dark:bg-sunglo-600 hover:bg-sunglo-200 transition-all duration-300"
          >
            {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showDetails ? 'Ocultar Detalles' : 'Ver Detalles'}
          </motion.button>
        )}
      </div>

      <motion.div
        animate={isLoading ? { opacity: 0.7, scale: 0.98 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={`min-h-[300px] max-h-[800px] p-6 border-2 rounded-xl shadow-md dark:bg-sunglo-800 bg-sunglo-50 overflow-y-auto transition-all duration-300 ${
          isLoading ? 'dark:border-sunglo-600 border-sunglo-300' : 'dark:border-sunglo-700 border-sunglo-200 hover:shadow-lg'
        }`}
      >
        {isLoading ? (
          <p className="text-center dark:text-sunglo-400 text-sunglo-600 py-8">Pensando ... ⏳</p>
        ) : content ? (
          <div className="space-y-6">
            {showDetails && fullResponse ? (
              <>
                {/* Tabs */}
                <div className="flex space-x-1 bg-sunglo-100 dark:bg-sunglo-700 p-1 rounded-lg">
                  {[
                    { id: 'cv', label: 'CV Adaptado', icon: FileText },
                    { id: 'analysis', label: 'Análisis', icon: CheckCircle },
                    { id: 'checks', label: 'Verificaciones', icon: AlertCircle }
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id as any)}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        activeTab === id
                          ? 'bg-white dark:bg-sunglo-600 text-sunglo-700 dark:text-sunglo-100 shadow-sm'
                          : 'text-sunglo-600 dark:text-sunglo-300 hover:text-sunglo-700 dark:hover:text-sunglo-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'cv' && renderCvContent()}
                {activeTab === 'analysis' && renderAnalysisDetails()}
                {activeTab === 'checks' && renderPostProcessChecks()}
              </>
            ) : (
              renderCvContent()
            )}
          </div>
        ) : (
          <p className="text-center dark:text-sunglo-400 text-sunglo-400 py-8 italic">
            El resultado aparecerá aquí una vez que transformes. ¡Pulsa el botón!
          </p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Result;
