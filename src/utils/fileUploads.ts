import React from 'react';

export type PhotoItem = {
	file: File;
	preview: string;
};

/* ===============================
   CLICK HANDLERS
================================ */

export const triggerFileInput = (ref: React.RefObject<HTMLInputElement>) => {
	ref.current?.click();
};

/* ===============================
   UPLOAD HANDLERS
================================ */

export const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
	const files = e.target.files;
	if (!files) return;

	const fileArray = Array.from(files);
	console.log('Bulk upload:', fileArray);

	e.target.value = '';
};

export const handleSingleUpload = (
	e: React.ChangeEvent<HTMLInputElement>,
	setPhotos: React.Dispatch<React.SetStateAction<PhotoItem[]>>,
	maxPhotos = 5,
) => {
	const files = Array.from(e.target.files || []);

	if (files.length > maxPhotos) {
		alert(`You can upload up to ${maxPhotos} photos only`);
		e.target.value = '';
		return;
	}

	const newPhotos: PhotoItem[] = files.map((file) => ({
		file,
		preview: URL.createObjectURL(file),
	}));

	setPhotos((prev) => [...prev, ...newPhotos]);
	e.target.value = '';
};

export const handleDropUpload = (
	files: File[],
	setPhotos: React.Dispatch<React.SetStateAction<PhotoItem[]>>,
	maxPhotos = 5,
) => {
	if (files.length === 0) return;

	if (files.length > maxPhotos) {
		alert(`You can upload up to ${maxPhotos} photos only`);
		return;
	}

	const newPhotos: PhotoItem[] = files.map((file) => ({
		file,
		preview: URL.createObjectURL(file),
	}));

	setPhotos((prev) => [...prev, ...newPhotos]);
};

/* ===============================
   REMOVE IMAGE
================================ */

export const removeImage = (
	index: number,
	photos: PhotoItem[],
	setPhotos: React.Dispatch<React.SetStateAction<PhotoItem[]>>,
) => {
	URL.revokeObjectURL(photos[index].preview);

	setPhotos((prev) => prev.filter((_, i) => i !== index));
};
