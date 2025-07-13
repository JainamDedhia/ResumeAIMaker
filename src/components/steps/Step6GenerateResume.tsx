import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Download, Eye, Sparkles, CheckCircle, Copy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useResume } from '../../contexts/ResumeContext';
import StepContainer from './StepContainer';
import GlassCard from '../ui/GlassCard';
import TypewriterText from '../ui/TypewriterText';
import { apiService } from '../../services/api';
import Notification from '../ui/Notification';

const Step6GenerateResume: React.FC = () => {
  const { resumeData, prevStep } = useResume();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResume, setGeneratedResume] = useState<string | null>(null);
  const [generationStep, setGenerationStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'warning', message: string } | null>(null);

  const generationSteps = [
    'Analyzing your GitHub profile...',
    'Processing LinkedIn data...',
    'Extracting key skills and experiences...',
    'Matching with job requirements...',
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

      // Build comprehensive prompt with all data
      const prompt = `You are an expert resume writer and ATS optimization specialist. Create a complete, professional resume using the provided data.

CRITICAL REQUIREMENTS:
1. Create a COMPLETE resume with ALL standard sections
2. Use proper ATS-friendly formatting with clear section headers
3. Include quantifiable achievements and strong action verbs
4. Tailor content to match the job description keywords
5. Make it professional, concise, and impactful
6. Use standard resume format with proper spacing

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

${resumeData.resumeAnalysis ? `
EXISTING RESUME DATA (for reference):
Name: ${resumeData.resumeAnalysis.name}
Contact: ${resumeData.resumeAnalysis.contact.email} | ${resumeData.resumeAnalysis.contact.phone}
Location: ${resumeData.resumeAnalysis.contact.location}

Previous Experience:
${resumeData.resumeAnalysis.experience.map(exp => 
  `• ${exp.title} at ${exp.company} (${exp.duration})`
).join('\n')}

Education:
${resumeData.resumeAnalysis.education.map(edu => 
  `• ${edu.degree} from ${edu.school} (${edu.year})`
).join('\n')}

Skills: ${resumeData.resumeAnalysis.skills.join(', ')}
` : ''}

INSTRUCTIONS:
1. Create a complete resume with these sections in order:
   - CONTACT INFORMATION (Name, Phone, Email, Location, LinkedIn, GitHub)
   - PROFESSIONAL SUMMARY (3-4 compelling lines highlighting key qualifications)
   - CORE SKILLS & TECHNOLOGIES (organized by category)
   - PROFESSIONAL EXPERIENCE (with bullet points showing achievements)
   - PROJECTS (technical projects with impact and technologies)
   - EDUCATION
   - CERTIFICATIONS (if any)

2. For each job in experience section:
   - Use strong action verbs (Led, Developed, Implemented, Optimized, etc.)
   - Include quantifiable results where possible
   - Highlight technologies and skills relevant to the target job
   - Show progression and growth

3. For projects section:
   - Select 3-4 most relevant projects from GitHub
   - Describe the problem solved and technologies used
   - Highlight the impact or results

4. Optimize for ATS:
   - Use standard section headers
   - Include keywords from the job description naturally
   - Use clean, simple formatting
   - Avoid tables, graphics, or complex formatting

5. Make it professional and compelling:
   - Tailor the summary to the target role
   - Emphasize relevant skills and experience
   - Show career progression and achievements
   - Keep it concise but comprehensive

Generate a complete, professional resume now:`;

      try {
        console.log('Sending request to OpenRouter...');
        
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

        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`API request failed: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        console.log('API Response received');
        
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
        const fallbackResume = generateComprehensiveFallbackResume();
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

  const generateComprehensiveFallbackResume = (): string => {
    const name = resumeData.linkedinAnalysis?.name || resumeData.resumeAnalysis?.name || 'Your Name';
    const email = resumeData.linkedinAnalysis?.name ? 'your.email@example.com' : resumeData.resumeAnalysis?.contact?.email || 'your.email@example.com';
    const phone = resumeData.resumeAnalysis?.contact?.phone || '+1 (555) 123-4567';
    const location = resumeData.linkedinAnalysis?.location || resumeData.resumeAnalysis?.contact?.location || 'Your City, State';
    
    // Extract skills from all sources
    const allSkills = [
      ...(resumeData.linkedinAnalysis?.skills || []),
      ...(resumeData.resumeAnalysis?.skills || []),
      ...(resumeData.jobAnalysis?.recommendedKeywords || [])
    ];
    const uniqueSkills = [...new Set(allSkills)].slice(0, 15);
    
    // Get relevant projects
    const relevantProjects = resumeData.githubProfile?.projects?.slice(0, 4) || [];
    
    return `${name}
${phone} | ${email} | ${location}
LinkedIn: linkedin.com/in/yourprofile | GitHub: github.com/yourusername

PROFESSIONAL SUMMARY
${resumeData.linkedinAnalysis?.summary || 
`Experienced ${resumeData.jobAnalysis?.jobLevel || 'professional'} with expertise in ${uniqueSkills.slice(0, 3).join(', ')}. Proven track record of delivering high-quality solutions and driving business growth. Strong background in ${resumeData.jobAnalysis?.industry || 'technology'} with excellent problem-solving and communication skills.`}

CORE SKILLS & TECHNOLOGIES
Technical Skills: ${uniqueSkills.slice(0, 8).join(', ')}
${uniqueSkills.length > 8 ? `Additional Skills: ${uniqueSkills.slice(8).join(', ')}` : ''}

PROFESSIONAL EXPERIENCE
${resumeData.linkedinAnalysis?.experience?.map(exp => `
${exp.title} | ${exp.company} | ${exp.duration}
• ${exp.description}
• Collaborated with cross-functional teams to deliver high-quality solutions
• Contributed to improved efficiency and business outcomes`).join('\n') || 
resumeData.resumeAnalysis?.experience?.map(exp => `
${exp.title} | ${exp.company} | ${exp.duration}
• ${exp.description}
• Delivered measurable results and exceeded performance expectations
• Worked effectively in team environments to achieve project goals`).join('\n') || 
`Software Developer | Tech Company | 2020 - Present
• Developed and maintained web applications using modern technologies
• Collaborated with team members to deliver high-quality software solutions
• Participated in code reviews and contributed to best practices

Junior Developer | Previous Company | 2018 - 2020
• Assisted in development of software applications and features
• Gained experience with various programming languages and frameworks
• Contributed to team projects and learned industry best practices`}

PROJECTS
${relevantProjects.map(project => `
${project.name}
• ${project.description || 'Innovative project showcasing technical skills and problem-solving abilities'}
• Technology Stack: ${project.language || 'Various modern technologies'}
• GitHub Stars: ${project.stars} | Demonstrates proficiency in ${project.language || 'software development'}
• Impact: Enhanced user experience and showcased technical expertise`).join('\n') || 
`Personal Portfolio Website
• Developed responsive web application showcasing technical skills and projects
• Technology Stack: React, TypeScript, Tailwind CSS, Node.js
• Features: Modern UI/UX, responsive design, performance optimization
• Impact: Demonstrates full-stack development capabilities and design skills

Task Management Application
• Built comprehensive task management system with user authentication
• Technology Stack: JavaScript, Express.js, MongoDB, React
• Features: Real-time updates, user management, data persistence
• Impact: Showcases ability to build complete web applications`}

EDUCATION
${resumeData.linkedinAnalysis?.education?.map(edu => `${edu.degree} in ${edu.field} | ${edu.school} | ${edu.year}`).join('\n') || 
resumeData.resumeAnalysis?.education?.map(edu => `${edu.degree} | ${edu.school} | ${edu.year}`).join('\n') || 
'Bachelor of Science in Computer Science | University Name | 2020'}

${resumeData.linkedinAnalysis?.certifications?.length ? `
CERTIFICATIONS
${resumeData.linkedinAnalysis.certifications.join('\n')}` : 
`CERTIFICATIONS
AWS Certified Developer Associate
Google Cloud Professional Developer
Microsoft Azure Fundamentals`}`;
  };

  const downloadResume = () => {
    if (generatedResume) {
      const element = document.createElement('a');
      const file = new Blob([generatedResume], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = 'professional-resume.txt';
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

  return (
    <StepContainer
      title="Generate Your AI Resume"
      description="Our AI will now create a personalized resume based on all your information"
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
                Our AI will analyze all your information and create a personalized, 
                ATS-optimized resume tailored to your target job.
              </p>
            </div>

            <GlassCard className="p-6 mb-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                What we'll include:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
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
                    Posts: {resumeData.linkedinPosts?.length || 0} achievements
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Resume: {resumeData.resumeAnalysis ? 'Analyzed' : 'Not provided'}
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Job Analysis: {resumeData.jobAnalysis ? 'Complete' : 'Basic'}
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">
                    ATS Optimization: Enabled
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
                  Analyzing your data and optimizing for ATS systems
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
                AI has generated a comprehensive, ATS-optimized resume tailored to your target job
              </p>
            </div>

            <div className="flex justify-center space-x-4">
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

            {showPreview && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6"
              >
                <GlassCard className="p-6">
                  <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-h-96 overflow-y-auto">
                    <TypewriterText
  text={generatedResume}
  delay={1}
  className="whitespace-pre-wrap text-gray-900 dark:text-white text-sm leading-relaxed font-mono"/>

                  </div>
                </GlassCard>
              </motion.div>
            )}

            <div className="text-center">
              <GlassCard className="p-4 bg-green-50 dark:bg-green-900/20">
                <p className="text-sm text-green-800 dark:text-green-200">
                  🎉 Your resume has been optimized for ATS systems and tailored to your target job. 
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

export default Step6GenerateResume;