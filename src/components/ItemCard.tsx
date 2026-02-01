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

const ItemCard = ({ item, handleStatusChange, triggerDeleteModal }) => {
	const navigate = useNavigate();

	const status = STATUS_OPTIONS[item.status as StatusKey];

	const goToItem = (itemId) => {
		navigate(`/edit/${itemId}`);
	};

	return (
		<div
			key={item.id}
			className={`${status.bgColor} rounded-lg shadow p-4 flex flex-col`}
		>
			{/* Item image */}
			<ItemCarousel item={item} id={item.id} />

			{/* Item info */}
			<h2 className="text-lg font-semibold mb-1 mx-2">
				{item.name || `Item ${item.id + 1}`}
			</h2>
			<div className="flex flex-row items-center mb-2 mx-2">
				<FaCalendarPlus className="text-gray-400 mr-1 h-3 w-3" />
				<div className="text-sm text-black">
					Added: {new Date(item.created_at).toLocaleDateString('en-US')}
				</div>
			</div>
			<div className="flex flex-row mx-2 mb-4">
				<div className="flex flex-col w-1/2">
					<p className="text-sm text-black">Paid: </p>
					<p className="text-sm font-semibold text-black">
						${item.purchase_price || 'N/A'}
					</p>
				</div>
				<div className="flex flex-col w-1/2">
					<p className="text-sm text-black">Listed: </p>
					<p className="text-sm font-semibold text-black">
						${item.listing_price}
					</p>
				</div>
			</div>

			{/* Status pill dropdown */}
			<div className="flex flex-row justify-between items-center mx-2 mt-auto">
				<h2 className={`${status.textColor} font-semibold`}>{status.label}</h2>
				<FaRegEdit
					onClick={() => goToItem(item.id)}
					className="text-gray-500 w-5 h-5 cursor-pointer hover:text-black transition"
				/>
			</div>
		</div>
	);
};

export default ItemCard;
