import React, { memo, useMemo, useCallback } from 'react';
import ItemCarousel from './ItemCarousel';
import { FaCalendarPlus, FaTrashAlt } from 'react-icons/fa';
import { MenuItem, Select, FormControl } from '@mui/material';
import { STATUS_OPTIONS, StatusKey } from '@/constants/statusOptions';

type Props = {
	item: any;
	handleStatusChange: (id: number, status: StatusKey) => void;
	triggerDeleteModal: (item: any) => void;
};

const SoldItemCard = ({
	item,
	handleStatusChange,
	triggerDeleteModal,
}: Props) => {
	const status = STATUS_OPTIONS[item.status as StatusKey];

	// Memoized derived value
	const createdDate = useMemo(
		() => new Date(item.created_at).toLocaleDateString('en-US'),
		[item.created_at],
	);

	// Memoized handlers
	const onStatusChange = useCallback(
		(e: any) => {
			handleStatusChange(item.id, e.target.value as StatusKey);
		},
		[item.id, handleStatusChange],
	);

	const onDelete = useCallback(() => {
		triggerDeleteModal(item);
	}, [item, triggerDeleteModal]);

	return (
		<div className="bg-white rounded-lg shadow p-4 flex flex-col">
			<ItemCarousel item={item} id={item.id} />

			<h2 className="text-lg font-semibold mb-1 mx-2">
				{item.name || `Item ${item.id + 1}`}
			</h2>

			<div className="flex items-center mb-2 mx-2">
				<FaCalendarPlus className="text-gray-400 mr-1 h-3 w-3" />
				<span className="text-sm text-gray-500">Added: {createdDate}</span>
			</div>

			<div className="flex mx-2 mb-4">
				<div className="w-1/2">
					<p className="text-sm text-gray-500">Paid</p>
					<p className="text-sm font-semibold text-gray-500">
						${item.purchase_price || 'N/A'}
					</p>
				</div>

				<div className="w-1/2">
					<p className="text-sm text-gray-500">Listed</p>
					<p className="text-sm font-semibold text-gray-500">
						${item.listing_price}
					</p>
				</div>
			</div>

			<div className="flex justify-between items-center mx-2 mt-auto">
				<FormControl>
					<div
						className={`px-3 inline-flex items-center rounded-full ${status.bgColor}`}
					>
						<Select
							value={item.status as StatusKey}
							onChange={onStatusChange}
							variant="standard"
							disableUnderline
							className="text-white text-md cursor-pointer"
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
					onClick={onDelete}
					className="text-red-500 w-4 h-4 cursor-pointer hover:text-red-700 transition"
				/>
			</div>
		</div>
	);
};

export default memo(SoldItemCard);
