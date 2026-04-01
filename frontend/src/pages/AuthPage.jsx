import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Zap, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function AuthPage() {
  const [isLogin, setIsLogin]   = useState(true);
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !fullName)) {
      setError("Please fill all fields.");
      return;
    }
    
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);
        
        const res = await api.post('/auth/login', formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        
        login(
          { email: res.data.email, role: res.data.role, name: res.data.full_name }, 
          res.data.access_token
        );
        navigate(res.data.role === 'admin' ? '/admin' : '/dashboard');
      } else {
        await api.post('/auth/signup', {
          email,
          password,
          full_name: fullName,
          role: 'user'
        });
        
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);
        const res = await api.post('/auth/login', formData);
        login(
          { email: res.data.email, role: res.data.role, name: res.data.full_name }, 
          res.data.access_token
        );
        navigate(res.data.role === 'admin' ? '/admin' : '/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.detail || "Authentication Failed. Credentials invalid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24 bg-navy-950 font-sans relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative">
        
        {/* Floaties */}
        <div className="absolute -top-12 -left-12 w-24 h-24 bg-brand-primary/20 border border-brand-primary/30 rounded-3xl -rotate-12 animate-pulse hidden md:flex items-center justify-center">
            <Zap size={32} className="text-brand-primary fill-brand-primary/20" />
        </div>
        <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-brand-accent/20 border border-brand-accent/30 rounded-full animate-bounce hidden md:flex items-center justify-center" style={{ animationDuration: '4s' }}>
            <ShieldCheck size={28} className="text-brand-accent" />
        </div>

        <div className="brutal-card p-1 bg-navy-950 overflow-hidden relative group">
          <div className="p-10 bg-navy-900/50 relative">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest text-navy-400 mb-6">
                 <Sparkles size={10} className="text-brand-yellow" /> Secure Access Node
              </div>
              <h1 className="text-4xl font-black uppercase tracking-tighter text-white italic leading-none mb-3">
                {isLogin ? 'Establish' : 'Register'} <span className="text-brand-primary">Identity</span>
              </h1>
              <p className="text-navy-500 text-[10px] font-black uppercase tracking-widest italic">
                {isLogin ? 'Provide clearance to enter matrix' : 'Initialize a new operator dossier'}
              </p>
            </div>

            {error && (
               <div className="p-4 mb-8 bg-brand-red/10 border border-brand-red/20 rounded-xl text-brand-red font-bold uppercase text-[10px] tracking-wider text-center italic">
                 ⚠ {error}
               </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-primary flex items-center gap-2">
                    <User size={12} /> Full Alias
                  </label>
                  <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                    className="brutal-input w-full py-4 text-xs" required
                    placeholder="E.G. COMMANDER SHEPARD" />
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-primary flex items-center gap-2">
                  <Mail size={12} /> Comms ID (Email)
                </label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="brutal-input w-full py-4 text-xs" required
                  placeholder="OPERATIVE@NETWORK.COM" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-primary flex items-center gap-2">
                  <Lock size={12} /> Security Key
                </label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  className="brutal-input w-full py-4 text-xs" required
                  placeholder="••••••••••••" />
              </div>

              <button type="submit" disabled={loading} className="brutal-btn-primary w-full rounded-2xl py-5 text-lg mt-10">
                {loading ? <Loader2 className="animate-spin" /> : <>{isLogin ? 'AUTHENTICATE' : 'INITIALIZE'} <ArrowRight size={20} /></>}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-navy-800 text-center">
               <button type="button" onClick={() => { setIsLogin(!isLogin); setError(''); }}
                  className="text-[10px] font-black uppercase tracking-widest text-navy-500 hover:text-white transition-colors italic">
                  {isLogin ? "No identity? Establish one here." : "Clearance verified? Return to login."}
               </button>
            </div>
          </div>
        </div>
        
        {/* Footer info */}
        <div className="text-center mt-8 space-y-2 opacity-30 select-none">
            <div className="text-[8px] font-black uppercase tracking-[0.5em] text-navy-600 italic">Encrypted by HireSense Core</div>
            <div className="text-[8px] font-black uppercase tracking-[0.5em] text-navy-600">v2.0.4 Premium Protocol</div>
        </div>
      </div>
    </div>
  );
}
