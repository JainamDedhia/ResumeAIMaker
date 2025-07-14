import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { ResumeData, Step } from '../types';
import { ResumeTemplate } from '../components/templates/TemplateSelector';

interface ResumeContextType {
  resumeData: ResumeData;
  currentStep: number;
  steps: Step[];
  updateResumeData: (data: Partial<ResumeData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  setCurrentStep: (step: number) => void;
  completeStep: (stepId: number) => void;
}

const initialResumeData: ResumeData = {
  groqApiKey: '',
  githubProfile: {
    username: '',
    bio: '',
    skills: [],
    projects: []
  },
  linkedinPdf: null,
  linkedinPosts: [],
  existingResume: null,
  jobDescription: '',
  selectedTemplate: null,
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    portfolio: ''
  }
};

const initialSteps: Step[] = [
  { id: 1, title: 'GitHub Profile', description: 'Connect your GitHub account', completed: false, active: true },
  { id: 2, title: 'LinkedIn PDF', description: 'Upload your LinkedIn profile', completed: false, active: false },
  { id: 3, title: 'LinkedIn Posts', description: 'Add recent posts', completed: false, active: false },
  { id: 4, title: 'Existing Resume', description: 'Upload current resume', completed: false, active: false },
  { id: 5, title: 'Job Description', description: 'Target job details', completed: false, active: false },
  { id: 6, title: 'Template', description: 'Choose template', completed: false, active: false },
  { id: 7, title: 'Generate Resume', description: 'AI-powered generation', completed: false, active: false }
];

type ResumeAction = 
  | { type: 'UPDATE_DATA'; payload: Partial<ResumeData> }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'COMPLETE_STEP'; payload: number };

const resumeReducer = (state: any, action: ResumeAction) => {
  switch (action.type) {
    case 'UPDATE_DATA':
      return {
        ...state,
        resumeData: { ...state.resumeData, ...action.payload }
      };
    case 'NEXT_STEP':
      if (state.currentStep < 7) {
        const newSteps = state.steps.map((step: Step) => ({
          ...step,
          active: step.id === state.currentStep + 1
        }));
        return {
          ...state,
          currentStep: state.currentStep + 1,
          steps: newSteps
        };
      }
      return state;
    case 'PREV_STEP':
      if (state.currentStep > 0) {
        const newSteps = state.steps.map((step: Step) => ({
          ...step,
          active: step.id === state.currentStep - 1
        }));
        return {
          ...state,
          currentStep: state.currentStep - 1,
          steps: newSteps
        };
      }
      return state;
    case 'SET_STEP':
      const newSteps = state.steps.map((step: Step) => ({
        ...step,
        active: step.id === action.payload
      }));
      return {
        ...state,
        currentStep: action.payload,
        steps: newSteps
      };
    case 'COMPLETE_STEP':
      const updatedSteps = state.steps.map((step: Step) => 
        step.id === action.payload ? { ...step, completed: true } : step
      );
      return {
        ...state,
        steps: updatedSteps
      };
    default:
      return state;
  }
};

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};

export const ResumeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(resumeReducer, {
    resumeData: initialResumeData,
    currentStep: 0, // Start with API key step
    steps: initialSteps
  });

  const updateResumeData = (data: Partial<ResumeData>) => {
    dispatch({ type: 'UPDATE_DATA', payload: data });
  };

  const nextStep = () => {
    dispatch({ type: 'NEXT_STEP' });
  };

  const prevStep = () => {
    dispatch({ type: 'PREV_STEP' });
  };

  const setCurrentStep = (step: number) => {
    dispatch({ type: 'SET_STEP', payload: step });
  };

  const completeStep = (stepId: number) => {
    dispatch({ type: 'COMPLETE_STEP', payload: stepId });
  };

  return (
    <ResumeContext.Provider value={{
      resumeData: state.resumeData,
      currentStep: state.currentStep,
      steps: state.steps,
      updateResumeData,
      nextStep,
      prevStep,
      setCurrentStep,
      completeStep
    }}>
      {children}
    </ResumeContext.Provider>
  );
};