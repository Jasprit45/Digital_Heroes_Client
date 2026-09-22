import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  CreditCard,
  Heart,
  Target,
  Trophy,
  Award,
  LogOut,
  Shield,
  User,
  ChevronRight
} from 'lucide-react';

export const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Subscription', path: '/subscription', icon: CreditCard },
    { label: 'Charity Selection', path: '/charity', icon: Heart },
    { label: 'Golf Scores', path: '/scores', icon: Target },
    { label: 'Monthly Draws', path: '/draws', icon: Trophy },
    { label: 'My Winnings', path: '/winnings', icon: Award },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="app-container" style={{ flexDirection: 'row' }}>
      {/* Sidebar Navigation */}
      <aside className="dashboard-sidebar" style={{
        width: '260px',
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem 1rem',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 50
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 800, fontSize: '1.25rem', color: '#fff', marginBottom: '2.5rem', padding: '0 0.5rem' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Shield size={20} color="#fff" />
          </div>
          <span>DIGITAL<span style={{ color: 'var(--primary)' }}>HEROES</span></span>
        </Link>

        {/* User Card */}
        <div style={{
          background: 'var(--surface-secondary)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '1rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'var(--primary-glow)',
            border: '1px solid var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)',
            fontWeight: 700
          }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : <User size={18} />}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name || user?.fullName || 'User'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.email}
            </div>
          </div>
        </div>

        {/* Menu Links */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '0.8rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: active ? 700 : 500,
                  fontSize: '0.9rem',
                  color: active ? '#fff' : 'var(--text-muted)',
                  background: active ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(99, 102, 241, 0.1) 100%)' : 'transparent',
                  border: active ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent',
                  transition: 'var(--transition)'
                }}
              >
                <Icon size={18} color={active ? 'var(--primary)' : 'currentColor'} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {active && <ChevronRight size={16} color="var(--primary)" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
          <button
            onClick={handleLogout}
            className="btn btn-outline btn-full btn-sm"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <LogOut size={16} />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Mobile Top Header */}
        <header className="dashboard-mobile-header" style={{
          display: 'none',
          padding: '1rem',
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link to="/" style={{ fontWeight: 800, color: '#fff', fontSize: '1.1rem' }}>
            DIGITAL<span style={{ color: 'var(--primary)' }}>HEROES</span>
          </Link>
          <button onClick={handleLogout} className="btn btn-outline btn-sm">
            <LogOut size={16} />
          </button>
        </header>

        {/* Mobile Subnav Pills */}
        <div className="dashboard-mobile-subnav" style={{
          display: 'none',
          padding: '0.75rem 1rem',
          background: 'var(--surface-secondary)',
          borderBottom: '1px solid var(--border)',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          gap: '0.5rem'
        }}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'inline-block',
                padding: '0.4rem 0.85rem',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: isActive(item.path) ? '#fff' : 'var(--text-muted)',
                background: isActive(item.path) ? 'var(--primary)' : 'var(--surface)'
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <main style={{ flex: 1, padding: '2rem 1.5rem 4rem 1.5rem' }}>
          <div className="container" style={{ maxWidth: '1100px', margin: 0 }}>
            <Outlet />
          </div>
        </main>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .dashboard-sidebar { display: none !important; }
          .dashboard-mobile-header { display: flex !important; }
          .dashboard-mobile-subnav { display: flex !important; }
        }
      `}</style>
    </div>
  );
};
