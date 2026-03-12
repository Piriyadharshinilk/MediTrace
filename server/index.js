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
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash-lite';

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'] }));
app.use(express.json());

// ─── Gemini Setup ────────────────────────────────────────────────────────────
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// ─── Delay helper ────────────────────────────────────────────────────────────
const delay = (ms) => new Promise(r => setTimeout(r, ms));

// ─── Safe JSON extract ───────────────────────────────────────────────────────
function extractJSON(raw) {
  // Strip markdown code fences
  let cleaned = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
  // Find first { ... } block
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start !== -1 && end !== -1) cleaned = cleaned.slice(start, end + 1);
  return JSON.parse(cleaned);
}

// ─── Retry with exponential backoff ─────────────────────────────────────────
async function withRetry(fn, maxRetries = 3) {
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (err) {
      const status = err?.status;
      const isRetryable = status === 429 || status === 503 || status === 500;
      if (isRetryable && i < maxRetries) {
        const wait = (i + 1) * 10000; // 10s, 20s, 30s
        console.log(`[Retry ${i + 1}/${maxRetries}] Status ${status}. Waiting ${wait / 1000}s...`);
        await delay(wait);
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
  console.log(`[${new Date().toISOString()}] POST /api/analyze - chars: ${text?.length || 0}`);

  if (!text || text.trim().length < 5) {
    return res.status(400).json({ error: 'Please paste your medical report text first.' });
  }

  const prompt = `You are a friendly health assistant helping a patient with NO medical knowledge understand their lab report.

Analyze this report and return ONLY a JSON object. No markdown, no explanations outside JSON.

Use simple everyday language — imagine explaining to a child or elderly person who has never seen a medical report before.
- Avoid technical jargon
- For each finding, explain clearly what it means for the person's health in plain English
- For abnormal values, explain WHY it might be a problem and WHAT they should do
- For normal values, reassure the person

JSON to return:
{
  "riskLevel": "Low" | "Medium" | "High",
  "riskScore": <number 0-100>,
  "summary": {
    "en": "<2-3 sentences: what this report means overall in simple words>",
    "ta": "<same in Tamil>"
  },
  "findings": [
    {
      "label": { "en": "<test name in simple English>", "ta": "<in Tamil>" },
      "value": "<measured value with unit>",
      "normalRange": "<e.g. 70-100 mg/dL>",
      "status": "normal" | "abnormal",
      "explanation": {
        "en": "<simple explanation: what this test checks, what this result means, and what the person should do if abnormal>",
        "ta": "<same in Tamil>"
      }
    }
  ],
  "tags": [{ "en": "<short health category>", "ta": "<in Tamil>" }],
  "doctorAdvice": {
    "en": "<clear, kind advice: should they see a doctor? how urgent? what to do next — in simple words>",
    "ta": "<same in Tamil>"
  }
}

Rules:
- riskScore: 0-30 = Low (mostly fine), 31-60 = Medium (some concern), 61-100 = High (see doctor soon)
- If a value is missing normal range from the report, use standard medical reference ranges
- Return ONLY the JSON object, nothing else

Medical Report:
${text.slice(0, 3000)}`;

  try {
    const model = genAI.getGenerativeModel({ model: MODEL });
    const result = await withRetry(() => model.generateContent(prompt));
    const raw = result.response.text();
    const parsed = extractJSON(raw);
    console.log(`[OK] Analysis complete. Risk: ${parsed.riskLevel}`);
    res.json(parsed);
  } catch (err) {
    console.error('[Analyze Error]', err?.status, err?.message || err);
    const status = err?.status;
    if (status === 429) {
      return res.status(429).json({ error: 'The AI is currently busy. Please wait 30 seconds and try again.' });
    }
    if (status === 404) {
      return res.status(500).json({ error: `AI model not found (${MODEL}). Please check your API key and model name.` });
    }
    res.status(500).json({ error: 'Analysis failed. Please check your report text and try again.' });
  }
});

// ─── POST /api/chat ──────────────────────────────────────────────────────────
app.post('/api/chat', async (req, res) => {
  const { message, history = [], lang = 'en' } = req.body;
  console.log(`[${new Date().toISOString()}] POST /api/chat - lang: ${lang}`);

  if (!message?.trim()) {
    return res.status(400).json({ error: 'Please type a message.' });
  }

  const systemInstruction = `You are MediBot, a warm and friendly health assistant helping people with NO medical background.
- Use very simple, clear language — like talking to a friend
- Keep answers short (2-4 sentences)
- Never use medical jargon without explaining it
- Always recommend seeing a real doctor for anything serious
- Never diagnose — only explain and guide
- Respond in ${lang === 'ta' ? 'Tamil' : 'English'} only`;

  try {
    const model = genAI.getGenerativeModel({ model: MODEL, systemInstruction });
    const chat = model.startChat({ history: history.slice(-6) });
    const result = await withRetry(() => chat.sendMessage(message));
    const reply = result.response.text().trim();
    res.json({ reply });
  } catch (err) {
    console.error('[Chat Error]', err?.status, err?.message || err);
    const status = err?.status;
    if (status === 429) {
      return res.status(429).json({ error: 'The AI is busy right now. Please wait a moment and try again.' });
    }
    res.status(500).json({ error: 'Could not connect to AI. Please try again.' });
  }
});

// ─── Start Server ────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✅ MediExplain AI backend running on http://localhost:${PORT}`);
  console.log(`   Model: ${MODEL}`);
  console.log(`   Health: http://localhost:${PORT}/api/health\n`);
});
