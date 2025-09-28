import React, { useState } from 'react';
import { motion } from 'framer-motion';
import FileUpload from './components/FileUpload';
import JobOffer from './components/JobOffer';
import Instructions from './components/Instructions';
import TransformButton from './components/TransformButton';
import Result from './components/Result';
import DarkModeToggle from './components/DarkModeToggle';

interface FileWithText extends File {
  extractedText?: string;
}

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<FileWithText | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [jobContent, setJobContent] = useState<string>('');
  const [instructions, setInstructions] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [isTransforming, setIsTransforming] = useState<boolean>(false);

  const handleFileSelect = (fileData: FileWithText): void => {
    setSelectedFile(fileData);
    if (fileData.extractedText) {
      setExtractedText(fileData.extractedText);
      setJobContent(fileData.extractedText); // Auto-populate job offer with extracted text
    }
  };

  const handleJobContentChange = (content: string): void => {
    setJobContent(content);
  };

  const handleInstructionsChange = (text: string): void => {
    setInstructions(text);
  };

  const handleTransform = async (): Promise<void> => {
    if (!selectedFile && !jobContent.trim()) {
      alert('¡Ey! Necesitas al menos un archivo o pegar la oferta para transformar algo. ¡No me dejes con las manos vacías!');
      return;
    }
    setIsTransforming(true);
    setResult('');

    await new Promise(resolve => setTimeout(resolve, 2000));

    let transformed = '# Oferta Transformada\n\n';
    if (selectedFile) {
      transformed += `## Archivo: ${selectedFile.name}\n${extractedText ? extractedText.substring(0, 500) + '\n...' : ''}\n`;
    }
    if (jobContent) {
      transformed += `### Contenido de la Oferta\n${jobContent.replace(/<[^>]*>/g, '').replace(/\n/g, '\n')}\n`;
    }
    if (instructions) {
      transformed += `### Instrucciones Extras\n${instructions}\n`;
    }
    transformed += '\n¡Transformación completada con éxito! 🎉';

    setResult(transformed);
    setIsTransforming(false);
  };

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
          <motion.h1 
            className="text-3xl md:text-4xl font-bold text-center dark:text-sunglo-100 text-sunglo-800"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            CV Booster
          </motion.h1>
          <DarkModeToggle />
        </div>
        
        {/* Main Content Grid */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 content-max-width"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.div className="space-y-4" layout>
            <h2 className="text-xl font-semibold dark:text-sunglo-200 text-sunglo-700">Subir Archivo</h2>
            <FileUpload onFileSelect={handleFileSelect} />
          </motion.div>
          
          <motion.div className="space-y-4" layout>
            <h2 className="text-xl font-semibold dark:text-sunglo-200 text-sunglo-700">Oferta de Trabajo</h2>
            <JobOffer onContentChange={handleJobContentChange} />
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

        {/* Results */}
        <motion.div 
          className="max-w-5xl mx-auto mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Result content={result} isLoading={isTransforming} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default App;
