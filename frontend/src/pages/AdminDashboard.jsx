import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import api from '../services/api';
import { CheckCircle, XCircle, ShieldAlert, Cpu, Users, FileText, Swords, Search, Zap, Loader2, Target } from 'lucide-react';

const BG     = '#0d1421';
const CARD   = '#111c2d';
const BORDER = '#1e3050';
const TEAL   = '#00d9b5';
const BLUE   = '#4a9eff';
const YELLOW = '#fbbf24';
const RED    = '#e53935';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  
  const [activeTab, setActiveTab] = useState('compare'); // 'users', 'resumes', 'compare'
  const [users, setUsers] = useState([]);
  const [resumes, setResumes] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [compareIds, setCompareIds] = useState([]);
  const [compareJd, setCompareJd] = useState('');
  const [compareResult, setCompareResult] = useState(null);
  const [compareLoad, setCompareLoad] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [uRes, rRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/resumes')
      ]);
      setUsers(uRes.data);
      setResumes(rRes.data);
    } catch (err) {
      console.error(err);
      setError("Failed to synchronize with matrix.");
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = async () => {
    if (compareIds.length < 2) return setError("Select at least 2 resumes to compare.");
    if (!compareJd.trim()) return setError("Target Job Description is required.");
    
    setCompareLoad(true);
    setError(null);
    try {
      const res = await api.post('/admin/compare-resumes', {
        resume_ids: compareIds,
        job_description: compareJd
      });
      setCompareResult(res.data);
      setActiveTab('compare_result');
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.detail || "ML Engine failure during comparison.");
    } finally {
      setCompareLoad(false);
    }
  };

  const toggleCompareId = (id) => {
    setCompareIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  if (authLoading) return <div style={{ background: BG }} className="min-h-screen text-white flex items-center justify-center font-black italic text-xl">AUTHORIZING...</div>;
  if (!user || user.role !== 'admin') return <Navigate to="/login" />;

  return (
    <div style={{ background: BG, minHeight: 'calc(100vh - 80px)', fontFamily: "'Inter', system-ui, sans-serif" }} className="p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">

        {/* ─── HEADER ─── */}
        <div style={{ background: CARD, border: `3px solid ${RED}`, boxShadow: `6px 6px 0 ${RED}` }} className="p-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <ShieldAlert size={40} style={{ color: RED }} />
              <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">Admin Matrix</h1>
            </div>
            <p style={{ color: '#4a6080' }} className="font-bold uppercase tracking-[0.3em] text-xs">Full clearance level: System Oversight & ML Benchmarks</p>
          </div>
          
          <div className="flex gap-4">
            <button onClick={() => setActiveTab('users')}
              style={{ background: activeTab === 'users' ? BLUE : 'transparent', color: activeTab === 'users' ? 'black' : BLUE, border: `2px solid ${BLUE}` }}
              className="px-6 py-3 font-black uppercase text-xs tracking-widest flex items-center gap-2 transition-colors">
              <Users size={16} /> Users ({users.length})
            </button>
            <button onClick={() => setActiveTab('resumes')}
              style={{ background: activeTab === 'resumes' ? TEAL : 'transparent', color: activeTab === 'resumes' ? 'black' : TEAL, border: `2px solid ${TEAL}` }}
              className="px-6 py-3 font-black uppercase text-xs tracking-widest flex items-center gap-2 transition-colors">
              <FileText size={16} /> Resumes ({resumes.length})
            </button>
            <button onClick={() => setActiveTab('compare')}
              style={{ background: activeTab === 'compare' || activeTab === 'compare_result' ? YELLOW : 'transparent', color: activeTab === 'compare' || activeTab === 'compare_result' ? 'black' : YELLOW, border: `2px solid ${YELLOW}` }}
              className="px-6 py-3 font-black uppercase text-xs tracking-widest flex items-center gap-2 transition-colors">
              <Swords size={16} /> ML Compare
            </button>
          </div>
        </div>

        {error && (
           <div style={{ background: `${RED}1A`, border: `2px solid ${RED}`, color: RED }} className="p-4 font-black italic uppercase tracking-wider text-sm">
             [SECURITY FAULT]: {error}
           </div>
        )}

        {/* ─── TAB: USERS ─── */}
        {activeTab === 'users' && (
          <div style={{ background: CARD, border: `2px solid ${BORDER}` }}>
            <table className="w-full text-left">
              <thead>
                <tr style={{ background: `${BORDER}66` }} className="text-[#94a3b8] text-[10px] font-black uppercase tracking-widest">
                  <th className="p-4">ID</th>
                  <th className="p-4">Alias</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e3050]">
                {loading ? <tr><td colSpan={5} className="p-8 text-center"><Loader2 className="animate-spin inline text-[#4a9eff]" /></td></tr> : null}
                {users.map(u => (
                  <tr key={u._id} className="text-white hover:bg-[#1e3050] transition-colors">
                    <td className="p-4 font-mono text-xs text-[#4a6080]">{u._id}</td>
                    <td className="p-4 font-bold uppercase">{u.full_name || 'N/A'}</td>
                    <td className="p-4 text-sm font-medium">{u.email}</td>
                    <td className="p-4">
                      <span style={{ color: u.role === 'admin' ? RED : TEAL, background: u.role === 'admin' ? `${RED}22` : `${TEAL}22`, border: `1px solid ${u.role === 'admin' ? RED : TEAL}` }}
                        className="px-2 py-1 text-[9px] font-black uppercase tracking-widest">{u.role}</span>
                    </td>
                    <td className="p-4 text-xs font-mono text-[#4a6080]">{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ─── TAB: RESUMES ─── */}
        {activeTab === 'resumes' && (
          <div style={{ background: CARD, border: `2px solid ${BORDER}` }}>
             <table className="w-full text-left">
              <thead>
                <tr style={{ background: `${BORDER}66` }} className="text-[#94a3b8] text-[10px] font-black uppercase tracking-widest">
                  <th className="p-4">Owner / Email</th>
                  <th className="p-4">Target Role</th>
                  <th className="p-4">Filename</th>
                  <th className="p-4">ML Score</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e3050]">
                {loading ? <tr><td colSpan={5} className="p-8 text-center"><Loader2 className="animate-spin inline text-[#00d9b5]" /></td></tr> : null}
                {resumes.map(r => (
                  <tr key={r._id} className="text-white hover:bg-[#1e3050] transition-colors">
                    <td className="p-4">
                      <div className="font-black uppercase text-sm">{r.name}</div>
                      <div className="text-[10px] text-[#4a6080] tracking-widest uppercase">{r.email}</div>
                    </td>
                    <td className="p-4 font-bold text-sm" style={{ color: BLUE }}>{r.job_description || r.job_role}</td>
                    <td className="p-4 text-xs text-[#94a3b8] break-all max-w-[200px]">{r.filename || 'Unknown'}</td>
                    <td className="p-4">
                      <span style={{ color: TEAL }} className="text-xl font-black italic">{r.match_score}%</span>
                    </td>
                    <td className="p-4 text-xs font-mono text-[#4a6080]">{new Date(r.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ─── TAB: ML COMPARE CONFIG ─── */}
        {activeTab === 'compare' && (
          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
               <div style={{ background: CARD, border: `2px solid ${BORDER}` }} className="p-6">
                  <h2 style={{ color: YELLOW }} className="text-xl font-black italic uppercase tracking-tighter mb-4 flex items-center gap-2"><Cpu size={20} /> ML Selection Matrix</h2>
                  <p className="text-xs font-bold text-[#4a6080] uppercase tracking-widest mb-6 border-b border-[#1e3050] pb-4">Select candidates from the database to battle-test against a custom Job Description.</p>
                  
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2">
                    {resumes.map(r => {
                      const isSelected = compareIds.includes(r._id);
                      return (
                        <div key={r._id} onClick={() => toggleCompareId(r._id)}
                          style={{ border: `2px solid ${isSelected ? YELLOW : BORDER}`, background: isSelected ? `${YELLOW}15` : BG }}
                          className="p-4 cursor-pointer hover:-translate-y-1 transition-transform relative">
                          {isSelected && <div style={{ background: YELLOW }} className="absolute -top-2 -right-2 w-6 h-6 border-2 border-black flex items-center justify-center"><CheckCircle size={12} color="black" /></div>}
                          <div className="font-black text-white text-sm uppercase truncate mb-1">{r.name}</div>
                          <div className="text-[9px] text-[#4a6080] font-mono mb-3 truncate">{r.filename}</div>
                          <div className="flex gap-1 flex-wrap">
                            {r.skills?.match?.slice(0, 3).map(s => (
                              <span key={s} className="bg-[#1e3050] text-[#94a3b8] px-1.5 py-0.5 text-[7px] uppercase tracking-widest">{s}</span>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
               </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
               <div style={{ background: CARD, border: `2px solid ${BORDER}` }} className="p-6">
                  <label style={{ color: YELLOW }} className="text-sm font-black italic uppercase tracking-tighter mb-3 flex items-center gap-2"><Target size={16} /> Target Parameters</label>
                  <textarea rows={6} value={compareJd} onChange={e => setCompareJd(e.target.value)}
                    style={{ background: BG, border: `2px solid ${BORDER}`, color: 'white' }}
                    className="w-full p-4 font-bold text-sm outline-none focus:border-[#fbbf24] transition-colors placeholder:text-[#2a3a50]"
                    placeholder="Enter the Job Description required for this comparison run..."></textarea>
                  
                  <button onClick={handleCompare} disabled={compareLoad || compareIds.length < 2 || !compareJd}
                    style={{ background: YELLOW, border: `2px solid black`, boxShadow: `4px 4px 0 black`, color: 'black' }}
                    className="w-full py-4 mt-6 font-black italic uppercase tracking-tighter text-lg flex items-center justify-center gap-2 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 disabled:transform-none">
                    {compareLoad ? <Loader2 className="animate-spin" /> : <><Swords size={20} /> COMMENCE RANKING</>}
                  </button>
                  <div className="text-center mt-3 text-[10px] uppercase font-bold text-[#4a6080]">
                    {compareIds.length} Vector(s) Locked
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* ─── TAB: ML COMPARE RESULT ─── */}
        {activeTab === 'compare_result' && compareResult && (
          <div className="space-y-6">
             <button onClick={() => setActiveTab('compare')} className="text-white hover:text-[#fbbf24] font-black italic uppercase text-sm tracking-widest flex gap-2 items-center">
                &larr; RE-CALIBRATE
             </button>

             {/* Winner Card */}
             <div style={{ background: YELLOW, border: `3px solid black`, boxShadow: `8px 8px 0 black` }} className="p-8 relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 opacity-10"><Swords size={200} /></div>
                <div className="font-black uppercase tracking-[0.4em] text-[10px] text-black mb-2">Prime Candidate Recommended</div>
                <div className="text-6xl font-black italic uppercase tracking-tighter text-black mb-6">
                  {compareResult.winner.name}
                </div>
                
                <div className="grid md:grid-cols-3 gap-6 relative z-10">
                  <div style={{ background: 'black', border: `2px solid black` }} className="p-4 text-white">
                    <div className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8] mb-1">Vector Alignment</div>
                    <div style={{ color: TEAL }} className="text-4xl font-black italic">{compareResult.winner.score.toFixed(2)}%</div>
                  </div>
                  <div style={{ background: 'black', border: `2px solid black` }} className="p-4 text-white">
                    <div className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8] mb-1">File Artifact</div>
                    <div className="text-sm font-bold uppercase truncate mt-2 leading-relaxed">{compareResult.winner.filename}</div>
                  </div>
                  <div style={{ background: 'black', border: `2px solid black` }} className="p-4 text-white">
                     <div className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8] mb-2">Validated Arsenal</div>
                     <div className="flex gap-1 flex-wrap">
                        {compareResult.winner.matched_skills.slice(0, 4).map(s => (
                          <span key={s} style={{ background: `${TEAL}22`, color: TEAL }} className="px-1.5 py-0.5 text-[8px] font-black tracking-widest uppercase">{s}</span>
                        ))}
                     </div>
                  </div>
                </div>
             </div>

             {/* Leaderboard */}
             <div style={{ background: CARD, border: `2px solid ${BORDER}` }}>
                <div className="p-6 border-b border-[#1e3050] flex items-center gap-3">
                  <Search style={{ color: YELLOW }} size={20} />
                  <span className="text-white font-black italic uppercase tracking-tighter text-xl">Full Target Leaderboard</span>
                </div>
                <table className="w-full text-left">
                  <tbody className="divide-y divide-[#1e3050]">
                    {compareResult.all_candidates.map((c, i) => (
                      <tr key={c.id} className="text-white hover:bg-[#1e3050] transition-colors">
                        <td className="p-6 w-16 text-center">
                          <span className={`text-2xl font-black italic ${i === 0 ? 'text-[#fbbf24]' : 'text-[#4a6080]'}`}>#{i+1}</span>
                        </td>
                        <td className="p-6">
                          <div className="font-black uppercase text-lg mb-1">{c.name}</div>
                          <div className="text-[10px] text-[#4a6080] font-mono">{c.filename}</div>
                        </td>
                        <td className="p-6">
                           <div className="flex gap-2 flex-wrap max-w-sm">
                             {c.matched_skills.slice(0, 5).map(s => (
                               <span key={s} className="bg-[#1e3050] text-[#00d9b5] px-2 py-1 text-[8px] font-black tracking-widest uppercase border border-[#00d9b5]">{s}</span>
                             ))}
                           </div>
                        </td>
                        <td className="p-6 text-right">
                           <div style={{ color: i === 0 ? TEAL : 'white' }} className="text-3xl font-black italic">{c.score.toFixed(1)}%</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        )}

      </div>
    </div>
  );
}
