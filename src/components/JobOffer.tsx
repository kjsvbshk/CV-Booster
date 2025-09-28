import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface JobOfferProps {
  onContentChange: (content: string) => void;
}

const JobOffer: React.FC<JobOfferProps> = ({ onContentChange }) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [value, setValue] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const text = e.target.value;
    setValue(text);
    onContentChange(text);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>): void => {
    e.preventDefault();
    const htmlData = e.clipboardData?.getData('text/html');
    const textData = e.clipboardData?.getData('text/plain');
    
    if (htmlData) {
      // Si hay HTML, lo convertimos a texto plano pero mantenemos saltos de línea y formato básico
      const div = document.createElement('div');
      div.innerHTML = htmlData;
      
      // Convertir HTML a texto manteniendo formato básico
      let formattedText = '';
      const processNode = (node: Node, depth = 0) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent || '';
          if (text.trim()) {
            formattedText += text;
          }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element;
          const tagName = element.tagName.toLowerCase();
          
          // Agregar saltos de línea según el tipo de elemento
          if (['br'].includes(tagName)) {
            formattedText += '\n';
          } else if (['div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
            if (formattedText && !formattedText.endsWith('\n')) {
              formattedText += '\n';
            }
          } else if (['li'].includes(tagName)) {
            formattedText += '• ';
          } else if (['ul', 'ol'].includes(tagName)) {
            if (formattedText && !formattedText.endsWith('\n')) {
              formattedText += '\n';
            }
          }
          
          // Procesar hijos
          for (let i = 0; i < element.childNodes.length; i++) {
            processNode(element.childNodes[i], depth + 1);
          }
          
          // Agregar salto de línea después de elementos de bloque
          if (['div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol'].includes(tagName)) {
            formattedText += '\n';
          }
        }
      };
      
      processNode(div);
      
      // Limpiar espacios y saltos de línea excesivos
      formattedText = formattedText
        .replace(/\n\s*\n\s*\n+/g, '\n\n') // Máximo 2 saltos de línea consecutivos
        .replace(/[ \t]+/g, ' ') // Múltiples espacios a uno solo
        .trim();
      
      const newValue = value + formattedText;
      setValue(newValue);
      onContentChange(newValue);
    } else if (textData) {
      const newValue = value + textData;
      setValue(newValue);
      onContentChange(newValue);
    }
  };

  return (
    <motion.div
      layout
      className={`relative rounded-xl p-4 border-2 transition-all duration-300 shadow-md ${
        isFocused ? 'dark:border-sunglo-400 border-sunglo-400 ring-2 dark:ring-sunglo-800/50 ring-sunglo-200/50' : 'dark:border-sunglo-700 border-sunglo-300'
      } dark:bg-sunglo-800 bg-sunglo-50 min-h-[200px] max-h-[500px] overflow-y-auto hover:shadow-lg`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -2 }}
    >
      <textarea
        value={value}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onPaste={handlePaste}
        placeholder="Pega aquí la oferta de trabajo (mantiene formato básico al pegar)"
        className="w-full h-full min-h-[150px] p-0 border-none outline-none resize-none dark:text-sunglo-200 text-sunglo-800 dark:bg-transparent bg-transparent leading-relaxed"
      />
      <p className="absolute bottom-2 right-2 text-xs dark:text-sunglo-400 text-sunglo-500 pointer-events-none">
        Conserva formato al pegar
      </p>
    </motion.div>
  );
};

export default JobOffer;
