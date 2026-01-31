// api/gemini.ts
import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  // 1. Check if the request is a POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { images } = req.body; // The array you sent from the browser
  const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = "Identify the items in these images and return data for each.";

  try {
    const result = await model.generateContent([
      prompt,
      ...images.map(img => ({
        inlineData: { mimeType: img.mimeType, data: img.data }
      }))
    ]);
    
    res.status(200).json({ text: result.response.text() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}