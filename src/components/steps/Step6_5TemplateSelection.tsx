import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useResume } from '../../contexts/ResumeContext';
import StepContainer from './StepContainer';
import TemplateSelector, { ResumeTemplate } from '../templates/TemplateSelector';

const Step6_5TemplateSelection: React.FC = () => {
  const { resumeData, updateResumeData, nextStep, prevStep, completeStep } = useResume();
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate | null>(
    resumeData.selectedTemplate || null
  );

  const handleSelectTemplate = (template: ResumeTemplate) => {
    setSelectedTemplate(template);
    updateResumeData({ selectedTemplate: template });
    completeStep(6); // Mark this step as completed
  };

  const handleNext = () => {
    if (selectedTemplate) {
      nextStep();
    }
  };

  return (
    <StepContainer
      title="Choose Your Resume Template"
      description="Select a professional template that matches your industry and personal style"
      onNext={handleNext}
      onPrev={prevStep}
      canGoNext={selectedTemplate !== null}
      canGoPrev={true}
    >
      <div className="space-y-6">
        <TemplateSelector
          onSelectTemplate={handleSelectTemplate}
          selectedTemplate={selectedTemplate}
        />

        {selectedTemplate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
          >
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
              Template Selected: {selectedTemplate.name}
            </h3>
            <p className="text-green-700 dark:text-green-300 mb-4">
              {selectedTemplate.description}
            </p>
            
            {/* Next Button */}
            <motion.button
              onClick={handleNext}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 
                       hover:from-green-600 hover:to-emerald-700 text-white font-medium rounded-lg 
                       transition-all duration-200 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Continue with {selectedTemplate.name}
              <ArrowRight className="w-5 h-5 ml-2" />
            </motion.button>
            
            <p className="text-sm text-green-600 dark:text-green-400 mt-2">
              Ready to generate your resume with this template
            </p>
          </motion.div>
        )}

        {!selectedTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
          >
            <p className="text-blue-800 dark:text-blue-200">
              Please select a template above to continue. Each template is optimized for different industries and career levels.
            </p>
          </motion.div>
        )}
      </div>
    </StepContainer>
  );
};

export default Step6_5TemplateSelection;