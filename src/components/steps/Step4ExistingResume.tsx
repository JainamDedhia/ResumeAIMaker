import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Eye, Download, User, Briefcase, GraduationCap } from 'lucide-react';
import { useResume } from '../../contexts/ResumeContext';
import StepContainer from './StepContainer';
import FileUpload from '../ui/FileUpload';
import GlassCard from '../ui/GlassCard';
import Notification from '../ui/Notification';
import { apiService } from '../../services/api';

interface ResumeAnalysis {
  name: string;
  contact: {
    email: string;
    phone: string;
    location: string;
  };
  summary: string;
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    school: string;
    degree: string;
    field: string;
    year: string;
  }>;
  skills: string[];
  sections: string[];
}

const Step4ExistingResume: React.FC = () => {
  const { resumeData, updateResumeData, nextStep, prevStep, completeStep } = useResume();
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'warning', message: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);

  const analyzeResumeContent = async (text: string): Promise<ResumeAnalysis> => {
    const prompt = `
Analyze this resume text and extract structured information. Return ONLY a JSON object with this exact structure:

{
  "name": "Full Name",
  "contact": {
    "email": "email@example.com",
    "phone": "+1234567890",
    "location": "City, State"
  },
  "summary": "Professional summary or objective",
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "duration": "Start - End dates",
      "description": "Brief job description"
    }
  ],
  "education": [
    {
      "school": "University/School Name",
      "degree": "Degree Type",
      "field": "Field of Study",
      "year": "Graduation Year"
    }
  ],
  "skills": ["skill1", "skill2", "skill3"],
  "sections": ["Experience", "Education", "Skills", "Projects"]
}

Resume Text:
${text}

Return only the JSON object, no other text.`;

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resumeData.groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 2000,
          temperature: 0.3
        })
      });

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Try to parse JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Could not parse AI response');
    } catch (error) {
      // Fallback to basic parsing if AI fails
      return {
        name: text.match(/^([A-Z][a-z]+ [A-Z][a-z]+)/)?.[1] || 'Name not found',
        contact: {
          email: text.match(/[\w.-]+@[\w.-]+\.\w+/)?.[0] || 'Email not found',
          phone: text.match(/[\+]?[\d\s\-\(\)]{10,}/)?.[0] || 'Phone not found',
          location: 'Location not specified'
        },
        summary: text.substring(0, 200) + '...',
        experience: [],
        education: [],
        skills: [],
        sections: ['Experience', 'Education', 'Skills']
      };
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    setNotification(null);
    
    try {
      const text = await apiService.parseResume(file);
      const analysisResult = await analyzeResumeContent(text);
      
      setAnalysis(analysisResult);
      updateResumeData({
        existingResume: file,
        existingResumeText: text,
        resumeAnalysis: analysisResult
      });
      completeStep(4);
      setNotification({
        type: 'success',
        message: 'Resume analyzed successfully!'
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to analyze resume'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileRemove = () => {
    updateResumeData({
      existingResume: null,
      existingResumeText: undefined,
      resumeAnalysis: undefined
    });
    setAnalysis(null);
  };

  const handleNext = () => {
    nextStep();
  };

  const handleSkip = () => {
    completeStep(4);
    nextStep();
  };

  return (
    <StepContainer
      title="Upload Existing Resume"
      description="Upload your current resume to use as a reference for generating your new AI-powered resume"
      onNext={handleNext}
      onPrev={prevStep}
      canGoNext={true}
      canGoPrev={true}
    >
      <div className="space-y-6" style={{ opacity: isProcessing ? 0.7 : 1 }}>
        <FileUpload
          onFileUpload={handleFileUpload}
          onFileRemove={handleFileRemove}
          currentFile={resumeData.existingResume}
          acceptedFileTypes={['.pdf', '.doc', '.docx']}
          label="Current Resume"
          description="Upload your existing resume in PDF or Word format"
        />

        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <GlassCard className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {analysis.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {analysis.contact.email}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {analysis.contact.phone} • {analysis.contact.location}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <Briefcase className="w-5 h-5 mr-2" />
                    Experience ({analysis.experience.length})
                  </h4>
                  <div className="space-y-3">
                    {analysis.experience.slice(0, 3).map((exp, index) => (
                      <div key={index} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <h5 className="font-medium text-blue-900 dark:text-blue-100">
                          {exp.title}
                        </h5>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          {exp.company} • {exp.duration}
                        </p>
                      </div>
                    ))}
                    {analysis.experience.length === 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No experience data extracted
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <GraduationCap className="w-5 h-5 mr-2" />
                    Education ({analysis.education.length})
                  </h4>
                  <div className="space-y-3">
                    {analysis.education.slice(0, 2).map((edu, index) => (
                      <div key={index} className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <h5 className="font-medium text-green-900 dark:text-green-100">
                          {edu.degree}
                        </h5>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          {edu.school} • {edu.year}
                        </p>
                      </div>
                    ))}
                    {analysis.education.length === 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No education data extracted
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {analysis.skills.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Skills Identified ({analysis.skills.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.skills.slice(0, 12).map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 
                                 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {analysis.sections.length}
                  </p>
                  <p className="text-sm text-blue-800 dark:text-blue-200">Sections</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {analysis.experience.length}
                  </p>
                  <p className="text-sm text-green-800 dark:text-green-200">Jobs</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {analysis.skills.length}
                  </p>
                  <p className="text-sm text-purple-800 dark:text-purple-200">Skills</p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {analysis.education.length}
                  </p>
                  <p className="text-sm text-orange-800 dark:text-orange-200">Education</p>
                </div>
              </div>

              {analysis.summary && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Professional Summary
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                    {analysis.summary}
                  </p>
                </div>
              )}
            </GlassCard>
          </motion.div>
        )}

        {!resumeData.existingResume && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <div className="mb-6">
              <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No resume uploaded yet. You can skip this step if you don't have an existing resume.
              </p>
              <motion.button
                onClick={handleSkip}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 
                         hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Skip This Step
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>

      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          isVisible={true}
          onClose={() => setNotification(null)}
        />
      )}
    </StepContainer>
  );
};

export default Step4ExistingResume;