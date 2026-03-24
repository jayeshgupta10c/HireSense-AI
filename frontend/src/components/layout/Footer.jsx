import React from 'react';
import { Zap } from 'lucide-react';

const BG     = '#0d1421';
const BORDER = '#1e3050';
const TEAL   = '#00d9b5';
const BLUE   = '#4a9eff';

export default function Footer() {
  return (
    <footer style={{ background: BG, borderTop: `2px solid ${BORDER}` }} className="py-12 mt-auto">
      <div className="max-w-[1600px] mx-auto px-6 flex flex-col items-center justify-center text-center">
        
        <div style={{ background: TEAL, border: `2px solid black`, boxShadow: `3px 3px 0 black` }} 
          className="w-12 h-12 flex items-center justify-center mb-6">
          <Zap size={24} color="black" fill="black" />
        </div>

        <h2 className="text-2xl font-black italic tracking-tighter uppercase text-white mb-2">
          HireSense <span style={{ color: TEAL }}>AI</span>
        </h2>
        
        <p style={{ color: '#4a6080' }} className="text-xs font-black uppercase tracking-widest mb-8">
          The ML-Powered Resume Intelligence Platform
        </p>

        <div className="flex gap-6 mb-8">
          {['Analytics', 'Security', 'Enterprise', 'API Docs'].map(link => (
            <a key={link} href="#" style={{ color: '#4a6080' }} className="text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">
              {link}
            </a>
          ))}
        </div>

        <div style={{ borderTop: `1px solid ${BORDER}` }} className="w-full max-w-md pt-8">
          <p className="text-white font-black italic uppercase tracking-tighter flex items-center justify-center gap-2">
            Built with ⚡ by <span style={{ color: BLUE, borderBottom: `2px solid ${BLUE}` }}>HireSharks</span>
          </p>
          <div style={{ color: '#4a6080' }} className="text-[9px] font-bold tracking-[0.3em] uppercase mt-3">
            © {new Date().getFullYear()} HireSharks Technologies. All Rights Reserved.
          </div>
        </div>

      </div>
    </footer>
  );
}
