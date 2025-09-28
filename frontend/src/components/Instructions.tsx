import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface InstructionsProps {
  onInstructionsChange: (text: string) => void;
}

const Instructions: React.FC<InstructionsProps> = ({ onInstructionsChange }) => {
  const [value, setValue] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const text = e.target.value;
    setValue(text);
    onInstructionsChange(text);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full"
    >
      <label className="block text-sm font-medium dark:text-sunglo-200 text-sunglo-700 mb-2">Instrucciones adicionales (opcional)</label>
      <textarea
        value={value}
        onChange={handleChange}
        rows={4}
        placeholder="Escribe consejos, preferencias o instrucciones extra para la transformación..."
        className="w-full p-4 border-2 border-sunglo-200 dark:border-sunglo-600 rounded-xl bg-white dark:bg-sunglo-800 text-sunglo-800 dark:text-sunglo-100 placeholder-sunglo-400 dark:placeholder-sunglo-400 focus:border-sunglo-400 dark:focus:border-sunglo-400 focus:outline-none transition-colors duration-200 resize-none"
      />
    </motion.div>
  );
};

export default Instructions;
