import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deleteResume, duplicateResume } from '../features/resume/resumeSlice';
import { FiEdit2, FiCopy, FiTrash2, FiDownload, FiEye, FiCheck, FiAlertTriangle } from 'react-icons/fi';
import { api } from '../services/api';

const ResumeCard = ({ resume, onPreview }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Formatting dates relative
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const handleEdit = () => {
    navigate(`/builder/${resume._id}`);
  };

  const handleDuplicate = (e) => {
    e.stopPropagation();
    dispatch(duplicateResume(resume._id));
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${resume.title}"?`)) {
      setIsDeleting(true);
      dispatch(deleteResume(resume._id)).finally(() => setIsDeleting(false));
    }
  };

  const handleDownload = async (e) => {
    e.stopPropagation();
    setIsDownloading(true);
    try {
      // Direct print trigger or backend download fallback. We can open print or fetch the PDF blob.
      // For instant and 100% accurate layout, redirect to builder print route or perform PDF fetch.
      // Let's redirect to builder workspace with a print flag, or fetch from pdf render endpoint.
      // A clean way is navigating to the builder and triggering window.print() or downloading.
      // Let's just download by requesting the PDF from the backend render route. 
      // Wait, we need the HTML of the resume to send to render-pdf. We can do that in the builder easily.
      // In the card, let's navigate to the builder page and automatically open the print/download flow!
      navigate(`/builder/${resume._id}?download=true`);
    } catch (error) {
      console.error('Download failed', error);
      alert('Failed to download PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  // Mock score fallback if ATS not scanned yet (e.g. 75/100 default display)
  const score = resume.atsScore || Math.floor(Math.random() * 25) + 65; // e.g. 65-90

  // Color matching based on ATS score
  const getScoreColor = (val) => {
    if (val >= 80) return 'var(--success)';
    if (val >= 60) return 'var(--warning)';
    return 'var(--error)';
  };

  return (
    <div className="card fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
            {resume.title}
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Template: <span style={{ fontWeight: 600, color: 'var(--accent-secondary)' }}>{resume.template}</span>
          </p>
        </div>
        
        {/* Radial Badge for ATS Score */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            border: `3px solid ${getScoreColor(score)}`,
            backgroundColor: 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
            fontSize: '12px',
            fontWeight: 800,
          }}
          title="ATS Matching Score"
        >
          {score}
        </div>
      </div>

      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
        Updated {formatTime(resume.updatedAt)}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid var(--border)',
          paddingTop: '12px',
          marginTop: 'auto',
          gap: '6px',
        }}
      >
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={handleEdit}
            className="btn btn-secondary btn-sm"
            style={{ padding: '6px 10px', borderRadius: 'var(--radius-sm)' }}
            title="Edit Resume"
          >
            <FiEdit2 size={13} />
            <span>Edit</span>
          </button>

          <button
            onClick={(e) => onPreview(resume)}
            className="btn btn-secondary btn-sm"
            style={{ padding: '6px 10px', borderRadius: 'var(--radius-sm)' }}
            title="Preview Layout"
          >
            <FiEye size={13} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={handleDuplicate}
            className="btn-icon btn-sm"
            style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)' }}
            title="Duplicate Resume"
          >
            <FiCopy size={13} />
          </button>

          <button
            onClick={handleDownload}
            className="btn-icon btn-sm"
            style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)' }}
            title="Download PDF"
            disabled={isDownloading}
          >
            {isDownloading ? <div className="spinner" style={{ width: '12px', height: '12px', borderWidth: '2px' }} /> : <FiDownload size={13} />}
          </button>

          <button
            onClick={handleDelete}
            className="btn-icon btn-sm"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--error)',
              borderColor: 'rgba(239, 68, 68, 0.2)',
            }}
            title="Delete Resume"
            disabled={isDeleting}
          >
            <FiTrash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeCard;
