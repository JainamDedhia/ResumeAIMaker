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

  const parseLinkedInPDF = (text: string): LinkedInAnalysis => {
    console.log('Raw LinkedIn PDF text:', text);
    
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    // Extract name (usually the first meaningful line or after "Contact")
    let name = 'Name not found';
    for (let i = 0; i < Math.min(lines.length, 10); i++) {
      const line = lines[i];
      // Skip common headers and look for actual name
      if (line && 
          !line.includes('@') && 
          !line.includes('http') && 
          !line.includes('Contact') &&
          !line.includes('Top Skills') &&
          !line.includes('LinkedIn') &&
          line.length > 2 &&
          line.length < 50 &&
          /^[A-Z][a-zA-Z\s]+$/.test(line)) {
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
    
    // Extract location - look for patterns after name
    let location = 'Location not specified';
    const locationPatterns = [
      /([A-Z][a-z]+,\s*[A-Z][a-z]+)/,
      /([A-Z][a-z]+\s*,\s*[A-Z][A-Z])/,
      /(Mumbai|Delhi|Bangalore|Chennai|Hyderabad|Pune|Kolkata|Ahmedabad|Thane|Maharashtra|Gujarat|Karnataka|Tamil Nadu|Telangana|West Bengal)/i
    ];
    
    for (const pattern of locationPatterns) {
      const match = text.match(pattern);
      if (match) {
        location = match[1] || match[0];
        break;
      }
    }
    
    // Extract headline/title - usually after name
    let headline = 'Professional';
    const nameIndex = lines.findIndex(line => line.includes(name));
    if (nameIndex >= 0 && nameIndex < lines.length - 1) {
      for (let i = nameIndex + 1; i < Math.min(nameIndex + 5, lines.length); i++) {
        const line = lines[i];
        if (line && 
            !line.includes('@') && 
            !line.includes('http') && 
            !line.includes('+91') &&
            !line.includes('Contact') &&
            line.length > 5 &&
            line.length < 100) {
          headline = line;
          break;
        }
      }
    }
    
    // Extract experience section
    const experience: Array<{title: string, company: string, duration: string, description: string}> = [];
    const experienceKeywords = ['Experience', 'Work', 'Employment', 'Professional Experience'];
    let experienceStartIndex = -1;
    
    for (let i = 0; i < lines.length; i++) {
      if (experienceKeywords.some(keyword => lines[i].toLowerCase().includes(keyword.toLowerCase()))) {
        experienceStartIndex = i + 1;
        break;
      }
    }
    
    if (experienceStartIndex > 0) {
      for (let i = experienceStartIndex; i < Math.min(experienceStartIndex + 20, lines.length); i++) {
        const line = lines[i];
        if (line && line.length > 10 && !line.includes('@') && !line.includes('http')) {
          // Try to parse job title and company
          const parts = line.split(' at ');
          if (parts.length === 2) {
            experience.push({
              title: parts[0].trim(),
              company: parts[1].trim(),
              duration: 'Duration from LinkedIn',
              description: 'Experience details from LinkedIn profile'
            });
          } else if (line.includes('·') || line.includes('|')) {
            const separator = line.includes('·') ? '·' : '|';
            const parts = line.split(separator);
            if (parts.length >= 2) {
              experience.push({
                title: parts[0].trim(),
                company: parts[1].trim(),
                duration: parts[2] ? parts[2].trim() : 'Duration from LinkedIn',
                description: 'Experience details from LinkedIn profile'
              });
            }
          }
        }
        
        // Stop if we hit another section
        if (line.toLowerCase().includes('education') || 
            line.toLowerCase().includes('skills') ||
            line.toLowerCase().includes('projects')) {
          break;
        }
      }
    }
    
    // Extract education
    const education: Array<{school: string, degree: string, field: string, year: string}> = [];
    const educationKeywords = ['Education', 'Academic', 'University', 'College', 'School'];
    let educationStartIndex = -1;
    
    for (let i = 0; i < lines.length; i++) {
      if (educationKeywords.some(keyword => lines[i].toLowerCase().includes(keyword.toLowerCase()))) {
        educationStartIndex = i + 1;
        break;
      }
    }
    
    if (educationStartIndex > 0) {
      for (let i = educationStartIndex; i < Math.min(educationStartIndex + 10, lines.length); i++) {
        const line = lines[i];
        if (line && line.length > 5) {
          education.push({
            school: line,
            degree: 'Degree from LinkedIn',
            field: 'Field of study',
            year: 'Year from LinkedIn'
          });
          break; // Usually just one education entry in LinkedIn PDF
        }
      }
    }
    
    // Extract skills - look for technical terms
    const commonSkills = [
      'JavaScript', 'Python', 'React', 'Node.js', 'Java', 'C++', 'SQL', 'HTML', 'CSS', 'Git',
      'AWS', 'Docker', 'Kubernetes', 'TypeScript', 'Angular', 'Vue', 'MongoDB', 'PostgreSQL',
      'Express', 'Django', 'Flask', 'Spring', 'Laravel', 'PHP', 'Ruby', 'Go', 'Rust',
      'Machine Learning', 'Data Science', 'AI', 'DevOps', 'CI/CD', 'Agile', 'Scrum'
    ];
    
    const foundSkills = commonSkills.filter(skill => 
      text.toLowerCase().includes(skill.toLowerCase())
    );
    
    // If no technical skills found, extract from skills section
    const skillsSection = text.match(/Skills[\s\S]*?(?=\n[A-Z]|\n\n|$)/i);
    if (skillsSection && foundSkills.length === 0) {
      const skillsText = skillsSection[0];
      const skillLines = skillsText.split('\n').slice(1); // Skip "Skills" header
      foundSkills.push(...skillLines.filter(line => line.trim().length > 0).slice(0, 10));
    }
    
    return {
      name,
      headline,
      location,
      summary: `Professional with experience in ${foundSkills.slice(0, 3).join(', ') || 'various technologies'}. ${text.substring(0, 150)}...`,
      experience: experience.length > 0 ? experience : [{
        title: 'Position extracted from LinkedIn',
        company: 'Company from LinkedIn',
        duration: 'Duration from LinkedIn',
        description: 'Experience details extracted from LinkedIn profile'
      }],
      education: education.length > 0 ? education : [{
        school: 'Educational institution from LinkedIn',
        degree: 'Degree from LinkedIn',
        field: 'Field of study',
        year: 'Year from LinkedIn'
      }],
      skills: foundSkills.length > 0 ? foundSkills : ['Professional skills from LinkedIn'],
      certifications: []
    };
  };

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    setNotification(null);
    
    try {
      const text = await apiService.parseLinkedinPdf(file);
      console.log('Parsed LinkedIn text:', text);
      
      const analysisResult = parseLinkedInPDF(text);
      console.log('Analysis result:', analysisResult);
      
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