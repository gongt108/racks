import { supabase } from '@/supabaseClient';
import { PhotoItem } from '@/utils/fileUploads';

export type AddItemArgs = {
	userId: string;
	garmentType: string;
	purchasePrice: number;
	autoPricingChecked: boolean;
	listingPrice: number | null;
	isPercentage: boolean;
	percentageMarkup: number;
	fixedMarkup: number;
	source?: string;
	description?: string;
	customTags?: string;
	photos: PhotoItem[];
};

export function validateAddItemInput(
	garmentType: string,
	purchasePrice: number | null
) {
	if (!garmentType) throw new Error('Garment type is required');
	if (!purchasePrice) throw new Error('Purchase price is required');
}

export function calculateListingPrice({
	purchasePrice,
	autoPricingChecked,
	listingPrice,
	isPercentage,
	percentageMarkup,
	fixedMarkup,
}: {
	purchasePrice: number;
	autoPricingChecked: boolean;
	listingPrice: number | null;
	isPercentage: boolean;
	percentageMarkup: number;
	fixedMarkup: number;
}) {
	if (!autoPricingChecked) return listingPrice;

	const value = isPercentage
		? purchasePrice * (percentageMarkup / 100 + 1)
		: purchasePrice + fixedMarkup;

	return Number(value.toFixed(2));
}

export async function insertItemRecord(args: AddItemArgs) {
	const listingPrice = calculateListingPrice(args);

	const { data, error } = await supabase
		.from('items')
		.insert([
			{
				user_id: args.userId,
				category: args.garmentType,
				purchase_price: args.purchasePrice,
				listing_price: listingPrice,
				source: args.source || null,
				description: args.description || null,
				custom_tags: args.customTags?.trim().length
					? args.customTags.split(',').map((t) => t.trim())
					: [],
				status: 'itemized',
				photos: [],
			},
		])
		.select()
		.single();

	if (error || !data) throw error;
	return data;
}

export async function uploadItemPhotos(
	userId: string,
	itemId: string,
	photos: PhotoItem[]
) {
	const uploadedPaths: string[] = [];

	for (const photo of photos) {
		const filePath = `${userId}/${itemId}/${crypto.randomUUID()}`;

		const { error } = await supabase.storage
			.from('item-photos')
			.upload(filePath, photo.file);

		if (error) throw error;

		uploadedPaths.push(filePath);
	}

	return uploadedPaths;
}

export async function updateItemPhotos(itemId: string, paths: string[]) {
	if (!paths.length) return;

	const { error } = await supabase
		.from('items')
		.update({ photos: paths })
		.eq('id', itemId);

	if (error) throw error;
}

export async function createItemWithPhotos(args: AddItemArgs) {
	validateAddItemInput(args.garmentType, args.purchasePrice);

	const item = await insertItemRecord(args);

	const paths = await uploadItemPhotos(args.userId, item.id, args.photos);

	await updateItemPhotos(item.id, paths);

	return item;
}
