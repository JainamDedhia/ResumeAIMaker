import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, MessageSquare } from 'lucide-react';
import { useResume } from '../../contexts/ResumeContext';
import StepContainer from './StepContainer';
import GlassCard from '../ui/GlassCard';

interface LinkedInPost {
  content: string;
}

const Step3LinkedInPosts: React.FC = () => {
  const { resumeData, updateResumeData, nextStep, prevStep, completeStep } = useResume();
  const [posts, setPosts] = useState<LinkedInPost[]>(resumeData.linkedinPosts || []);
  const [currentPost, setCurrentPost] = useState('');

  const addPost = () => {
    if (currentPost.trim()) {
      const newPosts = [...posts, { content: currentPost.trim() }];
      setPosts(newPosts);
      updateResumeData({ linkedinPosts: newPosts });
      setCurrentPost('');
      if (newPosts.length > 0) {
        completeStep(3);
      }
    }
  };

  const removePost = (index: number) => {
    const newPosts = posts.filter((_, i) => i !== index);
    setPosts(newPosts);
    updateResumeData({ linkedinPosts: newPosts });
  };

  const handleNext = () => {
    nextStep();
  };

  const handleSkip = () => {
    completeStep(3);
    nextStep();
  };

  return (
    <StepContainer
      title="LinkedIn Posts & Achievements"
      description="Add your recent LinkedIn posts, achievements, or professional highlights to showcase your expertise"
      onNext={handleNext}
      onPrev={prevStep}
      canGoNext={true}
      canGoPrev={true}
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Add LinkedIn Post or Professional Achievement
            </label>
            <textarea
              value={currentPost}
              onChange={(e) => setCurrentPost(e.target.value)}
              placeholder="Paste your LinkedIn post content, professional achievement, award, or any career highlight you want to include in your resume..."
              className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                       focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
                       placeholder-gray-400 dark:placeholder-gray-500 resize-none"
            />
          </div>

          <div className="flex space-x-4">
            <motion.button
              onClick={addPost}
              disabled={!currentPost.trim()}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 
                       hover:from-cyan-600 hover:to-blue-700 text-white font-medium rounded-lg 
                       transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Post
            </motion.button>

            <motion.button
              onClick={handleSkip}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 
                       hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Skip This Step
            </motion.button>
          </div>
        </div>

        {posts.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Added Posts & Achievements ({posts.length})
            </h3>
            <div className="space-y-4">
              {posts.map((post, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className="p-4 relative">
                    <button
                      onClick={() => removePost(index)}
                      className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 
                               dark:text-gray-500 dark:hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    
                    <div className="pr-8">
                      <p className="text-gray-800 dark:text-gray-200 mb-3">
                        {post.content}
                      </p>
                      
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        <span>Professional Achievement #{index + 1}</span>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {posts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <MessageSquare className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No posts or achievements added yet.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-left max-w-md mx-auto">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                What to include:
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Recent LinkedIn posts about your work</li>
                <li>• Professional achievements or awards</li>
                <li>• Project highlights or success stories</li>
                <li>• Industry insights you've shared</li>
                <li>• Speaking engagements or publications</li>
              </ul>
            </div>
          </motion.div>
        )}
      </div>
    </StepContainer>
  );
};

export default Step3LinkedInPosts;