import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Star, Code, ExternalLink } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useResume } from '../../contexts/ResumeContext';
import StepContainer from './StepContainer';
import GlassCard from '../ui/GlassCard';
import { apiService, GitHubData } from '../../services/api';
import Notification from '../ui/Notification';

interface GitHubFormData {
  username: string;
}

const Step1GitHubProfile: React.FC = () => {
  const { resumeData, updateResumeData, nextStep, completeStep } = useResume();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<GitHubData | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'warning', message: string } | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<GitHubFormData>({
    defaultValues: {
      username: resumeData.githubProfile.username
    }
  });

  const onSubmit = async (data: GitHubFormData) => {
    setIsLoading(true);
    setNotification(null);
    try {
      const profile = await apiService.scrapeGithub(data.username);
      setProfileData(profile);
      updateResumeData({
        githubProfile: {
          username: data.username,
          bio: profile.profile.bio,
          skills: [], // Will be extracted from repos
          projects: profile.repositories.map(repo => ({
            name: repo.name,
            description: repo.description,
            stars: repo.stars,
            language: repo.language
          }))
        }
      });
      completeStep(1);
      setNotification({
        type: 'success',
        message: `Successfully fetched ${profile.repositories.length} repositories!`
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to fetch GitHub profile'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    nextStep();
  };

  return (
    <StepContainer
      title="Connect Your GitHub Profile"
      description="Let's start by importing your GitHub profile to showcase your coding expertise"
      onNext={handleNext}
      canGoNext={profileData !== null}
      canGoPrev={false}
    >
      <div className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              GitHub Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Github className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                {...register('username', { required: 'GitHub username is required' })}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
                         placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Enter your GitHub username"
              />
            </div>
            {errors.username && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.username.message}
              </p>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 
                     text-white font-medium py-3 px-6 rounded-md transition-all duration-200 
                     disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <motion.div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Fetching Profile...
              </div>
            ) : (
              'Import GitHub Profile'
            )}
          </motion.button>
        </form>

        {profileData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                  <Github className="w-8 h-8 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {profileData.profile.name || 'GitHub User'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {profileData.profile.bio || 'No bio available'}
                  </p>
                </div>
              </div>

              <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {profileData.profile.public_repos}
                  </p>
                  <p className="text-sm text-blue-800 dark:text-blue-200">Repositories</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {profileData.profile.followers}
                  </p>
                  <p className="text-sm text-green-800 dark:text-green-200">Followers</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {profileData.profile.following}
                  </p>
                  <p className="text-sm text-purple-800 dark:text-purple-200">Following</p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {profileData.repositories.reduce((acc, repo) => acc + repo.stars, 0)}
                  </p>
                  <p className="text-sm text-orange-800 dark:text-orange-200">Total Stars</p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Top Projects
                </h4>
                <div className="grid gap-4 md:grid-cols-2">
                  {profileData.repositories.slice(0, 6).map((project, index: number) => (
                    <motion.div
                      key={project.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-semibold text-gray-900 dark:text-white">
                          {project.name}
                        </h5>
                        <div className="flex items-center text-yellow-500">
                          <Star className="w-4 h-4 mr-1" />
                          <span className="text-sm">{project.stars}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {project.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Code className="w-4 h-4 mr-1" />
                          {project.language}
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </GlassCard>
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

export default Step1GitHubProfile;