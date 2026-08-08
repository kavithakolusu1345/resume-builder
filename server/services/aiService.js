import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client
const getModel = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not defined in environment variables. Running in mock AI mode.');
    return null;
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  // Default to gemini-1.5-flash or gemini-2.5-flash. Both are highly responsive.
  return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
};

// Helper to handle text generation or mock fallback
const generateText = async (prompt) => {
  const model = getModel();
  if (!model) {
    // Return mock response when API key is missing to ensure platform doesn't crash
    return getMockResponse(prompt);
  }
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Gemini API Error:', error);
    // Return a mock response with a note or fallback
    return getMockResponse(prompt) + '\n(Note: Generated via fallback mock due to API error)';
  }
};

// Fallback responses when API key is not configured
const getMockResponse = (prompt) => {
  const query = prompt.toLowerCase();
  if (query.includes('summary')) {
    return 'Dynamic, results-driven professional with expertise in building scalable, modern web applications. Proficient in full-stack technologies including React, Node.js, Express, and MongoDB, with a strong focus on clean architecture, performance optimization, and delivering seamless user experiences.';
  }
  if (query.includes('bullet') || query.includes('improve')) {
    return 'Architected and deployed a highly responsive grocery e-commerce platform using React and Node.js, increasing user engagement by 35% and streamlining checkout performance.';
  }
  if (query.includes('project')) {
    return 'Designed and developed a robust full-stack project utilizing modern technologies. Engineered secure REST APIs, implemented JWT-based user authentication, and optimized database queries, reducing data retrieval latency by 20%.';
  }
  return 'AI feature executed in preview mode. Set your GEMINI_API_KEY environment variable to activate active AI responses.';
};

export const generateSummary = async (skills, experience, targetRole) => {
  const prompt = `
    You are an expert resume writer. Generate a professional, compelling, and tailored 2-4 sentence summary for a resume.
    
    Target Role: ${targetRole || 'Software Engineer'}
    Skills: ${skills || 'React, Javascript, Node.js'}
    Brief Experience Profile: ${experience || 'Entry level, built multiple web apps'}
    
    Guidelines:
    - Keep it professional, achievement-oriented, and concise (under 80 words).
    - Do not invent fake names, companies, or specific metrics that are not provided.
    - Write in the third person or using active resume verbs.
  `;
  return generateText(prompt);
};

export const improveBulletPoint = async (bulletText, targetRole) => {
  const prompt = `
    You are an expert resume writer. Improve the following resume bullet point to make it more professional, action-oriented, and achievement-focused.
    
    Original Bullet Point: "${bulletText}"
    Target Role / Focus: ${targetRole || 'Software Engineer'}
    
    Guidelines:
    - Start with a strong action verb (e.g., Developed, Engineered, Optimized, Spearheaded).
    - Use the Google X-Y-Z formula: "Accomplished [X] as measured by [Y], by doing [Z]" where possible, or focus heavily on impact and technologies.
    - Do not fabricate metrics, numbers, or specific company names. Make it read professionally.
    - Keep it under 2 sentences. Return only the improved bullet point text.
  `;
  return generateText(prompt);
};

export const rewriteExperience = async (experienceText, style) => {
  const prompt = `
    You are an expert resume writer. Rewrite the following professional experience descriptions to make them more suited for a resume.
    
    Original Text: "${experienceText}"
    Desired Style: ${style || 'Professional'} (e.g., Professional, Concise, Achievement-focused)
    
    Guidelines:
    - Organize it into bullet points if appropriate.
    - Focus on active language, clear contributions, and tech stacks.
    - Return only the rewritten text.
  `;
  return generateText(prompt);
};

export const generateProjectDescription = async (projectName, techStack, features) => {
  const prompt = `
    You are an expert resume writer. Generate a professional resume description for a personal or academic project.
    
    Project Name: ${projectName}
    Tech Stack: ${techStack || 'React, Express, MongoDB'}
    Key Features: ${features || 'authentication, file uploads, real-time sync'}
    
    Guidelines:
    - Generate 3 bullet points.
    - Highlight the implementation details using the tech stack and the impact/outcomes.
    - Start each bullet point with a strong action verb.
    - Do not make up fake metrics or links. Focus on technical contributions.
  `;
  return generateText(prompt);
};

export const analyzeJobMatch = async (resumeContentText, jobDescriptionText) => {
  const prompt = `
    You are an expert ATS (Applicant Tracking System) scanner and career coach.
    Analyze the match between the following resume content and the job description.
    
    Resume:
    """
    ${resumeContentText}
    """
    
    Job Description:
    """
    ${jobDescriptionText}
    """
    
    You must return a raw JSON object with the following structure, containing no formatting other than valid JSON. Do not include markdown code block characters (\`\`\`json ... \`\`\`).
    
    {
      "score": 85, // Overall matching score from 0 to 100
      "breakdown": {
        "keywords": 80, // Score out of 100
        "skills": 90, // Score out of 100
        "experience": 85, // Score out of 100
        "formatting": 90, // Score out of 100
        "structure": 88 // Score out of 100
      },
      "matchedKeywords": ["React", "Node.js", "Javascript"], // Keywords present in both
      "missingKeywords": ["Docker", "AWS", "CI/CD"], // Important keywords/skills from JD missing from Resume
      "recommendations": [
        "Include Docker in technical skills if you have experience with containerization.",
        "Elaborate on AWS deployment experience in your project descriptions.",
        "Add measurable results to your experience bullet points where possible."
      ]
    }
  `;

  const responseText = await generateText(prompt);
  try {
    // Strip markdown code block wrappers if Gemini outputs them despite instructions
    const cleanText = responseText.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error('Failed to parse Gemini ATS output. Falling back to structured default.', error);
    // Basic fallback parsing logic or a default report structure
    return {
      score: 65,
      breakdown: { keywords: 60, skills: 70, experience: 65, formatting: 80, structure: 80 },
      matchedKeywords: ['React', 'JavaScript', 'HTML5', 'CSS3'],
      missingKeywords: ['Node.js', 'MongoDB', 'REST APIs', 'JWT'],
      recommendations: [
        'Could not complete deep AI analysis. Ensure your resume has details like education, skills, and experience.',
        'Add backend keywords like Node.js, Express, and MongoDB if you possess those skills.',
        'Detail your experience with authentication (JWT) and API integrations.'
      ]
    };
  }
};
