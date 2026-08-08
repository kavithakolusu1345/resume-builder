import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchResumes, createResume } from '../features/resume/resumeSlice';
import ResumeCard from '../components/ResumeCard';
import { templates, getTemplateById } from '../templates';
import { FiPlus, FiCpu, FiFileText, FiX, FiCheck } from 'react-icons/fi';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { resumes, loading, error } = useSelector((state) => state.resume);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedResumeForPreview, setSelectedResumeForPreview] = useState(null);

  // New Resume form state
  const [newTitle, setNewTitle] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('ATS Classic');

  useEffect(() => {
    dispatch(fetchResumes());
  }, [dispatch]);

  const handleCreateResume = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const resultAction = await dispatch(
        createResume({
          title: newTitle,
          template: selectedTemplate,
        })
      );
      if (createResume.fulfilled.match(resultAction)) {
        setCreateModalOpen(false);
        setNewTitle('');
        // Navigate directly to the builder
        navigate(`/builder/${resultAction.payload._id}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenPreview = (resume) => {
    setSelectedResumeForPreview(resume);
    setPreviewModalOpen(true);
  };

  return (
    <div className="page-container fade-in" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Dashboard Top Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800 }}>Welcome back, {user?.name || 'Developer'}</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Build, optimize, and scan your resumes against target job postings.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setCreateModalOpen(true)} className="btn btn-primary">
            <FiPlus size={18} />
            <span>Create Resume</span>
          </button>
        </div>
      </div>

      {/* Content Grid */}
      {loading && resumes.length === 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {[1, 2, 3].map((n) => (
            <div key={n} className="card" style={{ height: '200px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ background: 'var(--bg-tertiary)', height: '24px', width: '60%', borderRadius: '4px' }}></div>
                <div style={{ background: 'var(--bg-tertiary)', height: '40px', width: '40px', borderRadius: '50%' }}></div>
              </div>
              <div style={{ background: 'var(--bg-tertiary)', height: '16px', width: '40%', borderRadius: '4px' }}></div>
              <div style={{ background: 'var(--bg-tertiary)', height: '40px', width: '100%', borderRadius: '4px', marginTop: 'auto' }}></div>
            </div>
          ))}
        </div>
      ) : resumes.length === 0 ? (
        /* Empty State */
        <div
          className="card-glass"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: '60px 24px',
            gap: '16px',
            maxWidth: '600px',
            margin: '40px auto',
          }}
        >
          <div
            className="btn-icon"
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--accent-light)',
              color: 'var(--accent-primary)',
              border: 'none',
            }}
          >
            <FiFileText size={28} />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800 }}>No Resumes Yet</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', fontSize: '15px' }}>
            Build your first professional resume with AI bullet improvement, optimization suggestions, and clean templates.
          </p>
          <button onClick={() => setCreateModalOpen(true)} className="btn btn-primary" style={{ marginTop: '8px' }}>
            <FiPlus size={16} />
            <span>Create Your First Resume</span>
          </button>
        </div>
      ) : (
        /* Resumes Grid */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {resumes.map((resume) => (
            <ResumeCard key={resume._id} resume={resume} onPreview={handleOpenPreview} />
          ))}
        </div>
      )}

      {/* CREATE RESUME MODAL */}
      {createModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            padding: '20px',
          }}
        >
          <div
            className="card fade-in"
            style={{
              width: '100%',
              maxWidth: '680px',
              padding: '32px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 800 }}>Create New Resume</h2>
              <button onClick={() => setCreateModalOpen(false)} className="btn-icon" style={{ width: '32px', height: '32px' }}>
                <FiX size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateResume} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="resume-title-input">Resume Title</label>
                <input
                  id="resume-title-input"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Java Developer Resume, Product Designer Resume"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>

              {/* Template Selection */}
              <div className="form-group">
                <label className="form-label">Choose Starting Template</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', marginTop: '8px' }}>
                  {templates.map((tpl) => {
                    const isSelected = selectedTemplate === tpl.id;
                    return (
                      <div
                        key={tpl.id}
                        onClick={() => setSelectedTemplate(tpl.id)}
                        style={{
                          border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border)',
                          borderRadius: 'var(--radius-md)',
                          padding: '12px',
                          cursor: 'pointer',
                          backgroundColor: isSelected ? 'var(--accent-light)' : 'var(--bg-secondary)',
                          position: 'relative',
                          transition: 'all 0.2s',
                        }}
                      >
                        {isSelected && (
                          <div
                            style={{
                              position: 'absolute',
                              top: '8px',
                              right: '8px',
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--accent-primary)',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '10px',
                            }}
                          >
                            <FiCheck size={10} />
                          </div>
                        )}
                        <h4 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>{tpl.name}</h4>
                        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.3' }}>
                          {tpl.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                <button type="button" onClick={() => setCreateModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={!newTitle.trim()}>
                  Create & Open Editor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PREVIEW RESUME MODAL */}
      {previewModalOpen && selectedResumeForPreview && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            padding: '20px',
          }}
        >
          <div
            className="card fade-in"
            style={{
              width: '100%',
              maxWidth: '850px',
              padding: '24px',
              maxHeight: '95vh',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-lg)',
              backgroundColor: '#fff',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {/* Modal Control Top Bar (Not printed) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#111827', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#111827' }}>Preview: {selectedResumeForPreview.title}</h3>
                <span style={{ fontSize: '12px', color: '#4b5563' }}>Template: {selectedResumeForPreview.template}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => navigate(`/builder/${selectedResumeForPreview._id}`)}
                  className="btn btn-primary btn-sm"
                >
                  Open in Editor
                </button>
                <button onClick={() => setPreviewModalOpen(false)} className="btn-icon" style={{ width: '32px', height: '32px', color: '#111827', borderColor: '#d1d5db' }}>
                  <FiX size={16} />
                </button>
              </div>
            </div>

            {/* A4 Render Box */}
            <div
              style={{
                border: '1px solid #d1d5db',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                transform: 'scale(1)',
                transformOrigin: 'top center',
                width: '100%',
                background: '#fff',
              }}
            >
              {/* Dynamic render mapping */}
              {React.createElement(getTemplateById(selectedResumeForPreview.template).component, {
                data: selectedResumeForPreview,
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
