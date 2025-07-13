import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', hover = true }) => {
  return (
    <motion.div
      className={`
        backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 
        border border-white/20 dark:border-gray-700/20 
        rounded-2xl shadow-2xl
        ${hover ? 'hover:bg-white/20 dark:hover:bg-gray-800/20' : ''}
        transition-all duration-300
        ${className}
      `}
      whileHover={hover ? { y: -5, scale: 1.02 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;