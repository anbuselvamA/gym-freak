import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Bell, User as UserIcon } from 'lucide-react';
import { useUser } from '../context/UserContext';

const COLORS = ['#FFB800', '#1e1e1e'];

export default function Dashboard() {
  const { userData, foodLog, getTodaySteps, getBurnedCals } = useUser();
  const { targets, name } = userData || { targets: { calories: 2500, steps: 10000, water: 3.0, protein: 150, carbs: 200, fats: 60 }, name: 'Guest' };
  
  // Real steps from UserContext
  const todaySteps = getTodaySteps();
  const burnedCals = getBurnedCals();
  const displaySteps = todaySteps >= 1000 ? (todaySteps / 1000).toFixed(1) + 'k' : todaySteps.toString();
  
  // Real consumed from daily food log (resets each day)
  const consumedCals = foodLog?.totalCals || 0;
  
  const calorieData = [
    { name: 'Consumed', value: consumedCals },
    { name: 'Remaining', value: Math.max(0, targets.calories - consumedCals) },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pt-12 px-8 pb-36 min-h-screen"
    >
      {/* Header */}
      <header className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-zinc-800 flex items-center justify-center border-[3px] border-neon neon-glow shadow-neon overflow-hidden">
            {userData?.profileImage ? (
              <img src={userData.profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="text-neon" size={28} />
            )}
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium tracking-wide">Good Morning,</p>
            <h1 className="text-3xl font-extrabold text-white tracking-tighter">{name}</h1>
          </div>
        </div>
        <button className="w-12 h-12 rounded-full glass-card flex items-center justify-center text-gray-300 hover:text-white transition-all hover:scale-105">
          <Bell size={22} />
        </button>
      </header>

      {/* Main Calorie Ring */}
      <section className="glass-card layered-card p-8 mb-8 flex flex-col items-center relative">
        <h2 className="text-gray-400 text-sm font-semibold mb-2 self-start w-full uppercase tracking-wider">Daily Calories</h2>
        <div className="w-56 h-56 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={calorieData}
                innerRadius={80}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
                cornerRadius={12}
              >
                {calorieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-4xl font-black text-white tracking-tighter">{consumedCals}</span>
            <span className="text-xs text-gray-400 uppercase tracking-widest mt-1 font-medium">kcal</span>
          </div>
        </div>
        <div className="grid grid-cols-3 w-full mt-6 text-sm px-2 text-center divide-x divide-white/10">
          <div className="flex flex-col">
            <span className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">Consumed</span>
            <span className="font-bold text-white text-lg">{consumedCals}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-neon text-[10px] uppercase tracking-wider mb-1">Burned</span>
            <span className="font-bold text-white text-lg">{burnedCals.toFixed(0)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">Target</span>
            <span className="font-bold text-white text-lg">{targets.calories}</span>
          </div>
        </div>
      </section>

      {/* Macro Nutrient Progress Bars */}
      <section className="glass-card p-8 mb-8">
        <h2 className="text-gray-400 text-sm font-semibold mb-6 uppercase tracking-wider">Macros</h2>
        <div className="space-y-4">
          <MacroBar label="Protein" current={120} max={targets.protein} color="bg-[#FFB800]" />
          <MacroBar label="Carbs" current={160} max={targets.carbs} color="bg-blue-500" />
          <MacroBar label="Fats" current={45} max={targets.fats} color="bg-yellow-500" />
        </div>
      </section>

      {/* Small Stat Cards */}
      <section className="grid grid-cols-3 gap-3">
        <StatCard title="Steps" value={displaySteps} target={`${(targets.steps/1000).toFixed(1)}k`} unit="steps" />
        <StatCard title="Water" value="2.1" target={`${targets.water}L`} unit="L" />
        <StatCard title="Sleep" value="7h 20m" target="8h" />
      </section>
    </motion.div>
  );
}

function MacroBar({ label, current, max, color }) {
  const percentage = Math.min((current / max) * 100, 100);
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-300 font-medium">{label}</span>
        <span className="text-gray-400">{current} / {max}g</span>
      </div>
      <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  );
}

function StatCard({ title, value, target, unit }) {
  return (
    <div className="glass-card p-2 flex flex-col items-center text-center justify-center min-h-[100px] hover:bg-white/10 transition-colors cursor-pointer relative overflow-hidden">
      <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-1.5 font-medium whitespace-nowrap">{title}</span>
      <span className="text-xl font-black text-white tracking-tighter whitespace-nowrap">{value}</span>
      {unit && <span className="text-[9px] text-gray-500 uppercase mt-0.5 whitespace-nowrap">{unit}</span>}
      {target && <span className="text-[8px] text-neon uppercase mt-1.5 tracking-widest whitespace-nowrap">Goal: {target}</span>}
    </div>
  );
}
