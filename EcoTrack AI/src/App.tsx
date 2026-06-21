/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Leaf,
  Home,
  ClipboardList,
  Sparkles,
  Award,
  Sliders,
  Smartphone,
  LogOut,
  User,
  Menu,
  X,
  Flame,
  Globe,
  Gamepad2,
  ChevronDown,
  Bell,
  Settings
} from 'lucide-react';

import { Activity, Message, Challenge, Badge, LeaderboardUser, CalculatorData } from './types';
import LandingView from './components/LandingView';
import DashboardView from './components/DashboardView';
import JournalView from './components/JournalView';
import AiView from './components/AiView';
import ChallengesView from './components/ChallengesView';
import CalculatorView from './components/CalculatorView';
import PwaModal from './components/PwaModal';
import AuthView from './components/AuthView';
import ProfileView from './components/ProfileView';
import EcoArcadeView from './components/EcoArcadeView';

export default function App() {
  // Session authentication state ('landing' | 'auth_login' | 'auth_signup' | 'logged_in')
  const [sessionState, setSessionState] = useState<'landing' | 'auth_login' | 'auth_signup' | 'logged_in'>('landing');
  
  // Navigation tabs: 'dashboard' | 'journal' | 'ai' | 'challenges' | 'calculator' | 'profile' | 'arcade'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'journal' | 'ai' | 'challenges' | 'calculator' | 'profile' | 'arcade'>('dashboard');

  // Mobile menu open
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Trigger Install PWA modal
  const [showPwaModal, setShowPwaModal] = useState(false);

  // Profile menu dropdown toggle
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Notifications popover toggle
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Currently open sub tab inside Challenges View
  const [challengesSubTab, setChallengesSubTab] = useState<'daily' | 'weekly' | 'leaderboard' | 'arcade'>('daily');

  // Interactive system notifications list
  const [notifications, setNotifications] = useState<Array<{ id: string; text: string; time: string; read: boolean }>>([
    { id: 'notif-1', text: 'Flame streak conserved! Keep logging carbon offsets to increase multiplier level.', time: '10m ago', read: false },
    { id: 'notif-2', text: 'New weekly event uploaded: Grid Guardian is active now.', time: '2h ago', read: false },
    { id: 'notif-3', text: 'You unlocked the "Water Saver" Tier 1 badge milestone!', time: '1d ago', read: true }
  ]);

  // --- STATE FOR GAME ENGINE AND LOGS ---
  const [score, setScore] = useState<number>(82);
  const [xp, setXp] = useState<number>(740);
  const [level, setLevel] = useState<number>(4);
  const [streak, setStreak] = useState<number>(4);

  // Persistent activities cache
  const [activities, setActivities] = useState<Activity[]>([]);

  // Advisor Chat logs
  const [messages, setMessages] = useState<Message[]>([]);

  // Challenges indicators
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  // Badge list
  const [badges, setBadges] = useState<Badge[]>([]);

  // User Profile
  const [userProfile, setUserProfile] = useState<{ name: string; avatar: string; email?: string }>({
    name: 'GreenCitizen #48',
    avatar: '🌱',
    email: 'citizen@ecotrack.ai'
  });

  // Load state from localStorage on mount
  useEffect(() => {
    // Activities
    const cachedActs = localStorage.getItem('ecotrack_activities');
    if (cachedActs) {
      setActivities(JSON.parse(cachedActs));
    } else {
      // Seed nice initial state logs so dashboard never feels empty
      const demoActs: Activity[] = [
        {
          id: 'demo-1',
          type: 'food',
          name: 'Plant-Based Lunch Swap',
          value: -2.1,
          detail: 'Substituted standard animal protein lunch for locally sourced legumes.',
          date: new Date(Date.now() - 24 * 3600 * 1000).toISOString().split('T')[0] // yesterday
        },
        {
          id: 'demo-2',
          type: 'energy',
          name: 'Home Appliance cold Wash',
          value: -1.2,
          detail: 'Swapped normal wash cycles to cold water mode saving electric wattage.',
          date: new Date().toISOString().split('T')[0]
        },
        {
          id: 'demo-3',
          type: 'transport',
          name: 'Bivalve gasoline Car commute',
          value: 4.5,
          detail: 'Commuted 10 miles to the office in a gasoline engine car.',
          date: new Date().toISOString().split('T')[0]
        }
      ];
      setActivities(demoActs);
      localStorage.setItem('ecotrack_activities', JSON.stringify(demoActs));
    }

    // Chat history
    const cachedChat = localStorage.getItem('ecotrack_chat');
    if (cachedChat) {
      setMessages(JSON.parse(cachedChat));
    } else {
      const defaultChat: Message[] = [
        {
          id: 'init-1',
          sender: 'ai',
          text: "Welcome back! I am Eco Advisor AI, your personal sustainability advisor. \n\nI can calculate emissions from your commute, help you cut back packaging wastes, or optimize your diet selections. Try typing one of the prompt shortcuts or type custom entries!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];
      setMessages(defaultChat);
      localStorage.setItem('ecotrack_chat', JSON.stringify(defaultChat));
    }

    // Gamification properties
    const cachedGamified = localStorage.getItem('ecotrack_gamified');
    if (cachedGamified) {
      const gamified = JSON.parse(cachedGamified);
      setScore(gamified.score ?? 82);
      setXp(gamified.xp ?? 740);
      setLevel(gamified.level ?? 4);
      setStreak(gamified.streak ?? 4);
    }

    // Challenges catalog setup
    setChallenges([
      {
        id: 'ch-1',
        title: 'Zero Gasoline Transit',
        subtitle: 'Walk, cycle, or commute with zero emission transports for 5 miles today.',
        category: 'daily',
        points: 150,
        progress: 2,
        target: 5,
        unit: 'mi',
        joined: true,
        completed: false,
        icon: '🚲'
      },
      {
        id: 'ch-2',
        title: 'Zero Plastic Packaging Day',
        subtitle: 'Decline single-use plastic cups, containers, or cutlery for 24 hours.',
        category: 'daily',
        points: 80,
        progress: 1,
        target: 1,
        unit: 'Day',
        joined: true,
        completed: true,
        icon: '🚯'
      },
      {
        id: 'ch-3',
        title: 'Weekend Grid Guardian',
        subtitle: 'Keep household high-power water heaters or dryers inactive on Saturday and Sunday.',
        category: 'weekly',
        points: 250,
        progress: 0,
        target: 2,
        unit: 'Days',
        joined: false,
        completed: false,
        icon: '🔌'
      }
    ]);

    // Badges collection setup
    setBadges([
      { id: 'b-1', title: 'Carbon Fighter', level: 2, progress: 80, icon: '🔥', color: 'text-amber-400' },
      { id: 'b-2', title: 'Forest Protector', level: 3, progress: 100, icon: '🌲', color: 'text-emerald-400' },
      { id: 'b-3', title: 'Home Wattage Wizard', level: 1, progress: 45, icon: '⚡', color: 'text-yellow-400' },
      { id: 'b-4', title: 'Eco Commuter', level: 1, progress: 10, icon: '🚲', color: 'text-teal-400' }
    ]);

  }, []);

  // Save Activities whenever changed
  const saveActivitiesToCache = (newActs: Activity[]) => {
    setActivities(newActs);
    localStorage.setItem('ecotrack_activities', JSON.stringify(newActs));
  };

  // Save Gamification scores whenever updated
  const saveGamifiedToCache = (newScore: number, newXp: number, newLevel: number, newStreak: number) => {
    setScore(newScore);
    setXp(newXp);
    setLevel(newLevel);
    setStreak(newStreak);
    localStorage.setItem('ecotrack_gamified', JSON.stringify({
      score: newScore,
      xp: newXp,
      level: newLevel,
      streak: newStreak
    }));
  };

  // Update Game scores & XP on additions
  const adjustMetricsOnAdd = (itemValue: number) => {
    let freshScore = score;
    let freshXp = xp;
    let freshLevel = level;

    if (itemValue <= 0) {
      // Saving/Offset logged. Eco score increases. Gain XP!
      const bonusScore = Math.floor(Math.abs(itemValue) * 3);
      freshScore = Math.min(100, score + bonusScore);

      const bonusXp = Math.floor(Math.abs(itemValue) * 20);
      freshXp = xp + bonusXp;

      // Handle level scale trigger
      if (freshXp >= 1000) {
        freshLevel = level + 1;
        freshXp = freshXp - 1000;
        // Seed visual browser notification / feedback
      }
    } else {
      // Emission logged. Eco score drops slightly
      const penalty = Math.floor(itemValue * 1.5);
      freshScore = Math.max(1, score - penalty);
    }

    saveGamifiedToCache(freshScore, freshXp, freshLevel, streak);
  };

  // --- COMPONENT HANDLERS ---
  const handleQuickLog = (name: string, type: 'transport' | 'food' | 'energy' | 'water' | 'other', value: number, detail: string) => {
    const freshAct: Activity = {
      id: String(Date.now()),
      type,
      name,
      value,
      detail,
      date: new Date().toISOString().split('T')[0]
    };
    const updated = [...activities, freshAct];
    saveActivitiesToCache(updated);
    adjustMetricsOnAdd(value);
  };

  const handleAddAnalysisResult = (scannedScore: number, items: Omit<Activity, 'id' | 'date'>[]) => {
    // Generate individual dates
    const dateToday = new Date().toISOString().split('T')[0];
    const newLoggedActs: Activity[] = items.map((itm, i) => ({
      id: `ai-parsed-${Date.now()}-${i}`,
      type: itm.type,
      name: itm.name,
      value: itm.value,
      detail: itm.detail,
      date: dateToday
    }));

    const updated = [...activities, ...newLoggedActs];
    saveActivitiesToCache(updated);

    // Sum overall modifications for XP bumps
    const totalModifier = items.reduce((sum, item) => sum + item.value, 0);

    // Calculate score
    let finalScore = score;
    if (totalModifier <= 0) {
      finalScore = Math.min(100, Math.floor((score + scannedScore) / 2) + 5);
    } else {
      finalScore = Math.max(1, score - 8);
    }

    // Grant consistent logging awards
    const journalBonusXp = 100 + Math.max(0, Math.floor(Math.abs(totalModifier) * 15));
    let nextXp = xp + journalBonusXp;
    let nextLevel = level;
    if (nextXp >= 1000) {
      nextLevel = level + 1;
      nextXp = nextXp - 1000;
    }

    // Safeguard streak
    const nextStreak = streak + 1;

    saveGamifiedToCache(finalScore, nextXp, nextLevel, nextStreak);
  };

  const handleClearHistory = () => {
    saveActivitiesToCache([]);
    saveGamifiedToCache(82, 740, 4, 4);
  };

  const handleDeleteActivity = (id: string) => {
    const updated = activities.filter(a => a.id !== id);
    saveActivitiesToCache(updated);
  };

  const handleSendMessage = async (text: string) => {
    const userMsg: Message = {
      id: String(Date.now()),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    localStorage.setItem('ecotrack_chat', JSON.stringify(updatedHistory));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedHistory })
      });

      if (!res.ok) throw new Error("Faulty response from Gemini server.");

      const reply: Message = await res.json();
      const nextHistory = [...updatedHistory, reply];
      setMessages(nextHistory);
      localStorage.setItem('ecotrack_chat', JSON.stringify(nextHistory));

    } catch (e) {
      console.error(e);
      // Fallback
      const errorReply: Message = {
        id: String(Date.now() + 1),
        sender: 'ai',
        text: "I was unable to secure dynamic analysis. Rest assured your carbon guidelines remain active local rules.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorReply]);
    }
  };

  const handleClearChat = () => {
    const defaultChat: Message[] = [
      {
        id: 'init-1',
        sender: 'ai',
        text: "Conversation history cleared. Type anything underneath to begin calculating sustainable strategies with me!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
    setMessages(defaultChat);
    localStorage.setItem('ecotrack_chat', JSON.stringify(defaultChat));
  };

  const handleCalculateWizard = (annualTotal: number, wizardData: CalculatorData) => {
    // Elevate carbon metrics from Wizard success
    const completedBonusXp = 200;
    let nextXp = xp + completedBonusXp;
    let nextLevel = level;
    if (nextXp >= 1000) {
      nextLevel = level + 1;
      nextXp = nextXp - 1000;
    }

    // Set initial Eco Score based on footprint (lower footprint = higher baseline)
    let freshScore = 80;
    if (annualTotal <= 5.0) freshScore = 92;
    else if (annualTotal <= 10.0) freshScore = 84;
    else if (annualTotal > 15.0) freshScore = 65;

    saveGamifiedToCache(freshScore, nextXp, nextLevel, streak);

    // Seed a custom logged activity celebrating wizard calculation
    handleQuickLog(
      'Profile Footprint Recalibration',
      'other',
      -3.5,
      `Calculated annual impact metric: ${annualTotal} Tons. Custom carbon threshold synchronized.`
    );

    setActiveTab('dashboard');
  };

  // Challenges Interactions
  const handleJoinChallenge = (id: string) => {
    setChallenges(prev =>
      prev.map(c => (c.id === id ? { ...c, joined: true } : c))
    );
  };

  const handleProgressChallenge = (id: string, amount: number) => {
    setChallenges(prev =>
      prev.map(c => {
        if (c.id === id) {
          const nextProgress = c.progress + amount;
          const completedNow = nextProgress >= c.target;
          
          if (completedNow && !c.completed) {
            // Grant challenge rewards!
            let nextXp = xp + c.points;
            let nextLevel = level;
            if (nextXp >= 1000) {
              nextLevel = level + 1;
              nextXp = nextXp - 1000;
            }
            saveGamifiedToCache(score, nextXp, nextLevel, streak);
          }
          return {
            ...c,
            progress: nextProgress,
            completed: completedNow
          };
        }
        return c;
      })
    );
  };

  // Simulated regional user scoreboard representation
  const simulatedLeaderboard: LeaderboardUser[] = [
    { rank: 1, name: 'Mia_EcoGreen', points: 1450, level: 12, avatar: '👩‍🌾' },
    { rank: 2, name: 'EarthDefender', points: 1120, level: 9, avatar: '🦸‍♂️' },
    { rank: 3, name: 'David_EcoKnight', points: 980, level: 8, avatar: '🏃‍♂️' },
    { rank: 4, name: 'You (GreenCitizen)', points: 410 + xp, level: level, avatar: '🌱', isCurrentUser: true },
    { rank: 5, name: 'Sarah_Planets', points: 640, level: 5, avatar: '👩‍ضاء' },
    { rank: 6, name: 'Alex_ZeroWaste', points: 550, level: 3, avatar: '🚴‍♂️' }
  ].sort((a, b) => b.points - a.points);

  // Auto-sort ranking numbers
  const rankedLeaderboard = simulatedLeaderboard.map((usr, i) => ({
    ...usr,
    rank: i + 1
  }));

  // Handle earning rewards from Eco Arcade
  const handleEarnRewards = (xpReward: number, scoreReward: number, reason: string) => {
    let nextXp = xp + xpReward;
    let nextLevel = level;
    if (nextXp >= 1000) {
      nextLevel = level + 1;
      nextXp = nextXp - 1000;
    }
    const nextScore = Math.min(100, score + scoreReward);
    saveGamifiedToCache(nextScore, nextXp, nextLevel, streak);

    // Also add a carbon journal activity offset for completes
    handleQuickLog(
      `Arcade session: ${reason}`,
      'other',
      -1.8,
      `Played Eco Arcade session. Carbon mitigation and educational index improved.`
    );
  };

  // Profile coordinates sync
  const handleUpdateProfile = (updates: { name: string; avatar: string; email?: string }) => {
    setUserProfile({
      name: updates.name,
      avatar: updates.avatar,
      email: updates.email
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Dynamic PWA Alert header banner */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border-b border-white/5 py-2.5 px-4 text-center text-xs text-slate-300 flex items-center justify-center gap-2 flex-wrap">
        <Smartphone className="w-4 h-4 text-emerald-400 animate-pulse" />
        <span>Try installing EcoTrack AI directly onto your home screen for rapid offline logs!</span>
        <button
          id="global-banner-install-btn"
          onClick={() => setShowPwaModal(true)}
          className="px-2.5 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold hover:scale-105 active:scale-95 transition-all text-[10px] cursor-pointer ml-2"
        >
          Install PWA
        </button>
      </div>

      {sessionState === 'landing' ? (
        <LandingView
          onStart={() => setSessionState('auth_signup')}
          onLogin={() => setSessionState('auth_login')}
        />
      ) : sessionState === 'auth_login' || sessionState === 'auth_signup' ? (
        <AuthView
          initialMode={sessionState === 'auth_login' ? 'login' : 'signup'}
          onBackToLanding={() => setSessionState('landing')}
          onAuthSuccess={(user) => {
            setUserProfile({
              name: user.name,
              avatar: user.avatar,
              email: user.email
            });
            setSessionState('logged_in');
            setActiveTab('dashboard');
          }}
        />
      ) : (
        <div className="flex-1 flex flex-col">
          
          {/* Main Top Header */}
          <header className="border-b border-slate-900 bg-slate-900/40 backdrop-blur-md sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              
              {/* Logo / Branding */}
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-emerald-400 animate-bounce" />
                </div>
                <div className="text-left select-none">
                  <span className="font-bold text-white text-base tracking-wide font-sans block leading-tight">EcoTrack AI</span>
                  <span className="text-[9px] text-slate-500 font-mono font-medium block">Advising carbon zero</span>
                </div>
              </div>

              {/* Desktop Tabs Routing — Clean and Spacious Visuals */}
              <nav className="hidden md:flex items-center gap-2.5 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-900">
                {[
                  { id: 'dashboard', name: 'Dashboard', icon: <Home className="w-4 h-4" /> },
                  { id: 'journal', name: 'Carbon Journal', icon: <ClipboardList className="w-4 h-4" /> },
                  { id: 'ai', name: 'AI Advisor', icon: <Sparkles className="w-4 h-4 animate-pulse text-emerald-400" /> },
                  { id: 'challenges', name: 'Challenges', icon: <Award className="w-4 h-4" /> }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    id={`desktop-tab-${tab.id}`}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      if (tab.id === 'challenges') {
                        setChallengesSubTab('daily');
                      }
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 cursor-pointer transition-all ${
                      activeTab === tab.id
                        ? 'bg-emerald-500 text-slate-950 shadow-md font-black scale-102'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/40'
                    }`}
                  >
                    {tab.icon}
                    {tab.name}
                  </button>
                ))}
              </nav>

              {/* Right Utility Section — Compact, SaaS standard, beautiful */}
              <div className="flex items-center gap-3 sm:gap-4">
                
                {/* Current Streak Indicator */}
                <div 
                  id="header-streak-badge"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold font-mono shadow-sm"
                  title="Your current streak"
                >
                  <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                  <span>{streak}d Streak</span>
                </div>

                {/* Notifications Button & Popover */}
                <div className="relative">
                  <button
                    id="notifications-bell-btn"
                    onClick={() => {
                      setNotificationsOpen(!notificationsOpen);
                      setProfileDropdownOpen(false);
                    }}
                    className={`p-2.5 rounded-xl border transition-all text-slate-400 hover:text-emerald-400 cursor-pointer relative ${
                      notificationsOpen 
                        ? 'border-emerald-500 bg-slate-900/85 text-emerald-400' 
                        : 'border-slate-850 bg-slate-900/40 hover:bg-slate-800'
                    }`}
                    title="Alerts Hub"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    {notifications.some(n => !n.read) && (
                      <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ring-1 ring-slate-950" />
                    )}
                  </button>

                  {notificationsOpen && (
                    <div className="absolute right-0 mt-3 w-80 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl py-3 z-50 animate-fade-in divide-y divide-slate-900/60 overflow-hidden">
                      <div className="px-4 pb-2 flex items-center justify-between">
                        <span className="text-[10px] font-extrabold text-white uppercase tracking-wider font-mono">Notifications</span>
                        <button 
                          onClick={() => {
                            setNotifications(notifications.map(n => ({ ...n, read: true })));
                          }}
                          className="text-[10px] text-slate-500 hover:text-emerald-400 cursor-pointer font-bold transition-colors"
                        >
                          Mark all read
                        </button>
                      </div>
                      
                      <div className="max-h-60 overflow-y-auto">
                        {notifications.map((n) => (
                          <div 
                            key={n.id}
                            className={`p-3 text-left transition-colors flex items-start gap-2.5 ${
                              n.read ? 'bg-transparent' : 'bg-emerald-500/[0.02]'
                            }`}
                          >
                            <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${n.read ? 'bg-slate-700' : 'bg-emerald-400 animate-pulse'}`} />
                            <div className="space-y-0.5">
                              <p className="text-xs text-slate-300 leading-relaxed font-sans">{n.text}</p>
                              <span className="text-[9px] text-slate-500 font-mono lowercase">{n.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="px-4 pt-2 text-center">
                        <span className="text-[9px] text-slate-600 block">System Hub Connected</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile dropdown trigger */}
                <div className="relative">
                  <button
                    id="header-profile-btn"
                    onClick={() => {
                      setProfileDropdownOpen(!profileDropdownOpen);
                      setNotificationsOpen(false);
                    }}
                    className={`flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl border transition-all cursor-pointer ${
                      profileDropdownOpen || activeTab === 'profile'
                        ? 'border-emerald-500 bg-slate-900/80 shadow' 
                        : 'border-slate-850 bg-slate-900/40 hover:bg-slate-800'
                    }`}
                    title="User account menu"
                  >
                    <span className="text-xl select-none px-2 py-1 bg-slate-950 rounded-lg border border-slate-850 shrink-0">
                      {userProfile.avatar}
                    </span>
                    <div className="hidden sm:block text-left">
                      <span className="block text-xs font-bold text-slate-250 leading-tight truncate max-w-[100px]">{userProfile.name}</span>
                      <span className="block text-[9px] font-mono text-emerald-400">Lvl {level} Guardian</span>
                    </div>
                    <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 animate-fade-in text-left">
                      
                      <div className="px-4 py-2.5 flex items-center gap-2 border-b border-slate-900 pb-2 mb-1">
                        <span className="text-xl select-none p-1 bg-slate-900 rounded-lg">{userProfile.avatar}</span>
                        <div className="min-w-0">
                          <span className="block text-xs font-extrabold text-white truncate">{userProfile.name}</span>
                          <span className="block text-[10px] text-slate-500 truncate">{userProfile.email || 'citizen@ecotrack.ai'}</span>
                        </div>
                      </div>

                      <div className="space-y-0.5">
                        {[
                          { label: 'My Profile', icon: <User className="w-3.5 h-3.5 text-slate-400" />, action: () => { setActiveTab('profile'); setProfileDropdownOpen(false); } },
                          { label: 'Sustainability Stats', icon: <Leaf className="w-3.5 h-3.5 text-slate-400" />, action: () => { setActiveTab('profile'); setProfileDropdownOpen(false); } },
                          { label: 'Achievements', icon: <Award className="w-3.5 h-3.5 text-slate-400" />, action: () => { setActiveTab('profile'); setProfileDropdownOpen(false); } },
                          { label: 'Footprint Wizard', icon: <Sliders className="w-3.5 h-3.5 text-slate-400" />, action: () => { setActiveTab('calculator'); setProfileDropdownOpen(false); } },
                          { label: 'Settings', icon: <Settings className="w-3.5 h-3.5 text-slate-400" />, action: () => { setActiveTab('profile'); setProfileDropdownOpen(false); } },
                        ].map((item, idx) => (
                          <button
                            key={idx}
                            onClick={item.action}
                            className="w-full px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 flex items-center gap-2.5 cursor-pointer transition-colors"
                          >
                            {item.icon}
                            {item.label}
                          </button>
                        ))}
                      </div>

                      <div className="border-t border-slate-900 mt-1.5 pt-1.5">
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            setSessionState('landing');
                          }}
                          className="w-full px-4 py-2 text-xs font-bold text-rose-455 hover:text-rose-400 hover:bg-rose-950/10 flex items-center gap-2.5 cursor-pointer transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5 text-rose-400" />
                          Logout
                        </button>
                      </div>

                    </div>
                  )}
                </div>

              </div>

            </div>
          </header>

          {/* Central Workspace Viewport Frame */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            {activeTab === 'dashboard' && (
              <DashboardView
                score={score}
                activities={activities}
                onQuickLog={handleQuickLog}
                onNavigateToJournal={() => setActiveTab('journal')}
                onNavigateToAi={() => setActiveTab('ai')}
              />
            )}
            
            {activeTab === 'journal' && (
              <JournalView
                activities={activities}
                onAddAnalysisResult={handleAddAnalysisResult}
                onClearHistory={handleClearHistory}
                onDeleteActivity={handleDeleteActivity}
              />
            )}

            {activeTab === 'ai' && (
              <AiView
                messages={messages}
                onSendMessage={handleSendMessage}
                onLogAisaving={(name, value, detail) => handleQuickLog(name, 'other', value, detail)}
                onClearChat={handleClearChat}
              />
            )}

            {activeTab === 'challenges' && (
              <ChallengesView
                challenges={challenges}
                badges={badges}
                leaderboard={rankedLeaderboard}
                xp={xp}
                level={level}
                streak={streak}
                onJoinChallenge={handleJoinChallenge}
                onProgressChallenge={handleProgressChallenge}
                onEarnRewards={handleEarnRewards}
                initialSubTab={challengesSubTab}
              />
            )}

            {activeTab === 'calculator' && (
              <CalculatorView onCalculateResults={handleCalculateWizard} />
            )}

            {activeTab === 'profile' && (
              <ProfileView
                score={score}
                xp={xp}
                level={level}
                streak={streak}
                activities={activities}
                userProfile={userProfile}
                onUpdateProfile={handleUpdateProfile}
                onNavigateToTab={(tab, subTab) => {
                  setActiveTab(tab);
                  if (subTab) {
                    setChallengesSubTab(subTab as any);
                  }
                }}
              />
            )}
          </main>

          {/* Bottom Desktop Navigation bar details for mobile devices (Clean and Compact Bottom Bar) */}
          <footer className="border-t border-slate-900 bg-slate-950 md:hidden sticky bottom-0 z-40 h-16 shrink-0 flex items-center justify-around px-4">
            {[
              { id: 'dashboard', icon: <Home className="w-5 h-5" />, label: 'Home' },
              { id: 'journal', icon: <ClipboardList className="w-5 h-5" />, label: 'Journal' },
              { id: 'ai', icon: <Sparkles className="w-5 h-5 animate-pulse text-emerald-400" />, label: 'AI' },
              { id: 'challenges', icon: <Award className="w-5 h-5" />, label: 'Challenges' },
              { id: 'profile', icon: <User className="w-5 h-5" />, label: 'Profile' }
            ].map((bt) => (
              <button
                key={bt.id}
                id={`footer-tab-${bt.id}`}
                onClick={() => {
                  setActiveTab(bt.id as any);
                  if (bt.id === 'challenges') {
                    setChallengesSubTab('daily');
                  }
                }}
                className={`flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                  activeTab === bt.id ? 'text-emerald-400 font-bold' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {bt.icon}
                <span className="text-[10px] tracking-wide font-sans">{bt.label}</span>
              </button>
            ))}
          </footer>

        </div>
      )}

      {/* Global PWA overlays dialog */}
      {showPwaModal && (
        <PwaModal onClose={() => setShowPwaModal(false)} />
      )}

    </div>
  );
}
