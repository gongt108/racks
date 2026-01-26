export const handleBulkClick = (bulkRef: React.RefObject<HTMLInputElement>) => {
    bulkRef.current?.click();
};

export const handleSingleClick = (singleRef: React.RefObject<HTMLInputElement>) => {
    singleRef.current?.click();
};

export const handleCameraClick = (cameraRef: React.RefObject<HTMLInputElement>) => {
    cameraRef.current?.click();
};

export const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    console.log('Bulk upload:', fileArray);

    e.target.value = '';
};

export const handleSingleUpload = (e: React.ChangeEvent<HTMLInputElement>, setPhotos: React.Dispatch<React.SetStateAction<PhotoItem[]>>) => {
    const files = Array.from(e.target.files || []);

    if (files.length > 5) {
        alert('You can upload up to 5 photos only');
        e.target.value = '';
        return;
    }

    const newPhotos = files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
    }));

    setPhotos((prev) => [...prev, ...newPhotos]);

    e.target.value = '';
};

export const removeImage = (index: number, setPhotos: React.Dispatch<React.SetStateAction<PhotoItem[]>>, photos: PhotoItem[]) => {
    setPhotos((prev) => {
        URL.revokeObjectURL(prev[index].preview);
        return prev.filter((_, i) => i !== index);
    });
};

export type PhotoItem = {
    file: File;
    preview: string;
};
