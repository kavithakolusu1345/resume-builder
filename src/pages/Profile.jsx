import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, clearError } from '../features/auth/authSlice';
import { FiUser, FiPhone, FiMapPin, FiGlobe, FiGithub, FiLinkedin, FiLock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI Feedback
  const [successMsg, setSuccessMsg] = useState('');
  const [localErr, setLocalErr] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.profile?.phone || '');
      setLocation(user.profile?.location || '');
      setWebsite(user.profile?.website || '');
      setGithub(user.profile?.github || '');
      setLinkedin(user.profile?.linkedin || '');
    }
    return () => {
      dispatch(clearError());
    };
  }, [user, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setLocalErr('');

    if (password) {
      if (password.length < 6) {
        setLocalErr('New password must be at least 6 characters');
        return;
      }
      if (password !== confirmPassword) {
        setLocalErr('Passwords do not match');
        return;
      }
    }

    const profileData = {
      name,
      profile: {
        phone,
        location,
        website,
        github,
        linkedin,
      },
    };

    if (password) {
      profileData.password = password;
    }

    const resultAction = await dispatch(updateProfile(profileData));
    if (updateProfile.fulfilled.match(resultAction)) {
      setSuccessMsg('Profile updated successfully!');
      setPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div className="page-container fade-in" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', maxWidth: '800px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800 }}>Account Settings</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
          Manage your account profile, contact details, and credentials.
        </p>
      </div>

      {successMsg && (
        <div className="alert alert-success" style={{ marginBottom: '24px' }}>
          <FiCheckCircle size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {(error || localErr) && (
        <div className="alert alert-error" style={{ marginBottom: '24px' }}>
          <FiAlertCircle size={16} />
          <span>{localErr || error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Section 1: Personal Profile */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
            Personal Profile
          </h3>
          
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="name-input">Full Name</label>
              <div style={{ position: 'relative' }}>
                <FiUser style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="name-input"
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ paddingLeft: '40px', width: '100%', boxSizing: 'border-box' }}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="email-input">Email Address (Read Only)</label>
              <input
                id="email-input"
                type="email"
                className="form-input"
                value={user?.email || ''}
                style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)', cursor: 'not-allowed' }}
                disabled
              />
            </div>
          </div>
        </div>

        {/* Section 2: Contact Details & Social Links */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
            Contact Details & Portfolios
          </h3>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="phone-input">Phone Number</label>
              <div style={{ position: 'relative' }}>
                <FiPhone style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="phone-input"
                  type="text"
                  className="form-input"
                  placeholder="+1 (555) 019-2834"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ paddingLeft: '40px', width: '100%', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="location-input">Location</label>
              <div style={{ position: 'relative' }}>
                <FiMapPin style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="location-input"
                  type="text"
                  className="form-input"
                  placeholder="San Francisco, CA"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{ paddingLeft: '40px', width: '100%', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="website-input">Personal Website / Portfolio</label>
              <div style={{ position: 'relative' }}>
                <FiGlobe style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="website-input"
                  type="url"
                  className="form-input"
                  placeholder="https://johndoe.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  style={{ paddingLeft: '40px', width: '100%', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="github-input">GitHub Profile URL</label>
              <div style={{ position: 'relative' }}>
                <FiGithub style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="github-input"
                  type="url"
                  className="form-input"
                  placeholder="https://github.com/johndoe"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  style={{ paddingLeft: '40px', width: '100%', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="linkedin-input">LinkedIn Profile URL</label>
              <div style={{ position: 'relative' }}>
                <FiLinkedin style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="linkedin-input"
                  type="url"
                  className="form-input"
                  placeholder="https://linkedin.com/in/johndoe"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  style={{ paddingLeft: '40px', width: '100%', boxSizing: 'border-box' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Password Update */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
            Change Password
          </h3>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="new-password-input">New Password (Min 6 chars)</label>
              <div style={{ position: 'relative' }}>
                <FiLock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="new-password-input"
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '40px', width: '100%', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirm-new-password-input">Confirm New Password</label>
              <div style={{ position: 'relative' }}>
                <FiLock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="confirm-new-password-input"
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ paddingLeft: '40px', width: '100%', boxSizing: 'border-box' }}
                />
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? <div className="spinner" style={{ width: '18px', height: '18px' }} /> : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
