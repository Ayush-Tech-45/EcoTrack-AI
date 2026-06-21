/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Smartphone, Check, ShieldCheck, WifiOff, BellRing } from 'lucide-react';

interface PwaModalProps {
  onClose: () => void;
}

export default function PwaModal({ onClose }: PwaModalProps) {
  const [installing, setInstalling] = useState(false);
  const [complete, setComplete] = useState(false);

  const triggerMockInstall = () => {
    setInstalling(true);
    setTimeout(() => {
      setInstalling(false);
      setComplete(true);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in text-left">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8 space-y-6 shadow-2xl">
        
        {/* Close Button Trigger */}
        <button
          id="pwa-modal-close-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!complete ? (
          <div className="space-y-6 text-left">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-sans">Install EcoTrack AI PWA</h3>
                <p className="text-xs text-slate-400 mt-1">Get standard native app features right on your device screen!</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed">
                Adding EcoTrack AI to your Home Screen installs our responsive client workspace. Access high-speed tracking instantly!
              </p>

              {/* Perks features checklists */}
              <div className="space-y-3">
                {[
                  { icon: <WifiOff className="w-4 h-4 text-emerald-400 shrink-0" />, title: "Full Offline Compatibility", desc: "Log carbon entries on trains or tunnels without continuous cell channels." },
                  { icon: <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />, title: "Cached Persistent Ledger", desc: "Data stays securely synced to your client-side indexedDB engine." },
                  { icon: <BellRing className="w-4 h-4 text-indigo-400 shrink-0" />, title: "Ambient Challenge Alerters", desc: "Receive reminders to complete your weekly sustainability streaks." }
                ].map((perk, pIdx) => (
                  <div key={pIdx} className="flex gap-3 text-left">
                    <div className="p-1 rounded bg-slate-950 border border-slate-850 self-start mt-0.5">
                      {perk.icon}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{perk.title}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{perk.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                id="pwa-install-trigger-btn"
                disabled={installing}
                onClick={triggerMockInstall}
                className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-lg shadow-emerald-500/10 hover:shadow-emerald-400/20 active:scale-98 cursor-pointer text-center flex items-center justify-center gap-2"
              >
                {installing ? (
                  <>
                    <Smartphone className="w-4 h-4 animate-bounce" /> Installing onto system...
                  </>
                ) : (
                  "Add to Home Screen"
                )}
              </button>
              <button
                id="pwa-cancel-btn"
                onClick={onClose}
                className="w-full py-3 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs text-center cursor-pointer transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </div>
        ) : (
          /* Installed Confirmation Dialog screen */
          <div className="space-y-6 text-center animate-fade-in py-4 text-left">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
              <Check className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white font-sans">Installed Successfully!</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                EcoTrack AI is now installed. Launch it anytime from your tablet or phone's home applications dock.
              </p>
            </div>

            <button
              id="pwa-ok-close-btn"
              onClick={onClose}
              className="px-8 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors cursor-pointer w-full text-center"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
