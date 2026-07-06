import React, { useEffect, useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { useAuth } from '../context/AuthContext';
import { getCategoryById } from '../utils/categories';
import TransactionForm from '../components/TransactionForm';
import toast from 'react-hot-toast';
import api from '../utils/api';

const fmt = (n) => '₹' + (n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function DashboardPage() {
  const { user } = useAuth();
  const { transactions, summary, fetchTransactions, fetchSummary, deleteTransaction } = useTransactions();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [breakdown, setBreakdown] = useState([]);

  useEffect(() => {
    const now = new Date();
    const startDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
    fetchTransactions({ limit: 8, sort: '-date' });
    fetchSummary({ startDate });
    api.get('/stats/categories', { params: { type: 'expense', startDate } })
      .then(({ data }) => setBreakdown(data.data.slice(0, 5)));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    try {
      await deleteTransaction(id);
      fetchSummary();
      toast.success('Deleted');
    } catch { toast.error('Delete failed'); }
  };

  const maxBreakdown = breakdown[0]?.total || 1;

  return (
    <div style={{ padding: '2rem', maxWidth: 900 }}>
      {showForm && (
        <TransactionForm
          editing={editing}
          onClose={() => { setShowForm(false); setEditing(null); fetchSummary(); fetchTransactions({ limit: 8 }); }}
        />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 500, color: '#1a1a1a' }}>Good morning, {user?.name?.split(' ')[0]} 👋</h1>
          <p style={{ fontSize: 13, color: '#888', marginTop: 3 }}>Here's your financial snapshot for this month.</p>
        </div>
        <button onClick={() => setShowForm(true)} style={btnPrimary}>+ Add transaction</button>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 10, marginBottom: '1.5rem' }}>
        <MetricCard label="Balance" value={fmt(summary.balance)} color={summary.balance >= 0 ? '#1D9E75' : '#D85A30'} />
        <MetricCard label="↓ Total income" value={fmt(summary.income)} color="#1D9E75" />
        <MetricCard label="↑ Total expenses" value={fmt(summary.expense)} color="#D85A30" />
        <MetricCard label="Transactions" value={summary.transactionCount || 0} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1rem' }}>
        {/* Recent transactions */}
        <div style={card}>
          <div style={cardHead}><span style={cardTitle}>Recent transactions</span></div>
          {transactions.length === 0 && <div style={{ padding: '2rem', textAlign: 'center', color: '#aaa', fontSize: 14 }}>No transactions yet</div>}
          {transactions.map((t) => {
            const cat = getCategoryById(t.category) || {};
            return (
              <div key={t._id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderBottom: '0.5px solid #f0f0ea' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>{cat.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.description}</div>
                  <div style={{ fontSize: 12, color: '#aaa' }}>{cat.label} · {new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: t.type === 'income' ? '#1D9E75' : '#D85A30' }}>{t.type === 'income' ? '+' : '-'}{fmt(t.amount)}</div>
                </div>
                <button onClick={() => { setEditing(t); setShowForm(true); }} style={btnSmall}>✎</button>
                <button onClick={() => handleDelete(t._id)} style={{ ...btnSmall, color: '#c0392b', borderColor: '#f0b4b4' }}>✕</button>
              </div>
            );
          })}
        </div>

        {/* Category breakdown */}
        <div style={card}>
          <div style={cardHead}><span style={cardTitle}>Spending by category</span></div>
          <div style={{ padding: '1rem' }}>
            {breakdown.length === 0 && <div style={{ textAlign: 'center', color: '#aaa', fontSize: 13, padding: '1rem 0' }}>No expenses yet</div>}
            {breakdown.map((b) => {
              const cat = getCategoryById(b.category) || { label: b.category, textColor: '#888', color: '#eee' };
              return (
                <div key={b.category} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: '#1a1a1a' }}>{cat.label}</span>
                    <span style={{ color: '#888' }}>₹{Math.round(b.total).toLocaleString('en-IN')} · {b.percentage}%</span>
                  </div>
                  <div style={{ height: 6, background: '#f0f0ea', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(b.total / maxBreakdown) * 100}%`, background: cat.textColor, borderRadius: 3, opacity: 0.75, transition: 'width 0.4s' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, color }) {
  return (
    <div style={{ background: '#f5f5f3', borderRadius: 8, padding: '14px 16px' }}>
      <div style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 500, color: color || '#1a1a1a' }}>{value}</div>
    </div>
  );
}

const card = { background: '#fff', border: '0.5px solid #e8e8e0', borderRadius: 12, overflow: 'hidden' };
const cardHead = { padding: '12px 16px', borderBottom: '0.5px solid #f0f0ea', display: 'flex', alignItems: 'center', justifyContent: 'space-between' };
const cardTitle = { fontSize: 14, fontWeight: 500, color: '#1a1a1a' };
const btnPrimary = { background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 14, fontWeight: 500, cursor: 'pointer' };
const btnSmall = { padding: '4px 8px', border: '0.5px solid #e0e0d8', borderRadius: 6, background: 'transparent', color: '#888', cursor: 'pointer', fontSize: 12 };
