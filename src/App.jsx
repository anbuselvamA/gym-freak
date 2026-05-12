import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import BottomNav from './components/BottomNav';
import Dashboard from './pages/Dashboard';
import FoodTracking from './pages/FoodTracking';
import FoodDetails from './pages/FoodDetails';
import Cardio from './pages/Cardio';
import Coach from './pages/Coach';
import Lifestyle from './pages/Lifestyle';
import WeightTracker from './pages/WeightTracker';
import Onboarding from './pages/Onboarding';
import MealDetail from './pages/MealDetail';
import FoodLogger from './pages/FoodLogger';
import Settings from './pages/Settings';
import { UserProvider, useUser } from './context/UserContext';
import { useMealNotifications } from './hooks/useMealNotifications';
import { MEAL_PLANS } from './pages/FoodTracking';

const ScrollToTop = () => {
  const location = useLocation();
  React.useEffect(() => {
    const scrollContainer = document.getElementById('main-scroll-container');
    if (scrollContainer) {
      scrollContainer.scrollTo(0, 0);
    }
  }, [location.pathname]);
  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const { userData } = useUser();
  const isSetupComplete = userData?.isSetupComplete;

  React.useEffect(() => {
    if (!isSetupComplete && location.pathname !== '/onboarding') {
      window.location.href = '/onboarding';
    }
  }, [isSetupComplete, location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/food" element={<FoodTracking />} />
        <Route path="/food/details" element={<FoodDetails />} />
        <Route path="/food/meal" element={<MealDetail />} />
        <Route path="/food/log" element={<FoodLogger />} />
        <Route path="/cardio" element={<Cardio />} />
        <Route path="/coach" element={<Coach />} />
        <Route path="/lifestyle" element={<Lifestyle />} />
        <Route path="/weight" element={<WeightTracker />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </AnimatePresence>
  );
};

const AppContent = () => {
  const { userData } = useUser();
  const showNav = userData?.isSetupComplete;
  // Schedule meal notifications based on user's goal plan
  const plan = userData?.goal ? (MEAL_PLANS?.[userData.goal] || null) : null;
  useMealNotifications(userData?.name, plan);

  return (
    <div className="w-full h-[100dvh] sm:h-[850px] sm:max-h-[90dvh] sm:w-[400px] sm:rounded-[3.5rem] sm:border-[10px] sm:border-zinc-900 bg-[#050505]/90 backdrop-blur-3xl relative overflow-hidden shadow-[0_0_80px_rgba(255, 184, 0,0.05)] z-10 flex flex-col">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none mix-blend-overlay"></div>
      <Router>
        <ScrollToTop />
        <div id="main-scroll-container" className={`flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide relative z-10 ${showNav ? 'pb-24' : ''}`}>
          <AnimatedRoutes />
        </div>
        {showNav && <BottomNav />}
      </Router>
    </div>
  );
};

export default function App() {
  return (
    <UserProvider>
      <div className="min-h-screen bg-[#030303] flex justify-center w-full sm:py-10 overflow-hidden relative">
      {/* Cinematic Ambient Glows */}
      <div className="ambient-orb bg-neon w-[600px] h-[600px] -top-64 -left-32 opacity-20"></div>
      <div className="ambient-orb bg-emerald-500 w-[500px] h-[500px] bottom-0 right-[-100px] opacity-10"></div>
      <div className="ambient-orb bg-zinc-700 w-[400px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10"></div>

      {/* Mobile App Simulator Container */}
      <AppContent />
      </div>
    </UserProvider>
  );
}
