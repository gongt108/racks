import { PhotoItem } from '@/utils/fileUploads';
import { prepareImagesForGemini } from '@/utils/fileToBase64';

export async function scanPhotosWithAI(photos: PhotoItem[]) {
	if (!photos.length) return null;

	const images = await prepareImagesForGemini(photos);

	const response = await fetch('/api/gemini', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ images }),
	});

	if (!response.ok) {
		throw new Error('AI scan failed');
	}

	return response.json();
}
