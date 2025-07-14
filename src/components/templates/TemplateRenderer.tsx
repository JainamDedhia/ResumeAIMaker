import React from 'react';
import { motion } from 'framer-motion';
import { ResumeTemplate } from './TemplateSelector';
import { ParsedResumeData } from '../../utils/resumeParser';

// Import all template components
import ProfessionalClassicTemplate from './templates/ProfessionalClassicTemplate';
import ModernTechTemplate from './templates/ModernTechTemplate';
import CreativeDesignTemplate from './templates/CreativeDesignTemplate';
import ExecutiveTemplate from './templates/ExecutiveTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import AcademicTemplate from './templates/AcademicTemplate';

interface TemplateRendererProps {
  template: ResumeTemplate;
  data: ParsedResumeData;
  className?: string;
  scale?: number;
}

const TemplateRenderer: React.FC<TemplateRendererProps> = ({ 
  template, 
  data, 
  className = '',
  scale = 1 
}) => {
  const templateComponents = {
    'professional-classic': ProfessionalClassicTemplate,
    'modern-tech': ModernTechTemplate,
    'creative-design': CreativeDesignTemplate,
    'executive-premium': ExecutiveTemplate,
    'minimal-clean': MinimalTemplate,
    'academic-research': AcademicTemplate
  };

  const TemplateComponent = templateComponents[template.id as keyof typeof templateComponents];

  if (!TemplateComponent) {
    return (
      <div className="p-8 text-center text-red-500">
        Template "{template.name}" not found
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`resume-template ${className}`}
      style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
    >
      <TemplateComponent data={data} />
    </motion.div>
  );
};

export default TemplateRenderer;