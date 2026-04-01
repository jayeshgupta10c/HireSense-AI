import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Activity, LogOut, User, LayoutDashboard } from 'lucide-react'

export default function Header() {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const location = useLocation();
  const navigate = useNavigate();

  const isLanding = location.pathname === '/';

  const scrollToHowItWorks = () => {
    if (!isLanding) {
      navigate('/#how-it-works');
    } else {
      document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 premium-glass border-b border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 font-black text-2xl italic tracking-tighter group transition-all">
          <div className="h-10 w-10 bg-brand-primary rounded-lg flex items-center justify-center border border-white/20 shadow-neon group-hover:scale-110 transition-transform">
            <Activity size={22} className="text-white" />
          </div>
          <span className="glow-text uppercase">HireSense <span className="text-brand-primary">AI</span></span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <button 
            onClick={scrollToHowItWorks}
            className="text-sm font-bold uppercase tracking-widest text-navy-300 hover:text-brand-primary transition-colors"
          >
            How it works
          </button>
          
          {user ? (
            <div className="flex items-center gap-6">
              <Link to="/analyze" className="text-sm font-bold uppercase tracking-widest text-navy-300 hover:text-brand-primary transition-colors flex items-center gap-2">
                 Analyze
              </Link>
              <Link to="/dashboard" className="text-sm font-bold uppercase tracking-widest text-brand-primary hover:text-white transition-colors flex items-center gap-2">
                 Dashboard
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="text-sm font-bold uppercase tracking-widest text-brand-yellow hover:text-white transition-colors">
                  Admin
                </Link>
              )}
              <button 
                onClick={handleLogout}
                className="p-2 bg-white/5 border border-white/10 rounded-full text-brand-red hover:bg-brand-red hover:text-white transition-all shadow-lg"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-bold uppercase tracking-widest text-white hover:text-brand-primary transition-colors">
                Login
              </Link>
              <Link to="/signup" className="px-6 py-2 bg-brand-primary rounded-full text-sm font-black uppercase tracking-widest hover:shadow-neon transition-all">
                Join Now
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
