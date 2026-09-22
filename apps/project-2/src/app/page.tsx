"use client";

import { Activity, Heart, Moon, Sun, Settings, Bell, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-emerald-500/30">
      {/* Top App Bar */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-black/50 backdrop-blur-xl sticky top-0 z-50"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/50">
            <Heart className="text-emerald-400 w-5 h-5" />
          </div>
          <h1 className="font-bold text-xl tracking-tight">Aura <span className="text-emerald-400 font-light">Health AI</span></h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-white/10 rounded-full transition"><Bell className="w-5 h-5" /></button>
          <button className="p-2 hover:bg-white/10 rounded-full transition"><Settings className="w-5 h-5" /></button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-blue-500 p-[2px]">
            <div className="w-full h-full bg-black rounded-full border border-black overflow-hidden">
              <img src="https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff" alt="User" />
            </div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-6xl mx-auto p-8 flex gap-8">
        {/* Left Column: Vitals */}
        <div className="w-80 flex flex-col gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden group hover:border-emerald-500/30 transition-colors"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div>
                <h3 className="text-slate-400 text-sm font-medium">Readiness Score</h3>
                <div className="text-5xl font-bold text-white mt-1">94<span className="text-xl text-emerald-400 ml-1">Optimal</span></div>
              </div>
              <Activity className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="space-y-3 relative z-10">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Resting HR</span>
                <span className="font-mono text-white">48 bpm</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">HRV</span>
                <span className="font-mono text-white">82 ms</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden group hover:border-orange-500/30 transition-colors"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-all"></div>
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div>
                <h3 className="text-slate-400 text-sm font-medium">Activity Goal</h3>
                <div className="text-4xl font-bold text-white mt-1">2,450<span className="text-lg text-slate-500 ml-1">/ 3000 kcal</span></div>
              </div>
              <Flame className="w-6 h-6 text-orange-400" />
            </div>
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-orange-500 to-amber-400 w-[81%]"></div>
            </div>
          </motion.div>
        </div>

        {/* Center/Right: Sleep AI & Trends */}
        <div className="flex-1 flex flex-col gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-blue-500/20 rounded-3xl p-8 relative overflow-hidden"
          >
            <div className="flex justify-between items-start relative z-10">
              <div className="max-w-md">
                <div className="flex items-center gap-2 mb-4">
                  <Moon className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-400 font-semibold tracking-wider text-sm">AI SLEEP ANALYSIS</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Your deep sleep increased by 14% last night.</h2>
                <p className="text-slate-300 leading-relaxed">
                  Our on-device CoreML model detected optimal body temperature regulation between 2AM and 4AM. This correlates with the new magnesium supplement protocol you started 3 days ago.
                </p>
              </div>
              <div className="text-right">
                <div className="text-6xl font-bold text-white">8<span className="text-2xl text-blue-400">h</span> 12<span className="text-2xl text-blue-400">m</span></div>
                <div className="text-slate-400 mt-2 font-medium">Total Sleep Time</div>
              </div>
            </div>
            
            {/* Sleep Graph Simulation */}
            <div className="mt-12 h-32 flex items-end gap-1 relative z-10">
              {[40, 20, 60, 80, 20, 10, 40, 60, 90, 30, 20, 50, 70, 80, 40, 10].map((val, i) => (
                <motion.div 
                  key={i} 
                  initial={{ height: 0 }}
                  animate={{ height: `${val}%` }}
                  transition={{ delay: 0.5 + (i * 0.05), duration: 0.5 }}
                  className="flex-1 rounded-t-sm transition-colors hover:opacity-80 cursor-pointer" 
                  style={{ 
                    backgroundColor: val > 70 ? '#3b82f6' : val > 40 ? '#8b5cf6' : '#64748b' 
                  }}>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-6 flex-1">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
               <h3 className="text-slate-400 text-sm font-medium mb-6">Hydration Tracker</h3>
               <div className="flex items-center justify-center h-48 relative">
                 {/* Circular Progress Simulation */}
                 <div className="w-40 h-40 rounded-full border-[12px] border-white/5 relative flex items-center justify-center">
                   <div className="absolute inset-[-12px] rounded-full border-[12px] border-cyan-500 border-l-transparent border-b-transparent transform rotate-45"></div>
                   <div className="text-center">
                     <div className="text-3xl font-bold text-white">64<span className="text-sm text-cyan-400 ml-1">oz</span></div>
                     <div className="text-xs text-slate-500 mt-1">Goal: 100oz</div>
                   </div>
                 </div>
               </div>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-center items-center text-center">
               <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-4">
                 <Activity className="w-8 h-8 text-emerald-400" />
               </div>
               <h3 className="text-white font-bold text-lg mb-2">Connect Apple Health</h3>
               <p className="text-slate-400 text-sm mb-6">Sync your clinical records for deeper ML predictions.</p>
               <button className="px-6 py-2 bg-white text-black font-semibold rounded-full hover:bg-slate-200 transition">
                 Sync Now
               </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
