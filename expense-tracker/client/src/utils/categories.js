export const INCOME_CATEGORIES = [
  { id: 'salary',     label: 'Salary',      icon: '💼', color: '#E1F5EE', textColor: '#0F6E56' },
  { id: 'freelance',  label: 'Freelance',   icon: '💻', color: '#E6F1FB', textColor: '#185FA5' },
  { id: 'investment', label: 'Investment',  icon: '📈', color: '#EAF3DE', textColor: '#3B6D11' },
  { id: 'rental',     label: 'Rental',      icon: '🏠', color: '#FBEAF0', textColor: '#993556' },
  { id: 'gift',       label: 'Gift',        icon: '🎁', color: '#EEEDFE', textColor: '#534AB7' },
  { id: 'other_income', label: 'Other',     icon: '➕', color: '#F1EFE8', textColor: '#5F5E5A' },
];

export const EXPENSE_CATEGORIES = [
  { id: 'food',          label: 'Food',          icon: '🍽️', color: '#FAECE7', textColor: '#993C1D' },
  { id: 'transport',     label: 'Transport',     icon: '🚗', color: '#FAEEDA', textColor: '#854F0B' },
  { id: 'housing',       label: 'Housing',       icon: '🏡', color: '#FBEAF0', textColor: '#993556' },
  { id: 'health',        label: 'Health',        icon: '❤️', color: '#FCEBEB', textColor: '#A32D2D' },
  { id: 'entertainment', label: 'Entertainment', icon: '🎮', color: '#EEEDFE', textColor: '#534AB7' },
  { id: 'shopping',      label: 'Shopping',      icon: '🛍️', color: '#E6F1FB', textColor: '#185FA5' },
  { id: 'utilities',     label: 'Utilities',     icon: '⚡', color: '#EAF3DE', textColor: '#3B6D11' },
  { id: 'education',     label: 'Education',     icon: '📚', color: '#F1EFE8', textColor: '#5F5E5A' },
  { id: 'travel',        label: 'Travel',        icon: '✈️', color: '#FAEEDA', textColor: '#854F0B' },
  { id: 'other_expense', label: 'Other',         icon: '📌', color: '#F1EFE8', textColor: '#5F5E5A' },
];

export const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

export const getCategoryById = (id) => ALL_CATEGORIES.find((c) => c.id === id);
