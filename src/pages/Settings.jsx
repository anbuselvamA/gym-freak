import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, Moon, User, Lock, Trash2, LogOut, ChevronRight, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function Settings() {
  const navigate = useNavigate();
  const { userData, resetData } = useUser();
  const [notifications, setNotifications] = useState(true);

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all data? This cannot be undone.")) {
      resetData();
      navigate('/onboarding');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="pt-12 px-8 pb-36 min-h-screen relative"
    >
      {/* Header */}
      <div className="flex items-center mb-8 relative">
        <button 
          onClick={() => navigate(-1)}
          className="absolute left-0 w-10 h-10 rounded-full glass-card flex items-center justify-center text-gray-300 hover:text-white transition-all hover:scale-105"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-extrabold text-white tracking-tighter w-full text-center">Settings</h1>
      </div>

      <div className="space-y-6">
        {/* Account Section */}
        <section>
          <h2 className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-3 pl-2">Account</h2>
          <div className="glass-card rounded-2xl overflow-hidden divide-y divide-white/5">
            <SettingItem icon={User} label="Edit Profile" value={userData?.name || "Guest"} />
            <SettingItem icon={Lock} label="Privacy & Security" />
            <SettingItem icon={HelpCircle} label="Help & Support" />
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
      </div>

      <div className="mt-10 text-center">
        <p className="text-gray-500 text-xs">Nexus AI v1.0.0</p>
      </div>
    </motion.div>
  );
}

function SettingItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors cursor-pointer group">
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
