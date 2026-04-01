import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FileText, X, Zap, GraduationCap, Activity, PlayCircle, BookOpen,
  ChevronRight, Loader2, CheckCircle, TrendingUp, Star, ArrowRight,
  Sparkles, BarChart2, Copy, Download, RotateCcw, LayoutDashboard, Brain, Info,
  AlertCircle, Target, ShieldCheck, Rocket
} from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import {
  generateCoverLetter, generateGrowthPlan,
  generateCareerPivotPlan, generateQuizQuestions
} from '../services/groq';

/* ────────────────────────── QUIZ MODAL ────────────────────────── */
function QuizModal({ skill, onClose }) {
  const [questions, setQ] = useState([]);
  const [loading, setL]   = useState(true);
  const [error, setE]     = useState('');
  const [idx, setIdx]     = useState(0);
  const [score, setScore] = useState(0);
  const [sel, setSel]     = useState(null);
  const [done, setDone]   = useState(false);

  useEffect(() => {
    setL(true); setE('');
    generateQuizQuestions(skill).then(q => {
      if (!q || q.length === 0) { setE('Failed to generate questions.'); setL(false); return; }
      setQ(q); setL(false);
    }).catch(() => { setE('Network error.'); setL(false); });
  }, [skill]);

  const pick = (i) => {
    if (sel !== null) return;
    setSel(i);
    if (i === questions[idx].answer) setScore(s => s + 1);
    setTimeout(() => {
      if (idx + 1 < questions.length) { setIdx(v => v + 1); setSel(null); }
      else setDone(true);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-navy-950/90 backdrop-blur-xl">
      <div className="brutal-card w-full max-w-xl overflow-hidden shadow-neon border-brand-primary/30">
        <div className="flex items-center justify-between px-6 py-4 border-b border-navy-800 bg-navy-900">
          <div>
            <div className="font-black uppercase text-brand-primary tracking-tighter text-lg">{skill} Quiz</div>
            <div className="text-[8px] font-black uppercase tracking-[0.4em] text-navy-500">Validation Protocol Engine</div>
          </div>
          <button onClick={onClose} className="p-2 bg-brand-red rounded-lg text-white hover:scale-110 transition-transform"><X size={16} /></button>
        </div>

        <div className="p-8">
          {loading ? (
            <div className="flex flex-col items-center py-20 gap-4">
              <Loader2 size={48} className="text-brand-primary animate-spin" />
              <p className="text-navy-400 font-bold uppercase tracking-widest text-xs animate-pulse">Syncing with LLM...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-brand-red font-bold uppercase underline underline-offset-8 italic">{error}</div>
          ) : done ? (
            <div className="text-center py-12">
              <div className="text-brand-accent text-8xl font-black mb-4 italic glow-text">{Math.round((score / questions.length) * 100)}%</div>
              <div className="text-white font-black uppercase text-2xl mb-8 italic">Efficiency: {score}/{questions.length}</div>
              <button onClick={onClose} className="brutal-btn-primary w-full rounded-xl py-4">Finish Protocol</button>
            </div>
          ) : (
            <>
              <div className="mb-8 p-4 bg-navy-950 rounded-xl border border-navy-800 shadow-inner">
                <p className="text-white text-xl font-black italic tracking-tight leading-snug">"{questions[idx]?.q}"</p>
              </div>
              <div className="space-y-3">
                {questions[idx]?.options.map((opt, i) => {
                  const revealed = sel !== null;
                  const isCorrect = i === questions[idx].answer;
                  const isSelected = i === sel;
                  return (
                    <button key={i} onClick={() => pick(i)}
                      className={`w-full p-5 rounded-xl text-left font-black uppercase text-xs tracking-tight transition-all flex items-center justify-between border-2 ${
                        !revealed ? 'bg-navy-900 border-navy-800 hover:border-brand-primary text-navy-300' :
                        isCorrect ? 'bg-brand-accent/10 border-brand-accent text-brand-accent shadow-[0_0_20px_rgba(16,185,129,0.1)]' :
                        isSelected ? 'bg-brand-red/10 border-brand-red text-brand-red' : 'bg-navy-950 border-navy-800 text-navy-600'
                      }`}
                    >
                      <span>{opt}</span>
                      {revealed && isCorrect && <CheckCircle size={18} />}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────── COVER LETTER MODAL ────────────────────────── */
function CoverLetterModal({ data, onClose }) {
  const [text, setText] = useState('');
  const [loading, setL] = useState(true);

  useEffect(() => {
    generateCoverLetter({
      role: data.role, matchedSkills: data.skills.match,
      missingSkills: data.skills.missing, score: data.score
    }).then(t => { setText(t); setL(false); });
  }, []);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-xl">
      <div className="brutal-card w-full max-w-2xl bg-navy-900 border-brand-accent/30 shadow-2xl">
        <div className="px-8 py-6 border-b border-navy-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="text-brand-accent" size={24} />
            <h3 className="text-xl font-black uppercase text-white tracking-widest italic">AI Narrative Engine</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg bg-navy-800 text-navy-400 hover:text-white transition-colors"><X size={20} /></button>
        </div>
        <div className="p-8">
          {loading ? (
             <div className="flex flex-col items-center py-20 animate-pulse">
                <Brain size={64} className="text-brand-accent mb-6" />
                <div className="text-brand-accent font-black uppercase text-xs tracking-[0.5em]">Synthesizing Pitch...</div>
             </div>
          ) : (
             <div className="space-y-6">
                <div className="bg-navy-950 p-6 rounded-2xl border border-navy-800 max-h-[400px] overflow-y-auto text-navy-300 text-sm font-medium leading-relaxed font-sans">
                  {text.split('\n').map((l, i) => <p key={i} className="mb-4">{l}</p>)}
                </div>
                <div className="flex gap-4">
                  <button onClick={() => navigator.clipboard.writeText(text)} className="brutal-btn-primary flex-1 rounded-xl py-4 group">
                    <Copy size={18} /> Copy Dossier
                  </button>
                  <button onClick={onClose} className="flex-1 py-4 bg-navy-800 hover:bg-navy-700 text-white font-black uppercase text-xs rounded-xl transition-all">Dismiss</button>
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────── GROWTH CARD ────────────────────────── */
function GrowthCard({ skill, role, onQuiz }) {
  const [plan, setPlan]     = useState(null);
  const [loading, setL]     = useState(false);
  const [expanded, setExp]  = useState(false);

  const loadPlan = async (e) => {
    // Prevent double fire if clicking buttons inside the expanded area
    if (e.target.closest('button') && !e.target.closest('.toggle-btn')) return;
    if (e.target.closest('a')) return;

    if (plan) { setExp(e => !e); return; }
    setL(true);
    const p = await generateGrowthPlan(skill, role);
    setPlan(p); setL(false); setExp(true);
  };

  return (
    <div 
      className={`bg-navy-950/50 border rounded-xl overflow-hidden transition-all duration-300 cursor-pointer ${expanded ? 'border-brand-primary ring-1 ring-brand-primary/20' : 'border-navy-800 hover:border-brand-primary/40'}`}
      onClick={loadPlan}
    >
      <div className="p-4 flex items-center justify-between">
        <div>
          <div className="text-white font-black uppercase tracking-tight italic text-sm">{skill}</div>
          <div className="text-brand-yellow font-black uppercase text-[7px] tracking-widest mt-0.5">Critical Skill Gap</div>
        </div>
        <div className="text-navy-500 toggle-btn">
           {loading ? <Loader2 size={16} className="animate-spin" /> : <ChevronRight size={18} className={`transition-transform duration-300 ${expanded ? 'rotate-90' : ''}`} />}
        </div>
      </div>

      {expanded && plan && (
        <div className="px-4 pb-4 space-y-3 border-t border-navy-800 bg-navy-900/30 animate-in fade-in slide-in-from-top-2">
          <p className="text-navy-400 text-[10px] font-bold mt-3 leading-relaxed uppercase">{plan.description}</p>
          <div className="space-y-2 pt-2">
            <button onClick={() => onQuiz(skill)} className="w-full bg-brand-primary rounded-lg py-2 text-white font-black uppercase text-[10px] tracking-widest italic hover:shadow-neon transition-all flex items-center justify-center gap-2">
               <Zap size={10} className="fill-white" /> VALIDATE SKILL
            </button>
            <a 
              href={`https://www.coursera.org/search?query=${encodeURIComponent(skill)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full border border-navy-800 hover:border-white/20 rounded-lg py-2 text-navy-400 hover:text-white font-black uppercase text-[10px] tracking-widest italic transition-all flex items-center justify-center gap-2"
            >
               <BookOpen size={10} /> VIEW RECOMMENDED TRAINING
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

/* ────────────────────────── PIVOT MODAL ────────────────────────── */
function PivotModal({ pivot, currentSkills, onClose }) {
  const [plan, setPlan] = useState(null);
  const [loading, setL] = useState(true);

  useEffect(() => {
    generateCareerPivotPlan(pivot, currentSkills).then(p => { setPlan(p); setL(false); });
  }, [pivot]);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-navy-950/90 backdrop-blur-xl">
      <div className="brutal-card w-full max-w-xl bg-navy-900 border-brand-yellow/30 shadow-2xl relative">
        <div className="flex items-center justify-between px-6 py-4 border-b border-navy-800 bg-navy-900">
          <div className="flex items-center gap-3">
             <Rocket className="text-brand-yellow" size={24} />
             <div>
                <h3 className="text-white font-black uppercase text-lg tracking-tighter italic">{pivot} Protocol</h3>
                <div className="text-[8px] font-black uppercase tracking-[0.4em] text-navy-500">Cross-Domain Intelligence Analysis</div>
             </div>
          </div>
          <button onClick={onClose} className="p-2 bg-brand-red rounded-lg text-white hover:scale-110 transition-transform"><X size={16} /></button>
        </div>

        <div className="p-8">
          {loading ? (
            <div className="flex flex-col items-center py-20 gap-4">
              <Loader2 size={48} className="text-brand-yellow animate-spin" />
              <p className="text-navy-400 font-bold uppercase tracking-widest text-xs animate-pulse">Running Simulation...</p>
            </div>
          ) : (
             <div className="space-y-6">
                <div className="p-6 bg-navy-950 rounded-2xl border border-navy-800 shadow-inner">
                   <p className="text-white text-xl font-black italic tracking-tight leading-snug">"{plan?.summary}"</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-navy-950/50 p-4 rounded-xl border border-navy-800">
                      <div className="text-brand-yellow font-black uppercase text-[8px] tracking-widest mb-2">TARGET SKILLS</div>
                      <div className="flex flex-wrap gap-2">
                         {plan?.keySkills?.map((s, i) => <span key={i} className="text-white text-[10px] font-black uppercase italic bg-navy-900 px-2 py-1 rounded-md">{s}</span>)}
                      </div>
                   </div>
                   <div className="bg-navy-950/50 p-4 rounded-xl border border-navy-800 flex flex-col justify-center">
                      <div className="text-brand-yellow font-black uppercase text-[8px] tracking-widest mb-1">TIMELINE</div>
                      <div className="text-white font-black text-xl italic">{plan?.timeline}</div>
                   </div>
                </div>

                <div className="p-4 bg-brand-yellow/5 border border-brand-yellow/20 rounded-xl">
                   <div className="text-brand-yellow font-black uppercase text-[8px] tracking-widest mb-1 italic">INITIAL STRIKE (FIRST STEP)</div>
                   <div className="text-white font-black text-xs uppercase tracking-tight italic">{plan?.firstStep}</div>
                </div>

                <div className="flex gap-4">
                   <a 
                     href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(pivot)}`}
                     target="_blank" rel="noopener noreferrer"
                     className="flex-1 brutal-btn-primary flex items-center justify-center gap-2 rounded-xl py-4 bg-brand-primary text-xs"
                   >
                      <Target size={18} /> TRACE TO JOBS
                   </a>
                   <a 
                     href={`https://www.coursera.org/search?query=${encodeURIComponent(pivot)}`}
                     target="_blank" rel="noopener noreferrer"
                     className="flex-1 py-4 bg-navy-800 hover:bg-navy-700 text-white font-black uppercase text-xs rounded-xl transition-all flex items-center justify-center gap-2 border border-navy-700"
                   >
                      <BookOpen size={18} /> LEARNING PATHWAY
                   </a>
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────── MAIN PAGE ────────────────────────── */
export default function AnalysisResult() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [quizSkill, setQuizSkill] = useState(null);
  const [showCover, setShowCover] = useState(false);
  const [selectedPivot, setSelectedPivot] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('last_analysis');
    if (saved) {
      setData(JSON.parse(saved));
    } else {
      navigate('/dashboard');
    }
  }, []);

  if (!data || !data.skills) return (
    <div className="min-h-screen fixed inset-0 flex flex-col items-center justify-center bg-navy-950">
       <div className="p-8 brutal-card bg-navy-900 border-brand-red/30 flex flex-col items-center gap-6">
          <AlertCircle size={48} className="text-brand-red animate-pulse" />
          <div className="text-center">
            <h2 className="text-white font-black uppercase text-xl mb-2">Protocol Failure</h2>
            <p className="text-navy-400 text-[10px] font-black uppercase tracking-widest">Analysis record is corrupted or missing core telemetry.</p>
          </div>
          <button onClick={() => navigate('/dashboard')} className="brutal-btn-primary rounded-xl px-12 py-4">Re-Initialize</button>
       </div>
    </div>
  );

  const matchedSkills = data.skills?.match || [];
  const missingSkills = data.skills?.missing || [];

  const radarData = [
    ...(matchedSkills.slice(0, 6).map(s => ({ subject: s, A: 85 + Math.random()*10, B: 90 }))),
    ...(missingSkills.slice(0, 6).map(s => ({ subject: s, A: 10 + Math.random()*20, B: 90 })))
  ];

  // Default values for robustness
  const score = Math.round(data.score || 0);
  const atsScore = Math.round(data.ats_score || 0);
  const rank = data.rank || 50;
  const atsDetails = data.ats_details || { score: 0, found_sections: [], word_count: 0, contact_info: {} };

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 bg-navy-950 overflow-x-hidden">
      
      {/* Modals */}
      {quizSkill && <QuizModal skill={quizSkill} onClose={() => setQuizSkill(null)} />}
      {showCover && <CoverLetterModal data={data} onClose={() => setShowCover(false)} />}
      {selectedPivot && <PivotModal pivot={selectedPivot} currentSkills={matchedSkills} onClose={() => setSelectedPivot(null)} />}

      <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-6 pb-20 px-6 mt-10">
        
        {/* COLUMN 1: INTELLIGENCE SIDEBAR (LEFT) */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
           {/* CANDIDATE INTELLIGENCE MATRIX */}
           <div className="brutal-card p-6 bg-navy-900 border-navy-800">
              <div className="flex items-center gap-3 mb-6">
                 <FileText className="text-brand-primary" size={18} />
                 <h2 className="text-xs font-black uppercase tracking-widest text-white">CANDIDATE INTELLIGENCE</h2>
              </div>
              <div className="flex flex-col items-center p-6 bg-navy-950 rounded-2xl border border-navy-800 text-center">
                 <div className="p-4 bg-brand-primary/5 rounded-2xl mb-4 border border-brand-primary/10">
                    <FileText size={42} className="text-brand-primary" />
                 </div>
                 <div className="text-white font-black uppercase text-sm mb-1 truncate w-full">{data.filename || 'DOCUMENT.pdf'}</div>
                 <div className="text-navy-500 font-bold text-[8px] uppercase tracking-widest">Protocol: {data.role}</div>
              </div>
           </div>

           {/* ATS AUDIT LOG */}
           <div className="brutal-card p-6 bg-navy-900 border-navy-800">
              <div className="flex items-center gap-3 mb-6">
                 <ShieldCheck className="text-brand-accent" size={18} />
                 <h2 className="text-xs font-black uppercase tracking-widest text-white">ATS AUDIT LOG</h2>
              </div>
              <div className="space-y-3">
                 {[
                   { label: 'Formatting', val: atsDetails.score > 50 ? 'Compliant' : 'Warning', c: 'text-brand-accent' },
                   { label: 'Word Matrix', val: atsDetails.word_count + ' Str', c: 'text-brand-yellow' },
                   { label: 'Section Logic', val: (atsDetails.found_sections?.length || 0) + '/7', c: 'text-brand-primary' },
                   { label: 'Identity Link', val: atsDetails.contact_info?.email ? 'Verified' : 'Missing', c: atsDetails.contact_info?.email ? 'text-brand-accent' : 'text-brand-red' }
                 ].map((item, i) => (
                   <div key={i} className="flex items-center justify-between p-3 bg-navy-950 rounded-xl border border-navy-800/50">
                      <span className="text-[8px] font-black uppercase text-navy-600 tracking-widest">{item.label}</span>
                      <span className={`text-[10px] font-black uppercase italic ${item.c}`}>{item.val}</span>
                   </div>
                 ))}
              </div>
           </div>

           {/* TARGET BLUEPRINT (JD) */}
           <div className="brutal-card p-6 bg-navy-900 border-navy-800">
              <div className="flex items-center gap-3 mb-4">
                 <Target className="text-brand-primary" size={18} />
                 <h2 className="text-xs font-black uppercase tracking-widest text-white">TARGET BLUEPRINT</h2>
              </div>
              <div className="p-4 bg-navy-950 rounded-xl border border-navy-800 max-h-[180px] overflow-y-auto text-[10px] font-medium text-navy-400 leading-relaxed scrollbar-hide">
                 {data.job_description || 'Job blueprint details offline.'}
              </div>
              <button 
                onClick={() => navigate('/dashboard')} 
                className="w-full mt-6 py-4 rounded-xl border border-navy-800 bg-white/5 hover:bg-white/10 text-white font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2 group"
              >
                 <RotateCcw size={14} className="group-hover:rotate-180 transition-transform duration-500" /> RE-INITIALIZE SCAN
              </button>
           </div>
        </div>

        {/* COLUMN 2: COMMAND CENTER (CENTER) */}
        <div className="col-span-12 lg:col-span-6 space-y-6">
           {/* SCORE GRID */}
           <div className="grid grid-cols-2 gap-6">
              <div className="brutal-card p-8 bg-navy-900 border-navy-800 flex flex-col items-center justify-center relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10"><Brain size={32} /></div>
                 <div className="text-navy-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4">MATCH ALIGNMENT</div>
                 <div className="text-7xl font-black text-brand-primary italic glow-text mb-4">{score}%</div>
                 <div className="px-5 py-2 bg-brand-yellow rounded-full text-black font-black uppercase text-[9px] italic shadow-lg -rotate-1">
                    RANK TOP {rank}%
                 </div>
              </div>
              <div className="brutal-card p-8 bg-navy-900 border-navy-800 flex flex-col items-center justify-center relative">
                 <div className="absolute top-0 right-0 p-4 opacity-10"><Zap size={32} /></div>
                 <div className="text-navy-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4">ATS COMPATIBILITY</div>
                 <div className="text-7xl font-black text-brand-accent italic glow-text mb-4">{atsScore}%</div>
                 <div className="text-brand-accent font-black uppercase text-[10px] tracking-[0.4em] italic flex items-center gap-2">
                    <CheckCircle size={14} /> GRADE {atsScore > 80 ? 'A+' : atsScore > 60 ? 'B' : 'C'}
                 </div>
              </div>
           </div>

           {/* EXECUTIVE AI INTELLIGENCE */}
           <div className="brutal-card p-8 bg-brand-primary/5 border-brand-primary/20 relative shadow-inner">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-brand-primary/10 rounded-2xl text-brand-primary border border-brand-primary/20"><Sparkles size={24} /></div>
                    <h3 className="text-xl font-black uppercase text-white tracking-tight italic">AI EXECUTIVE INTELLIGENCE</h3>
                 </div>
                 <button onClick={() => { navigator.clipboard.writeText(data.summary); }} className="p-2.5 rounded-xl border border-brand-primary/20 bg-navy-950 hover:bg-white/5 text-brand-primary transition-all"><Copy size={16} /></button>
              </div>
              <p className="text-xl md:text-2xl font-black uppercase text-white italic tracking-tighter leading-tight mb-10">{data.summary}</p>
              <button 
                onClick={() => setShowCover(true)} 
                className="brutal-btn-primary w-full max-w-[300px] rounded-xl py-5 flex items-center justify-center gap-4 text-sm tracking-widest group"
              >
                 GENERATE COVER LETTER <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
              </button>
           </div>

           {/* SKILL SPLIT MATRIX */}
           <div className="grid grid-cols-2 gap-6">
              <div className="brutal-card p-6 bg-navy-900 border-navy-800">
                 <div className="flex items-center gap-3 mb-6 text-brand-accent">
                    <CheckCircle size={18} />
                    <h2 className="text-xs font-black uppercase tracking-widest">VALIDATED SKILLS</h2>
                 </div>
                 <div className="flex flex-wrap gap-1.5">
                    {matchedSkills.map((s, i) => (
                      <span key={i} className="px-2 py-1.5 bg-navy-950 border border-brand-accent/20 rounded-lg text-[9px] font-black uppercase tracking-tighter text-brand-accent whitespace-nowrap">{s}</span>
                    ))}
                 </div>
              </div>
              <div className="brutal-card p-6 bg-navy-900 border-navy-800">
                 <div className="flex items-center gap-3 mb-6 text-brand-red">
                    <AlertCircle size={18} />
                    <h2 className="text-xs font-black uppercase tracking-widest">MISSING GAPS</h2>
                 </div>
                 <div className="flex flex-wrap gap-1.5">
                    {missingSkills.map((s, i) => (
                      <span key={i} className="px-2 py-1.5 bg-navy-950 border border-brand-red/20 rounded-lg text-[9px] font-black uppercase tracking-tighter text-brand-red whitespace-nowrap">{s}</span>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* COLUMN 3: ANALYTICS SIDEBAR (RIGHT) */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
           {/* RADAR CHART */}
           <div className="brutal-card p-6 bg-navy-900 border-navy-800">
              <div className="flex items-center gap-3 mb-6">
                 <Activity className="text-brand-cyan" size={18} />
                 <h2 className="text-xs font-black uppercase tracking-widest text-white">ALIGNMENT RADAR</h2>
              </div>
              <div className="h-[260px] -mx-4">
                 <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                       <PolarGrid stroke="#1e293b" />
                       <PolarAngleAxis dataKey="subject" tick={(props) => {
                          const { x, y, payload } = props;
                          return <text x={x} y={y} textAnchor="middle" fill="#4a6080" className="text-[7px] font-bold">{payload.value}</text>;
                       }} />
                       <Radar name="Portfolio" dataKey="A" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.4} />
                       <Tooltip wrapperClassName="!bg-[#0d1425] !border-white/10 !rounded-xl !p-2 !shadow-2xl" contentStyle={{ backgroundColor: 'transparent', border: 'none', fontSize: '8px', color: '#fff' }} />
                    </RadarChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* GROWTH BLUEPRINT */}
           <div className="brutal-card p-6 bg-navy-900 border-navy-800">
              <div className="flex items-center gap-3 mb-6">
                 <GraduationCap className="text-brand-accent" size={18} />
                 <h2 className="text-xs font-black uppercase tracking-widest text-white">GROWTH BLUEPRINT</h2>
              </div>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                 {missingSkills.map((skill, i) => (
                   <GrowthCard key={i} skill={skill} role={data.role} onQuiz={setQuizSkill} />
                 ))}
              </div>
           </div>

           {/* CAREER PIVOTS */}
           <div className="brutal-card p-6 bg-navy-950 border-white/5">
              <div className="flex items-center gap-3 mb-6">
                 <Rocket className="text-brand-yellow" size={18} />
                 <h2 className="text-xs font-black uppercase tracking-widest text-white">CAREER PIVOTS</h2>
              </div>
              <div className="grid grid-cols-1 gap-3">
                 {data.pivots.map((p, i) => (
                   <div 
                    key={i} 
                    onClick={() => setSelectedPivot(p)}
                    className="premium-glass p-4 rounded-xl border border-white/5 hover:border-brand-yellow/30 hover:bg-white/5 transition-all group cursor-pointer"
                   >
                      <div className="text-white font-black uppercase text-[10px] group-hover:text-brand-yellow transition-colors truncate">{p}</div>
                      <div className="mt-2 flex items-center justify-between">
                         <div className="h-0.5 flex-1 bg-white/5 rounded-full mr-3"><div className="h-full bg-brand-yellow rounded-full" style={{ width: `${80 - i*10}%` }} /></div>
                         <ArrowRight size={12} className="text-navy-600 group-hover:text-brand-yellow transition-colors" />
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
