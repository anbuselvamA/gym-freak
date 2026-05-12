import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { useUser } from '../context/UserContext';

// ── Google Gemini API key (free tier) ────────────────────────────────────────
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
// ─────────────────────────────────────────────────────────────────────────────

function buildSystemPrompt(userData, foodLog) {
  const { name, age, weight, height, goal, gender } = userData || {};
  const consumed = foodLog?.totalCals || 0;
  const meals = (foodLog?.meals || []).map((m) => `${m.title} (${m.cals} kcal)`).join(', ');
  return `You are Nexus AI Coach, a friendly, expert personal fitness and nutrition assistant built into the Nexus Fitness App.

User Profile:
- Name: ${name || 'User'}
- Age: ${age || 'unknown'} years
- Gender: ${gender || 'unknown'}
- Weight: ${weight || 'unknown'} kg
- Height: ${height || 'unknown'} cm
- Goal: ${goal === 'lose' ? 'Fat Loss' : goal === 'gain' ? 'Muscle Gain' : 'Maintenance / Balanced'}

Today's Nutrition:
- Calories consumed: ${consumed} kcal
- Meals logged today: ${meals || 'None yet'}

Your role:
- You are an expert gym and fitness chatbot. Answer fitness, nutrition, workout, diet, and health questions accurately.
- HOWEVER, you must also be able to answer ANY general question the user asks you, even if it's not related to fitness. Be helpful and polite.
- Give personalized advice based on the user's profile and today's data.
- Be concise, motivating, and friendly.
- Provide full, complete sentences. Never cut off mid-sentence.
- If asked about Indian / Tamil Nadu foods, provide accurate calorie and nutrition info.
- You can speak in Tamil if the user does (e.g. Tanglish). Always reply in the same language the user writes in.`;
}

const QUICK_PROMPTS = [
  'How many calories should I eat today?',
  'What\'s a good post-workout meal?',
  'Is my diet on track?',
  'Best Tamil breakfast for fat loss?',
];

export default function Coach() {
  const { userData, foodLog } = useUser();
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: `Hi ${userData?.name || 'there'}! 👋 I'm your Nexus AI Coach. Ask me anything about your diet, workouts, or nutrition — I'm here to help! 💪`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText) return;
    setInput('');
    setError('');

    const userMsg = { role: 'user', content: userText };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    if (!GEMINI_API_KEY) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { role: 'ai', content: '⚠️ Gemini API key not set. Add VITE_GEMINI_API_KEY to your .env file. Get a free key at https://aistudio.google.com/apikey' },
        ]);
        setLoading(false);
      }, 600);
      return;
    }

    try {
      // Build Gemini contents array (alternating user/model)
      const allMsgs = [...messages, userMsg];
      
      // Prepend system prompt to the first user message for stability in v1
      const contents = allMsgs.map((m, i) => {
        let text = m.content;
        if (i === 0 && m.role === 'user') {
          text = `${buildSystemPrompt(userData, foodLog)}\n\nUser Question: ${text}`;
        }
        return {
          role: m.role === 'ai' ? 'model' : 'user',
          parts: [{ text }],
        };
      });

      const res = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: { maxOutputTokens: 2048, temperature: 0.7 },
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || `API error ${res.status}`);
      }

      const data = await res.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not understand that.';
      setMessages((prev) => [...prev, { role: 'ai', content: reply }]);
    } catch (err) {
      setError(err.message);
      setMessages((prev) => [
        ...prev,
        { role: 'ai', content: `❌ Error: ${err.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pt-12 pb-36 h-[100dvh] flex flex-col relative"
    >
      {/* Header */}
      <div className="px-8 pb-5 border-b border-white/5 flex justify-between items-center sticky top-0 z-10 bg-black/80 backdrop-blur-md">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3 tracking-tighter">
            AI Coach <Sparkles size={24} className="text-neon drop-shadow-[0_0_8px_rgba(255, 184, 0,0.8)]" />
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 rounded-full bg-neon animate-pulse" />
            <p className="text-neon text-xs font-bold tracking-widest uppercase">
              {GEMINI_API_KEY ? 'Gemini · Online' : 'API Key Required'}
            </p>
          </div>
        </div>
        <div className="w-12 h-12 rounded-full glass-card flex items-center justify-center border border-neon/30">
          <Bot size={24} className="text-neon" />
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4 scrollbar-hide">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'ai' && (
                <div className="w-8 h-8 rounded-full glass-card flex items-center justify-center border border-neon/20 mr-2 mt-1 shrink-0">
                  <Bot size={14} className="text-neon" />
                </div>
              )}
              <div
                className={`max-w-[82%] rounded-[1.4rem] px-5 py-3.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-neon text-black rounded-tr-sm shadow-[0_0_20px_rgba(255, 184, 0,0.25)] font-semibold'
                    : 'glass-card rounded-tl-sm text-gray-200 border-l-2 border-l-neon/60'
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex justify-start items-center gap-2"
            >
              <div className="w-8 h-8 rounded-full glass-card flex items-center justify-center border border-neon/20 shrink-0">
                <Bot size={14} className="text-neon" />
              </div>
              <div className="glass-card rounded-[1.4rem] rounded-tl-sm px-5 py-3.5 border-l-2 border-l-neon/60 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-neon rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-neon rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-neon rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Quick Prompts — only show at start */}
      {messages.length === 1 && (
        <div className="px-5 pb-3 flex flex-wrap gap-2">
          {QUICK_PROMPTS.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              className="text-xs bg-zinc-900 border border-white/10 text-gray-300 rounded-full px-3 py-1.5 hover:border-neon hover:text-neon transition-all"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="absolute bottom-20 left-0 w-full px-5 bg-gradient-to-t from-black via-black/95 to-transparent pt-10 pb-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about diet, workout..."
            className="flex-1 bg-zinc-900/90 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-all text-sm"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="w-14 h-14 bg-neon rounded-2xl flex items-center justify-center text-black disabled:opacity-40 hover:bg-[#2fe512] transition-all shadow-[0_0_16px_rgba(255, 184, 0,0.4)] hover:scale-105"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} className="-ml-0.5" />}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
