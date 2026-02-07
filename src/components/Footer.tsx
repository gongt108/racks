// src/components/Footer.tsx
import { useLocation, useNavigate } from 'react-router-dom';

import {
	Add as AddIcon,
	Inventory as InventoryIcon,
	AttachMoney as AttachMoneyIcon,
	TrendingUp as TrendingUpIcon,
	PointOfSale as PointOfSaleIcon,
	Settings as SettingsIcon,
} from '@mui/icons-material';

const Footer = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();

	const activeTab = pathname.split('/')[1] || 'add';

	const tabs = [
		{ id: 'add', label: 'Add Item', path: '/', Icon: AddIcon },
		{
			id: 'inventory',
			label: 'Inventory',
			path: '/inventory',
			Icon: InventoryIcon,
		},
		{ id: 'sold', label: 'Sold Items', path: '/sold', Icon: AttachMoneyIcon },
		{
			id: 'dashboard',
			label: 'Dashboard',
			path: '/dashboard',
			Icon: TrendingUpIcon,
		},
		{ id: 'till', label: 'Till', path: '/till', Icon: PointOfSaleIcon },
		{
			id: 'settings',
			label: 'Settings',
			path: '/settings',
			Icon: SettingsIcon,
		},
	];

	return (
		<footer className="sticky bottom-0 border-t-2 border-pink-300 border-opacity-50 bg-white py-2 dark:bg-zinc-700 dark:border-pink-500 dark:border-opacity-70">
			<div className="mx-auto flex w-full max-w-[72rem] justify-between px-4">
				{tabs.map(({ id, label, path, Icon }) => {
					const isActive = activeTab === id;

					return (
						<button
							key={id}
							onClick={() => navigate(path)}
							className={`flex flex-col items-center rounded-md border-2 px-6 py-2 transition
                ${
									isActive
										? 'border-pink-300 bg-pink-200 bg-opacity-30'
										: 'border-white hover:border-pink-300 hover:bg-pink-200 hover:bg-opacity-30'
								}
              `}
						>
							<Icon
								fontSize="medium"
								className={isActive ? 'text-pink-500' : 'text-gray-500'}
							/>
							<span
								className={`mt-1 text-sm ${
									isActive ? 'text-pink-500' : 'text-gray-600'
								}`}
							>
								{label}
							</span>
						</button>
					);
				})}
			</div>
		</footer>
	);
};

export default Footer;
