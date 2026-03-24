import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Zap, LayoutDashboard, Rocket, BookOpen, LogIn, LogOut, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const BG     = '#0d1421';
const BORDER = '#1e3050';
const TEAL   = '#00d9b5';
const BLUE   = '#4a9eff';

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <nav style={{ background: BG, borderBottom: `2px solid ${BORDER}` }} className="sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo / Brand */}
        <button onClick={() => navigate('/')} className="flex items-center gap-2 group">
          <div style={{ background: BLUE, border: `2px solid black`, boxShadow: `3px 3px 0 black` }} 
            className="w-10 h-10 flex flex-col items-center justify-center group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-none transition-all">
            <Zap size={22} color="black" fill="black" />
          </div>
          <span className="text-2xl font-black italic tracking-tighter uppercase text-white ml-2">
            HireSense <span style={{ color: BLUE }}>AI</span>
          </span>
        </button>

        {/* Center Links */}
        <div className="hidden md:flex gap-10">
          <NavLink to="/" end className={({ isActive }) => `flex items-center gap-2 font-black uppercase text-sm tracking-widest hover:text-[#4a9eff] transition-colors ${isActive ? "text-[#4a9eff]" : "text-[#4a6080]"}`}>
             <Rocket size={16} /> Home
          </NavLink>
          
          <NavLink to="/dashboard" className={({ isActive }) => `flex items-center gap-2 font-black uppercase text-sm tracking-widest hover:text-[#4a9eff] transition-colors ${isActive ? "text-[#4a9eff]" : "text-[#4a6080]"}`}>
             <LayoutDashboard size={16} /> Dashboard
          </NavLink>
          
          {user?.role === 'admin' && (
            <NavLink to="/admin" className={({ isActive }) => `flex items-center gap-2 font-black uppercase text-sm tracking-widest transition-colors ${isActive ? "text-[#00d9b5]" : "text-[#b24a4a]"}`}>
               <ShieldAlert size={16} /> Admin Matrix
            </NavLink>
          )}
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
               <div className="hidden sm:block text-right">
                  <div className="text-white text-xs font-black italic uppercase tracking-widest">{user.name}</div>
                  <div style={{ color: user.role === 'admin' ? TEAL : BLUE }} className="text-[9px] font-black uppercase tracking-[0.2em]">{user.role} // Authorized</div>
               </div>
               <button onClick={logout}
                  style={{ border: `2px solid ${BORDER}`, color: '#4a6080' }}
                  className="flex items-center gap-2 px-5 py-2 font-black uppercase italic text-[11px] tracking-widest hover:text-white hover:bg-[#1e3050] transition-colors">
                  <LogOut size={14} /> Exit
               </button>
            </div>
          ) : (
            <button onClick={() => navigate('/login')}
              style={{ border: `2px solid ${BLUE}`, color: BLUE }}
              className="hidden sm:flex items-center gap-2 px-6 py-2.5 font-black uppercase italic text-[11px] tracking-widest hover:bg-[#4a9eff15] transition-colors">
              <LogIn size={14} /> Sign In
            </button>
          )}
        </div>
        
      </div>
    </nav>
  );
}
