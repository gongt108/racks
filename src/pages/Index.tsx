import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/supabaseClient';
import { toast } from 'react-toastify';

import { useSettings } from '@/context/SettingsContext';
import { garmentTypes } from '@/constants/garmentTypes';
import { prepareImagesForGemini } from '@/utils/fileToBase64';
import {
	triggerFileInput,
	handleBulkUpload,
	handleSingleUpload,
	handleDropUpload,
	removeImage,
	PhotoItem,
} from '@/utils/fileUploads';
import { bulkInsertItems } from '@/utils/addItemsUtils';

import UploadIcon from '@mui/icons-material/Upload';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CircularProgress from '@mui/material/CircularProgress';

import { FaShirt, FaDollarSign } from 'react-icons/fa6';
import { BsFillInfoCircleFill, BsRobot } from 'react-icons/bs';
import { IoIosClose } from 'react-icons/io';

import {
	MenuItem,
	Select,
	FormControl,
	FormControlLabel,
	InputLabel,
	Switch,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';

const Index = () => {
	const [garmentType, setGarmentType] = useState('');
	const [purchasePrice, setPurchasePrice] = useState<number | null>(null);
	const [autoPricingChecked, setAutoPricingChecked] = useState(true);
	const [customTags, setCustomTags] = useState('');
	const [photos, setPhotos] = useState<PhotoItem[]>([]);
	const [bulkPhotos, setBulkPhotos] = useState<PhotoItem[]>([]);
	const [isUploading, setIsUploading] = useState(false);
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [hasOptionalInfo, setHasOptionalInfo] = useState(false);

	const [singleItem, setSingleItem] = useState({
		listingPrice: null as number | null,
		source: '',
		description: '',
	});

	const bulkRef = useRef<HTMLInputElement | null>(null);
	const singleRef = useRef<HTMLInputElement | null>(null);
	const cameraRef = useRef<HTMLInputElement | null>(null);

	const { percentageMarkup, fixedMarkup, isPercentage } = useSettings();

	useEffect(() => {
		return () => {
			photos.forEach((img) => URL.revokeObjectURL(img.preview));
		};
	}, [photos]);

	const toggleOptionalInfo = () => setHasOptionalInfo((p) => !p);

	const handleTypeSelection = (event: SelectChangeEvent) => {
		setGarmentType(event.target.value);
	};

	const handlePurchasePriceChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const value = event.target.value;
		if (/^\d*\.?\d*$/.test(value)) {
			setPurchasePrice(value ? Number(Number(value).toFixed(2)) : null);
		}
	};

	const handleOptionalInfoChange = (field: string, value: string) => {
		setSingleItem((prev) => ({ ...prev, [field]: value }));
	};

	const handleAddSingleItem = async () => {
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) return alert('Login required');
		if (!garmentType) return alert('Garment type required');
		if (!purchasePrice) return alert('Purchase price required');

		try {
			const listingPrice = autoPricingChecked
				? Number(
						(isPercentage
							? purchasePrice * (percentageMarkup / 100 + 1)
							: purchasePrice + fixedMarkup
						).toFixed(2),
					)
				: singleItem.listingPrice;

			const { data: item, error } = await supabase
				.from('items')
				.insert([
					{
						user_id: user.id,
						category: garmentType,
						purchase_price: purchasePrice,
						listing_price: listingPrice,
						source: singleItem.source || null,
						description: singleItem.description || null,
						custom_tags: customTags
							? customTags.split(',').map((t) => t.trim())
							: [],
						status: 'itemized',
						photos: [],
					},
				])
				.select()
				.single();

			if (error || !item) throw error;

			const uploaded: string[] = [];
			for (const photo of photos) {
				const path = `${user.id}/${item.id}/${crypto.randomUUID()}`;
				const { error: uploadError } = await supabase.storage
					.from('item-photos')
					.upload(path, photo.file);
				if (uploadError) throw uploadError;
				uploaded.push(path);
			}

			if (uploaded.length) {
				await supabase
					.from('items')
					.update({ photos: uploaded })
					.eq('id', item.id);
			}

			toast.success('Item added!');
			setGarmentType('');
			setPurchasePrice(null);
			setPhotos([]);
			setCustomTags('');
			setSingleItem({ listingPrice: null, source: '', description: '' });
		} catch (err: any) {
			console.error(err);
			alert('Failed to add item');
		}
	};

	const scanWithAI = async () => {
		if (!photos.length) return;
		setIsAnalyzing(true);
		try {
			const images = await prepareImagesForGemini(photos);
			const res = await fetch('/api/gemini', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ images }),
			});
			const data = await res.json();
			setPurchasePrice(data.suggestedPrice);
			setGarmentType(data.garmentType);
		} finally {
			setIsAnalyzing(false);
		}
	};

	return (
		<div className="flex flex-1 w-full">
			<main className="container mx-auto px-4 py-8 flex flex-col space-y-8">

				{/* BULK */}
				<div
					onClick={() => triggerFileInput(bulkRef)}
					onDragOver={(e) => e.preventDefault()}
					onDrop={(e) => {
						e.preventDefault();
						handleDropUpload(Array.from(e.dataTransfer.files), setBulkPhotos, 100);
					}}
					className="border-2 rounded-lg p-8 cursor-pointer"
				>
					<PhotoLibraryIcon />
					<input
						ref={bulkRef}
						type="file"
						multiple
						className="hidden"
						onChange={(e) => handleBulkUpload(e, setBulkPhotos)}
					/>

					{bulkPhotos.length > 0 && (
						<button
							onClick={() =>
								bulkInsertItems(bulkPhotos, setBulkPhotos, setIsUploading)
							}
						>
							Bulk Add
						</button>
					)}
				</div>

				{/* SINGLE */}
				<div className="border-2 rounded-lg p-8">
					<p>Photos</p>

					<button onClick={() => triggerFileInput(singleRef)}>
						Upload
					</button>

					<input
						ref={singleRef}
						type="file"
						multiple
						className="hidden"
						onChange={(e) => handleSingleUpload(e, setPhotos)}
					/>

					{photos.length > 0 && (
						<button onClick={scanWithAI}>
							<BsRobot /> AI Scan
						</button>
					)}

					{/* GARMENT */}
					<FormControl fullWidth>
						<InputLabel>Garment</InputLabel>
						<Select value={garmentType} onChange={handleTypeSelection}>
							{garmentTypes.map((t) => (
								<MenuItem key={t.value} value={t.value}>
									<t.icon /> {t.label}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					{/* PRICE */}
					<input
						value={purchasePrice ?? ''}
						onChange={handlePurchasePriceChange}
						placeholder="Purchase Price"
					/>

					<FormControlLabel
						control={
							<Switch
								checked={autoPricingChecked}
								onChange={(e) => setAutoPricingChecked(e.target.checked)}
							/>
						}
						label="Auto pricing"
					/>

					{/* OPTIONAL — COLLAPSIBLE */}
					<div className="border rounded-lg mt-6">
						<button
							type="button"
							onClick={toggleOptionalInfo}
							className="p-4 font-semibold w-full text-left"
						>
							Optional Info ({hasOptionalInfo ? 'Hide' : 'Show'})
						</button>

						{hasOptionalInfo && (
							<div className="p-4 space-y-3">
								<input
									value={singleItem.source}
									onChange={(e) =>
										handleOptionalInfoChange('source', e.target.value)
									}
									placeholder="Source"
								/>

								<input
									value={singleItem.description}
									onChange={(e) =>
										handleOptionalInfoChange('description', e.target.value)
									}
									placeholder="Description"
								/>

								<input
									value={customTags}
									onChange={(e) => setCustomTags(e.target.value)}
									placeholder="tags"
								/>
							</div>
						)}
					</div>

					<button onClick={handleAddSingleItem}>
						Add Item
					</button>
				</div>

				{isAnalyzing && <div>AI scanning…</div>}

				{isUploading && (
					<div>
						<CircularProgress />
						Uploading…
					</div>
				)}

			</main>
		</div>
	);
};

export default Index;
