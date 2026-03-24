import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FileText, Upload, Brain, Shield, Target } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { analyzeResume } from '../services/api'
import RadarChart from '../components/charts/RadarChart'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

export default function SinglePageAnalyzer() {
  const [file, setFile] = useState(null)
  const [jobRole, setJobRole] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState(null)

  const onDrop = (acceptedFiles) => setFile(acceptedFiles[0])
  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { 'application/pdf': ['.pdf'] }, multiple: false })

  const handleStartAnalysis = async () => {
    if (!file || !jobRole) return
    setIsAnalyzing(true)
    try {
      const data = await analyzeResume(file, jobRole)
      setResult(data)
    } catch (err) { console.error(err) } finally { setIsAnalyzing(false) }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-20">
        {!result ? (
          <div className="bg-white border-8 border-black p-10 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-4xl font-black uppercase mb-8">Deploy Analysis Vector</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <input type="text" value={jobRole} onChange={(e) => setJobRole(e.target.value)} placeholder="TARGET JOB ROLE" className="p-6 border-4 border-black font-black uppercase" />
              <div {...getRootProps()} className="border-4 border-dashed border-black p-10 text-center cursor-pointer">
                <input {...getInputProps()} />
                <p className="font-black uppercase">{file ? file.name : "Drop Resume Payload (PDF)"}</p>
              </div>
            </div>
            <button onClick={handleStartAnalysis} disabled={!file || !jobRole || isAnalyzing} className="w-full mt-10 py-6 bg-blue-600 text-white border-4 border-black font-black text-2xl uppercase">
              {isAnalyzing ? "Processing..." : "Trigger AI Analysis"}
            </button>
          </div>
        ) : (
          <div className="bg-blue-600 border-8 border-black p-10 text-white shadow-[24px_24px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-6xl font-black uppercase">Match Score: {result.match_score.toFixed(0)}%</h2>
            <div className="h-[400px] mt-10"><RadarChart data={result.sections} /></div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
