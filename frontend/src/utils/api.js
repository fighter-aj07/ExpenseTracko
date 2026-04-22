import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});

export const fetchExpenses = (category = '', sort = '') => {
  return api.get('/expenses', {
    params: {
      category: category || undefined,
      sort: sort || undefined
    }
  });
};

export const createExpense = (data) => {
  // Safe UUID generator
  const uuid = typeof crypto.randomUUID === 'function' 
    ? crypto.randomUUID() 
    : Math.random().toString(36).substring(2) + Date.now().toString(36);

  const payload = {
    ...data,
    amount: parseFloat(data.amount),
    idempotency_key: uuid,
  };
  return api.post('/expenses', payload);
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount || 0);
};
