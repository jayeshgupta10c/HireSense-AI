import React, { useState } from 'react'; import { Trophy, RotateCcw, ArrowRight, Zap, Target } from 'lucide-react'; import { motion } from 'framer-motion';
const MOCK_QUIZ = [ { q: "Primary benefit of React Hooks?", o: ["Global State", "Logic Reuse", "Faster Rendering", "Automatic Testing"], a: 1 }, { q: "Modern HMR tool?", o: ["WebPack", "Vite", "Babel", "ESLint"], a: 1 } ];
export default function QuizPage() {
  const [current, setCurrent] = useState(0); const [score, setScore] = useState(0); const [showResult, setShowResult] = useState(false);
  const handleAnswer = (idx) => { if (idx === MOCK_QUIZ[current].a) setScore(s => s + 1); if (current < MOCK_QUIZ.length - 1) { setCurrent(c => c + 1); } else { setShowResult(true); } };
  return (
    <div className="bg-navy-950 min-h-screen pt-40 px-6">
      <div className="max-w-3xl mx-auto">
        {!showResult ? (
          <div className="brutal-card p-16 bg-navy-900 border-t-8 border-t-brand-primary relative shadow-2xl">
             <div className="mb-16 flex justify-between items-center bg-navy-950 p-6 border-2 border-navy-800">
               <span className="text-[10px] font-black text-slate-500 tracking-[0.5em] uppercase italic flex items-center gap-3"><Zap size={14} className="text-brand-yellow fill-brand-yellow" /> MODULE 0{current + 1} // INTEL VALIDATION</span>
               <span className="text-brand-primary font-black text-xs italic tracking-widest">{current+1}/{MOCK_QUIZ.length}</span>
             </div>
             <h2 className="text-5xl font-black text-white mb-16 italic leading-[0.9] tracking-tighter uppercase underline decoration-brand-accent decoration-[12px] underline-offset-[16px]">"{MOCK_QUIZ[current].q}"</h2>
             <div className="grid gap-6">
               {MOCK_QUIZ[current].o.map((opt, i) => (
                 <button key={opt} onClick={() => handleAnswer(i)} className="w-full p-8 text-left bg-navy-950 border-3 border-navy-800 font-black text-white uppercase tracking-tighter hover:border-brand-accent hover:bg-brand-accent/5 hover:text-brand-accent transition-all flex justify-between items-center group relative overflow-hidden">
                   <span className="relative z-10">{opt}</span> <ArrowRight size={32} className="relative z-10 opacity-0 group-hover:opacity-100 -translate-x-8 group-hover:translate-x-0 transition-all stroke-[3]" />
                   <div className="absolute top-0 left-0 w-2 h-full bg-brand-primary group-hover:bg-brand-accent transition-colors" />
                 </button>
               ))}
             </div>
          </div>
        ) : (
          <div className="brutal-card p-24 text-center bg-brand-primary text-white border-4 border-black shadow-[20px_20px_0px_0px_rgba(16,185,129,1)]">
             <Trophy size={110} className="mx-auto text-brand-yellow mb-12 animate-bounce stroke-[3]" />
             <h2 className="text-9xl font-black mb-6 italic tracking-tighter uppercase leading-none">INTEL: {Math.round((score/MOCK_QUIZ.length)*100)}%</h2>
             <p className="text-navy-900 text-2xl font-black italic mb-16 uppercase tracking-[0.2em] bg-white inline-block px-8 py-2 -rotate-1">Vector Stability Confirmed.</p>
             <button onClick={() => window.location.reload()} className="brutal-btn-accent !bg-white !text-navy-950 !border-4 !px-16 !py-8 !text-2xl shadow-none hover:bg-brand-yellow transition-all"><RotateCcw size={32} className="stroke-[3]" /> RE-INITIALIZE SCAN</button>
          </div>
        )}
      </div>
    </div>
  );
}
