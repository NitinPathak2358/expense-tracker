import React, { useEffect, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
import api from '../utils/api';
import { getCategoryById } from '../utils/categories';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const fmt = (n) => '₹' + Math.round(n || 0).toLocaleString('en-IN');

export default function StatsPage() {
  const [monthly, setMonthly] = useState([]);
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/stats/monthly', { params: { months: 6 } }),
      api.get('/stats/categories', { params: { type: 'expense' } }),
    ]).then(([m, c]) => {
      setMonthly(m.data.data);
      setCats(c.data.data.slice(0, 8));
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center', color: '#aaa' }}>Loading analytics…</div>;

  const monthLabels = monthly.map((m) => {
    const [y, mo] = m.month.split('-');
    return new Date(y, mo - 1).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
  });

  const barData = {
    labels: monthLabels,
    datasets: [
      { label: 'Income', data: monthly.map((m) => m.income || 0), backgroundColor: '#5DCAA5', borderRadius: 4 },
      { label: 'Expense', data: monthly.map((m) => m.expense || 0), backgroundColor: '#F0997B', borderRadius: 4 },
    ],
  };

  const catColors = cats.map((c) => getCategoryById(c.category)?.textColor || '#888');
  const doughnutData = {
    labels: cats.map((c) => getCategoryById(c.category)?.label || c.category),
    datasets: [{ data: cats.map((c) => c.total), backgroundColor: catColors, borderWidth: 0 }],
  };

  const barOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'top', labels: { boxWidth: 10, font: { size: 12 } } } },
    scales: { x: { grid: { display: false } }, y: { grid: { color: '#f0f0ea' }, ticks: { callback: (v) => fmt(v) } } },
  };

  const doughnutOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'right', labels: { boxWidth: 12, font: { size: 12 }, padding: 16 } } },
  };

  const totalIncome = monthly.reduce((s, m) => s + (m.income || 0), 0);
  const totalExpense = monthly.reduce((s, m) => s + (m.expense || 0), 0);

  return (
    <div style={{ padding: '2rem', maxWidth: 900 }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, marginBottom: '1.5rem' }}>Analytics</h1>

      {/* Summary pills */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: '1.5rem' }}>
        <div style={metric}>
          <div style={metricLabel}>6-month income</div>
          <div style={{ ...metricVal, color: '#1D9E75' }}>{fmt(totalIncome)}</div>
        </div>
        <div style={metric}>
          <div style={metricLabel}>6-month expenses</div>
          <div style={{ ...metricVal, color: '#D85A30' }}>{fmt(totalExpense)}</div>
        </div>
        <div style={metric}>
          <div style={metricLabel}>6-month savings</div>
          <div style={{ ...metricVal, color: totalIncome - totalExpense >= 0 ? '#1D9E75' : '#D85A30' }}>{fmt(totalIncome - totalExpense)}</div>
        </div>
      </div>

      {/* Bar chart */}
      <div style={{ background: '#fff', border: '0.5px solid #e8e8e0', borderRadius: 12, padding: '1rem', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: 14, fontWeight: 500, marginBottom: '1rem', color: '#1a1a1a' }}>Income vs expenses — last 6 months</h2>
        <div style={{ position: 'relative', height: 260 }}>
          <Bar
            data={barData}
            options={barOptions}
            aria-label="Bar chart comparing monthly income and expenses over the last 6 months"
          />
        </div>
      </div>

      {/* Doughnut chart */}
      <div style={{ background: '#fff', border: '0.5px solid #e8e8e0', borderRadius: 12, padding: '1rem' }}>
        <h2 style={{ fontSize: 14, fontWeight: 500, marginBottom: '1rem', color: '#1a1a1a' }}>Expense breakdown by category</h2>
        {cats.length === 0
          ? <div style={{ textAlign: 'center', color: '#aaa', padding: '2rem', fontSize: 14 }}>No expense data yet</div>
          : <div style={{ position: 'relative', height: 280 }}>
              <Doughnut
                data={doughnutData}
                options={doughnutOptions}
                aria-label="Doughnut chart showing expense distribution by category"
              />
            </div>
        }
      </div>
    </div>
  );
}

const metric = { background: '#f5f5f3', borderRadius: 8, padding: '14px 16px' };
const metricLabel = { fontSize: 12, color: '#888', marginBottom: 6 };
const metricVal = { fontSize: 20, fontWeight: 500 };
