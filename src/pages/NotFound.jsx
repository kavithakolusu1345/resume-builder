import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiAlertTriangle } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div
      style={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        textAlign: 'center',
        padding: '24px',
      }}
    >
      <div
        className="btn-icon"
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          color: 'var(--error)',
          border: 'none',
          marginBottom: '24px',
        }}
      >
        <FiAlertTriangle size={36} />
      </div>
      
      <h1 style={{ fontSize: '48px', fontWeight: 900, marginBottom: '12px' }}>404 - Page Not Found</h1>
      
      <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', fontSize: '16px', lineHeight: '1.6', marginBottom: '32px' }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      
      <Link to="/" className="btn btn-primary btn-lg">
        <FiHome size={18} />
        <span>Return to Home</span>
      </Link>
    </div>
  );
};

export default NotFound;
