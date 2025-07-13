import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import { ResumeProvider } from './contexts/ResumeContext';
import Landing from './components/Landing';
import ResumeWizard from './components/ResumeWizard';
import ThemeToggle from './components/ui/ThemeToggle';
import ParticleBackground from './components/ui/ParticleBackground';

function App() {
  const [showWizard, setShowWizard] = useState(false);

  const handleGetStarted = () => {
    setShowWizard(true);
  };

  return (
    <ThemeProvider>
      <ResumeProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 
                      dark:from-gray-900 dark:via-blue-900 dark:to-slate-900 transition-all duration-300">
          <ParticleBackground />
          <ThemeToggle />
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {showWizard ? <ResumeWizard /> : <Landing onGetStarted={handleGetStarted} />}
          </motion.div>
        </div>
      </ResumeProvider>
    </ThemeProvider>
  );
}

export default App;