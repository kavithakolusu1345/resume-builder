import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiCheck, FiCpu, FiFileText, FiTarget, FiDownload, FiCheckCircle } from 'react-icons/fi';
import { templates } from '../templates';

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleStart = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <div style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', overflow: 'hidden' }}>
      
      {/* 1. Hero Section */}
      <section className="section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: '100px', paddingBottom: '100px', gap: '24px', position: 'relative' }}>
        {/* Glow Sphere */}
        <div style={{
          position: 'absolute',
          top: '-150px',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(99,102,241,0) 70%)',
          zIndex: 0,
          pointerEvents: 'none'
        }}></div>

        <div className="badge fade-in" style={{ zIndex: 1, textTransform: 'uppercase', letterSpacing: '1px' }}>
          ✨ Powered by Google Gemini AI
        </div>

        <h1 className="fade-in" style={{
          fontSize: '64px',
          fontWeight: 900,
          lineHeight: '1.1',
          maxWidth: '850px',
          letterSpacing: '-1.5px',
          zIndex: 1
        }}>
          Build a Resume <br />
          <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            That Gets Noticed.
          </span>
        </h1>

        <p className="fade-in" style={{
          fontSize: '19px',
          color: 'var(--text-secondary)',
          maxWidth: '650px',
          lineHeight: '1.6',
          zIndex: 1
        }}>
          Create professional, ATS-friendly resumes with AI-powered optimization, beautiful templates, and real-time job matching.
        </p>

        <div className="fade-in" style={{ display: 'flex', gap: '16px', marginTop: '12px', zIndex: 1 }}>
          <button onClick={handleStart} className="btn btn-primary btn-lg">
            Create Resume
          </button>
          <Link to="/login" className="btn btn-secondary btn-lg">
            Analyze Resume
          </Link>
        </div>
      </section>

      {/* 2. Feature Section */}
      <section id="features" className="section" style={{ borderTop: '1px solid var(--border)', paddingBottom: '60px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800 }}>Engineered For Career Growth</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Everything you need to bypass applicant tracking filters and secure interviews.</p>
        </div>

        <div className="grid-3">
          {/* Card 1 */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="btn-icon" style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--accent-primary)', border: 'none' }}>
              <FiCpu size={20} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>AI Resume Writing</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Generate summaries, rewrite job bullet points, and build custom experience details instantly using Gemini.
            </p>
          </div>

          {/* Card 2 */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="btn-icon" style={{ background: 'rgba(34,197,94,0.1)', color: 'var(--success)', border: 'none' }}>
              <FiTarget size={20} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>ATS Optimization Score</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Analyze your resume text against targets, calculate compatibility percentages, and extract matching keywords.
            </p>
          </div>

          {/* Card 3 */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="btn-icon" style={{ background: 'rgba(168,85,247,0.1)', color: '#a855f7', border: 'none' }}>
              <FiFileText size={20} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>6 Professional Templates</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Swap templates at the click of a button. Designed under recruiter guidelines to fit in classic A4 layout.
            </p>
          </div>

          {/* Card 4 */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="btn-icon" style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--accent-primary)', border: 'none' }}>
              <FiFileText size={20} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Live Canvas Preview</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              A print-accurate side panel shows your resume draft re-rendering instantly as you make additions.
            </p>
          </div>

          {/* Card 5 */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="btn-icon" style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--warning)', border: 'none' }}>
              <FiTarget size={20} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Job Description Matcher</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Paste job postings directly. We automatically match critical requirements, skills, and alert you of gaps.
            </p>
          </div>

          {/* Card 6 */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="btn-icon" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--error)', border: 'none' }}>
              <FiDownload size={20} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Dual PDF Export</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Download server-side Puppeteer rendered A4 PDFs, or run high-fidelity client browser printing with one click.
            </p>
          </div>
        </div>
      </section>

      {/* 3. How It Works Section */}
      <section id="how-it-works" className="section" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800 }}>How It Works</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Build, refine, and download a resume tailored for recruiters in minutes.</p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
          {[
            { step: '1', title: 'Fill Information', desc: 'Add personal info, education, history, skills, and custom items.' },
            { step: '2', title: 'Select Template', desc: 'Pick from 6 professional templates aligned with your focus.' },
            { step: '3', title: 'Optimize with AI', desc: 'Trigger AI prompts to expand and professionalize bullet descriptions.' },
            { step: '4', title: 'ATS Compatibility Scan', desc: 'Paste the target job description to audit missing keywords and score.' },
            { step: '5', title: 'Download A4 PDF', desc: 'Download high-quality PDFs matching standard printing dimensions.' },
          ].map((item, idx) => (
            <div key={idx} className="card-glass" style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px', padding: '20px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--accent-gradient)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '15px',
                marginBottom: '8px'
              }}>
                {item.step}
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>{item.title}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Template Preview Carousel/Cards */}
      <section className="section" style={{ borderTop: '1px solid var(--border)' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800 }}>Curated Recruiter Templates</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Swap designs dynamically without losing any progress data.</p>
        </div>

        <div className="grid-3">
          {templates.slice(0, 3).map((tpl) => (
            <div key={tpl.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px' }}>
              <div style={{
                height: '180px',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: 600
              }}>
                {tpl.name} Preview Mock
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>{tpl.name}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', minHeight: '36px' }}>{tpl.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Statistics Section */}
      <section className="section" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', gap: '24px', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '42px', fontWeight: 900, color: 'var(--accent-primary)' }}>6+</div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 600 }}>Professional Templates</div>
          </div>
          <div>
            <div style={{ fontSize: '42px', fontWeight: 900, color: 'var(--success)' }}>100%</div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 600 }}>ATS Optimization</div>
          </div>
          <div>
            <div style={{ fontSize: '42px', fontWeight: 900, color: '#a855f7' }}>Real-time</div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 600 }}>Gemini AI Writing</div>
          </div>
          <div>
            <div style={{ fontSize: '42px', fontWeight: 900, color: 'var(--warning)' }}>A4 & Web</div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 600 }}>Print Ready PDFs</div>
          </div>
        </div>
      </section>

      {/* 6. Footer Section */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '40px 32px', display: 'flex', flexDirection: 'column', gap: '24px', background: 'var(--bg-primary)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '24px' }}>
          <div>
            <span className="navbar-brand">ResumeForge</span>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px', maxWidth: '300px' }}>
              Building career tools that empower job-seekers using state-of-the-art AI parsing technologies.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Product</strong>
              <a href="#features" style={{ color: 'var(--text-secondary)' }}>Features</a>
              <a href="#how-it-works" style={{ color: 'var(--text-secondary)' }}>How it Works</a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Legal</strong>
              <span style={{ color: 'var(--text-secondary)' }}>Privacy Policy</span>
              <span style={{ color: 'var(--text-secondary)' }}>Terms of Service</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Contact</strong>
              <span style={{ color: 'var(--text-secondary)' }}>support@resumeforge.com</span>
              <span style={{ color: 'var(--text-secondary)' }}>GitHub Workspace</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
          <span>© 2026 ResumeForge. All rights reserved.</span>
          <span>B.Tech Project Demonstration Platform</span>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
