/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Leaf, Eye, EyeOff, Mail, Lock, User, Sparkles, ArrowLeft, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

interface AuthViewProps {
  onAuthSuccess: (user: { name: string; email: string; avatar: string }) => void;
  onBackToLanding: () => void;
  initialMode?: 'login' | 'signup';
}

export default function AuthView({ onAuthSuccess, onBackToLanding, initialMode = 'login' }: AuthViewProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot_password'>(initialMode);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  // Show / Hide password
  const [showPassword, setShowPassword] = useState(false);
  
  // State managers
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // Pre-load remembered email if exists
  useEffect(() => {
    const savedEmail = localStorage.getItem('ecotrack_remembered_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Email validate
    if (!email) {
      newErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please provide a valid email format.';
    }

    // Password validate (only for Login and Signup)
    if (mode !== 'forgot_password') {
      if (!password) {
        newErrors.password = 'Password is required.';
      } else if (password.length < 6) {
        newErrors.password = 'Password must remain at least 6 characters.';
      }
    }

    // Name validate (only for Signup)
    if (mode === 'signup' && !name.trim()) {
      newErrors.name = 'Sustainability handle / name is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) return;

    setIsLoading(true);
    // Simulate API connection latency
    setTimeout(() => {
      setIsLoading(false);
      
      if (mode === 'forgot_password') {
        setResetSent(true);
        return;
      }

      // If Remember Me is ticked, cache the email
      if (rememberMe) {
        localStorage.setItem('ecotrack_remembered_email', email);
      } else {
        localStorage.removeItem('ecotrack_remembered_email');
      }

      // Successful auth
      const finalName = mode === 'signup' ? name : (email.split('@')[0] || 'EcoCitizen');
      onAuthSuccess({
        name: finalName,
        email,
        avatar: mode === 'signup' ? '🍀' : '🌱'
      });
    }, 1200);
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onAuthSuccess({
        name: 'Google Citizen',
        email: 'collaborator@google.com',
        avatar: '🌍'
      });
    }, 900);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
      {/* Decorative gradient glowing spots */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main card box with glassmorphism */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-2xl bg-slate-900/50 border border-slate-800/80 p-8 md:p-10 shadow-2xl backdrop-blur-xl relative z-10 overflow-hidden"
      >
        {/* Back navigation */}
        <button
          onClick={onBackToLanding}
          className="absolute top-6 left-6 text-slate-500 hover:text-slate-300 flex items-center gap-1.5 text-xs font-medium font-sans cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>

        {/* Branding header */}
        <div className="text-center mt-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center mx-auto mb-3">
            <Leaf className="w-6 h-6 text-emerald-400 animate-bounce" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">EcoTrack AI</h2>
          <p className="text-xs text-emerald-400 font-medium font-mono mt-1 uppercase tracking-wider">
            Greenhouse Footprint Sentinel
          </p>
        </div>

        {resetSent && mode === 'forgot_password' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-6 py-6"
          >
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm max-w-xs mx-auto">
              💧 Reset link dispatched to <strong className="font-semibold block mt-1">{email}</strong>
            </div>
            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              Check your inbox for step-by-step sustainability credentials setup. Ensure checking junk folder filters as well.
            </p>
            <button
              onClick={() => {
                setResetSent(false);
                setMode('login');
              }}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-semibold transition-all cursor-pointer"
            >
              Sign In to Account
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Form Mode Tabs */}
            {mode !== 'forgot_password' && (
              <div className="grid grid-cols-2 bg-slate-950/80 p-1 rounded-xl border border-slate-900 mb-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrors({});
                  }}
                  className={`py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    mode === 'login'
                      ? 'bg-slate-900 border border-slate-800/80 text-white font-bold'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrors({});
                  }}
                  className={`py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    mode === 'signup'
                      ? 'bg-slate-900 border border-slate-800/80 text-white font-bold'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Register
                </button>
              </div>
            )}

            {mode === 'forgot_password' && (
              <div className="text-left space-y-2 mb-4">
                <h3 className="text-lg font-bold text-slate-200">Reset Credentials password</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Provide your recovery email address, and we will transmit credentials recovery links.
                </p>
              </div>
            )}

            {/* Form Fields container */}
            <div className="space-y-4 text-left">
              {/* Full Name input for Signup */}
              {mode === 'signup' && (
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-bold block" htmlFor="auth-name">Your Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                    <input
                      id="auth-name"
                      type="text"
                      className={`w-full bg-slate-950 border ${
                        errors.name ? 'border-red-500' : 'border-slate-800/80'
                      } rounded-xl pl-10.5 pr-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors`}
                      placeholder="Jane CarbonFighter"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                      }}
                    />
                  </div>
                  {errors.name && (
                    <span className="text-[11px] text-red-500 flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3" /> {errors.name}
                    </span>
                  )}
                </div>
              )}

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-bold block" htmlFor="auth-email">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                  <input
                    id="auth-email"
                    type="email"
                    className={`w-full bg-slate-950 border ${
                      errors.email ? 'border-red-500' : 'border-slate-800/80'
                    } rounded-xl pl-10.5 pr-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors`}
                    placeholder="you@domain.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                    }}
                  />
                </div>
                {errors.email && (
                  <span className="text-[11px] text-red-500 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" /> {errors.email}
                  </span>
                )}
              </div>

              {/* Password field */}
              {mode !== 'forgot_password' && (
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs text-slate-400 font-bold block" htmlFor="auth-password">Password</label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => {
                          setMode('forgot_password');
                          setErrors({});
                        }}
                        className="text-[11px] text-emerald-400 hover:text-emerald-300 font-sans cursor-pointer"
                      >
                        Reset Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                    <input
                      id="auth-password"
                      type={showPassword ? 'text' : 'password'}
                      className={`w-full bg-slate-950 border ${
                        errors.password ? 'border-red-500' : 'border-slate-800/80'
                      } rounded-xl pl-10.5 pr-11 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors`}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <span className="text-[11px] text-red-500 flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3" /> {errors.password}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Remember me & submit buttons */}
            {mode !== 'forgot_password' && (
              <div className="flex items-center justify-between py-1 text-left">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-400 hover:text-slate-300">
                  <input
                    type="checkbox"
                    className="rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-emerald-500/20 w-4 h-4 accent-emerald-500"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Remember Me
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-950/20 active:scale-[0.98] ${
                isLoading ? 'opacity-80 cursor-wait' : ''
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                  {mode === 'login' ? 'Validate & Sign In' : mode === 'signup' ? 'Form & Complete Signup' : 'Reset My Password'}
                </>
              )}
            </button>

            {/* Google Authentication Bypass Provider */}
            {mode !== 'forgot_password' && (
              <div className="space-y-4">
                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-800/80"></div>
                  <span className="flex-shrink mx-4 text-[10px] uppercase font-bold text-slate-500 font-mono">Or connect with</span>
                  <div className="flex-grow border-t border-slate-800/80"></div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 transition-all cursor-pointer flex items-center justify-center gap-2.5 active:scale-[0.98]"
                >
                  <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.14-5.136 4.14a5.955 5.955 0 0 1-5.952-5.955a5.955 5.955 0 0 1 5.952-5.955c1.464 0 2.827.616 3.805 1.6l2.97-2.97C18.665 3.197 15.65 1.95 12.24 1.95a10 10 0 0 0-10 10a10 10 0 0 0 10 10c5.385 0 9.878-3.9 9.878-9.87c0-.62-.057-1.22-.162-1.795H12.24Z"
                    />
                  </svg>
                  Sign In with Google Account
                </button>
              </div>
            )}

            {/* Mode toggle helper label */}
            {mode === 'forgot_password' && (
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-slate-500 hover:text-slate-300 block mx-auto pt-2 cursor-pointer transition-colors"
              >
                Return to Login Page
              </button>
            )}
          </form>
        )}

        {/* CTA Branding Footer bar */}
        <div className="mt-8 pt-6 border-t border-slate-850/60 text-center">
          <p className="text-xs text-slate-400 italic">
            "Track your impact. Build a greener future."
          </p>
        </div>
      </motion.div>
    </div>
  );
}
