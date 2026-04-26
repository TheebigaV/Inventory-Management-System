'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  HiOutlineViewGrid,
  HiOutlineCube,
  HiOutlineCollection,
  HiOutlineLocationMarker,
  HiOutlineSwitchHorizontal,
  HiOutlineUsers,
  HiOutlineClipboardList,
  HiOutlineLogout,
} from 'react-icons/hi';

export default function Sidebar() {
  const { user, logout, isAdmin } = useAuth();
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: <HiOutlineViewGrid /> },
    { href: '/cupboards', label: 'Cupboards', icon: <HiOutlineCube /> },
    { href: '/places', label: 'Storage Places', icon: <HiOutlineLocationMarker /> },
    { href: '/items', label: 'Inventory Items', icon: <HiOutlineCollection /> },
    { href: '/borrowings', label: 'Borrowings', icon: <HiOutlineSwitchHorizontal /> },
  ];

  const adminItems = [
    { href: '/users', label: 'User Management', icon: <HiOutlineUsers /> },
    { href: '/activity-logs', label: 'Activity Logs', icon: <HiOutlineClipboardList /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">📦</div>
        <div>
          <h1>InvenTrack</h1>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Inventory System</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-title">Main Menu</div>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-link ${pathname === item.href ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </Link>
        ))}

        {isAdmin && (
          <>
            <div className="nav-section-title">Administration</div>
            {adminItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${pathname === item.href ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <div className="user-name">{user?.name}</div>
            <div className="user-role">{user?.role}</div>
          </div>
        </div>
        <button
          onClick={logout}
          className="nav-link"
          style={{ marginTop: '8px', color: '#f87171' }}
        >
          <span className="nav-icon"><HiOutlineLogout /></span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
