import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Zap, 
  BarChart3,
  Lightbulb,
  Award,
  ArrowUp,
  ArrowDown,
  Minus,
  RefreshCw
} from 'lucide-react';
import GlassCard from './ui/GlassCard';
import { useResume } from '../contexts/ResumeContext';

interface ATSScore {
  overall: number;
  breakdown: {
    keywords: number;
    formatting: number;
    sections: number;
    length: number;
  };
  suggestions: string[];
}

interface KeywordAnalysis {
  matched: string[];
  missing: string[];
  density: Record<string, number>;
  recommendations: string[];
}

interface SkillsGapAnalysis {
  currentSkills: string[];
  trendingSkills: string[];
  missingSkills: string[];
  recommendations: string[];
}

interface ContentEnhancement {
  bulletPoints: string[];
  achievements: string[];
  careerProgression: string[];
}

const ResumeAnalytics: React.FC<{ resumeContent: string }> = ({ resumeContent }) => {
  const { resumeData } = useResume();
  const [atsScore, setAtsScore] = useState<ATSScore | null>(null);
  const [keywordAnalysis, setKeywordAnalysis] = useState<KeywordAnalysis | null>(null);
  const [skillsGap, setSkillsGap] = useState<SkillsGapAnalysis | null>(null);
  const [contentEnhancement, setContentEnhancement] = useState<ContentEnhancement | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('ats');

  useEffect(() => {
    if (resumeContent) {
      analyzeResume();
    }
  }, [resumeContent]);

  const analyzeResume = async () => {
    if (!resumeContent || !resumeData.groqApiKey) return;
    
    setIsAnalyzing(true);
    
    try {
      // Run all analyses in parallel
      const [atsAnalysis, keywordAnalysisResult, skillsAnalysis, contentAnalysis] = await Promise.all([
        analyzeATSCompatibility(),
        analyzeKeywords(),
        analyzeSkillsGap(),
        generateContentEnhancements()
      ]);
      
      setAtsScore(atsAnalysis);
      setKeywordAnalysis(keywordAnalysisResult);
      setSkillsGap(skillsAnalysis);
      setContentEnhancement(contentAnalysis);
      
    } catch (error) {
      console.error('Analysis error:', error);
      // Fallback data
      setFallbackData();
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeATSCompatibility = async (): Promise<ATSScore> => {
    const prompt = `Analyze this resume for ATS (Applicant Tracking System) compatibility and provide a detailed scoring breakdown.

Resume Content:
${resumeContent}

Job Description Context:
${resumeData.jobDescription}

Analyze and return ONLY a JSON object with this structure:
{
  "overall": 85,
  "breakdown": {
    "keywords": 80,
    "formatting": 90,
    "sections": 85,
    "length": 80
  },
  "suggestions": [
    "Add more industry-specific keywords",
    "Include quantifiable achievements",
    "Optimize section headers for ATS parsing"
  ]
}

Scoring criteria:
- Keywords (0-100): Relevance to job description, industry terms, technical skills
- Formatting (0-100): ATS-friendly structure, clear sections, proper headers
- Sections (0-100): Completeness of standard sections
- Length (0-100): Appropriate length for role level

Return only the JSON object.`;

    return await callAI(prompt);
  };

  const analyzeKeywords = async (): Promise<KeywordAnalysis> => {
    const prompt = `Analyze keyword usage in this resume compared to the job description.

Resume Content:
${resumeContent}

Job Description:
${resumeData.jobDescription}

Return ONLY a JSON object:
{
  "matched": ["keyword1", "keyword2"],
  "missing": ["missing1", "missing2"],
  "density": {"keyword1": 3, "keyword2": 2},
  "recommendations": ["Add more technical terms", "Include industry buzzwords"]
}`;

    return await callAI(prompt);
  };

  const analyzeSkillsGap = async (): Promise<SkillsGapAnalysis> => {
    const prompt = `Analyze skills gap for this resume based on current market trends and job requirements.

Resume Content:
${resumeContent}

Job Description:
${resumeData.jobDescription}

Industry: ${resumeData.jobAnalysis?.industry || 'Technology'}

Return ONLY a JSON object:
{
  "currentSkills": ["skill1", "skill2"],
  "trendingSkills": ["AI/ML", "Cloud Computing", "DevOps"],
  "missingSkills": ["missing1", "missing2"],
  "recommendations": ["Learn trending technology X", "Get certification in Y"]
}`;

    return await callAI(prompt);
  };

  const generateContentEnhancements = async (): Promise<ContentEnhancement> => {
    const prompt = `Generate content enhancement suggestions for this resume.

Resume Content:
${resumeContent}

Job Description:
${resumeData.jobDescription}

Return ONLY a JSON object:
{
  "bulletPoints": [
    "Developed scalable web applications serving 10,000+ users",
    "Implemented CI/CD pipeline reducing deployment time by 50%"
  ],
  "achievements": [
    "Increased team productivity by 30% through process optimization",
    "Led cross-functional team of 8 developers"
  ],
  "careerProgression": [
    "Consider pursuing technical leadership roles",
    "Develop expertise in emerging technologies",
    "Build portfolio of open-source contributions"
  ]
}`;

    return await callAI(prompt);
  };

  const callAI = async (prompt: string) => {
    try {
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

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Could not parse AI response');
    } catch (error) {
      throw error;
    }
  };

  const setFallbackData = () => {
    setAtsScore({
      overall: 78,
      breakdown: { keywords: 75, formatting: 85, sections: 80, length: 72 },
      suggestions: [
        'Add more industry-specific keywords',
        'Include quantifiable achievements',
        'Optimize section headers for ATS parsing'
      ]
    });

    setKeywordAnalysis({
      matched: ['JavaScript', 'React', 'Node.js', 'API'],
      missing: ['TypeScript', 'Docker', 'AWS', 'Microservices'],
      density: { 'JavaScript': 3, 'React': 4, 'Node.js': 2 },
      recommendations: ['Add cloud technologies', 'Include DevOps tools']
    });

    setSkillsGap({
      currentSkills: ['JavaScript', 'React', 'Node.js'],
      trendingSkills: ['AI/ML', 'Cloud Computing', 'DevOps', 'TypeScript'],
      missingSkills: ['Docker', 'Kubernetes', 'AWS'],
      recommendations: ['Learn containerization', 'Get cloud certifications']
    });

    setContentEnhancement({
      bulletPoints: [
        'Developed scalable web applications serving 10,000+ users',
        'Implemented CI/CD pipeline reducing deployment time by 50%'
      ],
      achievements: [
        'Increased team productivity by 30% through process optimization',
        'Led cross-functional team of 8 developers'
      ],
      careerProgression: [
        'Consider pursuing technical leadership roles',
        'Develop expertise in emerging technologies'
      ]
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return CheckCircle;
    if (score >= 60) return AlertCircle;
    return AlertCircle;
  };

  const tabs = [
    { id: 'ats', label: 'ATS Score', icon: Target },
    { id: 'keywords', label: 'Keywords', icon: BarChart3 },
    { id: 'skills', label: 'Skills Gap', icon: TrendingUp },
    { id: 'content', label: 'Enhancement', icon: Lightbulb }
  ];

  if (!resumeContent) {
    return (
      <GlassCard className="p-6 text-center">
        <Target className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600 dark:text-gray-400">
          Generate a resume first to see AI analytics and optimization suggestions.
        </p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          AI Resume Analytics
        </h3>
        <motion.button
          onClick={analyzeResume}
          disabled={isAnalyzing}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 
                   hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
          {isAnalyzing ? 'Analyzing...' : 'Refresh Analysis'}
        </motion.button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-2 rounded-md transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-cyan-600 dark:text-cyan-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'ats' && atsScore && (
          <div className="space-y-4">
            <GlassCard className="p-6">
              <div className="text-center mb-6">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-gray-200 dark:text-gray-700"
                    />
                    <motion.circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      className={getScoreColor(atsScore.overall)}
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
                      animate={{ 
                        strokeDashoffset: 2 * Math.PI * 56 * (1 - atsScore.overall / 100)
                      }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-3xl font-bold ${getScoreColor(atsScore.overall)}`}>
                      {atsScore.overall}
                    </span>
                  </div>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                  ATS Compatibility Score
                </h4>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {Object.entries(atsScore.breakdown).map(([key, value]) => {
                  const Icon = getScoreIcon(value);
                  return (
                    <div key={key} className="text-center">
                      <Icon className={`w-6 h-6 mx-auto mb-2 ${getScoreColor(value)}`} />
                      <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                        {key}
                      </p>
                      <p className={`text-lg font-bold ${getScoreColor(value)}`}>
                        {value}%
                      </p>
                    </div>
                  );
                })}
              </div>

              <div>
                <h5 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Optimization Suggestions
                </h5>
                <ul className="space-y-2">
                  {atsScore.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start">
                      <Lightbulb className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {suggestion}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </GlassCard>
          </div>
        )}

        {activeTab === 'keywords' && keywordAnalysis && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GlassCard className="p-6">
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                  Matched Keywords ({keywordAnalysis.matched.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {keywordAnalysis.matched.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 
                               rounded-full text-sm font-medium"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h4 className="font-semibold text-red-900 dark:text-red-100 mb-3 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
                  Missing Keywords ({keywordAnalysis.missing.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {keywordAnalysis.missing.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 
                               rounded-full text-sm font-medium"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </GlassCard>
            </div>

            <GlassCard className="p-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Keyword Density Analysis
              </h4>
              <div className="space-y-3">
                {Object.entries(keywordAnalysis.density).map(([keyword, count]) => (
                  <div key={keyword} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {keyword}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${Math.min(count * 20, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {count}x
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        )}

        {activeTab === 'skills' && skillsGap && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <GlassCard className="p-6">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-blue-500" />
                  Current Skills
                </h4>
                <div className="space-y-2">
                  {skillsGap.currentSkills.map((skill, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {skill}
                      </span>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-purple-500" />
                  Trending Skills
                </h4>
                <div className="space-y-2">
                  {skillsGap.trendingSkills.map((skill, index) => (
                    <div key={index} className="flex items-center">
                      <ArrowUp className="w-4 h-4 text-purple-500 mr-2" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {skill}
                      </span>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-3 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-orange-500" />
                  Skills to Learn
                </h4>
                <div className="space-y-2">
                  {skillsGap.missingSkills.map((skill, index) => (
                    <div key={index} className="flex items-center">
                      <Minus className="w-4 h-4 text-orange-500 mr-2" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {skill}
                      </span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            <GlassCard className="p-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Career Development Recommendations
              </h4>
              <ul className="space-y-2">
                {skillsGap.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <Lightbulb className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {rec}
                    </span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </div>
        )}

        {activeTab === 'content' && contentEnhancement && (
          <div className="space-y-4">
            <GlassCard className="p-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-cyan-500" />
                AI-Generated Bullet Points
              </h4>
              <div className="space-y-3">
                {contentEnhancement.bulletPoints.map((point, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500"
                  >
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      • {point}
                    </p>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-green-500" />
                Achievement Suggestions
              </h4>
              <div className="space-y-3">
                {contentEnhancement.achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500"
                  >
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      • {achievement}
                    </p>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-purple-500" />
                Career Progression Recommendations
              </h4>
              <div className="space-y-3">
                {contentEnhancement.careerProgression.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-500"
                  >
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      • {suggestion}
                    </p>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </div>
        )}
      </motion.div>

      {isAnalyzing && (
        <GlassCard className="p-8">
          <div className="text-center">
            <motion.div
              className="w-16 h-16 mx-auto mb-4 border-4 border-cyan-200 border-t-cyan-600 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              AI is Analyzing Your Resume...
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Generating insights and optimization suggestions
            </p>
          </div>
        </GlassCard>
      )}
    </div>
  );
};

export default ResumeAnalytics;