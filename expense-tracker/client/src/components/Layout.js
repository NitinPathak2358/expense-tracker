import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const NAV = [
  { to: '/',            label: 'Dashboard',    icon: '◈' },
  { to: '/transactions', label: 'Transactions', icon: '↕' },
  { to: '/stats',       label: 'Analytics',    icon: '◉' },
  { to: '/profile',     label: 'Profile',      icon: '○' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f5f3' }}>
      {/* Sidebar */}
      <aside style={{
        width: 220, background: '#fff', borderRight: '0.5px solid #e0e0d8',
        display: 'flex', flexDirection: 'column', padding: '1.5rem 0', position: 'sticky', top: 0, height: '100vh',
      }}>
        <div style={{ padding: '0 1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: 18, fontWeight: 500, color: '#1a1a1a' }}>💰 ExpenseTrack</div>
          <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{user?.name}</div>
        </div>

        <nav style={{ flex: 1, padding: '0 0.75rem' }}>
          {NAV.map(({ to, label, icon }) => (
            <NavLink key={to} to={to} end={to === '/'} style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
              borderRadius: 8, marginBottom: 2, textDecoration: 'none',
              fontSize: 14, fontWeight: 400,
              color: isActive ? '#1a1a1a' : '#888',
              background: isActive ? '#f5f5f3' : 'transparent',
            })}>
              <span style={{ fontSize: 16 }}>{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '0 0.75rem', borderTop: '0.5px solid #e0e0d8', paddingTop: '1rem' }}>
          <button onClick={handleLogout} style={{
            width: '100%', padding: '9px 12px', borderRadius: 8, border: 'none',
            background: 'transparent', color: '#c0392b', cursor: 'pointer', fontSize: 14,
            textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10,
          }}>
            ⬡ Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflow: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
