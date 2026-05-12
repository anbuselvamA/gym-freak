import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem('nexus_user_data');
    if (saved) { try { return JSON.parse(saved); } catch (e) { return null; } }
    return null;
  });

  const [stepsHistory, setStepsHistory] = useState(() => {
    const saved = localStorage.getItem('nexus_steps_history');
    if (saved) { try { return JSON.parse(saved); } catch (e) { return []; } }
    return [];
  });

  const [foodLog, setFoodLog] = useState(() => {
    const saved = localStorage.getItem('nexus_food_log');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const today = new Date().toISOString().split('T')[0];
        if (parsed.date !== today) return { date: today, meals: [], totalCals: 0 };
        // Deduplicate: keep only the LAST entry per meal title
        const seen = new Set();
        const unique = [];
        for (const m of [...(parsed.meals || [])]) {
          const key = m.title?.toLowerCase();
          if (!seen.has(key)) { seen.add(key); unique.push(m); }
        }
        const totalCals = unique.reduce((s, m) => s + (parseInt(m.cals) || 0), 0);
        return { ...parsed, meals: unique, totalCals };
      } catch (e) { return null; }
    }
    return { date: new Date().toISOString().split('T')[0], meals: [], totalCals: 0 };
  });

  useEffect(() => {
    if (userData) { localStorage.setItem('nexus_user_data', JSON.stringify(userData)); }
  }, [userData]);

  useEffect(() => {
    localStorage.setItem('nexus_steps_history', JSON.stringify(stepsHistory));
  }, [stepsHistory]);

  useEffect(() => {
    if (foodLog) localStorage.setItem('nexus_food_log', JSON.stringify(foodLog));
  }, [foodLog]);

  const logMeal = (meal) => {
    // Calculate real total from actual food items (not hardcoded string)
    const realCals = meal.foodItems
      ? meal.foodItems.reduce((sum, item) => sum + (item.cals || 0), 0)
      : parseInt(meal.cals) || 0;

    setFoodLog((prev) => {
      const existingIdx = prev.meals.findIndex(
        (m) => m.title?.toLowerCase() === meal.title?.toLowerCase()
      );

      if (existingIdx !== -1) {
        // Replace the existing entry and adjust calorie total accordingly
        const oldCals = parseInt(prev.meals[existingIdx].cals) || 0;
        const updatedMeals = [...prev.meals];
        updatedMeals[existingIdx] = {
          ...meal,
          cals: realCals.toString(),
          time: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }),
        };
        return {
          ...prev,
          meals: updatedMeals,
          totalCals: (prev.totalCals || 0) - oldCals + realCals,
        };
      }

      // New meal — prepend to list
      return {
        ...prev,
        meals: [
          {
            ...meal,
            cals: realCals.toString(),
            time: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }),
          },
          ...prev.meals,
        ],
        totalCals: (prev.totalCals || 0) + realCals,
      };
    });
  };

  const saveSteps = (steps) => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    setStepsHistory((prev) => {
      // Remove old entry for today if exists, then prepend new
      const filtered = prev.filter((entry) => entry.date !== today);
      const updated = [{ date: today, steps }, ...filtered];
      // Keep only last 30 days
      return updated.slice(0, 30);
    });
  };

  const getTodaySteps = () => {
    const today = new Date().toISOString().split('T')[0];
    const entry = stepsHistory.find((e) => e.date === today);
    return entry ? entry.steps : 0;
  };

  const getBurnedCals = () => {
    const steps = getTodaySteps();
    // Estimation: 1000 steps ~ 40 kcal (0.04 kcal per step)
    return steps * 0.04;
  };

  const saveOnboardingData = (data) => {
    // Basic calculation logic
    // BMR estimation (Mifflin-St Jeor simplified)
    // Male: 10*weight + 6.25*height - 5*age + 5
    // Female: 10*weight + 6.25*height - 5*age - 161
    const w = parseFloat(data.weight);
    const h = parseFloat(data.height);
    const a = parseInt(data.age);
    const isMale = data.gender === 'male';

    let bmr = (10 * w) + (6.25 * h) - (5 * a) + (isMale ? 5 : -161);
    
    // TDEE (Total Daily Energy Expenditure) - assume lightly active multiplier 1.375
    let tdee = bmr * 1.375;
    
    let targetCalories = Math.round(tdee);
    let stepGoal = 8000;
    let cardioTargetCals = 200;
    
    if (data.goal === 'lose') {
      targetCalories -= 500;
      stepGoal = 10000;
      cardioTargetCals = 400;
    } else if (data.goal === 'gain') {
      targetCalories += 300;
      stepGoal = 7000;
      cardioTargetCals = 150;
    }

    // Macro split
    // Protein: 2g per kg of bodyweight
    const protein = Math.round(w * 2);
    // Fats: 0.8g per kg
    const fats = Math.round(w * 0.8);
    // Carbs: remainder
    const proteinCals = protein * 4;
    const fatCals = fats * 9;
    const remainingCals = targetCalories - proteinCals - fatCals;
    const carbs = Math.max(0, Math.round(remainingCals / 4));

    const finalData = {
      ...data,
      isSetupComplete: true,
      targets: {
        calories: targetCalories,
        protein,
        fats,
        carbs,
        steps: stepGoal,
        water: isMale ? 3.5 : 2.7, // Liters
        cardioTarget: cardioTargetCals
      }
    };

    setUserData(finalData);
  };

  const resetData = () => {
    setUserData(null);
    setStepsHistory([]);
    setFoodLog({ date: new Date().toISOString().split('T')[0], meals: [], totalCals: 0 });
    localStorage.removeItem('nexus_user_data');
    localStorage.removeItem('nexus_steps_history');
    localStorage.removeItem('nexus_food_log');
  };

  const updateUserProfile = (newData) => {
    setUserData((prev) => ({ ...prev, ...newData }));
  };

  return (
    <UserContext.Provider value={{ userData, saveOnboardingData, resetData, updateUserProfile, saveSteps, getTodaySteps, getBurnedCals, stepsHistory, foodLog, logMeal }}>
      {children}
    </UserContext.Provider>
  );
};
