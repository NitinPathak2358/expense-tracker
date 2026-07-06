import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', currency: user?.currency || 'INR', monthlyBudget: user?.monthlyBudget || 0 });
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await updateProfile(form);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Update failed');
    } finally {
      setBusy(false);
    }
  };

  const initials = user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div style={{ padding: '2rem', maxWidth: 480 }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, marginBottom: '1.5rem' }}>Profile</h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: '1.5rem', padding: '1rem 1.25rem', background: '#fff', border: '0.5px solid #e8e8e0', borderRadius: 12 }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#E1F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 500, color: '#0F6E56' }}>{initials}</div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 500, color: '#1a1a1a' }}>{user?.name}</div>
          <div style={{ fontSize: 13, color: '#888' }}>{user?.email}</div>
          <div style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>Member since {new Date(user?.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</div>
        </div>
      </div>

      <div style={{ background: '#fff', border: '0.5px solid #e8e8e0', borderRadius: 12, padding: '1.25rem' }}>
        <h2 style={{ fontSize: 15, fontWeight: 500, marginBottom: '1rem', color: '#1a1a1a' }}>Edit details</h2>
        <form onSubmit={handleSubmit}>
          <label style={lbl}>Full name</label>
          <input style={inp} type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />

          <label style={lbl}>Currency</label>
          <select style={inp} value={form.currency} onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}>
            <option value="INR">₹ Indian Rupee (INR)</option>
            <option value="USD">$ US Dollar (USD)</option>
            <option value="EUR">€ Euro (EUR)</option>
            <option value="GBP">£ British Pound (GBP)</option>
          </select>

          <label style={lbl}>Monthly budget (₹)</label>
          <input style={inp} type="number" min="0" step="100" value={form.monthlyBudget} onChange={(e) => setForm((f) => ({ ...f, monthlyBudget: parseFloat(e.target.value) }))} />

          <button type="submit" disabled={busy} style={{ marginTop: '1rem', padding: '9px 20px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: busy ? 'not-allowed' : 'pointer', opacity: busy ? 0.7 : 1 }}>
            {busy ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </div>

      <div style={{ marginTop: '1rem', background: '#fff', border: '0.5px solid #ffd0d0', borderRadius: 12, padding: '1.25rem' }}>
        <h2 style={{ fontSize: 15, fontWeight: 500, color: '#c0392b', marginBottom: 8 }}>Danger zone</h2>
        <p style={{ fontSize: 13, color: '#888', marginBottom: 12 }}>Sign out from this device.</p>
        <button onClick={logout} style={{ padding: '8px 16px', border: '0.5px solid #f0b4b4', borderRadius: 8, background: 'transparent', color: '#c0392b', cursor: 'pointer', fontSize: 13 }}>Sign out</button>
      </div>
    </div>
  );
}

const lbl = { display: 'block', fontSize: 12, color: '#888', marginBottom: 5, marginTop: 12 };
const inp = { width: '100%', padding: '8px 10px', border: '0.5px solid #ddd', borderRadius: 7, fontSize: 14, color: '#1a1a1a', outline: 'none', fontFamily: 'inherit', background: '#fff', boxSizing: 'border-box' };
