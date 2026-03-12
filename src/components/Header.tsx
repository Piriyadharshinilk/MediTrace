import React from 'react';

interface HeaderProps {
  lang: 'en' | 'ta';
  setLang: (lang: 'en' | 'ta') => void;
}

const Header: React.FC<HeaderProps> = ({ lang, setLang }) => {
  return (
    <header className="header glass-card" style={{ 
      margin: '20px', 
      padding: '15px 30px', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          background: 'var(--secondary)', 
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '24px',
          fontWeight: 'bold'
        }}>+</div>
        <h2 className="text-gradient" style={{ margin: 0, fontSize: '1.5rem' }}>MediTrace AI</h2>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          onClick={() => setLang('en')}
          style={{ 
            padding: '8px 15px', 
            background: lang === 'en' ? 'var(--primary)' : 'transparent',
            color: lang === 'en' ? 'white' : 'var(--text-main)',
            border: lang === 'en' ? 'none' : '1px solid var(--primary)'
          }}
        >
          English
        </button>
        <button 
          onClick={() => setLang('ta')}
          style={{ 
            padding: '8px 15px', 
            background: lang === 'ta' ? 'var(--primary)' : 'transparent',
            color: lang === 'ta' ? 'white' : 'var(--text-main)',
            border: lang === 'ta' ? 'none' : '1px solid var(--primary)'
          }}
        >
          தமிழ்
        </button>
      </div>
    </header>
  );
};

export default Header;
