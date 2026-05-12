import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Timer, Footprints, Bike, Activity, Mountain, Plus, Play, Square, Sparkles, Dumbbell, Zap, RotateCcw, ChevronUp, ChevronDown, Wind, Heart, TrendingUp, Pause } from 'lucide-react';
import { useUser } from '../context/UserContext';

// Helper to get today's date string for resetting
const getTodayDateStr = () => new Date().toISOString().split('T')[0];

// ─── INDOOR TAB ────────────────────────────────────────────────────────────────
function IndoorTab() {
  const indoorActivities = [
    { name: 'Treadmill',      icon: Activity,   cals: 280, time: '30m' },
    { name: 'Elliptical',     icon: TrendingUp,  cals: 320, time: '35m' },
    { name: 'Yoga',           icon: Wind,        cals: 150, time: '45m' },
    { name: 'Jump Rope',      icon: Zap,         cals: 400, time: '20m' },
    { name: 'Dumbbells',      icon: Dumbbell,    cals: 220, time: '40m' },
    { name: 'Stationary Bike',icon: Bike,        cals: 350, time: '40m' },
  ];

  return (
    <div>
      <h2 className="text-white font-bold text-lg mb-4 tracking-tight">Indoor Activities</h2>
      <div className="grid grid-cols-2 gap-3">
        {indoorActivities.map((act, idx) => (
          <motion.div
            key={act.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="glass-card p-4 flex items-center gap-4 hover:bg-white/5 transition-all border border-white/5"
          >
            <div className="w-12 h-12 rounded-xl bg-zinc-800/80 flex items-center justify-center text-neon border border-white/5">
              <act.icon size={20} className="drop-shadow-[0_0_8px_rgba(255,184,0,0.5)]" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-sm">{act.name}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{act.time}</p>
              <p className="text-xs text-neon font-bold mt-0.5">{act.cals} kcal</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── HIIT TAB ─────────────────────────────────────────────────────────────────
const HIIT_PRESETS = [
  { name: 'Beginner Blast', rounds: 6, workSec: 20, restSec: 40, color: 'from-blue-500/20 to-blue-900/10', borderColor: 'border-blue-500/30' },
  { name: 'Fat Burner', rounds: 8, workSec: 30, restSec: 30, color: 'from-amber-500/20 to-amber-900/10', borderColor: 'border-amber-500/30' },
  { name: 'Athlete Mode', rounds: 10, workSec: 40, restSec: 20, color: 'from-red-500/20 to-red-900/10', borderColor: 'border-red-500/30' },
];

const HIIT_EXERCISES = [
  { name: 'Burpees',           img: '/exercises/burpees.png',           tip: 'Squat → Plank → Push-up → Jump up' },
  { name: 'Jump Squats',      img: '/exercises/jump_squats.png',      tip: 'Deep squat, then explode up, land softly' },
  { name: 'Mountain Climbers',img: '/exercises/mountain_climbers.png',tip: 'Plank position, drive knees to chest fast' },
  { name: 'High Knees',       img: '/exercises/high_knees.png',       tip: 'Run in place, lift knees to hip height' },
  { name: 'Push Ups',         img: '/exercises/push_ups.png',         tip: 'Keep core tight, chest touches the floor' },
  { name: 'Box Jumps',        img: '/exercises/box_jumps.png',        tip: 'Bend knees, swing arms, land with soft knees' },
  { name: 'Plank Jacks',      img: '/exercises/plank_jacks.png',      tip: 'Plank position, jump feet wide and together' },
  { name: 'Sprint',           img: '/exercises/sprint.png',           tip: 'Full speed run, drive arms, lean forward' },
];

// Fisher-Yates shuffle
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

function HiitTab({ weight, cardioTarget }) {
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [rounds, setRounds] = useState(8);
  const [workSec, setWorkSec] = useState(30);
  const [restSec, setRestSec] = useState(30);
  const [phase, setPhase] = useState('idle');
  const [currentRound, setCurrentRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalCalories, setTotalCalories] = useState(0);
  const [currentExercise, setCurrentExercise] = useState(HIIT_EXERCISES[0]);
  const timerRef = useRef(null);
  // Shuffled queue — exercises play without repeating
  const queueRef = useRef([]);
  const queueIdxRef = useRef(0);

  const nextExercise = () => {
    if (queueIdxRef.current >= queueRef.current.length) {
      queueRef.current = shuffle(HIIT_EXERCISES);
      queueIdxRef.current = 0;
    }
    const ex = queueRef.current[queueIdxRef.current];
    queueIdxRef.current += 1;
    return ex;
  };

  const applyPreset = (preset) => {
    setSelectedPreset(preset.name);
    setRounds(preset.rounds);
    setWorkSec(preset.workSec);
    setRestSec(preset.restSec);
    setPhase('idle');
    setCurrentRound(1);
    setTotalCalories(0);
    clearInterval(timerRef.current);
  };

  const startHiit = () => {
    // Build fresh shuffled queue
    queueRef.current = shuffle(HIIT_EXERCISES);
    queueIdxRef.current = 0;
    const first = nextExercise();
    setCurrentExercise(first);
    setPhase('work');
    setCurrentRound(1);
    setTimeLeft(workSec);
    setTotalCalories(0);
  };

  const resetHiit = () => {
    clearInterval(timerRef.current);
    setPhase('idle');
    setCurrentRound(1);
    setTimeLeft(0);
    setTotalCalories(0);
  };

  useEffect(() => {
    if (phase === 'idle' || phase === 'done') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (phase === 'work') {
            // Calorie tick: ~0.15 kcal per second of HIIT per kg/75
            setTotalCalories(c => c + (workSec * 0.15 * weight / 75));
            if (currentRound >= rounds) {
              setPhase('done');
              return 0;
            }
            setPhase('rest');
            setCurrentExercise(nextExercise()); // no-repeat next exercise
            return restSec;
          } else {
            setCurrentRound(r => r + 1);
            setPhase('work');
            return workSec;
          }
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase, currentRound, rounds, workSec, restSec, weight]);

  const progress = phase === 'work'
    ? ((workSec - timeLeft) / workSec) * 100
    : phase === 'rest'
    ? ((restSec - timeLeft) / restSec) * 100
    : 0;

  const circumference = 2 * Math.PI * 54;

  return (
    <div className="space-y-5">
      {/* Presets */}
      {phase === 'idle' && (
        <>
          <div>
            <h2 className="text-white font-bold text-lg mb-3 tracking-tight">Quick Presets</h2>
            <div className="space-y-3">
              {HIIT_PRESETS.map((preset, idx) => (
                <motion.button
                  key={preset.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  onClick={() => applyPreset(preset)}
                  className={`w-full glass-card p-4 flex items-center justify-between border bg-gradient-to-r ${preset.color} ${preset.borderColor} ${selectedPreset === preset.name ? 'ring-1 ring-neon/50' : ''} transition-all`}
                >
                  <div className="text-left">
                    <p className="text-white font-bold">{preset.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{preset.rounds} rounds · {preset.workSec}s work · {preset.restSec}s rest</p>
                  </div>
                  <div className="text-right">
                    <p className="text-neon font-black text-sm">~{Math.round(preset.rounds * preset.workSec * 0.15 * weight / 75)} kcal</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Custom Settings */}
          <div className="glass-card p-5 border border-white/5">
            <h3 className="text-white font-bold mb-4">Custom Settings</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Rounds', value: rounds, set: setRounds, min: 1, max: 20 },
                { label: 'Work (s)', value: workSec, set: setWorkSec, min: 10, max: 60 },
                { label: 'Rest (s)', value: restSec, set: setRestSec, min: 5, max: 60 },
              ].map(({ label, value, set, min, max }) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">{label}</p>
                  <button onClick={() => set(v => Math.min(max, v + (label === 'Rounds' ? 1 : 5)))}
                    className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-gray-300 hover:bg-neon hover:text-black transition-colors">
                    <ChevronUp size={14} />
                  </button>
                  <span className="text-xl font-black text-white tabular-nums">{value}</span>
                  <button onClick={() => set(v => Math.max(min, v - (label === 'Rounds' ? 1 : 5)))}
                    className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-gray-300 hover:bg-zinc-700 transition-colors">
                    <ChevronDown size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={startHiit}
            className="w-full py-4 rounded-[1.5rem] bg-neon text-black font-extrabold text-lg flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,184,0,0.3)] hover:opacity-90 transition-opacity"
          >
            <Zap size={20} fill="currentColor" /> Start HIIT
          </button>
        </>
      )}

      {/* Active HIIT Timer */}
      <AnimatePresence>
        {(phase === 'work' || phase === 'rest') && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center gap-6"
          >
            {/* Phase Badge */}
            <motion.div
              key={phase}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`px-6 py-2 rounded-full font-extrabold text-sm uppercase tracking-widest ${
                phase === 'work' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              }`}
            >
              {phase === 'work' ? '🔥 Work' : '💧 Rest'}
            </motion.div>

            {/* Exercise Image + Name */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentExercise.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-2 w-full"
              >
                {/* Exercise Photo */}
                <div className={`w-full rounded-2xl overflow-hidden border ${
                  phase === 'work' ? 'border-red-500/20' : 'border-blue-500/20'
                } relative`}>
                  <img
                    src={currentExercise.img}
                    alt={currentExercise.name}
                    className={`w-full h-36 object-cover ${
                      phase === 'rest' ? 'opacity-40 grayscale' : 'opacity-100'
                    } transition-all duration-500`}
                  />
                  {phase === 'rest' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-blue-300 font-bold text-sm">Next Up ↓</p>
                    </div>
                  )}
                </div>
                {/* Exercise Name */}
                <p className={`font-extrabold text-lg text-center ${
                  phase === 'work' ? 'text-white' : 'text-gray-500'
                }`}>
                  {phase === 'rest' ? `Next: ${currentExercise.name}` : currentExercise.name}
                </p>
                {/* Tip */}
                {phase === 'work' && (
                  <p className="text-xs text-gray-400 text-center px-2">{currentExercise.tip}</p>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Circular Timer */}
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 128 128">
                <circle cx="64" cy="64" r="54" fill="none" stroke="#1e1e1e" strokeWidth="8" />
                <circle
                  cx="64" cy="64" r="54"
                  fill="none"
                  stroke={phase === 'work' ? '#ef4444' : '#3b82f6'}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - (circumference * progress / 100)}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.9s linear' }}
                />
              </svg>
              <div className="text-center">
                <span className="text-5xl font-black text-white tabular-nums">{timeLeft}</span>
                <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">seconds</p>
              </div>
            </div>

            {/* Round indicator */}
            <div className="flex items-center gap-2">
              {Array.from({ length: rounds }).map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all ${
                  i < currentRound - 1 ? 'w-4 bg-neon' :
                  i === currentRound - 1 ? 'w-6 bg-neon/60' : 'w-3 bg-zinc-700'
                }`} />
              ))}
            </div>
            <p className="text-gray-400 text-sm font-semibold">Round {currentRound} / {rounds}</p>

            {/* Calories */}
            <div className="glass-card px-8 py-3 border border-white/5 flex items-center gap-3">
              <Flame size={20} className="text-neon" />
              <span className="text-2xl font-black text-white tabular-nums">{totalCalories.toFixed(1)}</span>
              <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">kcal</span>
            </div>

            <button onClick={resetHiit}
              className="w-full py-3 rounded-2xl bg-zinc-900 border border-white/10 text-gray-400 font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors">
              <RotateCcw size={16} /> Stop
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Done State */}
      <AnimatePresence>
        {phase === 'done' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-5 py-6"
          >
            <div className="w-20 h-20 rounded-full bg-neon/10 border-2 border-neon/40 flex items-center justify-center text-4xl">
              🏆
            </div>
            <div className="text-center">
              <h3 className="text-white font-extrabold text-2xl">HIIT Complete!</h3>
              <p className="text-gray-400 text-sm mt-1">{rounds} rounds crushed</p>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="glass-card p-4 text-center border border-white/5">
                <p className="text-3xl font-black text-neon">{totalCalories.toFixed(0)}</p>
                <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Kcal Burned</p>
              </div>
              <div className="glass-card p-4 text-center border border-white/5">
                <p className="text-3xl font-black text-white">{Math.round((workSec * rounds) / 60)}m</p>
                <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Active Time</p>
              </div>
            </div>
            <button onClick={resetHiit}
              className="w-full py-4 rounded-[1.5rem] bg-neon text-black font-extrabold flex items-center justify-center gap-2">
              <RotateCcw size={18} /> Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── MAIN CARDIO PAGE ──────────────────────────────────────────────────────────

export default function Cardio() {
  const { userData, saveSteps } = useUser();
  const weight = parseFloat(userData?.weight) || 70;
  const cardioTarget = userData?.targets?.cardioTarget || 200;
  
  const [activeTab, setActiveTab] = useState('Outdoor');
  const [isTracking, setIsTracking] = useState(false);
  
  // Live Tracking State
  const [steps, setSteps] = useState(0);
  const [liveCalories, setLiveCalories] = useState(0);
  const [distance, setDistance] = useState(0);
  const [seconds, setSeconds] = useState(0);

  // Sensor state refs to avoid dependency loops in event listeners
  const stepsRef = useRef(steps);
  const isTrackingRef = useRef(isTracking);
  const lastStepTimeRef = useRef(0);
  
  // Sync refs
  useEffect(() => {
    stepsRef.current = steps;
    isTrackingRef.current = isTracking;
  }, [steps, isTracking]);

  const tabs = ['Outdoor', 'Indoor', 'HIIT'];
  
  const activities = [
    { name: 'Running', icon: Activity, cals: '320', time: '30m' },
    { name: 'Cycling', icon: Bike, cals: '450', time: '45m' },
    { name: 'Walking', icon: Footprints, cals: '150', time: '40m' },
    { name: 'Hiking', icon: Mountain, cals: '520', time: '1h 20m' },
  ];

  // Load from localStorage and handle Midnight Reset
  useEffect(() => {
    const savedDate = localStorage.getItem('cardio_last_date');
    const today = getTodayDateStr();

    if (savedDate !== today) {
      // Midnight Reset
      setSteps(0);
      setLiveCalories(0);
      setDistance(0);
      setSeconds(0);
      localStorage.setItem('cardio_last_date', today);
      localStorage.setItem('cardio_steps', '0');
      localStorage.setItem('cardio_seconds', '0');
    } else {
      // Load saved
      const savedSteps = parseInt(localStorage.getItem('cardio_steps') || '0', 10);
      const savedSeconds = parseInt(localStorage.getItem('cardio_seconds') || '0', 10);
      setSteps(savedSteps);
      setSeconds(savedSeconds);
      setLiveCalories(savedSteps * 0.04);
      setDistance(savedSteps * 0.0008);
    }
  }, []);

  // Save to localStorage when metrics change
  useEffect(() => {
    localStorage.setItem('cardio_steps', steps.toString());
    localStorage.setItem('cardio_seconds', seconds.toString());
  }, [steps, seconds]);

  // Handle Visibility Change (Background/Foreground)
  useEffect(() => {
    let lastHiddenTime = 0;
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        lastHiddenTime = Date.now();
      } else if (document.visibilityState === 'visible' && isTrackingRef.current) {
        if (lastHiddenTime) {
          const elapsedSeconds = Math.floor((Date.now() - lastHiddenTime) / 1000);
          setSeconds(prev => prev + elapsedSeconds);
          // Note: Real device steps can't be counted accurately while suspended in web.
          // We could estimate steps based on elapsed time here if desired.
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Timer Effect
  useEffect(() => {
    let interval;
    if (isTracking) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTracking]);

  // Motion Sensor (DeviceMotionEvent) for Step Counting
  useEffect(() => {
    const handleMotion = (event) => {
      if (!isTrackingRef.current) return;
      if (!event.accelerationIncludingGravity) return;

      const { x, y, z } = event.accelerationIncludingGravity;
      
      // Calculate magnitude of acceleration vector
      const magnitude = Math.sqrt(x * x + y * y + z * z);

      // Simple peak detection threshold for walking/running
      // Gravity is ~9.8. A threshold of 12-14 usually indicates a step impact.
      const THRESHOLD = 12.5; 
      const MIN_TIME_BETWEEN_STEPS = 300; // ms

      if (magnitude > THRESHOLD) {
        const now = Date.now();
        if (now - lastStepTimeRef.current > MIN_TIME_BETWEEN_STEPS) {
          lastStepTimeRef.current = now;
          const newSteps = stepsRef.current + 1;
          setSteps(newSteps);
          setLiveCalories(newSteps * 0.04);
          setDistance(newSteps * 0.0008);
        }
      }
    };

    if (isTracking) {
      window.addEventListener('devicemotion', handleMotion);
    } else {
      window.removeEventListener('devicemotion', handleMotion);
    }

    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [isTracking]);

  const requestPermissionAndStart = async () => {
    // iOS 13+ requires explicit permission for device motion
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
      try {
        const permissionState = await DeviceMotionEvent.requestPermission();
        if (permissionState === 'granted') {
          setIsTracking(true);
        } else {
          alert('Motion sensor access is required for step tracking.');
        }
      } catch (error) {
        console.error('Error requesting motion permission:', error);
        // Fallback for non-iOS or simulated envs
        setIsTracking(true);
      }
    } else {
      // Android or older iOS
      setIsTracking(true);
    }
  };

  const handleStart = () => {
    requestPermissionAndStart();
  };

  const handleStop = () => {
    setIsTracking(false);
    if (steps > 0) {
      saveSteps(steps); // Persist to global context/history
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
          {isTracking ? 'Resume Tracking' : 'Ready Now'}
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
                className="absolute inset-0 bg-neon rounded-2xl shadow-[0_0_15px_rgba(255, 184, 0,0.4)] -z-10"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            {tab}
          </button>
        ))}
      </div>


      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'Outdoor' && (
          <motion.section
            key="outdoor"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-white font-bold text-xl mb-6 tracking-tight">Past Activities</h2>
            <div className="space-y-4">
              {activities.map((activity, idx) => (
                <motion.div
                  key={activity.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-card p-5 flex items-center gap-5 hover:bg-white/10 transition-all cursor-pointer hover:-translate-y-1"
                >
                  <div className="w-14 h-14 rounded-[1.2rem] bg-zinc-800/80 flex items-center justify-center text-neon border border-white/5 shadow-inner">
                    <activity.icon size={26} className="drop-shadow-[0_0_8px_rgba(255,184,0,0.5)]" />
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
            </div>
          </motion.section>
        )}

        {activeTab === 'Indoor' && (
          <motion.div
            key="indoor"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            <IndoorTab weight={weight} cardioTarget={cardioTarget} />
          </motion.div>
        )}

        {activeTab === 'HIIT' && (
          <motion.div
            key="hiit"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            <HiitTab weight={weight} cardioTarget={cardioTarget} />
          </motion.div>
        )}
      </AnimatePresence>

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
              <div className="flex items-center gap-2">
                 <Timer size={16} className="text-neon" />
                 <span className="text-white font-mono text-xl">{formatTime(seconds)}</span>
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="relative w-64 h-64 flex items-center justify-center">
                {/* Progress Ring Simulation */}
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 256 256">
                  <circle cx="128" cy="128" r="120" fill="none" stroke="#1e1e1e" strokeWidth="8" />
                  <motion.circle 
                    cx="128" cy="128" r="120" 
                    fill="none" 
                    stroke="#FFB800" 
                    strokeWidth="8"
                    strokeDasharray={753.9}
                    strokeDashoffset={753.9 - (753.9 * Math.min(liveCalories / cardioTarget, 1))}
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_10px_rgba(255, 184, 0,0.5)] transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="flex flex-col items-center text-center">
                  <Flame size={36} className="text-neon mb-2 drop-shadow-[0_0_10px_rgba(255, 184, 0,0.8)]" />
                  <span className="text-6xl font-black text-white tracking-tighter tabular-nums">{liveCalories.toFixed(1)}</span>
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">kcal burned</span>
                </div>
              </div>

              {/* Grid Metrics */}
              <div className="grid grid-cols-2 gap-8 mt-12 w-full max-w-sm">
                <div className="flex flex-col items-center glass-card p-4 rounded-2xl border border-white/5">
                  <span className="text-3xl font-black text-white tabular-nums">{steps}</span>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1 flex items-center gap-1"><Footprints size={12} className="text-neon"/> Steps</span>
                </div>
                <div className="flex flex-col items-center glass-card p-4 rounded-2xl border border-white/5">
                  <span className="text-3xl font-black text-white tabular-nums">{distance.toFixed(2)}</span>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1 flex items-center gap-1"><Activity size={12} className="text-neon"/> Distance (km)</span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleStop}
              className="w-full py-4 rounded-[1.5rem] bg-zinc-900 border border-white/10 text-white font-bold text-lg flex items-center justify-center gap-3 hover:bg-zinc-800 transition-colors shadow-lg mt-4"
            >
              <Square size={20} className="text-red-500" fill="currentColor" />
              Pause Workout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
