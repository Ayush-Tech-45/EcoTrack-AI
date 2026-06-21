/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Leaf, Plus, Sparkles, TrendingDown, ArrowRight, Zap, Bike, Salad, Thermometer, Timer } from 'lucide-react';
import { Activity } from '../types';

interface DashboardViewProps {
  score: number;
  activities: Activity[];
  onQuickLog: (name: string, type: 'transport' | 'food' | 'energy' | 'water' | 'other', value: number, detail: string) => void;
  onNavigateToJournal: () => void;
  onNavigateToAi: () => void;
}

export default function DashboardView({
  score,
  activities,
  onQuickLog,
  onNavigateToJournal,
  onNavigateToAi,
}: DashboardViewProps) {
  // Calculate stats based on activities
  const dailyOffset = activities
    .filter(a => a.date === new Date().toISOString().split('T')[0])
    .reduce((sum, a) => sum + a.value, 0);

  const monthlyOffset = activities.reduce((sum, a) => sum + a.value, 0);
  const annualOffsetEstimate = 4.5 + (monthlyOffset * 12) / 1000; // standard estimation multiplier

  // Get score feedback color and levels
  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-emerald-400 stroke-emerald-400';
    if (s >= 60) return 'text-teal-400 stroke-teal-400';
    if (s >= 40) return 'text-amber-400 stroke-amber-400';
    return 'text-rose-400 stroke-rose-400';
  };

  const getScoreFeedback = (s: number) => {
    if (s >= 80) return 'Great - Top 12% in your city!';
    if (s >= 60) return 'Solid - Good conservation efforts.';
    if (s >= 40) return 'Fair - Minor room for adjustments.';
    return 'Action Needed - High daily carbon draw.';
  };

  const recentActivities = [...activities].reverse().slice(0, 4);

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Header section */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Real-time tracking of your sustainable progress and carbon offsets.
        </p>
      </div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Eco Score Circular Progress Widget */}
        <div id="eco-score-widget" className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col items-center justify-center text-center">
          <h2 className="text-sm font-semibold uppercase tracking-wider font-mono text-slate-400 mb-6 flex items-center gap-2">
            <Leaf className="w-4 h-4 text-emerald-400" /> Eco Score
          </h2>
          
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* Background SVG Circle */}
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="64"
                className="stroke-slate-800"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r="64"
                className={`${getScoreColor(score)} transition-all duration-1000`}
                strokeWidth="10"
                fill="transparent"
                strokeDasharray="402"
                strokeDashoffset={402 - (402 * score) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold text-white font-sans">{score}</span>
              <span className="text-[10px] font-semibold text-slate-400 font-mono">/ 100</span>
            </div>
          </div>

          <div className="mt-6 space-y-1">
            <p className="text-sm font-semibold text-slate-200">
              {getScoreFeedback(score)}
            </p>
            <p className="text-xs text-slate-400">
              Score rises when logging emission offsets or clean transport.
            </p>
          </div>
        </div>

        {/* Carbon Stats Column Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Daily Footprint */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 flex flex-col justify-between group hover:border-slate-700 transition-all">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">Today's Footprint</p>
              <h3 className={`text-2xl sm:text-3xl font-extrabold font-sans tracking-tight ${dailyOffset <= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {dailyOffset > 0 ? `+${dailyOffset.toFixed(1)}` : dailyOffset.toFixed(1)} <span className="text-sm font-normal text-slate-400">kg</span>
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-4">
              {dailyOffset <= 0 ? '✓ Net savings today!' : '⚡ Emissions registered.'}
            </p>
          </div>

          {/* Monthly Footprint */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 flex flex-col justify-between group hover:border-slate-700 transition-all">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">Monthly Total</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-sans tracking-tight text-white">
                {monthlyOffset.toFixed(1)} <span className="text-sm font-normal text-slate-400">kg CO2</span>
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-4 flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Target context: 350kg/mo
            </p>
          </div>

          {/* Projected Annual */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 flex flex-col justify-between group hover:border-slate-700 transition-all">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">Annual Est.</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-sans tracking-tight text-white">
                {annualOffsetEstimate.toFixed(1)} <span className="text-sm font-normal text-slate-400">Tons</span>
              </h3>
            </div>
            <p className="text-xs text-emerald-400 mt-4 font-mono font-medium">
              ★ 34% below US National Avg
            </p>
          </div>
        </div>
      </div>

      {/* Two Columns: Recommendations & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Side: interactive AI Actions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-400" /> Active AI Recommendations
            </h3>
            <button
              id="dash-more-ai-btn"
              onClick={onNavigateToAi}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-1 cursor-pointer"
            >
              Ask Advisor <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Rec 1 */}
            <div className="rounded-xl border border-teal-500/20 bg-gradient-to-r from-teal-950/10 to-emerald-950/10 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                    Energy Saving
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Fast Carbon Hack</span>
                </div>
                <h4 className="font-bold text-white text-sm sm:text-base mt-2">Switch to cold laundry washes</h4>
                <p className="text-xs text-slate-400 max-w-sm">
                  Washing on cold cycles prevents heating grids from consuming unnecessary coal/gas currents.
                </p>
              </div>
              <button
                id="dash-rec-action-laundry"
                onClick={() => onQuickLog('Cold Laundry Cycle', 'energy', -1.2, 'Completed cold laundry load swap.')}
                className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold flex items-center gap-1 transition-all shrink-0 cursor-pointer active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" /> Log Saving (-1.2kg)
              </button>
            </div>

            {/* Rec 2 */}
            <div className="rounded-xl border border-emerald-500/10 bg-slate-900/40 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Transport Option
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Eco Transit</span>
                </div>
                <h4 className="font-bold text-white text-sm sm:text-base mt-2">Commuted via Bicycle</h4>
                <p className="text-xs text-slate-400 max-w-sm">
                  Swapping a 5-mile gasoline run with self-powered transport completely bypasses exhaust outputs.
                </p>
              </div>
              <button
                id="dash-rec-action-bike"
                onClick={() => onQuickLog('Bicycle Transit Run', 'transport', -4.5, 'Substituted gasoline transport with custom bicycle ride.')}
                className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1 transition-all shrink-0 cursor-pointer active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" /> Log Saving (-4.5kg)
              </button>
            </div>

            {/* Rec 3 */}
            <div className="rounded-xl border border-orange-500/10 bg-slate-900/40 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                    Food Alternative
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Dietary Pivot</span>
                </div>
                <h4 className="font-bold text-white text-sm sm:text-base mt-2">Enjoy a completely Plant-Based Lunch</h4>
                <p className="text-xs text-slate-400 max-w-sm">
                  Swapping proteins from beef or sheep meat decreases agricultural methane inputs.
                </p>
              </div>
              <button
                id="dash-rec-action-salad"
                onClick={() => onQuickLog('Plant-Based Lunch Swap', 'food', -2.1, 'Logged complete vegetarian salad/lunch item.')}
                className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-400 text-white text-xs font-bold flex items-center gap-1 transition-all shrink-0 cursor-pointer active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" /> Log Saving (-2.1kg)
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Recent Activity Ledger */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Timer className="w-5 h-5 text-emerald-400" /> Recent Action Ledger
            </h3>
            <button
              id="dash-more-ledger-btn"
              onClick={onNavigateToJournal}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-1 cursor-pointer"
            >
              Full Journal <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden">
            {recentActivities.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                No logged activities registered. Try the AI Recommendations or Daily Journal scanner!
              </div>
            ) : (
              <div className="divide-y divide-slate-800/60">
                {recentActivities.map((act) => {
                  const isSaving = act.value <= 0;
                  return (
                    <div key={act.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-900/30 transition-colors">
                      <div className="flex items-center gap-3 text-left">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs uppercase shrink-0 ${
                          act.type === 'transport' ? 'bg-indigo-500/10 text-indigo-400' :
                          act.type === 'food' ? 'bg-orange-500/10 text-orange-400' :
                          act.type === 'energy' ? 'bg-yellow-500/10 text-yellow-400' :
                          'bg-teal-500/10 text-teal-400'
                        }`}>
                          {act.type.slice(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white truncate">{act.name}</p>
                          <p className="text-xs text-slate-400 truncate">{act.detail}</p>
                        </div>
                      </div>
                      
                      <div className="text-right shrink-0">
                        <span className={`text-sm font-extrabold font-mono ${isSaving ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isSaving ? `${act.value.toFixed(1)} kg` : `+${act.value.toFixed(1)} kg`}
                        </span>
                        <p className="text-[10px] text-slate-500 mt-0.5">{act.date}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Stats Helper Footnote */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/20 p-4 text-xs text-slate-400 leading-relaxed text-left">
            💡 <strong>Carbon Calculation Fact:</strong> 1kg of average gasoline yields roughly 3.1kg CO2 during combustion. Choosing alternative transits offsets this equation!
          </div>
        </div>
      </div>
    </div>
  );
}
