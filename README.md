# ResumeForge — AI-Powered Resume Builder & ATS Optimization Platform

A production-quality, modern full-stack web application built with React, Node.js, Express, MongoDB, and Google Gemini AI. Designed as a final-year B.Tech project demonstrating real-world SaaS architecture, security, and AI integration.

---

## 🚀 Features

- **6 Professional Templates** — ATS Classic, Modern Professional, Software Engineer, Minimal, Fresh Graduate, Executive
- **AI Writing Assistant** — Powered by Google Gemini: Generate summaries, improve bullet points, rewrite experience descriptions
- **ATS Compatibility Scoring** — Paste job descriptions and get keyword match scores, gap analysis, and recommendations
- **Live Preview Canvas** — A4-accurate resume preview updates in real-time as you type
- **Drag-and-Drop Section Reordering** — Reorganize resume sections with native HTML5 drag-and-drop
- **PDF Export** — High-quality Puppeteer server-side PDF generation + browser native print fallback
- **Debounced Autosave** — Automatically syncs to MongoDB after 2 seconds of inactivity
- **JWT Authentication** — Secure registration, login, persistent sessions
- **Dark / Light Theme** — Premium design system with CSS custom properties

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Redux Toolkit, React Router v7 |
| Styling | Vanilla CSS with CSS custom properties (dark/light mode) |
| Icons | React Icons (Feather Icons) |
| Backend | Node.js, Express.js, REST APIs |
| Database | MongoDB with Mongoose ODM |
| Authentication | JWT + bcryptjs |
| AI | Google Gemini API (`@google/generative-ai`) |
| PDF | Puppeteer (server-side) + browser print (client-side fallback) |
| Security | Helmet, CORS, express-rate-limit, express-validator |

---

## 📁 Project Structure

```
resume-builder/
├── src/                          # React Frontend
│   ├── components/               # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── ResumeCard.jsx
│   │   └── ThemeToggle.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx       # Session provider
│   ├── features/
│   │   ├── auth/authSlice.js     # Redux auth state
│   │   └── resume/resumeSlice.js # Redux resume state
│   ├── pages/
│   │   ├── Landing.jsx           # Marketing home page
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx         # Resume management hub
│   │   ├── Builder.jsx           # Dual-panel resume editor
│   │   ├── AtsAnalyzer.jsx       # ATS job-match scanner
│   │   ├── Profile.jsx           # Account settings
│   │   └── NotFound.jsx
│   ├── services/
│   │   └── api.js                # Fetch wrapper with JWT headers
│   ├── store/
│   │   └── index.js              # Redux store config
│   ├── templates/                # 6 Resume layout components
│   │   ├── ATSClassicTemplate.jsx
│   │   ├── ModernTemplate.jsx
│   │   ├── SoftwareEngineerTemplate.jsx
│   │   ├── MinimalTemplate.jsx
│   │   ├── FreshGraduateTemplate.jsx
│   │   ├── ExecutiveTemplate.jsx
│   │   └── index.js              # Template registry
│   └── utils/
│       └── pdfExport.js          # Client-side print utilities
│
└── server/                       # Node.js Backend
    ├── config/
    │   └── db.js                 # MongoDB connection
    ├── controllers/
    │   ├── authController.js
    │   ├── resumeController.js
    │   ├── aiController.js
    │   ├── atsController.js
    │   └── pdfController.js
    ├── middleware/
    │   ├── authMiddleware.js     # JWT protect middleware
    │   └── errorHandler.js
    ├── models/
    │   ├── User.js
    │   ├── Resume.js
    │   └── ATSReport.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── resumeRoutes.js
    │   ├── aiRoutes.js
    │   └── atsRoutes.js
    ├── services/
    │   ├── aiService.js          # Gemini API wrappers
    │   └── pdfService.js         # Puppeteer PDF engine
    └── server.js                 # Express entry point
```

---

## ⚙️ Local Development Setup

### Prerequisites

- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- Google Gemini API Key ([Get one here](https://aistudio.google.com/apikey))

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/resume-builder.git
cd resume-builder
```

### 2. Setup environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/resumeforge
JWT_SECRET=your_super_secret_jwt_key_here
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:5173
VITE_API_URL=http://localhost:5000/api
```

### 3. Install frontend dependencies

```bash
npm install
```

### 4. Install backend dependencies

```bash
cd server
npm install
cd ..
```

### 5. Start both servers

**Terminal 1 — Backend:**

```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**

```bash
npm run dev
```

The app will open at **http://localhost:5173**

---

## 🌐 Production Deployment

### Frontend → Vercel

1. Push code to GitHub
2. Import the repository on [Vercel](https://vercel.com)
3. Set environment variable:
   - `VITE_API_URL` = `https://your-backend.onrender.com/api`
4. Deploy

### Backend → Render

1. Create a new **Web Service** on [Render](https://render.com)
2. Connect your GitHub repo
3. Set root directory to `server/`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `GEMINI_API_KEY`
   - `CLIENT_URL` = your Vercel domain

### Database → MongoDB Atlas

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a database user
3. Whitelist `0.0.0.0/0` for network access (or Render's IP)
4. Copy the connection string into `MONGODB_URI`

---

## 🔑 API Reference

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login & get JWT token |
| POST | `/api/auth/logout` | Logout hook |
| GET | `/api/auth/me` | Get current user profile |
| PUT | `/api/auth/profile` | Update profile / password |

### Resumes

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/resumes` | List all user's resumes |
| POST | `/api/resumes` | Create new resume |
| GET | `/api/resumes/:id` | Get resume by ID |
| PUT | `/api/resumes/:id` | Update resume |
| DELETE | `/api/resumes/:id` | Delete resume |
| POST | `/api/resumes/:id/duplicate` | Duplicate a resume |
| POST | `/api/resumes/render-pdf` | Generate Puppeteer PDF |

### AI Assistant

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/ai/summary` | Generate professional summary |
| POST | `/api/ai/improve-bullet` | Improve a bullet point |
| POST | `/api/ai/rewrite-experience` | Rewrite experience section |
| POST | `/api/ai/project-description` | Generate project bullets |

### ATS Analysis

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/ats/analyze` | Run ATS job match scan |
| GET | `/api/ats/:resumeId` | Get latest ATS report |

---

## 🔒 Security Features

- Passwords hashed with **bcryptjs** (salt rounds: 10)
- **JWT** tokens with 30-day expiry
- **Helmet.js** for HTTP security headers
- **CORS** restricted to configured origin
- **Rate limiting** — 200 requests per 15 minutes per IP
- All resume endpoints validate **ownership** before processing
- API keys **never exposed to the frontend**

---

## 📄 License

MIT License — Free to use for academic and personal projects.

---

## 👤 Author

Built as a final-year B.Tech project demonstrating full-stack engineering with React, Node.js, MongoDB, and Google Gemini AI.
