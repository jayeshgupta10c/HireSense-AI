import React from 'react';
import { X, Copy, Download, Sparkles, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CoverLetterModal({ isOpen, onClose, data }) {
  const content = `Subject: Application for ${data?.role} - [Your Name]

Dear Hiring Team,

I am writing to express my strong interest in the ${data?.role} position. After analyzing my profile against your requirements via HireSense AI, I discovered a ${data?.score}% alignment with your technical vector, particularly in areas like ${data?.skills?.match?.slice(0, 3).join(', ')}.

My background in ${data?.skills?.match?.[0]} and my commitment to mastering ${data?.skills?.missing?.[0]} make me a compelling candidate for this high-precision role. I look forward to discussing how my skills can contribute to your team.

Best regards,
[Your Name]`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-navy-950/90 backdrop-blur-3xl">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="brutal-card max-w-2xl w-full bg-navy-900 border-4 border-brand-primary p-12 relative shadow-[24px_24px_0px_0px_rgba(37,99,235,1)]"
          >
            <button onClick={onClose} className="absolute -top-6 -right-6 w-12 h-12 bg-brand-red border-3 border-black text-white flex items-center justify-center shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
              <X size={24} />
            </button>

            <div className="flex items-center gap-4 mb-10">
               <div className="w-14 h-14 bg-brand-primary border-3 border-black flex items-center justify-center -rotate-3"><Sparkles className="text-white" size={28} /></div>
               <h2 className="text-4xl font-black italic uppercase italic tracking-tighter">Cover Letter <span className="text-brand-primary">Draft</span></h2>
            </div>

            <div className="bg-navy-950 border-3 border-navy-800 p-8 h-96 overflow-y-auto mb-10 font-black italic text-slate-400 leading-relaxed uppercase tracking-tighter text-lg whitespace-pre-wrap">
              {content}
            </div>

            <div className="flex gap-4">
               <button className="flex-1 brutal-btn-primary !py-4" onClick={() => navigator.clipboard.writeText(content)}>
                  <Copy size={18} /> COPY TO CLIPBOARD
               </button>
               <button className="flex-1 brutal-btn-accent !py-4 !bg-white !text-navy-950">
                  <Download size={18} /> EXPORT PDF
               </button>
            </div>

            <div className="mt-8 pt-8 border-t-2 border-navy-800 flex items-center justify-between">
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-navy-800 italic flex items-center gap-2">
                  <Zap size={14} className="fill-brand-yellow text-brand-yellow" /> AI INTEL VERIFIED
               </span>
               <div className="text-[10px] font-black text-brand-primary uppercase underline">Edit in Markdown</div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
