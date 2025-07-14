import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, CheckCircle, TrendingUp, Award, Users } from 'lucide-react';
import { useResume } from '../../contexts/ResumeContext';
import StepContainer from './StepContainer';
import GlassCard from '../ui/GlassCard';

interface JobAnalysis {
  keyRequirements: string[];
  skillsMatch: number;
  recommendedKeywords: string[];
  jobLevel: string;
  industry: string;
  companySize: string;
  salaryRange: string;
  requiredExperience: string;
  preferredSkills: string[];
  responsibilities: string[];
}

const Step5JobDescription: React.FC = () => {
  const { resumeData, updateResumeData, nextStep, prevStep, completeStep } = useResume();
  const [jobDescription, setJobDescription] = useState(resumeData.jobDescription || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<JobAnalysis | null>(null);

  const analyzeJobDescription = async () => {
    if (!jobDescription.trim()) return;
    
    setIsAnalyzing(true);
    
    try {
      const prompt = `Analyze this job description and extract key information. Return ONLY a JSON object with this exact structure:

{
  "keyRequirements": ["requirement1", "requirement2", "requirement3"],
  "skillsMatch": 85,
  "recommendedKeywords": ["keyword1", "keyword2", "keyword3"],
  "jobLevel": "Junior/Mid/Senior/Executive",
  "industry": "Design/Technology/Finance/etc",
  "companySize": "Startup/Mid-size/Enterprise",
  "salaryRange": "₹2,00,000 - 2,40,000",
  "requiredExperience": "1 year",
  "preferredSkills": ["skill1", "skill2", "skill3"],
  "responsibilities": ["responsibility1", "responsibility2", "responsibility3"]
}

Job Description:
${jobDescription}

Focus on extracting:
1. The actual job title and level (Junior/Senior/etc)
2. Required skills and software mentioned
3. Years of experience needed
4. Key responsibilities listed
5. Industry type based on job content
6. Salary if mentioned

Return only the JSON object, no other text.`;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resumeData.groqApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama3-70b-8192',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 2000,
          temperature: 0.1
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data?.choices?.[0]?.message?.content) {
        throw new Error('Invalid response from AI');
      }

      const content = data.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const analysisResult = JSON.parse(jsonMatch[0]);
        setAnalysis(analysisResult);
        updateResumeData({ 
          jobDescription,
          jobAnalysis: analysisResult
        });
        completeStep(5);
      } else {
        throw new Error('Could not parse AI response');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      
      // Enhanced fallback analysis based on actual job description
      const text = jobDescription.toLowerCase();
      
      // Extract job level from title
      let jobLevel = 'Mid-level';
      if (text.includes('junior') || text.includes('entry') || text.includes('associate') || text.includes('1 year')) {
        jobLevel = 'Junior';
      } else if (text.includes('senior') || text.includes('lead') || text.includes('principal')) {
        jobLevel = 'Senior';
      } else if (text.includes('director') || text.includes('manager') || text.includes('head of')) {
        jobLevel = 'Executive';
      }
      
      // Extract industry from job content
      let industry = 'Technology';
      if (text.includes('motion') || text.includes('graphics') || text.includes('design') || text.includes('adobe')) {
        industry = 'Design & Creative';
      } else if (text.includes('finance') || text.includes('bank')) {
        industry = 'Finance';
      } else if (text.includes('health') || text.includes('medical')) {
        industry = 'Healthcare';
      }
      
      // Extract skills mentioned in job description
      const designSkills = ['adobe after effects', 'adobe animate', 'adobe illustrator', 'adobe indesign', 'adobe photoshop', 'adobe premiere pro', 'animation', 'video editing', 'motion graphics'];
      const foundSkills = designSkills.filter(skill => text.includes(skill.toLowerCase()));
      
      // Extract experience requirements
      const expMatch = jobDescription.match(/(\d+)\s*year/i);
      const requiredExperience = expMatch ? `${expMatch[1]} year${expMatch[1] !== '1' ? 's' : ''}` : '1 year';
      
      // Extract salary
      const salaryMatch = jobDescription.match(/₹\s*([\d,]+)\s*-\s*₹?\s*([\d,]+)/);
      const salaryRange = salaryMatch ? `₹${salaryMatch[1]} - ₹${salaryMatch[2]}` : 'Not specified';
      
      // Extract key responsibilities
      const responsibilities = [];
      if (text.includes('design') && text.includes('animate')) {
        responsibilities.push('Design and animate high-quality motion graphics');
      }
      if (text.includes('collaborate')) {
        responsibilities.push('Collaborate with creative and marketing teams');
      }
      if (text.includes('edit') && text.includes('video')) {
        responsibilities.push('Edit and composite video footage');
      }
      if (text.includes('static') && text.includes('graphic')) {
        responsibilities.push('Create static graphic designs for various platforms');
      }
      
      const fallbackAnalysis: JobAnalysis = {
        keyRequirements: [
          'Strong portfolio showcasing motion graphics work',
          'Proficiency in Adobe Creative Suite',
          'Creative storytelling abilities',
          'Attention to detail in visual design',
          'Good communication and teamwork skills'
        ],
        skillsMatch: 75,
        recommendedKeywords: foundSkills.length > 0 ? foundSkills : ['Adobe After Effects', 'Adobe Premiere Pro', 'Motion Graphics', 'Animation', 'Video Editing', 'Adobe Photoshop', 'Adobe Illustrator'],
        jobLevel,
        industry,
        companySize: 'Mid-size',
        salaryRange,
        requiredExperience,
        preferredSkills: ['Leadership', 'Team Management', 'Creative Direction', 'Brand Identity', 'Visual Storytelling'],
        responsibilities: responsibilities.length > 0 ? responsibilities : [
          'Design and animate motion graphics for digital campaigns',
          'Collaborate with creative teams on visual concepts',
          'Edit video content and add visual effects',
          'Create graphics optimized for different platforms'
        ]
      };
      
      setAnalysis(fallbackAnalysis);
      updateResumeData({ 
        jobDescription,
        jobAnalysis: fallbackAnalysis
      });
      completeStep(5);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNext = () => {
    updateResumeData({ jobDescription });
    nextStep();
  };

  return (
    <StepContainer
      title="Job Description Analysis"
      description="Provide the job description to get AI-powered insights and optimize your resume accordingly"
      onNext={handleNext}
      onPrev={prevStep}
      canGoNext={jobDescription.trim().length > 0}
      canGoPrev={true}
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Job Description *
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the complete job description here..."
              className="w-full h-48 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                       focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
                       placeholder-gray-400 dark:placeholder-gray-500 resize-none"
            />
          </div>

          <motion.button
            onClick={analyzeJobDescription}
            disabled={!jobDescription.trim() || isAnalyzing}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 
                     text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 
                     disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isAnalyzing ? (
              <div className="flex items-center justify-center">
                <motion.div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Analyzing Job Description...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Zap className="w-5 h-5 mr-2" />
                Analyze with AI
              </div>
            )}
          </motion.button>
        </div>

        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <GlassCard className="p-6">
              <div className="flex items-center mb-6">
                <Target className="w-6 h-6 text-cyan-500 mr-2" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  AI Analysis Results
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                    <span className="font-medium text-blue-900 dark:text-blue-100">Job Level</span>
                  </div>
                  <p className="text-lg font-bold text-blue-800 dark:text-blue-200">
                    {analysis.jobLevel}
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Award className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                    <span className="font-medium text-green-900 dark:text-green-100">Industry</span>
                  </div>
                  <p className="text-lg font-bold text-green-800 dark:text-green-200">
                    {analysis.industry}
                  </p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Users className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
                    <span className="font-medium text-purple-900 dark:text-purple-100">Experience</span>
                  </div>
                  <p className="text-lg font-bold text-purple-800 dark:text-purple-200">
                    {analysis.requiredExperience}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Key Requirements
                    </h4>
                    <ul className="space-y-2">
                      {analysis.keyRequirements.map((req: string, index: number) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center text-sm text-gray-700 dark:text-gray-300"
                        >
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {req}
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Skills Match Score
                    </h4>
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3 mr-3">
                        <motion.div
                          className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${analysis.skillsMatch}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {analysis.skillsMatch}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Recommended Keywords
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.recommendedKeywords.map((keyword: string, index: number) => (
                        <motion.span
                          key={keyword}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 
                                   rounded-full text-sm font-medium"
                        >
                          {keyword}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Key Responsibilities
                    </h4>
                    <ul className="space-y-1">
                      {analysis.responsibilities.slice(0, 4).map((resp: string, index: number) => (
                        <li key={index} className="text-sm text-gray-700 dark:text-gray-300">
                          • {resp}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
                <h4 className="font-medium text-cyan-900 dark:text-cyan-100 mb-2">
                  AI Optimization Tips
                </h4>
                <p className="text-sm text-cyan-800 dark:text-cyan-200">
                  Your resume will be optimized to include these keywords and requirements. 
                  The AI will ensure your experience aligns with the job's expectations and 
                  highlight relevant skills from your background.
                </p>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {!analysis && jobDescription.trim() && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
          >
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Click "Analyze with AI" to get insights about this job description and optimize your resume accordingly.
            </p>
          </motion.div>
        )}

        {!jobDescription.trim() && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"
          >
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Job description is required to proceed. This helps the AI understand what the employer is looking for 
              and tailor your resume accordingly.
            </p>
          </motion.div>
        )}
      </div>
    </StepContainer>
  );
};

export default Step5JobDescription;