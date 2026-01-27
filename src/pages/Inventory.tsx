import { useState } from 'react';
import { FaBoxOpen, FaSearch } from 'react-icons/fa';

const Inventory = () => {
	const [query, setQuery] = useState('');
	const [items, setItems] = useState<Array<any>>([]); // Replace 'any' with your item type

	return (
		<div className="flex flex-col w-full h-full">
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
			<div className="flex-grow flex flex-col items-center justify-center text-center px-4 mt-8">
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
			</div>

			{/* Items Grid - Hidden when empty */}
			{items.length > 0 && (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
					{items.map((item) => (
						<div key={item.id} className="bg-white rounded-lg shadow p-4">
							{/* Item content */}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default Inventory;
