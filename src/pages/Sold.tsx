import { useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient';
import { FaSearch } from 'react-icons/fa';

import ItemCard from '@/components/ItemCard';
import ItemCarousel from '@/components/ItemCarousel';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { StatusKey } from '@/constants/statusOptions';
import { findIcon } from '@/utils/findIcon';

// ✅ Correct type: values are Item[], not string[]
type CategorizedItems = {
	[key: string]: Object[];
};

const Sold = () => {
	const [query, setQuery] = useState('');
	const [items, setItems] = useState<any[]>([]);
	const [categories, setCategories] = useState<string[]>([]);
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

			const existingCategories = new Set<string>();
			let totalProfit = 0;

			const itemsWithPhotos = await Promise.all(
				data.map(async (item) => {
					existingCategories.add(item.category);
					const profit =
						item.listing_price && item.purchase_price
							? item.listing_price - item.purchase_price
							: 0;
					(totalProfit as any) += profit;

					if (!item.photos?.length) return { ...item, profit };

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
						profit,
					};
				}),
			);

			setItems(itemsWithPhotos);
			setCategories(Array.from(existingCategories));
		};

		fetchAndHydrate();
	}, []);

	console.log(items);

	// Update item status (local only for analytics)
	const handleStatusChange = (itemId: number, newStatus: StatusKey) => {
		console.log(`Change status of item ${itemId} to ${newStatus}`);
	};

	const cycleTime = (item: any) => {
		const listedDate = new Date(item.date_listed);
		const soldDate = new Date(item.date_sold);
		const diffTime = Math.abs(soldDate.getTime() - listedDate.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return `${diffDays} days`;
	};

	// Open delete modal
	// const triggerDeleteModal = (item: Item) => {
	// 	setItemToDelete(item);
	// };

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
			{!items.length && (
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
			{items.length > 0 && (
				<div className="max-w-[72rem] w-full mx-auto mt-4">
					<div className="flex md:flex-row justify-between text-xl font-semibold mb-4 px-6 pt-6">
						<h2>Items Sold: {items.length}</h2>
						<h2>
							Total profits: $
							{items.reduce((sum, item) => sum + item.profit, 0).toFixed(2)}
						</h2>
					</div>

					<div className="flex flex-col space-y-4">
						{categories.map((category) => (
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
									{items
										.filter((item) => item.category === category)
										.map((item, id) => (
											<li
												key={id}
												className="flex space-x-2 items-center text-gray-700"
											>
												<div className="h-20 w-20">
													{item.photoUrls?.[0] ? (
														<img
															src={item.photoUrls[0]}
															alt={item.id}
															className="object-cover h-full w-full"
														/>
													) : (
														<div className="h-20 w-20 rounded-lg bg-blue-100 flex items-center justify-center">
															{findIcon(item.category)}
														</div>
													)}
												</div>
												<div className="flex flex-col">
													<div>
														Date listed:{' '}
														{new Date(item.created_at).toLocaleDateString(
															'en-US',
														)}
													</div>
													<div>Date Listed: {item.date_listed}</div>
													<div>Date Sold: {item.date_sold}</div>
													<div>Cycle Time: {cycleTime(item)}</div>
													<div>Profit: ${item.profit.toFixed(2)}</div>
												</div>
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
