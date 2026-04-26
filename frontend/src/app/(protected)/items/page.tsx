'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineSearch } from 'react-icons/hi';
import toast from 'react-hot-toast';

interface Item {
  id: number;
  name: string;
  code: string;
  quantity: number;
  status: string;
  place?: {
    id: number;
    name: string;
    cupboard?: {
      id: number;
      name: string;
    }
  }
}
interface Place {
  id: number;
  name: string;
  cupboard?: {
    name: string;
  };
}

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { isAdmin } = useAuth();
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', code: '', quantity: 1, place_id: '' });

  useEffect(() => {
    fetchItems();
    if (isAdmin) fetchPlaces();
  }, [search, isAdmin]);

  const fetchItems = async () => {
    try {
      const res = await api.get(`/items${search ? `?search=${search}` : ''}`);
      setItems(res.data);
    } catch (e) {
      toast.error('Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  const fetchPlaces = async () => {
    try {
      const res = await api.get('/places');
      setPlaces(res.data);
    } catch (e) {
      console.error('Failed to fetch places');
    }
  };

  const deleteItem = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await api.delete(`/items/${id}`);
      toast.success('Item deleted');
      fetchItems();
    } catch (e) {
      toast.error('Failed to delete item');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.place_id) return toast.error('Please select a storage place');
      await api.post('/items', formData);
      toast.success('Item added successfully');
      setIsModalOpen(false);
      fetchItems();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add item');
    }
  };

  const openAddModal = () => {
    setFormData({ name: '', code: '', quantity: 1, place_id: '' });
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="page-header flex justify-between items-center">
        <div>
          <h2>Inventory Items</h2>
          <p>Manage all tools and components</p>
        </div>
        {isAdmin && (
          <button onClick={openAddModal} className="btn btn-primary">
            <HiOutlinePlus /> Add Item
          </button>
        )}
      </div>

      <div className="toolbar">
        <div className="search-wrapper">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            className="search-input"
            placeholder="Search items by name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="glass-card table-container">
        {loading ? (
          <div className="loading-container"><div className="spinner"></div></div>
        ) : items.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Location</th>
                <th>Quantity</th>
                <th>Status</th>
                {isAdmin && <th className="text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td className="font-mono text-sm text-gray-400">{item.code}</td>
                  <td className="font-semibold text-gray-200">{item.name}</td>
                  <td className="text-gray-400 text-sm">
                    {item.place?.cupboard?.name} → {item.place?.name}
                  </td>
                  <td>
                    <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                      {item.quantity}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${item.status}`}>{item.status.replace('-', ' ')}</span>
                  </td>
                  {isAdmin && (
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => deleteItem(item.id)} className="btn btn-danger btn-sm p-2"><HiOutlineTrash /></button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <p>No items found</p>
          </div>
        )}
      </div>

      {/* Add Item Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-title">
              Add New Item
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Item Name</label>
                <input 
                  type="text" className="form-input" required 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. MacBook Pro"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Item Code (SKU)</label>
                  <input 
                    type="text" className="form-input" required 
                    value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})}
                    placeholder="e.g. MAC-001"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Initial Quantity</label>
                  <input 
                    type="number" className="form-input" required min="1"
                    value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Storage Location</label>
                <select 
                  className="form-select bg-slate-900 border border-slate-700 text-white rounded-lg block w-full outline-none p-3"
                  required
                  value={formData.place_id} onChange={e => setFormData({...formData, place_id: e.target.value})}
                >
                  <option value="">-- Select a Storage Place --</option>
                  {places.map(place => (
                    <option key={place.id} value={place.id}>
                      {place.cupboard?.name} → {place.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Item</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
