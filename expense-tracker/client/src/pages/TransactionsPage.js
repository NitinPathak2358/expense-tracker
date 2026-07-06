import React, { useEffect, useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { getCategoryById, ALL_CATEGORIES } from '../utils/categories';
import TransactionForm from '../components/TransactionForm';
import toast from 'react-hot-toast';

const fmt = (n) => '₹' + (n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function TransactionsPage() {
  const { transactions, loading, pagination, fetchTransactions, deleteTransaction } = useTransactions();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filters, setFilters] = useState({ type: '', category: '', startDate: '', endDate: '', page: 1 });

  useEffect(() => { load(); }, [filters]);

  const load = () => {
    const params = { ...filters, limit: 15, sort: '-date' };
    Object.keys(params).forEach((k) => { if (!params[k]) delete params[k]; });
    fetchTransactions(params);
  };

  const setF = (k, v) => setFilters((f) => ({ ...f, [k]: v, page: 1 }));

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    try { await deleteTransaction(id); toast.success('Deleted'); } catch { toast.error('Failed'); }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 860 }}>
      {showForm && (
        <TransactionForm
          editing={editing}
          onClose={() => { setShowForm(false); setEditing(null); load(); }}
        />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h1 style={{ fontSize: 20, fontWeight: 500 }}>Transactions</h1>
        <button onClick={() => setShowForm(true)} style={btnPrimary}>+ Add</button>
      </div>

      {/* Filters */}
      <div style={{ background: '#fff', border: '0.5px solid #e8e8e0', borderRadius: 10, padding: '12px 16px', marginBottom: '1rem', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <select style={sel} value={filters.type} onChange={(e) => setF('type', e.target.value)}>
          <option value="">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select style={sel} value={filters.category} onChange={(e) => setF('category', e.target.value)}>
          <option value="">All categories</option>
          {ALL_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <input type="date" style={sel} value={filters.startDate} onChange={(e) => setF('startDate', e.target.value)} />
        <input type="date" style={sel} value={filters.endDate} onChange={(e) => setF('endDate', e.target.value)} />
        {(filters.type || filters.category || filters.startDate || filters.endDate) && (
          <button onClick={() => setFilters({ type: '', category: '', startDate: '', endDate: '', page: 1 })} style={{ padding: '6px 12px', border: '0.5px solid #ddd', borderRadius: 7, background: 'transparent', color: '#888', cursor: 'pointer', fontSize: 12 }}>Clear filters</button>
        )}
        <span style={{ marginLeft: 'auto', fontSize: 12, color: '#aaa' }}>{pagination.total} results</span>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '0.5px solid #e8e8e0', borderRadius: 10, overflow: 'hidden' }}>
        {loading && <div style={{ padding: '2rem', textAlign: 'center', color: '#aaa' }}>Loading…</div>}
        {!loading && transactions.length === 0 && <div style={{ padding: '2rem', textAlign: 'center', color: '#aaa' }}>No transactions found</div>}
        {!loading && transactions.map((t, i) => {
          const cat = getCategoryById(t.category) || {};
          return (
            <div key={t._id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 16px', borderBottom: i < transactions.length - 1 ? '0.5px solid #f0f0ea' : 'none' }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: cat.color || '#f0f0ea', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{cat.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.description}</div>
                <div style={{ fontSize: 12, color: '#aaa', marginTop: 1 }}>{cat.label || t.category}</div>
              </div>
              <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 20, background: t.type === 'income' ? '#E1F5EE' : '#FAECE7', color: t.type === 'income' ? '#0F6E56' : '#993C1D', marginRight: 4 }}>{t.type}</span>
              <div style={{ textAlign: 'right', minWidth: 100 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: t.type === 'income' ? '#1D9E75' : '#D85A30' }}>{t.type === 'income' ? '+' : '-'}{fmt(t.amount)}</div>
                <div style={{ fontSize: 11, color: '#ccc' }}>{new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}</div>
              </div>
              <div style={{ display: 'flex', gap: 5 }}>
                <button onClick={() => { setEditing(t); setShowForm(true); }} style={btnSm}>✎</button>
                <button onClick={() => handleDelete(t._id)} style={{ ...btnSm, color: '#c0392b', borderColor: '#f0b4b4' }}>✕</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: '1rem' }}>
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setFilters((f) => ({ ...f, page: p }))} style={{
              width: 32, height: 32, border: '0.5px solid #ddd', borderRadius: 7,
              background: pagination.page === p ? '#1a1a1a' : '#fff',
              color: pagination.page === p ? '#fff' : '#888',
              cursor: 'pointer', fontSize: 13,
            }}>{p}</button>
          ))}
        </div>
      )}
    </div>
  );
}

const btnPrimary = { background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 14, fontWeight: 500, cursor: 'pointer' };
const btnSm = { padding: '4px 8px', border: '0.5px solid #e0e0d8', borderRadius: 6, background: 'transparent', color: '#888', cursor: 'pointer', fontSize: 12 };
const sel = { padding: '6px 10px', border: '0.5px solid #ddd', borderRadius: 7, background: '#fff', color: '#1a1a1a', fontSize: 13, outline: 'none' };
