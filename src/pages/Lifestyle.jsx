import React from 'react';
import { motion } from 'framer-motion';
import { Moon, HeartPulse, Footprints, Droplets, Activity, Settings, Target, User, TrendingUp, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';

export default function Lifestyle() {
  const navigate = useNavigate();
  const { userData, getTodaySteps, stepsHistory, getBurnedCals } = useUser();
  const { targets, name, goal, weight, gender } = userData || {};
  const stepGoal = targets?.steps || 10000;

  const todaySteps = getTodaySteps ? getTodaySteps() : 0;
  const burnedCals = getBurnedCals ? getBurnedCals() : 0;
  const stepPercent = Math.min(Math.round((todaySteps / stepGoal) * 100), 100);

  // Prepare last 7 days for the bar chart (fill missing dates with 0)
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateKey = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString('en', { weekday: 'short' });
    const entry = (stepsHistory || []).find((e) => e.date === dateKey);
    return { day: dayLabel, steps: entry ? entry.steps : 0, dateKey };
  });

  const todayKey = new Date().toISOString().split('T')[0];

  const goalLabel = goal === 'lose' ? 'Fat Loss' : goal === 'gain' ? 'Muscle Gain' : 'Maintenance';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pt-12 px-8 pb-36 min-h-screen"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tighter">Account</h1>
          <p className="text-gray-400 text-sm mt-0.5">{goalLabel} · {weight || '--'}kg</p>
        </div>
        <button 
          onClick={() => navigate('/settings')}
          className="w-12 h-12 rounded-full glass-card flex items-center justify-center text-gray-300 hover:text-white transition-all hover:scale-105"
        >
          <Settings size={22} />
        </button>
      </div>

      {/* Profile Card */}
      <section className="glass-card layered-card p-6 mb-6 flex items-center gap-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-neon/10 rounded-bl-full blur-3xl pointer-events-none"></div>
        <div className="w-16 h-16 rounded-full bg-zinc-800 border-[3px] border-neon flex items-center justify-center neon-glow">
          <User size={30} className="text-neon" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">{name || 'User'}</h2>
          <p className="text-gray-400 text-sm">{gender === 'male' ? 'Male' : 'Female'} · {goalLabel}</p>
          <p className="text-xs text-neon font-bold mt-1">Nexus AI Member</p>
        </div>
      </section>

      {/* Today's Steps Card */}
      <section className="glass-card p-6 mb-6 relative overflow-hidden border border-neon/20">
        <div className="absolute top-0 right-0 w-20 h-20 bg-neon/10 rounded-bl-full blur-2xl pointer-events-none"></div>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <Footprints size={20} className="text-neon" />
            <h2 className="text-white font-bold text-base">Today's Steps</h2>
          </div>
          <span className="text-xs text-neon font-bold bg-neon/10 px-2 py-1 rounded-full border border-neon/20">
            {stepPercent}% of goal
          </span>
        </div>

        <div className="flex items-end gap-3 mb-4">
          <span className="text-5xl font-black text-white tracking-tighter tabular-nums">{todaySteps.toLocaleString()}</span>
          <div className="pb-1.5">
            <span className="text-sm text-gray-400">/ {stepGoal.toLocaleString()}</span>
            <p className="text-xs text-gray-500">steps goal</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stepPercent}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-neon rounded-full shadow-[0_0_10px_rgba(255, 184, 0,0.5)]"
          />
        </div>
        <p className="text-xs text-gray-500">
          {todaySteps === 0
            ? 'Complete a workout in the Cardio tab to track steps'
            : `${Math.max(0, stepGoal - todaySteps).toLocaleString()} more steps to reach your daily goal!`}
        </p>
      </section>

      {/* 7-Day Steps Chart */}
      <section className="glass-card p-6 mb-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-white font-bold text-base tracking-tight">Weekly Steps</h2>
          <span className="text-xs text-gray-500">Last 7 days</span>
        </div>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={last7} barSize={28}>
            <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 11, fontWeight: '600' }} axisLine={false} tickLine={false} />
            <Tooltip
              cursor={false}
              content={({ active, payload }) =>
                active && payload?.length ? (
                  <div className="bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs">
                    <p className="text-neon font-bold">{payload[0].value.toLocaleString()} steps</p>
                  </div>
                ) : null
              }
            />
            <Bar dataKey="steps" radius={[6, 6, 0, 0]}>
              {last7.map((entry) => (
                <Cell
                  key={entry.dateKey}
                  fill={entry.dateKey === todayKey ? '#FFB800' : '#27272a'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* 30-Day History */}
      <section className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white font-bold text-base tracking-tight">30-Day History</h2>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <TrendingUp size={14} className="text-neon" />
            <span>{stepsHistory?.length || 0} sessions</span>
          </div>
        </div>

        {(!stepsHistory || stepsHistory.length === 0) ? (
          <div className="glass-card p-8 text-center">
            <Footprints size={32} className="text-gray-700 mx-auto mb-3" />
            <p className="text-gray-400 text-sm font-medium">No step history yet</p>
            <p className="text-gray-600 text-xs mt-1">Complete a workout in the Cardio tab to start tracking</p>
          </div>
        ) : (
          <div className="space-y-2">
            {stepsHistory.slice(0, 30).map((entry, idx) => {
              const d = new Date(entry.date + 'T00:00:00');
              const isToday = entry.date === todayKey;
              const pct = Math.min((entry.steps / stepGoal) * 100, 100);
              return (
                <motion.div
                  key={entry.date}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className={`glass-card p-4 flex items-center gap-4 ${isToday ? 'border border-neon/30 bg-neon/5' : ''}`}
                >
                  <div className="min-w-[48px] text-center">
                    <p className="text-xs font-bold text-gray-400">{d.toLocaleDateString('en', { weekday: 'short' })}</p>
                    <p className="text-[10px] text-gray-600">{d.toLocaleDateString('en', { day: 'numeric', month: 'short' })}</p>
                    {isToday && <p className="text-[9px] text-neon font-bold mt-0.5">TODAY</p>}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-white font-bold text-sm">{entry.steps.toLocaleString()} steps</span>
                      <span className={`text-xs font-bold ${pct >= 100 ? 'text-neon' : 'text-gray-400'}`}>{Math.round(pct)}%</span>
                    </div>
                    <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${pct >= 100 ? 'bg-neon shadow-[0_0_6px_rgba(255, 184, 0,0.6)]' : 'bg-zinc-600'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* Quick Links Grid */}
      <div className="grid grid-cols-2 gap-4">
        <LifestyleCard title="Sleep" value="7h 20m" icon={Moon} color="text-indigo-400" subtitle="Optimal" />
        <LifestyleCard title="Burned" value={burnedCals.toFixed(0)} icon={Flame} color="text-orange-400" subtitle="Active Kcal" />
        <LifestyleCard title="Water" value="2.1L" icon={Droplets} color="text-blue-400" subtitle={`Goal: ${targets?.water || 3}L`} />
        <LifestyleCard title="Workouts" value="4 Days" icon={Activity} color="text-orange-400" subtitle="This week" />
        <LifestyleCard
          title="Weight"
          value={`${weight || '--'} kg`}
          subtitle="Track progress"
          icon={Target}
          color="text-neon"
          onClick={() => navigate('/weight')}
        />
      </div>
    </motion.div>
  );
}

function LifestyleCard({ title, value, icon: Icon, color, subtitle, onClick }) {
  return (
    <div onClick={onClick} className={`glass-card p-5 flex flex-col justify-between min-h-[130px] ${onClick ? 'cursor-pointer hover:bg-white/10 hover:-translate-y-1 transition-all' : ''}`}>
      <div className="flex justify-between items-start mb-3">
        <div className={`p-2 rounded-xl bg-zinc-800/50 ${color}`}>
          <Icon size={20} className="drop-shadow-md" />
        </div>
        <span className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">{title}</span>
      </div>
      <div>
        <h3 className="text-2xl font-black text-white mb-1 tracking-tight">{value}</h3>
        <p className="text-xs text-gray-400 font-medium">{subtitle}</p>
      </div>
    </div>
  );
}
