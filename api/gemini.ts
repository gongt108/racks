import { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

// export default function handler(req: VercelRequest, res: VercelResponse) {
// 	res.status(200).json({ body: 'Hello from Vercel Serverless Function!' });
// }

export default async function handler(req: VercelRequest, res: VercelResponse) {
	if (req.method !== 'POST') {
		return res.status(405).json({ message: 'Method not allowed' });
	}

	try {
		const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

		const images = req.body.images as { mimeType: string; data: string }[];

		const prompt = `Analyze the provided clothing image(s). 
        1. Extract all numerical values that resemble prices (e.g., tags, stickers, handwritten labels).
        2. Identify the primary garment type.
        3. Determine the 'suggestedPrice' by identifying the most prominent or lowest price tag shown.

        Do NOT wrap in markdown. Return the data strictly in this JSON schema:
        {
          "price": string[],
          "suggestedPrice": number | null,
          "garmentType": "shirt" | "skirt" | "shorts" | "pants" | "dress" | "bag" | "belt" | "shoes" | "jacket" | "sweater" | "accessories" | "other"
        }`;

		const contents = [
			{
				text: prompt,
			},
			...images.map((img: { mimeType: string; data: string }) => ({
				inlineData: img,
			})),
		];

		const response = await ai.models.generateContent({
			model: 'gemini-2.5-flash',
			contents,
		});

		const rawText = response.text;

		if (!rawText) {
			return res.status(500).json({ error: 'Empty AI response' });
		}
		const parsed = JSON.parse(rawText);

		res.status(200).json(parsed);
	} catch (err: any) {
		console.error('Server error:', err);
		res.status(500).json({ error: err.message });
	}
}
