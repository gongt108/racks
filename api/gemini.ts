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

        Return the data strictly in this JSON schema:
        {
          "price": string[],
          "suggestedPrice": number | null,
          "garmentType": "Shirt" | "Skirt" | "Shorts" | "Pants" | "Dress" | "Bag" | "Belt" | "Shoes" | "Jacket" | "Sweater" | "Accessories" | "Other"
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

		res.status(200).json({ text: response.text });
	} catch (err: any) {
		console.error('Server error:', err);
		res.status(500).json({ error: err.message });
	}
}
