import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import FloatingButton from '../ui/FloatingButton';
import { useResume } from '../../contexts/ResumeContext';

interface StepContainerProps {
  children: React.ReactNode;
  title: string;
  description: string;
  onNext?: () => void;
  onPrev?: () => void;
  canGoNext?: boolean;
  canGoPrev?: boolean;
}

const StepContainer: React.FC<StepContainerProps> = ({
  children,
  title,
  description,
  onNext,
  onPrev,
  canGoNext = false,
  canGoPrev = true
}) => {
  const { currentStep } = useResume();

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-8">
          <motion.h1
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {title}
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {description}
          </motion.p>
        </div>

        <GlassCard className="p-6 md:p-8">
          {children}
        </GlassCard>

        {/* Floating Navigation Buttons */}
        {canGoPrev && currentStep > 1 && onPrev && (
          <FloatingButton
            icon={ArrowLeft}
            onClick={onPrev}
            position="left"
            variant="secondary"
          />
        )}

        {canGoNext && onNext && (
          <FloatingButton
            icon={ArrowRight}
            onClick={onNext}
            position="right"
          />
        )}
      </motion.div>
    </div>
  );
};

export default StepContainer;