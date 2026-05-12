import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Bell, Moon, User, Lock, Trash2, ChevronRight, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function Settings() {
  const navigate = useNavigate();
  const { userData, resetData } = useUser();
  const [notifications, setNotifications] = useState(true);
  const [activeView, setActiveView] = useState('main'); // 'main' | 'profile' | 'privacy' | 'help'

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all data? This cannot be undone.")) {
      resetData();
      navigate('/onboarding');
    }
  };

  const handleBack = () => {
    if (activeView === 'main') {
      navigate(-1);
    } else {
      setActiveView('main');
    }
  };

  const renderMainSettings = () => (
    <motion.div
      key="main"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
        {/* Account Section */}
        <section>
          <h2 className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-3 pl-2">Account</h2>
          <div className="glass-card rounded-2xl overflow-hidden divide-y divide-white/5">
            <SettingItem icon={User} label="Edit Profile" value={userData?.name || "Guest"} onClick={() => setActiveView('profile')} />
            <SettingItem icon={Lock} label="Privacy & Security" onClick={() => setActiveView('privacy')} />
            <SettingItem icon={HelpCircle} label="Help & Support" onClick={() => setActiveView('help')} />
          </div>
        </section>

        {/* Preferences Section */}
        <section>
          <h2 className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-3 pl-2">Preferences</h2>
          <div className="glass-card rounded-2xl overflow-hidden divide-y divide-white/5">
            <div className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-neon">
                  <Bell size={16} />
                </div>
                <span className="text-white font-medium text-sm">Notifications</span>
              </div>
              {/* Toggle Switch */}
              <div 
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${notifications ? 'bg-neon' : 'bg-zinc-700'}`}
              >
                <motion.div 
                  className="w-4 h-4 bg-white rounded-full shadow-md"
                  animate={{ x: notifications ? 24 : 0 }}
                />
              </div>
            </div>
            <SettingItem icon={Moon} label="Dark Mode" value="Always On" />
          </div>
        </section>

        {/* Danger Zone */}
        <section>
          <h2 className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-3 pl-2">Danger Zone</h2>
          <div className="glass-card rounded-2xl overflow-hidden divide-y divide-white/5">
            <div onClick={handleReset} className="flex items-center justify-between p-4 hover:bg-red-500/10 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                  <Trash2 size={16} />
                </div>
                <span className="text-red-500 font-medium text-sm">Reset App Data</span>
              </div>
            </div>
          </div>
        </section>

        <div className="pt-4 text-center pb-10">
          <p className="text-gray-500 text-xs">Nexus AI v1.0.0</p>
        </div>
    </motion.div>
  );

  const renderProfile = () => (
    <motion.div
      key="profile"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      <div className="glass-card p-6 rounded-2xl flex flex-col items-center gap-4 text-center border border-white/5">
         <div className="w-20 h-20 rounded-full bg-zinc-800 border-4 border-neon flex items-center justify-center neon-glow shadow-neon">
           <User size={40} className="text-neon" />
         </div>
         <div>
           <h3 className="text-xl font-extrabold text-white">{userData?.name || "Guest"}</h3>
           <p className="text-gray-400 text-sm mt-0.5">{userData?.gender === 'male' ? 'Male' : 'Female'} • {userData?.goal === 'lose' ? 'Fat Loss' : 'Muscle Gain'}</p>
         </div>
         <button className="px-6 py-2 bg-white/10 rounded-xl text-white font-bold hover:bg-white/20 transition-colors text-sm mt-2">Change Photo</button>
      </div>

      <div className="glass-card p-5 rounded-2xl space-y-4 border border-white/5">
        <div>
          <label className="text-xs text-gray-500 uppercase font-bold tracking-widest pl-2">Display Name</label>
          <input type="text" defaultValue={userData?.name} className="w-full mt-2 bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white font-bold focus:border-neon focus:outline-none transition-colors" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 uppercase font-bold tracking-widest pl-2">Weight</label>
            <div className="relative mt-2">
              <input type="text" defaultValue={userData?.weight} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white font-bold focus:border-neon focus:outline-none transition-colors" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">kg</span>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase font-bold tracking-widest pl-2">Height</label>
            <div className="relative mt-2">
              <input type="text" defaultValue={userData?.height} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white font-bold focus:border-neon focus:outline-none transition-colors" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">cm</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => {
            alert('Profile updated successfully!');
            setActiveView('main');
          }}
          className="w-full py-4 bg-neon text-black font-extrabold rounded-xl mt-4 shadow-[0_0_15px_rgba(255,184,0,0.3)] hover:bg-[#2fe512] transition-colors"
        >
          Save Changes
        </button>
      </div>
    </motion.div>
  );

  const renderPrivacy = () => (
    <motion.div
      key="privacy"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      <div className="glass-card p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-neon/10 rounded-bl-full blur-3xl pointer-events-none"></div>
        <h3 className="text-white font-bold mb-4 flex items-center gap-2 relative z-10"><Lock size={18} className="text-neon" /> Privacy Policy</h3>
        <p className="text-sm text-gray-400 leading-relaxed relative z-10">
          Your data is securely stored locally on your device. We do not sell your personal information. Nexus AI processes your food images using Google Gemini directly from your device, ensuring maximum privacy.
        </p>
      </div>
      <div className="glass-card p-4 rounded-2xl border border-white/5 hover:bg-white/5 cursor-pointer flex justify-between items-center transition-colors">
         <span className="text-white font-medium text-sm">Manage Data Sharing</span>
         <ChevronRight size={16} className="text-gray-500" />
      </div>
      <div className="glass-card p-4 rounded-2xl border border-white/5 hover:bg-white/5 cursor-pointer flex justify-between items-center transition-colors">
         <span className="text-white font-medium text-sm">Terms of Service</span>
         <ChevronRight size={16} className="text-gray-500" />
      </div>
    </motion.div>
  );

  const renderHelp = () => (
    <motion.div
      key="help"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      <div className="glass-card p-8 rounded-2xl border border-white/5 text-center relative overflow-hidden">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
         <HelpCircle size={48} className="text-blue-400 mx-auto mb-5 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
         <h3 className="text-white font-bold text-xl mb-3">Need Assistance?</h3>
         <p className="text-sm text-gray-400 leading-relaxed max-w-[250px] mx-auto">
           Our AI coach is available 24/7 in the Coach tab for immediate fitness and diet queries. For technical support, contact our team.
         </p>
         <button className="mt-8 px-6 py-4 bg-white/10 text-white font-bold rounded-xl w-full hover:bg-white/20 transition-colors">Contact Support Team</button>
      </div>
      
      <div className="glass-card p-5 rounded-2xl border border-white/5">
        <h3 className="text-white font-bold mb-4">FAQs</h3>
        <div className="space-y-4 divide-y divide-white/5">
          <div className="pt-2">
            <p className="text-sm font-bold text-white mb-1">How accurate is the AI Scanner?</p>
            <p className="text-xs text-gray-400">The scanner provides over 95% accuracy when you specify the exact weight of the food.</p>
          </div>
          <div className="pt-4">
            <p className="text-sm font-bold text-white mb-1">How are burned calories calculated?</p>
            <p className="text-xs text-gray-400">Burned calories are calculated using your phone's motion sensor tracking your steps and live cardio sessions.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="pt-12 px-8 pb-36 min-h-screen relative overflow-x-hidden"
    >
      {/* Header */}
      <div className="flex items-center mb-8 relative z-20">
        <button 
          onClick={handleBack}
          className="absolute left-0 w-10 h-10 rounded-full glass-card flex items-center justify-center text-gray-300 hover:text-white transition-all hover:scale-105 shadow-md"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-extrabold text-white tracking-tighter w-full text-center">
          {activeView === 'main' ? 'Settings' : 
           activeView === 'profile' ? 'Edit Profile' : 
           activeView === 'privacy' ? 'Privacy' : 'Help & Support'}
        </h1>
      </div>

      <AnimatePresence mode="wait">
        {activeView === 'main' && renderMainSettings()}
        {activeView === 'profile' && renderProfile()}
        {activeView === 'privacy' && renderPrivacy()}
        {activeView === 'help' && renderHelp()}
      </AnimatePresence>
    </motion.div>
  );
}

function SettingItem({ icon: Icon, label, value, onClick }) {
  return (
    <div onClick={onClick} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors cursor-pointer group">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-gray-300 group-hover:text-neon transition-colors">
          <Icon size={16} />
        </div>
        <span className="text-white font-medium text-sm">{label}</span>
      </div>
      <div className="flex items-center gap-2 text-gray-500">
        {value && <span className="text-xs font-medium">{value}</span>}
        <ChevronRight size={16} />
      </div>
    </div>
  );
}
