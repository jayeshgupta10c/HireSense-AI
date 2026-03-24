import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, Zap, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { analyzeResume } from '../services/api';

const BG   = '#0d1421';
const CARD = '#111c2d';
const BDR  = '#1e3050';
const TEAL = '#00d9b5';
const BLUE = '#4a9eff';
const RED  = '#e53935';

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

      // Store full result with pivot suggestions
      localStorage.setItem('last_analysis', JSON.stringify(res));
      navigate(`/analysis/${res.id || 'current'}`);
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.detail || err?.message || 'Backend unreachable. Is the server running on port 8000?';
      setError(msg);
      setLoad(false);
    }
  };

  const canSubmit = file && jd.trim().length > 0 && !isLoading;

  return (
    <div style={{ background: BG, minHeight: '100vh', fontFamily: "'Inter', system-ui, sans-serif" }}
      className="flex items-center justify-center px-6 py-20">

      <div style={{ maxWidth: 860 }} className="w-full space-y-6">

        {/* Header */}
        <div className="text-center mb-12">
          <div style={{ background: `${TEAL}15`, border: `2px solid ${TEAL}`, color: TEAL }}
            className="inline-flex items-center gap-2 px-5 py-2 font-black italic uppercase tracking-[0.3em] text-[10px] mb-8 -rotate-1">
            <Zap size={12} style={{ fill: TEAL }} /> ML Engine Active — dataset.csv loaded
          </div>
          <h1 style={{ color: 'white' }} className="text-7xl font-black italic tracking-tighter uppercase leading-none mb-4">
            Upload &amp; <span style={{ color: TEAL }}>Analyze</span>
          </h1>
          <p style={{ color: '#4a6080' }} className="font-bold uppercase tracking-[0.4em] text-xs">
            Real PDF → ML Matching → Instant Intelligence
          </p>
        </div>

        {/* Card */}
        <div style={{ background: CARD, border: `2px solid ${BDR}` }}>

          <div className="grid md:grid-cols-2 gap-0">

            {/* Left: Job Description */}
            <div style={{ borderRight: `2px solid ${BDR}` }} className="p-8 space-y-4">
              <h2 style={{ color: BLUE }} className="font-black italic uppercase text-xl tracking-tighter flex items-center gap-3">
                <ShieldCheck size={22} /> 01. Target Role
              </h2>
              <p style={{ color: '#4a6080' }} className="font-bold uppercase text-[10px] tracking-[0.3em]">
                Paste the job description or role name so the ML engine can compare against the dataset.
              </p>
              <textarea
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                placeholder="e.g. Software Engineer at a fintech startup requiring React, Node.js, TypeScript, Docker and AWS..."
                rows={10}
                style={{ background: BG, border: `2px solid ${BDR}`, color: 'white', resize: 'vertical', outline: 'none' }}
                className="w-full p-4 font-bold text-sm leading-relaxed placeholder:text-[#2a3a50] focus:border-[#4a9eff] transition-colors"
              />
              <div style={{ color: '#2a3a50' }} className="text-[9px] font-black uppercase tracking-widest">
                {jd.length} characters
              </div>
            </div>

            {/* Right: PDF Upload */}
            <div className="p-8 space-y-4">
              <h2 style={{ color: TEAL }} className="font-black italic uppercase text-xl tracking-tighter flex items-center gap-3">
                <Upload size={22} /> 02. Your Resume
              </h2>
              <p style={{ color: '#4a6080' }} className="font-bold uppercase text-[10px] tracking-[0.3em]">
                Upload a text-based PDF (not scanned image). Text will be extracted by the ML engine.
              </p>

              {/* Drop Zone */}
              <div {...getRootProps()}
                style={{
                  border: `3px dashed ${file ? TEAL : isDragActive ? TEAL : BDR}`,
                  background: isDragActive ? `${TEAL}08` : BG,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                className="min-h-[200px] flex flex-col items-center justify-center relative p-6">
                <input {...getInputProps()} />

                {file ? (
                  <div className="text-center">
                    <div style={{ border: `3px solid ${TEAL}`, background: CARD, boxShadow: `4px 4px 0 ${TEAL}` }}
                      className="w-20 h-20 flex items-center justify-center mx-auto mb-4 relative">
                      <FileText size={36} style={{ color: TEAL }} />
                      <button
                        onClick={(e) => { e.stopPropagation(); setFile(null); setError(''); }}
                        style={{ background: RED, border: '2px solid black' }}
                        className="absolute -top-3 -right-3 w-7 h-7 flex items-center justify-center">
                        <X size={14} className="text-white" />
                      </button>
                    </div>
                    <div style={{ color: TEAL }} className="font-black italic uppercase tracking-tighter text-lg">{file.name}</div>
                    <div style={{ color: '#4a6080' }} className="text-[9px] font-black uppercase tracking-widest mt-1">
                      {(file.size / 1024).toFixed(1)} KB — Ready for ML Analysis
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload size={44} style={{ color: BDR }} className="mb-4" />
                    <p style={{ color: '#2a3a50' }} className="font-black italic uppercase tracking-tighter text-lg text-center">
                      {isDragActive ? 'Drop to Upload' : 'Drag PDF Here or Click'}
                    </p>
                    <p style={{ color: '#2a3a50' }} className="text-[9px] font-black uppercase tracking-[0.3em] mt-2">
                      PDF only · Max 10MB
                    </p>
                  </>
                )}
              </div>

              {/* Error */}
              {error && (
                <div style={{ background: `${RED}15`, border: `2px solid ${RED}`, color: RED }}
                  className="flex items-start gap-3 p-4">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span className="font-bold text-xs uppercase tracking-wide">{error}</span>
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div style={{ borderTop: `2px solid ${BDR}` }} className="p-6">
            <button
              onClick={handleAnalyze}
              disabled={!canSubmit}
              style={{
                background: canSubmit ? TEAL : BDR,
                border: canSubmit ? '2px solid black' : `2px solid ${BDR}`,
                boxShadow: canSubmit ? '6px 6px 0 black' : 'none',
                color: canSubmit ? '#0d1421' : '#4a6080',
                cursor: canSubmit ? 'pointer' : 'not-allowed',
                transition: 'all 0.15s'
              }}
              className="w-full py-5 font-black italic uppercase text-xl tracking-tighter flex items-center justify-center gap-4 hover:translate-x-1 hover:translate-y-1 hover:shadow-none disabled:transform-none">
              {isLoading ? (
                <><Loader2 size={24} className="animate-spin" /> RUNNING ML ANALYSIS...</>
              ) : (
                <>ANALYZE MY RESUME <Zap size={24} style={{ fill: canSubmit ? '#0d1421' : '#4a6080' }} /></>
              )}
            </button>

            {!file && !jd &&
              <p style={{ color: '#2a3a50' }} className="text-center text-[9px] font-black uppercase tracking-widest mt-3">Upload PDF + Enter job description to enable</p>
            }
          </div>

        </div>
      </div>
    </div>
  );
}
