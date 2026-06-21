/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Award,
  TreePine,
  Zap,
  Car,
  Droplets,
  Leaf,
  Calendar,
  Target,
  Settings,
  Bell,
  Lock,
  Smartphone,
  Check,
  Flame,
  ShieldCheck,
  Sparkles,
  Sliders,
  Gamepad2
} from 'lucide-react';
import { motion } from 'motion/react';
import { Activity, Badge } from '../types';

interface ProfileViewProps {
  score: number;
  xp: number;
  level: number;
  streak: number;
  activities: Activity[];
  userProfile: { name: string; avatar: string; email?: string };
  onUpdateProfile: (updates: { name: string; avatar: string; email?: string }) => void;
  onNavigateToTab?: (tab: 'dashboard' | 'journal' | 'ai' | 'challenges' | 'calculator' | 'profile' | 'arcade', subTab?: string) => void;
}

export default function ProfileView({
  score,
  xp,
  level,
  streak,
  activities,
  userProfile,
  onUpdateProfile,
  onNavigateToTab
}: ProfileViewProps) {
  // Account settings form state
  const [editName, setEditName] = useState(userProfile.name);
  const [editAvatar, setEditAvatar] = useState(userProfile.avatar);
  const [editEmail, setEditEmail] = useState(userProfile.email || 'citizen@ecotrack.ai');
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [privacyPublic, setPrivacyPublic] = useState(false);
  const [pwaOfflineCache, setPwaOfflineCache] = useState(true);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Sync edits when prop updates
  useEffect(() => {
    setEditName(userProfile.name);
    setEditAvatar(userProfile.avatar);
    setEditEmail(userProfile.email || 'citizen@ecotrack.ai');
  }, [userProfile]);

  // Dynamic calculations based on logged activities
  // Negative values are carbon savings.
  const carbonSavingsSum = activities
    .filter(act => act.value < 0)
    .reduce((sum, act) => sum + Math.abs(act.value), 0);

  // Baselines for profile, which grow as the user works
  const totalCarbonReduced = 245.8 + carbonSavingsSum; // in kg CO2e
  const treesEquivalent = (totalCarbonReduced / 18.2).toFixed(1); // 1 tree offsets ~18.2kg CO2e annually
  const energySavedKwh = (120 + carbonSavingsSum * 1.8).toFixed(0); 
  const carAvoidedMiles = (410 + carbonSavingsSum * 2.2).toFixed(0);
  const waterConservedGallons = (950 + carbonSavingsSum * 4.5).toFixed(0);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name: editName,
      avatar: editAvatar,
      email: editEmail
    });
    setSaveStatus('Profile coordinates successfully synchronized!');
    setTimeout(() => {
      setSaveStatus(null);
    }, 3000);
  };

  // Predefined badges structure to support achievements section
  const badgesList = [
    { title: 'Tree Planter', unlocked: true, desc: 'Avoided carbon equivalent of 10+ trees', icon: '🌳', color: 'text-emerald-400', theme: 'bg-emerald-500/10' },
    { title: 'Water Saver', unlocked: true, desc: 'Conserved over 1000 gallons of water', icon: '💧', color: 'text-sky-400', theme: 'bg-sky-500/10' },
    { title: 'Eco Explorer', unlocked: true, desc: 'Logged 5 or more sustainable journal activities', icon: '🧭', color: 'text-teal-400', theme: 'bg-teal-500/10' },
    { title: 'Carbon Crusher', unlocked: level >= 5 || totalCarbonReduced > 300, desc: 'Reached overall reduction of 300kg CO2e', icon: '💥', color: 'text-rose-400', theme: 'bg-rose-500/10' },
    { title: 'Earth Guardian', unlocked: level >= 6, desc: 'Achieved Sustainability Level 6 or higher', icon: '🛡️', color: 'text-violet-400', theme: 'bg-violet-500/10' }
  ];

  return (
    <div className="space-y-10 animate-fade-in text-left">
      
      {/* Upper User Hub Visual Glassmorphism Card */}
      <div className="rounded-3xl border border-slate-800/80 bg-slate-900/40 p-6 md:p-8 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
          {/* Avatar sphere */}
          <div className="w-24 h-24 rounded-full bg-slate-950 border-2 border-emerald-500/30 flex items-center justify-center text-5xl shadow-inner relative group select-none">
            {userProfile.avatar}
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 text-slate-950 text-xs font-bold flex items-center justify-center border-2 border-slate-950">
              {level}
            </div>
          </div>

          {/* User Details */}
          <div className="flex-1 text-center md:text-left space-y-3.5">
            <div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">{userProfile.name}</h1>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-wide uppercase font-mono">
                  Lvl {level} Guardian
                </span>
              </div>
              <p className="text-slate-400 text-sm mt-1">{editEmail}</p>
            </div>

            {/* Quick stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
              <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-850">
                <span className="text-xs text-slate-500 font-mono block">Eco Score</span>
                <span className="text-xl font-bold text-center text-emerald-400 block mt-0.5">{score}/100</span>
              </div>
              <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-850">
                <span className="text-xs text-slate-500 font-mono block">Current Streak</span>
                <span className="text-lg font-bold text-amber-500 flex items-center justify-center md:justify-start gap-1 mt-0.5">
                  <Flame className="w-4 h-4 text-amber-500 animate-pulse inline" /> {streak} Days
                </span>
              </div>
              <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-850">
                <span className="text-xs text-slate-500 font-mono block">Experience (XP)</span>
                <span className="text-xl font-bold text-teal-400 block mt-0.5">{xp} XP</span>
              </div>
              <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-850">
                <span className="text-xs text-slate-500 font-mono block">Total Points</span>
                <span className="text-xl font-bold text-indigo-400 block mt-0.5">{xp + (score * 5)} pts</span>
              </div>
            </div>

            {/* Quick Actions Row */}
            {onNavigateToTab && (
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider w-full sm:w-auto">Quick Services:</span>
                <button
                  id="profile-launch-wizard-btn"
                  onClick={() => onNavigateToTab('calculator')}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/20 text-xs font-bold flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  Launch Footprint Wizard
                </button>
                <button
                  id="profile-launch-arcade-btn"
                  onClick={() => onNavigateToTab('challenges', 'arcade')}
                  className="px-3.5 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/25 text-teal-400 border border-teal-500/20 text-xs font-bold flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                  <Gamepad2 className="w-3.5 h-3.5" />
                  Play Eco Arcade Games
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION A : IMPACT SUMMARY */}
      <div className="space-y-4">
        <div className="flex items-center gap-2.5">
          <Leaf className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg sm:text-xl font-bold text-white font-sans">Section A: Personal Impact Summary</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          
          {/* Card 1: Trees Equivalent */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-4 flex flex-col justify-between hover:border-emerald-500/20 hover:bg-slate-900/50 transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <TreePine className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{treesEquivalent}</p>
                <p className="text-[11px] text-slate-400 font-medium">Trees Equivalent Saved</p>
              </div>
            </div>
          </div>

          {/* Card 2: Energy Saved */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-4 flex flex-col justify-between hover:border-yellow-500/20 hover:bg-slate-900/50 transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{energySavedKwh} cWh</p>
                <p className="text-[11px] text-slate-400 font-medium">Electricity Energy Saved</p>
              </div>
            </div>
          </div>

          {/* Card 3: Car Avoided */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-4 flex flex-col justify-between hover:border-rose-500/20 hover:bg-slate-900/50 transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                <Car className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{carAvoidedMiles} mi</p>
                <p className="text-[11px] text-slate-400 font-medium">Car Travel Extrapolated</p>
              </div>
            </div>
          </div>

          {/* Card 4: Water Conserved */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-4 flex flex-col justify-between hover:border-sky-500/20 hover:bg-slate-900/50 transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                <Droplets className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{waterConservedGallons} gal</p>
                <p className="text-[11px] text-slate-400 font-medium">Water Volume Preserved</p>
              </div>
            </div>
          </div>

          {/* Card 5: Carbon Reduced */}
          <div className="col-span-2 md:col-span-1 rounded-2xl border border-slate-800 bg-slate-900/30 p-4 flex flex-col justify-between hover:border-teal-500/20 hover:bg-slate-900/50 transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-400">-{totalCarbonReduced.toFixed(1)} kg</p>
                <p className="text-[11px] text-slate-400 font-medium">CO2e Carbon Reduced</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION B & D SIDE-BY-SIDE GRIDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* SECTION B : SUSTAINABILITY JOURNEY TIMELINE */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg sm:text-xl font-bold text-white font-sans">Section B: Sustainability Journey</h2>
          </div>

          <div className="bg-slate-900/20 border border-slate-850 p-6 rounded-2xl space-y-6 relative overflow-hidden">
            <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-slate-800" />

            {/* Timeline Item 1 */}
            <div className="flex gap-4 relative z-10">
              <div className="w-4 h-4 rounded-full bg-emerald-500 border-4 border-slate-950 flex-shrink-0 mt-1 ml-1" />
              <div>
                <p className="text-xs font-mono text-slate-500">December 15, 2025</p>
                <h4 className="text-sm font-bold text-slate-100">Joined EcoTrack AI</h4>
                <p className="text-xs text-slate-400 mt-1">Began tracking the carbon offsets of daily selections and commutes.</p>
              </div>
            </div>

            {/* Timeline Item 2 */}
            <div className="flex gap-4 relative z-10">
              <div className="w-4 h-4 rounded-full bg-emerald-500 border-4 border-slate-950 flex-shrink-0 mt-1 ml-1" />
              <div>
                <p className="text-xs font-mono text-slate-500">December 16, 2025</p>
                <h4 className="text-sm font-bold text-slate-100">First Journal Entry Logged</h4>
                <p className="text-xs text-slate-400 mt-1">Tracked vegetarian recipe swap saving 2.1kg carbon.</p>
              </div>
            </div>

            {/* Timeline Item 3 */}
            <div className="flex gap-4 relative z-10">
              <div className="w-4 h-4 rounded-full bg-emerald-500 border-4 border-slate-950 flex-shrink-0 mt-1 ml-1" />
              <div>
                <p className="text-xs font-mono text-slate-500">December 20, 2025</p>
                <h4 className="text-sm font-bold text-slate-100">First Challenge Completed</h4>
                <p className="text-xs text-slate-400 mt-1">Successfully completed the 'Zero Plastic Packaging' challenge.</p>
              </div>
            </div>

            {/* Timeline Item 4 */}
            <div className="flex gap-4 relative z-10">
              <div className="w-4 h-4 rounded-full bg-emerald-500 border-4 border-slate-950 flex-shrink-0 mt-1 ml-1" />
              <div>
                <p className="text-xs font-mono text-slate-500">January 02, 2026</p>
                <h4 className="text-sm font-bold text-slate-100">First Badge Earned</h4>
                <p className="text-xs text-slate-400 mt-1">Unlocked the 'Forest Protector' achievement medal shelf.</p>
              </div>
            </div>

            {/* Timeline Item 5 */}
            <div className="flex gap-4 relative z-10">
              <div className={`w-4 h-4 rounded-full ${score >= 90 ? 'bg-emerald-500' : 'bg-slate-700'} border-4 border-slate-950 flex-shrink-0 mt-1 ml-1`} />
              <div>
                <p className="text-xs font-mono text-slate-500">Milestone Checkpoint</p>
                <h4 className={`text-sm font-bold ${score >= 90 ? 'text-slate-100' : 'text-slate-500'}`}>Reached Eco Score 90+</h4>
                <p className="text-xs text-slate-500 mt-1">Maintain consistent negative emissions logs to level up score.</p>
              </div>
            </div>

            {/* Timeline Item 6 */}
            <div className="flex gap-4 relative z-10">
              <div className={`w-4 h-4 rounded-full ${level >= 5 ? 'bg-emerald-500' : 'bg-slate-700'} border-4 border-slate-950 flex-shrink-0 mt-1 ml-1`} />
              <div>
                <p className="text-xs font-mono text-slate-500">Advanced Milestone</p>
                <h4 className={`text-sm font-bold ${level >= 5 ? 'text-slate-100' : 'text-slate-500'}`}>Reached Level 5</h4>
                <p className="text-xs text-slate-500 mt-1">Requires 1000 total experience points on the regional leaderboard.</p>
              </div>
            </div>

          </div>
        </div>

        {/* SECTION D : GOALS TRACKER */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <Target className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg sm:text-xl font-bold text-white font-sans">Section D: Sustainability Goals</h2>
          </div>

          <div className="bg-slate-900/20 border border-slate-850 p-6 rounded-2xl space-y-6 relative overflow-hidden">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">Active Target Goal</span>
              <h3 className="text-base font-bold text-slate-100">Monthly Transport Carbon Offset</h3>
              <p className="text-xs text-slate-400">Reduce short distance solo car commute loops using bicycles or public buses.</p>
            </div>

            {/* Progress Bar representation */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Goal Target Completion Progress</span>
                <span className="font-bold text-emerald-400">68%</span>
              </div>
              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all rounded-full" style={{ width: '68%' }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 text-xs border-t border-slate-850">
              <div>
                <span className="text-slate-500 font-mono block">Remaining Target</span>
                <span className="font-bold text-white block mt-0.5">15.4 kg CO2e</span>
              </div>
              <div>
                <span className="text-slate-500 font-mono block">Estimated Completion</span>
                <span className="font-bold text-white block mt-0.5">June 25, 2026</span>
              </div>
            </div>

            {/* Custom Interactive Motivation Block */}
            <div className="p-3.5 rounded-xl bg-indigo-500/5 border border-indigo-500/10 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-400 leading-relaxed">
                Tip: Completing the <strong>Eco Arcade games</strong> increases environmental index knowledge and boosts your active score indices!
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* SECTION C : ACHIEVEMENTS (BADGES) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2.5">
          <Award className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg sm:text-xl font-bold text-white font-sans">Section C: Earned Achievements Shelf</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {badgesList.map((badge, idx) => (
            <div
              key={idx}
              className={`rounded-2xl border ${
                badge.unlocked ? 'border-slate-800 bg-slate-900/30' : 'border-slate-900 bg-slate-950/20 opacity-40'
              } p-4 text-center space-y-3 hover:border-slate-700 transition-all relative overflow-hidden group`}
            >
              <div className={`w-14 h-14 rounded-full ${badge.theme || 'bg-slate-900'} flex items-center justify-center text-3xl mx-auto shadow-inner`}>
                {badge.icon}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200 block truncate">{badge.title}</p>
                <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">{badge.desc}</p>
              </div>
              {badge.unlocked && (
                <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-400/20">
                  <span className="text-[8px] text-emerald-400 font-bold">✓</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SECTION E : ACCOUNT SETTINGS */}
      <div className="space-y-4">
        <div className="flex items-center gap-2.5">
          <Settings className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg sm:text-xl font-bold text-white font-sans">Section E: Account Settings & App Preferences</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Edit Profile coordinates form */}
          <div className="lg:col-span-7 bg-slate-900/20 border border-slate-850 p-6 rounded-2xl relative">
            <h3 className="text-sm font-bold text-slate-200 mb-4 uppercase tracking-wider font-mono">My Profile</h3>
            
            <form onSubmit={handleProfileSave} className="space-y-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-bold block" htmlFor="edit-profile-name">Nickname</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      id="edit-profile-name"
                      type="text"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9.5 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-bold block" htmlFor="edit-profile-avatar">Avatarian Icon</label>
                  <select
                    id="edit-profile-avatar"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 h-[38px]"
                    value={editAvatar}
                    onChange={(e) => setEditAvatar(e.target.value)}
                  >
                    <option value="🌱">🌱 Sprout</option>
                    <option value="🌲">🌲 Pine Tree</option>
                    <option value="🍀">🍀 Clover</option>
                    <option value="🌍">🌍 Earth</option>
                    <option value="🦊">🦊 Fox</option>
                    <option value="🚴‍♂️">🚴‍♂️ Bicycle Racer</option>
                    <option value="☀️">☀️ Solar Sun</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-bold block" htmlFor="edit-profile-email">Synchronized Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    id="edit-profile-email"
                    type="email"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9.5 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                  />
                </div>
              </div>

              {saveStatus && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4" /> {saveStatus}
                </div>
              )}

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all cursor-pointer active:scale-95"
              >
                Save Changes
              </button>
            </form>
          </div>

          {/* Core System parameters */}
          <div className="lg:col-span-5 bg-slate-900/20 border border-slate-850 p-6 rounded-2xl relative space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">Device Settings</h3>
              
              <div className="space-y-4 text-xs">
                
                {/* Notifications info */}
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="font-semibold text-slate-300 block">Eco Smart Alerts</span>
                      <span className="text-[10px] text-slate-500">Reminders regarding weekly challenges</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded accent-emerald-500"
                    checked={notifEnabled}
                    onChange={(e) => setNotifEnabled(e.target.checked)}
                  />
                </div>

                {/* Privacy setup */}
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="font-semibold text-slate-300 block">Public Leaderboard</span>
                      <span className="text-[10px] text-slate-500">Display your level and XP to local users</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded accent-emerald-500"
                    checked={privacyPublic}
                    onChange={(e) => setPrivacyPublic(e.target.checked)}
                  />
                </div>

                {/* Dark mode state */}
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="font-semibold text-slate-300 block">Dark Solar Theme</span>
                      <span className="text-[10px] text-slate-500">Premium eye-safe low electricity theme</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold font-mono text-[9px] uppercase">
                    Always On
                  </span>
                </div>

                {/* PWA Settings */}
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="font-semibold text-slate-300 block">PWA Standalone Cache</span>
                      <span className="text-[10px] text-slate-500">Offline indexed storage persistence</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded accent-emerald-500"
                    checked={pwaOfflineCache}
                    onChange={(e) => setPwaOfflineCache(e.target.checked)}
                  />
                </div>

              </div>
            </div>

            <div className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10 text-[11px] text-slate-400 flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Registered account secure local ledger authenticated.</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
