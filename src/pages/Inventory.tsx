import { useState } from 'react';
import { supabase } from '@/supabaseClient';
import { garmentTypes } from '@/constants/garmentTypes';
import { FaBoxOpen, FaSearch, FaCalendarPlus } from 'react-icons/fa';
import {
	MenuItem,
	Select,
	FormControl,
	FormControlLabel,
	InputLabel,
	Switch,
	SelectChangeEvent,
} from '@mui/material';

// Status options with hex colors for MUI
const STATUS_OPTIONS = {
	available: { label: 'Available', bgColor: 'bg-green-600' },
	sold: { label: 'Sold', bgColor: 'bg-red-600' },
	missingInfo: { label: 'Missing Info', bgColor: 'bg-yellow-500' },
	reserved: { label: 'Reserved', bgColor: 'bg-blue-600' },
} as const;

type StatusKey = keyof typeof STATUS_OPTIONS;

const Inventory = () => {
	const [query, setQuery] = useState('');
	// const [items, setItems] = useState<Array<any>>([1]); // Replace 'any' with your item type
	const [items, setItems] = useState([
		{
			id: 1,
			name: 'Blue Shirt',
			status: 'available' as StatusKey,
			img: null,
			type: 'shirt',
		},
		{
			id: 2,
			name: 'Red Dress',
			status: 'sold' as StatusKey,
			img: null,
			type: 'dress',
		},
		{
			id: 3,
			name: 'Yellow Jacket',
			status: 'missingInfo' as StatusKey,
			img: null,
			type: 'jacket',
		},
	]);

	// Update item status
	const handleStatusChange = (itemId: number, newStatus: StatusKey) => {
		setItems((prev) =>
			prev.map((item) =>
				item.id === itemId ? { ...item, status: newStatus } : item,
			),
		);
	};

	const findIcon = (type: string) => {
		const garment = garmentTypes.find((g) => g.value === type);

		if (!garment) return null;

		const Icon = garment.icon;
		return <Icon className="h-10 w-10 text-gray-500" />;
	};

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
			{/* {items.length > 0 && ( */}
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
				{items.map((item, id) => {
					const status = STATUS_OPTIONS[item.status as StatusKey];

					return (
						<div
							key={id}
							className="bg-white rounded-lg shadow p-4 flex flex-col"
						>
							{/* Item image */}
							<div className="h-40 w-full bg-gray-100 rounded-md mb-2 flex items-center justify-center">
								{item.img ? (
									<img
										src={item.img}
										alt={`Item ${id + 1}`}
										className="h-full object-contain"
									/>
								) : (
									findIcon(item.type)
								)}
							</div>

							{/* Item info */}
							<h2 className="text-lg font-semibold mb-1 mx-2">
								{item.name || `Item ${id + 1}`}
							</h2>
							<div className="flex flex-row items-center mb-2 mx-2">
								<FaCalendarPlus className="text-gray-400 mr-1 h-3 w-3" />
								<div className="text-sm text-gray-500">Added: </div>
							</div>
							<div className="flex flex-row mx-2 mb-4">
								<div className="flex flex-col w-1/2">
									<p className="text-sm text-gray-500">Paid: </p>
									<p className="text-sm font-semibold text-gray-500">$7.00</p>
								</div>
								<div className="flex flex-col w-1/2">
									<p className="text-sm text-gray-500">Listed: </p>
									<p className="text-sm font-semibold text-gray-500">$27.00</p>
								</div>
							</div>

							{/* Status pill dropdown */}
							<FormControl>
								<div
									className={`mx-4 px-3 inline-flex items-center rounded-full ${status.bgColor}`}
								>
									<Select
										value={item.status as StatusKey}
										onChange={(e) =>
											handleStatusChange(item.id, e.target.value as StatusKey)
										}
										variant="standard"
										disableUnderline
										className="w-full text-white text-md cursor-pointer"
									>
										{Object.entries(STATUS_OPTIONS).map(
											([key, { label, bgColor }]) => (
												<MenuItem key={key} value={key}>
													<div
														className={`px-3 py-1 rounded-full text-white text-sm ${bgColor}`}
													>
														{label}
													</div>
												</MenuItem>
											),
										)}
									</Select>
								</div>
							</FormControl>
						</div>
					);
				})}
			</div>

			{/* )} */}
		</div>
	);
};

export default Inventory;
