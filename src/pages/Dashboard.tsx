import { useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient';
import { Box, Typography, Stack } from '@mui/material';
import {
	WarningAmber as WarningAmberIcon,
	ListAlt as ListAltIcon,
	AutoAwesome as AutoAwesomeIcon,
	GridView as GridViewIcon,
	LocalOffer as LocalOfferIcon,
	CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { FaShirt, FaBoxesStacked } from 'react-icons/fa6';
import { FcSearch, FcSupport } from 'react-icons/fc';
import { IoDocumentText } from 'react-icons/io5';

type Stage = {
	label: string;
	value: string;
	icon: React.ReactNode;
	bgColor: string;
	iconBg: string;
	amountColor?: string;
};

const stages: Stage[] = [
	{
		label: 'Missing Info',
		value: 'missing',
		icon: <WarningAmberIcon />,
		bgColor: '#FDECEC',
		iconBg: '#E53935',
	},
	{
		label: 'Itemized',
		value: 'itemized',
		icon: <ListAltIcon />,
		bgColor: '#FCE4EC',
		iconBg: '#EC407A',
	},
	{
		label: 'Sanitized',
		value: 'sanitized',
		icon: <AutoAwesomeIcon />,
		bgColor: '#F3E5F5',
		iconBg: '#AB47BC',
	},
	{
		label: 'Racked',
		value: 'racked',
		icon: <GridViewIcon />,
		bgColor: '#EDE7F6',
		iconBg: '#7E57C2',
	},
	{
		label: 'Listed',
		value: 'listed',
		icon: <LocalOfferIcon />,
		bgColor: '#FCE4EC',
		iconBg: '#F06292',
	},
	{
		label: 'Sold',
		value: 'sold',
		icon: <CheckCircleIcon />,
		bgColor: '#E8F5E9',
		iconBg: '#2E7D32',
		amountColor: '#2E7D32',
	},
];

const Dashboard = () => {
	const [items, setItems] = useState<Array<any>>([]); // Replace 'any' with your item type
	useEffect(() => {
		// Fetch items from Supabase or your backend here
		const fetchItems = async () => {
			const { data, error } = await supabase.from('items').select('status');

			if (error) {
				console.error(error);
				return;
			}

			const statusCount = data.reduce((acc: any, item: any) => {
				acc[item.status] = (acc[item.status] || 0) + 1;
				return acc;
			}, {});

			const formattedData = Object.keys(statusCount).map((key) => ({
				status: key,
				count: statusCount[key],
			}));

			setItems(formattedData);
		};

		fetchItems();
	}, []);

	const getCountByValue = (value: string): number => {
		const match = items.find((item) => item.status === value);
		return match?.count ?? 0;
	};

	return (
		<div className="py-8 flex flex-col space-y-8 w-full">
			<div className="rounded-xl border border-pink-200 bg-white shadow-lg max-w-[72rem] w-full p-6 mx-auto">
				{/* Header */}
				<Stack direction="row" alignItems="center" spacing={2} mb={3}>
					<Box>
						<Box sx={{ width: 24, height: 4, bgcolor: 'grey.500', mb: 0.5 }} />
						<Box sx={{ width: 16, height: 4, bgcolor: 'grey.500', mb: 0.5 }} />
						<Box sx={{ width: 20, height: 4, bgcolor: 'grey.500' }} />
					</Box>
					<Typography variant="h5" fontWeight={600}>
						Inventory Pipeline
					</Typography>
				</Stack>
				{/* Pipeline */}
				<div className="flex flex-col md:flex-row justify-between space-x-2">
					{stages.map((stage) => (
						<div className="relative overflow-visible flex-1">
							<div
								key={stage.label}
								style={{ backgroundColor: stage.bgColor }}
								className={`relative rounded-sm p-4 text-center flex flex-col`}
							>
								<Box
									sx={{
										width: 48,
										height: 48,
										borderRadius: '50%',
										bgcolor: stage.iconBg,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										color: '#fff',
										mx: 'auto',
										mb: 2,
									}}
								>
									{stage.icon}
								</Box>
								<Typography variant="body2" color="text.secondary">
									{stage.label}
								</Typography>
								<Typography variant="h5" fontWeight={600}>
									{getCountByValue(stage.value)}
								</Typography>
								{/* <Chip
									label={`$${stage.amount.toFixed(2)}`}
									sx={{
										mt: 1.5,
										fontWeight: 500,
										bgcolor: stage.amountColor
											? 'rgba(46, 125, 50, 0.12)'
											: 'rgba(0,0,0,0.08)',
										color: stage.amountColor ?? 'text.primary',
									}}
								/> */}
							</div>
							{stage !== stages[stages.length - 1] && (
								<div className="invisible md:visible absolute top-0 right-[-1.5rem] h-full w-[3rem] bg-white [clip-path:polygon(75%_0%,100%_50%,75%_100%,0%_100%,25%_50%,0%_0%)] z-10"></div>
							)}
						</div>
					))}
				</div>
			</div>
			<div className="rounded-xl border border-pink-200 bg-white shadow-lg max-w-[72rem] w-full p-6 mx-auto flex flex-col">
				<div className="flex flex-row items-center  space-x-2">
					<FaShirt className="w-6 h-6" />
					<h1 className="font-semibold text-xl">Garment Type Analytics</h1>
				</div>
				<p>Track your inventory composition and performance by garment type</p>
				<div className="flex flex-col justify-center items-center space-x-2 mt-8">
					<FaShirt className="w-10 h-10 text-gray-400" />
					<p className="text-gray-500 my-2">
						No garment data yet. Add items with garment types to see analytics.
					</p>
					<div className="flex flex-row space-x-2 mb-2">
						<button className=" flex items-center text-gray-500 text-md font-bold border border-gray-600 shadow-lg px-4 py-2 rounded-full hover:text-black hover:bg-white transition-transform duration-200 hover:-translate-y-[2px] mt-2">
							<FcSearch className="mr-1" />
							Debug Data
						</button>
						<button className=" flex items-center text-white text-md font-bold bg-pink-300 shadow-lg px-4 py-2 rounded-full transition-transform duration-200 hover:-translate-y-[2px] mt-2">
							<FcSupport className="mr-1" />
							Repair Items
						</button>
					</div>
					<p className="text-gray-600 text-sm">
						Debug: Check console | Repair: Fix missing garment types
					</p>
				</div>
			</div>
			<div className="rounded-xl border border-pink-200 bg-white shadow-lg max-w-[72rem] w-full p-6 mx-auto flex flex-col">
				<div className="flex flex-row items-center  space-x-2">
					<IoDocumentText className="w-6 h-6" />
					<h1 className="font-semibold text-xl">Business Reports</h1>
				</div>
				<p>Generate comprehensive reports for your resale business</p>
				<div className="flex flex-col justify-center items-center space-x-2 mt-4">
					<div className="flex flex-row space-x-2 mb-2 w-full px-4">
						<div className="w-full flex flex-col items-center text-white text-md font-bold bg-pink-300 shadow-lg p-4 space-y-3 rounded-xl transition-transform duration-200 hover:-translate-y-[2px] ">
							<FaBoxesStacked className="text-white w-8 h-8" />
							<p>Repair Items</p>
							<p className="text-sm">Current stock status</p>
						</div>
						<div className="w-full flex flex-col items-center text-black text-md font-bold bg-gray-100 shadow-lg p-4 space-y-3 rounded-xl hover:text-black  transition-transform duration-200 hover:-translate-y-[2px]">
							<FaShirt className="w-8 h-8" />
							<p>Garment Analysis</p>
							<p className="text-sm">Type breakdown & analysis</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
