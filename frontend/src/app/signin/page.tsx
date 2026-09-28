'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { 
  HiOutlineMail, 
  HiOutlineLockClosed, 
  HiOutlineEye, 
  HiOutlineEyeOff, 
  HiOutlineExclamationCircle, 
  HiOutlineSparkles,
  HiOutlineCheckCircle,
  HiArrowRight
} from 'react-icons/hi';
import { FiBox } from 'react-icons/fi';

export default function SigninPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Email format validation
  const isEmailValid = email === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isEmailValid) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setError(errorObj.response?.data?.message || 'Invalid credentials. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 via-emerald-50/40 to-teal-50/30 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white flex items-center justify-center p-6 sm:p-8 lg:p-12">
      {/* Background Lighting Accents */}
      <div className="fixed top-12 left-12 w-96 h-96 bg-emerald-400/20 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="fixed bottom-12 right-12 w-96 h-96 bg-teal-400/20 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Main Container Card (Spacious 1:1 Split) */}
      <div className="w-full max-w-5xl min-h-[660px] bg-white rounded-3xl shadow-2xl shadow-slate-300/70 border border-slate-200/90 grid grid-cols-1 lg:grid-cols-2 overflow-hidden relative z-10">

        {/* Left Half: Full-bleed 3D Inventory Hero Showcase */}
        <div className="hidden lg:flex relative flex-col justify-between p-12 xl:p-14 text-white bg-slate-950 overflow-hidden">
          {/* Background 3D Image Layer */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/inventory_hero.jpg"
              alt="AI Warehouse Inventory Management"
              fill
              className="object-cover object-center opacity-40 scale-105"
              priority
            />
            {/* Gradient Overlays for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/50"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-transparent to-transparent"></div>
          </div>

          {/* Top Badge (Positioned safely away from rounded corners) */}
          <div className="relative z-10 pt-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-wider uppercase backdrop-blur-md shadow-xl">
              <HiOutlineSparkles className="text-sm text-emerald-400" /> AI Inventory Intelligence
            </div>
          </div>

          {/* Center Showcase Content */}
          <div className="relative z-10 my-auto py-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 relative rounded-2xl overflow-hidden shadow-xl shadow-emerald-500/30 ring-2 ring-emerald-400/40 shrink-0">
                <Image
                  src="/logo.png"
                  alt="InvenTrack Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-white">
                  InvenTrack<span className="text-emerald-400">.</span>
                </h1>
                <p className="text-xs font-bold text-emerald-400 tracking-widest uppercase mt-0.5">Smart Warehouse Suite</p>
              </div>
            </div>

            <h2 className="text-2xl xl:text-3xl font-bold mb-4 text-slate-100 leading-snug">
              Transform asset tracking with predictive AI demand forecasting.
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-8 max-w-md">
              Take complete control of storage locations, track borrowings, eliminate stockouts, and monitor ML reorder thresholds in real-time.
            </p>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-2 gap-4 max-w-md">
              <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-1.5">
                  <HiOutlineCheckCircle className="text-base shrink-0" /> Automated Reordering
                </div>
                <div className="text-xs text-slate-300 leading-relaxed">ML model predicts low-stock items automatically.</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md">
                <div className="flex items-center gap-2 text-teal-300 font-bold text-xs mb-1.5">
                  <HiOutlineCheckCircle className="text-base shrink-0" /> Real-time Audit Logs
                </div>
                <div className="text-xs text-slate-300 leading-relaxed">Full traceability for borrowings & returns.</div>
              </div>
            </div>
          </div>

          {/* Bottom Footer Status */}
          <div className="relative z-10 text-xs text-slate-400 flex items-center justify-between border-t border-white/10 pt-5 pb-2">
            <span>&copy; {new Date().getFullYear()} InvenTrack Enterprise.</span>
            <span className="flex items-center gap-2 text-emerald-400 font-semibold"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span> ML Engine Active</span>
          </div>
        </div>

        {/* Right Half: Spacious & Centered Sign In Form */}
        <div className="flex flex-col justify-center items-center p-8 sm:p-12 lg:p-16 bg-white w-full">
          <div className="w-full max-w-md">
            
            {/* Mobile Header Brand */}
            <div className="lg:hidden flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
              <div className="w-11 h-11 relative rounded-xl overflow-hidden shadow-md ring-1 ring-emerald-500/30 shrink-0">
                <Image
                  src="/logo.png"
                  alt="InvenTrack Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">InvenTrack<span className="text-emerald-500">.</span></h1>
                <p className="text-xs text-slate-500 tracking-wider uppercase font-medium">Inventory System</p>
              </div>
            </div>

            {/* Form Title & Subtitle */}
            <div className="mb-8">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-relaxed">
                Sign In
              </h2>
              <p className="text-slate-500 text-sm mt-3 leading-relaxed">
                Welcome back! Please enter your details below.
              </p>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs sm:text-sm flex items-start gap-3 leading-relaxed">
                <HiOutlineExclamationCircle className="text-lg shrink-0 mt-0.5 text-red-500" />
                <div className="flex-1 font-medium leading-relaxed">{error}</div>
              </div>
            )}

            {/* Spacious Form (Flex Gap Layout for clean 1.5 line spacing) */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5 leading-relaxed">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <HiOutlineMail className="text-xl" />
                  </div>
                  <input
                    type="email"
                    className={`w-full h-12 bg-slate-50 border ${!isEmailValid && email !== '' ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-100'} rounded-2xl pl-12 pr-4 text-slate-900 text-sm placeholder-slate-400 outline-none focus:ring-4 transition-all font-medium leading-relaxed`}
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {!isEmailValid && email !== '' && (
                  <p className="text-xs text-red-500 font-medium mt-2 leading-relaxed">Please enter a valid email address.</p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 leading-relaxed">
                    Password
                  </label>
                </div>
                <div className="relative flex items-center">
                  <div className="absolute left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <HiOutlineLockClosed className="text-xl" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full h-12 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 rounded-2xl pl-12 pr-12 text-slate-900 text-sm placeholder-slate-400 outline-none transition-all font-sans font-medium leading-relaxed"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <HiOutlineEyeOff className="text-xl" /> : <HiOutlineEye className="text-xl" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between text-sm py-1">
                <label className="flex items-center gap-2.5 cursor-pointer text-slate-600 hover:text-slate-900 select-none font-medium leading-relaxed">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4.5 h-4.5 rounded-md border-slate-300 text-emerald-500 focus:ring-emerald-400 cursor-pointer accent-emerald-500"
                  />
                  Remember me for 30 days
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-slate-900 hover:bg-emerald-600 text-white font-bold px-5 rounded-2xl shadow-xl shadow-slate-900/10 hover:shadow-emerald-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2.5 group mt-2 leading-relaxed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2.5">
                    <div className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="leading-relaxed">Signing In...</span>
                  </div>
                ) : (
                  <>
                    <span className="leading-relaxed">Sign In</span>
                    <HiArrowRight className="text-lg group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Navigation Link */}
            <div className="mt-10 pt-6 border-t border-slate-100 text-center">
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                Don&apos;t have an account?{' '}
                <Link 
                  href="/signup" 
                  className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors hover:underline underline-offset-4 ml-1 leading-relaxed"
                >
                  Create an account
                </Link>
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}





