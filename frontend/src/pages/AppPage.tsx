import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import FileUpload from '../components/FileUpload';
import JobOffer from '../components/JobOffer';
import Instructions from '../components/Instructions';
import TransformButton from '../components/TransformButton';
import Result from '../components/Result';
import DarkModeToggle from '../components/DarkModeToggle';
import { apiService } from '../services/api';
import type { 
  ApiError, 
  AnalyzeJobRequest,
  AnalyzeJobResponse,
  GenerateCVRequest,
  GenerateCVResponse
} from '../types/api';
import logo from '../assets/logo.svg';

interface FileWithText extends File {
  extractedText?: string;
}

const AppPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<FileWithText | null>(null);
  const [jobContent, setJobContent] = useState<string>('');
  const [instructions, setInstructions] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [fullResponse, setFullResponse] = useState<GenerateCVResponse | null>(null);
  const [isTransforming, setIsTransforming] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  
  // Estados para el flujo de confirmación
  const [analysisResult, setAnalysisResult] = useState<AnalyzeJobResponse | null>(null);
  const [detectedKeywords, setDetectedKeywords] = useState<string>('');
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  
  // Estados para el nuevo flujo de 3 pasos (análisis -> confirmación -> generación)
  const [currentStep, setCurrentStep] = useState<'analyze' | 'confirm' | 'generate' | 'complete'>('analyze');

  const handleFileSelect = (fileData: FileWithText): void => {
    setSelectedFile(fileData);
    if (fileData.extractedText) {
      setJobContent(fileData.extractedText); // Auto-populate job offer with extracted text
    }
  };

  const handleJobContentChange = (content: string): void => {
    setJobContent(content);
  };

  const handleInstructionsChange = (text: string): void => {
    setInstructions(text);
  };

  const handleConfirmAndGenerate = useCallback(async (): Promise<void> => {
    if (!analysisResult) {
      setError('No hay datos de análisis. Por favor, vuelve a analizar la oferta.');
      return;
    }
    
    if (!selectedFile) {
      setError('No hay archivo CV seleccionado. Por favor, selecciona un archivo.');
      return;
    }

    setIsConfirming(false);
    setIsTransforming(true);
    setCurrentStep('generate');
    setProgress(60);

    try {
      const generateData: GenerateCVRequest = {
        job_id: analysisResult.job_id,
        cv: selectedFile,
        confirm_keywords: detectedKeywords && detectedKeywords.trim() !== '' ? detectedKeywords : undefined
      };

      const cv = await apiService.generateCV(generateData);
      
      setResult(cv.cv_markdown);
      setFullResponse(cv);
      setCurrentStep('complete');
      setProgress(100);

    } catch (error) {
      setError((error as ApiError).message || 'Error desconocido');
    } finally {
      setIsTransforming(false);
    }
  }, [analysisResult, selectedFile, detectedKeywords, setError]);


  const handleTransform = useCallback(async (): Promise<void> => {
    // Validaciones tempranas - si fallan, no continuamos
    if (!selectedFile) {
      alert('Necesitas seleccionar un archivo CV para transformar.');
      return;
    }

    if (!jobContent.trim()) {
      alert('Necesitas pegar la descripción de la oferta de trabajo.');
      return;
    }

    // En este punto, selectedFile está garantizado que no es null

    // Resetear estados
    setIsTransforming(true);
    setResult('');
    setFullResponse(null);
    setAnalysisResult(null);
    setDetectedKeywords('');
    setError('');
    setProgress(10); // Progreso inicial
    setCurrentStep('analyze');

    try {
      // Paso 1: Análisis - Ejecutar endpoint cuando esté en animación de análisis
      console.log('Iniciando Paso 1: Análisis de oferta de trabajo');
      setCurrentStep('analyze');
      
      // Ejecutar endpoint durante la animación de análisis
      const analyzeData: AnalyzeJobRequest = {
        job_description: jobContent,
        keywords: instructions || undefined
      };

      const analysis = await apiService.analyzeJob(analyzeData);
      
      // Guardar resultado del análisis y preparar para confirmación
      setAnalysisResult(analysis);
      setDetectedKeywords(analysis.extractor_json?.keywords_ats?.join(', ') || '');
      setProgress(50);
      setCurrentStep('confirm');
      setIsTransforming(false);
      setIsConfirming(true);
      
      return; // Pausar aquí para que el usuario confirme

    } catch (error) {
      setError((error as ApiError).message || 'Error desconocido');
    } finally {
      setIsTransforming(false);
    }
  }, [selectedFile, jobContent, instructions]);

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br dark:from-sunglo-900 from-sunglo-50 via-sunglo-100 to-sunglo-200 dark:via-sunglo-800 dark:to-sunglo-700 py-8 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container-responsive">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <img src={logo} alt="CV-Booster Logo" className="h-12 w-auto" />
            <h1 className="text-3xl md:text-4xl font-bold dark:text-sunglo-100 text-sunglo-800">
              CV Booster
            </h1>
          </motion.div>
          <DarkModeToggle />
        </div>
        
        {/* Main Content Grid */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 content-max-width"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.div className="space-y-4 h-full flex flex-col" layout>
            <h2 className="text-xl font-semibold dark:text-sunglo-200 text-sunglo-700">Subir Archivo</h2>
            <div className="flex-1">
              <FileUpload onFileSelect={handleFileSelect} />
            </div>
          </motion.div>
          
          <motion.div className="space-y-4 h-full flex flex-col" layout>
            <h2 className="text-xl font-semibold dark:text-sunglo-200 text-sunglo-700">Oferta de Trabajo</h2>
            <div className="flex-1">
              <JobOffer onContentChange={handleJobContentChange} />
            </div>
          </motion.div>
        </motion.div>

        {/* Instructions */}
        <motion.div 
          className="max-w-4xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Instructions onInstructionsChange={handleInstructionsChange} />
        </motion.div>

        {/* Transform Button */}
        <div className="content-max-width">
          <TransformButton onTransform={handleTransform} isLoading={isTransforming} />
        </div>

        {/* Error Display */}
        {error && (
          <motion.div 
            className="max-w-5xl mx-auto mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-xl p-4">
              <p className="text-red-700 dark:text-red-300 font-medium">
                ❌ Error: {error}
              </p>
            </div>
          </motion.div>
        )}

        {/* Progress Bar */}
        {isTransforming && (
          <motion.div 
            className="max-w-5xl mx-auto mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white dark:bg-sunglo-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-sunglo-700 dark:text-sunglo-300">
                  {currentStep === 'analyze' && 'Analizando oferta de trabajo...'}
                  {currentStep === 'confirm' && 'Revisando análisis...'}
                  {currentStep === 'generate' && 'Generando CV adaptado...'}
                  {currentStep === 'complete' && '¡Proceso completado!'}
                </span>
                <span className="text-sm text-sunglo-600 dark:text-sunglo-400">
                  {progress}%
                </span>
              </div>
              <div className="w-full bg-sunglo-200 dark:bg-sunglo-700 rounded-full h-2">
                <motion.div 
                  className="bg-sunglo-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              
              {/* Indicadores de pasos */}
              <div className="flex justify-center mt-4 space-x-4">
                <div className={`flex items-center space-x-2 ${currentStep === 'analyze' ? 'text-sunglo-600 dark:text-sunglo-400' : 'text-sunglo-400 dark:text-sunglo-600'}`}>
                  <div className={`w-3 h-3 rounded-full ${currentStep === 'analyze' ? 'bg-sunglo-500' : 'bg-sunglo-300 dark:bg-sunglo-600'}`} />
                  <span className="text-xs">Análisis</span>
                </div>
                <div className={`flex items-center space-x-2 ${currentStep === 'confirm' ? 'text-sunglo-600 dark:text-sunglo-400' : 'text-sunglo-400 dark:text-sunglo-600'}`}>
                  <div className={`w-3 h-3 rounded-full ${currentStep === 'confirm' ? 'bg-sunglo-500' : 'bg-sunglo-300 dark:bg-sunglo-600'}`} />
                  <span className="text-xs">Confirmación</span>
                </div>
                <div className={`flex items-center space-x-2 ${currentStep === 'generate' ? 'text-sunglo-600 dark:text-sunglo-400' : 'text-sunglo-400 dark:text-sunglo-600'}`}>
                  <div className={`w-3 h-3 rounded-full ${currentStep === 'generate' ? 'bg-sunglo-500' : 'bg-sunglo-300 dark:bg-sunglo-600'}`} />
                  <span className="text-xs">Generación</span>
                </div>
                <div className={`flex items-center space-x-2 ${currentStep === 'complete' ? 'text-sunglo-600 dark:text-sunglo-400' : 'text-sunglo-400 dark:text-sunglo-600'}`}>
                  <div className={`w-3 h-3 rounded-full ${currentStep === 'complete' ? 'bg-sunglo-500' : 'bg-sunglo-300 dark:bg-sunglo-600'}`} />
                  <span className="text-xs">Completado</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Confirmation Step */}
        {isConfirming && analysisResult && (
          <motion.div
            className="max-w-4xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-white dark:bg-sunglo-800 rounded-xl p-6 shadow-lg border dark:border-sunglo-700 border-sunglo-200">
              <h3 className="text-xl font-semibold text-sunglo-800 dark:text-sunglo-100 mb-4">
                📊 Análisis Completado - Revisa y Confirma
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-sunglo-700 dark:text-sunglo-300 mb-2">
                      🎯 Rol Detectado
                    </label>
                    <div className="bg-sunglo-50 dark:bg-sunglo-700 p-3 rounded-lg">
                      <p className="text-sunglo-800 dark:text-sunglo-200 font-medium">
                        {analysisResult.extractor_json?.rol_detectado || 'No detectado'}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-sunglo-700 dark:text-sunglo-300 mb-2">
                      📈 Nivel de Seniority
                    </label>
                    <div className="bg-sunglo-50 dark:bg-sunglo-700 p-3 rounded-lg">
                      <p className="text-sunglo-800 dark:text-sunglo-200 font-medium capitalize">
                        {analysisResult.extractor_json?.seniority || 'No detectado'}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-sunglo-700 dark:text-sunglo-300 mb-2">
                      🎯 Confianza del Análisis
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-sunglo-200 dark:bg-sunglo-600 rounded-full h-2">
                        <div 
                          className="bg-sunglo-500 dark:bg-sunglo-400 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(analysisResult.extractor_json?.confidence_score || 0) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-sunglo-600 dark:text-sunglo-300 font-medium">
                        {Math.round((analysisResult.extractor_json?.confidence_score || 0) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-sunglo-700 dark:text-sunglo-300 mb-2">
                      🔧 Tecnologías Detectadas
                    </label>
                    <div className="bg-sunglo-50 dark:bg-sunglo-700 p-3 rounded-lg">
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.extractor_json?.tecnologias?.slice(0, 5).map((tech: any, index: number) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-sunglo-100 dark:bg-sunglo-600 text-sunglo-700 dark:text-sunglo-300 rounded text-xs"
                          >
                            {tech.name} ({Math.round(tech.confidence * 100)}%)
                          </span>
                        ))}
                        {analysisResult.extractor_json?.tecnologias?.length > 5 && (
                          <span className="px-2 py-1 bg-sunglo-200 dark:bg-sunglo-500 text-sunglo-600 dark:text-sunglo-300 rounded text-xs">
                            +{analysisResult.extractor_json.tecnologias.length - 5} más
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-sunglo-700 dark:text-sunglo-300 mb-2">
                  🔑 Keywords ATS Detectadas (Edita si es necesario)
                </label>
                <textarea
                  value={detectedKeywords}
                  onChange={(e) => setDetectedKeywords(e.target.value)}
                  className="w-full p-3 border border-sunglo-300 dark:border-sunglo-600 rounded-lg bg-white dark:bg-sunglo-700 text-sunglo-800 dark:text-sunglo-200 focus:ring-2 focus:ring-sunglo-500 focus:border-transparent"
                  rows={3}
                  placeholder="Keywords separadas por comas..."
                />
                <p className="text-xs text-sunglo-500 dark:text-sunglo-400 mt-1">
                  💡 Puedes editar, agregar o quitar keywords. Sepáralas con comas.
                </p>
              </div>
              
              <div className="flex gap-4">
                <motion.button
                  onClick={handleConfirmAndGenerate}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 bg-sunglo-500 hover:bg-sunglo-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  ✅ Confirmar y Generar CV
                </motion.button>
                <motion.button
                  onClick={() => {
                    setIsConfirming(false);
                    setCurrentStep('analyze');
                    setProgress(0);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 border border-sunglo-300 dark:border-sunglo-600 text-sunglo-700 dark:text-sunglo-300 rounded-lg font-medium hover:bg-sunglo-50 dark:hover:bg-sunglo-700 transition-colors duration-200"
                >
                  ↩️ Volver a Análisis
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results */}
        <motion.div 
          className="max-w-5xl mx-auto mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Result content={result} isLoading={isTransforming} fullResponse={fullResponse || undefined} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AppPage;
