import { GoogleGenAI } from '@google/genai';
import { Import } from 'lucide-react';

// ✅ Export this to use in index.jsx
export const contents = [
  {
    role: 'user',
    parts: [
      {
        text: `Generate travel plan for location: Las Vegas, for 3 days for a couple with a cheap budget. Give me a hotel option list with HotelName, Hotel address, price, hotel image url, geo coordinates, ratings, descriptions and suggest itinerary with Place Name, place details, place image url, geo coordinates, ticket pricing, rating. Time to travel each of the location for 3 days with each day plan with best time to visit in JSON format.`,
      },
    ],
  },
];

const config = {
  responseMimeType: 'application/json',
};

const model = 'gemini-2.5-flash-preview-05-20';

// 🧠 This is optional if you're testing in this file
export async function testAIResponse() {
  const ai = new GoogleGenAI({
    apiKey: Import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY,
  });

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });

  for await (const chunk of response) {
    console.log(chunk.text);
  }
}
