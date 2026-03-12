import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import ReportInput from './components/ReportInput';
import AnalysisResult from './components/AnalysisResult';
import type { Analysis } from './components/AnalysisResult';
import ParticleBackground from './components/ParticleBackground';
import DashboardCards from './components/DashboardCards';
import SymptomChecker from './components/SymptomChecker';
import WellnessHub from './components/WellnessHub';
import LandingPage from './components/LandingPage';
import './App.css';
import { LayoutDashboard, FileText, ArrowLeft } from 'lucide-react';

type AppView = 'landing' | 'main';

function App() {
  const [lang, setLang] = useState<'en' | 'ta'>('en');
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [appView, setAppView] = useState<AppView>('landing');
  const [activeTab, setActiveTab] = useState<'analysis' | 'dashboard'>('analysis');

  const handleAnalyze = async (text: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    setAnalysis(null);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, lang }),
      });
      if (!response.ok) {
        let errMsg = '';
        try {
          const errBody = await response.json();
          errMsg = errBody.error || JSON.stringify(errBody);
        } catch {
          errMsg = await response.text();
        }
        throw new Error(errMsg || `Request failed with status ${response.status}`);
      }
      const result: Analysis = await response.json();
      setAnalysis(result);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong.';
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputError = (msg: string) => {
    setErrorMsg(msg);
  };

  // ── Landing Page ──────────────────────────────────────────────────────────
  if (appView === 'landing') {
    return (
      <div className="app-container">
        <ParticleBackground />
        <div style={{ position: 'fixed', top: '20px', right: '20px', display: 'flex', gap: '8px', zIndex: 1000 }}>
          <button type="button" onClick={() => setLang('en')} style={{ padding: '8px 14px', background: lang === 'en' ? 'var(--primary)' : 'transparent', color: lang === 'en' ? 'white' : 'var(--text-main)', border: lang === 'en' ? 'none' : '1px solid var(--primary)' }}>EN</button>
          <button type="button" onClick={() => setLang('ta')} style={{ padding: '8px 14px', background: lang === 'ta' ? 'var(--primary)' : 'transparent', color: lang === 'ta' ? 'white' : 'var(--text-main)', border: lang === 'ta' ? 'none' : '1px solid var(--primary)' }}>தமிழ்</button>
        </div>
        <AnimatePresence>
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }}>
            <LandingPage lang={lang} onGetStarted={() => setAppView('main')} />
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // ── Main App ──────────────────────────────────────────────────────────────
  return (
    <motion.div className="app-container" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <ParticleBackground />
      <Header lang={lang} setLang={setLang} />

      <main className="container">
        {/* Back to Home */}
        <button type="button" onClick={() => setAppView('landing')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', color: 'var(--text-muted)', padding: '6px 12px', fontSize: '0.9rem', marginBottom: '16px', border: '1px solid #E2E8F0' }}>
          <ArrowLeft size={16} />
          {lang === 'en' ? 'Back to Home' : 'முகப்புக்கு திரும்பு'}
        </button>

        <div className="nav-toggle">
          <button type="button" onClick={() => setActiveTab('analysis')}
            style={{ background: activeTab === 'analysis' ? 'var(--primary)' : 'transparent', color: activeTab === 'analysis' ? 'white' : 'var(--text-main)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <FileText size={18} /> {lang === 'en' ? 'Analysis' : 'பகுப்பாய்வு'}
            </div>
          </button>
          <button type="button" onClick={() => setActiveTab('dashboard')}
            style={{ background: activeTab === 'dashboard' ? 'var(--primary)' : 'transparent', color: activeTab === 'dashboard' ? 'white' : 'var(--text-main)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <LayoutDashboard size={18} /> {lang === 'en' ? 'Dashboard' : 'கட்டுப்பாட்டகம்'}
            </div>
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'analysis' ? (
            <motion.div key="analysis" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <ReportInput
                onAnalyze={handleAnalyze}
                onInputError={handleInputError}
                isLoading={isLoading}
                lang={lang}
              />
              {errorMsg && (
                <div style={{ background: 'rgba(244,67,54,0.1)', border: '1px solid #F44336', borderRadius: '12px', padding: '15px', marginTop: '10px', color: '#F44336', fontSize: '0.9rem' }}>
                  ⚠️ {errorMsg}
                </div>
              )}
              <AnalysisResult analysis={analysis} lang={lang} />
            </motion.div>
          ) : (
            <motion.div key="dashboard" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <DashboardCards lang={lang} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                <SymptomChecker lang={lang} />
                <WellnessHub lang={lang} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer style={{ margin: '40px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        <p>&copy; 2026 MediTrace AI • Built for Impact</p>
      </footer>
    </motion.div>
  );
}

export default App;
