import React, { useState, useEffect } from 'react';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../utils/categories';
import { useTransactions } from '../context/TransactionContext';
import toast from 'react-hot-toast';

const defaultForm = {
  type: 'expense',
  description: '',
  amount: '',
  category: 'food',
  date: new Date().toISOString().slice(0, 10),
  notes: '',
};

export default function TransactionForm({ editing, onClose }) {
  const { addTransaction, updateTransaction } = useTransactions();
  const [form, setForm] = useState(defaultForm);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (editing) {
      setForm({
        type: editing.type,
        description: editing.description,
        amount: editing.amount,
        category: editing.category,
        date: editing.date?.slice(0, 10) || new Date().toISOString().slice(0, 10),
        notes: editing.notes || '',
      });
    }
  }, [editing]);

  const cats = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleTypeChange = (t) => {
    const defaultCat = t === 'income' ? 'salary' : 'food';
    setForm((f) => ({ ...f, type: t, category: defaultCat }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.description.trim() || !form.amount || !form.date) {
      toast.error('Fill in all required fields');
      return;
    }
    setBusy(true);
    try {
      const payload = { ...form, amount: parseFloat(form.amount) };
      if (editing) {
        await updateTransaction(editing._id, payload);
        toast.success('Transaction updated');
      } else {
        await addTransaction(payload);
        toast.success('Transaction added');
      }
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: '1.5rem', width: '100%', maxWidth: 460, boxShadow: '0 4px 32px rgba(0,0,0,0.12)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: 16, fontWeight: 500 }}>{editing ? 'Edit transaction' : 'Add transaction'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#888' }}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Type toggle */}
          <div style={{ display: 'flex', background: '#f5f5f3', borderRadius: 8, padding: 3, marginBottom: '1rem' }}>
            {['income', 'expense'].map((t) => (
              <button key={t} type="button" onClick={() => handleTypeChange(t)} style={{
                flex: 1, padding: '7px 0', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 500,
                background: form.type === t ? '#fff' : 'transparent',
                color: form.type === t ? (t === 'income' ? '#0F6E56' : '#993C1D') : '#888',
                boxShadow: form.type === t ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s',
              }}>
                {t === 'income' ? '↓ Income' : '↑ Expense'}
              </button>
            ))}
          </div>

          <label style={lbl}>Description *</label>
          <input style={inp} placeholder="e.g. Monthly salary" value={form.description} onChange={(e) => set('description', e.target.value)} required />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={lbl}>Amount (₹) *</label>
              <input style={inp} type="number" min="0.01" step="0.01" placeholder="0.00" value={form.amount} onChange={(e) => set('amount', e.target.value)} required />
            </div>
            <div>
              <label style={lbl}>Date *</label>
              <input style={inp} type="date" value={form.date} onChange={(e) => set('date', e.target.value)} required />
            </div>
          </div>

          <label style={lbl}>Category</label>
          <select style={inp} value={form.category} onChange={(e) => set('category', e.target.value)}>
            {cats.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
          </select>

          <label style={lbl}>Notes (optional)</label>
          <textarea style={{ ...inp, resize: 'vertical', minHeight: 56 }} placeholder="Any extra details…" value={form.notes} onChange={(e) => set('notes', e.target.value)} />

          <button type="submit" disabled={busy} style={{
            width: '100%', padding: '10px', marginTop: 4,
            background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 8,
            fontSize: 14, fontWeight: 500, cursor: busy ? 'not-allowed' : 'pointer', opacity: busy ? 0.7 : 1,
          }}>
            {busy ? 'Saving…' : (editing ? 'Update transaction' : 'Add transaction')}
          </button>
        </form>
      </div>
    </div>
  );
}

const lbl = { display: 'block', fontSize: 12, color: '#888', marginBottom: 4, marginTop: 12 };
const inp = {
  width: '100%', padding: '8px 10px', border: '0.5px solid #ddd', borderRadius: 7,
  fontSize: 14, background: '#fff', color: '#1a1a1a', outline: 'none', fontFamily: 'inherit',
};
