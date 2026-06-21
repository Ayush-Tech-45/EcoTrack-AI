/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Award,
  Flame,
  Users,
  Trophy,
  ChevronRight,
  CheckCircle2,
  Circle,
  FlameKindling,
  ShieldAlert,
  Gamepad2,
  CalendarDays,
  ListTodo
} from 'lucide-react';
import { Challenge, Badge, LeaderboardUser } from '../types';
import EcoArcadeView from './EcoArcadeView';

interface ChallengesViewProps {
  challenges: Challenge[];
  badges: Badge[];
  leaderboard: LeaderboardUser[];
  xp: number;
  level: number;
  streak: number;
  onJoinChallenge: (id: string) => void;
  onProgressChallenge: (id: string, amount: number) => void;
  onEarnRewards: (xpReward: number, scoreReward: number, reason: string) => void;
  initialSubTab?: 'daily' | 'weekly' | 'leaderboard' | 'arcade';
}

export default function ChallengesView({
  challenges,
  badges,
  leaderboard,
  xp,
  level,
  streak,
  onJoinChallenge,
  onProgressChallenge,
  onEarnRewards,
  initialSubTab = 'daily'
}: ChallengesViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'daily' | 'weekly' | 'leaderboard' | 'arcade'>(initialSubTab);

  // Filter challenges based on subcategory
  const filteredChallenges = challenges.filter((c) => c.category === activeSubTab);

  // Goal XP threshold calculation
  const nextLevelXp = 1000;
  const xpPercent = Math.min(100, Math.floor((xp / nextLevelXp) * 100));

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Challenges & Leagues
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Join community sustainability events, play eco games, and climb local ranks.
        </p>
      </div>

      {/* Profile Green Milestones Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Core Level and XP Wheel details */}
        <div className="md:col-span-8 rounded-2xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 flex-1 w-full text-left">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider font-mono">
                Level {level} Earth Guardian
              </span>
              <span className="text-slate-400 text-xs flex items-center gap-1 font-mono">
                <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> {streak} Day Streak
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-white font-sans">Level Progress</h3>
            <p className="text-xs text-slate-400">Earn {nextLevelXp - xp} XP more to rank up to Earth Sentinel!</p>

            {/* Custom styled progress slide */}
            <div className="relative pt-2">
              <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  style={{ width: `${xpPercent}%` }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1.5">
                <span>{xp} XP</span>
                <span>{nextLevelXp} XP</span>
              </div>
            </div>
          </div>

          <div className="w-24 h-24 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col items-center justify-center shrink-0 mx-auto md:mx-0">
            <Trophy className="w-8 h-8 text-emerald-400 mb-1" />
            <span className="text-lg font-extrabold text-white font-mono">{xp}</span>
            <span className="text-[9px] uppercase font-bold tracking-widest text-slate-500">Total XP</span>
          </div>
        </div>

        {/* Global Streak Counter Widget */}
        <div className="md:col-span-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">Daily Consistence</p>
          <div className="pt-2 text-left">
            <h3 className="text-4xl font-extrabold text-white flex items-center gap-2">
              {streak} <Flame className="w-8 h-8 text-amber-500" />
            </h3>
            <p className="text-xs text-slate-400 mt-2">
              Keep entering items in Daily Carbon Journal to protect your active multiplier indices!
            </p>
          </div>
        </div>
      </div>

      {/* Nested Sub-navigation for Challenges Category & Eco Arcade */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-900 pb-3">
        {[
          { id: 'daily', name: 'Daily Challenges', icon: <ListTodo className="w-4 h-4" /> },
          { id: 'weekly', name: 'Weekly Challenges', icon: <CalendarDays className="w-4 h-4" /> },
          { id: 'leaderboard', name: 'City Leaderboard', icon: <Trophy className="w-4 h-4" /> },
          { id: 'arcade', name: 'Eco Arcade', icon: <Gamepad2 className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
              activeSubTab === tab.id
                ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            {tab.icon}
            {tab.name}
          </button>
        ))}
      </div>

      {/* Main tab panel body content */}
      <div>
        {activeSubTab === 'arcade' ? (
          /* Render the modular premium Eco Arcade inside the tab */
          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/20 p-2 md:p-4">
            <EcoArcadeView onEarnRewards={onEarnRewards} userLevel={level} />
          </div>
        ) : activeSubTab === 'leaderboard' ? (
          /* Render city leaderboard panel */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                <Trophy className="w-5 h-5 text-amber-500" /> Current Regional League Standings
              </h3>
              
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden divide-y divide-slate-850">
                {leaderboard.map((user) => {
                  const isSelf = user.isCurrentUser;
                  return (
                    <div
                      key={user.rank}
                      className={`p-4 flex items-center justify-between gap-3 text-left transition-colors ${
                        isSelf
                          ? 'bg-emerald-500/10 border-l-4 border-l-emerald-400'
                          : 'hover:bg-slate-900/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Rank indicator */}
                        <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                          user.rank === 1 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          user.rank === 2 ? 'bg-slate-300/20 text-slate-300 border border-slate-300/30' :
                          user.rank === 3 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                          'text-slate-500'
                        }`}>
                          {user.rank}
                        </span>

                        {/* Avatar */}
                        <span className="text-lg select-none p-1 shrink-0">{user.avatar}</span>

                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white truncate flex items-center gap-1.5">
                            {user.name}
                            {isSelf && <span className="px-1.5 py-0.5 rounded text-[8px] bg-emerald-400 text-slate-950 font-bold uppercase font-mono">You</span>}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono">Level {user.level} Guardian</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-sm font-extrabold text-white font-mono">{user.points}</span>
                        <p className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Points</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-xl border border-slate-800 bg-slate-900/20 p-5 text-xs text-slate-400 text-left space-y-3">
                <span className="text-slate-300 text-sm font-bold flex items-center gap-1">🏆 Regional Challenger</span>
                <p className="leading-relaxed">
                  Leaderboard ranks refresh every Sunday. Build XP through challenges and Carbon Logging to reach higher tier brackets!
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Render Daily / Weekly challenges lists */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                <Award className="w-5 h-5 text-emerald-400" /> Active {activeSubTab === 'daily' ? 'Daily' : 'Weekly'} Actions
              </h3>

              <div className="grid grid-cols-1 gap-4">
                {filteredChallenges.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl border border-slate-800 bg-slate-900/10">
                    <p className="text-slate-500 text-xs font-medium">No active challenges available in this category.</p>
                  </div>
                ) : (
                  filteredChallenges.map((c) => {
                    const isJoined = c.joined;
                    const isCompleted = c.completed;
                    const progressPct = Math.min(100, Math.floor((c.progress / c.target) * 100));

                    return (
                      <div
                        key={c.id}
                        className={`rounded-2xl border p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-all ${
                          isCompleted
                            ? 'bg-emerald-950/10 border-emerald-500/20'
                            : isJoined
                            ? 'bg-slate-900/60 border-slate-700/85 shadow-md'
                            : 'bg-slate-900/30 border-slate-800/80 hover:border-slate-700'
                        }`}
                      >
                        <div className="space-y-2 flex-1 w-full text-left">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold font-mono bg-slate-950 text-slate-400 border border-slate-800">
                              {c.category}
                            </span>
                            <span className="text-xs text-emerald-400 font-bold font-mono">+{c.points} XP Awarded</span>
                          </div>

                          <h4 className="font-bold text-white text-base leading-tight flex items-center gap-2">
                            {isCompleted ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />}
                            {c.title}
                          </h4>
                          <p className="text-xs text-slate-400 leading-relaxed">{c.subtitle}</p>

                          {/* Progress bar if joined */}
                          {isJoined && (
                            <div className="pt-2">
                              <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono mb-1">
                                <span>Progress: {c.progress} / {c.target} {c.unit}</span>
                                <span>{progressPct}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                                <div
                                  style={{ width: `${progressPct}%` }}
                                  className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full"
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Operational Controls CTA */}
                        <div className="shrink-0 w-full sm:w-auto">
                          {isCompleted ? (
                            <span className="block px-4 py-2 text-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold font-mono">
                              Claimed ✓
                            </span>
                          ) : isJoined ? (
                            <button
                              id={`challenge-log-progress-${c.id}`}
                              onClick={() => onProgressChallenge(c.id, 1)}
                              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-extrabold transition-all cursor-pointer text-center active:scale-95"
                            >
                              Advance Goal (+1 {c.unit})
                            </button>
                          ) : (
                            <button
                              id={`challenge-join-${c.id}`}
                              onClick={() => onJoinChallenge(c.id)}
                              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer text-center"
                            >
                              Join Goal
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Achievement shelf representation */}
              <div className="space-y-3 pt-4 text-left">
                <h4 className="text-sm font-bold uppercase tracking-wider font-mono text-slate-400">My Achievement Badges</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {badges.map((b) => (
                    <div
                      key={b.id}
                      className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-center hover:bg-slate-900/60 transition-colors flex flex-col items-center justify-between"
                    >
                      <span className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${b.color} bg-slate-950 border border-slate-850 shadow-inner mb-3`}>
                        {b.icon}
                      </span>
                      <div>
                        <h5 className="text-xs font-bold text-white">{b.title}</h5>
                        <p className="text-[10px] text-slate-400 mt-1">Tier Level {b.level}</p>
                      </div>
                      
                      {/* Progress indices */}
                      <div className="w-full mt-3">
                        <div className="h-1 w-full bg-slate-950 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${b.progress}%` }}
                            className="h-full bg-emerald-400"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar info helper */}
            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-xl border border-slate-800 bg-slate-900/20 p-5 text-xs text-slate-400 text-left space-y-3">
                <span className="text-slate-300 text-sm font-bold flex items-center gap-1">🌱 Daily Conservation Habit</span>
                <p className="leading-relaxed">
                  Completing daily actions keeps your streaks intact. Streaks amplify active Eco points multipliers by 5% every day!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
