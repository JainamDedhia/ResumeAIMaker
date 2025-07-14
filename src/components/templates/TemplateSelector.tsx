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
  Zap,
  Users,
  Building,
  Lightbulb
} from 'lucide-react';
import GlassCard from '../ui/GlassCard';

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  category: 'professional' | 'creative' | 'technical' | 'executive' | 'academic' | 'minimal';
  preview: string;
  features: string[];
  icon: React.ComponentType<any>;
  color: string;
  gradient: string;
  bestFor: string[];
  industries: string[];
}

interface TemplateSelectorProps {
  onSelectTemplate: (template: ResumeTemplate) => void;
  selectedTemplate?: ResumeTemplate;
}

const templates: ResumeTemplate[] = [
  {
    id: 'professional-classic',
    name: 'Professional Classic',
    description: 'Clean, ATS-friendly design perfect for corporate environments and traditional industries',
    category: 'professional',
    preview: 'Traditional layout with clear sections, professional typography, and excellent ATS compatibility',
    features: ['ATS Optimized', 'Clean Layout', 'Professional Typography', 'Standard Sections', 'Corporate Style'],
    icon: Briefcase,
    color: 'blue',
    gradient: 'from-blue-500 to-blue-700',
    bestFor: ['Corporate Jobs', 'Finance', 'Consulting', 'Management', 'Traditional Industries'],
    industries: ['Finance', 'Banking', 'Consulting', 'Insurance', 'Government']
  },
  {
    id: 'modern-tech',
    name: 'Modern Tech',
    description: 'Contemporary design tailored for software developers, engineers, and tech professionals',
    category: 'technical',
    preview: 'Modern layout with emphasis on technical skills, projects, and GitHub integration',
    features: ['Project Showcase', 'Skills Matrix', 'GitHub Integration', 'Tech-focused', 'Code Highlights'],
    icon: Code,
    color: 'cyan',
    gradient: 'from-cyan-500 to-blue-600',
    bestFor: ['Software Development', 'Engineering', 'Data Science', 'DevOps', 'Tech Startups'],
    industries: ['Technology', 'Software', 'Gaming', 'AI/ML', 'Cybersecurity']
  },
  {
    id: 'creative-design',
    name: 'Creative Design',
    description: 'Visually striking design for creative professionals in design, marketing, and media',
    category: 'creative',
    preview: 'Eye-catching design with portfolio sections, visual elements, and creative flair',
    features: ['Portfolio Section', 'Visual Design', 'Creative Layout', 'Color Accents', 'Brand Focus'],
    icon: Palette,
    color: 'purple',
    gradient: 'from-purple-500 to-pink-600',
    bestFor: ['Graphic Design', 'Marketing', 'Advertising', 'Media', 'Content Creation'],
    industries: ['Design', 'Marketing', 'Advertising', 'Media', 'Entertainment']
  },
  {
    id: 'executive-premium',
    name: 'Executive Premium',
    description: 'Sophisticated design for senior leadership positions and C-level executives',
    category: 'executive',
    preview: 'Elegant layout emphasizing leadership experience, achievements, and strategic impact',
    features: ['Leadership Focus', 'Achievement Highlights', 'Premium Design', 'Executive Summary', 'Strategic Impact'],
    icon: Award,
    color: 'emerald',
    gradient: 'from-emerald-500 to-green-600',
    bestFor: ['C-Level', 'VP Roles', 'Director Positions', 'Senior Management', 'Board Positions'],
    industries: ['All Industries', 'Fortune 500', 'Startups', 'Non-Profit', 'Healthcare']
  },
  {
    id: 'academic-research',
    name: 'Academic Research',
    description: 'Comprehensive format for academic positions, research roles, and educational institutions',
    category: 'academic',
    preview: 'Detailed layout for publications, research, grants, and academic achievements',
    features: ['Publications Section', 'Research Focus', 'Academic Format', 'Grant History', 'Teaching Experience'],
    icon: GraduationCap,
    color: 'orange',
    gradient: 'from-orange-500 to-red-600',
    bestFor: ['Academia', 'Research', 'Teaching', 'PhD Positions', 'Post-Doc'],
    industries: ['Education', 'Research', 'Universities', 'Think Tanks', 'Government Research']
  },
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    description: 'Simple, distraction-free design that highlights content over visual elements',
    category: 'minimal',
    preview: 'Minimalist approach with focus on content, excellent readability, and universal appeal',
    features: ['Minimal Design', 'Content Focus', 'Easy Reading', 'Versatile', 'Timeless Style'],
    icon: FileText,
    color: 'gray',
    gradient: 'from-gray-500 to-gray-700',
    bestFor: ['Any Industry', 'Conservative Fields', 'International Applications', 'Simple Preferences'],
    industries: ['Universal', 'Law', 'Healthcare', 'Non-Profit', 'International']
  }
];

const categoryIcons = {
  professional: Building,
  creative: Palette,
  technical: Code,
  executive: Award,
  academic: GraduationCap,
  minimal: FileText
};

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ 
  onSelectTemplate, 
  selectedTemplate 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewTemplate, setPreviewTemplate] = useState<ResumeTemplate | null>(null);

  const categories = [
    { id: 'all', name: 'All Templates', icon: Zap },
    { id: 'professional', name: 'Professional', icon: Building },
    { id: 'technical', name: 'Technical', icon: Code },
    { id: 'creative', name: 'Creative', icon: Palette },
    { id: 'executive', name: 'Executive', icon: Award },
    { id: 'academic', name: 'Academic', icon: GraduationCap },
    { id: 'minimal', name: 'Minimal', icon: FileText }
  ];

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(template => template.category === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.h2 
          className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Choose Your Perfect Template
        </motion.h2>
        <motion.p 
          className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Select a professionally designed template that matches your industry and career level. 
          All templates are ATS-optimized and fully customizable with your AI-generated content.
        </motion.p>
      </div>

      {/* Category Filter */}
      <motion.div 
        className="flex flex-wrap justify-center gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg scale-105'
                  : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 shadow-md hover:shadow-lg'
              }`}
              whileHover={{ scale: selectedCategory === category.id ? 1.05 : 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <IconComponent className="w-4 h-4 mr-2" />
              {category.name}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTemplates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            <GlassCard 
              className={`relative overflow-hidden cursor-pointer transition-all duration-500 ${
                selectedTemplate?.id === template.id 
                  ? 'ring-4 ring-cyan-400 shadow-2xl scale-105' 
                  : 'hover:shadow-2xl hover:scale-102'
              }`}
              onClick={() => onSelectTemplate(template)}
            >
              {/* Selection Indicator */}
              {selectedTemplate?.id === template.id && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="absolute top-4 right-4 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center z-10 shadow-lg"
                >
                  <CheckCircle className="w-6 h-6 text-white" />
                </motion.div>
              )}

              {/* Template Header */}
              <div className={`h-32 bg-gradient-to-br ${template.gradient} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10 p-6 text-white">
                  <template.icon className="w-12 h-12 mb-2 opacity-90" />
                  <h3 className="text-xl font-bold">{template.name}</h3>
                </div>
                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
                <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-white/5 rounded-full"></div>
              </div>

              {/* Template Content */}
              <div className="p-6 space-y-4">
                {/* Category Badge */}
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${template.gradient} text-white`}>
                    {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
                  </span>
                  <div className="flex items-center text-yellow-500">
                    <Users className="w-4 h-4 mr-1" />
                    <span className="text-xs font-medium">Popular</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {template.description}
                </p>

                {/* Features */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Key Features:</h4>
                  <div className="grid grid-cols-1 gap-1">
                    {template.features.slice(0, 3).map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                        <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Best For */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Perfect For:</h4>
                  <div className="flex flex-wrap gap-1">
                    {template.bestFor.slice(0, 3).map((item, itemIndex) => (
                      <span 
                        key={itemIndex}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-300 rounded-md"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-4">
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewTemplate(template);
                    }}
                    className="flex-1 flex items-center justify-center px-4 py-2 border-2 border-gray-200 dark:border-gray-700 
                             text-gray-700 dark:text-gray-300 rounded-lg hover:border-gray-300 dark:hover:border-gray-600
                             hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 text-sm font-medium"
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
                    className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                      selectedTemplate?.id === template.id
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : `bg-gradient-to-r ${template.gradient} hover:opacity-90 text-white shadow-md hover:shadow-lg`
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {selectedTemplate?.id === template.id ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Selected
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-1" />
                        Select
                      </>
                    )}
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewTemplate(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${previewTemplate.gradient} flex items-center justify-center`}>
                  <previewTemplate.icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {previewTemplate.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {previewTemplate.category.charAt(0).toUpperCase() + previewTemplate.category.slice(1)} Template
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Template Info */}
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h4>
                  <p className="text-gray-600 dark:text-gray-400">{previewTemplate.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Features</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {previewTemplate.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Perfect For</h4>
                  <div className="flex flex-wrap gap-2">
                    {previewTemplate.bestFor.map((item, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Industries</h4>
                  <div className="flex flex-wrap gap-2">
                    {previewTemplate.industries.map((industry, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full text-sm"
                      >
                        {industry}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Template Preview */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">Template Preview</h4>
                <div className={`w-full h-96 rounded-lg bg-gradient-to-br ${previewTemplate.gradient} flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative z-10 text-center text-white p-8">
                    <previewTemplate.icon className="w-20 h-20 mx-auto mb-4 opacity-90" />
                    <h5 className="text-2xl font-bold mb-2">{previewTemplate.name}</h5>
                    <p className="text-lg opacity-90 mb-4">Template Preview</p>
                    <div className="space-y-2 text-sm opacity-75">
                      <div className="h-2 bg-white/30 rounded w-3/4 mx-auto"></div>
                      <div className="h-2 bg-white/30 rounded w-1/2 mx-auto"></div>
                      <div className="h-2 bg-white/30 rounded w-2/3 mx-auto"></div>
                    </div>
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full"></div>
                  <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/5 rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="flex space-x-4 pt-8 border-t border-gray-200 dark:border-gray-700">
              <motion.button
                onClick={() => {
                  onSelectTemplate(previewTemplate);
                  setPreviewTemplate(null);
                }}
                className={`flex-1 bg-gradient-to-r ${previewTemplate.gradient} hover:opacity-90 
                           text-white font-medium py-4 px-8 rounded-lg transition-all duration-200 text-lg`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Select This Template
              </motion.button>
              <motion.button
                onClick={() => setPreviewTemplate(null)}
                className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 
                         hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Close Preview
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default TemplateSelector;