'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { 
  HiOutlineUser, 
  HiOutlineMail, 
  HiOutlineLockClosed, 
  HiOutlineEye, 
  HiOutlineEyeOff, 
  HiOutlineExclamationCircle, 
  HiOutlineSparkles,
  HiArrowRight,
  HiCheckCircle,
  HiXCircle
} from 'react-icons/hi';
import { FiBox } from 'react-icons/fi';

export default function SignupPage() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Email format validation
  const isEmailValid = email === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Real-time password criteria validation
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const criteriaMetCount = [hasMinLength, hasUppercase, hasNumber, hasSpecial].filter(Boolean).length;
  const isPasswordValid = criteriaMetCount === 4;
  const doPasswordsMatch = passwordConfirmation === '' || password === passwordConfirmation;

  // Password strength calculation
  const getStrengthLabel = () => {
    if (password === '') return { text: '', color: 'bg-slate-200', width: 'w-0' };
    if (criteriaMetCount <= 1) return { text: 'Weak Password', color: 'bg-red-500', width: 'w-1/4' };
    if (criteriaMetCount <= 3) return { text: 'Medium Strength', color: 'bg-amber-500', width: 'w-3/4' };
    return { text: 'Strong Password', color: 'bg-emerald-500', width: 'w-full' };
  };

  const strength = getStrengthLabel();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isEmailValid) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!isPasswordValid) {
      setError('Please fulfill all password security requirements below.');
      return;
    }

    if (password !== passwordConfirmation) {
      setError('Passwords do not match. Please verify both fields.');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password, passwordConfirmation);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
      
      if (errorObj.response?.data?.errors) {
        const firstErrorKey = Object.keys(errorObj.response.data.errors)[0];
        setError(errorObj.response.data.errors[firstErrorKey][0]);
      } else {
        setError(errorObj.response?.data?.message || 'Registration failed. Please check your information and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 via-emerald-50/40 to-teal-50/30 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white flex items-center justify-center p-6 sm:p-8 lg:p-12">
      {/* Background Lighting Accents */}
      <div className="fixed top-12 right-12 w-96 h-96 bg-emerald-400/20 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="fixed bottom-12 left-12 w-96 h-96 bg-teal-400/20 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Main Container Card (Spacious 1:1 Split) */}
      <div className="w-full max-w-5xl min-h-[680px] bg-white rounded-3xl shadow-2xl shadow-slate-300/70 border border-slate-200/90 grid grid-cols-1 lg:grid-cols-2 overflow-hidden relative z-10">

        {/* Left Half: Spacious Sign Up Form */}
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
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-[1.5]">
                Create an Account
              </h2>
              <p className="text-slate-500 text-sm mt-2 leading-[1.5]">
                Start managing your inventory and smart AI tracking.
              </p>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs sm:text-sm flex items-start gap-3 leading-[1.5]">
                <HiOutlineExclamationCircle className="text-lg shrink-0 mt-0.5 text-red-500" />
                <div className="flex-1 font-medium leading-[1.5]">{error}</div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 leading-relaxed">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <HiOutlineUser className="text-xl" />
                  </div>
                  <input
                    type="text"
                    className="w-full h-12 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 rounded-2xl pl-12 pr-4 text-slate-900 text-sm placeholder-slate-400 outline-none transition-all font-medium leading-relaxed"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 leading-relaxed">
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
                  <p className="text-xs text-red-500 font-medium mt-1.5 leading-relaxed">Please enter a valid email address.</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 leading-relaxed">
                  Password
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <HiOutlineLockClosed className="text-xl" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full h-12 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 rounded-2xl pl-12 pr-12 text-slate-900 text-sm placeholder-slate-400 outline-none transition-all font-sans font-medium leading-relaxed"
                    placeholder="Create password"
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

                {/* Password Strength Bar */}
                {password !== '' && (
                  <div className="mt-2.5 space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-600 leading-relaxed">
                      <span>Security Strength</span>
                      <span className={criteriaMetCount === 4 ? 'text-emerald-600' : 'text-amber-600'}>{strength.text}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full ${strength.color} ${strength.width} transition-all duration-300`}></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Password Validation Requirements */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1 leading-relaxed">Password Requirements</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className={`flex items-center gap-1.5 font-medium ${hasMinLength ? 'text-emerald-600' : 'text-slate-400'} leading-relaxed`}>
                    {hasMinLength ? <HiCheckCircle className="text-emerald-500 text-base shrink-0" /> : <HiXCircle className="text-slate-300 text-base shrink-0" />}
                    <span>At least 8 characters</span>
                  </div>
                  <div className={`flex items-center gap-1.5 font-medium ${hasUppercase ? 'text-emerald-600' : 'text-slate-400'} leading-relaxed`}>
                    {hasUppercase ? <HiCheckCircle className="text-emerald-500 text-base shrink-0" /> : <HiXCircle className="text-slate-300 text-base shrink-0" />}
                    <span>1 Uppercase letter</span>
                  </div>
                  <div className={`flex items-center gap-1.5 font-medium ${hasNumber ? 'text-emerald-600' : 'text-slate-400'} leading-relaxed`}>
                    {hasNumber ? <HiCheckCircle className="text-emerald-500 text-base shrink-0" /> : <HiXCircle className="text-slate-300 text-base shrink-0" />}
                    <span>1 Number</span>
                  </div>
                  <div className={`flex items-center gap-1.5 font-medium ${hasSpecial ? 'text-emerald-600' : 'text-slate-400'} leading-relaxed`}>
                    {hasSpecial ? <HiCheckCircle className="text-emerald-500 text-base shrink-0" /> : <HiXCircle className="text-slate-300 text-base shrink-0" />}
                    <span>1 Special character</span>
                  </div>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 leading-relaxed">
                  Confirm Password
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <HiOutlineLockClosed className="text-xl" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={`w-full h-12 bg-slate-50 border ${!doPasswordsMatch ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-100'} rounded-2xl pl-12 pr-12 text-slate-900 text-sm placeholder-slate-400 outline-none focus:ring-4 transition-all font-sans font-medium leading-relaxed`}
                    placeholder="Re-enter password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? <HiOutlineEyeOff className="text-xl" /> : <HiOutlineEye className="text-xl" />}
                  </button>
                </div>
                {!doPasswordsMatch && (
                  <p className="text-xs text-red-500 font-medium mt-1.5 leading-relaxed">Passwords do not match.</p>
                )}
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
                    <span className="leading-relaxed">Creating Account...</span>
                  </div>
                ) : (
                  <>
                    <span className="leading-relaxed">Sign Up</span>
                    <HiArrowRight className="text-lg group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Navigation Link */}
            <div className="mt-10 pt-6 border-t border-slate-100 text-center">
              <p className="text-slate-500 text-sm font-medium leading-[1.5]">
                Already have an account?{' '}
                <Link 
                  href="/signin" 
                  className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors hover:underline underline-offset-4 ml-1 leading-[1.5]"
                >
                  Sign In
                </Link>
              </p>
            </div>

          </div>
        </div>

        {/* Right Half: Full-bleed 3D Inventory Hero Showcase */}
        <div className="hidden lg:flex relative flex-col justify-between p-12 xl:p-14 text-white bg-slate-950 overflow-hidden">
          {/* Background 3D Image Layer */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/inventory_hero.jpg"
              alt="Smart AI Inventory Platform"
              fill
              className="object-cover object-center opacity-40 scale-105"
              priority
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/50"></div>
            <div className="absolute inset-0 bg-gradient-to-l from-slate-950/90 via-transparent to-transparent"></div>
          </div>

          {/* Top Badge (Positioned safely away from rounded corners) */}
          <div className="relative z-10 pt-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-wider uppercase backdrop-blur-md shadow-xl">
              <HiOutlineSparkles className="text-sm text-emerald-400" /> Join InvenTrack Platform
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
                <p className="text-xs font-bold text-emerald-400 tracking-widest uppercase mt-0.5">Inventory Management</p>
              </div>
            </div>

            <h2 className="text-2xl xl:text-3xl font-bold mb-4 text-slate-100 leading-snug">
              Get started in seconds with enterprise asset controls.
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-8 max-w-md">
              Streamline warehouse operations, manage cupboard locations, and track item borrowing with automated audit logs.
            </p>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-2 gap-4 max-w-md">
              <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-1.5">
                  <HiCheckCircle className="text-base shrink-0" /> Full Stock Control
                </div>
                <div className="text-xs text-slate-300 leading-relaxed">Organize places, cupboards & item stock.</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md">
                <div className="flex items-center gap-2 text-teal-300 font-bold text-xs mb-1.5">
                  <HiCheckCircle className="text-base shrink-0" /> Borrow & Return Log
                </div>
                <div className="text-xs text-slate-300 leading-relaxed">Instant status tracking and active logs.</div>
              </div>
            </div>
          </div>

          {/* Bottom Footer Status */}
          <div className="relative z-10 text-xs text-slate-400 flex items-center justify-between border-t border-white/10 pt-5 pb-2">
            <span>&copy; {new Date().getFullYear()} InvenTrack Enterprise.</span>
            <span className="flex items-center gap-2 text-emerald-400 font-semibold"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span> System Ready</span>
          </div>
        </div>

      </div>
    </div>
  );
}



