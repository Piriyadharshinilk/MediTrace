import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3001;
const MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// ─── Gemini Setup ────────────────────────────────────────────────────────────
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// ─── Retry with backoff ──────────────────────────────────────────────────────
async function retryWithBackoff(fn, retries = 5, delayMs = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      const errStr = JSON.stringify(err);
      const isRateLimit = err?.status === 429 || errStr.includes('429') || errStr.includes('Too Many Requests');
      
      if (isRateLimit && i < retries - 1) {
        // AI free tier often requires a full minute wait when rate limited
        const waitTime = 60000; 
        console.log(`Rate limited by Google. Internal pause for ${waitTime/1000}s...`);
        await new Promise(r => setTimeout(r, waitTime));
      } else {
        throw err;
      }
    }
  }
}

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', model: MODEL });
});

// ─── POST /api/analyze ───────────────────────────────────────────────────────
app.post('/api/analyze', async (req, res) => {
  const { text, lang = 'en' } = req.body;
  if (!text || text.trim().length < 10) {
    return res.status(400).json({ error: 'Report text is too short or missing.' });
  }

  const prompt = `
You are MediExplain AI, a medical report interpreter for patients (not doctors).
Analyze the following lab report and return a JSON object ONLY — no markdown, no text outside the JSON.

Return exactly this structure:
{
  "riskLevel": "Low" or "Medium" or "High",
  "riskScore": <0-100>,
  "summary": { "en": "<plain English>", "ta": "<Tamil>" },
  "findings": [
    { "label": { "en": "...", "ta": "..." }, "value": "...", "status": "normal" or "abnormal", "explanation": { "en": "...", "ta": "..." } }
  ],
  "tags": [{ "en": "...", "ta": "..." }],
  "doctorAdvice": { "en": "...", "ta": "..." }
}

riskScore: 0-30=Low, 31-60=Medium, 61-100=High. Return ONLY valid JSON.

Report:
"""
${text}
"""`;

  try {
    const model = genAI.getGenerativeModel({ model: MODEL });
    const result = await retryWithBackoff(() => model.generateContent(prompt));
    const raw = result.response.text().trim()
      .replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/```$/, '').trim();
    res.json(JSON.parse(raw));
  } catch (err) {
    console.error('Analyze error:', err);
    const isRateLimit = JSON.stringify(err).includes('Too Many Requests') || err?.status === 429;
    if (isRateLimit) return res.status(429).json({ error: 'AI is busy. Please wait a moment and try again.' });
    res.status(500).json({ error: 'Failed to analyze report. Please try again.' });
  }
});

// ─── POST /api/chat ──────────────────────────────────────────────────────────
app.post('/api/chat', async (req, res) => {
  const { message, history = [], lang = 'en' } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message is empty.' });
  }

  const systemInstruction = `You are MediBot, a compassionate AI health assistant.
Respond in ${lang === 'ta' ? 'Tamil' : 'English'} only. Be empathetic, clear and concise (2-4 sentences max).
Always recommend seeing a real doctor for serious symptoms. Never diagnose — only explain and guide.`;

  try {
    const model = genAI.getGenerativeModel({ model: MODEL, systemInstruction });
    const chat = model.startChat({ history });
    const result = await retryWithBackoff(() => chat.sendMessage(message));
    const reply = result.response.text().trim();
    res.json({ reply });
  } catch (err) {
    console.error('Chat error:', err);
    const isRateLimit = JSON.stringify(err).includes('Too Many Requests') || err?.status === 429;
    if (isRateLimit) return res.status(429).json({ error: 'AI is busy right now. Please wait a few seconds and try again.' });
    res.status(500).json({ error: 'Chat failed. Please try again.' });
  }
});

// ─── Start Server ────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✅ MediExplain AI backend running on http://localhost:${PORT}`);
  console.log(`   Model: ${MODEL}`);
  console.log(`   Health: http://localhost:${PORT}/api/health\n`);
});
