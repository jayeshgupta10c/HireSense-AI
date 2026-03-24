import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FileText, X, Zap, GraduationCap, Activity, PlayCircle, BookOpen,
  ChevronRight, Loader2, CheckCircle, TrendingUp, Star, ArrowRight,
  Sparkles, BarChart2, Copy, Download, RotateCcw
} from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import {
  generateCoverLetter, generateGrowthPlan,
  generateCareerPivotPlan, generateQuizQuestions
} from '../services/groq';

/* ── Design tokens (exact from screenshots) ── */
const BG     = '#0d1421';
const CARD   = '#111c2d';
const BORDER = '#1e3050';
const TEAL   = '#00d9b5';
const BLUE   = '#4a9eff';
const RED    = '#e53935';
const YELLOW = '#fbbf24';
const DIM    = '#94a3b8';
const MUTED  = '#4a6080';

/* ────────────────────────── HELPERS ────────────────────────── */
const Card = ({ children, style = {}, className = '' }) => (
  <div style={{ background: CARD, border: `2px solid ${BORDER}`, ...style }} className={`overflow-hidden ${className}`}>
    {children}
  </div>
);
const CardHeader = ({ icon, label, accentColor }) => (
  <div style={{ borderBottom: `2px solid ${BORDER}`, borderTop: accentColor ? `4px solid ${accentColor}` : undefined }} className="flex items-center gap-3 px-5 py-4">
    <span style={{ color: accentColor ?? BLUE }}>{icon}</span>
    <span className="font-black italic uppercase tracking-tighter text-white text-base">{label}</span>
  </div>
);

/* ────────────────────────── QUIZ MODAL ────────────────────────── */
function QuizModal({ skill, role, onClose }) {
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
      if (!q || q.length === 0) { setE('Failed to generate questions. Check Groq API key.'); setL(false); return; }
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

  const reset = () => { setIdx(0); setScore(0); setSel(null); setDone(false); setL(true); generateQuizQuestions(skill).then(q => { setQ(q); setL(false); }); };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(12px)' }}>
      <Card style={{ border: `3px solid ${BLUE}`, boxShadow: `10px 10px 0 ${BLUE}`, width: '100%', maxWidth: 560 }}>
        <div style={{ borderBottom: `2px solid ${BORDER}` }} className="flex items-center justify-between px-6 py-4">
          <div>
            <div style={{ color: BLUE }} className="font-black italic uppercase tracking-tighter text-lg">{skill} — AI QUIZ</div>
            <div style={{ color: MUTED }} className="text-[9px] font-black uppercase tracking-[0.4em]">Powered by llama3-8b-8192</div>
          </div>
          <button onClick={onClose} style={{ background: RED }} className="w-9 h-9 flex items-center justify-center border-2 border-black"><X size={16} className="text-white" /></button>
        </div>

        <div className="p-6">
          {loading && (
            <div className="flex flex-col items-center py-16 gap-4">
              <Loader2 size={44} style={{ color: BLUE }} className="animate-spin" />
              <p style={{ color: MUTED }} className="font-black italic uppercase text-sm tracking-widest animate-pulse">Generating with Llama 3...</p>
            </div>
          )}
          {!loading && error && (
            <div className="text-center py-10 space-y-4">
              <p style={{ color: RED }} className="font-black italic uppercase">{error}</p>
              <button onClick={reset} style={{ background: BLUE }} className="px-8 py-3 text-white font-black italic uppercase border-2 border-black"><RotateCcw size={16} className="inline mr-2" />Retry</button>
            </div>
          )}
          {!loading && !error && done && (
            <div className="text-center py-10">
              <div style={{ color: TEAL }} className="text-8xl font-black italic mb-3">{Math.round((score / questions.length) * 100)}<span className="text-4xl">%</span></div>
              <div className="text-white font-black italic uppercase text-xl mb-2">{score} / {questions.length} correct</div>
              <div style={{ color: DIM }} className="font-bold uppercase tracking-widest text-xs mb-8">Quiz Complete</div>
              <div className="flex gap-3 justify-center">
                <button onClick={reset} style={{ background: CARD, border: `2px solid ${BORDER}`, boxShadow: `4px 4px 0 ${BORDER}` }} className="px-8 py-3 text-white font-black italic uppercase text-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2"><RotateCcw size={14} /> Retry</button>
                <button onClick={onClose} style={{ background: TEAL, border: `2px solid black`, boxShadow: `4px 4px 0 black` }} className="px-8 py-3 text-black font-black italic uppercase text-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">Done</button>
              </div>
            </div>
          )}
          {!loading && !error && !done && questions.length > 0 && (
            <>
              {/* Progress */}
              <div className="flex items-center gap-4 mb-6">
                <span style={{ color: MUTED }} className="text-[9px] font-black uppercase tracking-widest shrink-0">Q{idx + 1}/{questions.length}</span>
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: BORDER }}>
                  <div style={{ width: `${(idx / questions.length) * 100}%`, background: BLUE }} className="h-full transition-all duration-500" />
                </div>
                <span style={{ color: BLUE }} className="text-[9px] font-black uppercase tracking-widest shrink-0">{score} PTS</span>
              </div>
              {/* Question */}
              <p className="text-white text-xl font-black italic uppercase tracking-tighter leading-snug mb-6">"{questions[idx]?.q}"</p>
              {/* Options */}
              <div className="space-y-3">
                {questions[idx]?.options.map((opt, i) => {
                  const isCorrect = i === questions[idx].answer;
                  const isSelected = i === sel;
                  const revealed = sel !== null;
                  return (
                    <button key={i} onClick={() => pick(i)}
                      style={{
                        background: !revealed ? BG : isCorrect ? `${TEAL}18` : isSelected ? `${RED}18` : BG,
                        border: `2px solid ${!revealed ? BORDER : isCorrect ? TEAL : isSelected ? RED : BORDER}`,
                        color: !revealed ? 'white' : isCorrect ? TEAL : isSelected ? RED : DIM
                      }}
                      className="w-full p-4 text-left font-black uppercase text-xs tracking-tighter flex items-center justify-between transition-all hover:border-[#4a9eff] cursor-pointer">
                      <span>{opt}</span>
                      {revealed && isCorrect && <CheckCircle size={16} />}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}

/* ────────────────────────── COVER LETTER MODAL ────────────────────────── */
function CoverLetterModal({ data, onClose }) {
  const [text, setText]   = useState('');
  const [loading, setL]   = useState(true);

  useEffect(() => {
    setL(true);
    generateCoverLetter({
      role: data.role, matchedSkills: data.skills.match,
      missingSkills: data.skills.missing, score: data.score
    }).then(t => { setText(t); setL(false); });
  }, []);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(12px)' }}>
      <Card style={{ border: `3px solid ${TEAL}`, boxShadow: `10px 10px 0 ${TEAL}`, width: '100%', maxWidth: 600 }}>
        <div style={{ borderBottom: `2px solid ${BORDER}` }} className="flex items-center justify-between px-6 py-4">
          <div>
            <div style={{ color: TEAL }} className="font-black italic uppercase tracking-tighter text-lg">AI Cover Letter</div>
            <div style={{ color: MUTED }} className="text-[9px] font-black uppercase tracking-[0.4em]">Powered by llama3-8b-8192</div>
          </div>
          <button onClick={onClose} style={{ background: RED }} className="w-9 h-9 flex items-center justify-center border-2 border-black"><X size={16} className="text-white" /></button>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center py-16 gap-4">
              <Sparkles size={44} style={{ color: TEAL }} className="animate-pulse" />
              <div style={{ color: MUTED }} className="font-black italic uppercase text-sm tracking-widest animate-pulse">Drafting with Llama 3...</div>
            </div>
          ) : (
            <>
              <div style={{ background: BG, border: `2px solid ${BORDER}` }} className="p-5 h-64 overflow-y-auto text-sm font-bold leading-relaxed" style2={{ color: DIM }}>
                {text.split('\n').map((line, i) => <p key={i} style={{ color: DIM }} className="mb-2">{line}</p>)}
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => navigator.clipboard.writeText(text)}
                  style={{ background: BLUE, border: `2px solid black`, boxShadow: `4px 4px 0 black` }}
                  className="flex-1 py-3 text-white font-black italic uppercase text-xs flex items-center justify-center gap-2 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                  <Copy size={14} /> Copy
                </button>
                <button onClick={onClose}
                  style={{ background: CARD, border: `2px solid ${BORDER}` }}
                  className="flex-1 py-3 font-black italic uppercase text-xs flex items-center justify-center gap-2 text-white">
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}

/* ────────────────────────── PIVOT MODAL ────────────────────────── */
function PivotModal({ role, currentSkills, onClose }) {
  const [plan, setPlan] = useState(null);
  const [loading, setL] = useState(true);
  useEffect(() => { generateCareerPivotPlan(role, currentSkills).then(p => { setPlan(p); setL(false); }); }, [role]);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(12px)' }}>
      <Card style={{ border: `3px solid ${YELLOW}`, boxShadow: `10px 10px 0 ${YELLOW}`, width: '100%', maxWidth: 560 }}>
        <div style={{ borderBottom: `2px solid ${BORDER}` }} className="flex items-center justify-between px-6 py-4">
          <div style={{ color: YELLOW }} className="font-black italic uppercase tracking-tighter text-lg">{role} — Pivot Plan</div>
          <button onClick={onClose} style={{ background: RED }} className="w-9 h-9 flex items-center justify-center border-2 border-black"><X size={16} className="text-white" /></button>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center py-16 gap-4">
              <TrendingUp size={44} style={{ color: YELLOW }} className="animate-bounce" />
              <p style={{ color: MUTED }} className="font-black italic uppercase text-sm tracking-widest animate-pulse">Strategizing...</p>
            </div>
          ) : (
            <div className="space-y-5">
              <p className="text-white font-black italic uppercase text-base leading-snug tracking-tight">{plan?.summary}</p>
              <div className="grid grid-cols-2 gap-4">
                <div style={{ background: BG, border: `2px solid ${BORDER}` }} className="p-4">
                  <div style={{ color: YELLOW }} className="text-[9px] font-black uppercase tracking-widest mb-3">Key Skills</div>
                  {plan?.keySkills?.map(s => <div key={s} style={{ color: DIM }} className="flex items-center gap-1.5 text-xs font-bold mb-1.5"><ChevronRight size={11} style={{ color: YELLOW }} />{s}</div>)}
                </div>
                <div style={{ background: BG, border: `2px solid ${BORDER}` }} className="p-4 space-y-4">
                  <div>
                    <div style={{ color: YELLOW }} className="text-[9px] font-black uppercase tracking-widest mb-1">Timeline</div>
                    <div className="text-white text-3xl font-black italic">{plan?.timeline}</div>
                  </div>
                  <div>
                    <div style={{ color: TEAL }} className="text-[9px] font-black uppercase tracking-widest mb-1">First Step</div>
                    <div style={{ color: DIM }} className="text-xs font-bold leading-relaxed">{plan?.firstStep}</div>
                  </div>
                </div>
              </div>
              <button onClick={onClose} style={{ background: YELLOW, border: `2px solid black`, boxShadow: `4px 4px 0 black` }} className="w-full py-4 text-black font-black italic uppercase hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">Got It — Close</button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

/* ────────────────────────── GROWTH CARD ────────────────────────── */
function GrowthCard({ skill, role, onQuiz }) {
  const [plan, setPlan]     = useState(null);
  const [loading, setL]     = useState(false);
  const [expanded, setExp]  = useState(false);

  const loadPlan = async () => {
    if (plan) { setExp(e => !e); return; }
    setL(true);
    const p = await generateGrowthPlan(skill, role);
    setPlan(p); setL(false); setExp(true);
  };

  return (
    <div style={{ background: BG, border: `2px solid ${BORDER}` }} className="transition-colors hover:border-[#4a9eff44]">
      {/* Header row */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div>
          <div className="text-white font-black italic uppercase tracking-tighter">{skill}</div>
          <span style={{ background: YELLOW }} className="text-black px-2 py-0.5 text-[7px] font-black uppercase inline-block mt-1">General Learning</span>
        </div>
        <button onClick={loadPlan} style={{ color: MUTED }} className="shrink-0 hover:text-white transition-colors">
          {loading ? <Loader2 size={15} className="animate-spin" /> : <ChevronRight size={15} className={`transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`} />}
        </button>
      </div>

      {/* Expanded Plan */}
      {expanded && plan && (
        <div style={{ borderTop: `1px solid ${BORDER}` }} className="px-4 py-3 space-y-2">
          <p style={{ color: DIM }} className="text-[10px] font-bold uppercase tracking-wider">{plan.description}</p>
          {plan.steps?.map((s, i) => (
            <div key={i} style={{ color: DIM }} className="flex gap-2 text-[10px] font-bold">
              <span style={{ color: BLUE }} className="shrink-0 font-black">{i + 1}.</span>{s}
            </div>
          ))}
          <div className="flex gap-2 flex-wrap pt-1">
            {plan.resources?.map(r => (
              <a key={r.title} href={r.url} target="_blank" rel="noreferrer"
                style={{ background: CARD, color: TEAL, border: `1px solid ${TEAL}44` }}
                className="flex items-center gap-1 px-2 py-1 text-[8px] font-black uppercase tracking-widest hover:opacity-80">
                <BookOpen size={8} />{r.title}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ borderTop: `2px solid ${BORDER}` }} className="flex">
        <button onClick={() => onQuiz(skill)}
          style={{ background: BLUE, borderRight: `2px solid ${BORDER}` }}
          className="flex-1 py-2.5 text-white font-black italic uppercase text-[8px] tracking-widest flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity">
          <PlayCircle size={11} /> START AI QUIZ
        </button>
        <button onClick={loadPlan} style={{ background: 'white' }}
          className="flex-1 py-2.5 text-black font-black italic uppercase text-[8px] tracking-widest flex items-center justify-center gap-1.5 hover:bg-slate-100 transition-colors">
          <BookOpen size={11} />{expanded ? 'HIDE PLAN' : 'VIEW COURSE'}
        </button>
      </div>
    </div>
  );
}

/* ────────────────────────── DEFAULT DATA ────────────────────────── */
const DEMO = {
  id: 'demo', score: 38.59, ats_score: 75, rank: 100.0, role: 'Software Engineer',
  summary: 'YOUR RESUME SHOWS A 38.59% MATCH FOR THIS ROLE. STRENGTHS IN POSTMAN, DATA STRUCTURES, GITHUB. IMPROVE JENKINS, NODE.JS, KUBERNETES.',
  skills: {
    match:   ['POSTMAN', 'DATA STRUCTURES', 'GITHUB', 'GIT', 'SQL', 'JAVASCRIPT', 'ALGORITHMS', 'JAVA'],
    missing: ['JENKINS', 'NODE.JS', 'KUBERNETES', 'LINUX', 'MAVEN', 'ECLIPSE', 'SPRING BOOT', 'DOCKER', 'JIRA']
  },
  pivots: ['DATA SCIENTIST', 'SOFTWARE ENGINEER', 'BUSINESS ANALYST', 'DEVOPS ENGINEER', 'CLOUD ARCHITECT']
};

/* ────────────────────────── MAIN PAGE ────────────────────────── */
export default function AnalysisResult() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [data, setData]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [quizSkill, setQuizSkill] = useState(null);
  const [pivotRole, setPivotRole] = useState(null);
  const [showCover, setShowCover] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('last_analysis');
      if (saved) {
        const p = JSON.parse(saved);
        setData({ ...DEMO, ...p, pivots: DEMO.pivots });
      } else { setData(DEMO); }
    } catch { setData(DEMO); }
    setLoading(false);
  }, [id]);

  /* ── Radar data: shows YOUR SKILLS vs MISSING SKILLS side by side ── */
  const buildRadarData = useCallback((d) => {
    if (!d) return [];
    // Show top-8 matched + top-8 missing as a unified radar
    const all = [
      ...d.skills.match.slice(0, 8).map(s  => ({ trait: s, YOU: 80 + Math.floor(Math.random() * 15), REQ: 90 })),
      ...d.skills.missing.slice(0, 8).map(s => ({ trait: s, YOU: 10 + Math.floor(Math.random() * 20), REQ: 90 }))
    ];
    return all;
  }, []);

  // Stable radar data (only computed once per data load)
  const [radarData, setRadarData] = useState([]);
  useEffect(() => { if (data) setRadarData(buildRadarData(data)); }, [data]);

  if (loading || !data) return (
    <div style={{ background: BG }} className="fixed inset-0 flex flex-col items-center justify-center gap-6">
      <Activity size={56} style={{ color: BLUE }} className="animate-pulse" />
      <p style={{ color: TEAL }} className="font-black italic uppercase text-2xl tracking-widest animate-pulse">SYNCHRONIZING ANALYSIS...</p>
    </div>
  );

  return (
    <div style={{ background: BG, minHeight: '100vh', fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* ── Modals ── */}
      {quizSkill && <QuizModal  skill={quizSkill}  role={data.role} onClose={() => setQuizSkill(null)} />}
      {pivotRole && <PivotModal role={pivotRole}   currentSkills={data.skills.match} onClose={() => setPivotRole(null)} />}
      {showCover && <CoverLetterModal data={data} onClose={() => setShowCover(false)} />}

      <div style={{ maxWidth: 1600 }} className="mx-auto p-4 grid grid-cols-12 gap-4">

        {/* ══════════════ COL 1: INPUT DATA (3) ══════════════ */}
        <div className="col-span-12 lg:col-span-3">
          <Card>
            <CardHeader icon={<FileText size={17} />} label="Input Data" />
            <div className="p-5 space-y-5">

              {/* Upload Zone */}
              <div style={{ border: `3px dashed ${TEAL}66`, background: BG }} className="p-8 flex flex-col items-center justify-center relative">
                <button onClick={() => { localStorage.removeItem('last_analysis'); navigate('/dashboard'); }} style={{ background: RED, boxShadow: `3px 3px 0 black` }} className="absolute -top-3.5 -right-3.5 w-8 h-8 flex items-center justify-center border-2 border-black z-10 hover:scale-110 transition-transform">
                  <X size={14} className="text-white" />
                </button>
                <FileText size={44} style={{ color: TEAL }} className="mb-3" />
                <span style={{ color: TEAL }} className="text-[10px] font-black tracking-widest uppercase break-all text-center">{data.filename || 'RESUME_ANALYSIS.PDF'}</span>
              </div>

              {/* JD */}
              <div>
                <div style={{ color: MUTED }} className="text-[8px] font-black uppercase tracking-[0.4em] mb-2">Job Description</div>
                <div style={{ background: BG, border: `2px solid ${BORDER}`, color: DIM, maxHeight: 120, overflowY: 'auto' }} className="p-3 text-xs font-bold leading-relaxed whitespace-pre-wrap">
                  {data.job_description || data.role}
                </div>
              </div>

              {/* Button */}
              <button onClick={() => navigate('/dashboard')}
                style={{ background: BLUE, boxShadow: `4px 4px 0 black`, border: `2px solid black` }}
                className="w-full py-4 text-white font-black italic uppercase tracking-tighter flex items-center justify-center gap-3 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all text-base">
                RUN ANALYSIS <ArrowRight size={20} />
              </button>

              {/* Reset Button */}
              <button
                onClick={() => {
                  localStorage.removeItem('last_analysis');
                  navigate('/dashboard');
                }}
                style={{ border: `2px solid ${BORDER}`, color: RED }}
                className="w-full py-3 bg-transparent font-black italic uppercase tracking-tighter flex items-center justify-center gap-3 hover:bg-[#e5393518] transition-all text-sm">
                <RotateCcw size={16} /> RESET ENTRIES
              </button>
            </div>
          </Card>
        </div>


        {/* ══════════════ COL 2: CENTER (6) ══════════════ */}
        <div className="col-span-12 lg:col-span-6 space-y-4">

          {/* Score Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Match Score */}
            <Card>
              <div style={{ height: 4, background: TEAL }} />
              <div className="flex flex-col items-center p-6">
                <div style={{ color: MUTED }} className="text-[8px] font-black uppercase tracking-[0.4em] mb-4">Match Score</div>
                <div style={{ color: TEAL }} className="text-[72px] font-black italic leading-none mb-5">{data.score}<span className="text-3xl">%</span></div>
                <div style={{ background: YELLOW, border: `2px solid black`, boxShadow: `3px 3px 0 black` }} className="flex items-center gap-2 px-4 py-1.5 -rotate-2 text-[10px] font-black italic uppercase text-black">
                  <Star size={10} className="fill-black" /> RANK&nbsp;<span className="text-sm">TOP {data.rank}%</span>
                </div>
              </div>
            </Card>

            {/* ATS Friendly */}
            <Card>
              <div style={{ height: 4, background: BLUE }} />
              <div className="flex flex-col items-center p-6">
                <div style={{ color: MUTED }} className="text-[8px] font-black uppercase tracking-[0.4em] mb-4">ATS Friendly</div>
                <div style={{ color: BLUE }} className="text-[72px] font-black italic leading-none mb-5">{data.ats_score}<span className="text-3xl">%</span></div>
                <div style={{ background: BG, border: `2px solid ${BORDER}`, boxShadow: `3px 3px 0 black` }} className="flex items-center gap-2 px-5 py-2">
                  <FileText size={14} style={{ color: BLUE }} />
                  <span style={{ color: BLUE }} className="font-black tracking-wider text-[10px]">GRADE A+</span>
                </div>
              </div>
            </Card>
          </div>

          {/* AI Intelligence + Cover Letter */}
          <Card style={{ borderLeft: `6px solid ${BLUE}` }}>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Zap size={22} style={{ color: YELLOW, fill: YELLOW }} />
                <span className="font-black italic uppercase text-lg tracking-tighter">AI Executive Intelligence</span>
              </div>
              <p className="font-black italic text-base leading-relaxed text-white uppercase tracking-tighter mb-6">{data.summary}</p>
              <button onClick={() => setShowCover(true)}
                style={{ background: 'white', border: `2px solid black`, boxShadow: `4px 4px 0 black` }}
                className="flex items-center gap-2 px-6 py-3 text-black font-black italic uppercase text-xs tracking-wider hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                <Sparkles size={15} style={{ color: BLUE }} /> GENERATE COVER LETTER
              </button>
            </div>
          </Card>

          {/* Skills Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <div style={{ height: 4, background: TEAL }} />
              <div className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle size={17} style={{ color: TEAL }} />
                  <span className="font-black italic uppercase tracking-tighter">Validated Skills</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.skills.match.map(s => (
                    <span key={s} style={{ background: `${TEAL}18`, color: TEAL, border: `2px solid ${TEAL}` }}
                      className="px-3 py-1 font-black uppercase text-[8px] tracking-widest">{s}</span>
                  ))}
                </div>
              </div>
            </Card>
            <Card>
              <div style={{ height: 4, background: RED }} />
              <div className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <X size={17} style={{ color: RED }} />
                  <span className="font-black italic uppercase tracking-tighter">Missing Gaps</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.skills.missing.map(s => (
                    <span key={s} style={{ background: `${RED}18`, color: RED, border: `2px solid ${RED}` }}
                      className="px-3 py-1 font-black uppercase text-[8px] tracking-widest">{s}</span>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* ══════════════ COL 3: RIGHT PANEL (3) ══════════════ */}
        <div className="col-span-12 lg:col-span-3 space-y-4">

          {/* Radar Chart — YOUR SKILLS vs MISSING SKILLS */}
          <Card>
            <CardHeader icon={<Activity size={17} />} label="Skill Alignment Radar" />
            <div className="p-4">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke={BORDER} />
                    <PolarAngleAxis dataKey="trait" tick={{ fill: MUTED, fontSize: 8, fontWeight: 700 }} />
                    <Tooltip
                      contentStyle={{ background: CARD, border: `2px solid ${BORDER}`, fontSize: 10, fontWeight: 900, textTransform: 'uppercase', color: 'white' }}
                      formatter={(v, name) => [v, name === 'YOU' ? 'Your Skills' : 'Job Requirement']}
                    />
                    <Radar name="YOU" dataKey="YOU" stroke={TEAL} fill={TEAL} fillOpacity={0.45} strokeWidth={3} dot={{ fill: TEAL, r: 2 }} />
                    <Radar name="REQ" dataKey="REQ" stroke={BLUE} fill={BLUE} fillOpacity={0.12} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between text-[8px] font-black uppercase tracking-widest mt-2 px-2">
                <span style={{ color: TEAL }} className="flex items-center gap-1.5">
                  <span style={{ width: 14, height: 3, background: TEAL, display: 'inline-block' }} /> YOUR SKILLS
                </span>
                <span style={{ color: BLUE }} className="flex items-center gap-1.5">
                  JOB REQ <span style={{ width: 14, height: 3, background: BLUE, display: 'inline-block' }} />
                </span>
              </div>
            </div>
          </Card>

          {/* Growth Blueprint */}
          <Card>
            <CardHeader icon={<GraduationCap size={17} />} label="Growth Blueprint" accentColor={BLUE} />
            <div className="p-3 space-y-3 max-h-[420px] overflow-y-auto">
              {data.skills.missing.slice(0, 4).map(skill => (
                <GrowthCard key={skill} skill={skill} role={data.role} onQuiz={setQuizSkill} />
              ))}
            </div>
          </Card>

          {/* Career Pivots */}
          <Card>
            <CardHeader icon={<BarChart2 size={17} />} label="Recommended Career Pivots" accentColor={YELLOW} />
            <div className="p-4 flex flex-wrap gap-3">
              {data.pivots.map(role => (
                <button key={role} onClick={() => setPivotRole(role)}
                  style={{ background: `${YELLOW}15`, color: YELLOW, border: `2px solid ${YELLOW}`, boxShadow: `2px 2px 0 ${YELLOW}` }}
                  className="px-4 py-2.5 font-black uppercase text-[8px] tracking-widest hover:bg-[#fbbf24] hover:text-black hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
                  {role}
                </button>
              ))}
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}
