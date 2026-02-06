import { useNavigate } from 'react-router-dom';

import ItemCarousel from './ItemCarousel';
import { garmentTypes } from '@/constants/garmentTypes';
import {
	FaBoxOpen,
	FaSearch,
	FaCalendarPlus,
	FaTrashAlt,
	FaRegEdit,
} from 'react-icons/fa';
import {
	MenuItem,
	Select,
	FormControl,
	FormControlLabel,
	InputLabel,
	Switch,
	SelectChangeEvent,
} from '@mui/material';
import { STATUS_OPTIONS, StatusKey } from '@/constants/statusOptions';

const ItemCard = ({ item, openSoldModal }) => {
	const navigate = useNavigate();
	const status = STATUS_OPTIONS[item.status as StatusKey];

	const goToItem = (itemId) => {
		navigate(`/edit/${itemId}`);
	};

	const markAsSold = () => {
		// TODO: hook this up to your update logic
		console.log('mark sold', item.id);
	};

	return (
		<div
			key={item.id}
			className={`${status.borderColor} border-2 bg-white rounded-xl shadow-sm hover:shadow-md transition flex flex-col overflow-hidden`}
		>
			{/* Item image */}
			<ItemCarousel item={item} id={item.id} />

			{/* Header */}
			<div className="px-4 pt-4 flex justify-between items-start">
				<h2 className="text-lg font-semibold leading-tight">
					{item.name || `Item ${item.id + 1}`}
				</h2>

				<span
					className={`text-xs font-semibold px-2 py-1 rounded-full ${status.bgColor} ${status.textColor}`}
				>
					{status.label}
				</span>
			</div>

			{/* Date */}
			<div className="flex items-center text-xs text-gray-500 px-4 mt-1">
				<FaCalendarPlus className="mr-1 h-3 w-3" />
				Added {new Date(item.created_at).toLocaleDateString('en-US')}
			</div>

			{/* Prices */}
			<div className="grid grid-cols-2 gap-4 px-4 my-4">
				<div>
					<p className="text-xs text-gray-500">Paid</p>
					<p className="text-base font-semibold">
						${item.purchase_price || 'N/A'}
					</p>
				</div>

				<div>
					<p className="text-xs text-gray-500">Listed</p>
					<p className="text-base font-semibold">${item.listing_price}</p>
				</div>
			</div>

			{/* Actions */}
			<div className="flex items-center justify-between px-4 pb-4 mt-auto">
				{item.status !== 'sold' ? (
					<button
						onClick={() => openSoldModal(item.id)}
						className="text-sm font-medium px-3 py-1.5 rounded-md bg-green-100 text-green-700 hover:bg-green-200 transition"
					>
						Mark as Sold
					</button>
				) : (
					<span className="text-sm font-semibold text-green-700">✓ Sold</span>
				)}

				<FaRegEdit
					onClick={() => goToItem(item.id)}
					className="text-gray-400 w-5 h-5 cursor-pointer hover:text-black transition"
				/>
			</div>
		</div>
	);
};

export default ItemCard;
