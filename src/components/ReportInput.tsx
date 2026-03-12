import React, { useState } from 'react';
import { Upload, FileText, Send } from 'lucide-react';
import { motion } from 'framer-motion';

interface ReportInputProps {
  onAnalyze: (text: string) => void;
  isLoading: boolean;
  lang: 'en' | 'ta';
}

const ReportInput: React.FC<ReportInputProps> = ({ onAnalyze, isLoading, lang }) => {
  const [text, setText] = useState('');

  const labels = {
    en: {
      placeholder: "Paste your lab report or scan results here...",
      upload: "Upload PDF or Image (Mock)",
      analyze: "Analyze Report",
      analyzing: "Analyzing...",
      title: "Enter Report Data"
    },
    ta: {
      placeholder: "உங்கள் ஆய்வக அறிக்கை அல்லது ஸ்கேன் முடிவுகளை இங்கே ஒட்டவும்...",
      upload: "PDF அல்லது படத்தை பதிவேற்றவும்",
      analyze: "அறிக்கையை பகுப்பாய்வு செய்க",
      analyzing: "பகுப்பாய்வு செய்கிறது...",
      title: "அறிக்கை தரவை உள்ளிடவும்"
    }
  };

  const currentLabels = labels[lang];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <FileText size={20} color="var(--primary)" />
        <h3 style={{ margin: 0 }}>{currentLabels.title}</h3>
      </div>

      <textarea 
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={currentLabels.placeholder}
      />

      <div style={{ display: 'flex', gap: '15px', marginTop: '20px', flexWrap: 'wrap' }}>
        <div style={{ 
          flex: 1, 
          minWidth: '200px',
          border: '2px dashed #CBD5E0', 
          borderRadius: '12px', 
          padding: '10px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: '10px',
          color: 'var(--text-muted)',
          cursor: 'pointer'
        }}>
          <Upload size={18} />
          <span style={{ fontSize: '0.9rem' }}>{currentLabels.upload}</span>
        </div>

        <button 
          onClick={() => text.trim() && onAnalyze(text)}
          disabled={isLoading || !text.trim()}
          style={{ 
            background: 'var(--primary)', 
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            opacity: isLoading || !text.trim() ? 0.7 : 1
          }}
        >
          {isLoading ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Send size={18} /></motion.div> : <Send size={18} />}
          {isLoading ? currentLabels.analyzing : currentLabels.analyze}
        </button>
      </div>
    </motion.div>
  );
};

export default ReportInput;
