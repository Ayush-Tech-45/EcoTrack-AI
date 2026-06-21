/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Leaf, Cpu, Play, ClipboardList, Info, Trash2, ArrowUpRight, TrendingDown, RefreshCcw } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Activity } from '../types';

interface JournalViewProps {
  activities: Activity[];
  onAddAnalysisResult: (score: number, items: Omit<Activity, 'id' | 'date'>[]) => void;
  onClearHistory: () => void;
  onDeleteActivity: (id: string) => void;
}

export default function JournalView({
  activities,
  onAddAnalysisResult,
  onClearHistory,
  onDeleteActivity
}: JournalViewProps) {
  // Input fields
  const [journalText, setJournalText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Scanned item in current staging window
  const [stagedResult, setStagedResult] = useState<{
    dailyScore: number;
    totalModifier: number;
    activities: { type: 'transport' | 'food' | 'energy' | 'water' | 'other'; name: string; value: number; detail: string }[];
    suggestions: string[];
  } | null>(null);

  // Quick prompt suggestions
  const quickPrompts = [
    "I biked 6 miles to work, had a vegan salad, and washed clothes in cold water.",
    "Bussed 10 miles, had beef steak for lunch, watched 4 hours of tv.",
    "Worked from home all day, turned off unused appliances, prepared a poultry sandwich."
  ];

  const handleAnalyze = async (textToAnalyze: string) => {
    if (!textToAnalyze.trim()) return;
    setAnalyzing(true);
    setErrorMsg("");
    setStagedResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToAnalyze })
      });

      if (!res.ok) {
        throw new Error("Unable to contact backend carbon analyzer.");
      }

      const data = await res.json();
      setStagedResult({
        dailyScore: data.dailyScore || 70,
        totalModifier: data.totalSelectedCarbonModifier || 0.0,
        activities: data.activities || [],
        suggestions: data.suggestions || []
      });
    } catch (e: any) {
      setErrorMsg("Failed to parse footprint metrics. Please check connection and retry.");
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSaveStaged = () => {
    if (!stagedResult) return;
    onAddAnalysisResult(stagedResult.dailyScore, stagedResult.activities);
    setStagedResult(null);
    setJournalText("");
  };

  // --- CHART CALCULATIONS ---
  // Category Share (Pie Chart)
  const categorySummary: { [key: string]: number } = { transport: 0, food: 0, energy: 0, water: 0, other: 0 };
  activities.forEach(a => {
    // Keep positive values only or aggregate absolute factors
    categorySummary[a.type] += Math.abs(a.value);
  });

  const pieData = Object.keys(categorySummary)
    .map(key => ({
      name: key.toUpperCase(),
      value: parseFloat(categorySummary[key].toFixed(1))
    }))
    .filter(item => item.value > 0);

  // Fallback pie data if no activities
  const displayPieData = pieData.length > 0 ? pieData : [
    { name: 'TRANSPORT', value: 8 },
    { name: 'FOOD', value: 5 },
    { name: 'ENERGY', value: 3 },
    { name: 'WATER', value: 1 }
  ];

  const COLORS = ['#6366f1', '#f97316', '#eab308', '#14b8a6', '#a855f7'];

  // Trend Tracker (Bar Chart over last 5 distinct dates)
  const dateMap: { [key: string]: number } = {};
  activities.forEach(a => {
    // Sum absolute values
    dateMap[a.date] = (dateMap[a.date] || 0) + a.value;
  });

  const rawTrend = Object.keys(dateMap).map(date => ({
    date: date.substring(5), // showing M-D
    CO2: parseFloat(dateMap[date].toFixed(1))
  })).sort((a, b) => a.date.localeCompare(b.date));

  const displayTrendData = rawTrend.length > 0 ? rawTrend : [
    { date: '06-05', CO2: 4.5 },
    { date: '06-06', CO2: 2.1 },
    { date: '06-07', CO2: -1.2 },
    { date: '06-08', CO2: 3.8 },
    { date: '06-09', CO2: -0.8 }
  ];

  return (
    <div className="space-y-8 animate-fade-in text-left">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Daily Carbon Journal
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Scan your daily schedule using intelligence to calculate and catalog carbon offsets.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Scanner and Staging (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-400" /> AI Carbon Scanner
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Describe your day's sequence in simple language (e.g. <em>"I walked to my cafe, rode an electric scooter for 3 miles, and ate a meatless burger."</em>). Our system extracts indices automatically!
            </p>

            <textarea
              id="ai-journal-text-area"
              rows={4}
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              placeholder="Type description of your day here..."
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-4 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-600"
            />

            {errorMsg && (
              <div className="text-xs text-rose-500 font-medium bg-rose-500/10 border border-rose-500/20 rounded-lg p-3">
                {errorMsg}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              {/* Quick Prompts */}
              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">Suggestions:</span>
                {quickPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    id={`journal-prompt-${idx}`}
                    onClick={() => {
                      setJournalText(p);
                      handleAnalyze(p);
                    }}
                    className="text-[10px] text-slate-400 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded px-2 py-1 transition-all cursor-pointer"
                  >
                    Short Demo {idx + 1}
                  </button>
                ))}
              </div>

              <button
                id="journal-analyze-btn"
                disabled={analyzing || !journalText.trim()}
                onClick={() => handleAnalyze(journalText)}
                className="px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold transition-all text-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                {analyzing ? (
                  <>
                    <RefreshCcw className="w-4 h-4 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Analyze Impact
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Staging Result Window after Analysis */}
          {stagedResult && (
            <div id="journal-scanner-results" className="rounded-2xl border border-teal-500/20 bg-gradient-to-b from-teal-950/10 to-slate-900/40 p-6 space-y-6 animate-fade-in relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 bg-teal-500/10 border-b border-l border-teal-500/10 text-[10px] font-mono text-teal-400 font-bold rounded-bl-xl uppercase">
                Staged Analysis
              </div>

              <div className="flex items-center gap-4 text-left">
                <div className="w-14 h-14 rounded-full bg-teal-500/10 border border-teal-500/20 flex flex-col items-center justify-center shrink-0">
                  <span className="text-xl font-extrabold text-white">{stagedResult.dailyScore}</span>
                  <span className="text-[8px] uppercase font-mono font-bold text-teal-400">Score</span>
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Carbon Modification</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Net modifier change: <strong className={stagedResult.totalModifier <= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                      {stagedResult.totalModifier > 0 ? `+${stagedResult.totalModifier}` : stagedResult.totalModifier} kg CO2e
                    </strong>
                  </p>
                </div>
              </div>

              {/* Extracted Activity Listings */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">Parsed Items ({stagedResult.activities.length})</p>
                <div className="divide-y divide-slate-800 bg-slate-950/40 border border-slate-800/80 rounded-xl overflow-hidden text-left">
                  {stagedResult.activities.map((item, idx) => {
                    const isSaving = item.value <= 0;
                    return (
                      <div key={idx} className="p-4 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${isSaving ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                            {item.name}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">{item.detail}</p>
                        </div>
                        <span className={`text-sm font-extrabold font-mono shrink-0 ${isSaving ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isSaving ? `${item.value.toFixed(1)} kg` : `+${item.value.toFixed(1)} kg`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Suggestions bullets */}
              {stagedResult.suggestions.length > 0 && (
                <div className="space-y-2 text-left">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">Advisor Recommendations</p>
                  <ul className="text-xs text-slate-300 space-y-1.5 pl-5 list-disc">
                    {stagedResult.suggestions.map((sug, sIdx) => (
                      <li key={sIdx}>{sug}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Save / Discard */}
              <div className="flex gap-4 pt-2">
                <button
                  id="journal-discard-analysis-btn"
                  onClick={() => setStagedResult(null)}
                  className="flex-1 py-3 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-slate-300 font-semibold text-xs transition-colors cursor-pointer text-center"
                >
                  Discard
                </button>
                <button
                  id="journal-save-analysis-btn"
                  onClick={handleSaveStaged}
                  className="flex-1 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20 cursor-pointer text-center"
                >
                  Confirm & Write to Ledger
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: High fidelity charts (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Chart 1: Categories Shares */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-slate-400 mb-4 flex items-center justify-between">
              <span>Category Share (Abs CO2e)</span>
              <Info className="w-4 h-4 text-slate-600 cursor-help" title="Absolute sum of carbon modified per category" />
            </h3>

            <div className="h-48 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={displayPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {displayPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs text-slate-400 font-mono">Impact Shares</span>
              </div>
            </div>

            {/* Micro Legends */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center pt-2">
              {displayPieData.map((d, index) => (
                <div key={d.name} className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                  <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span>{d.name} ({d.value}kg)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chart 2: Monthly Trends */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-slate-400 mb-4 flex items-center justify-between">
              <span>Day-to-day Carbon Trends</span>
              <TrendingDown className="w-4 h-4 text-emerald-400" />
            </h3>

            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={displayTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="date" stroke="#64748b" fontSize={9} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={9} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff', fontSize: '11px' }}
                  />
                  <Bar dataKey="CO2" radius={[4, 4, 0, 0]}>
                    {displayTrendData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.CO2 <= 0 ? '#10b981' : '#f43f5e'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[10px] text-slate-500 text-center mt-2 font-mono">
              Green columns denote direct offset savings, Red denotes net additions in kg CO2e.
            </p>
          </div>
        </div>
      </div>

      {/* Ledger History List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-emerald-400" /> Persistent Activity Ledger ({activities.length})
          </h3>
          {activities.length > 0 && (
            <button
              id="journal-clear-history-btn"
              onClick={onClearHistory}
              className="text-xs text-rose-400 hover:text-rose-300 font-mono flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
          )}
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/30 overflow-hidden">
          {activities.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm space-y-2">
              <ClipboardList className="w-10 h-10 text-slate-700 mx-auto" />
              <p>No logged activities in persistent cache.</p>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Use the AI Carbon Scanner input above to type in your daily actions and click analyze!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/60 text-left">
              {[...activities].reverse().map((act) => {
                const isSaving = act.value <= 0;
                return (
                  <div key={act.id} className="p-5 flex items-center justify-between gap-6 hover:bg-slate-900/40 transition-colors">
                    <div className="flex items-center gap-4">
                      {/* Badge Icon depending on category */}
                      <span className={`px-2 py-1.5 rounded-lg text-xs uppercase font-bold font-mono ${
                        act.type === 'transport' ? 'bg-indigo-500/10 text-indigo-400' :
                        act.type === 'food' ? 'bg-orange-500/10 text-orange-400' :
                        act.type === 'energy' ? 'bg-yellow-500/10 text-yellow-400' :
                        act.type === 'water' ? 'bg-cyan-500/10 text-cyan-400' :
                        'bg-purple-500/10 text-purple-400'
                      }`}>
                        {act.type}
                      </span>

                      <div>
                        <p className="text-sm font-bold text-white flex items-center gap-2">
                          {act.name}
                          <span className="text-[10px] font-mono text-slate-500 font-normal">{act.date}</span>
                        </p>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{act.detail}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className={`text-sm font-extrabold font-mono ${isSaving ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isSaving ? `${act.value.toFixed(1)} kg` : `+${act.value.toFixed(1)} kg`}
                      </span>

                      <button
                        id={`delete-activity-${act.id}`}
                        onClick={() => onDeleteActivity(act.id)}
                        className="p-1.5 rounded-md hover:bg-rose-500/10 text-slate-600 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Delete entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
