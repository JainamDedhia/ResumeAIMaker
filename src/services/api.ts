const API_BASE = 'http://localhost:8000';

export interface GitHubData {
  profile: {
    name: string;
    bio: string;
    location: string;
    blog: string;
    followers: number;
    following: number;
    public_repos: number;
    html_url: string;
  };
  repositories: Array<{
    name: string;
    description: string;
    language: string;
    stars: number;
    forks: number;
    html_url: string;
    readme_content?: string;
  }>;
}

export interface LinkedInPost {
  url: string;
  content: string;
}

export interface GenerateResumeRequest {
  github_data?: GitHubData;
  linkedin_pdf_text?: string;
  linkedin_posts?: LinkedInPost[];
  existing_resume?: string;
  job_description: string;
  groq_api_key: string;
}

export const apiService = {
  async scrapeGithub(username: string): Promise<GitHubData> {
    const response = await fetch(`${API_BASE}/scrape-github`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.detail || 'Failed to fetch GitHub data');
    }

    return result.data;
  },

  async parseLinkedinPdf(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE}/parse-linkedin-pdf`, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.detail || 'Failed to parse LinkedIn PDF');
    }

    return result.text;
  },

  async scrapeLinkedinPosts(urls: string[]): Promise<LinkedInPost[]> {
    const response = await fetch(`${API_BASE}/scrape-linkedin-posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ urls }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.detail || 'Failed to scrape LinkedIn posts');
    }

    return result.posts;
  },

  async parseResume(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE}/parse-resume`, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.detail || 'Failed to parse resume');
    }

    return result.text;
  },

  async generateResume(data: GenerateResumeRequest): Promise<string> {
    const response = await fetch(`${API_BASE}/generate-resume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.detail || 'Failed to generate resume');
    }

    return result.resume;
  }
};