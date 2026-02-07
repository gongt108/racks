import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/supabaseClient';
import { toast } from 'react-toastify';

import SingleItemInfoCard from '@/components/SingleItemInfoCard';
import ItemCarousel from '../components/ItemCarousel';
import { garmentTypes } from '@/constants/garmentTypes';
import {
	FaBoxOpen,
	FaSearch,
	FaCalendarPlus,
	FaTrashAlt,
} from 'react-icons/fa';
import {
	MenuItem,
	Select,
	FormControl,
	FormControlLabel,
	InputLabel,
	Switch,
	SelectChangeEvent,
} from '@mui/material';
import { STATUS_OPTIONS, StatusKey } from '@/constants/statusOptions';

const EditItem = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [updatedItem, setUpdateditem] = useState({});
	const [photos, setPhotos] = useState<string[]>([]);

	const { itemId } = useParams();

	useEffect(() => {
		const fetchAndHydrate = async () => {
			const { data, error } = await supabase
				.from('items')
				.select('*')
				.eq('id', itemId)
				.single();

			if (error || !data) {
				console.error(error);
				return;
			}

			let photoUrls: string[] = [];

			if (data.photos?.length) {
				const signedUrls = await Promise.all(
					data.photos.map(async (path: string) => {
						const { data: signed } = await supabase.storage
							.from('item-photos')
							.createSignedUrl(path, 60 * 60);

						return signed?.signedUrl ?? null;
					}),
				);

				photoUrls = signedUrls.filter(Boolean) as string[];
			} else {
				photoUrls = [];
			}

			const enrichedItem = {
				...data,
				photoUrls,
			};

			setPhotos(photoUrls);
			setUpdateditem(enrichedItem);
			setIsLoading(false);
		};

		fetchAndHydrate();
	}, [itemId]);

	const handleUpdate = async (itemId: number, updatedFields: Partial<any>) => {
		const { data, error } = await supabase
			.from('items')
			.update(updatedFields)
			.eq('id', itemId)
			.single();
		if (error) {
			console.error('Error updating item:', error);
			return;
		}
		setUpdateditem(data);
		toast.success('Item updated successfully!');
	};

	// Confirm delete
	const handleDelete = async () => {
		if (!updatedItem) return;

		await supabase.from('items').delete().eq('id', itemId);
	};

	return (
		<div className="flex flex-col w-full h-[75vh]">
			{/* Top action bar: stays visible */}
			{!isLoading && (
				<div className="flex flex-row space-x-4 sticky top-0 z-10 bg-white/80 backdrop-blur-sm p-4 border-b border-gray-200 justify-center">
					<button
						onClick={handleDelete}
						className="bg-teal-300 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center"
					>
						<FaTrashAlt className="mr-2" />
						Update Item
					</button>
					<div
						onClick={handleDelete}
						className="hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center"
					>
						<FormControl fullWidth className="w-64">
							{' '}
							{/* Apply a Tailwind width utility */}
							<InputLabel id="select-label">Select Garment type...</InputLabel>
							<Select
								labelId="select-label"
								id="simple-select"
								// value={garmentType || ''}
								// onChange={handleTypeSelection}
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
					</div>
					<button
						onClick={handleDelete}
						className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center"
					>
						<FaTrashAlt className="mr-2" />
						Delete Item
					</button>
				</div>
			)}

			{/* Scrollable content */}
			<div className="flex-1 overflow-y-auto">
				{isLoading ? (
					<div className="flex justify-center items-center h-full">
						<p>Loading item details...</p>
					</div>
				) : (
					<div className="w-full max-w-[56rem] mx-auto p-6">
						<SingleItemInfoCard item={updatedItem} />
					</div>
				)}
			</div>
		</div>
	);
};

export default EditItem;
