import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
    completeStep(6.5); // Mark this step as completed
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
            <p className="text-green-700 dark:text-green-300">
              {selectedTemplate.description}
            </p>
            <p className="text-sm text-green-600 dark:text-green-400 mt-2">
              Click "Next" to proceed with resume generation using this template.
            </p>
          </motion.div>
        )}
      </div>
    </StepContainer>
  );
};

export default Step6_5TemplateSelection;