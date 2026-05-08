import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Flame, Clock, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function MealDetail() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const meal = state?.meal;

  if (!meal) {
    navigate('/food');
    return null;
  }

  const totalCals = meal.foodItems?.reduce((sum, item) => sum + item.cals, 0) || parseInt(meal.cals);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      className="pt-12 px-8 pb-36 min-h-screen"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={20} className="text-white" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tighter">{meal.title}</h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Clock size={12} className="text-gray-500" />
            <span className="text-xs text-gray-500">Logged at {meal.time}</span>
          </div>
        </div>
      </div>

      {/* Calorie Summary Card */}
      <section className="glass-card layered-card p-6 mb-8 flex items-center justify-between border-t-2 border-t-neon bg-gradient-to-r from-zinc-900/60 to-black/60">
        <div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Total Calories</p>
          <div className="flex items-center gap-2">
            <Flame size={22} className="text-neon" />
            <span className="text-4xl font-black text-white tracking-tighter">{totalCals}</span>
            <span className="text-neon font-bold text-sm">kcal</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Items</p>
          <span className="text-3xl font-black text-white">{meal.foodItems?.length || 1}</span>
        </div>
      </section>

      {/* Food Items Breakdown */}
      <section>
        <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-5">What you ate</h2>
        <div className="space-y-3">
          {meal.foodItems ? (
            meal.foodItems.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.07 }}
                className="glass-card p-5 flex items-center gap-4 hover:bg-white/10 transition-colors"
              >
                {/* Calorie color indicator */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  item.cals > 200 ? 'bg-orange-500/20 text-orange-400' :
                  item.cals > 100 ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-neon/20 text-neon'
                }`}>
                  <span className="text-xs font-black">{item.cals}</span>
                </div>
                <div className="flex-1">
                  <p className="text-white font-bold text-sm">{item.name}</p>
                  {item.serving && (
                    <p className="text-xs text-gray-500 mt-0.5">{item.serving}</p>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-white font-black text-lg">{item.cals}</span>
                  <span className="text-xs text-gray-400 ml-1">kcal</span>
                </div>
              </motion.div>
            ))
          ) : (
            // Fallback: split items string
            meal.items.split(',').map((item, idx) => (
              <div key={idx} className="glass-card p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-neon" />
                  <span className="text-white font-medium text-sm">{item.trim()}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Total Footer */}
        <div className="mt-6 pt-5 border-t border-white/10 flex justify-between items-center">
          <span className="text-gray-400 font-bold text-sm">Total</span>
          <div className="flex items-center gap-1">
            <Flame size={16} className="text-neon" />
            <span className="text-neon font-black text-xl">{totalCals} kcal</span>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
