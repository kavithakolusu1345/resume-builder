import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchResumeById } from '../features/resume/resumeSlice';
import { api } from '../services/api';
import { FiTarget, FiAlertCircle, FiCheck, FiArrowLeft, FiAlertTriangle, FiBookOpen } from 'react-icons/fi';

const AtsAnalyzer = () => {
  const { resumeId } = useParams();
  const dispatch = useDispatch();

  const { currentResume } = useSelector((state) => state.resume);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (resumeId) {
      dispatch(fetchResumeById(resumeId));
      fetchLatestReport();
    }
  }, [resumeId, dispatch]);

  const fetchLatestReport = async () => {
    try {
      const data = await api.get(`/ats/${resumeId}`);
      setReport(data);
    } catch (err) {
      // Ignored if no reports are found initially
      console.log('No report yet for this resume.');
    }
  };

  const handleRunAnalysis = async () => {
    if (!jobDescription.trim()) {
      setError('Please paste a job description first.');
      return;
    }
    
    setLoading(true);
    setError('');
    setReport(null);

    try {
      const data = await api.post('/ats/analyze', {
        resumeId,
        jobDescription,
      });
      setReport(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'ATS Analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'var(--success)';
    if (score >= 60) return 'var(--warning)';
    return 'var(--error)';
  };

  return (
    <div className="page-container fade-in" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Top Breadcrumb Header */}
      <div style={{ marginBottom: '24px' }}>
        <Link
          to={resumeId ? `/builder/${resumeId}` : '/dashboard'}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '12px' }}
        >
          <FiArrowLeft size={14} />
          <span>Back to {currentResume ? `"${currentResume.title}"` : 'Dashboard'}</span>
        </Link>
        <h1 style={{ fontSize: '32px', fontWeight: 800 }}>ATS Optimizer Panel</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
          Compare your draft side-by-side with industry job descriptions to locate technical gaps and bypass resume filters.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' }}>
        
        {/* Left Side: Input Panel */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Paste Target Job Description</h3>
          
          {error && (
            <div className="alert alert-error">
              <FiAlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <textarea
              className="form-textarea"
              placeholder="Paste the full job posting details here (responsibilities, required tech stack, educational requirements, etc.)..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              style={{ minHeight: '300px' }}
            />
          </div>

          <button
            onClick={handleRunAnalysis}
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner" style={{ width: '16px', height: '16px', borderTopColor: '#fff' }} />
                <span>Running Scan...</span>
              </>
            ) : (
              <>
                <FiTarget size={18} />
                <span>Compare & Audit Match</span>
              </>
            )}
          </button>
        </div>

        {/* Right Side: Score & Report Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {loading && (
            <div className="card-glass" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px', gap: '16px' }}>
              <div className="spinner" style={{ width: '48px', height: '48px', borderWidth: '4px' }} />
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ fontWeight: 700 }}>Comparing Resume Data</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
                  Locating keywords, extracting required skills, and grading layouts...
                </p>
              </div>
            </div>
          )}

          {!loading && !report && (
            <div className="card-glass" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px', gap: '16px', textAlign: 'center' }}>
              <FiBookOpen size={48} style={{ color: 'var(--text-muted)' }} />
              <div>
                <h4 style={{ fontWeight: 700 }}>No Analysis Performed</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px', maxWidth: '300px' }}>
                  Paste a target job listing in the left box and run the audit to receive compatibility grades and recommendations.
                </p>
              </div>
            </div>
          )}

          {!loading && report && (
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Score Indicator */}
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                <div
                  style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: '50%',
                    border: `6px solid ${getScoreColor(report.score)}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'var(--bg-secondary)',
                    fontWeight: 900,
                    fontSize: '24px',
                    color: 'var(--text-primary)'
                  }}
                >
                  <span>{report.score}%</span>
                </div>

                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800 }}>ATS Match Rating</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
                    Your resume matches {report.score}% of the target requirements.
                  </p>
                </div>
              </div>

              {/* Breakdown Grid */}
              <div className="grid-2">
                {[
                  { name: 'Keywords Search', val: report.breakdown?.keywords },
                  { name: 'Skills Coverage', val: report.breakdown?.skills },
                  { name: 'Experience Relevance', val: report.breakdown?.experience },
                  { name: 'Formatting & Layout', val: report.breakdown?.formatting },
                  { name: 'Structure Parsing', val: report.breakdown?.structure },
                ].map((item, idx) => (
                  <div key={idx} className="card" style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                      <span style={{ fontWeight: 600 }}>{item.name}</span>
                      <span style={{ fontWeight: 700, color: getScoreColor(item.val) }}>{item.val}%</span>
                    </div>
                    {/* Linear Progress Bar */}
                    <div style={{ height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', marginTop: '8px', overflow: 'hidden' }}>
                      <div style={{ width: `${item.val}%`, height: '100%', background: getScoreColor(item.val), borderRadius: '3px' }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Match / Miss Keyword Lists */}
              <div className="grid-2">
                {/* Matched Keywords */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FiCheck />
                    <span>Matched Keywords ({report.matchedKeywords?.length || 0})</span>
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {report.matchedKeywords?.map((kw, i) => (
                      <span key={i} className="badge" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
                        {kw}
                      </span>
                    ))}
                    {(!report.matchedKeywords || report.matchedKeywords.length === 0) && (
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No matches located yet.</span>
                    )}
                  </div>
                </div>

                {/* Missing Keywords */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FiAlertTriangle />
                    <span>Missing Keywords ({report.missingKeywords?.length || 0})</span>
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {report.missingKeywords?.map((kw, i) => (
                      <span key={i} className="badge" style={{ background: 'var(--warning-light)', color: 'var(--warning)' }}>
                        {kw}
                      </span>
                    ))}
                    {(!report.missingKeywords || report.missingKeywords.length === 0) && (
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Perfect! No missing keywords.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actionable Recommendations */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Actionable Optimization Tips</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {report.recommendations?.map((rec, i) => (
                    <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>•</span>
                      <span>{rec}</span>
                    </div>
                  ))}
                  {(!report.recommendations || report.recommendations.length === 0) && (
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No optimizations needed! You are print and scan ready.</p>
                  )}
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          main {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AtsAnalyzer;
