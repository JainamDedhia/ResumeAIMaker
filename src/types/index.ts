export interface Step {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  active: boolean;
}

export interface ResumeData {
  openrouterApiKey?: string;
  githubProfile: {
    username: string;
    bio: string;
    skills: string[];
    projects: Array<{
      name: string;
      description: string;
      stars: number;
      language: string;
    }>;
  };
  linkedinPdf: File | null;
  linkedinPdfText?: string;
  linkedinAnalysis?: {
    name: string;
    headline: string;
    location: string;
    summary: string;
    experience: Array<{
      title: string;
      company: string;
      duration: string;
      description: string;
    }>;
    education: Array<{
      school: string;
      degree: string;
      field: string;
      year: string;
    }>;
    skills: string[];
    certifications: string[];
  };
  linkedinPosts: Array<{
    content: string;
  }>;
  existingResume: File | null;
  existingResumeText?: string;
  resumeAnalysis?: {
    name: string;
    contact: {
      email: string;
      phone: string;
      location: string;
    };
    summary: string;
    experience: Array<{
      title: string;
      company: string;
      duration: string;
      description: string;
    }>;
    education: Array<{
      school: string;
      degree: string;
      field: string;
      year: string;
    }>;
    skills: string[];
    sections: string[];
  };
  jobDescription: string;
  jobAnalysis?: {
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
  };
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    portfolio: string;
  };
}

export interface GeneratedResume {
  id: string;
  content: string;
  createdAt: Date;
  jobTitle: string;
  score: number;
}