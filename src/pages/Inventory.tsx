import { useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient';
import { FaBoxOpen, FaSearch } from 'react-icons/fa';

import ItemCard from '@/components/ItemCard';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { StatusKey } from '@/constants/statusOptions';

const Inventory = () => {
	const [query, setQuery] = useState('');
	const [items, setItems] = useState<any[]>([]);
	const [itemToDelete, setItemToDelete] = useState<any | null>(null);
	const [isEditing, setIsEditing] = useState(false);

	useEffect(() => {
		const fetchAndHydrate = async () => {
			const { data, error } = await supabase.from('items').select('*');

			if (error || !data) {
				console.error(error);
				return;
			}

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

			setItems(itemsWithPhotos);
			console.log(itemsWithPhotos);
		};

		fetchAndHydrate();
	}, []);

	// Update item status locally
	const handleStatusChange = (itemId: number, newStatus: StatusKey) => {
		setItems((prev) =>
			prev.map((item) =>
				item.id === itemId ? { ...item, status: newStatus } : item,
			),
		);
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
						<button className="border rounded-lg px-4 py-2 text-sm hover:bg-gray-50">
							Bulk Select
						</button>
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
							triggerDeleteModal={triggerDeleteModal}
							handleStatusChange={handleStatusChange}
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
		</div>
	);
};

export default Inventory;
