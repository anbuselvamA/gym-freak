import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Camera, ChevronRight, Sparkles, Beef, Wheat, Droplets, UtensilsCrossed, Plus, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import AICameraScanner from '../components/AICameraScanner';

// Helper
const sumCals = (items) => items.reduce((s, i) => s + i.cals, 0);

// Fat Loss food items
const _BF_LOSE = [
  { name: 'Egg White Omelette', serving: '3 egg whites + mixed veggies', cals: 110 },
  { name: 'Oats with Berries', serving: '40g oats + 50g mixed berries', cals: 205 },
  { name: 'Green Tea', serving: '1 cup, unsweetened', cals: 5 },
];
const _LU_LOSE = [
  { name: 'Grilled Chicken Breast', serving: '165g, skinless', cals: 272 },
  { name: 'Brown Rice (cooked)', serving: '120g', cals: 156 },
  { name: 'Steamed Broccoli', serving: '150g', cals: 52 },
];
const _SN_LOSE = [
  { name: 'Greek Yogurt (plain, low fat)', serving: '150g', cals: 86 },
  { name: 'Almonds', serving: '20g (~14 nuts)', cals: 116 },
];
const _DI_LOSE = [
  { name: 'Baked Salmon', serving: '150g fillet', cals: 280 },
  { name: 'Mixed Salad (lettuce, cucumber, tomato)', serving: '150g', cals: 35 },
  { name: 'Olive Oil Dressing', serving: '1 tsp (4ml)', cals: 40 },
];

// Balanced food items
const _BF_MAIN = [
  { name: 'Whole Wheat Toast', serving: '2 slices (70g)', cals: 170 },
  { name: 'Boiled / Scrambled Eggs', serving: '2 large whole eggs', cals: 156 },
  { name: 'Banana', serving: '1 medium (120g)', cals: 107 },
  { name: 'Full Fat Milk', serving: '150ml', cals: 93 },
];
const _LU_MAIN = [
  { name: 'Cooked Chicken', serving: '120g boneless', cals: 198 },
  { name: 'White Rice (cooked)', serving: '150g', cals: 195 },
  { name: 'Mixed Stir-Fried Vegetables', serving: '100g', cals: 80 },
  { name: 'Dal / Lentil Soup', serving: '1 cup (200ml)', cals: 130 },
];
const _SN_MAIN = [
  { name: 'Whole Wheat Toast', serving: '1 slice (35g)', cals: 85 },
  { name: 'Peanut Butter', serving: '1 tbsp (15g)', cals: 94 },
  { name: 'Apple', serving: '1 medium (182g)', cals: 95 },
];
const _DI_MAIN = [
  { name: 'Toor / Masoor Dal', serving: '1.5 cups cooked (300ml)', cals: 195 },
  { name: 'Wheat Roti', serving: '3 medium rotis (75g)', cals: 210 },
  { name: 'Sabzi (vegetable curry)', serving: '150g', cals: 90 },
  { name: 'Curd / Yogurt (low fat)', serving: '100g', cals: 61 },
];

// Muscle Gain food items
const _BF_GAIN = [
  { name: 'Oats (cooked)', serving: '80g dry weight', cals: 302 },
  { name: 'Whole Eggs', serving: '4 large eggs, scrambled', cals: 312 },
  { name: 'Peanut Butter', serving: '1 tbsp (15g)', cals: 94 },
  { name: 'Banana (in shake)', serving: '1 medium (120g)', cals: 107 },
];
const _MM_GAIN = [
  { name: 'Whey Protein Shake', serving: '1 scoop (30g) + 250ml milk', cals: 220 },
  { name: 'Mixed Nuts', serving: '25g', cals: 148 },
  { name: 'Seasonal Fruit (Orange / Apple)', serving: '1 medium', cals: 62 },
];
const _LU_GAIN = [
  { name: 'Grilled Chicken', serving: '200g boneless', cals: 330 },
  { name: 'White Rice (cooked)', serving: '200g', cals: 260 },
  { name: 'Dal', serving: '1 cup (200ml)', cals: 130 },
  { name: 'Mixed Vegetables', serving: '100g', cals: 50 },
];
const _PW_GAIN = [
  { name: 'Banana', serving: '1 large (150g)', cals: 134 },
  { name: 'Whey Protein (with water)', serving: '1 scoop (30g)', cals: 120 },
  { name: 'Dates', serving: '3 pieces (25g)', cals: 68 },
];
const _DI_GAIN = [
  { name: 'Paneer (Cottage Cheese)', serving: '200g', cals: 296 },
  { name: 'Wheat Roti', serving: '4 medium rotis (100g)', cals: 280 },
  { name: 'Sabzi (vegetable curry)', serving: '100g', cals: 60 },
  { name: 'Full Fat Milk (before bed)', serving: '200ml', cals: 124 },
];

export const MEAL_PLANS = {
  lose: {
    label: 'Fat Loss Diet', color: 'text-orange-400', dotColor: 'bg-orange-400',
    borderColor: 'border-orange-500/30', bgColor: 'bg-orange-500/5',
    tip: 'High protein, caloric deficit. Low carb, high fibre meals keep you full longer.',
    meals: [
      { time: '07:30 AM', title: 'Breakfast', items: 'Egg white omelette, Oats with berries, Green tea', foodItems: _BF_LOSE, cals: String(sumCals(_BF_LOSE)) },
      { time: '12:00 PM', title: 'Lunch', items: 'Grilled chicken breast, Brown rice, Steamed broccoli', foodItems: _LU_LOSE, cals: String(sumCals(_LU_LOSE)) },
      { time: '04:00 PM', title: 'Snack', items: 'Greek yogurt, Almonds (20g)', foodItems: _SN_LOSE, cals: String(sumCals(_SN_LOSE)) },
      { time: '07:30 PM', title: 'Dinner', items: 'Baked salmon, Mixed salad, Olive oil dressing', foodItems: _DI_LOSE, cals: String(sumCals(_DI_LOSE)) },
    ],
  },
  maintain: {
    label: 'Balanced Diet', color: 'text-blue-400', dotColor: 'bg-blue-400',
    borderColor: 'border-blue-500/30', bgColor: 'bg-blue-500/5',
    tip: 'Balanced macros for energy and health. Consistent meals prevent cravings.',
    meals: [
      { time: '08:00 AM', title: 'Breakfast', items: 'Whole wheat toast, 2 eggs, Banana, Milk', foodItems: _BF_MAIN, cals: String(sumCals(_BF_MAIN)) },
      { time: '01:00 PM', title: 'Lunch', items: 'Chicken rice bowl, Vegetables, Lentil soup', foodItems: _LU_MAIN, cals: String(sumCals(_LU_MAIN)) },
      { time: '04:30 PM', title: 'Snack', items: 'Peanut butter toast, Apple', foodItems: _SN_MAIN, cals: String(sumCals(_SN_MAIN)) },
      { time: '08:00 PM', title: 'Dinner', items: 'Dal, Roti (3), Sabzi, Curd', foodItems: _DI_MAIN, cals: String(sumCals(_DI_MAIN)) },
    ],
  },
  gain: {
    label: 'Muscle Gain Diet', color: 'text-neon', dotColor: 'bg-neon',
    borderColor: 'border-neon/30', bgColor: 'bg-neon/5',
    tip: 'High protein & caloric surplus. Eat every 3-4 hrs to fuel muscle growth.',
    meals: [
      { time: '07:00 AM', title: 'Breakfast', items: 'Oats, 4 whole eggs, Peanut butter, Banana shake', foodItems: _BF_GAIN, cals: String(sumCals(_BF_GAIN)) },
      { time: '10:30 AM', title: 'Mid-Morning', items: 'Protein shake, Mixed nuts, Whole fruit', foodItems: _MM_GAIN, cals: String(sumCals(_MM_GAIN)) },
      { time: '01:30 PM', title: 'Lunch', items: 'Chicken (200g), White rice, Dal, Vegetables', foodItems: _LU_GAIN, cals: String(sumCals(_LU_GAIN)) },
      { time: '04:30 PM', title: 'Pre-Workout', items: 'Banana, Whey protein, Dates', foodItems: _PW_GAIN, cals: String(sumCals(_PW_GAIN)) },
      { time: '08:30 PM', title: 'Dinner', items: 'Paneer (200g), Roti (4), Sabzi, Milk before bed', foodItems: _DI_GAIN, cals: String(sumCals(_DI_GAIN)) },
    ],
  },
};


export default function FoodTracking() {
  const navigate = useNavigate();
  const { userData, foodLog, logMeal } = useUser();
  const { targets, goal, weight, name } = userData || {};

  const calorieTarget = targets?.calories || 2500;
  const targetProtein = targets?.protein || 150;
  const targetCarbs = targets?.carbs || 200;
  const targetFats = targets?.fats || 60;

  const consumedCals = foodLog?.totalCals || 0;
  const loggedMeals = foodLog?.meals || [];
  const percentage = Math.min(Math.round((consumedCals / calorieTarget) * 100), 100);

  let currentProtein = 0;
  let currentCarbs = 0;
  let currentFats = 0;

  loggedMeals.forEach(meal => {
    if (meal.foodItems) {
      meal.foodItems.forEach(item => {
        currentProtein += (Number(item.protein) || 0);
        currentCarbs += (Number(item.carbs) || 0);
        currentFats += (Number(item.fats) || 0);
      });
    }
  });

  const [selectedMeal, setSelectedMeal] = useState(null);
  const [expandedMealIdx, setExpandedMealIdx] = useState(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const plan = MEAL_PLANS[goal] || MEAL_PLANS.maintain;
  const goalLabel = goal === 'lose' ? 'Fat Loss' : goal === 'gain' ? 'Muscle Gain' : 'Maintenance';

  const isLoggedToday = (mealTitle) =>
    loggedMeals.some((m) => m.title === mealTitle);

  const handleLogMeal = (meal) => {
    if (!isLoggedToday(meal.title)) {
      logMeal({ ...meal, foodItems: meal.foodItems });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pt-12 px-8 pb-36 min-h-screen"
    >
      {/* Header */}
      <h1 className="text-3xl font-extrabold text-white mb-1 tracking-tighter">Diet</h1>
      <p className="text-gray-400 text-sm mb-8">
        {name ? `${name}'s` : 'Your'} <span className={`font-bold ${plan.color}`}>{plan.label}</span> · {weight}kg
      </p>

      {/* Search */}
      <div className="flex gap-4 mb-8">
        <div className="flex-1 bg-zinc-900 border border-white/10 rounded-2xl flex items-center px-4">
          <Search size={20} className="text-gray-400" />
          <input type="text" placeholder="Search food..." className="bg-transparent border-none outline-none text-white w-full py-3 px-3 text-sm placeholder-gray-500" />
        </div>
        <button 
          onClick={() => setIsScannerOpen(true)}
          className="w-12 h-12 rounded-2xl bg-neon flex items-center justify-center neon-glow shadow-neon hover:bg-[#2fe512] transition-colors"
        >
          <Camera size={24} className="text-black" />
        </button>
      </div>

      {/* Calories Card */}
      <section className="glass-card layered-card p-6 mb-5 flex justify-between items-center bg-gradient-to-r from-zinc-900/60 to-black/60 border-t-2 border-t-neon">
        <div>
          <h2 className="text-gray-400 text-xs font-semibold mb-1.5 uppercase tracking-widest">Calories Today</h2>
          <div className="text-4xl font-black text-white tracking-tighter">
            {consumedCals} <span className="text-lg text-neon font-bold">/ {calorieTarget}</span>
          </div>
          {consumedCals === 0 && (
            <p className="text-xs text-gray-500 mt-1">No meals logged yet today</p>
          )}
        </div>
        <div className="w-14 h-14 rounded-full border-[3px] border-zinc-800 border-t-neon flex items-center justify-center transform rotate-45 shadow-[0_0_15px_rgba(255, 184, 0,0.3)]">
          <span className="text-white text-xs font-bold -rotate-45 block">{percentage}%</span>
        </div>
      </section>

      {/* Macro Quick View */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <MacroChip icon={Beef} label="Protein" current={Math.round(currentProtein)} target={targetProtein} color="text-neon" />
        <MacroChip icon={Wheat} label="Carbs" current={Math.round(currentCarbs)} target={targetCarbs} color="text-blue-400" />
        <MacroChip icon={Droplets} label="Fats" current={Math.round(currentFats)} target={targetFats} color="text-yellow-400" />
      </div>

      {/* AI Meal Plan — with Quick Log buttons */}
      <section className={`glass-card p-5 mb-8 border ${plan.borderColor} ${plan.bgColor} relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-20 h-20 bg-neon/10 rounded-bl-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center gap-2 mb-1 relative z-10">
          <Sparkles size={18} className={plan.color} />
          <h2 className={`font-bold text-base tracking-tight ${plan.color}`}>Nexus AI · {goalLabel} Plan</h2>
        </div>
        <p className="text-gray-400 text-xs leading-relaxed mb-4 relative z-10">{plan.tip}</p>

        <div className="space-y-3 relative z-10">
          {plan.meals.map((meal, idx) => {
            const logged = isLoggedToday(meal.title);
            return (
              <motion.div
                key={meal.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
                className={`flex items-center gap-3 rounded-xl p-2.5 -mx-2 transition-colors ${logged ? 'bg-white/5' : 'hover:bg-white/5 cursor-pointer'}`}
              >
                <div className="flex flex-col items-center min-w-[44px]">
                  <div className={`w-2 h-2 rounded-full ${logged ? 'bg-neon shadow-neon' : plan.dotColor} opacity-80`} />
                  <span className="text-[9px] text-gray-500 font-bold mt-1 text-center leading-tight">{meal.time}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className={`font-bold text-sm ${logged ? 'text-gray-400 line-through' : 'text-white'}`}>{meal.title}</span>
                    <span className={`font-bold text-xs ml-2 ${plan.color}`}>{meal.cals} kcal</span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{meal.items}</p>
                </div>
                <button
                  onClick={() => handleLogMeal(meal)}
                  disabled={logged}
                  className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    logged
                      ? 'bg-neon/20 text-neon cursor-default'
                      : 'bg-zinc-800 text-gray-400 hover:bg-neon hover:text-black'
                  }`}
                  title={logged ? 'Logged!' : 'Log this meal'}
                >
                  {logged ? <CheckCircle size={16} /> : <Plus size={16} />}
                </button>
              </motion.div>
            );
          })}
        </div>

        <div className={`mt-4 pt-3 border-t ${plan.borderColor} flex justify-between text-xs font-bold`}>
          <span className="text-gray-400">Daily Target</span>
          <span className={plan.color}>{calorieTarget} kcal</span>
        </div>
      </section>

      {/* Today's Food Log */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white font-bold text-xl tracking-tight">Today's Log</h2>
        </div>

        {/* Quick Log Meal Buttons */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          {[
            { label: 'Breakfast', time: '08:00 AM', emoji: '🍳' },
            { label: 'Lunch',     time: '01:00 PM', emoji: '🍱' },
            { label: 'Dinner',    time: '08:00 PM', emoji: '🍽️' },
            { label: 'Snack',     time: '04:00 PM', emoji: '🥜' },
          ].map((m) => {
            const loggedEntry = loggedMeals.find((l) => l.title?.toLowerCase() === m.label.toLowerCase());
            const alreadyLogged = !!loggedEntry;
            return (
              <button
                key={m.label}
                disabled={alreadyLogged}
                onClick={() => !alreadyLogged && navigate('/food/log', { state: { mealType: m.label, mealTime: m.time } })}
                className={`glass-card p-3.5 flex items-center gap-3 transition-all ${
                  alreadyLogged
                    ? 'border border-neon/30 bg-neon/5 cursor-not-allowed'
                    : 'hover:bg-white/10 active:scale-[0.97] cursor-pointer'
                }`}
              >
                <span className="text-xl">{alreadyLogged ? '✅' : m.emoji}</span>
                <div className="text-left flex-1">
                  <p className={`font-bold text-sm ${alreadyLogged ? 'text-neon' : 'text-white'}`}>
                    {m.label}
                  </p>
                  <p className="text-xs text-gray-500">
                    {alreadyLogged ? `${loggedEntry.cals} kcal logged` : m.time}
                  </p>
                </div>
                {alreadyLogged && (
                  <span className="text-neon text-xs font-black shrink-0">✓</span>
                )}
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {loggedMeals.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-10 text-center flex flex-col items-center"
            >
              <UtensilsCrossed size={36} className="text-gray-700 mb-4" />
              <p className="text-gray-300 font-bold text-base">No meals logged yet</p>
              <p className="text-gray-500 text-xs mt-2 leading-relaxed max-w-[220px]">
                Tap the <span className="text-neon font-bold">+</span> button next to any AI meal above to log it, or use the search bar to find food.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {loggedMeals.map((meal, idx) => {
                const isExpanded = expandedMealIdx === idx;
                const items = meal.foodItems || [];
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card overflow-hidden"
                  >
                    {/* Header row — tap to expand */}
                    <button
                      onClick={() => setExpandedMealIdx(isExpanded ? null : idx)}
                      className="w-full p-4 flex items-center gap-3 hover:bg-white/5 transition-colors"
                    >
                      <div className="w-3 h-3 rounded-full bg-neon shadow-[0_0_10px_rgba(255, 184, 0,0.8)] shrink-0" />
                      <div className="flex-1 text-left">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-bold text-base">{meal.title}</span>
                          <span className="text-neon font-black text-sm">{meal.cals} <span className="text-xs font-normal text-gray-400">kcal</span></span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{meal.time} · {items.length > 0 ? `${items.length} items` : meal.items?.split(',').length + ' items'}</p>
                      </div>
                      <ChevronRight
                        size={16}
                        className={`text-gray-500 transition-transform duration-200 shrink-0 ${isExpanded ? 'rotate-90' : ''}`}
                      />
                    </button>

                    {/* Expandable food items */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-white/10 px-4 pb-4 pt-3 space-y-2">
                            {items.length > 0 ? (
                              items.map((item, i) => (
                                <div key={i} className="flex items-center justify-between py-1.5">
                                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                    <div className="w-1.5 h-1.5 rounded-full bg-neon/60 shrink-0" />
                                    <div className="min-w-0">
                                      <p className="text-white text-sm font-medium truncate">{item.name}</p>
                                      {item.serving && <p className="text-gray-500 text-xs">{item.serving}</p>}
                                    </div>
                                  </div>
                                  <span className="text-neon font-bold text-sm shrink-0 ml-3">{item.cals} kcal</span>
                                </div>
                              ))
                            ) : (
                              // Fallback: split items string if no foodItems array
                              meal.items?.split(',').map((item, i) => (
                                <div key={i} className="flex items-center gap-2.5 py-1">
                                  <div className="w-1.5 h-1.5 rounded-full bg-neon/60 shrink-0" />
                                  <span className="text-gray-300 text-sm">{item.trim()}</span>
                                </div>
                              ))
                            )}
                            <div className="border-t border-white/10 mt-2 pt-2 flex justify-between">
                              <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total</span>
                              <span className="text-neon font-black text-sm">{meal.cals} kcal</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* AI Scanner Overlay */}
      <AnimatePresence>
        {isScannerOpen && (
          <AICameraScanner 
            onClose={() => setIsScannerOpen(false)} 
            onLogMeal={(meal) => {
              handleLogMeal(meal);
              // Small delay to ensure modal close animation is smooth
              setTimeout(() => setIsScannerOpen(false), 300);
            }} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function MacroChip({ icon: Icon, label, current, target, color }) {
  return (
    <div className="glass-card p-3 flex flex-col items-center text-center gap-1">
      <Icon size={16} className={color} />
      <span className={`text-sm font-black ${color}`}>
        {current} <span className="text-[10px] text-gray-500 font-bold">/ {target}g</span>
      </span>
      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{label}</span>
    </div>
  );
}
