import { useState, useRef } from 'react';
import { supabase } from '@/supabaseClient';

import { garmentTypes } from '@/constants/garmentTypes';
import { useAuth } from '@/hooks/useAuth';

import UploadIcon from '@mui/icons-material/Upload';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { FaShirt, FaDollarSign } from 'react-icons/fa6';
import { BsFillInfoCircleFill } from 'react-icons/bs';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

const Index = () => {
	const [garmentType, setGarmentType] = useState('');
	const [purchasePrice, setPurchasePrice] = useState<number | null>(null);
	const [autoPricingChecked, setAutoPricingChecked] = useState(true);
	const [singleItem, setSingleItem] = useState({
		photos: [] as File[],
		category: '',
		purchasePrice: null as number | null,
		listingPrice: null as number | null,
		source: '',
		description: '',
		customTags: [],
	});

	const { user } = useAuth();
	const bulkRef = useRef<HTMLInputElement | null>(null);
	const singleRef = useRef<HTMLInputElement | null>(null);
	const cameraRef = useRef<HTMLInputElement | null>(null);

	const handleBulkClick = () => {
		bulkRef.current?.click();
	};

	const handleSingleClick = () => {
		singleRef.current?.click();
	};

const handleCameraClick = () => {
  cameraRef.current?.click();
};


	const handleBulkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files) return;

		const fileArray = Array.from(files);
		console.log('Bulk upload:', fileArray);

		e.target.value = '';
	};

	const handleSingleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files) return;

		const fileArray = Array.from(files);

		if (fileArray.length > 5) {
			alert('You can upload up to 5 photos only');
			e.target.value = '';
			return;
		}

		console.log('Single upload (max 5):', fileArray);

		e.target.value = '';
	};

	const handleTypeSelection = (event) => {
		setGarmentType(event.target.value);
	};

	const handlePurchasePriceChange = (event) => {
		const value = event.target.value;
		// Allow only numbers and decimal
		if (/^\d*\.?\d*$/.test(value)) {
			const numericValue = Number(Number(value).toFixed(2));
			setPurchasePrice(numericValue);
		}
	};

	const handleOptionalInfoChange = (field: string, value: string) => {
		setSingleItem((prevState) => ({
			...prevState,
			[field]: value,
		}));
	};

	const handleAddItem = () => {
		const newItem = {
			...singleItem,
			status: 'available',
			user: null as string | null,
			category: garmentType,
			purchasePrice: purchasePrice,
			listingPrice: autoPricingChecked ? null : singleItem.listingPrice,
		};
		// Logic to add the item to inventory goes here
		if (autoPricingChecked) {
			const listingPrice = purchasePrice
				? Number((purchasePrice * 2).toFixed(2))
				: null;
			newItem.listingPrice = listingPrice;
		}
		console.log('Item added:', newItem);
	};

	return (
		<div className="flex flex-1 w-full">
			<main className="container mx-auto px-4 py-8 flex flex-col space-y-8">
				{/* BULK UPLOAD */}
				<div
					onClick={handleBulkClick}
					className="mx-auto py-8 px-8 w-full md:w-[48rem] border-2 rounded-lg shadow-md border-gray-200 cursor-pointer group hover:border-rose-600 transition-transform duration-200 hover:-translate-y-[2px]"
				>
					<div className="flex flex-col items-center text-center md:items-start md:text-start md:flex-row">
						<div className="bg-purple-600 shadow-lg shadow-purple-500/50 w-fit p-3 rounded-md md:mr-2">
							<PhotoLibraryIcon
								className="w-6 h-6 text-white"
								fontSize="large"
							/>
						</div>
						<div className="flex flex-col space-between">
							<h1 className="text-xl font-bold">Bulk Upload</h1>
							<p className="text-md">
								Upload multiple items at once from your gallery
							</p>
						</div>
					</div>
					<div className="rounded-lg bg-gray-100 border-2 border-pink-200 border-dashed flex flex-col items-center text-center mx-4 mt-16 mb-8 py-8 px-4 space-y-2 group-hover:border-rose-400 group-hover:bg-pink-50 group-hover:shadow-lg group-hover:shadow-pink-100 transition">
						<UploadIcon className="text-pink-300 w-6 h-6" fontSize="large" />
						<h2 className="font-semibold text-lg">Select Photos</h2>
						<p>Choose multiple images</p>
					</div>
					{/* HIDDEN INPUTS */}
					<input
						type="file"
						ref={bulkRef}
						className="hidden"
						accept="image/*"
						multiple
						onChange={handleBulkChange}
					/>
				</div>

				{/* SINGLE UP TO 5 */}
				<div className="mx-auto py-8 px-8 w-full md:w-[48rem] border-2 rounded-lg border-gray-200 cursor-pointer hover:border-rose-600 transition-transform duration-200 hover:-translate-y-[2px]">
					<div className="flex flex-col md:flex-row">
						<div className="bg-rose-600 shadow-lg shadow-rose-500/50 w-fit p-3 rounded-md md:mr-2">
							<CameraAltIcon className="w-6 h-6 text-white" fontSize="large" />
						</div>
						<div className="flex flex-col space-between">
							<h1 className="text-xl font-bold">Single Item</h1>
							<p className="text-md">Add one item with detailed information</p>
						</div>
					</div>
					<p className="font-semibold mt-6 mx-4">Item Photos (up to 5)</p>
					<div
						onClick={handleSingleClick}
						className="rounded-lg bg-gray-100 border-pink-200 border-2 border-dashed flex flex-col items-center text-center mx-4 mt-2 mb-6 p-4 space-y-2 hover:border-rose-400 hover:bg-pink-50 hover:shadow-lg hover:shadow-pink-100 transition"
					>
						<UploadIcon className="text-pink-300" />
						<p>Upload from device</p>
{/* HIDDEN INPUTS */}
					<input
						type="file"
						ref={singleRef}
						className="hidden"
						accept="image/*"
						multiple
						onChange={handleSingleChange}
					/>
					</div>
					<div className="rounded-lg bg-gray-100 border-2 border-pink-200 border-dashed flex flex-col items-center text-center mx-4 my-6 p-4 space-y-2 hover:border-rose-400 hover:bg-pink-50 hover:shadow-lg hover:shadow-pink-100 transition">
						<CameraAltIcon className="text-pink-300" />
						<p>Take photo</p>
					<input
				  type="file"
						ref={cameraRef}
						className="hidden"
				  accept="image/*"
				  capture="environment"
						onChange={handleSingleChange}
				/>
					</div>
					<div className="rounded-lg bg-gray-100 border flex flex-col mx-4 my-6 p-4 space-y-2">
						<div className="flex flex-row space-x-1 items-center">
							<FaShirt className="text-purple-300 w-4 h-4" />
							<h2 className="font-semibold text-lg">Item Classification</h2>
						</div>
						<p className="font-semibold">
							Garment type <span className="text-red-500">*</span>
						</p>
						<FormControl fullWidth className="w-64">
							{' '}
							{/* Apply a Tailwind width utility */}
							<InputLabel id="select-label">Select Garment type...</InputLabel>
							<Select
								labelId="select-label"
								id="simple-select"
								value={garmentType}
								onChange={handleTypeSelection}
								className="text-sm border-gray-300 rounded-lg shadow-sm" // Apply Tailwind styles
							>
								{garmentTypes.map((type) => {
									const Icon = type.icon;
									return (
										<MenuItem
											key={type.value}
											value={type.value}
											className="flex space-x-2"
										>
											<Icon />
											<p>{type.label}</p>
										</MenuItem>
									);
								})}
							</Select>
						</FormControl>
						<div className="flex flex-row space-x-2 items-center">
							<BsFillInfoCircleFill className="text-purple-500" />
							<p className="text-sm">
								Required for inventory tracking and analytics
							</p>
						</div>
					</div>
					<div className="rounded-lg bg-gray-100 border flex flex-col mx-4 my-6 p-4 space-y-2">
						<div className="flex flex-row space-x-1 items-center">
							<FaDollarSign className="text-blue-500 h-4 w-4" />
							<h2 className="font-semibold text-lg">Pricing Information</h2>
						</div>

						<div className="flex flex-row space-x-2">
							<div className="w-full flex flex-col space-y-1">
								<p className="font-semibold">Purchase price ($)</p>
								<input
									type="text"
									value={purchasePrice}
									onChange={handlePurchasePriceChange}
									placeholder="0.00"
									className="w-full border border-gray-300 rounded-xl pl-4 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>
							<div className="flex flex-col w-full space-y-1">
								<p className="font-semibold">
									Listing price ($){' '}
									{autoPricingChecked ? (
										''
									) : (
										<span className="text-red-500">*</span>
									)}
								</p>
								<input
									type="text"
									value={purchasePrice}
									onChange={handlePurchasePriceChange}
									placeholder={autoPricingChecked ? 'Auto Calculated' : '0.00'}
									className="w-full border border-gray-300 rounded-xl pl-4 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
								<FormControlLabel
									control={
										<Switch
											checked={autoPricingChecked}
											onChange={(e) => setAutoPricingChecked(e.target.checked)}
										/>
									}
									label={
										autoPricingChecked
											? 'Auto Pricing Enabled'
											: 'Auto Pricing Disabled'
									}
								/>
								<div className="flex flex-row space-x-2 items-center">
									<BsFillInfoCircleFill className="text-blue-500 h-5 w-5" />
									<p className="text-sm">
										Automatically calculated based on your settings (200%
										markup)
									</p>
								</div>
							</div>
						</div>
					</div>
					<div className="rounded-lg bg-gray-20 border flex flex-col mx-4 my-6 p-4 space-y-2">
						<div className="flex flex-row space-x-1 items-center">
							<BsFillInfoCircleFill className="text-blue-500 h-5 w-5" />
							<h2 className="font-semibold text-lg">Item Details</h2>
						</div>
						<div className="w-full flex flex-col space-y-1 mb-2">
							<p className="font-semibold">Source (optional)</p>
							<input
								type="text"
								value={singleItem.source}
								onChange={(e) =>
									handleOptionalInfoChange('source', e.target.value)
								}
								placeholder="e.g. Thrift Store, Zara, etc."
								className="w-full border border-gray-300 rounded-xl pl-4 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
						<div className="w-full flex flex-col space-y-1 mb-4">
							<p className="font-semibold">Description (optional)</p>
							<input
								type="text"
								value={singleItem.description}
								onChange={(e) =>
									handleOptionalInfoChange('description', e.target.value)
								}
								placeholder="Brief description of the item"
								className="w-full border border-gray-300 rounded-xl pl-4 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
						<div className="w-full flex flex-col space-y-1 mb-4">
							<p className="font-semibold">Custom Tags (optional)</p>
							<input
								type="text"
								value={singleItem.customTags}
								onChange={(e) =>
									handleOptionalInfoChange('customTags', e.target.value)
								}
								placeholder="e.g. vintage, summer, etc."
								className="w-full border border-gray-300 rounded-xl pl-4 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
							<p className="text-sm font-light">
								{' '}
								Add custom tags to organize your items. Auto-tags will be
								generated too!
							</p>
						</div>
					</div>
				</div>
				<button
					className="bg-pink-300 hover:bg-rose-700 text-white font-bold py-3 px-6 rounded-full mx-auto mt-4"
					onClick={handleAddItem}
				>
					Add Item
				</button>
			</main>
		</div>
	);
};

export default Index;
