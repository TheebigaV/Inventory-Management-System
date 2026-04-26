'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { HiOutlineUserAdd, HiOutlinePencilAlt, HiOutlineTrash, HiOutlineSwitchHorizontal, HiOutlineClipboardList } from 'react-icons/hi';
import toast from 'react-hot-toast';

interface ActivityLog {
  id: number;
  action: string;
  model_type: string;
  description: string;
  created_at: string;
  previous_value: string | null;
  new_value: string | null;
  user: {
    name: string;
    email: string;
  };
}

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();
  const [filterAction, setFilterAction] = useState<string>('');

  useEffect(() => {
    fetchLogs();
  }, [filterAction]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const url = filterAction ? `/activity-logs?action=${filterAction}` : '/activity-logs';
      const res = await api.get(url);
      setLogs(res.data.data ? res.data.data : res.data); // Support pagination response or direct array
    } catch {
      toast.error('Failed to load activity logs');
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (action: string) => {
    if (action.includes('CREATED')) return <HiOutlineUserAdd className="text-emerald-400" />;
    if (action.includes('UPDATED') || action.includes('QUANTITY')) return <HiOutlinePencilAlt className="text-blue-400" />;
    if (action.includes('DELETED')) return <HiOutlineTrash className="text-red-400" />;
    if (action.includes('BORROW') || action.includes('RETURN')) return <HiOutlineSwitchHorizontal className="text-yellow-400" />;
    return <span className="text-indigo-400">•</span>;
  };

  if (!isAdmin) {
    return <div className="p-8 text-center text-gray-400">You do not have access to this page.</div>;
  }

  return (
    <div>
      <div className="page-header flex justify-between items-center">
        <div>
          <h2>System Audit Trail</h2>
          <p>Complete record of changes to items and inventory</p>
        </div>
        <div className="w-48">
           <select 
              className="bg-gray-900 border border-gray-700 text-white rounded-lg block w-full outline-none p-2 text-sm"
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
            >
              <option value="">All Actions</option>
              <option value="ITEM_CREATED">Item Created</option>
              <option value="ITEM_UPDATED">Item Updated</option>
              <option value="ITEM_DELETED">Item Deleted</option>
              <option value="QUANTITY_UPDATED">Quantity Adjusted</option>
              <option value="ITEM_BORROWED">Item Borrowed</option>
              <option value="ITEM_RETURNED">Item Returned</option>
              <option value="CUPBOARD_CREATED">Storage Added</option>
              <option value="USER_CREATED">User Added</option>
            </select>
        </div>
      </div>

      <div className="glass-card">
        {loading ? (
          <div className="loading-container"><div className="spinner"></div></div>
        ) : logs.length > 0 ? (
          <div className="divide-y divide-gray-800/50">
            {logs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-white/[0.02] transition-colors flex gap-4">
                <div className="mt-1 bg-gray-900 border border-gray-800 rounded-full w-10 h-10 flex items-center justify-center shrink-0">
                  {getIcon(log.action)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-medium text-gray-200">
                      {log.user?.name}
                    </p>
                    <time className="text-xs text-gray-500 shrink-0">
                      {new Date(log.created_at).toLocaleString()}
                    </time>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">
                    {log.description}
                  </p>
                  
                  {/* Values diff viewer - simplified */}
                  {(log.previous_value || log.new_value) && (
                    <div className="mt-2 text-xs bg-gray-900/50 rounded p-3 border border-gray-800/80 grid grid-cols-2 gap-4">
                      {log.previous_value && (
                         <div>
                           <span className="text-red-400/80 font-mono block mb-1">Previous</span>
                           <pre className="text-gray-500 overflow-x-auto">
                             {typeof log.previous_value === 'string' ? log.previous_value : JSON.stringify(log.previous_value, null, 2)}
                           </pre>
                         </div>
                      )}
                      {log.new_value && (
                         <div>
                           <span className="text-emerald-400/80 font-mono block mb-1">New</span>
                           <pre className="text-gray-400 overflow-x-auto">
                             {typeof log.new_value === 'string' ? log.new_value : JSON.stringify(log.new_value, null, 2)}
                           </pre>
                         </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <HiOutlineClipboardList className="mx-auto" />
            <h3>No audit logs match criteria</h3>
          </div>
        )}
      </div>
    </div>
  );
}
