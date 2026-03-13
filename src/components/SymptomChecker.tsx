import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, AlertTriangle } from 'lucide-react';
import { getMediBotResponse } from '../services';
import type { GeminiHistory } from '../services';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

// Shape Gemini expects for history is now imported from service.

const SymptomChecker: React.FC<{ lang: 'en' | 'ta' }> = ({ lang }) => {
  const welcome = lang === 'en'
    ? "Hello! How are you feeling today? Describe your symptoms and I'll help analyze them."
    : "வணக்கம்! இன்று நீங்கள் எப்படி உணருகிறீர்கள்? உங்கள் அறிகுறிகளை விவரிக்கவும்.";

  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: welcome, sender: 'ai' }
  ]);
  const [history, setHistory] = useState<GeminiHistory[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    const userMsg: Message = { id: Date.now().toString(), text: userText, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Limit history to last 4 messages for speed
    const historyToSend = history.slice(-4);

    try {
      // isolated AI logic:
      const replyText = await getMediBotResponse(userText, historyToSend, lang);

      const aiMsg: Message = { id: (Date.now() + 1).toString(), text: replyText, sender: 'ai' };
      setMessages(prev => [...prev, aiMsg]);

      setHistory([
        ...historyToSend,
        { role: 'user', parts: [{ text: userText }] },
        { role: 'model', parts: [{ text: replyText }] },
      ]);
    } catch (error) {
      console.error("Gemini API Error:", error);
      console.error("Full Error Trap in Component:", error);
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: `Error details: ${error instanceof Error ? error.message : "Unknown error"}`,
        sender: 'ai',
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="glass-card" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', color: 'var(--primary)' }}>
        <Bot size={24} />
        <h3 style={{ margin: 0 }}>{lang === 'en' ? 'AI Symptom Checker' : 'AI அறிகுறி சரிபார்ப்பு'}</h3>
      </div>

      <div style={{ background: 'rgba(255, 193, 7, 0.1)', borderLeft: '4px solid var(--accent)', padding: '10px', borderRadius: '8px', marginBottom: '20px', display: 'flex', gap: '10px', fontSize: '0.85rem' }}>
        <AlertTriangle size={18} color="var(--accent)" />
        <p style={{ margin: 0 }}>
          {lang === 'en'
            ? 'Disclaimer: This is an AI assistant, not a medical professional. Always seek professional advice for health concerns.'
            : 'துறப்பு: இது ஒரு AI உதவியாளர், மருத்துவ நிபுணர் அல்ல.'}
        </p>
      </div>

      <div className="chat-container">
        <div className="chat-messages" ref={scrollRef}>
          <AnimatePresence>
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className={`message ${msg.sender}`}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', fontSize: '0.75rem', opacity: 0.7 }}>
                  {msg.sender === 'ai' ? <Bot size={12} /> : <User size={12} />}
                  {msg.sender === 'ai' ? 'MediBot' : (lang === 'en' ? 'You' : 'நீங்கள்')}
                </div>
                {msg.text}
              </motion.div>
            ))}
            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="message ai" style={{ opacity: 0.6 }}>
                {lang === 'en' ? 'MediBot is thinking...' : 'MediBot யோசிக்கிறது...'}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="chat-input">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder={lang === 'en' ? 'Type symptoms...' : 'அறிகுறிகளைத் தட்டச்சு செய்க...'}
            disabled={isTyping}
          />
          <button onClick={handleSend} disabled={isTyping || !input.trim()} style={{ padding: '8px', background: 'var(--primary)', color: 'white', opacity: isTyping || !input.trim() ? 0.6 : 1 }}>
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;
