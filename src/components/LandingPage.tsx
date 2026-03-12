import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Activity, Shield, ArrowRight, Zap, Globe } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  lang: 'en' | 'ta';
}

const features = [
  {
    icon: <Activity size={28} />,
    en: { title: 'AI Report Analysis', desc: 'Upload lab reports and get instant AI-powered insights.' },
    ta: { title: 'AI அறிக்கை பகுப்பாய்வு', desc: 'ஆய்வக அறிக்கைகளை பதிவேற்றி உடனடி AI நுண்ணறிவு பெறுங்கள்.' }
  },
  {
    icon: <Heart size={28} />,
    en: { title: 'Health Dashboard', desc: 'Track your daily vitals and wellness at a glance.' },
    ta: { title: 'ஆரோக்கிய கட்டுப்பாட்டகம்', desc: 'உங்கள் தினசரி ஆரோக்கியத்தை ஒரே பார்வையில் கண்காணிக்கவும்.' }
  },
  {
    icon: <Shield size={28} />,
    en: { title: 'Symptom Checker', desc: 'Describe symptoms and get smart guidance from our AI.' },
    ta: { title: 'அறிகுறி சரிபார்ப்பு', desc: 'அறிகுறிகளை விவரித்து AI இலிருந்து வழிகாட்டுதல் பெறுங்கள்.' }
  },
];

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, lang }) => {
  const content = {
    en: {
      badge: 'Powered by AI',
      headline: 'Your Personal',
      headlineAccent: 'Health Intelligence',
      subtitle:
        'MediExplain AI transforms complex medical reports into plain language, helps you track wellness, and guides you with smart insights — all in one place.',
      cta: 'Get Started',
      tagline: 'Trusted · Private · Bilingual',
    },
    ta: {
      badge: 'AI ஆல் இயக்கப்படுகிறது',
      headline: 'உங்கள் தனிப்பட்ட',
      headlineAccent: 'ஆரோக்கிய நுண்ணறிவு',
      subtitle:
        'MediExplain AI சிக்கலான மருத்துவ அறிக்கைகளை எளிய மொழியில் விளக்குகிறது, உங்கள் ஆரோக்கியத்தை கண்காணிக்கவும் AI நுண்ணறிவுடன் வழிகாட்டவும் உதவுகிறது.',
      cta: 'தொடங்கு',
      tagline: 'நம்பகமான · தனிப்பட்ட · இருமொழி',
    },
  };

  const t = content[lang];

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative blobs */}
      <div
        style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(74,144,226,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-100px',
          left: '-100px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,191,165,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(42,92,130,0.1)',
          border: '1px solid rgba(42,92,130,0.25)',
          borderRadius: '50px',
          padding: '8px 18px',
          fontSize: '0.85rem',
          fontWeight: 600,
          color: 'var(--primary)',
          marginBottom: '30px',
        }}
      >
        <Zap size={14} />
        {t.badge}
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          fontSize: 'clamp(2rem, 6vw, 3.8rem)',
          fontWeight: 700,
          textAlign: 'center',
          lineHeight: 1.2,
          marginBottom: '16px',
          color: 'var(--text-main)',
        }}
      >
        {t.headline}{' '}
        <span className="text-gradient">{t.headlineAccent}</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          maxWidth: '620px',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '1.1rem',
          lineHeight: 1.7,
          marginBottom: '40px',
        }}
      >
        {t.subtitle}
      </motion.p>

      {/* CTA Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.45 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onGetStarted}
        style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
          color: 'white',
          padding: '16px 40px',
          fontSize: '1.1rem',
          fontWeight: 700,
          borderRadius: '50px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 10px 30px rgba(42,92,130,0.3)',
          marginBottom: '60px',
        }}
      >
        {t.cta} <ArrowRight size={20} />
      </motion.button>

      {/* Feature Cards */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          width: '100%',
          maxWidth: '800px',
          marginBottom: '40px',
        }}
      >
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.1 }}
            className="glass-card"
            style={{
              padding: '24px 20px',
              textAlign: 'center',
              margin: 0,
              cursor: 'default',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                margin: '0 auto 16px',
              }}
            >
              {f.icon}
            </div>
            <h4 style={{ marginBottom: '8px', fontSize: '1rem' }}>{f[lang].title}</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
              {f[lang].desc}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Tagline */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
        }}
      >
        <Globe size={14} />
        {t.tagline}
      </motion.div>
    </div>
  );
};

export default LandingPage;
