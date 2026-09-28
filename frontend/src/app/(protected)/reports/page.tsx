'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { HiOutlineChartBar, HiOutlineCube, HiOutlineTag, HiOutlineTruck, HiOutlineExclamationCircle, HiOutlineDownload } from 'react-icons/hi';
import toast from 'react-hot-toast';

interface SummaryData {
  total_items: number;
  total_categories: number;
  total_suppliers: number;
  total_stock_units: number;
  low_stock_count: number;
  active_borrowings: number;
  low_stock_items: Array<{ id: number; name: string; quantity: number }>;
  recent_transactions: Array<{
    id: number;
    type: string;
    quantity: number;
    created_at: string;
    item?: { name: string };
    reason?: string;
  }>;
}

export default function ReportsPage() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await api.get('/reports/summary');
      setSummary(res.data);
    } catch {
      toast.error('Failed to load report summary');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!summary || !summary.recent_transactions) return;
    
    let csvContent = "data:text/csv;charset=utf-8,ID,Timestamp,Item,Type,Quantity,Reason\n";
    summary.recent_transactions.forEach(t => {
      csvContent += `${t.id},"${t.created_at}","${t.item?.name || 'N/A'}",${t.type},${t.quantity},"${t.reason || ''}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Inventory_Stock_Report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Report exported to CSV successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <HiOutlineChartBar className="text-emerald-400" /> Reports & Inventory Analytics
          </h1>
          <p className="text-sm text-slate-400">System metrics, stock health summaries, and export capabilities</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition shadow-lg shadow-emerald-500/20"
        >
          <HiOutlineDownload className="w-5 h-5" /> Export Report CSV
        </button>
      </div>

      {loading || !summary ? (
        <div className="text-slate-400">Loading reports summary...</div>
      ) : (
        <>
          {/* Key Metrics Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                <HiOutlineCube className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Total Inventory Items</p>
                <h3 className="text-2xl font-bold text-white">{summary.total_items}</h3>
                <span className="text-xs text-slate-500">{summary.total_stock_units} Units in Stock</span>
              </div>
            </div>

            <div className="p-5 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center gap-4">
              <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20">
                <HiOutlineTag className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Product Categories</p>
                <h3 className="text-2xl font-bold text-white">{summary.total_categories}</h3>
                <span className="text-xs text-slate-500">Active Classifications</span>
              </div>
            </div>

            <div className="p-5 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
                <HiOutlineTruck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Suppliers / Vendors</p>
                <h3 className="text-2xl font-bold text-white">{summary.total_suppliers}</h3>
                <span className="text-xs text-slate-500">Registered Suppliers</span>
              </div>
            </div>

            <div className="p-5 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center gap-4">
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                <HiOutlineExclamationCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Low Stock Alerts</p>
                <h3 className="text-2xl font-bold text-amber-400">{summary.low_stock_count}</h3>
                <span className="text-xs text-slate-500">{summary.active_borrowings} Items Borrowed</span>
              </div>
            </div>
          </div>

          {/* Low Stock Items & Recent Audit Trail */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-5 space-y-4">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <HiOutlineExclamationCircle className="text-amber-400" /> Low Stock Items Requiring Restock
              </h3>
              {summary.low_stock_items.length === 0 ? (
                <p className="text-sm text-slate-400">All inventory stock levels are healthy!</p>
              ) : (
                <div className="space-y-2">
                  {summary.low_stock_items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-slate-950/60 rounded-lg border border-slate-800/80">
                      <span className="text-sm text-white font-medium">{item.name}</span>
                      <span className="px-2.5 py-1 text-xs font-bold bg-amber-500/10 text-amber-400 rounded border border-amber-500/20">
                        {item.quantity} Remaining
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-5 space-y-4">
              <h3 className="font-semibold text-white">Recent Transactions Overview</h3>
              <div className="space-y-2">
                {summary.recent_transactions.slice(0, 5).map((t) => (
                  <div key={t.id} className="flex justify-between items-center p-3 bg-slate-950/60 rounded-lg border border-slate-800/80">
                    <div>
                      <p className="text-sm text-white font-medium">{t.item?.name || `Item #${t.id}`}</p>
                      <span className="text-xs text-slate-500">{new Date(t.created_at).toLocaleDateString()}</span>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      t.type === 'in' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {t.type === 'in' ? `+${t.quantity}` : `-${t.quantity}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
