import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { image, mimeType, prompt } = req.body;
  const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);
  
  // Use Gemini 1.5 Flash for vision tasks
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" } // Force JSON output
  });

  try {
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: image,
          mimeType: mimeType
        }
      }
    ]);

    const output = JSON.parse(result.response.text());
    res.status(200).json({ data: output });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process image" });
  }
}

async function askAI(userPrompt) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: userPrompt }),
  });
  const data = await response.json();
  console.log(data.text);
}