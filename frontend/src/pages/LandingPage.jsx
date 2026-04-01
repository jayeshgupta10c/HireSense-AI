import React from 'react';
import { Zap, ArrowRight, CheckCircle2, ShieldCheck, Target, Terminal, Briefcase, Activity, Sparkles, Cpu, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleAction = (path) => {
    if (user) {
      navigate(path);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen pt-20">
      
      {/* ─── HERO SECTION ─── */}
      <section className="relative px-6 py-24 max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
        
        {/* Glow Effects */}
        <div className="absolute top-1/4 -left-10 w-72 h-72 bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 -right-10 w-96 h-96 bg-brand-accent/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-brand-primary text-xs font-black uppercase tracking-[0.2em] mb-8 animate-pulse">
           <Sparkles size={14} /> Next-Gen AI Analysis Active
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase leading-[0.9] mb-8 glow-text">
          Precision Engineering <br/>
          <span className="text-brand-primary italic">For Your Career</span>
        </h1>

        <p className="max-w-2xl text-lg md:text-xl font-medium text-navy-300 leading-relaxed mb-12">
          Stop guessing. Our direct neural matching engine exposes hidden skill gaps and optimizes your resume for elite technical roles with mathematical precision.
        </p>

        <div className="flex flex-col sm:flex-row gap-6">
          <button
            onClick={() => handleAction('/dashboard')}
            className="brutal-btn-primary px-10 py-5 rounded-xl group"
          >
            Start Deep Analysis <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
          </button>

        </div>
      </section>

      {/* ─── LIVE METRICS ─── */}
      <div className="max-w-7xl mx-auto px-6 mb-24">
        <div className="premium-glass rounded-3xl border border-white/10 p-10 grid grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="flex flex-col items-center">
            <div className="text-4xl font-black text-white mb-1 tracking-tighter">99.8%</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-navy-400">Match Precision</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-4xl font-black text-brand-primary mb-1 tracking-tighter">15ms</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-navy-400">Response Latency</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-4xl font-black text-brand-accent mb-1 tracking-tighter">50K+</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-navy-400">Processed Resumes</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-4xl font-black text-brand-yellow mb-1 tracking-tighter">24/7</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-navy-400">System Uptime</div>
          </div>
        </div>
      </div>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-24">
        <div className="mb-20">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-center">
            The Analysis <span className="text-brand-primary italic">Protocol</span>
          </h2>
          <div className="w-20 h-1 bg-brand-primary mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {[
            { 
              step: '01', title: 'Data Ingestion', icon: <Cpu size={32} />, 
              desc: 'Securely upload your dossier. Our engine strips formatting to analyze raw intelligence.'
            },
            {
              step: '02', title: 'Neural Matching', icon: <Activity size={32} />, 
              desc: 'Your profile is cross-referenced against target JD requirements using direct keyword intersection.'
            },
            {
              step: '03', title: 'Actionable Intelligence', icon: <BarChart3 size={32} />, 
              desc: 'Receive a comprehensive report on skill gaps, ATS compatibility, and strategic pivot options.'
            }
          ].map((item, i) => (
            <div key={i} className="brutal-card brutal-card-hover p-10 group">
              <div className="text-5xl font-black text-white/5 absolute top-6 right-8 group-hover:text-brand-primary/10 transition-colors">
                {item.step}
              </div>
              <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mb-8 text-brand-primary border border-brand-primary/20">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tight mb-4">{item.title}</h3>
              <p className="text-navy-300 font-medium text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── TECH SPECS ─── */}
      <section className="py-24 bg-white/5 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-8 glow-text">
              Engineered For <br/><span className="text-brand-accent">Elite Results.</span>
            </h2>
            <div className="grid gap-6">
              {[
                { title: "Direct Skill Intersection", desc: "No opaque black-box scoring. See exactly where your skills overlap." },
                { title: "Heuristic ATS Checker", desc: "Checks structure, contact info, and formatting for maximum compatibility." },
                { title: "Strategic Gap Analysis", desc: "Identifies top missing skills to help you prioritize your learning." },
                { title: "Real-time Peer Ranking", desc: "See where you stand compared to thousands of other analyzed profiles." }
              ].map((f, i) => (
                <div key={i} className="flex gap-5">
                  <div className="mt-1 bg-brand-accent/20 p-1.5 rounded-lg border border-brand-accent/20">
                    <CheckCircle2 size={18} className="text-brand-accent" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold uppercase text-white tracking-tight">{f.title}</h4>
                    <p className="text-navy-400 text-sm">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="premium-glass p-8 rounded-[40px] border border-brand-primary/20 shadow-neon">
               <div className="flex gap-4 mb-6">
                 <div className="flex-1 h-32 bg-navy-800/50 rounded-2xl border border-white/5 animate-pulse" />
                 <div className="w-32 h-32 bg-brand-primary/20 rounded-2xl border border-brand-primary/20 flex items-center justify-center text-brand-primary">
                    <Activity size={40} />
                 </div>
               </div>
               <div className="space-y-4">
                 <div className="h-4 w-3/4 bg-white/5 rounded-full" />
                 <div className="h-2 w-full bg-white/5 rounded-full" />
                 <div className="h-2 w-5/6 bg-white/5 rounded-full" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-32 px-6 text-center">
        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-10 glow-text italic">
          Override The <span className="text-brand-primary">Competition.</span>
        </h2>
        <button
          onClick={() => handleAction('/dashboard')}
          className="brutal-btn-primary px-16 py-6 rounded-2xl mx-auto shadow-2xl shadow-brand-primary/20"
        >
          Initialize Protocol <Zap size={24} className="fill-white" />
        </button>
      </section>

    </div>
  );
}
