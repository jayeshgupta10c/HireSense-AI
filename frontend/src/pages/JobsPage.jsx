import React from 'react'; import { Search, Briefcase, MapPin, DollarSign, ExternalLink, Zap } from 'lucide-react';
const MOCK_JOBS = [
  { id: 1, title: "Senior React Engineer", company: "Stripe", location: "Remote", salary: "$160k - $220k", tags: ["React", "TypeScript"] },
  { id: 2, title: "Product Designer", company: "Notion", location: "San Francisco", salary: "$140k - $190k", tags: ["Figma", "Design Systems"] }
];
export default function JobsPage() {
  return (
    <div className="bg-navy-950 min-h-screen pt-32 pb-32 px-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-20">
           <div>
             <span className="text-brand-accent font-black uppercase tracking-[0.4em] text-[10px] mb-4 block italic">Global Talent Network</span>
             <h1 className="text-8xl font-black text-white italic tracking-tighter uppercase leading-none">Market <br /> <span className="text-brand-primary">Dossiers</span></h1>
           </div>
           <div className="relative w-96">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-navy-800" size={24} />
              <input type="text" placeholder="FILTER BY VECTOR..." className="brutal-input w-full !pl-16 !py-5 text-sm uppercase italic" />
           </div>
        </div>

        <div className="space-y-12">
          {MOCK_JOBS.map(job => (
            <div key={job.id} className="brutal-card p-12 flex items-center justify-between bg-navy-900 brutal-card-hover border-l-brand-primary border-l-[12px] group relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 text-white/5 font-black text-8xl italic uppercase select-none pointer-events-none group-hover:text-brand-primary/10 transition-colors">{job.company}</div>
               <div className="flex gap-12 relative z-10">
                 <div className="w-24 h-24 bg-navy-950 border-3 border-black shadow-brutal-sm flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all -rotate-2 group-hover:rotate-0"><Briefcase size={40} /></div>
                 <div>
                   <h3 className="text-4xl font-black text-white mb-3 uppercase italic tracking-tighter">{job.title}</h3>
                   <div className="flex items-center gap-8 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                     <span className="flex items-center gap-2"><MapPin size={18} className="text-brand-primary" /> {job.location}</span>
                     <span className="flex items-center gap-2"><DollarSign size={18} className="text-brand-accent" /> {job.salary}</span>
                   </div>
                   <div className="flex gap-3">{job.tags.map(t => <span key={t} className="brutal-tag-green border-brand-primary/40 text-brand-primary whitespace-nowrap">{t}</span>)}</div>
                 </div>
               </div>
               <button className="brutal-btn-primary !px-12 !py-5 bg-white text-navy-950 border-3 border-black uppercase text-sm tracking-tighter font-black italic relative z-10">SYNC VECTOR <ExternalLink size={20} className="ml-3" /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
