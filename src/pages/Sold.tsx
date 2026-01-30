import { useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient';
import { FaSearch } from 'react-icons/fa';

import ItemCard from '@/components/ItemCard';
import ItemCarousel from '@/components/Carousel';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { StatusKey } from '@/constants/statusOptions';

// ✅ Correct type: values are Item[], not string[]
type CategorizedItems = {
	[key: string]: Object[];
};

const Sold = () => {
	const [query, setQuery] = useState('');
	const [categorizedItems, setCategorizedItems] = useState<CategorizedItems>(
		{},
	);
	// const [itemToDelete, setItemToDelete] = useState<Item | null>(null);

	useEffect(() => {
		const fetchAndHydrate = async () => {
			const { data, error } = await supabase
				.from('items')
				.select('*')
				.eq('status', 'sold');

			if (error || !data) {
				console.error(error);
				return;
			}

			const itemsByCategory: CategorizedItems = {};

			await Promise.all(
				data.map(async (item) => {
					let photoUrls: string[] = [];

					if (item.photos?.length) {
						const signedUrls = await Promise.all(
							item.photos.map(async (path: string) => {
								const { data } = await supabase.storage
									.from('item-photos')
									.createSignedUrl(path, 60 * 60);

								return data?.signedUrl ?? null;
							}),
						);

						photoUrls = signedUrls.filter(Boolean) as string[];
					}

					const category = item.category || 'uncategorized';

					const enrichedItem = {
						...item,
						photoUrls,
						profit:
							item.listing_price && item.purchase_price
								? item.listing_price - item.purchase_price
								: 0,
					};

					if (!itemsByCategory[category]) {
						itemsByCategory[category] = [];
					}

					itemsByCategory[category].push(enrichedItem);
				}),
			);

			// ✅ FIXED: correct setter
			setCategorizedItems(itemsByCategory);
		};

		fetchAndHydrate();
	}, []);

	// ✅ Count derived from state (re-runs on render)
	const soldCount = (items: CategorizedItems): number => {
		return Object.values(items).reduce((total, arr) => total + arr.length, 0);
	};

	Object.entries(categorizedItems).map(([category, items]) =>
		items.map((item) => console.log(item)),
	);

	// Update item status (local only for analytics)
	const handleStatusChange = (itemId: number, newStatus: StatusKey) => {
		console.log(`Change status of item ${itemId} to ${newStatus}`);
	};

	// Open delete modal
	// const triggerDeleteModal = (item: Item) => {
	// 	setItemToDelete(item);
	// };

	const hasItems = Object.keys(categorizedItems).length > 0;

	return (
		<div className="flex flex-col w-full h-full relative">
			{/* Top Navigation */}
			<div className="bg-white w-full border-b border-gray-200">
				<div className="w-full max-w-7xl mx-auto flex justify-between items-center py-3 px-6">
					<div className="flex gap-2">
						<button className="border rounded-lg px-4 py-2 text-sm hover:bg-gray-50">
							Filter
						</button>
					</div>

					<div className="relative w-1/3">
						<FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
						<input
							type="text"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Search..."
							className="w-full border border-gray-300 rounded-full pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500"
						/>
					</div>
				</div>
			</div>

			{/* Empty State */}
			{!hasItems && (
				<div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 mx-6 mt-6 text-center">
					<h1 className="mb-2 text-3xl font-extrabold text-gray-800">
						No analytics available yet
					</h1>
					<p className="text-gray-500">
						Sold items will appear here once available.
					</p>
				</div>
			)}

			{/* Grouped Items */}
			{hasItems && (
				<div className="max-w-[72rem] w-full mx-auto mt-4">
					<div className="flex md:flex-row justify-between text-xl font-semibold mb-4 px-6 pt-6">
						<h2>Items Sold: {soldCount(categorizedItems)}</h2>
						<h2>
							Total profits: $
							{Object.values(categorizedItems)
								.flat()
								.reduce((sum, item) => sum + item.profit, 0)}
						</h2>
					</div>

					<div className="flex flex-col space-y-4">
						{Object.entries(categorizedItems).map(([category, items]) => (
							<div
								key={category}
								className="border rounded-lg p-4 shadow-sm bg-white"
							>
								{/* Category Title */}
								<h2 className="text-xl font-semibold capitalize mb-3">
									{category}
								</h2>
								{/* Map through items array */}
								<ul className="space-y-2">
									{items.map((item, id) => (
										<li key={id} className="flex text-gray-700">
											<div className="h-20 w-20">
												<img
													src={item.photoUrls?.[0] || ''}
													alt="Item"
													className="object-cover h-full w-full rounded-md border"
												/>
											</div>
											<span>{item.purchase_price}</span>
											<span>${item.listing_price}</span>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Delete Confirmation */}
			{/* <ConfirmModal
				isOpen={!!itemToDelete}
				title="Delete this item?"
				description={`Are you sure you want to remove ${
					itemToDelete?.name || `Item ${itemToDelete?.id}`
				}? This action can’t be undone.`}
				confirmText="Yes, delete 💔"
				cancelText="Never mind 💭"
				onConfirm={handleDelete}
				onCancel={() => setItemToDelete(null)}
			/> */}
		</div>
	);
};

export default Sold;
