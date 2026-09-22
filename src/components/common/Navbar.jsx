import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, Shield, Trophy, Heart, LogOut, User, DollarSign, Target } from 'lucide-react';

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar-wrapper" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 800, fontSize: '1.35rem', letterSpacing: '-0.02em', color: '#fff' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)'
          }}>
            <Shield size={22} color="#fff" />
          </div>
          <span>DIGITAL<span style={{ color: 'var(--primary)' }}>HEROES</span></span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link to="/" style={{ color: isActive('/') ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 600, transition: 'var(--transition)' }}>
            Home
          </Link>
          <Link to="/how-it-works" style={{ color: isActive('/how-it-works') ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 600, transition: 'var(--transition)' }}>
            How It Works
          </Link>
          <Link to="/charities" style={{ color: isActive('/charities') ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 600, transition: 'var(--transition)' }}>
            Charities
          </Link>
          <Link to="/donate" style={{ color: isActive('/donate') ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 600, transition: 'var(--transition)' }}>
            Donate
          </Link>
        </nav>

        {/* CTA / Auth Actions */}
        <div className="desktop-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link to="/dashboard" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={16} />
                Dashboard
              </Link>
              <button onClick={handleLogout} className="btn btn-outline btn-sm" title="Log Out">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-outline btn-sm">
                Log In
              </Link>
              <Link to="/subscription" className="btn btn-primary btn-sm">
                Subscribe Now
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="mobile-toggle-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text)',
            cursor: 'pointer',
            padding: '0.5rem',
            display: 'none'
          }}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer" style={{
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text)', fontWeight: 600, padding: '0.5rem 0' }}>Home</Link>
          <Link to="/how-it-works" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text)', fontWeight: 600, padding: '0.5rem 0' }}>How It Works</Link>
          <Link to="/charities" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text)', fontWeight: 600, padding: '0.5rem 0' }}>Charities</Link>
          <Link to="/donate" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text)', fontWeight: 600, padding: '0.5rem 0' }}>Donate</Link>

          <hr style={{ borderColor: 'var(--border)', margin: '0.5rem 0' }} />

          {isAuthenticated ? (
            <>
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary btn-full">Dashboard</Link>
              <button onClick={() => { setMobileMenuOpen(false); handleLogout(); }} className="btn btn-outline btn-full">Log Out</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-outline btn-full">Log In</Link>
              <Link to="/subscription" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary btn-full">Subscribe Now</Link>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav, .desktop-actions { display: none !important; }
          .mobile-toggle-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
};
