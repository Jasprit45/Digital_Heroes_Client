import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Heart,
  Trophy,
  Award,
  Settings,
  BarChart3,
  LogOut,
  ShieldAlert,
  Menu,
  X,
  ChevronRight,
  User
} from 'lucide-react';

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Users', path: '/admin/users', icon: Users },
    { label: 'Charities', path: '/admin/charities', icon: Heart },
    { label: 'Draws', path: '/admin/draws', icon: Trophy },
    { label: 'Winners', path: '/admin/winners', icon: Award },
    { label: 'Configuration', path: '/admin/config', icon: Settings },
    { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
  ];

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="app-container" style={{ flexDirection: 'row' }}>
      {/* Desktop Admin Sidebar */}
      <aside className="admin-sidebar" style={{
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
        {/* Brand Logo & Admin Badge */}
        <div style={{ marginBottom: '2rem', padding: '0 0.5rem' }}>
          <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 800, fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--danger) 0%, var(--warning) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldAlert size={20} color="#fff" />
            </div>
            <span>DIGITAL<span style={{ color: 'var(--danger)' }}>HEROES</span></span>
          </Link>
          <span className="badge badge-danger" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>
            ● ADMIN MODE
          </span>
        </div>

        {/* User Badge */}
        <div style={{
          background: 'var(--surface-secondary)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '0.85rem',
          marginBottom: '1.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid var(--danger)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--danger)',
            fontWeight: 700
          }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : <User size={16} />}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name || user?.email}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--danger)', fontWeight: 600 }}>Administrator</div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
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
                  padding: '0.75rem 0.9rem',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: active ? 700 : 500,
                  fontSize: '0.88rem',
                  color: active ? '#fff' : 'var(--text-muted)',
                  background: active ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(245, 158, 11, 0.1) 100%)' : 'transparent',
                  border: active ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid transparent',
                  transition: 'var(--transition)'
                }}
              >
                <Icon size={18} color={active ? 'var(--danger)' : 'currentColor'} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {active && <ChevronRight size={14} color="var(--danger)" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link to="/dashboard" className="btn btn-secondary btn-full btn-sm">
            Exit to User Portal
          </Link>
          <button onClick={handleLogout} className="btn btn-outline btn-full btn-sm">
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </aside>

      {/* Content Body Pane */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Admin Top Header (Desktop & Mobile) */}
        <header style={{
          height: '64px',
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem',
          position: 'sticky',
          top: 0,
          zIndex: 40
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              className="admin-mobile-toggle"
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'none' }}
            >
              {mobileDrawerOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <span style={{ fontWeight: 700, fontSize: '1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={16} color="var(--danger)" /> Control Center
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="badge badge-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              ADMIN SYSTEM
            </span>
          </div>
        </header>

        {/* Mobile Drawer */}
        {mobileDrawerOpen && (
          <div className="admin-mobile-drawer" style={{
            background: 'var(--surface)',
            borderBottom: '1px solid var(--border)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileDrawerOpen(false)}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  color: isActive(item.path) ? 'var(--danger)' : 'var(--text)',
                  fontWeight: 600,
                  background: isActive(item.path) ? 'var(--surface-secondary)' : 'transparent'
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}

        <main style={{ flex: 1, padding: '2rem 1.5rem 4rem 1.5rem' }}>
          <div className="container" style={{ maxWidth: '1200px', margin: 0 }}>
            <Outlet />
          </div>
        </main>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .admin-sidebar { display: none !important; }
          .admin-mobile-toggle { display: block !important; }
        }
      `}</style>
    </div>
  );
};
