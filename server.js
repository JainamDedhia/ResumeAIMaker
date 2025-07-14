import express from 'express';
import cors from 'cors';
import multer from 'multer';
import axios from 'axios';
import { Builder, By, until } from 'selenium-webdriver';
import edge from 'selenium-webdriver/edge.js';
import fs from 'fs-extra';
import path from 'path';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;  

// Middleware
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173"],
  credentials: true,
  methods: ["*"],
  allowedHeaders: ["*"]
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Utility functions
function cleanLinkedinUrl(url) {
  return url.trim().split("?")[0];
}

async function setupBrowser() {
  const options = new edge.Options();
  options.addArguments("--headless");
  options.addArguments("--no-sandbox");
  options.addArguments("--disable-dev-shm-usage");
  options.addArguments("--disable-gpu");
  options.addArguments("--window-size=1920,1080");
  options.addArguments("--user-data-dir=/tmp/selenium_profile");
  
  // Use the local msedgedriver.exe
  const edgeDriverPath = path.join(__dirname, 'msedgedriver.exe');
  const service = new edge.Service(edgeDriverPath);
  
  return await new Builder()
    .forBrowser('MicrosoftEdge')
    .setEdgeService(service)
    .setEdgeOptions(options)
    .build();
}

async function scrapeLinkedinPost(driver, url, index) {
  console.log(`\n🔗 [${index}] Navigating to: ${url}`);
  await driver.get(url);
  await driver.sleep(5000);

  const selectors = [
    ".feed-shared-update-v2__description",
    ".update-components-text",
    "div.break-words",
    "[data-test-id='main-feed-activity-card__commentary']",
    ".break-words span[dir='ltr']"
  ];

  let content = null;
  for (const selector of selectors) {
    try {
      const elem = await driver.findElement(By.css(selector));
      content = await elem.getText();
      if (content && content.trim()) {
        content = content.trim();
        break;
      }
    } catch (e) {
      continue;
    }
  }

  if (content) {
    console.log(`✅ [${index}] Post scraped.`);
    return content;
  } else {
    console.log(`❌ [${index}] Could not extract content.`);
    return null;
  }
}

async function fetchGithubData(username) {
  const baseUrl = `https://api.github.com/users/${username}`;
  const reposUrl = `https://api.github.com/users/${username}/repos`;
  const headers = {
    "Accept": "application/vnd.github.v3+json"
  };

  if (process.env.GITHUB_ACCESS_TOKEN) {
    headers["Authorization"] = `token ${process.env.GITHUB_ACCESS_TOKEN}`;
  }

  try {
    const [userResp, reposResp] = await Promise.all([
      axios.get(baseUrl, { headers }),
      axios.get(reposUrl, { headers })
    ]);

    if (userResp.status !== 200) {
      throw new Error("GitHub user not found");
    }

    const userData = userResp.data;
    const reposData = reposResp.data;

    const reposCleaned = [];
    for (const repo of reposData) {
      const repoInfo = {
        name: repo.name,
        description: repo.description || "",
        language: repo.language || "",
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        html_url: repo.html_url || ""
      };

      // Try to fetch README file
      const readmeUrl = `https://api.github.com/repos/${username}/${repo.name}/readme`;
      try {
        const readmeResp = await axios.get(readmeUrl, { headers });
        if (readmeResp.status === 200) {
          const readmeData = readmeResp.data;
          repoInfo.readme_download_url = readmeData.download_url || "";
          
          // Fetch README content
          if (readmeData.download_url) {
            try {
              const readmeContentResp = await axios.get(readmeData.download_url);
              if (readmeContentResp.status === 200) {
                repoInfo.readme_content = readmeContentResp.data;
              }
            } catch (e) {
              repoInfo.readme_content = "";
            }
          }
        }
      } catch (e) {
        repoInfo.readme_download_url = "Not available";
        repoInfo.readme_content = "";
      }

      reposCleaned.push(repoInfo);
    }

    return {
      profile: {
        name: userData.name || "",
        bio: userData.bio || "",
        location: userData.location || "",
        blog: userData.blog || "",
        followers: userData.followers || 0,
        following: userData.following || 0,
        public_repos: userData.public_repos || 0,
        html_url: userData.html_url || ""
      },
      repositories: reposCleaned
    };
  } catch (error) {
    throw new Error(`Error fetching GitHub data: ${error.message}`);
  }
}

async function extractTextFromPdf(buffer) {
  const pdfParse = (await import('pdf-parse')).default;
  const data = await pdfParse(buffer);
  return data.text;
}

async function extractTextFromDocx(buffer) {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    throw new Error(`Error parsing DOCX: ${error.message}`);
  }
}

async function generateResumeWithLLM(prompt, apiKey) {
  try {
    const url = "https://api.groq.com/openai/v1/chat/completions";
    const headers = {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    };
    
    const data = {
      model: "llama3-70b-8192",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 4000,
      temperature: 0.7
    };
    
    const response = await axios.post(url, data, { headers });
    
    if (response.status !== 200) {
      throw new Error(`Groq API error: ${response.data}`);
    }
    
    return response.data.choices[0].message.content;
  } catch (error) {
    throw new Error(`Error generating resume: ${error.message}`);
  }
}

async function scrapePostsSync(urls) {
  console.log("🔓 Starting LinkedIn post scraping...");
  
  let driver;
  try {
    driver = await setupBrowser();
    await driver.get("https://www.linkedin.com/");
    await driver.sleep(3000);
    
    const allPosts = [];
    for (let idx = 0; idx < urls.length; idx++) {
      const url = urls[idx];
      const cleanUrl = cleanLinkedinUrl(url);
      const content = await scrapeLinkedinPost(driver, cleanUrl, idx + 1);
      if (content) {
        allPosts.push({ url: cleanUrl, content });
      }
    }
    
    return allPosts;
  } catch (error) {
    console.log(`Error in scraping: ${error}`);
    return [];
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
}

function selectRelevantProjects(githubData, jobDescription, maxProjects = 3) {
  if (!githubData || !githubData.repositories) {
    return [];
  }

  // Extract keywords from job description
  const keywords = jobDescription.toLowerCase().match(/\b\w+\b/g) || [];
  const targetKeywords = new Set(keywords.filter(kw => kw.length > 3));

  const scoredProjects = [];

  for (const repo of githubData.repositories) {
    const readme = (repo.readme_content || "").toLowerCase();
    const desc = (repo.description || "").toLowerCase();
    const score = Array.from(targetKeywords).reduce((acc, kw) => {
      return acc + (readme.includes(kw) || desc.includes(kw) ? 1 : 0);
    }, 0);

    if (score > 0) {
      const summary = `Project: ${repo.name}
Tech: ${repo.language || 'N/A'}
GitHub: ${repo.html_url}
Summary: ${repo.description || 'No description'}

README Insights: ${readme.trim().substring(0, 500)}...
`;
      scoredProjects.push({ score, summary });
    }
  }

  // Sort by score descending
  scoredProjects.sort((a, b) => b.score - a.score);
  return scoredProjects.slice(0, maxProjects).map(p => p.summary);
}

// Routes
app.post('/scrape-github', async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ detail: "Username is required" });
    }

    const githubData = await fetchGithubData(username);
    res.json({ success: true, data: githubData });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

app.post('/parse-linkedin-pdf', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ detail: "No file uploaded" });
    }

    let text;
    if (req.file.originalname.endsWith('.pdf')) {
      text = await extractTextFromPdf(req.file.buffer);
    } else if (req.file.originalname.endsWith('.docx')) {
      text = await extractTextFromDocx(req.file.buffer);
    } else {
      return res.status(400).json({ detail: "Unsupported file format. Please upload PDF or DOCX." });
    }

    res.json({ success: true, text });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

app.post('/scrape-linkedin-posts', async (req, res) => {
  try {
    const { urls } = req.body;
    if (!urls || !Array.isArray(urls)) {
      return res.json({ success: true, posts: [] });
    }

    const posts = await scrapePostsSync(urls);
    res.json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

app.post('/parse-resume', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ detail: "No file uploaded" });
    }

    let text;
    if (req.file.originalname.endsWith('.pdf')) {
      text = await extractTextFromPdf(req.file.buffer);
    } else if (req.file.originalname.endsWith('.docx')) {
      text = await extractTextFromDocx(req.file.buffer);
    } else {
      return res.status(400).json({ detail: "Unsupported file format. Please upload PDF or DOCX." });
    }

    res.json({ success: true, text });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

app.post('/generate-resume', async (req, res) => {
  try {
    const {
      github_data,
      linkedin_pdf_text,
      linkedin_posts,
      existing_resume,
      job_description,
      openrouter_api_key
    } = req.body;

    if (!job_description || !openrouter_api_key) {
      return res.status(400).json({ detail: "Job description and OpenRouter API key are required" });
    }

    const sections = [];

    // Prompt context
    sections.push("You are a top-tier resume writing assistant with deep domain expertise in ATS optimization, technical recruiting, and role targeting.\n");
    sections.push("Your task is to craft a highly personalized, job-targeted resume using ONLY the data provided below.\n");
    sections.push("You must analyze and correlate each section to the job description.\n");

    // Job description
    sections.push("------\nJOB DESCRIPTION:\n");
    sections.push(job_description.trim());

    // LinkedIn PDF content
    if (linkedin_pdf_text) {
      sections.push("\n------\nLINKEDIN PROFILE TEXT:\n");
      sections.push(linkedin_pdf_text.trim());
    }

    // LinkedIn posts (achievements)
    if (linkedin_posts && linkedin_posts.length > 0) {
      sections.push("\n------\nLINKEDIN POSTS (Look for achievements or highlights):\n");
      for (const post of linkedin_posts) {
        sections.push(`- ${post.content}`);
      }
    }

    // GitHub projects (select relevant)
    if (github_data) {
      const relevantProjects = selectRelevantProjects(github_data, job_description);
      if (relevantProjects.length > 0) {
        sections.push("\n------\nGITHUB PROJECTS (Most relevant to job):\n");
        sections.push(...relevantProjects);
      }
    }

    // Existing resume (optional)
    if (existing_resume) {
      sections.push("\n------\nEXISTING RESUME TEXT (In case anything useful can be reused):\n");
      sections.push(existing_resume.trim());
    }

    // Final LLM instructions
    sections.push(`
------
Instructions:
1. Tailor the resume 100% to the job description above.
2. Use GitHub data to highlight only the most relevant projects with technical depth.
3. Extract work experience, skills, tools, certifications, and education from LinkedIn.
4. Mine achievements from LinkedIn posts (awards, recognitions, successes).
5. Reuse or enhance parts of the existing resume if helpful.
6. Avoid fabrications. Be factual, achievement-oriented, and concise.
7. Use proper formatting with these sections:
   - Contact Information
   - Professional Summary
   - Skills & Technologies
   - Work Experience
   - Projects
   - Certifications (if any)
   - Education
8. Ensure the resume is ATS-friendly, clean, and highly relevant.
9. Output only the final plain text resume.
`);

    // Combine everything into final prompt
    const prompt = sections.join("\n");

    // Generate resume using LLM
    const resumeText = await generateResumeWithLLM(prompt, openrouter_api_key);

    // Save output
    await fs.ensureDir("output");
    await fs.writeFile("output/generated_resume.txt", resumeText, "utf-8");

    res.json({ success: true, resume: resumeText });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: "healthy" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});