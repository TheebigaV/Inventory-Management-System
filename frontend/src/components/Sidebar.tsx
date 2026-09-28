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
  HiOutlineLogout,
  HiOutlineSparkles,
  HiOutlineTag,
  HiOutlineTruck,
  HiOutlineRefresh,
  HiOutlineChartBar,
} from 'react-icons/hi';

export default function Sidebar() {
  const { user, logout, isAdmin } = useAuth();
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: <HiOutlineViewGrid /> },
    { href: '/ai-forecast', label: 'AI Demand Forecast', icon: <HiOutlineSparkles /> },
    { href: '/items', label: 'Inventory Items', icon: <HiOutlineCollection /> },
    { href: '/categories', label: 'Categories', icon: <HiOutlineTag /> },
    { href: '/suppliers', label: 'Suppliers', icon: <HiOutlineTruck /> },
    { href: '/stock-transactions', label: 'Stock Movements', icon: <HiOutlineRefresh /> },
    { href: '/borrowings', label: 'Borrowings', icon: <HiOutlineSwitchHorizontal /> },
    { href: '/cupboards', label: 'Cupboards', icon: <HiOutlineCube /> },
    { href: '/places', label: 'Storage Places', icon: <HiOutlineLocationMarker /> },
    { href: '/reports', label: 'Reports & Analytics', icon: <HiOutlineChartBar /> },
  ];

  const adminItems = [
    { href: '/users', label: 'User Management', icon: <HiOutlineUsers /> },
  ];


  return (
    <aside className="sidebar">
      <div className="sidebar-logo flex items-center gap-3">
        <div className="w-11 h-11 relative rounded-xl overflow-hidden shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-500/30 shrink-0">
          <img
            src="/logo.png"
            alt="InvenTrack Logo"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-base font-extrabold tracking-tight text-white leading-tight">InvenTrack<span className="text-emerald-400">.</span></h1>
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
