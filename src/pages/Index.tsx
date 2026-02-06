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
				await supabase.storage.from('item-photos').upload(path, photo.file);
				uploaded.push(path);
			}

			if (uploaded.length) {
				await supabase.from('items').update({ photos: uploaded }).eq('id', item.id);
			}

			toast.success('Item added successfully!');
			setGarmentType('');
			setPurchasePrice(null);
			setPhotos([]);
			setCustomTags('');
			setSingleItem({ listingPrice: null, source: '', description: '' });
		} catch (err) {
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
			<main className="container relative mx-auto px-4 py-8 flex flex-col space-y-8">
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
			bulkPhotos.forEach((img) => URL.revokeObjectURL(img.preview));
		};
	}, [photos, bulkPhotos]);

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
				await supabase.storage.from('item-photos').upload(path, photo.file);
				uploaded.push(path);
			}

			if (uploaded.length) {
				await supabase.from('items').update({ photos: uploaded }).eq('id', item.id);
			}

			toast.success('Item added successfully!');
			setGarmentType('');
			setPurchasePrice(null);
			setPhotos([]);
			setCustomTags('');
			setSingleItem({ listingPrice: null, source: '', description: '' });
		} catch (err) {
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
			<main className="container relative mx-auto px-4 py-8 flex flex-col space-y-8">

				{/* ================= BULK UPLOAD ================= */}
				<div
					onClick={() => triggerFileInput(bulkRef)}
					className="mx-auto py-8 px-8 w-full md:w-[48rem] border-2 rounded-lg shadow-md border-gray-200 cursor-pointer group hover:border-rose-600 transition hover:-translate-y-[2px]"
					onDragOver={(e) => e.preventDefault()}
					onDrop={(e) => {
						e.preventDefault();
						handleDropUpload(Array.from(e.dataTransfer.files), setBulkPhotos, 100);
					}}
				>
					<div className="flex flex-col md:flex-row">
						<div className="bg-purple-600 p-3 rounded-md md:mr-3">
							<PhotoLibraryIcon className="text-white" fontSize="large" />
						</div>

						<div>
							<h1 className="text-xl font-bold">Bulk Upload</h1>
							<p>Upload multiple items at once</p>
						</div>
					</div>

					<div className="rounded-lg bg-gray-100 border-2 border-dashed border-pink-200 flex flex-col items-center text-center mt-8 py-8 group-hover:bg-pink-50">
						<UploadIcon className="text-pink-300" fontSize="large" />
						<h2 className="font-semibold text-lg">Select Photos</h2>
					</div>

					<input
						type="file"
						ref={bulkRef}
						className="hidden"
						multiple
						onChange={(e) => handleBulkUpload(e, setBulkPhotos)}
					/>

					{bulkPhotos.length > 0 && (
						<div className="mt-4 border rounded-lg p-4">
							<div className="flex justify-between mb-3">
								<h2 className="font-semibold">Bulk Uploads</h2>
								<button
									onClick={() =>
										bulkInsertItems(bulkPhotos, setBulkPhotos, setIsUploading)
									}
									className="bg-gray-200 px-3 py-1 rounded-lg hover:bg-gray-300"
								>
									Bulk Add
								</button>
							</div>

							<div className="grid grid-cols-2 gap-3">
								{bulkPhotos.map((photo, i) => (
									<div key={i} className="relative">
										<img
											src={photo.preview}
											className="w-full h-24 object-cover rounded-lg"
										/>
										<button
											onClick={() =>
												removeImage(i, bulkPhotos, setBulkPhotos)
											}
											className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center"
										>
											<IoIosClose />
										</button>
									</div>
								))}
							</div>
						</div>
					)}
				</div>

				{/* ================= SINGLE ITEM ================= */}
				{/* (unchanged styled single section — same as previous message) */}

				{/* ---------- SINGLE ITEM CARD ---------- */}
				<div className="mx-4 md:mx-auto py-8 px-8 w-full md:w-[48rem] border-2 rounded-lg border-gray-200 hover:border-rose-600 transition">

					{/* PHOTOS */}
					<p className="font-semibold mt-2">Item Photos (up to 5)</p>

					<div className="flex flex-col md:flex-row w-full mt-2">
						<div
							onClick={() => triggerFileInput(singleRef)}
							className="w-full md:w-1/2 rounded-lg bg-gray-100 border-pink-200 border-2 border-dashed flex flex-col items-center text-center mx-4 p-4 space-y-2 hover:border-rose-400 hover:bg-pink-50 hover:shadow-lg transition"
						>
							<UploadIcon className="text-pink-300" />
							<p>Upload from device</p>
							<input
								ref={singleRef}
								type="file"
								multiple
								className="hidden"
								onChange={(e) => handleSingleUpload(e, setPhotos)}
							/>
						</div>

						<div
							onClick={() => triggerFileInput(cameraRef)}
							className="w-full md:w-1/2 rounded-lg bg-gray-100 border-2 border-pink-200 border-dashed flex flex-col items-center text-center mx-4 p-4 space-y-2 hover:border-rose-400 hover:bg-pink-50 hover:shadow-lg transition"
						>
							<CameraAltIcon className="text-pink-300" />
							<p>Take photo</p>
							<input
								ref={cameraRef}
								type="file"
								capture="environment"
								className="hidden"
								onChange={(e) => handleSingleUpload(e, setPhotos)}
							/>
						</div>
					</div>

					{/* PHOTO GRID */}
					{photos.length > 0 && (
						<div className="flex flex-col mt-4 rounded-lg border p-3">
							<div className="flex justify-between items-center mb-3">
								<h2 className="font-semibold">Photos</h2>
								<button
									onClick={scanWithAI}
									className="flex items-center gap-2 bg-gray-200 px-3 py-1 rounded-lg hover:bg-gray-300"
								>
									<BsRobot /> AI Scan
								</button>
							</div>

							<div className="grid grid-cols-2 gap-3">
								{photos.map((photo, i) => (
									<div key={i} className="relative">
										<img
											src={photo.preview}
											className="w-full h-24 object-cover rounded-lg"
										/>
										<button
											onClick={() => removeImage(i, photos, setPhotos)}
											className="absolute top-1 right-1 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white"
										>
											<IoIosClose />
										</button>
									</div>
								))}
							</div>
						</div>
					)}

					{/* GARMENT */}
					<div className="rounded-lg bg-gray-100 border flex flex-col my-6 p-4 space-y-2">
						<div className="flex items-center gap-2">
							<FaShirt className="text-purple-400" />
							<h2 className="font-semibold text-lg">Item Classification</h2>
						</div>

						<FormControl fullWidth>
							<InputLabel>Select Garment type...</InputLabel>
							<Select value={garmentType} onChange={handleTypeSelection}>
								{garmentTypes.map((type) => (
									<MenuItem key={type.value} value={type.value}>
										<type.icon /> {type.label}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</div>

					{/* PRICING */}
					<div className="rounded-lg bg-gray-100 border flex flex-col my-6 p-4 space-y-3">
						<div className="flex items-center gap-2">
							<FaDollarSign className="text-blue-500" />
							<h2 className="font-semibold text-lg">Pricing</h2>
						</div>

						<input
							value={purchasePrice ?? ''}
							onChange={handlePurchasePriceChange}
							placeholder="Purchase price"
							className="border rounded-xl px-4 py-2"
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
					</div>

					{/* OPTIONAL COLLAPSIBLE */}
					<div className="rounded-lg bg-gray-100 border my-6">
						<button
							type="button"
							onClick={toggleOptionalInfo}
							className="flex justify-between w-full p-4 font-semibold hover:bg-gray-200"
						>
							Item Details (optional)
							<span>{hasOptionalInfo ? 'Hide' : 'Show'}</span>
						</button>

						{hasOptionalInfo && (
							<div className="px-4 pb-4 space-y-3">
								<input
									value={singleItem.source}
									onChange={(e) =>
										handleOptionalInfoChange('source', e.target.value)
									}
									placeholder="Source"
									className="border rounded-xl px-4 py-2 w-full"
								/>
								<input
									value={singleItem.description}
									onChange={(e) =>
										handleOptionalInfoChange('description', e.target.value)
									}
									placeholder="Description"
									className="border rounded-xl px-4 py-2 w-full"
								/>
								<input
									value={customTags}
									onChange={(e) => setCustomTags(e.target.value)}
									placeholder="Tags"
									className="border rounded-xl px-4 py-2 w-full"
								/>
							</div>
						)}
					</div>

					<button
						onClick={handleAddSingleItem}
						className="bg-pink-400 hover:bg-rose-700 text-white font-bold py-3 px-6 rounded-full mx-auto block mt-6"
					>
						Add Item
					</button>
				</div>

				{isAnalyzing && (
					<div className="fixed p-4 bg-blue-50 border rounded-lg animate-pulse">
						Gemini AI scanning…
					</div>
				)}

				{isUploading && (
					<div className="fixed p-6 bg-blue-50 border rounded-lg flex flex-col items-center gap-3">
						<CircularProgress size={60} />
						Uploading…
					</div>
				)}

			</main>
		</div>
	);
};

export default Index;
