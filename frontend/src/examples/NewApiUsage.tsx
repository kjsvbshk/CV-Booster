import React, { useState } from 'react';
import { apiService } from '../services/api';
import type { 
  AnalyzeJobRequest, 
  AnalyzeJobResponse, 
  GenerateCVRequest, 
  GenerateCVResponse,
  ApiError 
} from '../types/api';

/**
 * Ejemplo actualizado usando axios en lugar de fetch
 * El servicio ahora usa axios con interceptores para mejor manejo de errores
 */

/**
 * Ejemplo de cómo usar los nuevos endpoints del backend
 * Este componente muestra el flujo de 2 pasos:
 * 1. Analizar oferta de trabajo
 * 2. Generar CV adaptado
 */
const NewApiUsageExample: React.FC = () => {
  const [jobDescription, setJobDescription] = useState<string>('');
  const [keywords, setKeywords] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeJobResponse | null>(null);
  const [cvResult, setCvResult] = useState<GenerateCVResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Paso 1: Analizar oferta de trabajo
  const handleAnalyzeJob = async (): Promise<void> => {
    if (!jobDescription.trim()) {
      setError('La descripción del trabajo es requerida');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      const request: AnalyzeJobRequest = {
        job_description: jobDescription,
        keywords: keywords || undefined
      };

      const response = await apiService.analyzeJob(request);
      setAnalysisResult(response);
      console.log('Análisis completado:', response);
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError.message);
      console.error('Error analizando trabajo:', apiError);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Paso 2: Generar CV adaptado
  const handleGenerateCV = async (): Promise<void> => {
    if (!analysisResult || !selectedFile) {
      setError('Necesitas completar el análisis y seleccionar un archivo CV');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const request: GenerateCVRequest = {
        job_id: analysisResult.job_id,
        cv: selectedFile,
        confirm_keywords: keywords || undefined
      };

      const response = await apiService.generateCV(request);
      setCvResult(response);
      console.log('CV generado:', response);
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError.message);
      console.error('Error generando CV:', apiError);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        Ejemplo de Uso de la Nueva API
      </h1>

      {/* Paso 1: Análisis de Oferta */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Paso 1: Analizar Oferta de Trabajo</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Descripción del Trabajo *
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={6}
              placeholder="Pega aquí la descripción completa del trabajo..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Keywords (opcional)
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Palabras clave separadas por comas..."
            />
          </div>

          <button
            onClick={handleAnalyzeJob}
            disabled={isAnalyzing}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isAnalyzing ? 'Analizando...' : 'Analizar Oferta'}
          </button>
        </div>

        {analysisResult && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900 rounded-lg">
            <h3 className="font-semibold text-green-800 dark:text-green-200">
              Análisis Completado
            </h3>
            <p className="text-sm text-green-700 dark:text-green-300">
              Job ID: {analysisResult.job_id}
            </p>
            <pre className="mt-2 text-xs bg-white dark:bg-gray-700 p-2 rounded overflow-auto">
              {JSON.stringify(analysisResult.extractor_json, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Paso 2: Generación de CV */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Paso 2: Generar CV Adaptado</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Archivo CV *
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {selectedFile && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Archivo seleccionado: {selectedFile.name}
              </p>
            )}
          </div>

          <button
            onClick={handleGenerateCV}
            disabled={!analysisResult || !selectedFile || isGenerating}
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {isGenerating ? 'Generando CV...' : 'Generar CV Adaptado'}
          </button>
        </div>

        {cvResult && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900 rounded-lg">
            <h3 className="font-semibold text-green-800 dark:text-green-200">
              CV Generado Exitosamente
            </h3>
            <div className="mt-2 space-y-2">
              <div>
                <h4 className="font-medium">CV Markdown:</h4>
                <pre className="text-xs bg-white dark:bg-gray-700 p-2 rounded overflow-auto max-h-40">
                  {cvResult.cv_markdown}
                </pre>
              </div>
              <div>
                <h4 className="font-medium">Checks de Post-procesamiento:</h4>
                <pre className="text-xs bg-white dark:bg-gray-700 p-2 rounded overflow-auto">
                  {JSON.stringify(cvResult.postprocess_checks, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}
    </div>
  );
};

export default NewApiUsageExample;
