import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Droplets, Moon, Zap } from 'lucide-react';

interface MetricProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  delay: number;
}

const MetricCard: React.FC<MetricProps> = ({ icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
    className="metric-card"
  >
    <div style={{ color, marginBottom: '10px', display: 'flex', justifyContent: 'center' }}>
      {icon}
    </div>
    <div className="metric-value">{value}</div>
    <div className="metric-label">{label}</div>
  </motion.div>
);

const DashboardCards: React.FC<{ lang: 'en' | 'ta' }> = ({ lang }) => {
  const content: Record<string, Record<string, string>> = {
    en: {
      vitals: "Daily Vitals",
      heart: "Heart Rate",
      water: "Water Intake",
      sleep: "Sleep",
      energy: "Energy Level"
    },
    ta: {
      vitals: "தினசரி ஆரோக்கியம்",
      heart: "இதய துடிப்பு",
      water: "தண்ணீர் அளவு",
      sleep: "தூக்கம்",
      energy: "ஆற்றல் நிலை"
    }
  };

  const t = content[lang];

  return (
    <div style={{ marginBottom: '40px' }}>
      <h3 style={{ marginBottom: '20px', color: 'var(--primary)' }}>{t.vitals}</h3>
      <div className="dashboard-grid">
        <MetricCard
          icon={<Heart size={32} />}
          label={t.heart}
          value="72 BPM"
          color="#F44336"
          delay={0.1}
        />
        <MetricCard
          icon={<Droplets size={32} />}
          label={t.water}
          value="2.5 L"
          color="#2196F3"
          delay={0.2}
        />
        <MetricCard
          icon={<Moon size={32} />}
          label={t.sleep}
          value="7.5 hrs"
          color="#9C27B0"
          delay={0.3}
        />
        <MetricCard
          icon={<Zap size={32} />}
          label={t.energy}
          value="High"
          color="#FFC107"
          delay={0.4}
        />
      </div>
    </div>
  );
};

export default DashboardCards;
