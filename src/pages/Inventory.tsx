import { Key, useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient';
import {
	FaBoxOpen,
	FaSearch,
	FaCalendarPlus,
	FaTrashAlt,
} from 'react-icons/fa';

import ItemCard from '@/components/ItemCard';

const Inventory = () => {
	const [query, setQuery] = useState('');
	const [items, setItems] = useState<Array<any>>([]); // Replace 'any' with your item type
	const [isDeleting, setIsDeleting] = useState(false);
	const [itemToDelete, setItemToDelete] = useState(null);

	useEffect(() => {
		const fetchAndHydrate = async () => {
			const { data, error } = await supabase.from('items').select('*');

			if (error || !data) {
				console.error(error);
				return;
			}

			const itemsWithPhotos = await Promise.all(
				data.map(async (item) => {
					if (item.photos == 0) return item;

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

			setItems(itemsWithPhotos);
		};

		fetchAndHydrate();
	}, []);

	console.log(items);

	// Update item status
	const handleStatusChange = (itemId: number, newStatus: StatusKey) => {
		setItems((prev) =>
			prev.map((item) =>
				item.id === itemId ? { ...item, status: newStatus } : item,
			),
		);
	};

	const triggerDeleteModal = (item) => {
		// Implement delete modal trigger logic here
		console.log('Trigger delete modal for item ID:', item.id);
		setIsDeleting(true);
		setItemToDelete(item);
	};

	return (
		<div className="flex flex-col w-full h-full relative">
			{/* Top Navigation Bar */}
			<div className="bg-white w-full border-b border-gray-200">
				<div className="w-full max-w-7xl mx-auto flex flex-row justify-between items-center py-3 px-6">
					{/* Action Buttons */}
					<div className="flex flex-row gap-2">
						<button className="flex items-center gap-2 border rounded-lg px-4 py-2 hover:bg-gray-50 transition">
							<FaSearch className="text-sm" />
							<span className="text-sm font-medium">Bulk Select</span>
						</button>
						<button className="border rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50 transition">
							Filter
						</button>
					</div>

					{/* Search Bar */}
					<div className="relative w-1/3">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<FaSearch className="text-gray-400" />
						</div>
						<input
							type="text"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Search..."
							className="w-full border border-gray-300 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
						/>
					</div>
				</div>
			</div>

			{/* Empty State Content */}
			{items.length == 0 && (
				<div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
					<FaBoxOpen className="mx-auto mb-6 text-7xl text-gray-300" />
					<h1 className="mb-2 text-3xl font-extrabold text-gray-800">
						No items in inventory
					</h1>
					<p className="text-lg text-gray-500 max-w-md">
						Your inventory is looking a bit lonely. Add your first item using
						the <span className="font-semibold text-blue-600">"Add Item"</span>{' '}
						tab.
					</p>
				</div>
			)}

			{/* Items Grid - Hidden when empty */}
			{items.length > 0 && (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
					{items.map((item, id) => {
						return ( <ItemCard item={item} triggerDeleteModal={triggerDeleteModal} handleStatusChange={handleStatusChange} />
						);
					})}
				</div>
			)}
			{isDeleting && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
					onClick={() => {
						setIsDeleting(false);
						setItemToDelete(null);
					}}
				>
					<div
						className="bg-white rounded-2xl shadow-xl p-6 w-80 text-center animate-scale-in"
						onClick={(e) => e.stopPropagation()} // 👈 THIS is the key
					>
						<div className="text-4xl mb-2">🗑️</div>

						<h2 className="text-lg font-semibold mb-2">Delete this item?</h2>

						<p className="text-sm text-gray-600 mb-5">
							Are you sure you want to remove{' '}
							<span className="font-medium text-gray-800">
								{itemToDelete?.name || `Item ${itemToDelete?.id}`}
							</span>
							?
							<br />
							This action can’t be undone.
						</p>

						<div className="flex gap-3 justify-center">
							<button
								className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
								onClick={() => {
									setIsDeleting(false);
									setItemToDelete(null);
								}}
							>
								Never mind 💭
							</button>

							<button
								className="px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
								//   onClick={handleDelete}
							>
								Yes, delete 💔
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Inventory;
