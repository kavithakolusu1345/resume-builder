import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import ThemeToggle from './ThemeToggle';
import { FiMenu, FiX, FiLogOut, FiBriefcase, FiUser, FiSettings } from 'react-icons/fi';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setProfileDropdownOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Link to="/" className="navbar-brand">
          ResumeForge
        </Link>
      </div>

      {/* Desktop Links */}
      <div className="navbar-links" style={{ display: 'none', alignItems: 'center' }}>
        {isAuthenticated ? (
          <>
            <Link
              to="/dashboard"
              className={isActive('/dashboard') ? 'active' : ''}
              style={{
                color: isActive('/dashboard') ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontWeight: 600,
              }}
            >
              Dashboard
            </Link>
            
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="btn-secondary btn-sm"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  borderRadius: 'var(--radius-full)',
                  padding: '6px 12px',
                }}
              >
                <FiUser size={14} />
                <span>{user?.name || 'Account'}</span>
              </button>
              
              {profileDropdownOpen && (
                <div
                  className="card"
                  style={{
                    position: 'absolute',
                    top: '46px',
                    right: 0,
                    width: '200px',
                    padding: '8px',
                    zIndex: 10,
                    boxShadow: 'var(--shadow-lg)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <Link
                    to="/profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    <FiSettings size={14} />
                    <span>Settings & Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      width: '100%',
                      textAlign: 'left',
                      color: 'var(--error)',
                      cursor: 'pointer',
                    }}
                  >
                    <FiLogOut size={14} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <Link to="/login" className="btn btn-secondary btn-sm" style={{ padding: '8px 16px' }}>
              Sign In
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm" style={{ padding: '8px 16px' }}>
              Get Started
            </Link>
          </>
        )}
        <ThemeToggle />
      </div>

      {/* Desktop Display Flag */}
      <style>{`
        @media (min-width: 768px) {
          .navbar-links {
            display: flex !important;
          }
          .mobile-menu-toggle {
            display: none !important;
          }
        }
      `}</style>

      {/* Mobile Menu Toggle */}
      <div className="mobile-menu-toggle" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <ThemeToggle />
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="btn-icon"
          aria-label="Toggle mobile menu"
          style={{ width: '36px', height: '36px' }}
        >
          {mobileMenuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
        </button>
      </div>

      {/* Mobile Dropdown Panel */}
      {mobileMenuOpen && (
        <div
          className="card-glass"
          style={{
            position: 'absolute',
            top: '65px',
            left: 0,
            width: '100%',
            borderRadius: 0,
            borderLeft: 'none',
            borderRight: 'none',
            zIndex: 99,
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            boxShadow: 'var(--shadow-lg)',
            boxSizing: 'border-box',
          }}
        >
          {isAuthenticated ? (
            <>
              <div style={{ padding: '0 8px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                <div style={{ fontWeight: 600 }}>{user?.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{user?.email}</div>
              </div>
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} style={{ padding: '8px' }}>
                Dashboard
              </Link>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)} style={{ padding: '8px' }}>
                Settings & Profile
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px',
                  color: 'var(--error)',
                  background: 'none',
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'left',
                }}
              >
                <FiLogOut size={16} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <a href="#features" onClick={() => setMobileMenuOpen(false)} style={{ padding: '8px' }}>
                Features
              </a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} style={{ padding: '8px' }}>
                How It Works
              </a>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-secondary"
                style={{ width: '100%', boxSizing: 'border-box' }}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-primary"
                style={{ width: '100%', boxSizing: 'border-box' }}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
