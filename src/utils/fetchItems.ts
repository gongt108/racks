import { supabase } from '@/supabaseClient';

type Filters = {
	status: string;
	sortDate: 'asc' | 'desc' | 'none';
	sortPrice: 'asc' | 'desc' | 'none';
	dateRange: string;
	customDates: {
		start: string;
		end: string;
	};
};

export async function fetchItems(filters: Filters, searchQuery?: string) {
	let query = supabase.from('items').select('*');

	// ✅ status filter (DB-side)
	if (filters.status && filters.status !== 'all') {
		query = query.eq('status', filters.status);
	}

	// ✅ date filters (DB-side)
	if (filters.dateRange === 'week') {
		const d = new Date();
		d.setDate(d.getDate() - 7);
		query = query.gte('created_at', d.toISOString());
	}

	if (filters.dateRange === 'custom') {
		if (filters.customDates.start) {
			query = query.gte('created_at', filters.customDates.start);
		}
		if (filters.customDates.end) {
			query = query.lte('created_at', filters.customDates.end);
		}
	}

	// ✅ sorting (DB-side)
	if (filters.sortDate !== 'none') {
		query = query.order('created_at', {
			ascending: filters.sortDate === 'asc',
		});
	}

	if (filters.sortPrice !== 'none') {
		query = query.order('listing_price', {
			ascending: filters.sortPrice === 'asc',
		});
	}

	const { data, error } = await query;

	if (error || !data) {
		throw error;
	}

	// ✅ hydrate photo signed URLs
	const itemsWithPhotos = await Promise.all(
		data.map(async (item) => {
			if (!item.photos?.length) return item;

			const photoUrls = await Promise.all(
				item.photos.map(async (path: string) => {
					const { data } = await supabase.storage
						.from('item-photos')
						.createSignedUrl(path, 60 * 60);

					return data?.signedUrl ?? null;
				}),
			);

			return {
				...item,
				photoUrls: photoUrls.filter(Boolean),
			};
		}),
	);

	// ✅ client-side search filter
	const filtered = itemsWithPhotos.filter((item) => {
		if (!searchQuery) return true;
		return item.name
			?.toLowerCase()
			.includes(searchQuery.toLowerCase());
	});

	return filtered;
}
