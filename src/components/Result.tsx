import React from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';

interface ResultProps {
  content: string;
  isLoading: boolean;
}

const Result: React.FC<ResultProps> = ({ content, isLoading }) => {
  const handleDownload = (): void => {
    if (!content) return;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'oferta-transformada.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="w-full"
    >
      <label className="block text-sm font-medium dark:text-sunglo-200 text-sunglo-700 mb-2">Resultado en Markdown</label>
      <motion.div
        animate={isLoading ? { opacity: 0.7, scale: 0.98 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={`min-h-[300px] max-h-[600px] p-6 border-2 rounded-xl shadow-md dark:bg-sunglo-800 bg-sunglo-50 overflow-y-auto transition-all duration-300 ${
          isLoading ? 'dark:border-sunglo-600 border-sunglo-300' : 'dark:border-sunglo-700 border-sunglo-200 hover:shadow-lg'
        }`}
      >
        {isLoading ? (
          <p className="text-center dark:text-sunglo-400 text-sunglo-600 py-8">Preparando la magia... ⏳</p>
        ) : content ? (
          <>
            <pre className="whitespace-pre-wrap text-sm dark:text-sunglo-200 text-sunglo-800 font-mono leading-relaxed mb-4">
              {content}
            </pre>
            <motion.button
              onClick={handleDownload}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="mx-auto flex items-center gap-2 px-4 py-2 dark:bg-sunglo-700 bg-sunglo-500 dark:text-sunglo-100 text-white rounded-lg font-medium shadow-md hover:dark:bg-sunglo-600 hover:bg-sunglo-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:dark:ring-sunglo-800 focus:ring-sunglo-200"
            >
              <Download className="w-4 h-4" />
              Descargar Markdown
            </motion.button>
          </>
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
