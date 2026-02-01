import { useState } from 'react';
import { FaShirt, FaDollarSign } from 'react-icons/fa6';
import { BsFillInfoCircleFill } from 'react-icons/bs';
import { IoIosClose } from 'react-icons/io';
import { BsRobot } from 'react-icons/bs';

import { garmentTypes } from '@/constants/garmentTypes';
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

const SingleItemInfoCard = ({ item }) => {
	// const [item, setItem] = useState([]);
	const [newPhotos, setNewPhotos] = useState(item.photos || []);
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [garmentType, setGarmentType] = useState(item.category || '');
	const [purchasePrice, setPurchasePrice] = useState<number | null>(
		item.purchase_price || null,
	);

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
			{i == 0 && (
				<div className="flex flex-col mt-3 mx-4 rounded-lg border">
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
					{/* <div className="grid grid-cols-2 gap-3 mt-3">
                                            {item.photos.map((photo, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={photo.preview}
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
                                        </div> */}
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
							value={purchasePrice ?? ''}
							onChange={handlePurchasePriceChange}
							placeholder="0.00"
							className="w-full border border-gray-300 rounded-xl pl-4 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
					{/* <div className="flex flex-col w-full space-y-1">
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
                                                    autoPricingChecked
                                                        ? 'Auto Calculated'
                                                        : singleItem.listingPrice
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
                                                    Automatically calculated based on your settings (200%
                                                    markup)
                                                </p>
                                            </div>
                                        </div> */}
				</div>
			</div>
			{/* <div className="rounded-lg bg-gray-20 border flex flex-col mx-4 my-6 p-4 space-y-2">
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
                                </div> */}
		</div>
	);
};

export default SingleItemInfoCard;
