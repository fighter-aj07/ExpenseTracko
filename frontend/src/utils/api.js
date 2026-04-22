import axios from 'axios';

// Seedha Render ka URL yahan paste kar do
const api = axios.create({
  baseURL: 'https://expensetracko.onrender.com',
});

export const fetchExpenses = (category = '', sort = '') => {
  return api.get('/expenses', {
    params: {
      category: (category && category !== 'All') ? category : undefined,
      sort: sort || undefined
    }
  });
};

export const createExpense = (data) => {
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

export default api;