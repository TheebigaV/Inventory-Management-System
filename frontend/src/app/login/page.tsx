'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';
import { FiBox } from 'react-icons/fi';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex text-slate-100 bg-slate-950 font-sans">
      {/* Left side - Branding Context */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 items-center justify-center overflow-hidden border-r border-slate-800">
        {/* Abstract shapes for background */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[20%] left-[10%] w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 p-16 max-w-lg">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <FiBox className="text-3xl" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">InvenTrack.</h1>
          </div>
          <h2 className="text-2xl font-semibold mb-6 text-slate-300 leading-snug">
            Smarter inventory management for modern teams.
          </h2>
          <p className="text-slate-400 leading-relaxed">
            Take control of your storage, track borrowings effortlessly, and monitor real-time audit logs in one neatly organized platform.
          </p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-950 relative">
        <div className="w-full max-w-md">
          {/* Logo visible only on mobile */}
          <div className="lg:hidden flex items-center gap-3 mb-10 pb-6 border-b border-slate-800">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center text-white">
              <FiBox className="text-xl" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">InvenTrack.</h1>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-bold mb-2 tracking-tight">Welcome back</h2>
            <p className="text-slate-400">Please enter your details to sign in.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-950/50 border-l-4 border-red-500 text-red-400 text-sm rounded-r-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '24px' }}>
              <label 
                className="block text-sm font-medium text-slate-300 mb-4"
                style={{ marginBottom: '16px' }}
              >
                Email Address
              </label>
              <div 
                className="bg-slate-900 border border-slate-800 rounded-xl px-4 focus-within:ring-2 focus-within:ring-emerald-500/50 focus-within:border-emerald-500 transition-all"
                style={{ display: 'flex', alignItems: 'center', height: '50px' }}
              >
                <HiOutlineMail className="text-slate-500 text-xl shrink-0" style={{ marginRight: '24px' }} />
                <input
                  type="email"
                  className="w-full bg-transparent text-slate-100 placeholder-slate-500 outline-none h-full"
                  style={{ marginLeft: '12px' }}
                  placeholder="admin@inventory.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label 
                className="block text-sm font-medium text-slate-300 mb-4"
                style={{ marginBottom: '16px' }}
              >
                Password
              </label>
              <div 
                className="bg-slate-900 border border-slate-800 rounded-xl px-4 focus-within:ring-2 focus-within:ring-emerald-500/50 focus-within:border-emerald-500 transition-all"
                style={{ display: 'flex', alignItems: 'center', height: '50px' }}
              >
                <HiOutlineLockClosed className="text-slate-500 text-xl shrink-0" style={{ marginRight: '24px' }} />
                <input
                  type="password"
                  className="w-full bg-transparent text-slate-100 placeholder-slate-500 tracking-widest font-mono outline-none h-full"
                  style={{ marginLeft: '12px' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all disabled:opacity-50 tracking-wide"
              style={{ height: '50px' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
