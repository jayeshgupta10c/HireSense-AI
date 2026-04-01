import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, Zap, ArrowRight, ShieldCheck, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { analyzeResume } from '../services/api';

export default function Dashboard() {
  const [file, setFile]       = useState(null);
  const [jd, setJd]           = useState('');
  const [isLoading, setLoad]  = useState(false);
  const [error, setError]     = useState('');
  const navigate              = useNavigate();

  const onDrop = useCallback((accepted) => {
    if (accepted[0]) { setFile(accepted[0]); setError(''); }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    maxSize: 10 * 1024 * 1024,
    onDropRejected: (r) => setError(r[0]?.errors?.[0]?.message || 'File rejected')
  });

  const handleAnalyze = async () => {
    if (!file || !jd.trim()) return;
    setLoad(true);
    setError('');
    try {
      const res = await analyzeResume(file, jd.trim());
      if (res.error) {
        setError(res.error);
        setLoad(false);
        return;
      }
      localStorage.setItem('last_analysis', JSON.stringify(res));
      navigate(`/analysis/${res.id || 'current'}`);
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.detail || err?.message || 'Backend unreachable. Is the server running?';
      setError(msg);
      setLoad(false);
    }
  };

  const canSubmit = file && jd.trim().length > 0 && !isLoading;

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24 bg-navy-950">
      <div className="max-w-4xl w-full space-y-8">

        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-black uppercase tracking-widest mb-6 animate-pulse">
            <Sparkles size={12} /> Neural Engine Online
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none mb-4 glow-text">
            Ingest & <span className="text-brand-primary italic">Analyze</span>
          </h1>
          <p className="text-navy-400 font-bold uppercase tracking-[0.3em] text-[10px]">
            Quantum Resume Parsing & Heuristic Matching
          </p>
        </div>

        {/* Main Card */}
        <div className="brutal-card p-1 overflow-hidden">
          <div className="grid md:grid-cols-2">

            {/* Left: Job Description */}
            <div className="p-8 space-y-6 border-b md:border-b-0 md:border-r border-navy-800 bg-navy-900/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-primary/10 rounded-lg text-brand-primary border border-brand-primary/20">
                  <ShieldCheck size={20} />
                </div>
                <h2 className="font-black uppercase text-lg tracking-tight">01. Target Role</h2>
              </div>
              <p className="text-navy-500 font-bold uppercase text-[9px] tracking-widest leading-loose">
                Paste the job description or role name for precise keyword intersection analysis.
              </p>
              <textarea
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                placeholder="Paste the full job description here..."
                rows={10}
                className="brutal-input w-full text-xs font-medium"
              />
              <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-navy-600">
                <span>Buffer Status: {jd.length > 0 ? 'Active' : 'Idle'}</span>
                <span>{jd.length} chars</span>
              </div>
            </div>

            {/* Right: PDF Upload */}
            <div className="p-8 space-y-6 bg-navy-900/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-accent/10 rounded-lg text-brand-accent border border-brand-accent/20">
                  <Upload size={20} />
                </div>
                <h2 className="font-black uppercase text-lg tracking-tight">02. PRIMARY ASSET</h2>
              </div>
              <p className="text-navy-500 font-bold uppercase text-[9px] tracking-widest leading-loose">
                Upload your resume in PDF format. Neural extraction is performed locally.
              </p>

              {/* Drop Zone */}
              <div {...getRootProps()}
                className={`min-h-[240px] flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-300 ${
                  isDragActive ? 'border-brand-primary bg-brand-primary/5' : 
                  file ? 'border-brand-accent bg-brand-accent/5' : 
                  'border-navy-800 bg-navy-950/50'
                } cursor-pointer group`}
              >
                <input {...getInputProps()} />

                {file ? (
                  <div className="text-center p-6">
                    <div className="w-20 h-20 bg-brand-accent/10 rounded-2xl border border-brand-accent/30 flex items-center justify-center mx-auto mb-4 relative shadow-lg">
                      <FileText size={32} className="text-brand-accent" />
                      <button
                        onClick={(e) => { e.stopPropagation(); setFile(null); setError(''); }}
                        className="absolute -top-3 -right-3 w-8 h-8 bg-brand-red rounded-full flex items-center justify-center border-2 border-navy-950 text-white shadow-xl hover:scale-110 transition-transform"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <div className="text-white font-black uppercase tracking-tight mb-1">{file.name}</div>
                    <div className="text-brand-accent text-[9px] font-black uppercase tracking-widest">
                      {(file.size / 1024).toFixed(1)} KB · EXTRACTABLE
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-8 space-y-4">
                    <div className="w-16 h-16 bg-navy-800 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform border border-white/5">
                      <Upload size={24} className="text-navy-400" />
                    </div>
                    <div>
                      <p className="text-white font-black uppercase tracking-tight">
                        {isDragActive ? 'Release to Scan' : 'INITIALIZE UPLOAD SEQUENCE'}
                      </p>
                      <p className="text-navy-600 text-[9px] font-black uppercase tracking-widest mt-1">
                        PDF format · Secure Transmission
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-3 p-4 bg-brand-red/10 border border-brand-red/20 rounded-xl text-brand-red">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span className="font-bold text-[10px] uppercase tracking-wider">{error}</span>
                </div>
              )}
            </div>
          </div>

          {/* Submit Footer */}
          <div className="p-6 bg-navy-950/50 border-t border-navy-800">
            <button
              onClick={handleAnalyze}
              disabled={!canSubmit}
              className={`brutal-btn-primary w-full rounded-xl py-6 text-xl transition-all ${
                !canSubmit ? 'opacity-30 grayscale cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <><Loader2 size={24} className="animate-spin" /> EXECUTING ANALYSIS PROCOTOL...</>
              ) : (
                <>INITIALIZE DEEP SCAN <Zap size={24} className="fill-white" /></>
              )}
            </button>
            {!file && !jd && (
              <p className="text-center text-[9px] font-black uppercase tracking-widest text-navy-600 mt-4">
                Systems ready. Waiting for input data.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
