/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Leaf, Info, ArrowRight, ArrowLeft, Lightbulb, CheckCircle2, Sliders, Battery, Plane, Car } from 'lucide-react';
import { CalculatorData } from '../types';

interface CalculatorViewProps {
  onCalculateResults: (annualTotal: number, data: CalculatorData) => void;
}

export default function CalculatorView({ onCalculateResults }: CalculatorViewProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<CalculatorData>({
    vehicleType: 'gasoline',
    distance: 40,
    electricity: 350,
    diet: 'meat',
    flightHours: 5
  });

  const [finished, setFinished] = useState(false);
  const [calculatedTotal, setCalculatedTotal] = useState(0);

  // Compute live calculations
  const runCalculation = () => {
    // Basic coefficients in Metric Tons of CO2 per year
    let transportEmissions = 0;
    if (data.vehicleType === 'gasoline') transportEmissions = data.distance * 52 * 0.411 / 1000;
    else if (data.vehicleType === 'hybrid') transportEmissions = data.distance * 52 * 0.22 / 1000;
    else if (data.vehicleType === 'electric') transportEmissions = data.distance * 52 * 0.08 / 1000;
    else if (data.vehicleType === 'public') transportEmissions = data.distance * 52 * 0.14 / 1000;

    const electricityEmissions = (data.electricity * 12 * 0.38) / 1000;

    let dietEmissions = 3.0; // average meat-lover in tons/yr
    if (data.diet === 'vegetarian') dietEmissions = 1.7;
    else if (data.diet === 'vegan') dietEmissions = 1.1;

    const flightEmissions = (data.flightHours * 0.25); // 250kg per hour of air travel

    const annualMetricUnits = transportEmissions + electricityEmissions + dietEmissions + flightEmissions;
    setCalculatedTotal(parseFloat(annualMetricUnits.toFixed(1)));
    setFinished(true);
  };

  const resetCalculator = () => {
    setStep(1);
    setFinished(false);
  };

  const handleSyncToDashboard = () => {
    onCalculateResults(calculatedTotal, data);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in text-left">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Sliders className="w-6 h-6 text-emerald-400" /> Carbon Footprint Wizard
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Estimate your annual greenhouse impact step-by-step to customize your tracking thresholds.
        </p>
      </div>

      {!finished ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 space-y-8 relative">
          
          {/* Step header indicator */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest font-mono">Stage {step} of 4</span>
            <span className="text-xs text-slate-500 font-mono">
              {step === 1 ? 'Transportation Commutes' :
               step === 2 ? 'Home Energy Consumption' :
               step === 3 ? 'Dietary and Eating Habits' :
               'Long-Distance Travel'}
            </span>
          </div>

          {/* Step 1: Transport */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-200 block">What is your primary commuting method?</label>
                <div className="grid grid-cols-2 gap-3 mt-1">
                  {[
                    { id: 'gasoline', name: 'Gasoline Car', info: 'Petrol combustion engine' },
                    { id: 'hybrid', name: 'Hybrid Car', info: 'Combined combustion & battery' },
                    { id: 'electric', name: 'Electric Vehicle', info: 'Tesla / EV battery draw' },
                    { id: 'public', name: 'Public Transit', info: 'Bus, train, or lightrail' }
                  ].map((x) => (
                    <button
                      key={x.id}
                      id={`calc-commute-${x.id}`}
                      onClick={() => setData({ ...data, vehicleType: x.id as any })}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        data.vehicleType === x.id
                          ? 'bg-emerald-500/10 border-emerald-500 text-white'
                          : 'bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-800'
                      }`}
                    >
                      <span className="block font-bold text-xs sm:text-sm text-white">{x.name}</span>
                      <span className="text-[10px] text-slate-400 mt-1 block">{x.info}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <div className="flex justify-between text-sm text-slate-200 font-medium">
                  <label>Average weekly commuting distance:</label>
                  <span className="text-emerald-400 font-mono font-bold">{data.distance} miles</span>
                </div>
                <input
                  id="calc-distance-slider"
                  type="range"
                  min="0"
                  max="300"
                  step="5"
                  value={data.distance}
                  onChange={(e) => setData({ ...data, distance: parseInt(e.target.value) })}
                  className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>0 miles</span>
                  <span>150 miles</span>
                  <span>300 miles</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Energy */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-slate-200 font-medium">
                  <label className="text-sm font-bold block text-slate-200">Household Electricity Consumption:</label>
                  <span className="text-emerald-400 font-mono font-bold">{data.electricity} kWh/mo</span>
                </div>
                <p className="text-xs text-slate-400">
                  Estimate your average monthly utility drawing. (An average residential home consumes roughly 600 kWh/month).
                </p>
                <input
                  id="calc-electricity-slider"
                  type="range"
                  min="50"
                  max="1500"
                  step="25"
                  value={data.electricity}
                  onChange={(e) => setData({ ...data, electricity: parseInt(e.target.value) })}
                  className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>50 kWh (Low apartment)</span>
                  <span>750 kWh</span>
                  <span>1500 kWh (Large family home)</span>
                </div>
              </div>

              <div className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-4 font-mono text-slate-400 text-xs leading-relaxed">
                💡 <strong>Home Tip:</strong> Sourcing energy from community solar or green grid plans instantly offsets this drawing to zero!
              </div>
            </div>
          )}

          {/* Step 3: Diet */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-200 block">What describes your weekly diet habits?</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1">
                  {[
                    { id: 'meat', name: 'Standard Diet', detail: 'Regular beef, mutton, and poultry portion choices.' },
                    { id: 'vegetarian', name: 'Vegetarian', detail: 'No meat, includes eggs & dairy ingredients.' },
                    { id: 'vegan', name: 'Fully Plant-Based', detail: 'Zero animal inputs. Maximum green carbon saves.' }
                  ].map((x) => (
                    <button
                      key={x.id}
                      id={`calc-diet-${x.id}`}
                      onClick={() => setData({ ...data, diet: x.id as any })}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        data.diet === x.id
                          ? 'bg-emerald-500/10 border-emerald-500 text-white'
                          : 'bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-800'
                      }`}
                    >
                      <span className="block font-bold text-xs sm:text-sm text-white">{x.name}</span>
                      <span className="text-[10px] text-slate-400 mt-2 block leading-relaxed">{x.detail}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Flights */}
          {step === 4 && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-slate-200 font-medium font-sans">
                  <label className="block text-sm font-bold text-slate-100">Annual Flight Hours:</label>
                  <span className="text-emerald-400 font-mono font-bold">{data.flightHours} hours/yr</span>
                </div>
                <p className="text-xs text-slate-300">
                  Estimate total hours flown annually on commercial/private planes. (A single round-trip NY-London flight equates to ~14 flying hours).
                </p>
                <input
                  id="calc-flight-slider"
                  type="range"
                  min="0"
                  max="120"
                  step="2"
                  value={data.flightHours}
                  onChange={(e) => setData({ ...data, flightHours: parseInt(e.target.value) })}
                  className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono font-sans">
                  <span>0 hours (No flights)</span>
                  <span>60 hours</span>
                  <span>120 hours (Heavy business travel)</span>
                </div>
              </div>
            </div>
          )}

          {/* Stepper Buttons layout */}
          <div className="flex justify-between items-center pt-6 border-t border-slate-800/80">
            {step > 1 ? (
              <button
                id="calc-prev-step-btn"
                onClick={() => setStep(step - 1)}
                className="py-2.5 px-5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Previous
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                id="calc-next-step-btn"
                onClick={() => setStep(step + 1)}
                className="py-2.5 px-6 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
              >
                Proceed <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                id="calc-submit-btn"
                onClick={runCalculation}
                className="py-2.5 px-7 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
              >
                Complete Analysis <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Final results breakdown screen */
        <div id="calc-results-view" className="rounded-2xl border border-teal-500/20 bg-gradient-to-b from-teal-950/10 to-slate-900/40 p-6 sm:p-8 space-y-8 animate-fade-in relative text-left">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-slate-850 pb-6">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Leaf className="w-5 h-5 text-emerald-400" /> My Estimated Footprint
              </h3>
              <p className="text-xs text-slate-400">Here's how your lifestyle calculates on an annual emission coefficient scale.</p>
            </div>
            <button
              id="calc-restart-btn2"
              onClick={resetCalculator}
              className="text-xs text-slate-400 hover:text-slate-200 underline font-mono cursor-pointer"
            >
              Re-run Calculator
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
            
            {/* Massive annual estimate indicator */}
            <div className="rounded-2xl border border-slate-850 bg-slate-950/65 p-6 text-center space-y-2">
              <span className="text-xs uppercase font-semibold text-slate-500 font-mono tracking-wider">Annual Estimated carbon load</span>
              <h2 className="text-5xl font-extrabold text-white tracking-tight font-sans">
                {calculatedTotal} <span className="text-xl font-normal text-slate-400">Tons</span>
              </h2>
              <div className="text-xs text-slate-400 pt-2 font-mono">
                {calculatedTotal <= 6.0
                  ? '🏆 Low-Carbon Profile! Excellent.'
                  : calculatedTotal <= 12.0
                  ? '✓ Moderate Impact Profile.'
                  : '⚠️ Elevated Carbon Profile. High mitigation path recommended.'}
              </div>
            </div>

            {/* Compared against benchmarks */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400">Compared to Benchmarks:</h4>
              
              <div className="space-y-3">
                {[
                  { name: 'Your Footprint', val: calculatedTotal, color: 'bg-emerald-400', max: 16 },
                  { name: 'US Citizens Average', val: 16.0, color: 'bg-rose-500/30 text-rose-300 border-rose-500/20', max: 16 },
                  { name: 'EU Citizens Average', val: 6.4, color: 'bg-yellow-500/30 text-yellow-300 border-yellow-500/20', max: 16 },
                  { name: 'Global Target Threshold', val: 2.0, color: 'bg-indigo-500/30 text-indigo-300 border-indigo-500/20', max: 16 }
                ].map((bench) => {
                  const scalePct = Math.min(100, (bench.val / 16) * 100);
                  return (
                    <div key={bench.name} className="space-y-1 text-xs">
                      <div className="flex justify-between font-medium">
                        <span className="text-slate-300">{bench.name}</span>
                        <strong className="text-slate-200 font-mono">{bench.val} Tons</strong>
                      </div>
                      <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${scalePct}%` }}
                          className={`h-full ${bench.color} rounded-full`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-850 bg-slate-950 p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-emerald-400" /> Customized Reduction Action
            </h4>
            <ul className="text-xs text-slate-300 space-y-2 list-disc pl-5">
              {data.vehicleType === 'gasoline' && (
                <li>Swapping just 2 gasoline commutes weekly for public transits will reduce your estimate by <strong>0.8 Tons CO2/yr</strong>!</li>
              )}
              {data.electricity > 400 && (
                <li>Decreasing residential thermostat heating schedules by 2 degrees reduces your utility index by <strong>0.4 Tons CO2/yr</strong>.</li>
              )}
              {data.diet === 'meat' && (
                <li>Switching beef products to dairy or grain assemblies over 3 days cut dietary greenhouse loads by <strong>1.1 Tons CO2/yr</strong>.</li>
              )}
              {data.flightHours > 10 && (
                <li>Optimizing vacation flights via direct flights prevents takeoff engine emissions drafts.</li>
              )}
              <li>Sourcing energy from state-certified community power blocks wipes out home appliance outputs.</li>
            </ul>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-4">
            <button
              id="calc-reset-wizard-btn"
              onClick={resetCalculator}
              className="px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-slate-200 text-xs font-bold font-sans text-center cursor-pointer transition-colors"
            >
              Re-evaluate Fields
            </button>
            <button
              id="calc-sync-to-dash-btn"
              onClick={handleSyncToDashboard}
              className="flex-1 px-8 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs font-sans text-center cursor-pointer transition-all shadow-lg shadow-emerald-500/10 active:scale-95"
            >
              Sync Score & Close Wizard
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
