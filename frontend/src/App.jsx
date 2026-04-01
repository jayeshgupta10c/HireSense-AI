import React from 'react'; 
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage'; 
import Dashboard from './pages/Dashboard'; 
import AnalysisResult from './pages/AnalysisResult'; 
import JobsPage from './pages/JobsPage'; 
import QuizPage from './pages/QuizPage'; 
import AuthPage from './pages/AuthPage';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-navy-950 text-white font-sans selection:bg-brand-primary selection:text-navy-950 overflow-x-hidden">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analysis/:id" element={<AnalysisResult />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/quiz" element={<QuizPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
