import React from 'react';
import { Zap, ArrowRight, CheckCircle2, ShieldCheck, Target, Terminal, Briefcase, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* Extract colors */
const BG     = '#0d1421';
const CARD   = '#111c2d';
const BORDER = '#1e3050';
const TEAL   = '#00d9b5';
const BLUE   = '#4a9eff';
const YELLOW = '#fbbf24';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ background: BG, minHeight: '100vh', fontFamily: "'Inter', system-ui, sans-serif" }} className="text-white">
      
      {/* ─── HERO SECTION ─── */}
      <section className="relative px-6 pt-32 pb-24 max-w-7xl mx-auto flex flex-col items-center justify-center text-center overflow-hidden">
        
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
          style={{ backgroundImage: `linear-gradient(${BORDER} 1px, transparent 1px), linear-gradient(90deg, ${BORDER} 1px, transparent 1px)`, backgroundSize: '40px 40px' }} 
        />
        
        <div style={{ background: `${BLUE}15`, border: `2px solid ${BLUE}`, color: BLUE }}
          className="inline-flex items-center gap-2 px-5 py-2 font-black italic uppercase tracking-[0.3em] text-[10px] mb-10 -rotate-2 relative z-10 shadow-[4px_4px_0px_#4a9eff]">
          <Zap size={14} style={{ fill: BLUE }} /> HireSense-AI V4.0 Active
        </div>

        <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-black italic tracking-tighter uppercase leading-[0.9] mb-8 relative z-10">
          Supercharge Your <br/>
          <span className="relative">
            <span style={{ color: TEAL }}>Tech Career</span>
            <svg className="absolute -bottom-4 w-full h-8" viewBox="0 0 100 20" preserveAspectRatio="none">
              <path d="M0 10 Q 50 20 100 0" fill="none" stroke={TEAL} strokeWidth="6" strokeLinecap="square" />
            </svg>
          </span>
        </h1>

        <p style={{ color: '#94a3b8' }} className="max-w-2xl text-lg md:text-xl font-bold uppercase tracking-widest leading-relaxed mb-12 relative z-10">
          The ultimate intelligent ML pipeline to analyze your resume, expose missing skill gaps, and generate strategic pivot blueprints in seconds.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 relative z-10">
          <button onClick={() => navigate('/dashboard')}
            style={{ background: TEAL, border: `3px solid black`, boxShadow: `6px 6px 0 black`, color: '#0d1421' }}
            className="px-10 py-5 font-black italic uppercase text-lg tracking-tighter flex items-center justify-center gap-3 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
            Initialize Scan <ArrowRight size={22} />
          </button>
        </div>
      </section>

      {/* ─── STATISTICS BANNER ─── */}
      <div style={{ borderTop: `2px solid ${BORDER}`, borderBottom: `2px solid ${BORDER}`, background: CARD }} className="py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-x-2 divide-[#1e3050]">
          <div>
            <div style={{ color: TEAL }} className="text-5xl font-black italic tracking-tighter mb-2">99%</div>
            <div style={{ color: '#4a6080' }} className="text-[10px] font-black uppercase tracking-[0.3em]">ATS Match Accuracy</div>
          </div>
          <div>
            <div style={{ color: BLUE }} className="text-5xl font-black italic tracking-tighter mb-2">5K+</div>
            <div style={{ color: '#4a6080' }} className="text-[10px] font-black uppercase tracking-[0.3em]">ML Skill Datasets</div>
          </div>
          <div>
            <div style={{ color: YELLOW }} className="text-5xl font-black italic tracking-tighter mb-2">&lt;2s</div>
            <div style={{ color: '#4a6080' }} className="text-[10px] font-black uppercase tracking-[0.3em]">Processing Speed</div>
          </div>
          <div>
            <div className="text-5xl font-black italic tracking-tighter text-white mb-2">∞</div>
            <div style={{ color: '#4a6080' }} className="text-[10px] font-black uppercase tracking-[0.3em]">Growth Potential</div>
          </div>
        </div>
      </div>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white mb-4">
            How The Pipeline Works
          </h2>
          <div style={{ width: 80, height: 6, background: BLUE }} className="mx-auto" />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { 
              step: '01', title: 'Upload Intelligence', icon: <Terminal size={32} />, color: BLUE,
              desc: 'Relinquish your raw PDF dossier and inject the target job description parameters.'
            },
            {
              step: '02', title: 'ML Vectorization', icon: <Activity size={32} />, color: YELLOW,
              desc: 'Our core engine parses your text via TF-IDF against thousands of real-world role matrices.'
            },
            {
              step: '03', title: 'Executive Output', icon: <ShieldCheck size={32} />, color: TEAL,
              desc: 'Instantly view your skill gaps, ATS score, Groq AI generated roadmaps, and cover letters.'
            }
          ].map((item, i) => (
            <div key={i} style={{ background: CARD, border: `2px solid ${BORDER}` }} className="p-8 relative hover:-translate-y-2 transition-transform duration-300">
              <div style={{ color: item.color }} className="text-6xl font-black italic tracking-tighter mb-4 opacity-20 absolute top-4 right-4 leading-none">
                {item.step}
              </div>
              <div style={{ background: item.color, border: `2px solid black`, boxShadow: `4px 4px 0 black` }} className="w-16 h-16 flex items-center justify-center mb-8 rotate-3">
                {React.cloneElement(item.icon, { style: { color: 'black' }})}
              </div>
              <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4">{item.title}</h3>
              <p style={{ color: '#94a3b8' }} className="font-bold text-sm tracking-wide leading-relaxed uppercase">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES / PREVIEW ─── */}
      <section style={{ borderTop: `2px solid ${BORDER}`, background: CARD }} className="py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-5xl font-black italic uppercase tracking-tighter text-white mb-8">
              Premium Intelligence <br/><span style={{ color: TEAL }}>Unleashed.</span>
            </h2>
            <div className="space-y-6">
              {[
                "Instant Match Scoring & Ranking against peer vectors.",
                "AI-Powered Cover Letter Generation using Llama-3.",
                "Dual Radar Alignment visualization of missing targets.",
                "Interactive Skill Quizzes and Learning Resources."
              ].map((f, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <CheckCircle2 size={24} style={{ color: TEAL }} className="shrink-0 mt-1" />
                  <p className="text-lg font-black uppercase tracking-tight text-white italic">{f}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Abstract Dashboard Mockup */}
          <div className="relative">
            <div style={{ background: BG, border: `3px solid ${BLUE}`, boxShadow: `16px 16px 0 ${BLUE}` }} className="aspect-video p-6 relative">
              <div className="flex gap-4 mb-8">
                <div style={{ background: TEAL, height: 120 }} className="flex-1 border-2 border-black rotate-1" />
                <div style={{ background: YELLOW, height: 120 }} className="flex-1 border-2 border-black -rotate-2" />
              </div>
              <div style={{ background: CARD, border: `2px solid ${BORDER}` }} className="h-32 mb-4 p-4">
                 <div style={{ height: 12, width: '40%', background: BLUE }} className="mb-4" />
                 <div style={{ height: 8, width: '80%', background: BORDER }} className="mb-2" />
                 <div style={{ height: 8, width: '60%', background: BORDER }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-32 px-6 text-center">
        <h2 className="text-6xl font-black italic uppercase tracking-tighter text-white mb-8">Ready to Override<br/>The Competition?</h2>
        <button onClick={() => navigate('/dashboard')}
          style={{ background: BLUE, border: `3px solid black`, boxShadow: `6px 6px 0 black` }}
          className="mx-auto px-12 py-6 font-black italic uppercase text-xl tracking-tighter text-black flex items-center justify-center gap-3 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
          Commence Execution <Zap size={24} style={{ fill: 'black' }} />
        </button>
      </section>

    </div>
  );
}
