import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Utensils, Activity, MessageSquare, User } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dash' },
  { path: '/food', icon: Utensils, label: 'Diet' },
  { path: '/cardio', icon: Activity, label: 'Workout' },
  { path: '/coach', icon: MessageSquare, label: 'Coach' },
  { path: '/lifestyle', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  return (
    <div className="absolute bottom-0 left-0 w-full flex justify-center pb-8 pt-10 bg-gradient-to-t from-black via-[#030303]/80 to-transparent z-50 pointer-events-none">
      <nav className="glass-card flex items-center justify-between px-8 py-5 w-[85%] max-w-[380px] mx-auto pointer-events-auto rounded-[2.5rem] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8)] border-white/10">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 relative ${
                isActive ? 'text-neon' : 'text-gray-500 hover:text-gray-300'
              } transition-all duration-300`
            }
          >
            {({ isActive }) => (
              <>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <item.icon size={26} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'drop-shadow-[0_0_12px_rgba(57,255,20,0.8)]' : ''} />
                </motion.div>
                {isActive && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute -bottom-3 w-1.5 h-1.5 bg-neon rounded-full shadow-[0_0_10px_rgba(57,255,20,1)]"
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
