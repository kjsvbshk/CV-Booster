import React from 'react';
import { motion } from 'framer-motion';

interface TransformButtonProps {
  onTransform: () => void;
  isLoading: boolean;
}

const TransformButton: React.FC<TransformButtonProps> = ({ onTransform, isLoading }) => {
  return (
    <motion.div
      className="flex justify-center py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <motion.button
        onClick={onTransform}
        disabled={isLoading}
        whileHover={!isLoading ? { scale: 1.05, y: -2 } : {}}
        whileTap={!isLoading ? { scale: 0.95 } : {}}
        className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-sunglo-200 ${
          isLoading
            ? 'bg-sunglo-300 text-sunglo-600 cursor-not-allowed'
            : 'bg-sunglo-500 hover:bg-sunglo-600 text-white active:shadow-md'
        }`}
      >
        {isLoading ? 'Transformando...' : 'Transformar'}
      </motion.button>
    </motion.div>
  );
};

export default TransformButton;
