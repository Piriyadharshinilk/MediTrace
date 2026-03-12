import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

async function listModels() {
  try {
    const models = await genAI.getGenerativeModel({ model: 'gemini-pro' }).listModels();
    console.log(JSON.stringify(models, null, 2));
  } catch (err) {
    // If listModels doesn't exist on the model object (it actually exists on the genAI object in some versions)
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (fetchErr) {
        console.error('Error listing models:', err);
    }
  }
}

listModels();
