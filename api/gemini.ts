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

		// Hardcoded test images
		const testImages = [
			{
				mimeType: 'image/png',
				data:
					'iVBORw0KGgoAAAANSUhEUgAAAAUA' +
					'AAAFCAYAAACNbyblAAAAHElEQVQI12P4' +
					'//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==', // tiny 1x1 PNG
			},
			{
				mimeType: 'image/jpeg',
				data:
					'/9j/4AAQSkZJRgABAQEASABIAAD/2wBD' +
					'ABALDA4MChAODQ4SEhQWFhQUFBcXFRgd' +
					'Gx0eHx4iJCQgIycpLCwsMDAwMDAwMDAw', // tiny JPEG
			},
		];

		const images =
			req.body.images && req.body.images.length > 0
				? req.body.images
				: testImages; // Use hardcoded images if none provided

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
