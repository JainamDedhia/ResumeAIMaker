import React from 'react';
import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface FloatingButtonProps {
  icon: LucideIcon;
  onClick: () => void;
  position: 'left' | 'right';
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

const FloatingButton: React.FC<FloatingButtonProps> = ({
  icon: Icon,
  onClick,
  position,
  disabled = false,
  variant = 'primary'
}) => {
  const positionClass = position === 'left' ? 'left-6' : 'right-6';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600',
    secondary: 'bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600'
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`
        fixed bottom-6 ${positionClass} z-50 p-4 rounded-full 
        ${variantClasses[variant]} text-white shadow-lg
        disabled:opacity-50 disabled:cursor-not-allowed
        hover:shadow-xl transition-all duration-300
      `}
      whileHover={{ scale: disabled ? 1 : 1.1 }}
      whileTap={{ scale: disabled ? 1 : 0.9 }}
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Icon className="w-6 h-6" />
    </motion.button>
  );
};

export default FloatingButton;