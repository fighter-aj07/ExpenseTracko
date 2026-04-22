import React, { useState, useEffect } from 'react';
import { fetchExpenses, createExpense, formatCurrency } from './utils/api';
import { PlusCircle, Loader2, IndianRupee } from 'lucide-react';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState('');

  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const loadData = async () => {
    try {
      const res = await fetchExpenses(filter);
      setExpenses(res.data.expenses || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [filter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createExpense(formData);
      setFormData({ ...formData, amount: '', description: '' });
      await loadData();
    } catch (err) {
      alert("Backend error! Check if server is running on 8000");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10 font-sans">
      <div className="max-w-3xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">ExpenseTracko</h1>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase">Total Spent</p>
            <p className="text-2xl font-black text-blue-600">{formatCurrency(total)}</p>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            type="number" step="0.01" placeholder="Amount (₹)" required
            className="p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
          />
          {/* Filter Dropdown - Isse UI mein add karo jahan Recent Entries likha hai */}
          <select 
            className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-sm outline-none"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Rent">Rent</option>
            <option value="Shopping">Shopping</option>
          </select>
          <input 
            type="text" placeholder="Description" required
            className="p-3 bg-gray-50 rounded-xl md:col-span-2 outline-none"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
          <button 
            type="submit" disabled={submitting}
            className="md:col-span-2 bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700 transition flex justify-center items-center"
          >
            {submitting ? <Loader2 className="animate-spin" /> : <PlusCircle className="mr-2" />} Save Expense
          </button>
        </form>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? <div className="p-10 text-center">Loading...</div> : (
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-xs font-bold text-gray-400">ITEM</th>
                  <th className="p-4 text-xs font-bold text-gray-400 text-right">AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(exp => (
                  <tr key={exp.id} className="border-t border-gray-50">
                    <td className="p-4 font-medium text-gray-700">{exp.description}</td>
                    <td className="p-4 text-right font-bold text-gray-900">{formatCurrency(exp.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
