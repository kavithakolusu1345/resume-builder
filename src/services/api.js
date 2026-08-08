const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Helper for Mock Demo Data on GitHub Pages / Static Hosting when backend is not connected
const mockDelay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

const getStoredResumes = () => {
  const data = localStorage.getItem('demo_resumes');
  if (data) return JSON.parse(data);
  const initial = [
    {
      _id: 'demo-resume-1',
      title: 'Full Stack Software Engineer',
      templateId: 'software-engineer',
      updatedAt: new Date().toISOString(),
      personalInfo: {
        fullName: 'Kavitha Kolusu',
        email: 'kavitha@example.com',
        phone: '+91 9876543210',
        location: 'Hyderabad, India',
        github: 'https://github.com/kavithakolusu1345',
        linkedin: 'https://linkedin.com/in/kavithakolusu',
        portfolio: 'https://kavithakolusu1345.github.io/resume-builder/',
      },
      summary:
        'Passionate Full Stack Developer experienced in React, Node.js, Express, and MongoDB. Proven track record in building scalable web applications and AI tools.',
      skills: [
        { category: 'Frontend', items: ['React', 'Vite', 'Redux Toolkit', 'JavaScript', 'HTML5/CSS3'] },
        { category: 'Backend', items: ['Node.js', 'Express.js', 'REST APIs', 'JWT', 'MongoDB'] },
        { category: 'Tools', items: ['Git', 'GitHub', 'Docker', 'Vercel', 'Postman'] },
      ],
      experience: [
        {
          _id: 'exp-1',
          company: 'Tech Solutions Inc.',
          position: 'Full Stack Web Developer Intern',
          location: 'Remote',
          startDate: '2025-06',
          endDate: 'Present',
          current: true,
          description:
            'Architected and deployed responsive React applications.\nImplemented RESTful APIs using Node.js and Express with JWT authentication.\nOptimized database queries in MongoDB improving response times by 35%.',
        },
      ],
      education: [
        {
          _id: 'edu-1',
          institution: 'B.Tech University',
          degree: 'Bachelor of Technology in Computer Science',
          fieldOfStudy: 'Computer Science & Engineering',
          startDate: '2022-08',
          endDate: '2026-05',
          gpa: '8.8 / 10.0',
        },
      ],
      projects: [
        {
          _id: 'proj-1',
          title: 'ResumeForge — AI Resume Builder',
          technologies: 'React, Node.js, Express, MongoDB, Gemini AI',
          link: 'https://kavithakolusu1345.github.io/resume-builder/',
          description:
            'Built a commercial-grade AI-powered resume builder with real-time A4 preview and ATS scanning.\nIntegrated Google Gemini AI for smart resume bullet optimization.',
        },
      ],
      style: {
        fontFamily: 'Inter',
        fontSize: 'medium',
        spacing: 'compact',
        accentColor: '#3b82f6',
        marginSize: 'normal',
      },
      sectionOrder: ['personalInfo', 'summary', 'skills', 'experience', 'projects', 'education'],
    },
  ];
  localStorage.setItem('demo_resumes', JSON.stringify(initial));
  return initial;
};

// Mock fallback logic when backend is offline (e.g. GitHub Pages static demo)
const handleMockFallback = async (method, endpoint, body) => {
  await mockDelay(300);

  // Auth endpoints
  if (endpoint === '/auth/login' || endpoint === '/auth/register') {
    const user = {
      _id: 'demo-user-id',
      name: body?.name || 'Kavitha Kolusu',
      email: body?.email || 'kavitha@example.com',
      role: 'Full Stack Developer',
    };
    const token = 'demo-jwt-token-resumeforge';
    localStorage.setItem('token', token);
    localStorage.setItem('demo_user', JSON.stringify(user));
    return { token, user };
  }

  if (endpoint === '/auth/me') {
    const userStr = localStorage.getItem('demo_user');
    return userStr
      ? JSON.parse(userStr)
      : {
          _id: 'demo-user-id',
          name: 'Kavitha Kolusu',
          email: 'kavitha@example.com',
          role: 'Full Stack Developer',
        };
  }

  // Resume GET list
  if (endpoint === '/resumes' && method === 'GET') {
    return getStoredResumes();
  }

  // Resume POST create
  if (endpoint === '/resumes' && method === 'POST') {
    const list = getStoredResumes();
    const newResume = {
      _id: `demo-resume-${Date.now()}`,
      title: body?.title || 'Untitled Resume',
      templateId: body?.templateId || 'ats-classic',
      updatedAt: new Date().toISOString(),
      personalInfo: { fullName: 'Kavitha Kolusu', email: 'kavitha@example.com', phone: '', location: '' },
      summary: '',
      skills: [],
      experience: [],
      education: [],
      projects: [],
      style: { fontFamily: 'Inter', fontSize: 'medium', spacing: 'compact', accentColor: '#3b82f6', marginSize: 'normal' },
      sectionOrder: ['personalInfo', 'summary', 'skills', 'experience', 'projects', 'education'],
    };
    list.unshift(newResume);
    localStorage.setItem('demo_resumes', JSON.stringify(list));
    return newResume;
  }

  // Resume GET single
  if (endpoint.startsWith('/resumes/') && method === 'GET') {
    const id = endpoint.split('/')[2];
    const list = getStoredResumes();
    const found = list.find((r) => r._id === id);
    return found || list[0];
  }

  // Resume PUT update
  if (endpoint.startsWith('/resumes/') && method === 'PUT') {
    const id = endpoint.split('/')[2];
    const list = getStoredResumes();
    const index = list.findIndex((r) => r._id === id);
    const updated = { ...body, updatedAt: new Date().toISOString() };
    if (index !== -1) {
      list[index] = updated;
    } else {
      list.push(updated);
    }
    localStorage.setItem('demo_resumes', JSON.stringify(list));
    return updated;
  }

  // Resume DELETE
  if (endpoint.startsWith('/resumes/') && method === 'DELETE') {
    const id = endpoint.split('/')[2];
    let list = getStoredResumes();
    list = list.filter((r) => r._id !== id);
    localStorage.setItem('demo_resumes', JSON.stringify(list));
    return { message: 'Resume deleted successfully' };
  }

  // AI Endpoints
  if (endpoint === '/ai/summary') {
    return {
      summary: `Results-driven ${
        body?.jobTitle || 'Software Engineer'
      } with expertise in modern web technologies including React, Node.js, and MongoDB. Proven track record in architecting high-performance web applications and delivering user-centric solutions.`,
    };
  }

  if (endpoint === '/ai/improve-bullet') {
    return {
      improvedText:
        'Engineered high-performance React components and RESTful microservices, increasing application throughput by 40% and enhancing overall user engagement.',
    };
  }

  // ATS Endpoint
  if (endpoint === '/ats/analyze') {
    return {
      score: 85,
      summary: 'Strong match for software engineering roles. Resume contains key technical keywords and well-formatted sections.',
      matchingKeywords: ['React', 'Node.js', 'JavaScript', 'REST API', 'Git', 'MongoDB', 'Express'],
      missingKeywords: ['Docker', 'AWS', 'GraphQL', 'CI/CD'],
      recommendations: [
        'Add quantifiable metrics to your experience bullets (e.g., "improved speed by 25%").',
        'Include Cloud Platforms (AWS/Azure) if applying for Senior roles.',
        'Ensure skills section highlights core frameworks at the top.',
      ],
    };
  }

  return { success: true };
};

const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');

  if (!response.ok) {
    let errorMessage = 'Something went wrong';
    try {
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } else {
        errorMessage = (await response.text()) || errorMessage;
      }
    } catch (e) {
      console.error('Error parsing error response', e);
    }
    throw new Error(errorMessage);
  }

  if (contentType && contentType.includes('application/pdf')) {
    return response.blob();
  }

  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
};

export const api = {
  get: async (endpoint) => {
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return await handleResponse(res);
    } catch (err) {
      console.warn(`[API] Fetch failed for GET ${endpoint}. Using interactive demo mode.`, err);
      return handleMockFallback('GET', endpoint);
    }
  },

  post: async (endpoint, body) => {
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(body),
      });
      return await handleResponse(res);
    } catch (err) {
      console.warn(`[API] Fetch failed for POST ${endpoint}. Using interactive demo mode.`, err);
      return handleMockFallback('POST', endpoint, body);
    }
  },

  put: async (endpoint, body) => {
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(body),
      });
      return await handleResponse(res);
    } catch (err) {
      console.warn(`[API] Fetch failed for PUT ${endpoint}. Using interactive demo mode.`, err);
      return handleMockFallback('PUT', endpoint, body);
    }
  },

  delete: async (endpoint) => {
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return await handleResponse(res);
    } catch (err) {
      console.warn(`[API] Fetch failed for DELETE ${endpoint}. Using interactive demo mode.`, err);
      return handleMockFallback('DELETE', endpoint);
    }
  },
};
