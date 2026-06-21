/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Gamepad2,
  Trash2,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Leaf,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EcoArcadeViewProps {
  onEarnRewards: (xpReward: number, scoreReward: number, reason: string) => void;
  userLevel: number;
}

interface TrashItem {
  id: string;
  name: string;
  icon: string;
  category: 'recycling' | 'compost' | 'hazardous';
  hint: string;
}

export default function EcoArcadeView({ onEarnRewards, userLevel }: EcoArcadeViewProps) {
  const [activeGame, setActiveGame] = useState<'waste' | 'carbon' | 'quiz' | null>(null);

  // -----------------------------------------------------------------
  // GAME 1 : WASTE SORTING CHALLENGE STATE
  // -----------------------------------------------------------------
  const wasteItems: TrashItem[] = [
    { id: 'w1', name: 'Plastic Water Bottle', icon: '🧴', category: 'recycling', hint: 'Thermoplastic polymers take 450 years to break down.' },
    { id: 'w2', name: 'Banana Peel', icon: '🍌', category: 'compost', hint: 'Organic materials decompose into nutrient-rich humus soil.' },
    { id: 'w3', name: 'AA Alkaline Battery', icon: '🔋', category: 'hazardous', hint: 'Leaking battery acids contain heavy heavy toxic metals.' },
    { id: 'w4', name: 'Old Cardboard Box', icon: '📦', category: 'recycling', hint: 'Fibers can be repulped to save forest resources.' },
    { id: 'w5', name: 'Rotten Apple Core', icon: '🍎', category: 'compost', hint: 'Composting returns phosphorus and nitrogen back to the earth.' },
    { id: 'w6', name: 'Used Fluorescent Bulb', icon: '💡', category: 'hazardous', hint: 'Fluorescent coatings contain traces of poisonous gaseous mercury.' },
    { id: 'w7', name: 'Aluminum Soda Can', icon: '🥤', category: 'recycling', hint: 'Recycling aluminum saves 95% of energy required to mine raw ores.' },
    { id: 'w8', name: 'Used Coffee Grounds', icon: '☕', category: 'compost', hint: 'Adds nitrogen, potassium, and magnesium content to garden soil.' }
  ];

  const [wasteIndex, setWasteIndex] = useState(0);
  const [wasteFeedback, setWasteFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [wasteScore, setWasteScore] = useState(0);
  const [wasteCompleted, setWasteCompleted] = useState(false);

  const handleSort = (binType: 'recycling' | 'compost' | 'hazardous') => {
    if (wasteCompleted || wasteFeedback) return;

    const currentItem = wasteItems[wasteIndex];
    const isCorrect = currentItem.category === binType;

    if (isCorrect) {
      setWasteScore(prev => prev + 1);
      setWasteFeedback({
        isCorrect: true,
        text: `Superb! Correctly sorted. ${currentItem.hint}`
      });
    } else {
      setWasteFeedback({
        isCorrect: false,
        text: `Incorrect bin! ${currentItem.name} belongs in the ${currentItem.category} bin. Reason: ${currentItem.hint}`
      });
    }

    setTimeout(() => {
      setWasteFeedback(null);
      if (wasteIndex < wasteItems.length - 1) {
        setWasteIndex(prev => prev + 1);
      } else {
        setWasteCompleted(true);
        // Dispatch Points Reward
        const finalReward = wasteScore >= 6 ? 20 : 10;
        onEarnRewards(finalReward * 5, 2, `Passing Waste Sorting Challenge (${wasteScore}/${wasteItems.length})`);
      }
    }, 3500);
  };

  const resetWasteGame = () => {
    setWasteIndex(0);
    setWasteFeedback(null);
    setWasteScore(0);
    setWasteCompleted(false);
  };

  // -----------------------------------------------------------------
  // GAME 2 : CARBON CHOICE SIMULATOR STATE
  // -----------------------------------------------------------------
  interface Scenario {
    id: string;
    title: string;
    question: string;
    choices: {
      text: string;
      impact: number; // in kg CO2
      points: number;
      feedback: string;
      icon: string;
    }[];
  }

  const carbonScenarios: Scenario[] = [
    {
      id: 'sc1',
      title: 'Commute to the Sustainable Office',
      question: 'How should you travel to complete your 8-mile commute today?',
      choices: [
        { text: 'Drive Gasoline Solo SUV', impact: 3.6, points: 5, feedback: 'Solo fuel combustion releases intense concentrated greenhouse compounds directly.', icon: '🚗' },
        { text: 'Board Public Electric Train', impact: 0.4, points: 15, feedback: 'Mass modern high-density transit options dilute singular passenger load emissions.', icon: '🚊' },
        { text: 'Commute on Carbon Bicycle', impact: 0.0, points: 25, feedback: 'Zero emission propulsion! Active healthy cardiovascular choice.', icon: '🚲' }
      ]
    },
    {
      id: 'sc2',
      title: 'Weekly Grocery Bagging Selection',
      question: 'You are checking out with organic items. What packaging selection is smartest?',
      choices: [
        { text: 'Request Single-Use Plastic Bags', impact: 1.2, points: 5, feedback: 'Polypropylene persists in ocean garbage patches and standard dumps for 450+ years.', icon: '🛍️' },
        { text: 'Request Recycled Craft Paper Bags', impact: 0.6, points: 12, feedback: 'Recyclable and compostable, but paper pulping consumes intensive heating resources.', icon: '📄' },
        { text: 'Bring Reusable Cotton Tote Bags', impact: 0.0, points: 25, feedback: 'Pre-owned canvas bag loops reduce thousands of future manufacturing cycles!', icon: '🎒' }
      ]
    },
    {
      id: 'sc3',
      title: 'Household Room Temperature Tuning',
      question: 'The evening climate is shifting cooler. How do you respond?',
      choices: [
        { text: 'Crank electric resistive heater to 74°F', impact: 4.8, points: 5, feedback: 'Electric coils draw thousands of grid watts from coal-sourced stations rapidly.', icon: '🔥' },
        { text: 'Switch to a cozy wool blanket & set 68°F', impact: 0.8, points: 25, feedback: 'Smart habit! Keeping thermostats set lower conserves 15% electric draw immediately.', icon: '🧥' }
      ]
    }
  ];

  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [selectedScenarioChoice, setSelectedScenarioChoice] = useState<number | null>(null);
  const [carbonCompleted, setCarbonCompleted] = useState(false);

  const handleScenarioChoice = (idx: number) => {
    setSelectedScenarioChoice(idx);
    
    // Simulate reading details delay
    setTimeout(() => {
      setSelectedScenarioChoice(null);
      if (scenarioIdx < carbonScenarios.length - 1) {
        setScenarioIdx(prev => prev + 1);
      } else {
        setCarbonCompleted(true);
        // Earn general XP
        onEarnRewards(15, 1, 'Completed Carbon Choice Scenario Simulation');
      }
    }, 4500);
  };

  const resetCarbonGame = () => {
    setScenarioIdx(0);
    setSelectedScenarioChoice(null);
    setCarbonCompleted(false);
  };

  // -----------------------------------------------------------------
  // GAME 3 : ECO KNOWLEDGE QUIZ STATE
  // -----------------------------------------------------------------
  interface QuizQuestion {
    id: string;
    question: string;
    answers: string[];
    correctIndex: number;
    fact: string;
  }

  const quizQuestions: QuizQuestion[] = [
    {
      id: 'q1',
      question: 'Which of these everyday dietary items has the highest carbon emissions footprint?',
      answers: ['A glass of soy milk', '100g of roasted peanuts', 'A 4oz beef steak patty', 'A cup of black tea'],
      correctIndex: 2,
      fact: 'Livestock farming accounts for nearly 14.5% of greenhouse emissions globally due to methane enteric fermentation.'
    },
    {
      id: 'q2',
      question: 'What percentage of global household waste is successfully recycled annually?',
      answers: ['Less than 10%', 'Around 40%', 'Around 75%', 'Nearly 100%'],
      correctIndex: 0,
      fact: 'Globally only about 9% of plastics manufactured are recycled. The remaining pollute ocean environments or undergo incineration.'
    },
    {
      id: 'q3',
      question: 'Which sector contributes the highest volume of global greenhouse gases?',
      answers: ['Aviation flights', 'Electricity and Heat generation', 'Digital data servers', 'Textile fast fashion clothing'],
      correctIndex: 1,
      fact: 'Energy generation via burning heavy coal, oil, and methane gases accounts for over 25% of overall climate warming.'
    }
  ];

  const [quizIdx, setQuizIdx] = useState(0);
  const [quizAnswerSelected, setQuizAnswerSelected] = useState<number | null>(null);
  const [quizPoints, setQuizPoints] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleQuizAnswer = (selectedIdx: number) => {
    if (quizAnswerSelected !== null) return;
    setQuizAnswerSelected(selectedIdx);

    const isCorrect = selectedIdx === quizQuestions[quizIdx].correctIndex;
    if (isCorrect) {
      setQuizPoints(prev => prev + 1);
    }

    setTimeout(() => {
      setQuizAnswerSelected(null);
      if (quizIdx < quizQuestions.length - 1) {
        setQuizIdx(prev => prev + 1);
      } else {
        setQuizCompleted(true);
        // Grant rewards
        onEarnRewards(25, 2, 'Passed Eco Knowledge Trivia Quiz');
      }
    }, 4500);
  };

  const resetQuizGame = () => {
    setQuizIdx(0);
    setQuizAnswerSelected(null);
    setQuizPoints(0);
    setQuizCompleted(false);
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Title Header */}
      <div className="flex items-center gap-3.5 border-b border-slate-900 pb-5">
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
          <Gamepad2 className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Eco Arcade</h1>
          <p className="text-xs text-slate-400 mt-1">Teach sustainability through short, interactive gamified simulations.</p>
        </div>
      </div>

      {!activeGame ? (
        /* Arcade Lobbby Selection Cards */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card Game 1 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/35 p-6 hover:border-emerald-500/20 hover:bg-slate-900/50 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">Simulation Game</span>
              <h3 className="text-lg font-bold text-white">Waste Sorting Challenge</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Learn trash dynamics. Click or sort plastic containers, organic waste, and hazards into correct bins.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold font-mono">
                  +20 Eco Points
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-bold font-mono">
                  9% Success Threshold
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                resetWasteGame();
                setActiveGame('waste');
              }}
              className="mt-6 flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-950 group-hover:bg-emerald-500 text-slate-300 group-hover:text-slate-950 font-semibold text-xs transition-all tracking-wide cursor-pointer"
            >
              Play Challenge <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card Game 2 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/35 p-6 hover:border-teal-500/20 hover:bg-slate-900/50 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <span className="text-[10px] font-mono font-bold text-teal-400 uppercase tracking-widest block">Interactive Simulator</span>
              <h3 className="text-lg font-bold text-white">Carbon Choice Challenge</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Observe the compound impact of daily selections of transport, grocery bagging, and heating.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 text-[10px] font-bold font-mono">
                  +15 XP Reward
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-bold font-mono font-mono">
                  Real Carbon Stats
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                resetCarbonGame();
                setActiveGame('carbon');
              }}
              className="mt-6 flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-950 group-hover:bg-teal-500 text-slate-300 group-hover:text-slate-950 font-semibold text-xs transition-all tracking-wide cursor-pointer"
            >
              Play Challenge <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card Game 3 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/35 p-6 hover:border-indigo-500/20 hover:bg-slate-900/50 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest block">Intellectual Quiz</span>
              <h3 className="text-lg font-bold text-white">Eco Knowledge Quiz</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Test your climate math index across plastic, domestic electricity grid, and agricultural variables.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[10px] font-bold font-mono">
                  Badges & XP
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-bold font-mono font-mono">
                  Climate Trivia
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                resetQuizGame();
                setActiveGame('quiz');
              }}
              className="mt-6 flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-950 group-hover:bg-indigo-500 text-slate-300 group-hover:text-slate-950 font-semibold text-xs transition-all tracking-wide cursor-pointer"
            >
              Play Trivia <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      ) : (
        /* Inside active game frames */
        <div className="bg-slate-900/20 border border-slate-850 p-6 md:p-8 rounded-2xl relative overflow-hidden">
          
          {/* Header switch back */}
          <button
            onClick={() => setActiveGame(null)}
            className="px-3.5 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-950 text-xs text-slate-400 hover:text-white transition-all flex items-center gap-2 cursor-pointer mb-6"
          >
            ← Leave Eco Arcade
          </button>

          {/* GAME 1 : WASTE SORTING CONTENT */}
          {activeGame === 'waste' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">Waste Sorting Challenge</h2>
                  <p className="text-xs text-slate-400">Classify every scrap item by sending them into the correct processing bin.</p>
                </div>
                <div className="bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-850 font-mono text-xs">
                  Correct Sorted: <strong className="text-emerald-400">{wasteScore} / {wasteItems.length}</strong>
                </div>
              </div>

              {wasteCompleted ? (
                <div className="text-center py-10 space-y-4">
                  <span className="text-6xl block">🏆</span>
                  <h3 className="text-lg font-bold text-white">Challenge Completed!</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    You correctly sorted <span className="text-emerald-400 font-bold">{wasteScore} out of {wasteItems.length}</span> garbage items. This earns you critical Points!
                  </p>
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 font-mono font-bold text-xs max-w-xs mx-auto">
                    +20 Eco Points added to Profile
                  </div>
                  <button
                    onClick={resetWasteGame}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-all flex items-center gap-2 mx-auto cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Play Challenge Again
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Current sorting item display */}
                  <div className="p-8 rounded-2xl border border-slate-800 bg-slate-950/60 max-w-sm mx-auto text-center space-y-4 relative overflow-hidden">
                    <span className="text-6xl block select-none animate-bounce">{wasteItems[wasteIndex].icon}</span>
                    <div>
                      <h4 className="font-bold text-lg text-slate-200">{wasteItems[wasteIndex].name}</h4>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Item #{wasteIndex + 1}</p>
                    </div>

                    {/* Info notification */}
                    <AnimatePresence mode="wait">
                      {wasteFeedback && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className={`absolute inset-0 p-4 ${
                            wasteFeedback.isCorrect ? 'bg-emerald-950/90' : 'bg-rose-950/90'
                          } flex flex-col justify-center items-center text-center space-y-2`}
                        >
                          {wasteFeedback.isCorrect ? (
                            <CheckCircle2 className="w-8 h-8 text-emerald-400 animate-pulse" />
                          ) : (
                            <XCircle className="w-8 h-8 text-rose-400 animate-pulse" />
                          )}
                          <p className={`text-xs font-semibold ${
                            wasteFeedback.isCorrect ? 'text-emerald-300' : 'text-rose-300'
                          }`}>
                            {wasteFeedback.isCorrect ? 'Spot On!' : 'Careful!'}
                          </p>
                          <p className="text-[10px] text-slate-300 leading-relaxed max-w-xs px-2">
                            {wasteFeedback.text}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Bins selection boxes */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
                    <button
                      onClick={() => handleSort('recycling')}
                      className="p-5 rounded-2xl border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 hover:border-blue-500 text-blue-400 flex flex-col items-center gap-2 cursor-pointer transition-all"
                    >
                      <Trash2 className="w-6 h-6 shrink-0" />
                      <span className="text-xs font-bold uppercase">Recycling Bin</span>
                      <span className="text-[9px] text-blue-300">Bottles, paper, scrap metal</span>
                    </button>

                    <button
                      onClick={() => handleSort('compost')}
                      className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500 text-emerald-400 flex flex-col items-center gap-2 cursor-pointer transition-all"
                    >
                      <Trash2 className="w-6 h-6 shrink-0" />
                      <span className="text-xs font-bold uppercase">Compost Bin</span>
                      <span className="text-[9px] text-emerald-300">Food, peelings, plant matter</span>
                    </button>

                    <button
                      onClick={() => handleSort('hazardous')}
                      className="p-5 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 hover:bg-yellow-500/10 hover:border-yellow-500 text-yellow-400 flex flex-col items-center gap-2 cursor-pointer transition-all"
                    >
                      <Trash2 className="w-6 h-6 shrink-0" />
                      <span className="text-xs font-bold uppercase">Hazardous Bin</span>
                      <span className="text-[9px] text-yellow-300">Batteries, mercury, lightbulbs</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* GAME 2 : CARBON CHOICE SIMULATION CONTENT */}
          {activeGame === 'carbon' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">Carbon Choice Simulator</h2>
                  <p className="text-xs text-slate-400">See the environmental savings of various transit and spending options.</p>
                </div>
                <div className="bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-850 font-mono text-xs text-teal-400">
                  Scenario: {scenarioIdx + 1} / {carbonScenarios.length}
                </div>
              </div>

              {carbonCompleted ? (
                <div className="text-center py-10 space-y-4">
                  <span className="text-6xl block">🌱</span>
                  <h3 className="text-lg font-bold text-white">Simulator Completed!</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    You evaluated real-world carbon choices. Making small swaps aggregates to magnificent regional differences.
                  </p>
                  <div className="p-3 bg-teal-500/10 border border-teal-500/20 rounded-xl text-teal-400 font-mono font-bold text-xs max-w-xs mx-auto">
                    +15 XP Earned of Experience Points
                  </div>
                  <button
                    onClick={resetCarbonGame}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-all flex items-center gap-2 mx-auto cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Start Over Simulator
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Current scenario question card */}
                  <div className="p-6 bg-slate-950 rounded-xl border border-slate-850 text-left space-y-3.5">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-5 h-5 text-teal-400 animate-pulse" />
                      <span className="text-xs font-bold font-mono text-teal-400 uppercase tracking-widest">
                        {carbonScenarios[scenarioIdx].title}
                      </span>
                    </div>
                    <p className="font-bold text-slate-100 text-sm md:text-base leading-relaxed">
                      {carbonScenarios[scenarioIdx].question}
                    </p>
                  </div>

                  {/* Choice display overlays */}
                  <div className="grid grid-cols-1 gap-4">
                    {carbonScenarios[scenarioIdx].choices.map((choice, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleScenarioChoice(idx)}
                        disabled={selectedScenarioChoice !== null}
                        className={`p-5 rounded-2xl border text-left flex items-start gap-4 transition-all relative overflow-hidden cursor-pointer ${
                          selectedScenarioChoice === idx
                            ? 'border-emerald-500 bg-emerald-500/5'
                            : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-3xl select-none">{choice.icon}</span>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-200 sm:text-sm">{choice.text}</span>
                            <span className="text-[10px] sm:text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                              -{choice.impact} kg CO2e
                            </span>
                          </div>
                          
                          {selectedScenarioChoice === idx && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="text-[11px] text-slate-300 leading-relaxed pt-2 border-t border-slate-900 mt-2"
                            >
                              <div className="flex items-start gap-2">
                                <Info className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                                <span>{choice.feedback} Earned +{choice.points} internal metrics points!</span>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* GAME 3 : ECO KNOWLEDGE TRIVIA CONTENT */}
          {activeGame === 'quiz' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">Eco Knowledge Quiz</h2>
                  <p className="text-xs text-slate-400">Observe how climate variables intersect with agriculture, power grid, and waste.</p>
                </div>
                <div className="bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-850 font-mono text-xs text-indigo-400">
                  Question: {quizIdx + 1} / {quizQuestions.length}
                </div>
              </div>

              {quizCompleted ? (
                <div className="text-center py-10 space-y-4">
                  <span className="text-6xl block">🛡️</span>
                  <h3 className="text-lg font-bold text-white">Trivia Quiz Passed!</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Excellent intellectual analysis. You achieved <span className="text-indigo-400 font-bold">{quizPoints} out of {quizQuestions.length}</span> correct answers. 
                  </p>
                  <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400 font-mono font-bold text-xs max-w-xs mx-auto">
                    +25 XP & Eco Badges Progress dispatched!
                  </div>
                  <button
                    onClick={resetQuizGame}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-all flex items-center gap-2 mx-auto cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Play Trivia Quiz Again
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Question */}
                  <div className="p-6 bg-slate-950 rounded-xl border border-slate-850 text-left space-y-3">
                    <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider block">Climate Trivia Category</span>
                    <p className="font-bold text-slate-100 text-sm md:text-base leading-relaxed">
                      {quizQuestions[quizIdx].question}
                    </p>
                  </div>

                  {/* Answers */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {quizQuestions[quizIdx].answers.map((ans, idx) => {
                      const isCorrectAnswer = idx === quizQuestions[quizIdx].correctIndex;
                      const hasSelectedThisAnswer = quizAnswerSelected === idx;
                      const hasQuizFeedbackSelected = quizAnswerSelected !== null;

                      let btnStyle = 'border-slate-800 bg-slate-950/40 hover:border-slate-700';
                      if (hasQuizFeedbackSelected) {
                        if (isCorrectAnswer) {
                          btnStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-300';
                        } else if (hasSelectedThisAnswer) {
                          btnStyle = 'border-rose-500 bg-rose-500/10 text-rose-300';
                        } else {
                          btnStyle = 'border-slate-900 bg-slate-950/10 opacity-30';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleQuizAnswer(idx)}
                          disabled={hasQuizFeedbackSelected}
                          className={`p-4 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${btnStyle}`}
                        >
                          {ans}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation feedback block */}
                  <AnimatePresence>
                    {quizAnswerSelected !== null && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 flex items-start gap-3"
                      >
                        <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-xs text-indigo-300">Sustainability Fact Check</p>
                          <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                            {quizQuestions[quizIdx].fact}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          )}

        </div>
      )}
    </div>
  );
}
