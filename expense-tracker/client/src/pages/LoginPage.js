import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

function AuthLayout({ title, subtitle, children }) {
  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f3', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: '#fff', border: '0.5px solid #e8e8e0', borderRadius: 14, padding: '2rem', width: '100%', maxWidth: 380 }}>
        <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>💰</div>
          <h1 style={{ fontSize: 20, fontWeight: 500, color: '#1a1a1a' }}>{title}</h1>
          <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout title="Sign in" subtitle="Track your money, reach your goals">
      <form onSubmit={handleSubmit}>
        <label style={lbl}>Email</label>
        <input style={inp} type="email" placeholder="you@email.com" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
        <label style={lbl}>Password</label>
        <input style={inp} type="password" placeholder="••••••••" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} required />
        <button type="submit" disabled={busy} style={btn}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
      <p style={{ textAlign: 'center', fontSize: 13, color: '#888', marginTop: '1rem' }}>
        No account? <Link to="/register" style={{ color: '#1a1a1a' }}>Create one</Link>
      </p>
    </AuthLayout>
  );
}

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout title="Create account" subtitle="Start tracking your finances today">
      <form onSubmit={handleSubmit}>
        <label style={lbl}>Full name</label>
        <input style={inp} type="text" placeholder="Ravi Kumar" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
        <label style={lbl}>Email</label>
        <input style={inp} type="email" placeholder="you@email.com" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
        <label style={lbl}>Password</label>
        <input style={inp} type="password" placeholder="Min. 6 characters" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} minLength={6} required />
        <button type="submit" disabled={busy} style={btn}>{busy ? 'Creating account…' : 'Create account'}</button>
      </form>
      <p style={{ textAlign: 'center', fontSize: 13, color: '#888', marginTop: '1rem' }}>
        Already have an account? <Link to="/login" style={{ color: '#1a1a1a' }}>Sign in</Link>
      </p>
    </AuthLayout>
  );
}

const lbl = { display: 'block', fontSize: 12, color: '#888', marginBottom: 5, marginTop: 14 };
const inp = { width: '100%', padding: '9px 11px', border: '0.5px solid #ddd', borderRadius: 8, fontSize: 14, color: '#1a1a1a', outline: 'none', fontFamily: 'inherit', background: '#fff', boxSizing: 'border-box' };
const btn = { width: '100%', marginTop: 18, padding: 11, background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer' };

export default LoginPage;
