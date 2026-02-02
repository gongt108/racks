import { PhotoItem } from './fileUploads';

// utils/fileToBase64.ts
export const fileToBase64 = (file: File): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve(reader.result as string);
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
};

export const prepareImagesForGemini = async (photos: PhotoItem[]) => {
	return Promise.all(
		photos.map(async (photo) => {
			const base64Img = await fileToBase64(photo.file);
			const rawBase64 = base64Img.split(',')[1]; // remove data:image/...;base64,
			return { mimeType: photo.file.type, data: rawBase64 };
		}),
	);
};
