'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineLocationMarker } from 'react-icons/hi';
import toast from 'react-hot-toast';

interface Place {
  id: number;
  cupboard_id: number;
  name: string;
  description: string | null;
  items_count: number;
  cupboard?: {
    id: number;
    name: string;
  };
}

interface Cupboard {
  id: number;
  name: string;
}

export default function PlacesPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [cupboards, setCupboards] = useState<Cupboard[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ cupboard_id: '', name: '', description: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [placesRes, cupboardsRes] = await Promise.all([
        api.get('/places'),
        api.get('/cupboards')
      ]);
      setPlaces(placesRes.data);
      setCupboards(cupboardsRes.data);
    } catch {
      toast.error('Failed to load storage places');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/places/${editingId}`, formData);
        toast.success('Place updated');
      } else {
        await api.post('/places', formData);
        toast.success('Place created');
      }
      setIsModalOpen(false);
      fetchData();
    } catch {
      toast.error('Error saving storage place');
    }
  };

  const openEdit = (p: Place) => {
    setEditingId(p.id);
    setFormData({ cupboard_id: p.cupboard_id.toString(), name: p.name, description: p.description || '' });
    setIsModalOpen(true);
  };

  const openCreate = () => {
    setEditingId(null);
    setFormData({ cupboard_id: cupboards[0]?.id.toString() || '', name: '', description: '' });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure? This deletes everything inside this place!')) return;
    try {
      await api.delete(`/places/${id}`);
      toast.success('Place deleted');
      fetchData();
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div>
      <div className="page-header flex justify-between items-center">
        <div>
          <h2>Storage Places</h2>
          <p>Manage sub-locations inside cupboards</p>
        </div>
        {isAdmin && cupboards.length > 0 && (
          <button onClick={openCreate} className="btn btn-primary">
            <HiOutlinePlus /> Add Place
          </button>
        )}
      </div>

      <div className="grid-3">
        {loading ? (
          <div className="col-span-3 loading-container"><div className="spinner"></div></div>
        ) : places.length > 0 ? (
          places.map(p => (
            <div key={p.id} className="glass-card relative group" style={{ padding: '24px' }}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 text-2xl">
                  <HiOutlineLocationMarker />
                </div>
                {isAdmin && (
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(p)} className="btn btn-secondary btn-sm p-2"><HiOutlinePencil /></button>
                    <button onClick={() => handleDelete(p.id)} className="btn btn-danger btn-sm p-2"><HiOutlineTrash /></button>
                  </div>
                )}
              </div>
              <h3 className="text-lg font-bold text-gray-100 mb-1">{p.name}</h3>
              <p className="text-sm font-semibold text-indigo-400 mb-2">in {p.cupboard?.name}</p>
              <p className="text-sm text-gray-400 mb-4 h-10 overflow-hidden">{p.description || 'No description provided.'}</p>
              
              <div className="pt-4 border-t border-gray-800/50 flex justify-between items-center text-sm">
                <span className="text-gray-500">Stored Items:</span>
                <span className="badge" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>{p.items_count}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 empty-state">
            <HiOutlineLocationMarker className="mx-auto" />
            <h3>No Storage Places Found</h3>
            {cupboards.length === 0 ? (
              <p className="text-red-400">Please create a Cupboard first!</p>
            ) : (
              <p>Add a storage place to start organizing.</p>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-title">
              {editingId ? 'Edit Storage Place' : 'New Storage Place'}
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Inside Cupboard</label>
                <select 
                  className="form-select bg-gray-900 border border-gray-700 text-white rounded-lg block w-full outline-none p-3"
                  required
                  value={formData.cupboard_id}
                  onChange={e => setFormData({...formData, cupboard_id: e.target.value})}
                >
                  <option value="" disabled>Select a cupboard...</option>
                  {cupboards.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Place Name / Rack / Shelf</label>
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
                <button type="submit" className="btn btn-primary">Save Place</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
