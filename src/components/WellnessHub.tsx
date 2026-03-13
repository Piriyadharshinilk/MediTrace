import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Leaf, Coffee, Smile } from 'lucide-react';

const WellnessHub: React.FC<{ lang: 'en' | 'ta' }> = ({ lang }) => {
  const tips = {
    en: [
      { icon: <Leaf size={20} />, text: "Eat at least 5 portions of a variety of fruit and vegetables every day." },
      { icon: <Coffee size={20} />, text: "Cut down on saturated fat and sugar for better heart health." },
      { icon: <Smile size={20} />, text: "Mental health is just as important as physical health. Take breaks." }
    ],
    ta: [
      { icon: <Leaf size={20} />, text: "ஒவ்வொரு நாளும் குறைந்தது 5 வகையான பழங்கள் மற்றும் காய்கறிகளை உண்ணுங்கள்." },
      { icon: <Coffee size={20} />, text: "இதய ஆரோக்கியத்திற்காக கொழுப்பையும் சர்க்கரையையும் குறைக்கவும்." },
      { icon: <Smile size={20} />, text: "மன ஆரோக்கியம் உடல் ஆரோக்கியத்தைப் போலவே முக்கியமானது. ஓய்வு எடுங்கள்." }
    ]
  } as Record<string, Array<{ icon: React.ReactNode; text: string }>>;

  const dailyQuote: Record<string, string> = {
    en: "The greatest wealth is health.",
    ta: "நோயற்ற வாழ்வே குறைவற்ற செல்வம்."
  };

  return (
    <div className="wellness-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <Lightbulb size={24} />
        <h3 style={{ margin: 0 }}>{lang === 'en' ? "Wellness Hub" : "ஆரோக்கிய மையம்"}</h3>
      </div>

      <p style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '25px', color: 'white' }}>
        "{dailyQuote[lang]}"
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {tips[lang].map((tip, idx) => (
          <motion.div
            key={idx}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: idx * 0.1 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'rgba(255,255,255,0.1)',
              padding: '12px',
              borderRadius: '12px'
            }}
          >
            <div style={{ background: 'white', color: 'var(--primary)', padding: '6px', borderRadius: '8px' }}>
              {tip.icon}
            </div>
            <span style={{ fontSize: '0.9rem' }}>{tip.text}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WellnessHub;
