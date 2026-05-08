import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Timer, Footprints, Bike, Activity, Mountain, Plus, Play, Square, Sparkles } from 'lucide-react';
import { useUser } from '../context/UserContext';

export default function Cardio() {
  const { userData, saveSteps } = useUser();
  const weight = parseFloat(userData?.weight) || 70;
  const cardioTarget = userData?.targets?.cardioTarget || 200;
  
  const [activeTab, setActiveTab] = useState('Outdoor');
  const [isTracking, setIsTracking] = useState(false);
  
  // Live Tracking State
  const [steps, setSteps] = useState(0);
  const [liveCalories, setLiveCalories] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const tabs = ['Outdoor', 'Indoor', 'HIIT'];
  
  const activities = [
    { name: 'Running', icon: Activity, cals: '320', time: '30m' },
    { name: 'Cycling', icon: Bike, cals: '450', time: '45m' },
    { name: 'Walking', icon: Footprints, cals: '150', time: '40m' },
    { name: 'Hiking', icon: Mountain, cals: '520', time: '1h 20m' },
  ];

  // Simulation effect
  useEffect(() => {
    let interval;
    if (isTracking) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
        setSteps((prev) => {
          const newSteps = prev + Math.floor(Math.random() * 3) + 1; // Simulate 1-3 steps per second
          // Standard estimation: ~0.04 calories per step for a 70kg person.
          const calsBurned = newSteps * 0.04 * (weight / 70);
          setLiveCalories(calsBurned);
          return newSteps;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTracking, weight]);

  const handleStart = () => {
    setSteps(0);
    setLiveCalories(0);
    setSeconds(0);
    setIsTracking(true);
  };

  const handleStop = () => {
    setIsTracking(false);
    if (steps > 0) {
      saveSteps(steps); // Persist to localStorage history
    }
  };

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pt-12 px-8 pb-36 min-h-screen relative"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-white tracking-tighter">Workout</h1>
        <button className="w-12 h-12 rounded-full glass-card flex items-center justify-center text-neon border border-neon/20 hover:bg-neon hover:text-black transition-all hover:scale-105 neon-glow">
          <Plus size={24} />
        </button>
      </div>

      {/* AI Prediction Banner */}
      <div className="glass-card p-5 mb-8 border border-neon/30 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-neon/10 rounded-bl-full blur-2xl"></div>
        <div className="flex items-center gap-3 mb-2 relative z-10">
          <Sparkles className="text-neon" size={20} />
          <h2 className="text-white font-bold tracking-tight">Nexus AI Plan</h2>
        </div>
        <p className="text-sm text-gray-400 mb-4 relative z-10 leading-relaxed">
          Based on your weight of <span className="text-white font-bold">{weight}kg</span> and your primary goal, you need to burn <span className="text-neon font-bold">{cardioTarget} kcal</span> via cardio today.
        </p>
        <button 
          onClick={handleStart}
          className="w-full py-3 rounded-xl bg-neon text-black font-bold flex items-center justify-center gap-2 hover:bg-[#2fe512] transition-colors shadow-neon"
        >
          <Play size={18} fill="currentColor" />
          Ready Now
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-zinc-900/50 p-1.5 rounded-[1.5rem] border border-white/5">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 rounded-2xl text-sm font-semibold transition-all relative ${
              activeTab === tab ? 'text-black z-10' : 'text-gray-400 hover:text-white'
            }`}
          >
            {activeTab === tab && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-neon rounded-2xl shadow-[0_0_15px_rgba(57,255,20,0.4)] -z-10"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            {tab}
          </button>
        ))}
      </div>

      {/* Activities List */}
      <section>
        <h2 className="text-white font-bold text-xl mb-6 tracking-tight">Past Activities</h2>
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {activities.map((activity, idx) => (
              <motion.div
                key={activity.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card p-5 flex items-center gap-5 hover:bg-white/10 transition-all cursor-pointer hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-[1.2rem] bg-zinc-800/80 flex items-center justify-center text-neon border border-white/5 shadow-inner">
                  <activity.icon size={26} className="drop-shadow-[0_0_8px_rgba(57,255,20,0.5)]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg">{activity.name}</h3>
                  <p className="text-sm text-gray-400 font-medium tracking-wide">{activity.time}</p>
                </div>
                <div className="text-right">
                  <span className="text-white font-black text-xl">{activity.cals}</span>
                  <span className="text-xs text-neon ml-1 font-bold">kcal</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Live Tracker Overlay Modal */}
      <AnimatePresence>
        {isTracking && (
          <motion.div 
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-0 z-50 bg-[#050505] flex flex-col pt-8 px-8 pb-6"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
                <span className="text-white font-bold tracking-widest uppercase text-sm">Live Workout</span>
              </div>
              <span className="text-gray-400 font-mono text-xl">{formatTime(seconds)}</span>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="relative w-56 h-56 flex items-center justify-center">
                {/* Progress Ring Simulation */}
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 224 224">
                  <circle cx="112" cy="112" r="104" fill="none" stroke="#1e1e1e" strokeWidth="8" />
                  <motion.circle 
                    cx="112" cy="112" r="104" 
                    fill="none" 
                    stroke="#39ff14" 
                    strokeWidth="8"
                    strokeDasharray={653.1}
                    strokeDashoffset={653.1 - (653.1 * Math.min(liveCalories / cardioTarget, 1))}
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_10px_rgba(57,255,20,0.5)] transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="flex flex-col items-center text-center">
                  <Flame size={32} className="text-neon mb-2 drop-shadow-[0_0_10px_rgba(57,255,20,0.8)]" />
                  <span className="text-5xl font-black text-white tracking-tighter tabular-nums">{liveCalories.toFixed(1)}</span>
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">kcal burned</span>
                </div>
              </div>

              <div className="flex gap-12 mt-8 w-full justify-center">
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-black text-white tabular-nums">{steps}</span>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1 flex items-center gap-1"><Footprints size={12}/> Steps</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-black text-white tabular-nums">{weight}</span>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Body Wt (kg)</span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleStop}
              className="w-full py-4 rounded-[1.5rem] bg-zinc-900 border border-white/10 text-white font-bold text-lg flex items-center justify-center gap-3 hover:bg-zinc-800 transition-colors shadow-lg mt-4"
            >
              <Square size={20} className="text-red-500" fill="currentColor" />
              End Workout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
