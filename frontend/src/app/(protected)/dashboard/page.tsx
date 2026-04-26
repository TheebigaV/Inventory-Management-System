'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import {
  HiOutlineCube,
  HiOutlineCollection,
  HiOutlineSwitchHorizontal,
  HiOutlineExclamation,
  HiOutlineDatabase,
  HiOutlineCheckCircle,
} from 'react-icons/hi';

interface DashboardStats {
  total_items: number;
  total_cupboards: number;
  items_in_store: number;
  items_borrowed: number;
  items_damaged: number;
  items_missing: number;
  active_borrowings: number;
  total_quantity: number;
  recent_activities: Array<{
    id: number;
    action: string;
    description: string;
    created_at: string;
    user: { name: string };
  }>;
  low_stock_items: Array<{
    id: number;
    name: string;
    code: string;
    quantity: number;
    place: { name: string; cupboard: { name: string } };
  }>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/dashboard/stats');
      setStats(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  const getActivityDotClass = (action: string) => {
    if (action.includes('CREATED')) return 'create';
    if (action.includes('UPDATED') || action.includes('QUANTITY')) return 'update';
    if (action.includes('DELETED')) return 'delete';
    if (action.includes('BORROW') || action.includes('RETURN')) return 'borrow';
    return 'create';
  };

  return (
    <div>
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Overview of your inventory system</p>
      </div>

      <div className="stats-grid">
        <div className="glass-card stat-card purple">
          <div className="stat-icon purple"><HiOutlineCube /></div>
          <div className="stat-value">{stats?.total_cupboards || 0}</div>
          <div className="stat-label">Total Cupboards</div>
        </div>
        <div className="glass-card stat-card blue">
          <div className="stat-icon blue"><HiOutlineCollection /></div>
          <div className="stat-value">{stats?.total_items || 0}</div>
          <div className="stat-label">Total Items</div>
        </div>
        <div className="glass-card stat-card green">
          <div className="stat-icon green"><HiOutlineCheckCircle /></div>
          <div className="stat-value">{stats?.items_in_store || 0}</div>
          <div className="stat-label">In Store</div>
        </div>
        <div className="glass-card stat-card orange">
          <div className="stat-icon orange"><HiOutlineSwitchHorizontal /></div>
          <div className="stat-value">{stats?.active_borrowings || 0}</div>
          <div className="stat-label">Active Borrowings</div>
        </div>
        <div className="glass-card stat-card red">
          <div className="stat-icon red"><HiOutlineExclamation /></div>
          <div className="stat-value">{stats?.items_damaged || 0}</div>
          <div className="stat-label">Damaged Items</div>
        </div>
        <div className="glass-card stat-card cyan">
          <div className="stat-icon cyan"><HiOutlineDatabase /></div>
          <div className="stat-value">{stats?.total_quantity || 0}</div>
          <div className="stat-label">Total Quantity</div>
        </div>
      </div>

      <div className="grid-2">
        {/* Recent Activity */}
        <div className="glass-card" style={{ padding: 0 }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Recent Activity</h3>
          </div>
          {stats?.recent_activities?.length ? (
            stats.recent_activities.map((act) => (
              <div key={act.id} className="activity-item">
                <div className={`activity-dot ${getActivityDotClass(act.action)}`}></div>
                <div>
                  <div className="activity-text">{act.description}</div>
                  <div className="activity-time">
                    by {act.user?.name} • {new Date(act.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No recent activity</p>
            </div>
          )}
        </div>

        {/* Low Stock Items */}
        <div className="glass-card" style={{ padding: 0 }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>⚠️ Low Stock Items</h3>
          </div>
          {stats?.low_stock_items?.length ? (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Location</th>
                    <th>Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.low_stock_items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{item.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{item.code}</div>
                      </td>
                      <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        {item.place?.cupboard?.name} → {item.place?.name}
                      </td>
                      <td>
                        <span className="badge borrowed">{item.quantity}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <p>All items are well stocked 🎉</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
