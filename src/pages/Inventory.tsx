import { useState } from 'react';
import { supabase } from '@/supabaseClient';
import { garmentTypes } from '@/constants/garmentTypes';
import { FaBoxOpen, FaSearch } from 'react-icons/fa';
import { MenuItem, Select, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';

// Status options with hex colors for MUI
const STATUS_OPTIONS = {
	available: { label: 'Available', bgColor: '#16a34a', textColor: '#ffffff' },
	sold: { label: 'Sold', bgColor: '#dc2626', textColor: '#ffffff' },
	missingInfo: { label: 'Missing Info', bgColor: '#facc15', textColor: '#000000' },
	reserved: { label: 'Reserved', bgColor: '#3b82f6', textColor: '#ffffff' },
} as const;

type StatusKey = keyof typeof STATUS_OPTIONS;
	
const Inventory = () => {
	const [query, setQuery] = useState('');
	// const [items, setItems] = useState<Array<any>>([1]); // Replace 'any' with your item type
	const [items, setItems] = useState([
		{ id: 1, name: 'Blue Shirt', status: 'available' as StatusKey },
		{ id: 2, name: 'Red Dress', status: 'sold' as StatusKey },
		{ id: 3, name: 'Yellow Jacket', status: 'missingInfo' as StatusKey },
	]);

	// Update item status
	const handleStatusChange = (itemId: number, newStatus: StatusKey) => {
		setItems((prev) =>
			prev.map((item) => (item.id === itemId ? { ...item, status: newStatus } : item))
		);
	};

	const findIcon = (item) => {
		const Icon = item.icon
		return <Icon />
	}
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
			{/* {items.length > 0 && ( */}
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
	{items.map((item, id) => {
		const statusData = STATUS_OPTIONS[item.status];

		return (
			<div key={id} className="bg-white rounded-lg shadow p-4 flex flex-col">
				{/* Item image */}
				<div className="h-40 w-full bg-gray-100 rounded-md mb-4 flex items-center justify-center">
					<img src='' alt={`Item ${id + 1}`} className="h-full object-contain" />
				</div>

				{/* Item info */}
				<h2 className="text-lg font-semibold mb-2">{item.name || `Item ${id + 1}`}</h2>
				<p className="text-sm text-gray-500">Added: </p>
				<p className="text-sm text-gray-500">Paid: </p>
				<p className="text-sm text-gray-500 mb-2">Listed: </p>

				{/* Status badge */}
				<span
					className="inline-block px-3 py-1 rounded-full text-sm font-semibold mb-2"
					style={{
						backgroundColor: statusData.bgColor,
						color: statusData.textColor,
					}}
				>
					{statusData.label}
				</span>

				{/* Status dropdown (MUI) */}
				<FormControl sx={{ minWidth: 120, mt: 'auto' }}>
					<InputLabel id={`status-label-${id}`}>Status</InputLabel>
					<Select
						labelId={`status-label-${id}`}
						value={item.status}
						label="Status"
						onChange={(e) =>
							handleStatusChange(item.id, e.target.value as StatusKey)
						}
					>
						{Object.entries(STATUS_OPTIONS).map(([key, { label, bgColor, textColor }]) => (
							<MenuItem
								key={key}
								value={key}
								sx={{
									backgroundColor: bgColor,
									color: textColor,
									'&:hover': { opacity: 0.9 },
								}}
							>
								{label}
							</MenuItem>
						))}
					</Select>
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
