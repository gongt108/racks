import ItemCarousel from '@/components/Carousel';
import { garmentTypes } from '@/constants/garmentTypes';
import {
	FaBoxOpen,
	FaSearch,
	FaCalendarPlus,
	FaTrashAlt,
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


const ItemCard = ({item, handleStatusChange, triggerDeleteModal}) => {
				const status = STATUS_OPTIONS[item.status as StatusKey];

    return (
        <div
								key={item.id}
								className="bg-white rounded-lg shadow p-4 flex flex-col"
							>
								{/* Item image */}
								<ItemCarousel item={item} id={item.id} />

								{/* Item info */}
								<h2 className="text-lg font-semibold mb-1 mx-2">
									{item.name || `Item ${item.id + 1}`}
								</h2>
								<div className="flex flex-row items-center mb-2 mx-2">
									<FaCalendarPlus className="text-gray-400 mr-1 h-3 w-3" />
									<div className="text-sm text-gray-500">
										Added:{' '}
										{new Date(item.created_at).toLocaleDateString('en-US')}
									</div>
								</div>
								<div className="flex flex-row mx-2 mb-4">
									<div className="flex flex-col w-1/2">
										<p className="text-sm text-gray-500">Paid: </p>
										<p className="text-sm font-semibold text-gray-500">
											${item.purchase_price || 'N/A'}
										</p>
									</div>
									<div className="flex flex-col w-1/2">
										<p className="text-sm text-gray-500">Listed: </p>
										<p className="text-sm font-semibold text-gray-500">
											${item.listing_price}
										</p>
									</div>
								</div>

								{/* Status pill dropdown */}
								<div className="flex flex-row justify-between items-center mx-2 mt-auto">
									<FormControl>
										<div
											className={`px-3 inline-flex items-center rounded-full ${status.bgColor}`}
										>
											<Select
												value={item.status as StatusKey}
												onChange={(e) =>
													handleStatusChange(
														item.id,
														e.target.value as StatusKey,
													)
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
									<FaTrashAlt
										onClick={() => triggerDeleteModal(item)}
										className="text-red-500 w-4 h-4 cursor-pointer hover:text-red-700 transition"
									/>
								</div>
							</div>
    )
};

export default ItemCard;