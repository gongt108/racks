import { useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient';
import { useSearchParams, useNavigate } from 'react-router-dom';

import { FaBoxOpen, FaSearch } from 'react-icons/fa';
import { IoIosFunnel } from 'react-icons/io';

import ItemCard from '@/components/ItemCard';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { STATUS_OPTIONS, StatusKey } from '@/constants/statusOptions';
import { fetchItems, Filters } from '@/utils/fetchItems';

import Modal from '@/components/ui/Modal';
import {
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	TextField,
} from '@mui/material';
import { toast } from 'react-toastify';

const Inventory = () => {
	const [query, setQuery] = useState('');
	const [items, setItems] = useState<any[]>([]);
	const [itemToDelete, setItemToDelete] = useState<any | null>(null);
	const [isEditing, setIsEditing] = useState(false);

	// Mark as sold modal states
	const [salePrice, setSalePrice] = useState('');
	const [platform, setPlatform] = useState('');
	const [showSoldModal, setShowSoldModal] = useState(false);

	const [selectedItem, setSelectedItem] = useState(null);
	const [filtersSettingsOpen, setFiltersSettingsOpen] = useState(false);
	const [searchParams] = useSearchParams();

	const status = searchParams.get('status') || 'all';

	const [filters, setFilters] = useState<Filters>({
		status: status,
		sortDate: 'asc',
		sortPrice: 'none',
		dateRange: 'all',
		customDates: {
			start: '',
			end: '',
		},
	});

	const navigate = useNavigate();

	useEffect(() => {
		const run = async () => {
			try {
				const result = await fetchItems(filters, query);
				setItems(result);
			} catch (err) {
				console.error(err);
			}
		};

		run();
	}, [filters, query]);

	const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
		setFilters((prev) => ({ ...prev, [key]: value }));
	};

	const openSoldModal = (item) => {
		setSelectedItem(item);
		setShowSoldModal(true);
	};

	const closeSoldModal = () => {
		setShowSoldModal(false);
		setSelectedItem(null);
	};

	const confirmMarkSold = async () => {
		if (!selectedItem) return;

		if (selectedItem.status === 'sold') {
			toast.error('Item is already marked as sold');
			return;
		}

		if (selectedItem.status === 'missing') {
			toast.error(
				'Item is missing information and cannot be marked as sold. Please edit the item details first.',
			);
			return;
		}

		// 1. Update item status
		const { error: updateError } = await supabase
			.from('items')
			.update({
				status: 'sold',
				sale_price: parseFloat(salePrice).toFixed(2),
				platform: platform,
				date_sold: new Date().toISOString(),
			})
			.eq('id', selectedItem.id);

		if (updateError) {
			console.error('Error updating item:', updateError);
			return;
		}

		closeSoldModal();
		navigate('/sold');
	};

	// Open delete modal
	const triggerDeleteModal = (item: any) => {
		setItemToDelete(item);
	};

	// Confirm delete
	const handleDelete = async () => {
		if (!itemToDelete) return;

		await supabase.from('items').delete().eq('id', itemToDelete.id);

		setItems((prev) => prev.filter((i) => i.id !== itemToDelete.id));
		setItemToDelete(null);
	};

	return (
		<div className="flex flex-col w-full h-full relative">
			{/* Top Navigation Bar */}
			<div className="bg-white w-full border-b border-gray-200">
				<div className="w-full max-w-7xl mx-auto flex justify-between items-center py-3 px-6">
					<div className="flex gap-2">
						<button className="border rounded-full px-4 py-2hover:bg-gray-50">
							Bulk Select
						</button>
						<button
							onClick={() => setFiltersSettingsOpen(true)}
							className="border rounded-full px-4 py-2 items-center  bg-rose-400 text-white font-bold hover:bg-rose-500 shadow-lg transition-transform duration-300 hover:-translate-y-[1px]"
						>
							<IoIosFunnel className="inline mr-2 mb-1" />
							Filters
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
			{items.length === 0 && (
				<div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 mx-6 mt-6 text-center">
					<FaBoxOpen className="mx-auto mb-6 text-7xl text-gray-300" />
					<h1 className="mb-2 text-3xl font-extrabold text-gray-800">
						No items in inventory
					</h1>
					<p className="text-lg text-gray-500 max-w-md mx-auto">
						Add your first item using the{' '}
						<span className="font-semibold text-blue-600">Add Item</span> tab.
					</p>
				</div>
			)}

			{/* Items Grid */}
			{items.length > 0 && (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6 max-w-[80rem] mx-auto">
					{items.map((item) => (
						<ItemCard
							key={item.id}
							item={item}
							openSoldModal={() => openSoldModal(item)}
						/>
					))}
				</div>
			)}

			{/* Reusable Confirm Modal */}
			<ConfirmModal
				isOpen={!!itemToDelete}
				title="Delete this item?"
				description={`Are you sure you want to remove ${
					itemToDelete?.name || `Item ${itemToDelete?.id}`
				}? This action can’t be undone.`}
				confirmText="Yes, delete 💔"
				cancelText="Never mind 💭"
				onConfirm={handleDelete}
				onCancel={() => setItemToDelete(null)}
			/>

			{/* Filters Settings Modal */}
			<Modal
				isOpen={filtersSettingsOpen}
				onClose={() => setFiltersSettingsOpen(false)}
			>
				<div className="flex flex-col">
					<div className="w-full flex flex-row items-center justify-center mb-4 border-b pb-3">
						<IoIosFunnel className="text-2xl mr-2" />
						<h2 className="text-2xl font-semibold">Filter Items</h2>
					</div>
					{/* Filter options would go here */}
					<FormControl className="space-y-5">
						{/* Status */}
						<div className="space-y-1">
							<label className="block text-sm font-semibold text-gray-600">
								Status
							</label>
							<select
								onChange={(e) => updateFilter('status', e.target.value)}
								value={filters.status}
								className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-sm transition
			focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-1
			hover:border-gray-400"
							>
								<option value="all">All</option>
								{Object.entries(STATUS_OPTIONS).map(([key, { label }]) => (
									<option key={key} value={key}>
										{label}
									</option>
								))}
							</select>
						</div>

						{/* Sort by Date */}
						<div className="space-y-1">
							<label className="block text-sm font-semibold text-gray-600">
								Sort by Date
							</label>
							<select
								className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-sm transition
								focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-1
								hover:border-gray-400"
								value={filters.sortDate}
								onChange={(e) =>
									updateFilter(
										'sortDate',
										e.target.value as Filters['sortDate'],
									)
								}
							>
								<option value="asc">Newest to Oldest</option>
								<option value="desc">Oldest to Newest</option>
							</select>
						</div>

						{/* Sort by Price */}
						<div className="space-y-1">
							<label className="block text-sm font-semibold text-gray-600">
								Sort by Price
							</label>
							<select
								className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-sm transition
								focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-1
								hover:border-gray-400"
								value={filters.sortPrice}
								onChange={(e) =>
									updateFilter(
										'sortPrice',
										e.target.value as Filters['sortPrice'],
									)
								}
							>
								<option value="none">None</option>
								<option value="asc">Low to High</option>
								<option value="desc">High to Low</option>
							</select>
						</div>

						{/* Date Added */}
						<div className="space-y-1">
							<label className="block text-sm font-semibold text-gray-600">
								Date Added
							</label>
							<select
								className="w-full mb-4 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-sm transition
								focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-1
								hover:border-gray-400"
								value={filters.dateRange}
								onChange={(e) => updateFilter('dateRange', e.target.value)}
							>
								<option value="all">All Time</option>
								<option value="today">Today</option>
								<option value="week">This Week</option>
								<option value="month">This Month</option>
								<option value="year">This Year</option>
								<option value="custom">Custom Range</option>
							</select>

							{filters.dateRange === 'custom' && (
								<div className="flex flex-row space-x-2">
									<div>
										<p className="text-sm text-gray-600">Start Date</p>
										<input
											type="date"
											value={filters.customDates.start}
											onChange={(e) =>
												updateFilter('customDates', {
													...filters.customDates,
													start: e.target.value,
												})
											}
											className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-sm transition
											focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-1
											hover:border-gray-400"
										/>
									</div>
									<div>
										<p className="text-sm text-gray-600">End Date</p>
										<input
											type="date"
											value={filters.customDates.end}
											onChange={(e) =>
												updateFilter('customDates', {
													...filters.customDates,
													end: e.target.value,
												})
											}
											className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-sm transition
											focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-1
											hover:border-gray-400"
										/>
									</div>
								</div>
							)}
						</div>
					</FormControl>

					<div className="mt-6 flex items-center justify-end gap-3">
						<button
							type="button"
							onClick={() => {
								// reset all filters here
								updateFilter('status', 'all');
								updateFilter('sortDate', 'asc');
								updateFilter('sortPrice', 'none');
								updateFilter('dateRange', 'all');
								updateFilter('customDates', { start: '', end: '' });
								setFiltersSettingsOpen(false);
							}}
							className="rounded-full px-4 py-2 text-sm font-medium text-gray-600
			hover:text-gray-800 hover:bg-gray-100 transition"
						>
							Clear all
						</button>

						<button
							type="button"
							onClick={() => {
								// apply filters here
								setFiltersSettingsOpen(false);
							}}
							className="rounded-full bg-pink-500 px-5 py-2 text-sm font-semibold text-white
			shadow-sm transition
			hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
						>
							Apply
						</button>
					</div>
				</div>
			</Modal>

			{/* Mark as Sold Modal */}
			<Modal isOpen={showSoldModal} onClose={() => closeSoldModal()}>
				{showSoldModal && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
						<div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6">
							<h2 className="text-lg font-semibold mb-2">Mark item as sold?</h2>

							<p className="text-sm text-gray-600 mb-6">
								This will move the item to your Sold inventory.
							</p>

							<form
								onSubmit={(e) => {
									e.preventDefault();
									confirmMarkSold();
								}}
								className="space-y-4"
							>
								{/* Sale Price */}
								<TextField
									label="Sale price"
									value={salePrice}
									onChange={(e) => setSalePrice(e.target.value)}
									placeholder="$0.00"
									size="small"
									fullWidth
								/>

								{/* Platform */}
								<FormControl fullWidth size="small">
									<InputLabel id="platform-label">Platform</InputLabel>
									<Select
										labelId="platform-label"
										label="Platform"
										value={platform}
										onChange={(e) => setPlatform(e.target.value)}
									>
										<MenuItem value="poshmark">Poshmark</MenuItem>
										<MenuItem value="mercari">Mercari</MenuItem>
										<MenuItem value="ebay">eBay</MenuItem>
										<MenuItem value="facebook">Facebook Marketplace</MenuItem>
										<MenuItem value="other">Other</MenuItem>
									</Select>
								</FormControl>

								{/* Actions */}
								<div className="flex justify-end gap-3 pt-2">
									<button
										type="button"
										onClick={closeSoldModal}
										className="px-4 py-2 text-sm rounded-md border hover:bg-gray-100"
									>
										Cancel
									</button>

									<button
										type="submit"
										className="px-4 py-2 text-sm rounded-md bg-green-600 text-white hover:bg-green-700"
									>
										Yes, mark sold
									</button>
								</div>
							</form>
						</div>
					</div>
				)}
			</Modal>
		</div>
	);
};

export default Inventory;
