import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, Stethoscope, Activity, History, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface Analysis {
  riskLevel: 'Low' | 'Medium' | 'High';
  riskScore: number; // 0-100
  summary: { en: string; ta: string };
  findings: Array<{ 
    label: { en: string; ta: string }; 
    value: string; 
    status: 'normal' | 'abnormal';
    explanation: { en: string; ta: string };
  }>;
  tags: { en: string; ta: string }[];
  doctorAdvice: { en: string; ta: string };
  historicalComparison?: Array<{
    parameter: { en: string; ta: string };
    current: string;
    previous: string;
    trend: 'improving' | 'declining' | 'stable';
  }>;
}

interface AnalysisResultProps {
  analysis: Analysis | null;
  lang: 'en' | 'ta';
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysis, lang }) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'risk' | 'history'>('summary');

  if (!analysis) return null;


  const labels = {

    en: {
      summary: "Summary",
      risk: "Risk Analytics",
      history: "History",
      riskLevel: "Risk Level",
      findings: "Notable Findings",
      nextSteps: "Recommended Next Steps",
      bookDoc: "Consult a Doctor",
      tags: "Identified Tags",
      comparison: "Historical Comparison",
      trend: "Trend"
    },
    ta: {
      summary: "சுருக்கம்",
      risk: "ஆபத்து பகுப்பாய்வு",
      history: "வரலாறு",
      riskLevel: "ஆபத்து நிலை",
      findings: "குறிப்பிடத்தக்க கண்டுபிடிப்புகள்",
      nextSteps: "பரிந்துரைக்கப்பட்ட அடுத்த இடங்கள்",
      bookDoc: "மருத்துவரைக் கலந்தாலோசிக்கவும்",
      tags: "அடையாளம் காணப்பட்ட குறிச்சொற்கள்",
      comparison: "வரலாற்று ஒப்பீடு",
      trend: "போக்கு"
    }
  };

  const currentLabels = labels[lang];

  const renderSummary = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <p style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '30px', background: 'rgba(0,191,165,0.05)', padding: '15px', borderRadius: '12px', borderLeft: '4px solid var(--secondary)' }}>
        {analysis.summary[lang]}
      </p>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '25px' }}>
        {analysis.tags.map((tag, idx) => (
          <span key={idx} style={{ background: 'var(--primary)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
            {tag[lang]}
          </span>
        ))}
      </div>

      <h4 style={{ marginBottom: '15px' }}>{currentLabels.findings}</h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px', marginBottom: '30px' }}>
        {analysis.findings.map((item, idx) => (
          <div key={idx} style={{ padding: '15px', border: '1px solid #E2E8F0', borderRadius: '12px', background: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>{item.label[lang]}</span>
              {item.status === 'normal' ? <CheckCircle size={18} color="var(--risk-low)" /> : <AlertCircle size={18} color="var(--risk-high)" />}
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: '700', color: item.status === 'normal' ? 'var(--risk-low)' : 'var(--risk-high)', marginBottom: '5px' }}>
              {item.value}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              {item.explanation[lang]}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderRiskMeter = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontWeight: 'bold' }}>{currentLabels.riskLevel}: {analysis.riskLevel}</span>
          <span style={{ fontWeight: 'bold' }}>{analysis.riskScore}%</span>
        </div>
        <div style={{ height: '12px', background: '#E2E8F0', borderRadius: '6px', overflow: 'hidden', position: 'relative' }}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${analysis.riskScore}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ 
              height: '100%', 
              background: analysis.riskLevel === 'High' ? 'var(--risk-high)' : analysis.riskLevel === 'Medium' ? 'var(--risk-medium)' : 'var(--risk-low)' 
            }} 
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span>Low</span>
          <span>Medium</span>
          <span>High</span>
        </div>
      </div>

      <div className="doctor-suggest">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Stethoscope size={20} color="var(--primary)" />
          <h4 style={{ margin: 0, color: 'var(--primary)' }}>{currentLabels.nextSteps}</h4>
        </div>
        <p style={{ margin: 0 }}>{analysis.doctorAdvice[lang]}</p>
        <button style={{ marginTop: '15px', background: 'var(--primary)', color: 'white', padding: '10px 20px', fontSize: '0.9rem' }}>
          {currentLabels.bookDoc}
        </button>
      </div>
    </motion.div>
  );

  const renderHistory = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h4 style={{ marginBottom: '20px' }}>{currentLabels.comparison}</h4>
      {analysis.historicalComparison ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {analysis.historicalComparison.map((item, idx) => (
            <div key={idx} style={{ padding: '15px', borderRadius: '12px', border: '1px solid #E2E8F0', background: 'rgba(255,255,255,0.5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{item.parameter[lang]}</div>
                <div style={{ fontWeight: 'bold' }}>{item.previous} → {item.current}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{currentLabels.trend}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: item.trend === 'improving' ? 'var(--risk-low)' : item.trend === 'declining' ? 'var(--risk-high)' : 'var(--text-main)', fontWeight: 'bold' }}>
                  {item.trend === 'improving' ? <TrendingUp size={16} /> : item.trend === 'declining' ? <TrendingDown size={16} /> : <Minus size={16} />}
                  {item.trend.charAt(0).toUpperCase() + item.trend.slice(1)}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
          No previous reports found to compare.
        </p>
      )}
    </motion.div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card"
      style={{ marginTop: '20px', padding: 0, overflow: 'hidden' }}
    >
      <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0' }}>
        <button 
          onClick={() => setActiveTab('summary')}
          style={{ flex: 1, padding: '15px', borderRadius: 0, background: activeTab === 'summary' ? 'white' : 'rgba(0,0,0,0.02)', color: activeTab === 'summary' ? 'var(--primary)' : 'var(--text-muted)', borderBottom: activeTab === 'summary' ? '3px solid var(--primary)' : 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Info size={18} /> {currentLabels.summary}
          </div>
        </button>
        <button 
          onClick={() => setActiveTab('risk')}
          style={{ flex: 1, padding: '15px', borderRadius: 0, background: activeTab === 'risk' ? 'white' : 'rgba(0,0,0,0.02)', color: activeTab === 'risk' ? 'var(--primary)' : 'var(--text-muted)', borderBottom: activeTab === 'risk' ? '3px solid var(--primary)' : 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Activity size={18} /> {currentLabels.risk}
          </div>
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          style={{ flex: 1, padding: '15px', borderRadius: 0, background: activeTab === 'history' ? 'white' : 'rgba(0,0,0,0.02)', color: activeTab === 'history' ? 'var(--primary)' : 'var(--text-muted)', borderBottom: activeTab === 'history' ? '3px solid var(--primary)' : 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <History size={18} /> {currentLabels.history}
          </div>
        </button>
      </div>

      <div style={{ padding: '30px' }}>
        {activeTab === 'summary' && renderSummary()}
        {activeTab === 'risk' && renderRiskMeter()}
        {activeTab === 'history' && renderHistory()}
      </div>
    </motion.div>
  );
};

export default AnalysisResult;
