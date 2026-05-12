import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FoodDetails() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="min-h-screen bg-black pb-28"
    >
      {/* Header Image */}
      <div className="relative h-72 w-full">
        <img src="/premium_meal.png" alt="Food" className="w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-10 left-6 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="px-6 -mt-10 relative z-10">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Salmon Quinoa Bowl</h1>
            <p className="text-gray-400 text-sm">Healthy & High Protein</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-neon">540</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">kcal</div>
          </div>
        </div>

        {/* Macros Breakdown */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <MacroCard title="Protein" value="42g" color="border-[#FFB800]" />
          <MacroCard title="Carbs" value="45g" color="border-blue-500" />
          <MacroCard title="Fats" value="22g" color="border-yellow-500" />
        </div>

        {/* Nutritional Breakdown */}
        <section className="glass-card p-6 mb-8">
          <h2 className="text-white font-semibold text-lg mb-4">Nutritional Info</h2>
          <div className="space-y-3">
            <NutritionRow label="Saturated Fat" value="4g" />
            <NutritionRow label="Cholesterol" value="85mg" />
            <NutritionRow label="Sodium" value="420mg" />
            <NutritionRow label="Potassium" value="680mg" />
            <NutritionRow label="Fiber" value="8g" />
            <NutritionRow label="Sugar" value="5g" />
          </div>
        </section>

        {/* Add Button */}
        <button className="w-full py-4 rounded-2xl bg-neon text-black font-bold text-lg flex items-center justify-center gap-2 neon-glow shadow-neon hover:bg-[#2fe512] transition-colors">
          <Plus size={24} />
          Add to Log
        </button>
      </div>
    </motion.div>
  );
}

function MacroCard({ title, value, color }) {
  return (
    <div className={`glass-card p-4 flex flex-col items-center border-b-4 ${color}`}>
      <span className="text-gray-400 text-xs mb-1">{title}</span>
      <span className="text-white font-bold text-xl">{value}</span>
    </div>
  );
}

function NutritionRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-none">
      <span className="text-gray-400 text-sm">{label}</span>
      <span className="text-white font-medium text-sm">{value}</span>
    </div>
  );
}
