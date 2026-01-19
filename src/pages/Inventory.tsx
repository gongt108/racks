import { useState } from 'react';
import { FaBoxOpen, FaSearch } from 'react-icons/fa';

const Inventory = () => {
	const [query, setQuery] = useState('');

	return (
		<div className="flex flex-col items-center justify-center">
			<div className="bg-white w-full items-center justify-center">
				<div className="w-full max-w-[72rem] mx-auto flex flex-row justify-between py-2">
					<div className="flex flex-row border rounded-lg">
						<div className="flex flex-row">
							<FaSearch />
							<div>Bulk Select</div>
						</div>
						<div>Filter</div>
					</div>
					<div className="relative w-1/3">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<FaSearch className="text-gray-400" />
						</div>
						<input
							type="text"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Search..."
							className="w-full border border-gray-300 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
				</div>
			</div>
			<div className="text-center text-gray-500 mt-8">
				<FaBoxOpen className="mx-auto mb-4 text-6xl" />
				<h1 className="mb-4 text-4xl font-bold">No items in inventory</h1>
				<p className="mb-4 text-xl text-gray-600">
					Add your first item using the "Add Item" tab
				</p>
			</div>
		</div>
	);
};

export default Inventory;
