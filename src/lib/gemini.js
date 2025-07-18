// src/lib/gemini.js

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY);

export async function sendTravelPrompt(prompt) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = await response.text();

  return text;
}
