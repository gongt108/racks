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

const EditItem = () => {
	// const status = STATUS_OPTIONS[item.status as StatusKey];
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
		<div className="flex flex-col w-full h-full relative">
			{isLoading ? (
				<div className="flex justify-center items-center h-full">
					<p>Loading item details...</p>
				</div>
			) : (
				<div className="p-6 w-full max-w-[48rem] mx-auto">
					<SingleItemInfoCard item={updatedItem} />
				</div>
			)}
		</div>
	);
};

export default EditItem;
