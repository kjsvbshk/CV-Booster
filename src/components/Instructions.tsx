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
        className="w-full p-4 border dark:border-sunglo-700 border-sunglo-300 rounded-xl focus:outline-none focus:ring-2 dark:focus:ring-sunglo-800 focus:ring-sunglo-200 focus:dark:border-sunglo-500 focus:border-sunglo-400 transition-all duration-300 shadow-sm resize-none dark:text-sunglo-200 text-sunglo-800 dark:bg-sunglo-800 bg-sunglo-50 hover:shadow-md max-h-[200px]"
      />
    </motion.div>
  );
};

export default Instructions;
