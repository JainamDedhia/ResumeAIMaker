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
      const prompt = `You are an expert job market analyst and ATS specialist. Analyze this job description and extract comprehensive insights.

Job Description:
${jobDescription}

Extract and return ONLY a JSON object with this exact structure:
{
  "keyRequirements": ["requirement1", "requirement2", "requirement3"],
  "skillsMatch": 85,
  "recommendedKeywords": ["keyword1", "keyword2", "keyword3"],
  "jobLevel": "Senior/Mid/Junior/Executive",
  "industry": "Technology/Finance/Healthcare/etc",
  "companySize": "Startup/Mid-size/Enterprise",
  "salaryRange": "Estimated range or Not specified",
  "requiredExperience": "X years",
  "preferredSkills": ["skill1", "skill2", "skill3"],
  "responsibilities": ["responsibility1", "responsibility2", "responsibility3"]
}

Focus on:
1. Extract the most important technical and soft skills mentioned
2. Identify key requirements that candidates must have
3. Determine the seniority level based on responsibilities and requirements
4. Extract industry-specific keywords that should be in a resume
5. List main job responsibilities
6. Estimate experience level required

Return only the JSON object, no other text.`;

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
      }

      const data = await response.json();
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
      
      // Enhanced fallback analysis
      const text = jobDescription.toLowerCase();
      
      // Extract common tech skills
      const techSkills = ['javascript', 'python', 'react', 'node.js', 'java', 'c++', 'sql', 'aws', 'docker', 'kubernetes', 'git', 'html', 'css', 'typescript', 'angular', 'vue', 'mongodb', 'postgresql'];
      const foundSkills = techSkills.filter(skill => text.includes(skill));
      
      // Determine job level
      let jobLevel = 'Mid-level';
      if (text.includes('senior') || text.includes('lead') || text.includes('principal')) {
        jobLevel = 'Senior';
      } else if (text.includes('junior') || text.includes('entry') || text.includes('associate')) {
        jobLevel = 'Junior';
      } else if (text.includes('director') || text.includes('manager') || text.includes('head of')) {
        jobLevel = 'Executive';
      }
      
      // Determine industry
      let industry = 'Technology';
      if (text.includes('finance') || text.includes('bank')) industry = 'Finance';
      else if (text.includes('health') || text.includes('medical')) industry = 'Healthcare';
      else if (text.includes('education') || text.includes('school')) industry = 'Education';
      
      // Extract experience requirements
      const expMatch = jobDescription.match(/(\d+)[\+\-\s]*years?/i);
      const requiredExperience = expMatch ? `${expMatch[1]}+ years` : '2-5 years';
      
      const fallbackAnalysis: JobAnalysis = {
        keyRequirements: [
          'Strong technical skills',
          'Experience with relevant technologies',
          'Good communication skills',
          'Team collaboration',
          'Problem-solving abilities'
        ],
        skillsMatch: 75,
        recommendedKeywords: foundSkills.length > 0 ? foundSkills.slice(0, 8) : ['JavaScript', 'React', 'Node.js', 'API', 'Database'],
        jobLevel,
        industry,
        companySize: 'Mid-size',
        salaryRange: 'Not specified',
        requiredExperience,
        preferredSkills: ['Problem solving', 'Agile methodology', 'Version control', 'Testing', 'Documentation'],
        responsibilities: [
          'Develop and maintain software solutions',
          'Collaborate with cross-functional teams',
          'Participate in code reviews',
          'Contribute to technical documentation'
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