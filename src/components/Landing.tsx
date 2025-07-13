import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Github, Linkedin, FileText, Target, Sparkles, CheckCircle } from 'lucide-react';
import GlassCard from './ui/GlassCard';

interface LandingProps {
  onGetStarted: () => void;
}

const Landing: React.FC<LandingProps> = ({ onGetStarted }) => {
  const features = [
    {
      icon: Github,
      title: 'GitHub Integration',
      description: 'Import your repositories and showcase your coding skills automatically'
    },
    {
      icon: Linkedin,
      title: 'LinkedIn Analysis',
      description: 'Extract professional experience and network insights from your profile'
    },
    {
      icon: Target,
      title: 'Job Matching',
      description: 'AI-powered optimization based on specific job descriptions'
    },
    {
      icon: Zap,
      title: 'ATS Optimization',
      description: 'Ensure your resume passes Applicant Tracking Systems'
    },
    {
      icon: FileText,
      title: 'Professional Format',
      description: 'Beautiful, modern resume layouts that impress recruiters'
    },
    {
      icon: Sparkles,
      title: 'AI Enhancement',
      description: 'Smart content suggestions and keyword optimization'
    }
  ];

  const steps = [
    'Connect GitHub Profile',
    'Upload LinkedIn PDF',
    'Add Recent Posts',
    'Upload Existing Resume',
    'Paste Job Description',
    'Generate AI Resume'
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-8"
          >
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 
                          rounded-full border border-cyan-500/30 mb-6">
              <Sparkles className="w-5 h-5 text-cyan-400 mr-2" />
              <span className="text-cyan-300 font-medium">Next-Gen Resume Builder</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                AI Resume
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">Generator</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Transform your career with AI-powered resume generation. Connect your GitHub, 
              LinkedIn, and job targets to create the perfect resume in minutes.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <motion.button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 
                       text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg hover:shadow-xl 
                       transition-all duration-300 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Zap className="w-6 h-6 mr-2" />
              Get Started Free
              <ArrowRight className="w-6 h-6 ml-2" />
            </motion.button>
            
            <motion.button
              className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 
                       hover:bg-gray-50 dark:hover:bg-gray-800 font-medium py-4 px-8 rounded-lg text-lg 
                       transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Watch Demo
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
            >
              <GlassCard className="p-6 h-full">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg 
                                flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white ml-4">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Six simple steps to your perfect resume
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4 + index * 0.1, duration: 0.5 }}
              >
                <GlassCard className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full 
                                flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">{index + 1}</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {step}
                  </h4>
                  <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="text-center mt-16"
        >
          <GlassCard className="p-8 max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Transform Your Career?
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Join thousands of professionals who've landed their dream jobs with AI-generated resumes.
            </p>
            <motion.button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 
                       text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg hover:shadow-xl 
                       transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Building Now
            </motion.button>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default Landing;