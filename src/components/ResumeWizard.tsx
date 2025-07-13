import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResume } from '../contexts/ResumeContext';
import ProgressBar from './ui/ProgressBar';
import Step0ApiKey from './steps/Step0ApiKey';
import Step1GitHubProfile from './steps/Step1GitHubProfile';
import Step2LinkedInPDF from './steps/Step2LinkedInPDF';
import Step3LinkedInPosts from './steps/Step3LinkedInPosts';
import Step4ExistingResume from './steps/Step4ExistingResume';
import Step5JobDescription from './steps/Step5JobDescription';
import Step6_5TemplateSelection from './steps/Step6_5TemplateSelection';
import Step7FinalGeneration from './steps/Step7FinalGeneration';

const ResumeWizard: React.FC = () => {
  const { currentStep } = useResume();

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <Step0ApiKey />;
      case 1:
        return <Step1GitHubProfile />;
      case 2:
        return <Step2LinkedInPDF />;
      case 3:
        return <Step3LinkedInPosts />;
      case 4:
        return <Step4ExistingResume />;
      case 5:
        return <Step5JobDescription />;
      case 6:
        return <Step6_5TemplateSelection />;
      case 7:
        return <Step7FinalGeneration />;
      default:
        return <Step0ApiKey />;
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {currentStep > 0 && <ProgressBar />}
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ResumeWizard;