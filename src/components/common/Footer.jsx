import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{
      background: 'var(--surface)',
      borderTop: '1px solid var(--border)',
      padding: '4rem 0 2rem 0',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '3rem',
          marginBottom: '3rem'
        }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 800, fontSize: '1.35rem', color: '#fff', marginBottom: '1rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Shield size={18} color="#fff" />
              </div>
              <span>DIGITAL<span style={{ color: 'var(--primary)' }}>HEROES</span></span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Transforming passion into real-world charitable impact. Enter your scores, enter monthly draws, and support verified causes.
            </p>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: '1.25rem' }}>Navigation</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li><Link to="/" style={{ color: 'var(--text-muted)', transition: 'var(--transition)' }}>Home</Link></li>
              <li><Link to="/how-it-works" style={{ color: 'var(--text-muted)' }}>How It Works</Link></li>
              <li><Link to="/charities" style={{ color: 'var(--text-muted)' }}>Charity Directory</Link></li>
              <li><Link to="/donate" style={{ color: 'var(--text-muted)' }}>Independent Donation</Link></li>
            </ul>
          </div>

          {/* Subscriber & Auth Links */}
          <div>
            <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: '1.25rem' }}>Platform</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li><Link to="/subscription" style={{ color: 'var(--text-muted)' }}>Subscribe</Link></li>
              <li><Link to="/login" style={{ color: 'var(--text-muted)' }}>Subscriber Log In</Link></li>
              <li><Link to="/signup" style={{ color: 'var(--text-muted)' }}>Create Account</Link></li>
              <li><Link to="/dashboard" style={{ color: 'var(--text-muted)' }}>User Dashboard</Link></li>
            </ul>
          </div>

          {/* Charity Impact */}
          <div>
            <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: '1.25rem' }}>Charity Impact</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Every subscription directly funds partner charities. At least 10% of every subscriber fee goes straight to causes.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>
              <Heart size={16} fill="var(--primary)" />
              <span>Over $100,000+ Raised</span>
            </div>
          </div>
        </div>

        <hr style={{ borderColor: 'var(--border)', marginBottom: '2rem' }} />

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          color: 'var(--text-muted)',
          fontSize: '0.85rem'
        }}>
          <p>© {new Date().getFullYear()} Digital Heroes. All rights reserved.</p>
          <p style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Support</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
