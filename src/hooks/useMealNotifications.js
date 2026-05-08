import { useEffect } from 'react';

// Meal reminders: [hour, minute, mealName, emoji]
const MEAL_REMINDERS = [
  [8, 0, 'Breakfast', '🍳'],
  [13, 0, 'Lunch', '🍱'],
  [20, 0, 'Dinner', '🍽️'],
];

function msUntil(hour, minute) {
  const now = new Date();
  const target = new Date();
  target.setHours(hour, minute, 0, 0);
  if (target <= now) {
    // Already passed today → schedule for tomorrow
    target.setDate(target.getDate() + 1);
  }
  return target - now;
}

function sendNotification(title, body) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/vite.svg',
      badge: '/vite.svg',
      tag: title, // prevents duplicate notifications
    });
  }
}

export function useMealNotifications(userName, plan) {
  useEffect(() => {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    const timers = MEAL_REMINDERS.map(([hour, minute, meal, emoji]) => {
      const delay = msUntil(hour, minute);
      const mealItems = plan?.meals?.find((m) => m.title === meal)?.items || '';
      const timer = setTimeout(() => {
        sendNotification(
          `${emoji} Time for ${meal}!`,
          mealItems
            ? `Nexus AI suggests: ${mealItems}`
            : `Don't forget your ${meal.toLowerCase()}, ${userName || 'there'}!`
        );
      }, delay);
      return timer;
    });

    return () => timers.forEach(clearTimeout);
  }, [userName, plan]);
}
