import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft, Target, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const data = [
  { name: 'Mon', weight: 75.5 },
  { name: 'Tue', weight: 75.2 },
  { name: 'Wed', weight: 75.0 },
  { name: 'Thu', weight: 74.8 },
  { name: 'Fri', weight: 74.9 },
  { name: 'Sat', weight: 74.5 },
  { name: 'Sun', weight: 74.2 },
];

export default function WeightTracker() {
  const navigate = useNavigate();
  const { userData } = useUser();
  const currentWeight = userData?.weight || 74.2;
  const goalWeight = userData?.goal === 'lose' ? (parseFloat(currentWeight) - 5).toFixed(1) : userData?.goal === 'gain' ? (parseFloat(currentWeight) + 5).toFixed(1) : currentWeight;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="pt-12 px-8 pb-36 min-h-screen"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <button
          onClick={() => navigate(-1)}
          className="w-12 h-12 rounded-full glass-card flex items-center justify-center text-white hover:bg-white/10 transition-all hover:scale-105"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-3xl font-extrabold text-white tracking-tighter">Weight</h1>
      </div>

      {/* Main Stats */}
      <div className="flex gap-4 mb-10">
        <div className="flex-1 glass-card p-6 flex flex-col justify-center border-t-4 border-t-neon layered-card relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-neon/10 rounded-bl-full blur-xl"></div>
          <span className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-2">Current Weight</span>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black text-white tracking-tighter">{currentWeight}</span>
            <span className="text-sm text-neon font-bold">kg</span>
          </div>
        </div>
        <div className="flex-1 glass-card p-6 flex flex-col justify-center border-t-4 border-zinc-700">
          <span className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-2">Goal Weight</span>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black text-white tracking-tighter opacity-80">{goalWeight}</span>
            <span className="text-sm text-gray-500 font-bold">kg</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <section className="glass-card p-6 mb-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-white font-bold text-xl tracking-tight">Weekly Trend</h2>
          <div className="flex items-center gap-1 text-neon text-sm font-bold bg-neon/10 px-3 py-1.5 rounded-xl border border-neon/20">
            <TrendingDown size={18} />
            <span>-1.3 kg</span>
          </div>
        </div>
        <div className="h-64 w-full -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#121212', border: '1px solid #27272a', borderRadius: '12px', color: '#fff' }}
                itemStyle={{ color: '#FFB800', fontWeight: 'bold' }}
              />
              <Line 
                type="monotone" 
                dataKey="weight" 
                stroke="#FFB800" 
                strokeWidth={3} 
                dot={{ fill: '#0a0a0a', stroke: '#FFB800', strokeWidth: 2, r: 4 }} 
                activeDot={{ r: 6, fill: '#FFB800', stroke: '#0a0a0a', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Log Weight Button */}
      <button className="w-full py-5 rounded-[1.5rem] bg-zinc-900 border border-white/10 text-white font-bold text-lg flex items-center justify-center gap-3 hover:bg-zinc-800 transition-colors shadow-lg group">
        <Target size={24} className="text-neon group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(255, 184, 0,0.8)]" />
        Log Today's Weight
      </button>
    </motion.div>
  );
}
