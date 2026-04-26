'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { HiOutlineSwitchHorizontal, HiOutlineCheckCircle } from 'react-icons/hi';
import toast from 'react-hot-toast';

interface BorrowingLog {
  id: number;
  borrower_name: string;
  borrower_contact: string | null;
  quantity_borrowed: number;
  borrow_date: string;
  expected_return_date: string | null;
  status: string;
  item: {
    name: string;
    code: string;
    place: {
      name: string;
      cupboard: { name: string }
    }
  };
  user: {
    name: string;
  }
}

interface Item {
  id: number;
  name: string;
  quantity: number;
}

export default function BorrowingsPage() {
  const [logs, setLogs] = useState<BorrowingLog[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    item_id: '',
    borrower_name: '',
    borrower_contact: '',
    quantity_borrowed: 1,
    expected_return_date: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [logsRes, itemsRes] = await Promise.all([
        api.get('/borrowings'),
        api.get('/items') // specifically fetched to populate the list of items to borrow
      ]);
      setLogs(logsRes.data);
      setItems(itemsRes.data);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/borrowings', formData);
      toast.success('Item borrowed successfully');
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error processing borrowing');
    }
  };

  const handleReturn = async (id: number) => {
    if (!confirm('Mark this item as returned?')) return;
    try {
      await api.patch(`/borrowings/${id}/return`);
      toast.success('Item returned successfully');
      fetchData();
    } catch {
      toast.error('Failed to return item');
    }
  };

  return (
    <div>
      <div className="page-header flex justify-between items-center">
        <div>
          <h2>Borrowing System</h2>
          <p>Track tools given to third parties</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <HiOutlineSwitchHorizontal /> New Borrowing
        </button>
      </div>

      <div className="glass-card table-container">
        {loading ? (
          <div className="loading-container"><div className="spinner"></div></div>
        ) : logs.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Item Details</th>
                <th>Borrower Info</th>
                <th>Dates</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id}>
                  <td>
                    <div className="font-semibold text-gray-200">{log.quantity_borrowed}x {log.item?.name}</div>
                    <div className="text-sm text-gray-500 font-mono">{log.item?.code}</div>
                  </td>
                  <td>
                    <div className="font-semibold text-gray-200">{log.borrower_name}</div>
                    <div className="text-sm text-gray-500">{log.borrower_contact || 'No contact'}</div>
                  </td>
                  <td className="text-sm text-gray-400">
                    <div>Out: {new Date(log.borrow_date).toLocaleDateString()}</div>
                    {log.expected_return_date && (
                      <div className="text-indigo-400">Due: {new Date(log.expected_return_date).toLocaleDateString()}</div>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${log.status}`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="text-right">
                    {log.status === 'borrowed' ? (
                      <button 
                        onClick={() => handleReturn(log.id)}
                        className="btn btn-success btn-sm"
                      >
                        <HiOutlineCheckCircle /> Mark Returned
                      </button>
                    ) : (
                      <span className="text-gray-500 text-sm">Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <HiOutlineSwitchHorizontal className="mx-auto" />
            <h3>No Active Borrowings</h3>
            <p>All items are currently in store.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-title">
              New Borrowing Record
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleBorrow}>
              <div className="form-group">
                <label className="form-label">Select Item</label>
                <select 
                  className="form-select bg-gray-900 border border-gray-700 text-white rounded-lg block w-full outline-none p-3"
                  required
                  value={formData.item_id}
                  onChange={e => setFormData({...formData, item_id: e.target.value})}
                >
                  <option value="" disabled>Choose an item to borrow...</option>
                  {items.map(item => (
                    <option key={item.id} value={item.id} disabled={item.quantity === 0}>
                      {item.name} ({item.quantity} available)
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Borrower Name</label>
                  <input 
                    type="text" className="form-input" required 
                    value={formData.borrower_name} onChange={e => setFormData({...formData, borrower_name: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Details</label>
                  <input 
                    type="text" className="form-input" 
                    value={formData.borrower_contact} onChange={e => setFormData({...formData, borrower_contact: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Quantity</label>
                  <input 
                    type="number" min="1" className="form-input" required 
                    value={formData.quantity_borrowed} onChange={e => setFormData({...formData, quantity_borrowed: parseInt(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Expected Return Date</label>
                  <input 
                    type="date" className="form-input" 
                    value={formData.expected_return_date} onChange={e => setFormData({...formData, expected_return_date: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="modal-actions mt-6">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Process Borrowing</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
