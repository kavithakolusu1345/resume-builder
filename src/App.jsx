import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load pages for performance
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Builder = lazy(() => import('./pages/Builder'));
const AtsAnalyzer = lazy(() => import('./pages/AtsAnalyzer'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));

const PageLoader = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      background: 'var(--bg-primary)',
    }}
  >
    <div style={{ textAlign: 'center' }}>
      <div className="spinner" style={{ margin: '0 auto 16px', width: '36px', height: '36px' }}></div>
      <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
        {/* Navbar is shown on all pages except Builder (full-screen editor) */}
        <Routes>
          <Route
            path="/builder/:id"
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <Builder />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              <>
                <Navbar />
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/ats/:resumeId"
                      element={
                        <ProtectedRoute>
                          <AtsAnalyzer />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
