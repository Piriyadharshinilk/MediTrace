// src/services/geminiService.ts

// Access the API key from Vite's environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export interface GeminiPart {
  text: string;
}

export interface GeminiHistory {
  role: 'user' | 'model';
  parts: GeminiPart[];
}

export const getMediBotResponse = async (
  userMessage: string,
  chatHistory: GeminiHistory[],
  lang: 'en' | 'ta' = 'en'
): Promise<string> => {
  if (!API_KEY) {
    console.error("Missing VITE_GEMINI_API_KEY in environment variables.");
    throw new Error("Missing VITE_GEMINI_API_KEY");
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

  // Strict system instruction to ensure medical safety
  let systemInstruction =
    "You are MediBot, an empathetic clinical triage assistant. " +
    "NEVER provide a definitive medical diagnosis. NEVER prescribe medication. " +
    "Ask 1 or 2 follow-up questions to gather more context. " +
    "If symptoms are severe, urge the user to seek emergency care. " +
    "Conclude with a reminder to consult a real doctor.";

  // Instruct the model to automatically respond in the language the user is speaking
  systemInstruction += ` IMPORTANT: The UI language is currently ${lang === 'ta' ? 'Tamil' : 'English'}. However, ALWAYS reply in the exact same language the user uses. If they type in Tamil, reply in Tamil. If they type in English, reply in English.`;

  const payload = {
    system_instruction: {
      parts: { text: systemInstruction }
    },
    contents: [
      ...chatHistory,
      { role: "user", parts: [{ text: userMessage }] }
    ]
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorMessage = `HTTP Error: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      console.error("💥 Precise Gemini API Error Response:", errorData);
      if (errorData.error && errorData.error.message) {
        errorMessage = errorData.error.message;
      }
    } catch (e) { /* ignore JSON parsing error on standard HTTP failure */ }
    throw new Error(errorMessage);
  }

  const data = await response.json();

  if (data.candidates && data.candidates.length > 0) {
    return data.candidates[0].content.parts[0].text;
  }

  throw new Error("Unexpected response format from Gemini API");
};
