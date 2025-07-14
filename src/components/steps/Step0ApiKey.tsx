import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, Zap, ExternalLink } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useResume } from '../../contexts/ResumeContext';
import StepContainer from './StepContainer';
import GlassCard from '../ui/GlassCard';

interface ApiKeyFormData {
  apiKey: string;
}

const Step0ApiKey: React.FC = () => {
  const { resumeData, updateResumeData, nextStep } = useResume();
  const [isValidating, setIsValidating] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ApiKeyFormData>({
    defaultValues: {
      apiKey: resumeData.groqApiKey || ''
    }
  });

  const onSubmit = async (data: ApiKeyFormData) => {
    setIsValidating(true);
    // Simple validation - just check if it's not empty and looks like an API key
    if (data.apiKey.trim().length > 10) {
      updateResumeData({ groqApiKey: data.apiKey.trim() });
      setTimeout(() => {
        setIsValidating(false);
        nextStep();
      }, 1000);
    } else {
      setIsValidating(false);
    }
  };

  return (
    <StepContainer
      title="Setup AI Analysis"
      description="Provide your Groq API key to enable AI-powered analysis and resume generation"
      onNext={() => {}}
      canGoNext={false}
      canGoPrev={false}
    >
      <div className="space-y-6">
        <GlassCard className="p-6">
          <div className="text-center mb-6">
            <Zap className="w-16 h-16 mx-auto text-cyan-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              AI-Powered Resume Generation
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              We'll use Groq's fast AI to analyze your LinkedIn profile, existing resume, and job descriptions 
              to create the perfect tailored resume.
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              What you'll get with AI analysis:
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Intelligent parsing of your LinkedIn profile and existing resume</li>
              <li>• Smart job description analysis and keyword extraction</li>
              <li>• ATS-optimized resume generation tailored to specific roles</li>
              <li>• Professional content enhancement and formatting</li>
              <li>• FREE tier with 14,400 requests per day</li>
            </ul>
          </div>
        </GlassCard>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Key className="w-4 h-4 inline mr-1" />
              Groq API Key *
            </label>
            <input
              type="password"
              {...register('apiKey', { 
                required: 'API key is required',
                minLength: { value: 10, message: 'API key seems too short' }
              })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                       focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
                       placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="gsk_..."
            />
            {errors.apiKey && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.apiKey.message}
              </p>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={isValidating}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 
                     text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 
                     disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isValidating ? (
              <div className="flex items-center justify-center">
                <motion.div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Validating...
              </div>
            ) : (
              'Continue with AI Analysis'
            )}
          </motion.button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Don't have a Groq API key?
          </p>
          <a
            href="https://console.groq.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-cyan-600 dark:text-cyan-400 hover:underline"
          >
            Get your free API key here (14,400 requests/day)
            <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
            Why Groq?
          </h4>
          <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
            <li>• Completely FREE tier with generous limits</li>
            <li>• Lightning fast inference (up to 500 tokens/second)</li>
            <li>• High-quality AI models (Llama 3, Mixtral)</li>
            <li>• No credit card required for free tier</li>
          </ul>
        </div>
      </div>
    </StepContainer>
  );
};

export default Step0ApiKey;