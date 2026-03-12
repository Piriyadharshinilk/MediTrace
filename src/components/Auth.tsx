import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, Mail, Lock } from 'lucide-react';

interface AuthProps {
  onLogin: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  const handleGoogleLogin = () => {
    onLogin();
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '80vh',
      padding: '20px'
    }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card"
        style={{ maxWidth: '450px', width: '100%', padding: '40px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            background: 'var(--primary)', 
            borderRadius: '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            margin: '0 auto 15px',
            fontSize: '30px'
          }}>+</div>
          <h2 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '10px' }}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            {isLogin ? 'Access your health insights' : 'Start your journey to clarity'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="email" 
              placeholder="Email Address" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '12px 12px 12px 45px', 
                borderRadius: '12px', 
                border: '1px solid #E2E8F0',
                background: 'rgba(255,255,255,0.5)',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="password" 
              placeholder="Password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '12px 12px 12px 45px', 
                borderRadius: '12px', 
                border: '1px solid #E2E8F0',
                background: 'rgba(255,255,255,0.5)',
                fontSize: '1rem'
              }}
            />
          </div>

          <button 
            type="submit"
            style={{ 
              background: 'var(--primary)', 
              color: 'white', 
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              marginTop: '10px'
            }}
          >
            {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '25px 0', color: 'var(--text-muted)' }}>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #E2E8F0' }} />
          <span style={{ padding: '0 15px', fontSize: '0.9rem' }}>OR</span>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #E2E8F0' }} />
        </div>

        <button 
          onClick={handleGoogleLogin}
          style={{ 
            width: '100%', 
            background: 'white', 
            color: 'var(--text-main)', 
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}
        >
          <img src="https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png" alt="Google" style={{ width: '20px', height: '20px' }} />
          Continue with Google
        </button>

        <p style={{ textAlign: 'center', marginTop: '25px', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span 
            onClick={() => setIsLogin(!isLogin)}
            style={{ color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer', marginLeft: '8px' }}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
