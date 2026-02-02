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

		const contents = [
			{ text: 'Identify items in these images:' },
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
