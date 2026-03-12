import React, { useState, useRef } from 'react';
import { Upload, FileText, Send } from 'lucide-react';
import { motion } from 'framer-motion';
// PDF parsing and OCR
import * as pdfjsLib from 'pdfjs-dist';
import Tesseract from 'tesseract.js';

// Vite-friendly worker setup for pdfjs-dist v5
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

interface ReportInputProps {
  onAnalyze: (text: string) => void;
  onInputError: (message: string) => void;
  isLoading: boolean;
  lang: 'en' | 'ta';
}

const ReportInput: React.FC<ReportInputProps> = ({ onAnalyze, onInputError, isLoading, lang }) => {
  const [text, setText] = useState('');
  const [parsing, setParsing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractPdfText = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let out = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      out += content.items.map((item: any) => item.str).join(' ') + '\n';
    }
    return out;
  };

  const extractImageText = async (file: File): Promise<string> => {
    const { data } = await Tesseract.recognize(file, 'eng');
    return data.text;
  };

  const handleFile = async (file: File) => {
    setParsing(true);
    try {
      let extracted = '';
      if (file.type === 'application/pdf') {
        extracted = await extractPdfText(file);
      } else if (file.type.startsWith('image/')) {
        extracted = await extractImageText(file);
      } else {
        // fallback to text
        extracted = await file.text();
      }

      if (!extracted.trim()) {
        onInputError('No text found in the selected file. Please try another document.');
        return;
      }

      setText(extracted);
      // automatically kick off analysis so user doesn't have to copy/text again
      onAnalyze(extracted);
    } catch (err) {
      console.error(err);
      onInputError('Failed to parse the file. Make sure it is a valid PDF or image containing readable text. For scanned documents OCR may not be perfect.');
    } finally {
      setParsing(false);
    }
  };

  const labels = {
    en: {
      placeholder: "Paste your lab report or scan results here or upload a file...",
      upload: "Upload PDF or Image",
      analyze: "Analyze Report",
      analyzing: "Analyzing...",
      title: "Enter Report Data"
    },
    ta: {
      placeholder: "உங்கள் ஆய்வக அறிக்கை அல்லது ஸ்கேன் முடிவுகளை இங்கே ஒட்டவும் அல்லது கோப்பை பதிவேற்றவும்...",
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
        disabled={parsing}
      />

      <div style={{ display: 'flex', gap: '15px', marginTop: '20px', flexWrap: 'wrap' }}>
        {/* hidden file input triggered by upload box */}
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf,image/*,text/plain"
          style={{ display: 'none' }}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = '';
          }}
        />
        <div
          onClick={() => !parsing && !isLoading && fileInputRef.current?.click()}
          style={{ 
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
            cursor: parsing || isLoading ? 'not-allowed' : 'pointer',
            pointerEvents: parsing || isLoading ? 'none' : 'auto'
          }}
        >
          <Upload size={18} />
          <span style={{ fontSize: '0.9rem' }}>{parsing ? (lang==='en' ? 'Processing file...' : 'கோப்பை செயலாக்கப்படுகிறது...') : currentLabels.upload}</span>
        </div>

        <button 
          onClick={() => text.trim() && onAnalyze(text)}
          disabled={isLoading || parsing || !text.trim()}
          style={{ 
            background: isLoading ? 'var(--text-muted)' : 'var(--primary)', 
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            opacity: isLoading || !text.trim() ? 0.85 : 1,
            minWidth: '180px',
            justifyContent: 'center'
          }}
        >
          {isLoading
            ? (
              <>
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Send size={18} /> {currentLabels.analyzing}
                </motion.span>
              </>
            )
            : <><Send size={18} /> {currentLabels.analyze}</>
          }
        </button>
      </div>

      {/* Loading progress bar */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginTop: '14px', borderRadius: '8px', overflow: 'hidden', background: '#E2E8F0', height: '6px' }}
        >
          <motion.div
            animate={{ x: ['-100%', '100%'] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
            style={{ height: '100%', width: '50%', background: 'linear-gradient(90deg, var(--primary), var(--secondary))', borderRadius: '8px' }}
          />
        </motion.div>
      )}
      {isLoading && (
        <p style={{ marginTop: '8px', fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          {lang === 'en' ? '⏳ AI is reading your report… usually takes 5–15 seconds.' : '⏳ AI உங்கள் அறிக்கையை வாசிக்கிறது… சற்று காத்திருக்கவும்.'}
        </p>
      )}
    </motion.div>
  );
};

export default ReportInput;
