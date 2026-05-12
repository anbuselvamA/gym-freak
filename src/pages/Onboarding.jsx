import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, Target, Activity, Flame } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

export default function Onboarding() {
  const { saveOnboardingData } = useUser();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    gender: 'male',
    age: '25',
    weight: '70',
    height: '175',
    goal: 'maintain',
  });

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      saveOnboardingData(formData);
      // Request notification permission
      if ('Notification' in window && Notification.permission === 'default') {
        await Notification.requestPermission();
      }
      navigate('/');
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col pt-12 px-8 pb-10">
      <div className="flex items-center justify-between mb-8">
        {step > 1 ? (
          <button onClick={handleBack} className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:bg-white/10 transition-colors">
            <ChevronLeft size={20} className="text-white" />
          </button>
        ) : (
          <div className="w-10" />
        )}
        <div className="flex gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${s === step ? 'bg-neon shadow-neon' : s < step ? 'bg-white' : 'bg-zinc-800'}`} />
          ))}
        </div>
        <div className="w-10" />
      </div>

      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-6"
            >
              <h1 className="text-3xl font-extrabold text-white tracking-tighter leading-tight">
                Let's setup your <br/><span className="text-neon">Nexus AI</span> profile
              </h1>
              
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 block">What's your name?</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter your name" 
                    className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-neon focus:ring-1 focus:ring-neon outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 block">Biological Sex</label>
                  <div className="flex gap-3">
                    <button onClick={() => setFormData({...formData, gender: 'male'})} className={`flex-1 py-4 rounded-2xl border transition-all font-bold ${formData.gender === 'male' ? 'bg-neon/10 border-neon text-neon' : 'bg-zinc-900 border-white/10 text-gray-400'}`}>Male</button>
                    <button onClick={() => setFormData({...formData, gender: 'female'})} className={`flex-1 py-4 rounded-2xl border transition-all font-bold ${formData.gender === 'female' ? 'bg-neon/10 border-neon text-neon' : 'bg-zinc-900 border-white/10 text-gray-400'}`}>Female</button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-6"
            >
              <h1 className="text-3xl font-extrabold text-white tracking-tighter leading-tight">
                Body Metrics
              </h1>
              <p className="text-gray-400 text-sm">We use this to precisely calculate your metabolic rate and daily calorie needs.</p>
              
              <div className="space-y-6 mt-4">
                <div className="flex items-center justify-between glass-card p-5">
                  <label className="text-white font-bold text-lg">Age</label>
                  <div className="flex items-center gap-2">
                    <input type="number" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} className="w-16 bg-transparent text-right text-2xl font-black text-neon outline-none" />
                    <span className="text-gray-500 font-bold uppercase text-xs">yrs</span>
                  </div>
                </div>
                <div className="flex items-center justify-between glass-card p-5">
                  <label className="text-white font-bold text-lg">Weight</label>
                  <div className="flex items-center gap-2">
                    <input type="number" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} className="w-20 bg-transparent text-right text-2xl font-black text-neon outline-none" />
                    <span className="text-gray-500 font-bold uppercase text-xs">kg</span>
                  </div>
                </div>
                <div className="flex items-center justify-between glass-card p-5">
                  <label className="text-white font-bold text-lg">Height</label>
                  <div className="flex items-center gap-2">
                    <input type="number" value={formData.height} onChange={(e) => setFormData({...formData, height: e.target.value})} className="w-20 bg-transparent text-right text-2xl font-black text-neon outline-none" />
                    <span className="text-gray-500 font-bold uppercase text-xs">cm</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-6"
            >
              <h1 className="text-3xl font-extrabold text-white tracking-tighter leading-tight">
                What's your primary goal?
              </h1>
              
              <div className="space-y-4 mt-4">
                <GoalCard 
                  icon={Flame} 
                  title="Lose Weight" 
                  desc="Caloric deficit to burn fat" 
                  selected={formData.goal === 'lose'}
                  onClick={() => setFormData({...formData, goal: 'lose'})}
                />
                <GoalCard 
                  icon={Activity} 
                  title="Maintain" 
                  desc="Keep current weight, improve health" 
                  selected={formData.goal === 'maintain'}
                  onClick={() => setFormData({...formData, goal: 'maintain'})}
                />
                <GoalCard 
                  icon={Target} 
                  title="Build Muscle" 
                  desc="Caloric surplus for muscle growth" 
                  selected={formData.goal === 'gain'}
                  onClick={() => setFormData({...formData, goal: 'gain'})}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button 
        onClick={handleNext}
        disabled={step === 1 && !formData.name}
        className="w-full py-5 rounded-[1.5rem] bg-neon text-black font-extrabold text-lg flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(255, 184, 0,0.3)] disabled:opacity-50 disabled:shadow-none mt-8"
      >
        {step === 3 ? "Generate AI Plan" : "Continue"}
        {step < 3 && <ArrowRight size={20} className="text-black" />}
      </button>
    </div>
  );
}

function GoalCard({ icon: Icon, title, desc, selected, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`glass-card p-5 flex items-center gap-4 cursor-pointer transition-all ${selected ? 'border-neon bg-neon/5 shadow-[0_0_15px_rgba(255, 184, 0,0.1)]' : 'border-white/5 hover:bg-white/5'}`}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selected ? 'bg-neon/20 text-neon' : 'bg-zinc-800 text-gray-400'}`}>
        <Icon size={24} />
      </div>
      <div>
        <h3 className={`font-bold text-lg ${selected ? 'text-neon' : 'text-white'}`}>{title}</h3>
        <p className="text-xs text-gray-400">{desc}</p>
      </div>
    </div>
  )
}
