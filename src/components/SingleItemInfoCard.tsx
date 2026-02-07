import { useRef, useState } from 'react';
import { FaShirt, FaDollarSign } from 'react-icons/fa6';
import { BsFillInfoCircleFill } from 'react-icons/bs';
import { IoIosClose } from 'react-icons/io';
import { BsRobot } from 'react-icons/bs';

import { garmentTypes } from '@/constants/garmentTypes';
import { STATUS_OPTIONS } from '@/constants/statusOptions';

import {
	MenuItem,
	Select,
	FormControl,
	FormControlLabel,
	InputLabel,
	Switch,
	SelectChangeEvent,
} from '@mui/material';
import {
	triggerFileInput,
	handleBulkUpload,
	handleSingleUpload,
	removeImage,
	PhotoItem,
} from '@/utils/fileUploads';

import UploadIcon from '@mui/icons-material/Upload';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

const SingleItemInfoCard = ({ item }) => {
	// const [item, setItem] = useState([]);
	const [autoPricingChecked, setAutoPricingChecked] = useState(true);
	const [newPhotos, setNewPhotos] = useState(item.photos || []);
	const [photos, setPhotos] = useState<PhotoItem[]>([]);

	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [garmentType, setGarmentType] = useState(item.category || '');
	const [purchasePrice, setPurchasePrice] = useState<number | null>(
		item.purchase_price || null,
	);
	const [customTags, setCustomTags] = useState<string>('');
	const [singleItem, setSingleItem] = useState(item || {});

	const singleRef = useRef<HTMLInputElement | null>(null);
	const cameraRef = useRef<HTMLInputElement | null>(null);

	const handleSingleClick = () => triggerFileInput(singleRef);
	const handleCameraClick = () => triggerFileInput(cameraRef);

	const handleOptionalInfoChange = (field: string, value: string) => {
		setSingleItem((prev) => ({ ...prev, [field]: value }));
	};

	console.log(item);
	const i = 0;

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

	return (
		<div>
			<div className="flex flex-col md:flex-row w-full mt-2">
				<div
					onClick={handleSingleClick}
					className="w-full md:w-1/2 rounded-lg bg-gray-100 border-pink-200 border-2 border-dashed flex flex-col items-center text-center mx-4 p-4 space-y-2 hover:border-rose-400 hover:bg-pink-50 hover:shadow-lg hover:shadow-pink-100 transition"
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
						onChange={(e) => handleSingleUpload(e, setPhotos)}
					/>
				</div>
				<div
					onClick={handleCameraClick}
					className="w-full md:w-1/2 rounded-lg bg-gray-100 border-2 border-pink-200 border-dashed flex flex-col items-center text-center mx-4 p-4 space-y-2 hover:border-rose-400 hover:bg-pink-50 hover:shadow-lg hover:shadow-pink-100 transition"
				>
					<CameraAltIcon className="text-pink-300" />
					<p>Take photo</p>
					<input
						type="file"
						ref={cameraRef}
						className="hidden"
						accept="image/*"
						capture="environment"
						onChange={(e) => handleSingleUpload(e, setPhotos)}
					/>
				</div>
			</div>
			{item?.photoUrls?.length > 0 && (
				<div className="flex flex-col mt-3 mx-4 rounded-lg border ">
					<div className="flex flex-row justify-between mx-2 my-2 items-center">
						<h2 className="font-semibold">Photos</h2>
						<div
							onClick={() => setIsAnalyzing(true)}
							className=" flex flex-row items-center rounded-lg bg-gray-200 text-grey-300 px-2 py-1 text-gray-500 hover:bg-gray-300 hover:text-gray-800 hover:shadow-md font-semibold cursor-pointer"
						>
							<BsRobot className="h-4 w-4 mr-2" />
							<p>AI Scan</p>
						</div>
					</div>

					<div className="grid grid-cols-5 gap-3 mt-3 px-4 pb-8">
						{item?.photoUrls?.length > 0 &&
							item?.photoUrls.map((photo, index) => (
								<div key={index} className="relative group">
									<img
										src={photo}
										alt=""
										className="w-full h-24 object-cover rounded-lg"
									/>
									<button
										type="button"
										// onClick={() => removeImage(index, photos, setPhotos)}
										className="absolute top-1 right-1 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center bg-red-600 cursor-pointer"
									>
										<IoIosClose className="w-3 h-3" />
									</button>
								</div>
							))}
					</div>
				</div>
			)}

			{/* Item classification */}
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
						value={garmentType || ''}
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

			{/* Pricing info */}
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
							required
							value={purchasePrice ?? (0.0).toFixed(2)}
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
							value={
								autoPricingChecked ? 'Auto Calculated' : singleItem.listingPrice
							}
							onChange={(e) =>
								setSingleItem({
									...singleItem,
									listingPrice: Number(e.target.value),
								})
							}
							disabled={autoPricingChecked}
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
								Automatically calculated based on your settings (200% markup)
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Item classification */}
			<div className="rounded-lg bg-gray-100 border flex flex-col mx-4 my-6 p-4 space-y-2">
				<div className="flex flex-row space-x-1 items-center">
					<FaShirt className="text-purple-300 w-4 h-4" />
					<h2 className="font-semibold text-lg">Item Status</h2>
				</div>

				<FormControl fullWidth className="w-64">
					<InputLabel id="select-label">Select Item Status...</InputLabel>

					<Select
						labelId="select-label"
						id="simple-select"
						value={garmentType || ''}
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

			{/* Optional item info */}
			<div className="rounded-lg bg-gray-20 border flex flex-col mx-4 my-6 p-4 space-y-2">
				<div className="flex flex-row space-x-1 items-center">
					<BsFillInfoCircleFill className="text-blue-500 h-5 w-5" />
					<h2 className="font-semibold text-lg">Item Details (optional)</h2>
				</div>
				<div className="w-full flex flex-col space-y-1 mb-2">
					<p className="font-semibold">Name</p>
					<input
						type="text"
						value={singleItem.name}
						onChange={(e) => handleOptionalInfoChange('name', e.target.value)}
						placeholder="Item 321"
						className="w-full border border-gray-300 rounded-xl pl-4 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					<p className="text-sm text-gray-200"> *Autogenerated if left blank</p>
				</div>
				<div className="w-full flex flex-col space-y-1 mb-2">
					<p className="font-semibold">Source</p>
					<input
						type="text"
						value={singleItem.source}
						onChange={(e) => handleOptionalInfoChange('source', e.target.value)}
						placeholder="e.g. Thrift Store, Zara, etc."
						className="w-full border border-gray-300 rounded-xl pl-4 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
				<div className="w-full flex flex-col space-y-1 mb-4">
					<p className="font-semibold">Description</p>
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
					<p className="font-semibold">
						Custom Tags{' '}
						<span className="text-gray-500 text-sm">(separate by comma)</span>
					</p>
					<input
						type="text"
						value={customTags}
						onChange={(e) => setCustomTags(e.target.value)}
						placeholder="e.g. vintage, summer, etc."
						className="w-full border border-gray-300 rounded-xl pl-4 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					<p className="text-sm font-light">
						{' '}
						Add custom tags to organize your items. Auto-tags will be generated
						too!
					</p>
				</div>
			</div>
		</div>
	);
};

export default SingleItemInfoCard;
