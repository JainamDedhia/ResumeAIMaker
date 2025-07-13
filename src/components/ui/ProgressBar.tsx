import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useResume } from '../../contexts/ResumeContext';

const ProgressBar: React.FC = () => {
  const { steps, currentStep } = useResume();

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 transform -translate-y-1/2 z-0">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>

        {/* Step indicators */}
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            className="relative z-10 flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <motion.div
              className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                step.completed
                  ? 'bg-gradient-to-r from-green-400 to-emerald-500 border-green-400 text-white'
                  : step.active
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 border-cyan-400 text-white'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {step.completed ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <Check className="w-6 h-6" />
                </motion.div>
              ) : (
                <span className="text-sm font-semibold">{step.id}</span>
              )}
            </motion.div>
            
            <div className="mt-3 text-center max-w-24">
              <p className={`text-xs font-medium ${
                step.active 
                  ? 'text-cyan-600 dark:text-cyan-400' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {step.title}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;