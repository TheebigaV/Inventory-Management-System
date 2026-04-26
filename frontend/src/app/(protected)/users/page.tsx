'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { HiOutlinePlus, HiOutlineTrash, HiOutlineUsers } from 'react-icons/hi';
import toast from 'react-hot-toast';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', password_confirmation: '', role: 'staff' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch {
      toast.error('Failed to view users');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/register', formData);
      toast.success('User created');
      setIsModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error creating user');
    }
  };

  const openCreate = () => {
    setFormData({ name: '', email: '', password: '', password_confirmation: '', role: 'staff' });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success('User deleted');
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  if (!isAdmin) {
    return <div className="p-8 text-center text-gray-400">You do not have access to this page.</div>;
  }

  return (
    <div>
      <div className="page-header flex justify-between items-center">
        <div>
          <h2>User Management</h2>
          <p>Create and manage system access</p>
        </div>
        <button onClick={openCreate} className="btn btn-primary">
          <HiOutlinePlus /> Add User
        </button>
      </div>

      <div className="glass-card table-container">
        {loading ? (
          <div className="loading-container"><div className="spinner"></div></div>
        ) : users.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>User Details</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/20">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-gray-200">{u.name}</span>
                    </div>
                  </td>
                  <td className="text-gray-400">{u.email}</td>
                  <td>
                    <span className={`badge ${u.role}`}>{u.role}</span>
                  </td>
                  <td className="text-sm text-gray-400">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="text-right">
                    <button onClick={() => handleDelete(u.id)} className="btn btn-danger btn-sm p-2"><HiOutlineTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <HiOutlineUsers className="mx-auto" />
            <h3>No Users Found</h3>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-title">
              Create New User
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" className="form-input" required 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" className="form-input" required 
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input 
                    type="password" className="form-input" required minLength={8}
                    value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input 
                    type="password" className="form-input" required minLength={8}
                    value={formData.password_confirmation} onChange={e => setFormData({...formData, password_confirmation: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select 
                  className="form-select bg-gray-900 border border-gray-700 text-white rounded-lg block w-full outline-none p-3"
                  required
                  value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}
                >
                  <option value="staff">Staff</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
