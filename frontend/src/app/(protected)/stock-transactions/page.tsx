'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { HiOutlineRefresh, HiOutlinePlusCircle, HiOutlineMinusCircle, HiOutlineAdjustments } from 'react-icons/hi';
import toast from 'react-hot-toast';

interface Item {
  id: number;
  name: string;
  quantity: number;
}

interface StockTransaction {
  id: number;
  item_id: number;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string | null;
  created_at: string;
  item?: Item;
  user?: { name: string };
}

export default function StockTransactionsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [transactions, setTransactions] = useState<StockTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    item_id: '',
    type: 'in',
    quantity: 1,
    reason: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [itemsRes, transRes] = await Promise.all([
        api.get('/items'),
        api.get('/stock-transactions'),
      ]);
      setItems(itemsRes.data);
      setTransactions(transRes.data);
    } catch {
      toast.error('Failed to load transaction data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.item_id) {
      toast.error('Please select an item');
      return;
    }

    try {
      await api.post('/stock-transactions', {
        item_id: Number(formData.item_id),
        type: formData.type,
        quantity: Number(formData.quantity),
        reason: formData.reason,
      });
      toast.success('Stock transaction recorded and database updated!');
      setIsModalOpen(false);
      setFormData({ item_id: '', type: 'in', quantity: 1, reason: '' });
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error recording stock transaction');
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'in':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
            <HiOutlinePlusCircle className="w-3.5 h-3.5" /> Stock In
          </span>
        );
      case 'out':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-red-500/10 text-red-400 rounded-full border border-red-500/20">
            <HiOutlineMinusCircle className="w-3.5 h-3.5" /> Stock Out
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/20">
            <HiOutlineAdjustments className="w-3.5 h-3.5" /> Adjustment
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <HiOutlineRefresh className="text-emerald-400" /> Stock Movements & Transactions
          </h1>
          <p className="text-sm text-slate-400">Record inventory restocks, sales deductions, and stock count adjustments</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition shadow-lg shadow-emerald-500/20"
        >
          <HiOutlinePlusCircle className="w-5 h-5" /> Record Stock Movement
        </button>
      </div>

      {loading ? (
        <div className="text-slate-400">Loading stock movements...</div>
      ) : (
        <div className="bg-slate-900/60 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center">
            <h3 className="font-semibold text-white">Audit History Log</h3>
            <span className="text-xs text-slate-400">{transactions.length} Total Records</span>
          </div>
          {transactions.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              No stock movements recorded yet. Use "Record Stock Movement" above.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950/80 text-xs uppercase text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Timestamp</th>
                    <th className="px-4 py-3">Item</th>
                    <th className="px-4 py-3">Movement Type</th>
                    <th className="px-4 py-3">Quantity</th>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Reason / Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-800/40">
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-400">
                        {new Date(t.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-medium text-white">{t.item?.name || `Item #${t.item_id}`}</td>
                      <td className="px-4 py-3">{getTypeBadge(t.type)}</td>
                      <td className="px-4 py-3 font-mono font-bold text-white">
                        {t.type === 'in' ? `+${t.quantity}` : t.type === 'out' ? `-${t.quantity}` : `${t.quantity}`}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400">{t.user?.name || 'System Admin'}</td>
                      <td className="px-4 py-3 text-xs text-slate-400">{t.reason || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4">Record Stock Movement</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Select Inventory Item</label>
                <select
                  required
                  value={formData.item_id}
                  onChange={(e) => setFormData({ ...formData, item_id: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="">-- Choose Item --</option>
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} (Current Stock: {item.quantity})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Transaction Type</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'in' })}
                    className={`py-2 text-xs font-semibold rounded-lg border transition ${
                      formData.type === 'in'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    + Stock In
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'out' })}
                    className={`py-2 text-xs font-semibold rounded-lg border transition ${
                      formData.type === 'out'
                        ? 'bg-red-500/20 border-red-500 text-red-400'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    - Stock Out
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'adjustment' })}
                    className={`py-2 text-xs font-semibold rounded-lg border transition ${
                      formData.type === 'adjustment'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    Adjustment
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Reason / Notes</label>
                <input
                  type="text"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Restocked from Apex Tech, Customer Return, Stock count correction"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600"
                >
                  Submit & Save to DB
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
