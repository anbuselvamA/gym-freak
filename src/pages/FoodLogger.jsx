import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, Plus, Minus, X, Check, Flame, ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { FOOD_DB, FOOD_CATEGORIES } from '../data/foodDatabase';

const CATEGORY_COLORS = {
  'Protein':     'text-rose-400 bg-rose-500/10 border-rose-500/20',
  'Carbs':       'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  'Indian':      'text-orange-400 bg-orange-500/10 border-orange-500/20',
  'Dairy':       'text-blue-400 bg-blue-500/10 border-blue-500/20',
  'Fruit':       'text-pink-400 bg-pink-500/10 border-pink-500/20',
  'Vegetable':   'text-green-400 bg-green-500/10 border-green-500/20',
  'Nuts & Fats': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  'Drinks':      'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  'Snacks':      'text-purple-400 bg-purple-500/10 border-purple-500/20',
};

export default function FoodLogger() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { logMeal } = useUser();

  const mealType = state?.mealType || 'Meal';
  const mealTime = state?.mealTime || new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' });

  const [query, setQuery]           = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selected, setSelected]     = useState([]); // [{...food, qty: 1}]
  const [showSelected, setShowSelected] = useState(false);

  // Filter food list
  const filtered = useMemo(() => {
    let list = FOOD_DB;
    if (activeCategory !== 'All') list = list.filter((f) => f.category === activeCategory);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((f) => f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q));
    }
    return list;
  }, [query, activeCategory]);

  const totalCals = selected.reduce((sum, f) => sum + f.cals * f.qty, 0);

  const addFood = (food) => {
    setSelected((prev) => {
      const exists = prev.find((f) => f.id === food.id);
      if (exists) return prev.map((f) => f.id === food.id ? { ...f, qty: f.qty + 1 } : f);
      return [...prev, { ...food, qty: 1 }];
    });
  };

  const removeFood = (id) => setSelected((prev) => prev.filter((f) => f.id !== id));
  const decQty    = (id) => setSelected((prev) => prev.map((f) => f.id === id ? { ...f, qty: Math.max(1, f.qty - 1) } : f));
  const incQty    = (id) => setSelected((prev) => prev.map((f) => f.id === id ? { ...f, qty: f.qty + 1 } : f));

  const selectedCount = (id) => selected.find((f) => f.id === id)?.qty || 0;

  const handleConfirm = () => {
    if (selected.length === 0) return;
    const foodItems = selected.map((f) => ({
      name: f.name,
      serving: `${f.qty > 1 ? `${f.qty}× ` : ''}${f.serving}`,
      cals: f.cals * f.qty,
    }));
    logMeal({
      title: mealType,
      time: mealTime,
      items: selected.map((f) => f.name).join(', '),
      foodItems,
      cals: String(totalCals),
    });
    navigate('/food');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      className="flex flex-col h-full pt-10 pb-24"
    >
      {/* Header */}
      <div className="px-6 mb-5">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:bg-white/10 transition-colors">
            <ArrowLeft size={20} className="text-white" />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tighter">Log {mealType}</h1>
            <p className="text-gray-500 text-xs">Search and add what you ate</p>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 bg-zinc-900 border border-white/10 rounded-2xl px-4 py-3">
          <Search size={18} className="text-gray-400 shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search food (e.g. egg, rice, roti...)"
            className="bg-transparent border-none outline-none text-white w-full text-sm placeholder-gray-500"
          />
          {query && <button onClick={() => setQuery('')}><X size={16} className="text-gray-500" /></button>}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide px-6 pb-3">
        {FOOD_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
              activeCategory === cat
                ? 'bg-neon text-black border-neon'
                : 'bg-zinc-900 text-gray-400 border-white/10 hover:border-white/30'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Food List */}
      <div className="flex-1 overflow-y-auto px-6 space-y-2 pt-2">
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-sm">No food found for "<span className="text-white">{query}</span>"</p>
          </div>
        )}
        {filtered.map((food) => {
          const qty = selectedCount(food.id);
          const catStyle = CATEGORY_COLORS[food.category] || 'text-gray-400 bg-white/5 border-white/10';
          return (
            <motion.div
              key={food.id}
              layout
              className="glass-card p-4 flex items-center gap-3"
            >
              {/* Cal badge */}
              <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 border ${catStyle}`}>
                <span className="text-xs font-black leading-none">{food.cals}</span>
                <span className="text-[8px] font-bold opacity-70">kcal</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm leading-tight truncate">{food.name}</p>
                <p className="text-gray-500 text-xs mt-0.5">{food.serving}</p>
                <span className={`text-[9px] font-bold uppercase tracking-widest mt-1 inline-block ${catStyle.split(' ')[0]}`}>{food.category}</span>
              </div>
              {/* Qty control */}
              {qty > 0 ? (
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => decQty(food.id)} className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors">
                    <Minus size={13} className="text-white" />
                  </button>
                  <span className="text-white font-black text-sm w-5 text-center">{qty}</span>
                  <button onClick={() => incQty(food.id)} className="w-7 h-7 rounded-full bg-neon flex items-center justify-center hover:bg-[#2fe512] transition-colors">
                    <Plus size={13} className="text-black" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => addFood(food)}
                  className="shrink-0 w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-neon hover:text-black text-gray-400 transition-all"
                >
                  <Plus size={16} />
                </button>
              )}
            </motion.div>
          );
        })}
        <div className="h-4" />
      </div>

      {/* Confirm Bar — shows when items selected */}
      <AnimatePresence>
        {selected.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="absolute bottom-20 left-0 right-0 px-6"
          >
            <div className="glass-card border border-neon/30 bg-[#0e0e0e]/95 backdrop-blur-xl rounded-3xl p-4">
              {/* Selected items summary toggle */}
              <button
                onClick={() => setShowSelected((v) => !v)}
                className="w-full flex items-center justify-between mb-3"
              >
                <div className="flex items-center gap-2">
                  <span className="text-neon font-black text-sm">{selected.length} item{selected.length > 1 ? 's' : ''} selected</span>
                  <ChevronDown size={14} className={`text-gray-400 transition-transform ${showSelected ? 'rotate-180' : ''}`} />
                </div>
                <div className="flex items-center gap-1">
                  <Flame size={14} className="text-neon" />
                  <span className="text-white font-black text-lg">{totalCals}</span>
                  <span className="text-xs text-gray-400">kcal</span>
                </div>
              </button>

              <AnimatePresence>
                {showSelected && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mb-3"
                  >
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {selected.map((f) => (
                        <div key={f.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <button onClick={() => removeFood(f.id)} className="w-5 h-5 rounded-full bg-zinc-700 flex items-center justify-center shrink-0 hover:bg-red-500 transition-colors">
                              <X size={10} className="text-white" />
                            </button>
                            <span className="text-gray-300 text-xs truncate">{f.qty > 1 ? `${f.qty}× ` : ''}{f.name}</span>
                          </div>
                          <span className="text-neon text-xs font-bold shrink-0 ml-2">{f.cals * f.qty} kcal</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-white/10 mt-2 pt-2 flex justify-between text-xs font-bold">
                      <span className="text-gray-400">Total</span>
                      <span className="text-neon">{totalCals} kcal</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={handleConfirm}
                className="w-full py-3.5 rounded-2xl bg-neon text-black font-extrabold text-base flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(255, 184, 0,0.3)]"
              >
                <Check size={20} />
                Log {mealType} · {totalCals} kcal
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
