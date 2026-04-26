'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineCube } from 'react-icons/hi';
import toast from 'react-hot-toast';

interface Cupboard {
  id: number;
  name: string;
  description: string | null;
  places_count: number;
}

export default function CupboardsPage() {
  const [cupboards, setCupboards] = useState<Cupboard[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchCupboards();
  }, []);

  const fetchCupboards = async () => {
    try {
      const res = await api.get('/cupboards');
      setCupboards(res.data);
    } catch {
      toast.error('Failed to load cupboards');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/cupboards/${editingId}`, formData);
        toast.success('Cupboard updated');
      } else {
        await api.post('/cupboards', formData);
        toast.success('Cupboard created');
      }
      setIsModalOpen(false);
      fetchCupboards();
    } catch {
      toast.error('Error saving cupboard');
    }
  };

  const openEdit = (c: Cupboard) => {
    setEditingId(c.id);
    setFormData({ name: c.name, description: c.description || '' });
    setIsModalOpen(true);
  };

  const openCreate = () => {
    setEditingId(null);
    setFormData({ name: '', description: '' });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure? This deletes all places and items inside it!')) return;
    try {
      await api.delete(`/cupboards/${id}`);
      toast.success('Cupboard deleted');
      fetchCupboards();
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div>
      <div className="page-header flex justify-between items-center">
        <div>
          <h2>Cupboards</h2>
          <p>Manage main storage units</p>
        </div>
        {isAdmin && (
          <button onClick={openCreate} className="btn btn-primary">
            <HiOutlinePlus /> Add Cupboard
          </button>
        )}
      </div>

      <div className="grid-3">
        {loading ? (
          <div className="col-span-3 loading-container"><div className="spinner"></div></div>
        ) : cupboards.length > 0 ? (
          cupboards.map(c => (
            <div key={c.id} className="glass-card relative group" style={{ padding: '24px' }}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 text-2xl">
                  <HiOutlineCube />
                </div>
                {isAdmin && (
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(c)} className="btn btn-secondary btn-sm p-2"><HiOutlinePencil /></button>
                    <button onClick={() => handleDelete(c.id)} className="btn btn-danger btn-sm p-2"><HiOutlineTrash /></button>
                  </div>
                )}
              </div>
              <h3 className="text-lg font-bold text-gray-100 mb-1">{c.name}</h3>
              <p className="text-sm text-gray-400 mb-4 h-10 overflow-hidden">{c.description || 'No description provided.'}</p>
              
              <div className="pt-4 border-t border-gray-800/50 flex justify-between items-center text-sm">
                <span className="text-gray-500">Storage Places:</span>
                <span className="badge admin">{c.places_count}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 empty-state">
            <HiOutlineCube className="mx-auto" />
            <h3>No Cupboards Found</h3>
            <p>Add a cupboard to start organizing your inventory.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-title">
              {editingId ? 'Edit Cupboard' : 'New Cupboard'}
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Cupboard Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description (Optional)</label>
                <textarea 
                  className="form-textarea" 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Cupboard</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
