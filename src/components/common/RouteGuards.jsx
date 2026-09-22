import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const LoadingSpinner = () => (
  <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
    <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Loading Digital Heroes...</p>
  </div>
);

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export const SubscriberRoute = ({ children }) => {
  const { isAuthenticated, isSubscriber, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isSubscriber) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '540px', margin: '0 auto', padding: '3rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
          <h2 className="card-title" style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>Subscriber Access Only</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            This feature requires an active Digital Heroes subscription. Join our monthly draw and support impactful charities!
          </p>
          <Navigate to="/subscription" replace />
        </div>
      </div>
    );
  }

  return children;
};

export const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export const PublicRoute = ({ children }) => {
  return children;
};
