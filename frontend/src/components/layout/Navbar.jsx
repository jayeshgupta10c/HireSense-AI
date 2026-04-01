import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Zap, LayoutDashboard, Rocket, LogIn, LogOut, ShieldAlert, Activity, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const isLanding = location.pathname === '/';

  const scrollToHowItWorks = () => {
    if (!isLanding) {
      navigate('/#how-it-works');
    } else {
      document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] premium-glass border-b border-white/5 transition-all duration-500">
      <div className="max-w-[1600px] mx-auto px-8 h-24 flex items-center justify-between">
        
        {/* Brand */}
        <button onClick={() => navigate('/')} className="flex items-center gap-4 group">
          <div className="relative">
            <div className="absolute inset-0 bg-brand-primary blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative h-12 w-12 bg-navy-950 border-2 border-brand-primary rounded-2xl flex items-center justify-center shadow-neon group-hover:scale-110 transition-transform duration-300">
              <Zap size={24} className="text-brand-primary fill-brand-primary/20" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black italic tracking-tighter uppercase text-white leading-none group-hover:glow-text transition-all">
              HireSense <span className="text-brand-primary">AI</span>
            </span>
            <span className="text-[8px] font-black uppercase tracking-[0.4em] text-navy-500 mt-1 italic">Premium Node v2.0</span>
          </div>
        </button>

        {/* Navigation Matrix */}
        <div className="hidden lg:flex items-center gap-1">
          <NavLink to="/" end className={({ isActive }) => `px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-white flex items-center gap-2 group ${isActive ? "text-brand-primary bg-brand-primary/10 border border-brand-primary/20 shadow-neon-sm" : "text-navy-400 hover:bg-white/5"}`}>
             <Rocket size={12} className="group-hover:animate-bounce-short" /> Home
          </NavLink>
          
          <button 
            onClick={scrollToHowItWorks}
            className="px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all text-navy-400 hover:text-white hover:bg-white/5 flex items-center gap-2"
          >
            <Sparkles size={12} className="text-brand-yellow" /> How it Works
          </button>

          {user && (
            <NavLink to="/dashboard" className={({ isActive }) => `px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-white flex items-center gap-2 ${isActive ? "text-brand-primary bg-brand-primary/10 border border-brand-primary/20 shadow-neon-sm" : "text-navy-400 hover:bg-white/5"}`}>
               <LayoutDashboard size={12} /> Dashboard
            </NavLink>
          )}
          
          {user?.role === 'admin' && (
            <NavLink to="/admin" className={({ isActive }) => `px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all border flex items-center gap-2 ${isActive ? "bg-brand-red text-white border-brand-red shadow-neon-red" : "text-brand-red border-brand-red/30 hover:bg-brand-red/10"}`}>
               <ShieldAlert size={12} /> Admin Matrix
            </NavLink>
          )}
        </div>

        {/* User / Auth Operations */}
        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-6 pl-6 border-l border-white/5">
               <div className="hidden sm:flex flex-col items-end">
                  <div className="text-white text-[10px] font-black italic uppercase tracking-widest leading-none">{user.name}</div>
                  <div className={`text-[8px] font-black uppercase tracking-widest mt-1 ${user.role === 'admin' ? 'text-brand-red animate-pulse' : 'text-brand-primary'}`}>
                    {user.role} <span className="opacity-30 self-center mx-1">//</span> Authorized
                  </div>
               </div>
               <button onClick={logout}
                  className="group relative p-3 bg-navy-950 border border-white/10 rounded-2xl text-navy-400 hover:text-brand-red hover:border-brand-red transition-all shadow-xl">
                  <LogOut size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-brand-primary rounded-full animate-ping opacity-50" />
               </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">

              <button onClick={() => navigate('/login')}
                className="brutal-btn-primary px-8 py-3 rounded-2xl text-[10px] shadow-neon">
                Establish Link <Zap size={12} className="ml-2 group-hover:animate-pulse" />
              </button>
            </div>
          )}
        </div>
        
      </div>
    </nav>
  );
}
