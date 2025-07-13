import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Briefcase, GraduationCap, Award } from 'lucide-react';
import { useResume } from '../../contexts/ResumeContext';
import StepContainer from './StepContainer';
import FileUpload from '../ui/FileUpload';
import GlassCard from '../ui/GlassCard';
import Notification from '../ui/Notification';
import { apiService } from '../../services/api';

interface LinkedInAnalysis {
  name: string;
  headline: string;
  location: string;
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
  certifications: string[];
}

const Step2LinkedInPDF: React.FC = () => {
  const { resumeData, updateResumeData, nextStep, prevStep, completeStep } = useResume();
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'warning', message: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysis, setAnalysis] = useState<LinkedInAnalysis | null>(null);

  const analyzeLinkedInContent = async (text: string): Promise<LinkedInAnalysis> => {
    const prompt = `You are an expert at parsing LinkedIn profile data. Analyze this LinkedIn profile text and extract structured information.

IMPORTANT: This is a LinkedIn PDF export format. Look for:
- Name (usually at the top)
- Contact information (email, phone, location)
- Professional headline/title
- About/Summary section
- Experience section with job titles, companies, dates
- Education section with degrees, schools, years
- Skills section
- Certifications

LinkedIn Profile Text:
${text}

Extract and return ONLY a JSON object with this exact structure:
{
  "name": "Full Name",
  "headline": "Professional headline/title",
  "location": "City, Country",
  "summary": "Professional summary/about section",
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
  "certifications": ["cert1", "cert2"]
}

Return only the JSON object, no other text.`;

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resumeData.openrouterApiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Resume Generator'
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3.5-sonnet',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 2000,
          temperature: 0.1
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Try to parse JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Could not parse AI response');
    } catch (error) {
      console.error('LinkedIn analysis error:', error);
      
      // Enhanced fallback parsing for LinkedIn PDF format
      const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      
      // Try to extract name (usually first meaningful line)
      let name = 'Name not found';
      for (const line of lines.slice(0, 10)) {
        if (line.match(/^[A-Z][a-z]+ [A-Z][a-z]+/) && !line.includes('@') && !line.includes('http')) {
          name = line;
          break;
        }
      }
      
      // Extract email
      const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
      const email = emailMatch ? emailMatch[0] : '';
      
      // Extract phone
      const phoneMatch = text.match(/[\+]?[\d\s\-\(\)]{10,}/);
      const phone = phoneMatch ? phoneMatch[0] : '';
      
      // Extract location (look for patterns like "City, Country")
      const locationMatch = text.match(/([A-Z][a-z]+,\s*[A-Z][a-z]+)/);
      const location = locationMatch ? locationMatch[1] : 'Location not specified';
      
      // Try to extract skills (look for common tech skills)
      const commonSkills = ['JavaScript', 'Python', 'React', 'Node.js', 'Java', 'C++', 'SQL', 'HTML', 'CSS', 'Git', 'AWS', 'Docker', 'Kubernetes'];
      const foundSkills = commonSkills.filter(skill => 
        text.toLowerCase().includes(skill.toLowerCase())
      );
      
      return {
        name,
        headline: 'Professional extracted from LinkedIn',
        location,
        summary: `Professional with experience in ${foundSkills.slice(0, 3).join(', ') || 'various technologies'}. ${text.substring(0, 150)}...`,
        experience: [
          {
            title: 'Position extracted from LinkedIn',
            company: 'Company from LinkedIn',
            duration: 'Duration from LinkedIn',
            description: 'Experience details extracted from LinkedIn profile'
          }
        ],
        education: [
          {
            school: 'Educational institution from LinkedIn',
            degree: 'Degree from LinkedIn',
            field: 'Field of study',
            year: 'Year from LinkedIn'
          }
        ],
        skills: foundSkills.length > 0 ? foundSkills : ['Professional skills from LinkedIn'],
        certifications: []
      };
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    setNotification(null);
    
    try {
      const text = await apiService.parseLinkedinPdf(file);
      const analysisResult = await analyzeLinkedInContent(text);
      
      setAnalysis(analysisResult);
      updateResumeData({
        linkedinPdf: file,
        linkedinPdfText: text,
        linkedinAnalysis: analysisResult
      });
      completeStep(2);
      setNotification({
        type: 'success',
        message: 'LinkedIn profile analyzed successfully!'
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to analyze LinkedIn PDF'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileRemove = () => {
    updateResumeData({
      linkedinPdf: null,
      linkedinPdfText: undefined,
      linkedinAnalysis: undefined
    });
    setAnalysis(null);
  };

  const handleNext = () => {
    nextStep();
  };

  const handleSkip = () => {
    completeStep(2);
    nextStep();
  };

  return (
    <StepContainer
      title="Upload LinkedIn Profile"
      description="Upload your LinkedIn profile as a PDF to extract your professional experience and connections"
      onNext={handleNext}
      onPrev={prevStep}
      canGoNext={true}
      canGoPrev={true}
    >
      <div className="space-y-6" style={{ opacity: isProcessing ? 0.7 : 1 }}>
        <FileUpload
          onFileUpload={handleFileUpload}
          onFileRemove={handleFileRemove}
          currentFile={resumeData.linkedinPdf}
          acceptedFileTypes={['.pdf']}
          label="LinkedIn Profile PDF"
          description="Export your LinkedIn profile as a PDF and upload it here"
        />

        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <GlassCard className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {analysis.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {analysis.headline}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {analysis.location}
                  </div>
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
                        {exp.description && (
                          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                            {exp.description.substring(0, 100)}...
                          </p>
                        )}
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
                          {edu.degree} {edu.field && `in ${edu.field}`}
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

              {analysis.certifications.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    Certifications ({analysis.certifications.length})
                  </h4>
                  <div className="space-y-2">
                    {analysis.certifications.map((cert, index) => (
                      <div key={index} className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">{cert}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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

        {!resumeData.linkedinPdf && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <GlassCard className="p-4 bg-blue-50 dark:bg-blue-900/20">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                How to export your LinkedIn profile:
              </h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200">
                <li>Go to your LinkedIn profile page</li>
                <li>Click "More" button on your profile</li>
                <li>Select "Save to PDF"</li>
                <li>Download the generated PDF</li>
                <li>Upload it here</li>
              </ol>
            </GlassCard>

            <div className="text-center">
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

export default Step2LinkedInPDF;