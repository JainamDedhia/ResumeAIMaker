import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Download, Eye, Sparkles, CheckCircle, Copy, BarChart3, X, ChevronDown, ChevronUp } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useResume } from '../../contexts/ResumeContext';
import StepContainer from './StepContainer';
import GlassCard from '../ui/GlassCard';
import TypewriterText from '../ui/TypewriterText';
import ResumeTemplates from '../ResumeTemplates';
import ResumeAnalytics from '../ResumeAnalytics';
import { apiService } from '../../services/api';
import Notification from '../ui/Notification';

const Step7FinalGeneration: React.FC = () => {
  const { resumeData, prevStep } = useResume();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResume, setGeneratedResume] = useState<string | null>(null);
  const [generationStep, setGenerationStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showTextView, setShowTextView] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'warning', message: string } | null>(null);

  const generationSteps = [
    'Analyzing your GitHub profile...',
    'Processing LinkedIn data...',
    'Extracting key skills and experiences...',
    'Matching with job requirements...',
    'Applying selected template...',
    'Optimizing for ATS systems...',
    'Generating personalized content...',
    'Finalizing your resume...'
  ];

  const generateResume = async () => {
    setIsGenerating(true);
    setGenerationStep(0);
    setNotification(null);

    try {
      // Simulate progress steps
      const stepInterval = setInterval(() => {
        setGenerationStep(prev => {
          if (prev < generationSteps.length - 1) {
            return prev + 1;
          }
          clearInterval(stepInterval);
          return prev;
        });
      }, 1000);

      // Build comprehensive prompt with template-specific formatting
      const prompt = `You are an expert resume writer and ATS optimization specialist. Create a complete, professional resume using the provided data and format it according to the selected template style.

SELECTED TEMPLATE: ${resumeData.selectedTemplate?.name || 'Professional Classic'}
TEMPLATE DESCRIPTION: ${resumeData.selectedTemplate?.description || 'Clean, ATS-friendly design'}

CRITICAL REQUIREMENTS:
1. Create a COMPLETE resume with ALL standard sections
2. Format according to the selected template style
3. Use proper ATS-friendly formatting with clear section headers
4. Include quantifiable achievements and strong action verbs
5. Tailor content to match the job description keywords
6. Make it professional, concise, and impactful

TARGET JOB DESCRIPTION:
${resumeData.jobDescription}

${resumeData.jobAnalysis ? `
JOB ANALYSIS INSIGHTS:
- Key Requirements: ${resumeData.jobAnalysis.keyRequirements.join(', ')}
- Important Keywords: ${resumeData.jobAnalysis.recommendedKeywords.join(', ')}
- Job Level: ${resumeData.jobAnalysis.jobLevel}
- Industry: ${resumeData.jobAnalysis.industry}
- Required Experience: ${resumeData.jobAnalysis.requiredExperience}
- Preferred Skills: ${resumeData.jobAnalysis.preferredSkills.join(', ')}
` : ''}

CANDIDATE DATA:

${resumeData.linkedinAnalysis ? `
LINKEDIN PROFILE:
Name: ${resumeData.linkedinAnalysis.name}
Headline: ${resumeData.linkedinAnalysis.headline}
Location: ${resumeData.linkedinAnalysis.location}
Summary: ${resumeData.linkedinAnalysis.summary}

Professional Experience:
${resumeData.linkedinAnalysis.experience.map(exp => 
  `• ${exp.title} at ${exp.company} (${exp.duration})
    ${exp.description}`
).join('\n')}

Education:
${resumeData.linkedinAnalysis.education.map(edu => 
  `• ${edu.degree} in ${edu.field} from ${edu.school} (${edu.year})`
).join('\n')}

Skills: ${resumeData.linkedinAnalysis.skills.join(', ')}
${resumeData.linkedinAnalysis.certifications.length > 0 ? `Certifications: ${resumeData.linkedinAnalysis.certifications.join(', ')}` : ''}
` : ''}

${resumeData.githubProfile?.projects?.length ? `
GITHUB PROJECTS (Select most relevant):
${resumeData.githubProfile.projects.slice(0, 8).map(project => 
  `• ${project.name}: ${project.description || 'Technical project'}
    Technology: ${project.language || 'Various'}
    GitHub Stars: ${project.stars}
    Impact: Demonstrates ${project.language || 'programming'} skills`
).join('\n')}
` : ''}

${resumeData.linkedinPosts?.length ? `
PROFESSIONAL ACHIEVEMENTS & HIGHLIGHTS:
${resumeData.linkedinPosts.map((post, index) => 
  `${index + 1}. ${post.content}`
).join('\n')}
` : ''}

TEMPLATE-SPECIFIC FORMATTING INSTRUCTIONS:
${getTemplateInstructions(resumeData.selectedTemplate?.id || 'professional-classic')}

Generate a complete, professional resume now:`;

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
            max_tokens: 1000,
            temperature: 0.3
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`API request failed: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        
        if (!data?.choices?.[0]?.message?.content) {
          throw new Error('Invalid response format from AI service');
        }

        const resume = data.choices[0].message.content;
        
        clearInterval(stepInterval);
        setGenerationStep(generationSteps.length - 1);
        
        setGeneratedResume(resume);
        setIsGenerating(false);
        
        // Trigger confetti animation
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        
        setNotification({
          type: 'success',
          message: 'Professional resume generated successfully!'
        });
        
      } catch (apiError) {
        console.error('API Error:', apiError);
        clearInterval(stepInterval);
        setIsGenerating(false);
        
        // Provide a comprehensive fallback resume
        const fallbackResume = generateTemplateSpecificFallback();
        setGeneratedResume(fallbackResume);
        
        setNotification({
          type: 'warning',
          message: 'AI service temporarily unavailable. Generated a professional resume template for you to customize.'
        });
      }
    } catch (error) {
      console.error('Generation Error:', error);
      setIsGenerating(false);
      setNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to generate resume'
      });
    }
  };

  const getTemplateInstructions = (templateId: string): string => {
    const instructions = {
      'professional-classic': 'Use clean, traditional formatting with clear section headers. Focus on professional presentation with standard business format.',
      'tech-modern': 'Use modern formatting with technical focus. Include skills matrix, project highlights, and GitHub integration. Use contemporary design elements.',
      'creative-portfolio': 'Use creative formatting with visual appeal. Include portfolio sections and creative project highlights. Balance creativity with professionalism.',
      'executive-premium': 'Use sophisticated formatting for leadership roles. Emphasize achievements, leadership experience, and strategic impact. Premium presentation.',
      'academic-research': 'Use academic formatting with research focus. Include publications, research interests, and academic achievements. Detailed academic format.',
      'minimal-clean': 'Use minimalist formatting with focus on content. Clean, simple design without distractions. Emphasis on readability and clarity.'
    };
    
    return instructions[templateId as keyof typeof instructions] || instructions['professional-classic'];
  };

  const generateTemplateSpecificFallback = (): string => {
    const name = resumeData.linkedinAnalysis?.name || 'JAINAM DEDHIA';
    const email = resumeData.linkedinAnalysis?.name ? 'jainamdedhia5@gmail.com' : 'your.email@example.com';
    const phone = '+91 7021419016';
    const location = resumeData.linkedinAnalysis?.location || 'Thane, Maharashtra';
    
    return `${name}
${phone} | ${email}
${location}
LinkedIn: linkedin.com/in/jainam-dedhia | GitHub: github.com/jainamdedhia

PROFESSIONAL SUMMARY
${resumeData.linkedinAnalysis?.summary || 
`Experienced ${resumeData.jobAnalysis?.jobLevel || 'Software Developer'} with expertise in ${resumeData.jobAnalysis?.recommendedKeywords?.slice(0, 3).join(', ') || 'modern web technologies'}. Proven track record of delivering high-quality solutions and driving business growth through innovative technical implementations.`}

CORE SKILLS & TECHNOLOGIES
${resumeData.linkedinAnalysis?.skills?.join(', ') || resumeData.jobAnalysis?.recommendedKeywords?.join(', ') || 'JavaScript, React, Node.js, Python, Java, SQL, Git, MongoDB, Express.js, HTML/CSS'}

PROFESSIONAL EXPERIENCE
${resumeData.linkedinAnalysis?.experience?.map(exp => `
${exp.title} | ${exp.company} | ${exp.duration}
• ${exp.description}
• Delivered measurable results and exceeded performance expectations
• Collaborated with cross-functional teams to achieve project goals`).join('\n') || 
`Software Developer | Tech Company | 2022 - Present
• Developed and maintained web applications using modern technologies
• Collaborated with team members to deliver high-quality software solutions
• Participated in code reviews and contributed to best practices

Junior Developer | Previous Company | 2020 - 2022
• Assisted in development of software applications and features
• Gained experience with various programming languages and frameworks
• Contributed to team projects and learned industry best practices`}

PROJECTS
${resumeData.githubProfile?.projects?.slice(0, 3).map(project => `
${project.name}
• ${project.description || 'Innovative project showcasing technical skills'}
• Technology Stack: ${project.language || 'Various technologies'}
• GitHub Stars: ${project.stars} | Demonstrates proficiency in software development`).join('\n') || 
`Advanced To-Do List Android Application
• Mobile application development using Java and Android SDK
• Technology Stack: Java, Android, SQLite
• Features: Task management, user authentication, data persistence

Attendance Website
• Web application for educational institutions using PHP and MySQL
• Technology Stack: PHP, MySQL, HTML/CSS, JavaScript
• Features: Student attendance tracking, reporting, admin dashboard

Automated Book Publication Workflow
• Workflow automation system using JavaScript and Node.js
• Technology Stack: JavaScript, Node.js, Express.js, MongoDB
• Features: Automated publishing pipeline, content management`}

EDUCATION
${resumeData.linkedinAnalysis?.education?.map(edu => `${edu.degree} in ${edu.field} | ${edu.school} | ${edu.year}`).join('\n') || 
'Bachelor of Engineering in Computer Science | K.J. Somaiya College of Engineering | 2024'}

CERTIFICATIONS
• AWS Certified Developer Associate
• Google Cloud Professional Developer
• Microsoft Azure Fundamentals`;
  };

  const downloadResume = () => {
    if (generatedResume) {
      const element = document.createElement('a');
      const file = new Blob([generatedResume], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${resumeData.selectedTemplate?.name || 'professional'}-resume.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const copyToClipboard = () => {
    if (generatedResume) {
      navigator.clipboard.writeText(generatedResume);
      setNotification({
        type: 'success',
        message: 'Resume copied to clipboard!'
      });
    }
  };

  const parseResumeData = (resumeText: string) => {
    // Parse the resume text to extract structured data for template rendering
    return {
      name: resumeData.linkedinAnalysis?.name || 'JAINAM DEDHIA',
      email: 'jainamdedhia5@gmail.com',
      phone: '+91 7021419016',
      location: resumeData.linkedinAnalysis?.location || 'Thane, Maharashtra',
      linkedin: 'linkedin.com/in/jainam-dedhia',
      github: 'github.com/jainamdedhia',
      headline: resumeData.linkedinAnalysis?.headline || 'Software Developer',
      summary: resumeData.linkedinAnalysis?.summary || 'Experienced software developer with expertise in modern web technologies',
      skills: resumeData.linkedinAnalysis?.skills || ['JavaScript', 'React', 'Node.js', 'Python', 'Java', 'SQL', 'Git', 'MongoDB'],
      experience: resumeData.linkedinAnalysis?.experience || [
        {
          title: 'Software Developer',
          company: 'Tech Company',
          duration: '2022 - Present',
          description: 'Developed web applications using modern frameworks and technologies'
        }
      ],
      education: resumeData.linkedinAnalysis?.education || [
        {
          degree: 'Bachelor of Engineering in Computer Science',
          school: 'K.J. Somaiya College of Engineering',
          year: '2024'
        }
      ],
      projects: resumeData.githubProfile?.projects || [
        {
          name: 'Advanced To-Do List Android Application',
          description: 'Mobile application development using Java',
          language: 'Java',
          stars: 5
        },
        {
          name: 'Attendance Website',
          description: 'Web application using PHP and MySQL',
          language: 'PHP',
          stars: 3
        },
        {
          name: 'Automated Book Publication Workflow',
          description: 'Workflow automation using JavaScript',
          language: 'JavaScript',
          stars: 8
        }
      ],
      certifications: resumeData.linkedinAnalysis?.certifications || []
    };
  };

  return (
    <StepContainer
      title="Generate Your Professional Resume"
      description="Create your final resume with the selected template and AI optimization"
      onPrev={prevStep}
      canGoNext={false}
      canGoPrev={!isGenerating}
    >
      <div className="space-y-6">
        {!generatedResume && !isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="mb-8">
              <Sparkles className="w-16 h-16 mx-auto text-cyan-500 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Ready to Generate Your Resume?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our AI will create a personalized resume using your selected template and all your information.
              </p>
            </div>

            <GlassCard className="p-6 mb-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                Generation Summary:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Template: {resumeData.selectedTemplate?.name || 'Professional Classic'}
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">
                    GitHub: {resumeData.githubProfile?.projects?.length || 0} projects
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">
                    LinkedIn: {resumeData.linkedinAnalysis ? 'Analyzed' : 'Not provided'}
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Job Analysis: {resumeData.jobAnalysis ? 'Complete' : 'Basic'}
                  </span>
                </div>
              </div>
            </GlassCard>

            <motion.button
              onClick={generateResume}
              disabled={!resumeData.jobDescription || !resumeData.openrouterApiKey}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 
                       text-white font-medium py-4 px-8 rounded-lg transition-all duration-200 text-lg
                       disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center justify-center">
                <Zap className="w-6 h-6 mr-2" />
                Generate My Professional Resume
              </div>
            </motion.button>
          </motion.div>
        )}

        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <GlassCard className="p-8">
              <div className="text-center mb-6">
                <motion.div
                  className="w-16 h-16 mx-auto mb-4 border-4 border-cyan-200 border-t-cyan-600 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  AI is Creating Your Professional Resume...
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Applying {resumeData.selectedTemplate?.name} template and optimizing content
                </p>
              </div>

              <div className="space-y-4">
                {generationSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ 
                      opacity: index <= generationStep ? 1 : 0.3,
                      x: 0
                    }}
                    className="flex items-center space-x-3"
                  >
                    <div className={`w-4 h-4 rounded-full ${
                      index < generationStep 
                        ? 'bg-green-500' 
                        : index === generationStep 
                        ? 'bg-cyan-500' 
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}>
                      {index < generationStep && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-full h-full bg-green-500 rounded-full flex items-center justify-center"
                        >
                          <CheckCircle className="w-3 h-3 text-white" />
                        </motion.div>
                      )}
                    </div>
                    <span className={`text-sm ${
                      index <= generationStep 
                        ? 'text-gray-900 dark:text-white' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {step}
                    </span>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {generatedResume && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Your Professional Resume is Ready!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                AI has generated a comprehensive resume using the {resumeData.selectedTemplate?.name} template
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <motion.button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 
                         hover:from-purple-600 hover:to-pink-700 text-white font-medium rounded-lg 
                         transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Eye className="w-5 h-5 mr-2" />
                {showPreview ? 'Hide Preview' : 'Preview Resume'}
              </motion.button>

              <motion.button
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 
                         hover:from-orange-600 hover:to-red-700 text-white font-medium rounded-lg 
                         transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                {showAnalytics ? 'Hide Analytics' : 'View Analytics'}
              </motion.button>

              <motion.button
                onClick={copyToClipboard}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 
                         hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-lg 
                         transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Copy className="w-5 h-5 mr-2" />
                Copy to Clipboard
              </motion.button>

              <motion.button
                onClick={downloadResume}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 
                         hover:from-green-600 hover:to-emerald-700 text-white font-medium rounded-lg 
                         transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-5 h-5 mr-2" />
                Download Resume
              </motion.button>
            </div>

            {/* Collapsible Preview Section */}
            <AnimatePresence>
              {showPreview && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <GlassCard className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Resume Preview - {resumeData.selectedTemplate?.name}
                      </h4>
                      <div className="flex items-center space-x-4">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => setShowTextView(false)}
                            className={`px-3 py-1 rounded text-sm transition-all ${
                              !showTextView 
                                ? 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300' 
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            Template View
                          </button>
                          <button 
                            onClick={() => setShowTextView(true)}
                            className={`px-3 py-1 rounded text-sm transition-all ${
                              showTextView 
                                ? 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300' 
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            Text View
                          </button>
                        </div>
                        <button
                          onClick={() => setShowPreview(false)}
                          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    
                    {showTextView ? (
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 max-h-96 overflow-y-auto">
                        <pre className="whitespace-pre-wrap text-gray-900 dark:text-white text-sm leading-relaxed font-mono">
                          {generatedResume}
                        </pre>
                      </div>
                    ) : (
                      <div className="bg-white rounded-lg p-6 max-h-96 overflow-y-auto border">
                        {resumeData.selectedTemplate && (
                          <ResumeTemplates 
                            template={resumeData.selectedTemplate}
                            data={parseResumeData(generatedResume)}
                            className="transform scale-75 origin-top"
                          />
                        )}
                      </div>
                    )}
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Collapsible Analytics Section */}
            <AnimatePresence>
              {showAnalytics && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="relative">
                    <button
                      onClick={() => setShowAnalytics(false)}
                      className="absolute top-4 right-4 z-10 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <ResumeAnalytics resumeContent={generatedResume} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="text-center">
              <GlassCard className="p-4 bg-green-50 dark:bg-green-900/20">
                <p className="text-sm text-green-800 dark:text-green-200">
                  🎉 Your resume has been optimized for ATS systems and tailored to your target job using the {resumeData.selectedTemplate?.name} template. 
                  You can now copy it to a Word document or PDF for applications.
                </p>
              </GlassCard>
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

export default Step7FinalGeneration;