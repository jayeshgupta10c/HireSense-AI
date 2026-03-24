import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Zap, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const BG     = '#0d1421';
const CARD   = '#111c2d';
const BORDER = '#1e3050';
const TEAL   = '#00d9b5';
const BLUE   = '#4a9eff';
const RED    = '#e53935';

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
        // Login Request requires OAuth2 x-www-form-urlencoded
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
      } else {
        // Signup
        await api.post('/auth/signup', {
          email,
          password,
          full_name: fullName,
          role: 'user' // Default to user
        });
        
        // Auto login after signup
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);
        const res = await api.post('/auth/login', formData);
        login(
          { email: res.data.email, role: res.data.role, name: res.data.full_name }, 
          res.data.access_token
        );
      }
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.detail || "Authentication Failed. Server might be offline.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: BG, minHeight: 'calc(100vh - 80px)', fontFamily: "'Inter', system-ui, sans-serif" }} className="flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md relative">
        
        {/* Decorative elements */}
        <div style={{ background: BLUE, border: `2px solid black`, boxShadow: `4px 4px 0 black` }} 
          className="absolute -top-6 -left-6 w-12 h-12 flex items-center justify-center z-10 -rotate-6">
          <Zap size={24} style={{ fill: 'black', color: 'black' }} />
        </div>

        <div style={{ background: CARD, border: `2px solid ${BORDER}`, boxShadow: `8px 8px 0 ${TEAL}` }} className="p-8 relative z-0">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white mb-2">
            {isLogin ? 'Initialize' : 'Register'} <span style={{ color: TEAL }}>Identity</span>
          </h1>
          <p style={{ color: '#4a6080' }} className="text-xs font-bold tracking-[0.2em] uppercase mb-8">
            {isLogin ? 'Provide clearance credentials to enter the system.' : 'Create a new dossier in the matrix.'}
          </p>

          {error && (
             <div style={{ background: `${RED}15`, border: `2px solid ${RED}`, color: RED }} className="p-3 mb-6 font-black italic uppercase text-xs tracking-widest text-center">
               ⚠ {error}
             </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <label style={{ color: TEAL }} className="block text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <User size={12} /> Legal Alias
                </label>
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                  style={{ background: BG, border: `2px solid ${BORDER}`, color: 'white' }}
                  className="w-full p-3 font-bold text-sm outline-none focus:border-[#00d9b5] transition-colors"
                  placeholder="JOHN DOE" />
              </div>
            )}
            
            <div className="space-y-2">
              <label style={{ color: TEAL }} className="block text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <Mail size={12} /> Comms Vector (Email)
              </label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                style={{ background: BG, border: `2px solid ${BORDER}`, color: 'white' }}
                className="w-full p-3 font-bold text-sm outline-none focus:border-[#00d9b5] transition-colors"
                placeholder="OPERATIVE@NETWORK.COM" />
            </div>

            <div className="space-y-2">
              <label style={{ color: TEAL }} className="block text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <Lock size={12} /> Security Key
              </label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                style={{ background: BG, border: `2px solid ${BORDER}`, color: 'white' }}
                className="w-full p-3 font-bold text-sm outline-none focus:border-[#00d9b5] transition-colors"
                placeholder="••••••••••••" />
            </div>

            <button type="submit" disabled={loading}
              style={{ background: BLUE, border: `2px solid black`, boxShadow: `4px 4px 0 black`, color: 'black' }}
              className="w-full py-4 mt-8 font-black italic uppercase tracking-tighter text-lg flex items-center justify-center gap-2 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-70 disabled:transform-none">
              {loading ? <Loader2 className="animate-spin" /> : <>{isLogin ? 'AUTHENTICATE' : 'ESTABLISH LINK'} <ArrowRight size={20} /></>}
            </button>
          </form>

          <div className="mt-8 text-center" style={{ borderTop: `1px solid ${BORDER}`, paddingTop: '1.5rem' }}>
             <button type="button" onClick={() => { setIsLogin(!isLogin); setError(''); }}
                style={{ color: '#4a6080' }} className="text-xs font-black uppercase tracking-[0.2em] hover:text-white transition-colors">
                {isLogin ? 'NO DOSSIER? REGISTER HERE.' : 'ALREADY HAVE CLEARANCE? LOGIN.'}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
