import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/supabaseClient';
import { FaSearch } from 'react-icons/fa';
import {
	ResponsiveContainer,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
} from 'recharts';

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
	const [expandedCategories, setExpandedCategories] = useState<
		Record<string, boolean>
	>({});

	const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

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

	const totalProfit = items.reduce((sum, item) => sum + item.profit, 0);

	const totalProfitByCategory = (category: string) =>
		items
			.filter((item) => item.category === category)
			.reduce((sum, item) => sum + item.profit, 0);

	const avgCycleTimeByCategory = (category: string) => {
		const categoryItems = items.filter((item) => item.category === category);

		if (categoryItems.length === 0) return 0;

		const totalDays = categoryItems.reduce(
			(sum, item) => sum + cycleTime(item),
			0,
		);

		return Math.round(totalDays / categoryItems.length);
	};

	const toggleCategory = (category: string) => {
		setExpandedCategories((prev) => ({
			...prev,
			[category]: !prev[category],
		}));
	};

	const expandAndScrollToCategory = (category: string) => {
		// expand it
		setExpandedCategories((prev) => ({
			...prev,
			[category]: true,
		}));

		// scroll to it (after state update)
		setTimeout(() => {
			categoryRefs.current[category]?.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});
		}, 100);
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
				<div className="max-w-[72rem] w-full mx-auto mt-6 px-4 space-y-6">
					{/* 🌸 Summary Cards */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-2xl p-6 shadow">
							<p className="text-sm opacity-80">Items Sold</p>
							<h2 className="text-3xl font-bold">{items.length}</h2>
						</div>

						<div className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-2xl p-6 shadow">
							<p className="text-sm opacity-80">Total Profit</p>
							<h2 className="text-3xl font-bold">${totalProfit.toFixed(2)}</h2>
						</div>
					</div>

					{/* 📊 Profit Chart */}
					<div className="bg-white rounded-2xl p-6 shadow">
						<h3 className="text-lg font-semibold mb-4">Profit by Category</h3>

						<div className="w-full h-64">
							<ResponsiveContainer width="100%" height="100%">
								<BarChart
									data={categories.map((category) => ({
										category,
										profit: totalProfitByCategory(category),
									}))}
									onClick={(state) => {
										const label = state?.activeLabel;

										if (typeof label === 'string') {
											expandAndScrollToCategory(label);
										}
									}}
								>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="category" />
									<YAxis />
									<Tooltip />
									<Bar dataKey="profit" fill="#6366f1" radius={[6, 6, 0, 0]} />
								</BarChart>
							</ResponsiveContainer>
						</div>
					</div>

					{/* 🧺 Category Cards */}
					<div className="max-w-[72rem] mx-auto space-y-6 px-4">
						{categories.map((category) => {
							const isExpanded = expandedCategories[category];

							return (
								<div
									key={category}
									ref={(el) => {
										categoryRefs.current[category] = el;
									}}
									className="bg-white rounded-2xl border shadow-sm"
								>
									{/* 🧾 Category Header */}
									<button
										onClick={() => toggleCategory(category)}
										className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition rounded-2xl"
									>
										<div className="flex flex-col text-left">
											<h2 className="text-xl font-semibold capitalize">
												{category}
											</h2>
											<p className="text-sm text-gray-500">
												Avg cycle: {avgCycleTimeByCategory(category)} days
											</p>
										</div>

										<div className="flex items-center gap-6">
											<div className="text-right">
												<p className="text-sm text-gray-500">Total Profit</p>
												<p className="text-lg font-semibold text-emerald-600">
													${totalProfitByCategory(category).toFixed(2)}
												</p>
											</div>

											{/* Chevron */}
											<span
												className={`transform transition-transform ${
													isExpanded ? 'rotate-180' : ''
												}`}
											>
												⌄
											</span>
										</div>
									</button>

									{/* 📦 Items Grid (Expandable) */}
									{isExpanded && (
										<div className="px-6 pb-6">
											<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
												{items
													.filter((item) => item.category === category)
													.map((item) => (
														<div
															key={item.id}
															className="bg-gray-50 rounded-xl border p-4 space-y-3 hover:shadow transition"
														>
															{/* Image / Icon */}
															<div className="h-32 w-full rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
																{item.photoUrls?.[0] ? (
																	<img
																		src={item.photoUrls[0]}
																		alt={item.id}
																		className="object-cover h-full w-full"
																	/>
																) : (
																	findIcon(item.category)
																)}
															</div>

															{/* Item Info */}
															<div className="text-sm space-y-1">
																<div className="font-medium">
																	Profit:{' '}
																	<span className="text-emerald-600">
																		${item.profit.toFixed(2)}
																	</span>
																</div>
																<div className="text-gray-500">
																	Cycle: {cycleTime(item)} days
																</div>
																<div className="text-gray-400 text-xs">
																	Sold:{' '}
																	{new Date(
																		item.date_sold,
																	).toLocaleDateString()}
																</div>
															</div>
														</div>
													))}
											</div>
										</div>
									)}
								</div>
							);
						})}
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
