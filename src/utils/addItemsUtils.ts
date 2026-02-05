import { supabase } from '@/supabaseClient';
import { PhotoItem } from '@/utils/fileUploads';
import { toast } from 'react-toastify';

// export type AddItemArgs = {
// 	userId: string;
// 	garmentType: string;
// 	purchasePrice: number;
// 	autoPricingChecked: boolean;
// 	listingPrice: number | null;
// 	isPercentage: boolean;
// 	percentageMarkup: number;
// 	fixedMarkup: number;
// 	source?: string;
// 	description?: string;
// 	customTags?: string;
// 	photos: PhotoItem[];
// };

// export function validateAddItemInput(
// 	garmentType: string,
// 	purchasePrice: number | null,
// ) {
// 	if (!garmentType) throw new Error('Garment type is required');
// 	if (!purchasePrice) throw new Error('Purchase price is required');
// }

// export function calculateListingPrice({
// 	purchasePrice,
// 	autoPricingChecked,
// 	listingPrice,
// 	isPercentage,
// 	percentageMarkup,
// 	fixedMarkup,
// }: {
// 	purchasePrice: number;
// 	autoPricingChecked: boolean;
// 	listingPrice: number | null;
// 	isPercentage: boolean;
// 	percentageMarkup: number;
// 	fixedMarkup: number;
// }) {
// 	if (!autoPricingChecked) return listingPrice;

// 	const value = isPercentage
// 		? purchasePrice * (percentageMarkup / 100 + 1)
// 		: purchasePrice + fixedMarkup;

// 	return Number(value.toFixed(2));
// }

// export async function insertItemRecord(args: AddItemArgs) {
// 	const listingPrice = calculateListingPrice(args);

// 	const { data, error } = await supabase
// 		.from('items')
// 		.insert([
// 			{
// 				user_id: args.userId,
// 				category: args.garmentType,
// 				purchase_price: args.purchasePrice,
// 				listing_price: listingPrice,
// 				source: args.source || null,
// 				description: args.description || null,
// 				custom_tags: args.customTags?.trim().length
// 					? args.customTags.split(',').map((t) => t.trim())
// 					: [],
// 				status: 'itemized',
// 				photos: [],
// 			},
// 		])
// 		.select()
// 		.single();

// 	if (error || !data) throw error;
// 	return data;
// }

// export async function uploadItemPhotos(
// 	userId: string,
// 	itemId: string,
// 	photos: PhotoItem[],
// ) {
// 	const uploadedPaths: string[] = [];

// 	for (const photo of photos) {
// 		const filePath = `${userId}/${itemId}/${crypto.randomUUID()}`;

// 		const { error } = await supabase.storage
// 			.from('item-photos')
// 			.upload(filePath, photo.file);

// 		if (error) throw error;

// 		uploadedPaths.push(filePath);
// 	}

// 	return uploadedPaths;
// }

// export async function updateItemPhotos(itemId: string, paths: string[]) {
// 	if (!paths.length) return;

// 	const { error } = await supabase
// 		.from('items')
// 		.update({ photos: paths })
// 		.eq('id', itemId);

// 	if (error) throw error;
// }

// export async function createItemWithPhotos(args: AddItemArgs) {

// 	const item = await insertItemRecord(args);

// 	const paths = await uploadItemPhotos(args.userId, item.id, args.photos);

// 	await updateItemPhotos(item.id, paths);

// 	return item;
// }

export async function bulkInsertItems(
	photos: PhotoItem[],
	setBulkPhotos: React.Dispatch<React.SetStateAction<PhotoItem[]>>,
	setIsUploading: React.Dispatch<React.SetStateAction<boolean>>,
) {
	const {
		data: { user },
	} = await supabase.auth.getUser();

	console.log(JSON.stringify(user, null, 2));

	if (!user) {
		alert('You must be logged in to add an item');
		return;
	}

	setIsUploading(true);

	for (const photo of photos) {
		try {
			const { data: item, error: itemError } = await supabase
				.from('items')
				.insert([
					{
						user_id: user.id,
						status: 'missing',
						photos: [], // filled after upload
					},
				])
				.select()
				.single();
			if (itemError || !item) throw itemError;
			const filePath = `${user.id}/${item.id}/${crypto.randomUUID()}`;
			const { error: uploadError } = await supabase.storage
				.from('item-photos')
				.upload(filePath, photo.file);

			if (uploadError) throw uploadError;

			const { error: updateError } = await supabase
				.from('items')
				.update({ photos: [filePath] })
				.eq('id', item.id);

			if (updateError) throw updateError;
		} catch (err) {
			console.error(err.message);
			alert('Failed to add item. Please try again.');
		}
	}

	toast.success(`Successfully added ${photos.length} items!`);
	setBulkPhotos([]);
	setIsUploading(false);
}
