export interface ParsedResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
    website?: string;
  };
  summary: string;
  experience: Array<{
    title: string;
    company: string;
    location?: string;
    startDate: string;
    endDate: string;
    current?: boolean;
    description: string[];
    achievements: string[];
    technologies?: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    location?: string;
    graduationDate: string;
    gpa?: string;
    honors?: string[];
    relevantCourses?: string[];
  }>;
  skills: {
    technical: string[];
    languages: string[];
    frameworks: string[];
    tools: string[];
    soft: string[];
  };
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    url?: string;
    github?: string;
    highlights: string[];
    startDate?: string;
    endDate?: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
    expiryDate?: string;
    credentialId?: string;
    url?: string;
  }>;
  awards?: Array<{
    title: string;
    issuer: string;
    date: string;
    description?: string;
  }>;
  publications?: Array<{
    title: string;
    authors: string[];
    journal: string;
    date: string;
    url?: string;
    doi?: string;
  }>;
  languages?: Array<{
    language: string;
    proficiency: 'Native' | 'Fluent' | 'Professional' | 'Conversational' | 'Basic';
  }>;
  volunteer?: Array<{
    organization: string;
    role: string;
    startDate: string;
    endDate?: string;
    description: string[];
  }>;
}

export class ResumeParser {
  static parseAIGeneratedResume(resumeText: string): ParsedResumeData {
    const lines = resumeText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    const result: ParsedResumeData = {
      personalInfo: {
        name: '',
        email: '',
        phone: '',
        location: ''
      },
      summary: '',
      experience: [],
      education: [],
      skills: {
        technical: [],
        languages: [],
        frameworks: [],
        tools: [],
        soft: []
      },
      projects: [],
      certifications: []
    };

    let currentSection = '';
    let currentExperience: any = null;
    let currentProject: any = null;
    let currentEducation: any = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const upperLine = line.toUpperCase();

      // Extract personal info from header
      if (i < 10) {
        if (!result.personalInfo.name && this.isNameLine(line)) {
          result.personalInfo.name = line;
          continue;
        }
        
        const email = this.extractEmail(line);
        if (email) result.personalInfo.email = email;
        
        const phone = this.extractPhone(line);
        if (phone) result.personalInfo.phone = phone;
        
        const linkedin = this.extractLinkedIn(line);
        if (linkedin) result.personalInfo.linkedin = linkedin;
        
        const github = this.extractGitHub(line);
        if (github) result.personalInfo.github = github;
        
        if (this.isLocationLine(line)) {
          result.personalInfo.location = line;
        }
      }

      // Identify sections
      if (this.isSectionHeader(upperLine)) {
        // Save current items
        if (currentExperience) {
          result.experience.push(currentExperience);
          currentExperience = null;
        }
        if (currentProject) {
          result.projects.push(currentProject);
          currentProject = null;
        }
        if (currentEducation) {
          result.education.push(currentEducation);
          currentEducation = null;
        }

        currentSection = this.identifySection(upperLine);
        continue;
      }

      // Process content based on current section
      switch (currentSection) {
        case 'summary':
          if (line && !this.isSectionHeader(upperLine)) {
            result.summary += (result.summary ? ' ' : '') + line;
          }
          break;

        case 'experience':
          if (this.isExperienceHeader(line)) {
            if (currentExperience) {
              result.experience.push(currentExperience);
            }
            currentExperience = this.parseExperienceHeader(line);
          } else if (currentExperience && line.startsWith('•')) {
            const bullet = line.substring(1).trim();
            if (this.isAchievement(bullet)) {
              currentExperience.achievements.push(bullet);
            } else {
              currentExperience.description.push(bullet);
            }
          }
          break;

        case 'projects':
          if (this.isProjectHeader(line)) {
            if (currentProject) {
              result.projects.push(currentProject);
            }
            currentProject = this.parseProjectHeader(line);
          } else if (currentProject && line.startsWith('•')) {
            currentProject.highlights.push(line.substring(1).trim());
          } else if (currentProject && line.toLowerCase().includes('technology')) {
            currentProject.technologies = this.extractTechnologies(line);
          }
          break;

        case 'education':
          if (this.isEducationHeader(line)) {
            if (currentEducation) {
              result.education.push(currentEducation);
            }
            currentEducation = this.parseEducationHeader(line);
          }
          break;

        case 'skills':
          this.parseSkillsLine(line, result.skills);
          break;

        case 'certifications':
          if (line && !line.startsWith('•')) {
            result.certifications.push(this.parseCertification(line));
          }
          break;
      }
    }

    // Add final items
    if (currentExperience) result.experience.push(currentExperience);
    if (currentProject) result.projects.push(currentProject);
    if (currentEducation) result.education.push(currentEducation);

    return this.cleanupData(result);
  }

  private static isNameLine(line: string): boolean {
    return line.length > 2 && line.length < 50 && 
           /^[A-Z][a-zA-Z\s]+$/.test(line) && 
           !line.includes('@') && !line.includes('http') &&
           !line.toLowerCase().includes('summary') &&
           !line.toLowerCase().includes('experience');
  }

  private static extractEmail(line: string): string | null {
    const emailMatch = line.match(/[\w.-]+@[\w.-]+\.\w+/);
    return emailMatch ? emailMatch[0] : null;
  }

  private static extractPhone(line: string): string | null {
    const phoneMatch = line.match(/[\+]?[\d\s\-\(\)]{10,}/);
    return phoneMatch ? phoneMatch[0].trim() : null;
  }

  private static extractLinkedIn(line: string): string | null {
    const linkedinMatch = line.match(/linkedin\.com\/in\/[\w-]+/i);
    return linkedinMatch ? linkedinMatch[0] : null;
  }

  private static extractGitHub(line: string): string | null {
    const githubMatch = line.match(/github\.com\/[\w-]+/i);
    return githubMatch ? githubMatch[0] : null;
  }

  private static isLocationLine(line: string): boolean {
    return /^[A-Z][a-z]+,\s*[A-Z][a-z]+/.test(line) || 
           /^[A-Z][a-z]+\s*,\s*[A-Z]{2}/.test(line);
  }

  private static isSectionHeader(line: string): boolean {
    const sectionKeywords = [
      'PROFESSIONAL SUMMARY', 'SUMMARY', 'OBJECTIVE',
      'EXPERIENCE', 'WORK EXPERIENCE', 'PROFESSIONAL EXPERIENCE',
      'EDUCATION', 'ACADEMIC BACKGROUND',
      'SKILLS', 'TECHNICAL SKILLS', 'CORE SKILLS',
      'PROJECTS', 'KEY PROJECTS', 'NOTABLE PROJECTS',
      'CERTIFICATIONS', 'CERTIFICATES',
      'AWARDS', 'ACHIEVEMENTS', 'HONORS'
    ];
    
    return sectionKeywords.some(keyword => line.includes(keyword));
  }

  private static identifySection(line: string): string {
    if (line.includes('SUMMARY') || line.includes('OBJECTIVE')) return 'summary';
    if (line.includes('EXPERIENCE')) return 'experience';
    if (line.includes('EDUCATION')) return 'education';
    if (line.includes('SKILLS')) return 'skills';
    if (line.includes('PROJECTS')) return 'projects';
    if (line.includes('CERTIFICATIONS') || line.includes('CERTIFICATES')) return 'certifications';
    if (line.includes('AWARDS') || line.includes('ACHIEVEMENTS')) return 'awards';
    return '';
  }

  private static isExperienceHeader(line: string): boolean {
    return /^[A-Z][a-zA-Z\s]+ \| [A-Z][a-zA-Z\s]+ \| [\d\-\s]+/.test(line) ||
           /^[A-Z][a-zA-Z\s]+$/.test(line) && line.length < 50 && !line.startsWith('•');
  }

  private static parseExperienceHeader(line: string): any {
    const parts = line.split('|').map(p => p.trim());
    if (parts.length >= 3) {
      return {
        title: parts[0],
        company: parts[1],
        startDate: parts[2].split('-')[0]?.trim() || '',
        endDate: parts[2].split('-')[1]?.trim() || 'Present',
        current: parts[2].toLowerCase().includes('present'),
        description: [],
        achievements: [],
        technologies: []
      };
    }
    
    return {
      title: line,
      company: '',
      startDate: '',
      endDate: '',
      description: [],
      achievements: [],
      technologies: []
    };
  }

  private static isProjectHeader(line: string): boolean {
    return !line.startsWith('•') && line.length > 5 && line.length < 100 &&
           !line.toLowerCase().includes('technology') &&
           !line.toLowerCase().includes('stack');
  }

  private static parseProjectHeader(line: string): any {
    return {
      name: line,
      description: '',
      technologies: [],
      highlights: [],
      url: '',
      github: ''
    };
  }

  private static isEducationHeader(line: string): boolean {
    return (line.includes('Bachelor') || line.includes('Master') || line.includes('PhD') ||
            line.includes('University') || line.includes('College')) && !line.startsWith('•');
  }

  private static parseEducationHeader(line: string): any {
    const parts = line.split('|').map(p => p.trim());
    return {
      degree: parts[0] || line,
      institution: parts[1] || '',
      graduationDate: parts[2] || '',
      gpa: '',
      honors: [],
      relevantCourses: []
    };
  }

  private static parseSkillsLine(line: string, skills: any): void {
    if (line.toLowerCase().includes('technical') || line.toLowerCase().includes('programming')) {
      const skillsList = line.split(':')[1]?.split(',').map(s => s.trim()) || [];
      skills.technical.push(...skillsList);
    } else if (line.toLowerCase().includes('framework')) {
      const skillsList = line.split(':')[1]?.split(',').map(s => s.trim()) || [];
      skills.frameworks.push(...skillsList);
    } else if (line.toLowerCase().includes('tools')) {
      const skillsList = line.split(':')[1]?.split(',').map(s => s.trim()) || [];
      skills.tools.push(...skillsList);
    } else if (line.includes(':')) {
      const skillsList = line.split(':')[1]?.split(',').map(s => s.trim()) || [];
      skills.technical.push(...skillsList);
    } else {
      const skillsList = line.split(',').map(s => s.trim());
      skills.technical.push(...skillsList);
    }
  }

  private static parseCertification(line: string): any {
    return {
      name: line,
      issuer: '',
      date: '',
      credentialId: '',
      url: ''
    };
  }

  private static isAchievement(text: string): boolean {
    const achievementKeywords = ['increased', 'improved', 'reduced', 'achieved', 'led', 'managed', 'delivered', 'implemented'];
    return achievementKeywords.some(keyword => text.toLowerCase().includes(keyword));
  }

  private static extractTechnologies(line: string): string[] {
    const techPart = line.split(':')[1] || line;
    return techPart.split(',').map(tech => tech.trim()).filter(tech => tech.length > 0);
  }

  private static cleanupData(data: ParsedResumeData): ParsedResumeData {
    // Remove empty arrays and clean up data
    data.skills.technical = [...new Set(data.skills.technical.filter(skill => skill.length > 0))];
    data.skills.frameworks = [...new Set(data.skills.frameworks.filter(skill => skill.length > 0))];
    data.skills.tools = [...new Set(data.skills.tools.filter(skill => skill.length > 0))];
    
    return data;
  }
}