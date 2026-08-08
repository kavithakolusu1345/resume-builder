import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchResumeById,
  updateResume,
  updateLocalResume,
  updateLocalList,
  updateSectionOrder,
  updateCustomization,
  setSavingStatus,
} from '../features/resume/resumeSlice';
import { templates, getTemplateById } from '../templates';
import { api } from '../services/api';
import {
  FiSave, FiEye, FiDownload, FiCpu, FiPlus, FiTrash2,
  FiChevronDown, FiChevronUp, FiArrowUp, FiArrowDown,
  FiMaximize, FiCompass, FiSettings, FiCheck, FiInfo, FiTrash
} from 'react-icons/fi';

const Builder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  const { currentResume, saveStatus, loading, error } = useSelector((state) => state.resume);

  // Tab management
  const [activeTab, setActiveTab] = useState('content'); // 'content' | 'style' | 'reorder'
  const [openAccordion, setOpenAccordion] = useState('personal'); // accordion key

  // AI Assist Local States
  const [aiLoading, setAiLoading] = useState(false);
  const [aiTargetRole, setAiTargetRole] = useState('');
  const [aiPromptModal, setAiPromptModal] = useState(null); // 'summary' | 'bullet' | 'project'
  const [bulletTextToImprove, setBulletTextToImprove] = useState('');
  const [bulletRefPath, setBulletRefPath] = useState(null); // { index, field }

  const printAreaRef = useRef(null);

  // Load Resume
  useEffect(() => {
    if (id) {
      dispatch(fetchResumeById(id));
    }
  }, [id, dispatch]);

  // Debounced Autosave
  useEffect(() => {
    if (saveStatus === 'dirty' && currentResume) {
      dispatch(setSavingStatus('saving'));
      const timer = setTimeout(async () => {
        try {
          await dispatch(updateResume({ id: currentResume._id, resumeData: currentResume }));
        } catch (e) {
          console.error('Autosave failed:', e);
        }
      }, 2000); // 2 seconds of inactivity
      return () => clearTimeout(timer);
    }
  }, [currentResume, saveStatus, dispatch]);

  // Check query param for immediate download
  useEffect(() => {
    if (searchParams.get('download') === 'true' && currentResume && !loading) {
      setTimeout(() => {
        handleDownloadPDF();
      }, 1000);
    }
  }, [searchParams, currentResume, loading]);

  if (loading && !currentResume) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', color: 'var(--text-primary)' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 16px', width: '36px', height: '36px' }}></div>
          <p style={{ fontWeight: 600 }}>Loading resume workspace...</p>
        </div>
      </div>
    );
  }

  if (error || !currentResume) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', color: 'var(--text-primary)' }}>
        <div style={{ textAlign: 'center' }}>
          <FiInfo size={40} style={{ color: 'var(--error)', marginBottom: '16px' }} />
          <p style={{ fontWeight: 600 }}>{error || 'Resume not found'}</p>
          <button onClick={() => navigate('/dashboard')} className="btn btn-secondary btn-sm" style={{ marginTop: '16px' }}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const {
    title,
    template,
    customization = {},
    sectionOrder = [],
    personalInfo = {},
    summary = '',
    education = [],
    experience = [],
    projects = [],
    skills = [],
    certifications = [],
    achievements = [],
    languages = [],
    customSections = [],
  } = currentResume;

  // Input Change Handlers
  const handlePersonalInfoChange = (field, val) => {
    dispatch(updateLocalResume({ field, value: val, path: 'personalInfo' }));
  };

  const handleTopLevelChange = (field, val) => {
    dispatch(updateLocalResume({ field, value: val }));
  };

  const handleStyleChange = (key, value) => {
    dispatch(updateCustomization({ [key]: value }));
  };

  // Repeating Lists: experience, projects, skills, etc.
  const handleListAction = (section, index, value, actionType) => {
    dispatch(updateLocalList({ section, index, value, actionType }));
  };

  // Drag and Drop (Section reordering helper)
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('draggedIndex', index);
  };

  const handleDrop = (e, targetIndex) => {
    const sourceIndex = e.dataTransfer.getData('draggedIndex');
    if (sourceIndex === '') return;
    const newOrder = [...sectionOrder];
    const [removed] = newOrder.splice(sourceIndex, 1);
    newOrder.splice(targetIndex, 0, removed);
    dispatch(updateSectionOrder(newOrder));
  };

  // PDF Download service (Streams from Puppeteer Backend)
  const handleDownloadPDF = async () => {
    if (!printAreaRef.current) return;
    
    // Inject full styles so Puppeteer has styling
    const cssRules = Array.from(document.styleSheets)
      .map(sheet => {
        try {
          return Array.from(sheet.cssRules).map(rule => rule.cssText).join('\n');
        } catch (e) {
          return '';
        }
      })
      .join('\n');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${cssRules}</style>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Source+Sans+3:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        </head>
        <body style="background: white; margin: 0; padding: 0;">
          <div id="print-area">
            ${printAreaRef.current.innerHTML}
          </div>
        </body>
      </html>
    `;

    try {
      dispatch(setSavingStatus('saving'));
      const blob = await api.post('/resumes/render-pdf', { html: htmlContent });
      
      // Create local file URL and trigger browser download dialog
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${title.replace(/\s+/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      dispatch(setSavingStatus('saved'));
    } catch (err) {
      console.error(err);
      alert('Puppeteer export failed. Falling back to native browser printing.');
      window.print();
    }
  };

  const handleNativePrint = () => {
    window.print();
  };

  // AI Prompt Callers
  const triggerAiSummary = async () => {
    setAiLoading(true);
    try {
      const skillsStr = skills.map(s => `${s.category}: ${s.items.join(', ')}`).join(' | ');
      const expStr = experience.map(e => `${e.jobTitle} at ${e.company}`).join(', ');
      
      const res = await api.post('/ai/summary', {
        skills: skillsStr,
        experience: expStr,
        targetRole: aiTargetRole || personalInfo.professionalTitle
      });

      dispatch(updateLocalResume({ field: 'summary', value: res.summary }));
      setAiPromptModal(null);
    } catch (err) {
      alert(err.message || 'AI generation failed');
    } finally {
      setAiLoading(false);
    }
  };

  const triggerAiImproveBullet = async () => {
    if (!bulletTextToImprove.trim()) return;
    setAiLoading(true);
    try {
      const res = await api.post('/ai/improve-bullet', {
        bulletText: bulletTextToImprove,
        targetRole: personalInfo.professionalTitle
      });

      const { section, index, field } = bulletRefPath;
      if (section === 'experience') {
        const currentItem = { ...experience[index] };
        currentItem[field] = res.improved;
        handleListAction(section, index, currentItem, 'edit');
      }
      setAiPromptModal(null);
      setBulletTextToImprove('');
    } catch (err) {
      alert(err.message || 'AI improvement failed');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 64px)',
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        overflow: 'hidden',
      }}
    >
      {/* 1. Header Toolbar (Save indicators, Export settings, Scan redirects) */}
      <div
        style={{
          height: '60px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 24px',
          background: 'var(--bg-secondary)',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <input
            type="text"
            className="form-input"
            value={title}
            onChange={(e) => handleTopLevelChange('title', e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              fontWeight: 800,
              fontSize: '18px',
              color: 'var(--text-primary)',
              padding: '4px 8px',
              width: '260px',
            }}
          />
          
          {/* Save Status Indicators */}
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {saveStatus === 'saving' && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <div className="spinner" style={{ width: '12px', height: '12px', borderWidth: '2px' }} />
                Saving to cloud...
              </span>
            )}
            {saveStatus === 'saved' && (
              <span style={{ color: 'var(--success)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <FiCheck size={12} />
                Autosaved
              </span>
            )}
            {saveStatus === 'dirty' && <span style={{ fontStyle: 'italic' }}>Pending typing sync...</span>}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => navigate(`/ats/${id}`)} className="btn btn-secondary btn-sm">
            <FiCompass size={14} />
            <span>ATS Matching Audit</span>
          </button>
          
          <button onClick={handleNativePrint} className="btn btn-secondary btn-sm">
            <FiEye size={14} />
            <span>System Print Layout</span>
          </button>

          <button onClick={handleDownloadPDF} className="btn btn-primary btn-sm">
            <FiDownload size={14} />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* 2. Workspace Content: Left Editor, Right Preview */}
      <div style={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        
        {/* Left Panel: Accordions / Content Forms / Style Settings */}
        <div
          style={{
            width: '45%',
            borderRight: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Navigation Tab Bar */}
          <div
            className="tabs"
            style={{
              margin: '12px 24px',
              flexShrink: 0,
            }}
          >
            <button
              onClick={() => setActiveTab('content')}
              className={`tab ${activeTab === 'content' ? 'active' : ''}`}
            >
              Content Edit
            </button>
            <button
              onClick={() => setActiveTab('style')}
              className={`tab ${activeTab === 'style' ? 'active' : ''}`}
            >
              Layout Styles
            </button>
            <button
              onClick={() => setActiveTab('reorder')}
              className={`tab ${activeTab === 'reorder' ? 'active' : ''}`}
            >
              Section Order
            </button>
          </div>

          {/* Scrollable Editor Forms */}
          <div style={{ flexGrow: 1, overflowY: 'auto', padding: '0 24px 40px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {activeTab === 'content' && (
              <>
                {/* 2.1 Personal Information */}
                <div className="card" style={{ padding: '16px' }}>
                  <div
                    onClick={() => setOpenAccordion(openAccordion === 'personal' ? null : 'personal')}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                  >
                    <h3 style={{ fontSize: '15px', fontWeight: 800 }}>Personal Information</h3>
                    {openAccordion === 'personal' ? <FiChevronUp /> : <FiChevronDown />}
                  </div>

                  {openAccordion === 'personal' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                      <div className="form-group">
                        <label className="form-label" htmlFor="fullName">Full Name</label>
                        <input
                          id="fullName"
                          type="text"
                          className="form-input"
                          value={personalInfo.fullName || ''}
                          onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="professionalTitle">Professional Title</label>
                        <input
                          id="professionalTitle"
                          type="text"
                          className="form-input"
                          value={personalInfo.professionalTitle || ''}
                          onChange={(e) => handlePersonalInfoChange('professionalTitle', e.target.value)}
                        />
                      </div>
                      <div className="grid-2">
                        <div className="form-group">
                          <label className="form-label" htmlFor="email">Email</label>
                          <input
                            id="email"
                            type="email"
                            className="form-input"
                            value={personalInfo.email || ''}
                            onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="phone">Phone</label>
                          <input
                            id="phone"
                            type="text"
                            className="form-input"
                            value={personalInfo.phone || ''}
                            onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="grid-2">
                        <div className="form-group">
                          <label className="form-label" htmlFor="location">Location</label>
                          <input
                            id="location"
                            type="text"
                            className="form-input"
                            value={personalInfo.location || ''}
                            onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="linkedin">LinkedIn URL</label>
                          <input
                            id="linkedin"
                            type="url"
                            className="form-input"
                            value={personalInfo.linkedin || ''}
                            onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="grid-2">
                        <div className="form-group">
                          <label className="form-label" htmlFor="github">GitHub URL</label>
                          <input
                            id="github"
                            type="url"
                            className="form-input"
                            value={personalInfo.github || ''}
                            onChange={(e) => handlePersonalInfoChange('github', e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="portfolio">Portfolio website</label>
                          <input
                            id="portfolio"
                            type="url"
                            className="form-input"
                            value={personalInfo.portfolio || ''}
                            onChange={(e) => handlePersonalInfoChange('portfolio', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2.2 Professional Summary */}
                <div className="card" style={{ padding: '16px' }}>
                  <div
                    onClick={() => setOpenAccordion(openAccordion === 'summary' ? null : 'summary')}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                  >
                    <h3 style={{ fontSize: '15px', fontWeight: 800 }}>Professional Summary</h3>
                    {openAccordion === 'summary' ? <FiChevronUp /> : <FiChevronDown />}
                  </div>

                  {openAccordion === 'summary' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          onClick={() => setAiPromptModal('summary')}
                          className="btn btn-secondary btn-sm"
                          style={{ color: 'var(--accent-primary)', borderColor: 'rgba(99,102,241,0.3)' }}
                        >
                          <FiCpu />
                          <span>Generate Summary</span>
                        </button>
                      </div>
                      <textarea
                        id="summary-editor"
                        className="form-textarea"
                        value={summary}
                        onChange={(e) => handleTopLevelChange('summary', e.target.value)}
                        placeholder="Write a concise overview of your background, experience, and value statement..."
                      />
                    </div>
                  )}
                </div>

                {/* 2.3 Technical Skills */}
                <div className="card" style={{ padding: '16px' }}>
                  <div
                    onClick={() => setOpenAccordion(openAccordion === 'skills' ? null : 'skills')}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                  >
                    <h3 style={{ fontSize: '15px', fontWeight: 800 }}>Technical Skills</h3>
                    {openAccordion === 'skills' ? <FiChevronUp /> : <FiChevronDown />}
                  </div>

                  {openAccordion === 'skills' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                      {skills.map((category, idx) => (
                        <div key={idx} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
                            <input
                              type="text"
                              className="form-input"
                              value={category.category}
                              onChange={(e) => {
                                const currentList = [...skills];
                                currentList[idx] = { ...currentList[idx], category: e.target.value };
                                handleListAction('skills', idx, currentList, 'reorder');
                              }}
                              style={{ width: '60%' }}
                            />
                            <button
                              type="button"
                              onClick={() => handleListAction('skills', idx, null, 'delete')}
                              className="btn-icon"
                              style={{ color: 'var(--error)' }}
                            >
                              <FiTrash size={14} />
                            </button>
                          </div>
                          
                          <input
                            type="text"
                            className="form-input"
                            placeholder="Comma-separated items: React, Redux, Node.js"
                            value={category.items.join(', ')}
                            onChange={(e) => {
                              const list = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                              const currentList = [...skills];
                              currentList[idx] = { ...currentList[idx], items: list };
                              handleListAction('skills', idx, currentList, 'reorder');
                            }}
                            style={{ width: '100%', boxSizing: 'border-box' }}
                          />
                        </div>
                      ))}
                      
                      <button
                        type="button"
                        onClick={() => handleListAction('skills', null, { category: 'New Category', items: [] }, 'add')}
                        className="btn btn-secondary"
                        style={{ width: '100%' }}
                      >
                        <FiPlus />
                        <span>Add Skill Category</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* 2.4 Work Experience */}
                <div className="card" style={{ padding: '16px' }}>
                  <div
                    onClick={() => setOpenAccordion(openAccordion === 'experience' ? null : 'experience')}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                  >
                    <h3 style={{ fontSize: '15px', fontWeight: 800 }}>Work Experience</h3>
                    {openAccordion === 'experience' ? <FiChevronUp /> : <FiChevronDown />}
                  </div>

                  {openAccordion === 'experience' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                      {experience.map((exp, idx) => (
                        <div key={idx} style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <strong style={{ fontSize: '13px' }}>Block #{idx + 1}</strong>
                            <button
                              type="button"
                              onClick={() => handleListAction('experience', idx, null, 'delete')}
                              className="btn btn-secondary btn-sm"
                              style={{ color: 'var(--error)' }}
                            >
                              <FiTrash2 size={13} />
                            </button>
                          </div>
                          
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div className="grid-2">
                              <input
                                type="text"
                                className="form-input"
                                placeholder="Company: e.g. Acme Corp"
                                value={exp.company}
                                onChange={(e) => handleListAction('experience', idx, { ...exp, company: e.target.value }, 'edit')}
                              />
                              <input
                                type="text"
                                className="form-input"
                                placeholder="Job Title: e.g. Frontend Engineer"
                                value={exp.jobTitle}
                                onChange={(e) => handleListAction('experience', idx, { ...exp, jobTitle: e.target.value }, 'edit')}
                              />
                            </div>
                            <div className="grid-2">
                              <input
                                type="text"
                                className="form-input"
                                placeholder="Start Date: e.g. Jun 2023"
                                value={exp.startDate}
                                onChange={(e) => handleListAction('experience', idx, { ...exp, startDate: e.target.value }, 'edit')}
                              />
                              <input
                                type="text"
                                className="form-input"
                                placeholder="End Date: e.g. Present"
                                value={exp.endDate}
                                disabled={exp.current}
                                onChange={(e) => handleListAction('experience', idx, { ...exp, endDate: e.target.value }, 'edit')}
                              />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <input
                                type="checkbox"
                                id={`exp-curr-${idx}`}
                                checked={exp.current}
                                onChange={(e) => handleListAction('experience', idx, { ...exp, current: e.target.checked, endDate: e.target.checked ? 'Present' : '' }, 'edit')}
                              />
                              <label htmlFor={`exp-curr-${idx}`} style={{ fontSize: '12px' }}>Current Job</label>
                            </div>
                            
                            {/* Responsibilities with AI improve */}
                            <div className="form-group">
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                <label className="form-label">Responsibilities & Bullet Points</label>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setBulletRefPath({ section: 'experience', index: idx, field: 'responsibilities' });
                                    setBulletTextToImprove(exp.responsibilities || '');
                                    setAiPromptModal('bullet');
                                  }}
                                  className="btn btn-secondary btn-sm"
                                  style={{ padding: '4px 8px', fontSize: '11px', color: 'var(--accent-primary)' }}
                                >
                                  <FiCpu />
                                  <span>AI Optimize Bullet</span>
                                </button>
                              </div>
                              <textarea
                                className="form-textarea"
                                placeholder="Add responsibilities, one per line..."
                                value={exp.responsibilities}
                                onChange={(e) => handleListAction('experience', idx, { ...exp, responsibilities: e.target.value }, 'edit')}
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => handleListAction('experience', null, { company: '', jobTitle: '', location: '', startDate: '', endDate: '', current: false, responsibilities: '', achievements: '' }, 'add')}
                        className="btn btn-secondary"
                        style={{ width: '100%' }}
                      >
                        <FiPlus />
                        <span>Add Work Experience</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* 2.5 Projects */}
                <div className="card" style={{ padding: '16px' }}>
                  <div
                    onClick={() => setOpenAccordion(openAccordion === 'projects' ? null : 'projects')}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                  >
                    <h3 style={{ fontSize: '15px', fontWeight: 800 }}>Projects</h3>
                    {openAccordion === 'projects' ? <FiChevronUp /> : <FiChevronDown />}
                  </div>

                  {openAccordion === 'projects' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                      {projects.map((proj, idx) => (
                        <div key={idx} style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <strong style={{ fontSize: '13px' }}>Project #{idx + 1}</strong>
                            <button
                              type="button"
                              onClick={() => handleListAction('projects', idx, null, 'delete')}
                              className="btn btn-secondary btn-sm"
                              style={{ color: 'var(--error)' }}
                            >
                              <FiTrash2 size={13} />
                            </button>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <input
                              type="text"
                              className="form-input"
                              placeholder="Project Name: e.g. ResumeBuilder Platform"
                              value={proj.projectName}
                              onChange={(e) => handleListAction('projects', idx, { ...proj, projectName: e.target.value }, 'edit')}
                            />
                            <div className="grid-2">
                              <input
                                type="text"
                                className="form-input"
                                placeholder="Tech Stack: React, Express"
                                value={proj.technologies}
                                onChange={(e) => handleListAction('projects', idx, { ...proj, technologies: e.target.value }, 'edit')}
                              />
                              <input
                                type="url"
                                className="form-input"
                                placeholder="GitHub URL"
                                value={proj.github}
                                onChange={(e) => handleListAction('projects', idx, { ...proj, github: e.target.value }, 'edit')}
                              />
                            </div>
                            <textarea
                              className="form-textarea"
                              placeholder="Describe the implementation features, details, and metrics..."
                              value={proj.description}
                              onChange={(e) => handleListAction('projects', idx, { ...proj, description: e.target.value }, 'edit')}
                            />
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => handleListAction('projects', null, { projectName: '', description: '', technologies: '', github: '', liveDemo: '' }, 'add')}
                        className="btn btn-secondary"
                        style={{ width: '100%' }}
                      >
                        <FiPlus />
                        <span>Add Project</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* 2.6 Education */}
                <div className="card" style={{ padding: '16px' }}>
                  <div
                    onClick={() => setOpenAccordion(openAccordion === 'education' ? null : 'education')}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                  >
                    <h3 style={{ fontSize: '15px', fontWeight: 800 }}>Education</h3>
                    {openAccordion === 'education' ? <FiChevronUp /> : <FiChevronDown />}
                  </div>

                  {openAccordion === 'education' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                      {education.map((edu, idx) => (
                        <div key={idx} style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <strong style={{ fontSize: '13px' }}>School #{idx + 1}</strong>
                            <button
                              type="button"
                              onClick={() => handleListAction('education', idx, null, 'delete')}
                              className="btn btn-secondary btn-sm"
                              style={{ color: 'var(--error)' }}
                            >
                              <FiTrash2 size={13} />
                            </button>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <input
                              type="text"
                              className="form-input"
                              placeholder="Institution Name: e.g. Stanford University"
                              value={edu.institution}
                              onChange={(e) => handleListAction('education', idx, { ...edu, institution: e.target.value }, 'edit')}
                            />
                            <div className="grid-2">
                              <input
                                type="text"
                                className="form-input"
                                placeholder="Degree: B.Tech, M.S."
                                value={edu.degree}
                                onChange={(e) => handleListAction('education', idx, { ...edu, degree: e.target.value }, 'edit')}
                              />
                              <input
                                type="text"
                                className="form-input"
                                placeholder="Field of Study: Computer Science"
                                value={edu.fieldOfStudy}
                                onChange={(e) => handleListAction('education', idx, { ...edu, fieldOfStudy: e.target.value }, 'edit')}
                              />
                            </div>
                            <div className="grid-3">
                              <input
                                type="text"
                                className="form-input"
                                placeholder="Start Date"
                                value={edu.startDate}
                                onChange={(e) => handleListAction('education', idx, { ...edu, startDate: e.target.value }, 'edit')}
                              />
                              <input
                                type="text"
                                className="form-input"
                                placeholder="End Date"
                                value={edu.endDate}
                                onChange={(e) => handleListAction('education', idx, { ...edu, endDate: e.target.value }, 'edit')}
                              />
                              <input
                                type="text"
                                className="form-input"
                                placeholder="GPA / Grade"
                                value={edu.gpa}
                                onChange={(e) => handleListAction('education', idx, { ...edu, gpa: e.target.value }, 'edit')}
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => handleListAction('education', null, { institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', gpa: '', description: '' }, 'add')}
                        className="btn btn-secondary"
                        style={{ width: '100%' }}
                      >
                        <FiPlus />
                        <span>Add Education Block</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* 2.7 Certifications */}
                <div className="card" style={{ padding: '16px' }}>
                  <div
                    onClick={() => setOpenAccordion(openAccordion === 'certifications' ? null : 'certifications')}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                  >
                    <h3 style={{ fontSize: '15px', fontWeight: 800 }}>Certifications</h3>
                    {openAccordion === 'certifications' ? <FiChevronUp /> : <FiChevronDown />}
                  </div>

                  {openAccordion === 'certifications' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                      {certifications.map((cert, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="AWS Developer, CCNA"
                            value={cert.certificationName}
                            onChange={(e) => handleListAction('certifications', idx, { ...cert, certificationName: e.target.value }, 'edit')}
                            style={{ flexGrow: 1 }}
                          />
                          <input
                            type="text"
                            className="form-input"
                            placeholder="Issuer: Amazon"
                            value={cert.issuer}
                            onChange={(e) => handleListAction('certifications', idx, { ...cert, issuer: e.target.value }, 'edit')}
                            style={{ width: '30%' }}
                          />
                          <button
                            type="button"
                            onClick={() => handleListAction('certifications', idx, null, 'delete')}
                            className="btn-icon"
                            style={{ color: 'var(--error)' }}
                          >
                            <FiTrash size={14} />
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => handleListAction('certifications', null, { certificationName: '', issuer: '', date: '' }, 'add')}
                        className="btn btn-secondary"
                        style={{ width: '100%' }}
                      >
                        <FiPlus />
                        <span>Add Certification</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* 2.8 Achievements */}
                <div className="card" style={{ padding: '16px' }}>
                  <div
                    onClick={() => setOpenAccordion(openAccordion === 'achievements' ? null : 'achievements')}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                  >
                    <h3 style={{ fontSize: '15px', fontWeight: 800 }}>Achievements</h3>
                    {openAccordion === 'achievements' ? <FiChevronUp /> : <FiChevronDown />}
                  </div>

                  {openAccordion === 'achievements' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                      {achievements.map((ach, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="Winner of National Hackathon"
                            value={ach.achievement}
                            onChange={(e) => handleListAction('achievements', idx, { ...ach, achievement: e.target.value }, 'edit')}
                            style={{ flexGrow: 1 }}
                          />
                          <button
                            type="button"
                            onClick={() => handleListAction('achievements', idx, null, 'delete')}
                            className="btn-icon"
                            style={{ color: 'var(--error)' }}
                          >
                            <FiTrash size={14} />
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => handleListAction('achievements', null, { achievement: '', organization: '', date: '' }, 'add')}
                        className="btn btn-secondary"
                        style={{ width: '100%' }}
                      >
                        <FiPlus />
                        <span>Add Achievement</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* 2.9 Custom Sections */}
                <div className="card" style={{ padding: '16px' }}>
                  <div
                    onClick={() => setOpenAccordion(openAccordion === 'custom' ? null : 'custom')}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                  >
                    <h3 style={{ fontSize: '15px', fontWeight: 800 }}>Custom Sections</h3>
                    {openAccordion === 'custom' ? <FiChevronUp /> : <FiChevronDown />}
                  </div>

                  {openAccordion === 'custom' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                      {customSections.map((sec, idx) => (
                        <div key={idx} style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <input
                              type="text"
                              className="form-input"
                              value={sec.title}
                              onChange={(e) => handleListAction('customSections', idx, { ...sec, title: e.target.value }, 'edit')}
                              style={{ width: '60%', fontWeight: 700 }}
                            />
                            <button
                              type="button"
                              onClick={() => handleListAction('customSections', idx, null, 'delete')}
                              className="btn btn-secondary btn-sm"
                              style={{ color: 'var(--error)' }}
                            >
                              <FiTrash2 size={13} />
                            </button>
                          </div>
                          
                          <textarea
                            className="form-textarea"
                            placeholder="Add your custom body paragraphs or lists..."
                            value={sec.content}
                            onChange={(e) => handleListAction('customSections', idx, { ...sec, content: e.target.value }, 'edit')}
                            style={{ width: '100%', boxSizing: 'border-box' }}
                          />
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => handleListAction('customSections', null, { title: 'New Custom Section', content: '' }, 'add')}
                        className="btn btn-secondary"
                        style={{ width: '100%' }}
                      >
                        <FiPlus />
                        <span>Add Custom Section</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* TAB 2: Style & Customization Settings */}
            {activeTab === 'style' && (
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                  Layout & Design Settings
                </h3>

                <div className="form-group">
                  <label className="form-label">Resume Template Theme</label>
                  <select
                    className="form-input"
                    value={template}
                    onChange={(e) => handleTopLevelChange('template', e.target.value)}
                  >
                    {templates.map((tpl) => (
                      <option key={tpl.id} value={tpl.id}>
                        {tpl.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Font Family</label>
                  <select
                    className="form-input"
                    value={customization.fontFamily || 'Inter'}
                    onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
                  >
                    <option value="Inter">Inter (Modern Sans-Serif)</option>
                    <option value="Roboto">Roboto (Clean Sans)</option>
                    <option value="Arial">Arial (Standard Sans)</option>
                    <option value="Garamond">Garamond / Georgia (Traditional Serif)</option>
                  </select>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Font Size</label>
                    <select
                      className="form-input"
                      value={customization.fontSize || '13px'}
                      onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                    >
                      <option value="11px">11px (Compact)</option>
                      <option value="12.5px">12.5px</option>
                      <option value="13px">13px (Default)</option>
                      <option value="14px">14px</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Heading Size</label>
                    <select
                      className="form-input"
                      value={customization.headingSize || '15px'}
                      onChange={(e) => handleStyleChange('headingSize', e.target.value)}
                    >
                      <option value="13px">13px</option>
                      <option value="15px">15px (Default)</option>
                      <option value="18px">18px</option>
                      <option value="20px">20px (Bold)</option>
                    </select>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Line Spacing</label>
                    <select
                      className="form-input"
                      value={customization.lineSpacing || '1.4'}
                      onChange={(e) => handleStyleChange('lineSpacing', e.target.value)}
                    >
                      <option value="1.2">1.2 (Tight)</option>
                      <option value="1.35">1.35</option>
                      <option value="1.45">1.45 (Default)</option>
                      <option value="1.6">1.6 (Wide)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Margins</label>
                    <select
                      className="form-input"
                      value={customization.margins || '0.75in'}
                      onChange={(e) => handleStyleChange('margins', e.target.value)}
                    >
                      <option value="0.5in">0.5 in (Narrow)</option>
                      <option value="0.75in">0.75 in (Balanced)</option>
                      <option value="1in">1.0 in (Standard)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Theme Accent Color</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="color"
                      value={customization.accentColor || '#6366f1'}
                      onChange={(e) => handleStyleChange('accentColor', e.target.value)}
                      style={{ width: '40px', height: '40px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    />
                    <input
                      type="text"
                      className="form-input"
                      value={customization.accentColor || '#6366f1'}
                      onChange={(e) => handleStyleChange('accentColor', e.target.value)}
                      style={{ flexGrow: 1 }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Drag and Drop Reordering */}
            {activeTab === 'reorder' && (
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Drag Sections to Reorder</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '4px' }}>
                    Hold and drag items to swap formatting placement instantly in the live PDF.
                  </p>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {sectionOrder.map((section, idx) => {
                    if (section === 'personalInfo') return null; // Always header top
                    return (
                      <div
                        key={section}
                        draggable
                        onDragStart={(e) => handleDragStart(e, idx)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDrop(e, idx)}
                        style={{
                          padding: '12px 16px',
                          background: 'var(--bg-secondary)',
                          border: '1px dashed var(--border)',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'grab',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <span style={{ fontWeight: 600, fontSize: '13px', textTransform: 'capitalize' }}>
                          {section.replace(/([A-Z])/g, ' $1')}
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>☰ Drag</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Right Panel: scale-to-fit digital paper preview */}
        <div
          style={{
            flexGrow: 1,
            background: 'var(--bg-tertiary)',
            padding: '24px',
            overflowY: 'auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}
        >
          {/* A4 Paper Frame */}
          <div
            id="resume-print-area"
            ref={printAreaRef}
            style={{
              width: '210mm', // A4 dimensions
              minHeight: '297mm',
              background: '#ffffff',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
              borderRadius: '2px',
              transform: 'scale(0.85)',
              transformOrigin: 'top center',
              margin: '0 auto 40px auto',
              boxSizing: 'border-box',
              overflow: 'hidden',
            }}
          >
            {React.createElement(getTemplateById(template).component, {
              data: currentResume,
            })}
          </div>
        </div>

      </div>

      {/* AI HELP POPUPS / MODALS */}
      {aiPromptModal === 'summary' && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '20px' }}>
          <div className="card fade-in" style={{ width: '100%', maxWidth: '480px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800 }}>AI Professional Summary</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Write the target job title you want to focus your summary on. We will combine your profile skills and experience.
            </p>
            <div className="form-group">
              <label className="form-label" htmlFor="target-role-input">Target Role</label>
              <input
                id="target-role-input"
                type="text"
                className="form-input"
                placeholder="e.g. Senior Java Developer, Frontend Engineer"
                value={aiTargetRole}
                onChange={(e) => setAiTargetRole(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button type="button" onClick={() => setAiPromptModal(null)} className="btn btn-secondary btn-sm">
                Cancel
              </button>
              <button type="button" onClick={triggerAiSummary} className="btn btn-primary btn-sm" disabled={aiLoading}>
                {aiLoading ? <div className="spinner" style={{ width: '12px', height: '12px' }} /> : 'Generate Summary'}
              </button>
            </div>
          </div>
        </div>
      )}

      {aiPromptModal === 'bullet' && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '20px' }}>
          <div className="card fade-in" style={{ width: '100%', maxWidth: '520px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800 }}>AI Bullet Optimizer</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Enter or modify the bullet point description below. AI will rephrase this to sound professional and impact-driven.
            </p>
            <div className="form-group">
              <textarea
                className="form-textarea"
                value={bulletTextToImprove}
                onChange={(e) => setBulletTextToImprove(e.target.value)}
                style={{ minHeight: '120px' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button type="button" onClick={() => setAiPromptModal(null)} className="btn btn-secondary btn-sm">
                Cancel
              </button>
              <button type="button" onClick={triggerAiImproveBullet} className="btn btn-primary btn-sm" disabled={aiLoading}>
                {aiLoading ? <div className="spinner" style={{ width: '12px', height: '12px' }} /> : 'Optimize Bullet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Builder;
