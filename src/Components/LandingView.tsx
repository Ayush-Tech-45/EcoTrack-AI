/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Leaf, Cpu, BarChart3, Award, Users, TreePine, Flame, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface LandingViewProps {
  onStart: () => void;
  onLogin: () => void;
}

export default function LandingView({ onStart, onLogin }: LandingViewProps) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 overflow-x-hidden font-sans">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-medium">
              <Leaf className="w-4 h-4 animate-pulse text-emerald-400" />
              <span>Next-Gen Sustainability Intelligence</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] font-sans">
              Track Today. <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">
                Sustain Tomorrow.
              </span>
            </h1>

            <p className="text-slate-400 text-base sm:text-lg lg:text-xl max-w-xl leading-relaxed">
              Empower your sustainable lifestyle with custom AI insights, precision carbon logging metrics, and engaging eco challenges that help heal our home.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                id="landing-cta-start-btn"
                onClick={onStart}
                className="px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold tracking-wide transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-400/30 text-center active:scale-95 duration-150 cursor-pointer"
              >
                Start Carbon Journey
              </button>
              <button
                id="landing-cta-login-btn"
                onClick={onLogin}
                className="px-8 py-4 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700/60 text-slate-100 font-medium tracking-wide transition-all text-center active:scale-95 duration-150 cursor-pointer"
              >
                Sign In to Dashboard
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-4 text-slate-400 text-sm">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400 animate-bounce" /> 100% Privacy Protected
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-700 hidden sm:block" />
              <span className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-emerald-400" /> No Hardware Required
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-[380px] sm:max-w-[420px] lg:max-w-none">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-3xl" />
              
              {/* Outer Decorative Globe Image Frame */}
              <div className="relative rounded-[2rem] border border-slate-800 bg-slate-950/80 p-4 shadow-2xl backdrop-blur-sm overflow-hidden aspect-[4/3] flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80"
                  alt="Planet Earth from Space"
                  className="absolute inset-0 w-full h-full object-cover opacity-60 rounded-[1.8rem] transition-transform duration-700 hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                {/* Embedded Live Widget Overlays */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-mono">Today's Footprint</p>
                    <p className="text-xl font-bold text-white">-12.4 kg CO2e</p>
                    <p className="text-xs text-emerald-400 font-medium">★ High Sustainability Score</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="absolute top-6 right-6 p-3 rounded-xl bg-slate-900/90 border border-teal-500/20 shadow-xl backdrop-blur-md flex items-start gap-3 max-w-[200px]"
                >
                  <Cpu className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                  <div className="text-left">
                    <p className="text-[10px] font-mono text-teal-400 uppercase font-semibold">AI Insights</p>
                    <p className="text-xs text-slate-300 font-medium">Biking to your office tomorrow prevents 4.5kg carbon emissions.</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Counters Grid */}
      <section className="bg-slate-950/40 border-y border-slate-800/60 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center md:text-left space-y-1">
              <Users className="w-6 h-6 text-emerald-400 mx-auto md:mx-0 mb-2" />
              <p className="text-3xl sm:text-4xl font-extrabold text-white">50K+</p>
              <p className="text-xs sm:text-sm text-slate-400 uppercase tracking-wider font-mono">Active Users</p>
            </div>
            <div className="text-center md:text-left space-y-1">
              <BarChart3 className="w-6 h-6 text-teal-400 mx-auto md:mx-0 mb-2" />
              <p className="text-3xl sm:text-4xl font-extrabold text-white">2.4M</p>
              <p className="text-xs sm:text-sm text-slate-400 uppercase tracking-wider font-mono">Tons CO₂ Reduced</p>
            </div>
            <div className="text-center md:text-left space-y-1">
              <TreePine className="w-6 h-6 text-emerald-400 mx-auto md:mx-0 mb-2" />
              <p className="text-3xl sm:text-4xl font-extrabold text-white">10M+</p>
              <p className="text-xs sm:text-sm text-slate-400 uppercase tracking-wider font-mono">Trees Planted</p>
            </div>
            <div className="text-center md:text-left space-y-1">
              <Flame className="w-6 h-6 text-amber-500 mx-auto md:mx-0 mb-2 animate-pulse" />
              <p className="text-3xl sm:text-4xl font-extrabold text-white">1.2M</p>
              <p className="text-xs sm:text-sm text-slate-400 uppercase tracking-wider font-mono">Active Streaks</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Capabilities Sections */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="space-y-4 max-w-3xl mx-auto mb-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Intelligent Tracking, Effortless Action
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            EcoTrack AI guides you through complex environmental calculations. No guesswork — just data-driven changes that make a difference.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col justify-between text-left hover:border-emerald-500/20 hover:bg-slate-900/60 transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center group-hover:bg-orange-500/20 group-hover:border-orange-500/30 transition-all">
                <Cpu className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white font-sans">AI Sustainability Advisor</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Receive proactive suggestions powered by real-time climate data. Receive immediate coaching summaries regarding transport, dieting, and electricity.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/80 text-xs font-mono text-emerald-400">
              ⚡ Powered by Gemini AI
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col justify-between text-left hover:border-teal-500/20 hover:bg-slate-900/60 transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center group-hover:bg-teal-500/20 group-hover:border-teal-500/30 transition-all">
                <BarChart3 className="w-6 h-6 text-teal-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white font-sans">Precision Carbon Tracking</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Log activities naturally via the AI carbon scanner. See visual charts detailing categories and monthly trend targets immediately.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/80 text-xs font-mono text-emerald-400">
              📊 High-fidelity analytical charts
            </div>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col justify-between text-left hover:border-emerald-500/20 hover:bg-slate-900/60 transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/20 group-hover:border-emerald-500/30 transition-all">
                <Award className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white font-sans">Gamified Progress</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Join weekly sustainability challenges. Level up, unlock regional badges, and climb the local green leaderboard with carbon-friendly habits.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/80 text-xs font-mono text-emerald-400">
              🏆 Levels & achievement badge shelf
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-12 text-slate-500 text-xs sm:text-sm text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex items-center justify-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="font-semibold text-slate-300 font-sans tracking-wide">EcoTrack AI</span>
          </div>
          <p>© {new Date().getFullYear()} EcoTrack AI Inc. Dedicated to a net-zero future.</p>
        </div>
      </footer>
    </div>
  );
}
