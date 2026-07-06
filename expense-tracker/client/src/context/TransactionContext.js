import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../utils/api';

const TransactionContext = createContext(null);

export function TransactionProvider({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0, transactionCount: 0 });
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const fetchTransactions = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await api.get('/transactions', { params });
      setTransactions(data.data);
      setPagination({ page: data.page, totalPages: data.totalPages, total: data.total });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSummary = useCallback(async (params = {}) => {
    const { data } = await api.get('/stats/summary', { params });
    setSummary(data.data);
  }, []);

  const addTransaction = useCallback(async (payload) => {
    const { data } = await api.post('/transactions', payload);
    setTransactions((prev) => [data.data, ...prev]);
    return data.data;
  }, []);

  const updateTransaction = useCallback(async (id, payload) => {
    const { data } = await api.put(`/transactions/${id}`, payload);
    setTransactions((prev) => prev.map((t) => (t._id === id ? data.data : t)));
    return data.data;
  }, []);

  const deleteTransaction = useCallback(async (id) => {
    await api.delete(`/transactions/${id}`);
    setTransactions((prev) => prev.filter((t) => t._id !== id));
  }, []);

  return (
    <TransactionContext.Provider value={{
      transactions, summary, loading, pagination,
      fetchTransactions, fetchSummary, addTransaction, updateTransaction, deleteTransaction,
    }}>
      {children}
    </TransactionContext.Provider>
  );
}

export const useTransactions = () => useContext(TransactionContext);
