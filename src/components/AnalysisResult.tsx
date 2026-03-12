import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Stethoscope, Activity, Info, Heart, TrendingUp, TrendingDown, Minus, History } from 'lucide-react';

export interface Analysis {
  riskLevel: 'Low' | 'Medium' | 'High';
  riskScore: number;
  summary: { en: string; ta: string };
  findings: Array<{
    label: { en: string; ta: string };
    value: string;
    normalRange?: string;
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

const riskColors = {
  Low: { bg: '#F0FFF4', border: '#4CAF50', text: '#2E7D32', badge: '#4CAF50' },
  Medium: { bg: '#FFFDE7', border: '#FFC107', text: '#E65100', badge: '#FFC107' },
  High: { bg: '#FFF3F3', border: '#F44336', text: '#C62828', badge: '#F44336' },
};

const riskEmoji = { Low: '🟢', Medium: '🟡', High: '🔴' };

const riskLabel = {
  en: {
    Low: 'Your results look mostly good!',
    Medium: 'A few things need attention.',
    High: 'Please see a doctor soon.',
  },
  ta: {
    Low: 'உங்கள் முடிவுகள் பெரும்பாலும் நல்லதாக உள்ளன!',
    Medium: 'சில விஷயங்களில் கவனிக்க வேண்டும்.',
    High: 'தயவுசெய்து விரைவில் மருத்துவரை சந்தியுங்கள்.',
  },
};

const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysis, lang }) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'findings' | 'advice'>('summary');

  if (!analysis) return null;

  const risk = analysis.riskLevel;
  const colors = riskColors[risk];

  const tabs = {
    en: { summary: '📋 Overview', findings: '🔬 Test Results', advice: '💊 What To Do' },
    ta: { summary: '📋 சுருக்கம்', findings: '🔬 பரிசோதனை முடிவுகள்', advice: '💊 என்ன செய்வது' },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card"
      style={{ marginTop: '20px', padding: 0, overflow: 'hidden' }}
    >
      {/* ── Risk Banner ── */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          background: `linear-gradient(135deg, ${colors.border}22, ${colors.border}44)`,
          borderLeft: `6px solid ${colors.border}`,
          padding: '20px 30px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ fontSize: '3rem' }}>{riskEmoji[risk]}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: colors.text }}>
            {riskLabel[lang][risk]}
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {lang === 'en'
              ? `Overall Health Score: ${100 - analysis.riskScore}/100`
              : `ஒட்டுமொத்த ஆரோக்கிய மதிப்பெண்: ${100 - analysis.riskScore}/100`}
          </div>
          {/* Score bar */}
          <div style={{ height: '8px', background: '#E2E8F0', borderRadius: '4px', marginTop: '10px', overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${100 - analysis.riskScore}%` }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
              style={{ height: '100%', background: colors.border, borderRadius: '4px' }}
            />
          </div>
        </div>
        {/* Tags */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {analysis.tags.map((tag, i) => (
            <span key={i} style={{
              background: colors.border, color: 'white',
              padding: '4px 12px', borderRadius: '20px',
              fontSize: '0.78rem', fontWeight: 700,
            }}>
              {tag[lang]}
            </span>
          ))}
        </div>
      </motion.div>

      {/* ── Tabs ── */}
      <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', background: '#FAFBFC' }}>
        {(['summary', 'findings', 'advice'] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            flex: 1, padding: '14px 10px', borderRadius: 0, fontSize: '0.92rem', fontWeight: 600,
            background: activeTab === tab ? 'white' : 'transparent',
            color: activeTab === tab ? 'var(--primary)' : 'var(--text-muted)',
            borderBottom: activeTab === tab ? '3px solid var(--primary)' : '3px solid transparent',
            transition: 'all 0.2s',
          }}>
            {tabs[lang][tab]}
          </button>
        ))}
      </div>

      <div style={{ padding: '26px 28px' }}>

        {/* ── Overview Tab ── */}
        {activeTab === 'summary' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Plain English Summary */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(42,92,130,0.06), rgba(0,191,165,0.06))',
              border: '1px solid rgba(42,92,130,0.15)',
              borderRadius: '16px', padding: '20px', marginBottom: '24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <Heart size={20} color="var(--primary)" />
                <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--primary)' }}>
                  {lang === 'en' ? 'What your report says (in simple words)' : 'உங்கள் அறிக்கை என்ன சொல்கிறது (எளிய வார்த்தைகளில்)'}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-main)' }}>
                {analysis.summary[lang]}
              </p>
            </div>

            {/* Quick status cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px' }}>
              {analysis.findings.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  style={{
                    padding: '16px', borderRadius: '14px',
                    background: item.status === 'normal' ? '#F0FFF4' : '#FFF3F3',
                    border: `1.5px solid ${item.status === 'normal' ? '#4CAF50' : '#F44336'}33`,
                    textAlign: 'center',
                  }}
                >
                  {item.status === 'normal'
                    ? <CheckCircle size={22} color="#4CAF50" />
                    : <AlertCircle size={22} color="#F44336" />}
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', marginTop: '8px', color: 'var(--text-main)' }}>
                    {item.label[lang]}
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: item.status === 'normal' ? '#2E7D32' : '#C62828', marginTop: '4px' }}>
                    {item.value}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {item.status === 'normal'
                      ? (lang === 'en' ? '✓ Normal' : '✓ சாதாரண')
                      : (lang === 'en' ? '⚠ Needs attention' : '⚠ கவனம் தேவை')}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Test Results Tab ── */}
        {activeTab === 'findings' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
              {lang === 'en'
                ? '🔎 Each test result is explained below in simple words — no medical degree needed!'
                : '🔎 ஒவ்வொரு பரிசோதனை முடிவும் எளிய வார்த்தைகளில் விளக்கப்பட்டுள்ளது!'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {analysis.findings.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.07 }}
                  style={{
                    borderRadius: '16px',
                    border: `1.5px solid ${item.status === 'normal' ? '#4CAF5033' : '#F4433633'}`,
                    background: item.status === 'normal' ? '#F0FFF4' : '#FFF8F8',
                    overflow: 'hidden',
                  }}
                >
                  {/* Header row */}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '14px 18px',
                    borderBottom: `1px solid ${item.status === 'normal' ? '#4CAF5022' : '#F4433622'}`,
                    background: item.status === 'normal' ? '#E8F5E9' : '#FFEBEE',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {item.status === 'normal'
                        ? <CheckCircle size={20} color="#4CAF50" />
                        : <AlertCircle size={20} color="#F44336" />}
                      <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>
                        {item.label[lang]}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem', color: item.status === 'normal' ? '#2E7D32' : '#C62828' }}>
                        {item.value}
                      </div>
                      {item.normalRange && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {lang === 'en' ? 'Normal: ' : 'சாதாரண: '}{item.normalRange}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Explanation */}
                  <div style={{ padding: '14px 18px' }}>
                    <p style={{ margin: 0, color: 'var(--text-main)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                      {item.explanation[lang]}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── What To Do Tab ── */}
        {activeTab === 'advice' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Risk Meter */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontWeight: 700 }}>
                <span>{lang === 'en' ? 'Health Risk Level' : 'ஆரோக்கிய ஆபத்து அளவு'}</span>
                <span style={{ color: colors.border }}>{risk} ({analysis.riskScore}/100)</span>
              </div>
              <div style={{ height: '14px', background: 'linear-gradient(to right, #4CAF50, #FFC107, #F44336)', borderRadius: '7px', position: 'relative', overflow: 'visible' }}>
                <motion.div
                  initial={{ left: '0%' }}
                  animate={{ left: `calc(${analysis.riskScore}% - 10px)` }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                  style={{ position: 'absolute', top: '-4px', width: '20px', height: '20px', background: 'white', border: `3px solid ${colors.border}`, borderRadius: '50%', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <span>🟢 {lang === 'en' ? 'All good' : 'நல்லது'}</span>
                <span>🟡 {lang === 'en' ? 'Some concern' : 'கவலை'}</span>
                <span>🔴 {lang === 'en' ? 'See doctor' : 'மருத்துவர்'}</span>
              </div>
            </div>

            {/* Doctor Advice Card */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(42,92,130,0.08), rgba(0,191,165,0.08))',
              border: '1.5px solid rgba(42,92,130,0.2)',
              borderRadius: '16px', padding: '22px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <Stethoscope size={24} color="var(--primary)" />
                <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--primary)' }}>
                  {lang === 'en' ? '👨‍⚕️ What should you do next?' : '👨‍⚕️ அடுத்து என்ன செய்வது?'}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '1rem', lineHeight: 1.8, color: 'var(--text-main)' }}>
                {analysis.doctorAdvice[lang]}
              </p>
            </div>

            {/* Abnormal results summary */}
            {analysis.findings.some(f => f.status === 'abnormal') && (
              <div style={{ marginTop: '20px', padding: '16px', background: '#FFF3F3', borderRadius: '12px', border: '1.5px solid #F4433633' }}>
                <div style={{ fontWeight: 700, color: '#C62828', marginBottom: '10px', fontSize: '0.95rem' }}>
                  ⚠️ {lang === 'en' ? 'Tests that need attention:' : 'கவனம் தேவைப்படும் பரிசோதனைகள்:'}
                </div>
                {analysis.findings.filter(f => f.status === 'abnormal').map((f, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F4433622' }}>
                    <span style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>{f.label[lang]}</span>
                    <span style={{ fontWeight: 700, color: '#C62828', fontSize: '0.9rem' }}>{f.value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Disclaimer */}
            <p style={{ marginTop: '20px', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '10px', background: 'rgba(0,0,0,0.03)', borderRadius: '8px' }}>
              {lang === 'en'
                ? '⚠️ This is AI-generated guidance for information only. Always consult a qualified doctor for medical decisions.'
                : '⚠️ இது AI உருவாக்கிய வழிகாட்டுதல் மட்டுமே. மருத்துவ முடிவுகளுக்கு எப்போதும் மருத்துவரை அணுகவும்.'}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default AnalysisResult;
