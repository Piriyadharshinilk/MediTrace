import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

async function listModels() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await response.json();
    if (data.models) {
        console.log('Available models:');
        data.models.forEach(m => console.log(`- ${m.name} (${m.displayName})`));
    } else {
        console.log('No models found or error:', JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.error('Error listing models:', err);
  }
}

listModels();
