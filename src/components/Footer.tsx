// src/components/Footer.tsx
import { useState } from 'react';
import {
	Add as AddIcon,
	Inventory as InventoryIcon,
	AttachMoney as AttachMoneyIcon,
	TrendingUp as TrendingUpIcon,
	PointOfSale as PointOfSaleIcon,
	Settings as SettingsIcon,
} from '@mui/icons-material';

const tabs = [
	{ id: 'add', label: 'Add Item', Icon: AddIcon },
	{ id: 'inventory', label: 'Inventory', Icon: InventoryIcon },
	{ id: 'sold', label: 'Sold Items', Icon: AttachMoneyIcon },
	{ id: 'dashboard', label: 'Dashboard', Icon: TrendingUpIcon },
	{ id: 'till', label: 'Till', Icon: PointOfSaleIcon },
	{ id: 'settings', label: 'Settings', Icon: SettingsIcon },
];

const Footer = () => {
	const [activeTab, setActiveTab] = useState<string>('add');

	return (
		<footer className="sticky bottom-0 border-t-2 border-pink-300 border-opacity-50 bg-white py-2">
			<div className="mx-auto flex w-full max-w-[72rem] justify-between px-4">
				{tabs.map(({ id, label, Icon }) => {
					const isActive = activeTab === id;

					return (
						<button
							key={id}
							type="button"
							onClick={() => setActiveTab(id)}
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
								className={`h-6 w-6 ${
									isActive ? 'text-pink-500' : 'text-gray-500'
								}`}
							/>

							<p
								className={`mt-1 text-sm ${
									isActive ? 'text-pink-500' : 'text-gray-600'
								}`}
							>
								{label}
							</p>
						</button>
					);
				})}
			</div>
		</footer>
	);
};

export default Footer;
