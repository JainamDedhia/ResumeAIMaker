import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Briefcase, 
  Code, 
  Palette, 
  Award, 
  GraduationCap,
  CheckCircle,
  Eye,
  Download
} from 'lucide-react';
import GlassCard from './ui/GlassCard';

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  category: 'professional' | 'creative' | 'technical' | 'executive' | 'academic';
  preview: string;
  features: string[];
  icon: React.ComponentType<any>;
  color: string;
}

interface TemplateSelectorProps {
  onSelectTemplate: (template: ResumeTemplate) => void;
  selectedTemplate?: ResumeTemplate;
}

const templates: ResumeTemplate[] = [
  {
    id: 'professional-classic',
    name: 'Professional Classic',
    description: 'Clean, ATS-friendly design perfect for corporate roles',
    category: 'professional',
    preview: 'A traditional layout with clear sections and professional typography',
    features: ['ATS Optimized', 'Clean Layout', 'Professional Typography', 'Standard Sections'],
    icon: Briefcase,
    color: 'blue'
  },
  {
    id: 'tech-modern',
    name: 'Tech Modern',
    description: 'Contemporary design tailored for software developers and tech professionals',
    category: 'technical',
    preview: 'Modern layout with emphasis on technical skills and projects',
    features: ['Project Showcase', 'Skills Matrix', 'GitHub Integration', 'Tech-focused'],
    icon: Code,
    color: 'cyan'
  },
  {
    id: 'creative-portfolio',
    name: 'Creative Portfolio',
    description: 'Visually appealing design for creative professionals',
    category: 'creative',
    preview: 'Eye-catching design with portfolio sections and visual elements',
    features: ['Portfolio Section', 'Visual Design', 'Creative Layout', 'Color Accents'],
    icon: Palette,
    color: 'purple'
  },
  {
    id: 'executive-premium',
    name: 'Executive Premium',
    description: 'Sophisticated design for senior leadership positions',
    category: 'executive',
    preview: 'Elegant layout emphasizing leadership experience and achievements',
    features: ['Leadership Focus', 'Achievement Highlights', 'Premium Design', 'Executive Summary'],
    icon: Award,
    color: 'emerald'
  },
  {
    id: 'academic-research',
    name: 'Academic Research',
    description: 'Comprehensive format for academic and research positions',
    category: 'academic',
    preview: 'Detailed layout for publications, research, and academic achievements',
    features: ['Publications Section', 'Research Focus', 'Academic Format', 'Detailed Experience'],
    icon: GraduationCap,
    color: 'orange'
  },
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    description: 'Simple, distraction-free design that highlights content',
    category: 'professional',
    preview: 'Minimalist approach with focus on content over design',
    features: ['Minimal Design', 'Content Focus', 'Easy Reading', 'Versatile'],
    icon: FileText,
    color: 'gray'
  }
];

const categoryColors = {
  professional: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
  creative: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200',
  technical: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-200',
  executive: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200',
  academic: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200'
};

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ 
  onSelectTemplate, 
  selectedTemplate 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewTemplate, setPreviewTemplate] = useState<ResumeTemplate | null>(null);

  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'professional', name: 'Professional' },
    { id: 'technical', name: 'Technical' },
    { id: 'creative', name: 'Creative' },
    { id: 'executive', name: 'Executive' },
    { id: 'academic', name: 'Academic' }
  ];

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(template => template.category === selectedCategory);

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'from-blue-400 to-blue-600',
      cyan: 'from-cyan-400 to-cyan-600',
      purple: 'from-purple-400 to-purple-600',
      emerald: 'from-emerald-400 to-emerald-600',
      orange: 'from-orange-400 to-orange-600',
      gray: 'from-gray-400 to-gray-600'
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Choose Your Resume Template
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Select a professional template that matches your industry and personal style. 
          All templates are ATS-optimized and fully customizable.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedCategory === category.id
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category.name}
          </motion.button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard 
              className={`p-6 cursor-pointer transition-all duration-300 ${
                selectedTemplate?.id === template.id 
                  ? 'ring-2 ring-cyan-500 bg-cyan-50/50 dark:bg-cyan-900/20' 
                  : 'hover:shadow-xl'
              }`}
              onClick={() => onSelectTemplate(template)}
            >
              <div className="relative">
                {selectedTemplate?.id === template.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
                  >
                    <CheckCircle className="w-5 h-5 text-white" />
                  </motion.div>
                )}

                <div className={`w-16 h-16 mx-auto mb-4 rounded-lg bg-gradient-to-r ${getColorClasses(template.color)} flex items-center justify-center`}>
                  <template.icon className="w-8 h-8 text-white" />
                </div>

                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {template.name}
                  </h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${categoryColors[template.category]}`}>
                    {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
                  </span>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">
                  {template.description}
                </p>

                <div className="space-y-2 mb-4">
                  {template.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                      <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewTemplate(template);
                    }}
                    className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 dark:border-gray-600 
                             text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 
                             transition-all duration-200 text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </motion.button>
                  
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTemplate(template);
                    }}
                    className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md transition-all duration-200 text-sm ${
                      selectedTemplate?.id === template.id
                        ? 'bg-green-500 text-white'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {selectedTemplate?.id === template.id ? 'Selected' : 'Select'}
                  </motion.button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Template Preview Modal */}
      {previewTemplate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewTemplate(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {previewTemplate.name}
              </h3>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className={`w-full h-64 rounded-lg bg-gradient-to-br ${getColorClasses(previewTemplate.color)} flex items-center justify-center`}>
                <div className="text-center text-white">
                  <previewTemplate.icon className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-lg font-semibold">Template Preview</p>
                  <p className="text-sm opacity-90">{previewTemplate.preview}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Features:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {previewTemplate.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <motion.button
                  onClick={() => {
                    onSelectTemplate(previewTemplate);
                    setPreviewTemplate(null);
                  }}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 
                           text-white font-medium py-3 px-6 rounded-lg transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Select This Template
                </motion.button>
                <motion.button
                  onClick={() => setPreviewTemplate(null)}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 
                           hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Close
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default TemplateSelector;