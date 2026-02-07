import { useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { useSettings } from '@/context/SettingsContext';
import { toast } from 'react-toastify';

const Settings = () => {
	const {
		percentageMarkup,
		fixedMarkup,
		isPercentage,
		setPercentageMarkup,
		setFixedMarkup,
		setIsPercentage,
	} = useSettings();

	const { user } = useAuth();

	const [emailNotifications, setEmailNotifications] = useState(true);
	const [inAppAlerts, setInAppAlerts] = useState(true);
	const [isEditingValue, setIsEditingValue] = useState(false);
	const activeValue = isPercentage ? percentageMarkup : fixedMarkup;
	const setActiveValue = isPercentage ? setPercentageMarkup : setFixedMarkup;
	const [dark, setDark] = useState(false);

	useEffect(() => {
		const saved = localStorage.getItem('theme');
		const prefersDark = window.matchMedia(
			'(prefers-color-scheme: dark)',
		).matches;

		if (saved === 'dark' || (!saved && prefersDark)) {
			document.documentElement.classList.add('dark');
			setDark(true);
		}
	}, []);

	const toggleDarkMode = () => {
		const root = document.documentElement;
		root.classList.toggle('dark');

		const isDark = root.classList.contains('dark');
		setDark(isDark);
		localStorage.setItem('theme', isDark ? 'dark' : 'light');
	};

	const handleToggle = () => {
		setIsPercentage(!isPercentage);
		setActiveValue(isPercentage ? percentageMarkup : fixedMarkup);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setIsEditingValue(true);
		const value = e.target.value;

		// Allow only numbers and decimal
		if (!/^\d*\.?\d*$/.test(value)) {
			toast.error('Please enter a valid number');
			return;
		}

		setActiveValue(Number(value));
	};

	const handleSave = async () => {
		if (isNaN(activeValue)) {
			toast.error('Please enter a valid markup value');
			return;
		}

		const column = isPercentage ? 'percentage_markup' : 'fixed_markup';
		const onSuccess = isPercentage
			? () => setPercentageMarkup(activeValue)
			: () => setFixedMarkup(activeValue);

		try {
			const { error } = await supabase
				.from('user_settings')
				.update({ [column]: activeValue })
				.eq('user_id', user.id);

			if (error) throw error;

			toast.success('Settings saved successfully');
			onSuccess();
			setIsEditingValue(false);
		} catch (error) {
			console.error('Error saving settings:', error);
			toast.error('Error saving settings');
		}
	};

	const handleCancel = () => {
		setIsEditingValue(false);
		setActiveValue(isPercentage ? percentageMarkup : fixedMarkup);
	};

	return (
		<div className="py-8 flex flex-col space-y-4 w-full">
			<div className="rounded-xl border border-pink-200 bg-white shadow-lg max-w-[48rem] w-full p-6 mx-auto">
				{/* Header */}
				<div className="flex flex-col">
					<h2 className="text-lg font-semibold">Auto Pricing</h2>
					<p className="text-sm mb-2">
						Automatically calculate listing price based on purchase price
					</p>

					<div className="flex items-center border-t border-gray-400 border-opacity-30 mt-4 pt-6 space-x-2">
						<div className="border border-pink-400 shadow-md shadow-rose-300 rounded-lg w-full px-4 py-4 flex flex-col bg-purple-200/20">
							<div className="flex items-center flex-row space-x-2 ">
								<span
									className={`font-semibold ${!isPercentage ? 'text-pink-400 shadow-rose-300' : 'text-gray-500'}`}
								>
									Fixed Amount
								</span>
								<label className="relative inline-flex items-center cursor-pointer">
									<input
										type="checkbox"
										className="sr-only peer"
										checked={isPercentage}
										onChange={handleToggle}
									/>
									<div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-pink-500 peer-focus:ring-2 peer-focus:ring-pink-300 transition" />
									<div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transform transition peer-checked:translate-x-5" />
								</label>
								<span
									className={`font-semibold ${isPercentage ? 'text-pink-400 shadow-rose-300' : 'text-gray-500'}`}
								>
									Percentage markup
								</span>
							</div>
							<p className="text-sm">
								{isPercentage
									? 'Calculate listing price as a percentage of purchase price (e.g., 200% = 3x price)'
									: 'Calculate listing price as a fixed amount (e.g., $5)'}
							</p>
						</div>
					</div>
				</div>

				{/* Input */}
				<div className="mt-6 mb-4 w-full md:w-1/2">
					<label className="block font-medium text-sm mb-1">
						{isPercentage ? 'Percentage Markup (%)' : 'Fixed Markup ($)'}
					</label>

					<div className="flex flex-row items-center space-x-2">
						<input
							type="text"
							placeholder={isPercentage ? 'e.g. 20' : 'e.g. 5'}
							value={activeValue}
							onChange={handleChange}
							className="w-full border border-gray-300 rounded-xl pl-4 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
						/>
						{isEditingValue && (
							<div className="flex flex-row">
								<button
									type="button"
									onClick={handleSave}
									className="px-4 py-2 rounded-xl bg-pink-500 text-white font-semibold
										hover:bg-pink-600 active:scale-95 transition
										focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
								>
									Save
								</button>
								<button
									type="button"
									onClick={handleCancel}
									className="px-4 py-2 rounded-xl border border-gray-300 text-gray-600 font-medium
										hover:bg-gray-100 active:scale-95 transition
										focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
								>
									Cancel
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
			<div className="rounded-xl border border-pink-200 bg-white shadow-lg max-w-[48rem] w-full p-6 mx-auto">
				{/* Header */}
				<div className="flex flex-col">
					<h2 className="text-lg font-semibold">Notifications & Alerts</h2>
					<p className="text-sm mb-2">
						Choose how you’d like to be notified about important updates
					</p>

					<div className="flex items-center border-t border-gray-400 border-opacity-30 mt-4 pt-6">
						<div className="border border-pink-400 shadow-md shadow-rose-300 rounded-lg w-full px-4 py-4 mb-4 flex flex-col bg-purple-200/20 space-y-5">
							{/* Email notifications */}
							<div className="flex items-center justify-between">
								<div>
									<p
										className={`font-semibold ${emailNotifications ? 'text-pink-400 shadow-rose-300' : 'text-gray-500'}`}
									>
										Email Notifications
									</p>
									<p className="text-sm text-gray-600">
										Get emails for sales, reminders, and account activity
									</p>
								</div>

								<label className="relative inline-flex items-center cursor-pointer">
									<input
										type="checkbox"
										className="sr-only peer"
										checked={emailNotifications}
										onChange={() => setEmailNotifications((prev) => !prev)}
									/>
									<div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-pink-500 peer-focus:ring-2 peer-focus:ring-pink-300 transition" />
									<div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transform transition peer-checked:translate-x-5" />
								</label>
							</div>

							{/* In-app alerts */}
							<div className="flex items-center justify-between">
								<div>
									<p
										className={`font-semibold ${
											inAppAlerts
												? 'text-pink-400 shadow-rose-300'
												: 'text-gray-500'
										}`}
									>
										In-App Alerts
									</p>

									<p className="text-sm text-gray-600">
										Show pop-ups and toast messages while using the app
									</p>
								</div>

								<label className="relative inline-flex items-center cursor-pointer">
									<input
										type="checkbox"
										className="sr-only peer"
										checked={inAppAlerts}
										onChange={() => setInAppAlerts((prev) => !prev)}
									/>
									<div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-pink-500 peer-focus:ring-2 peer-focus:ring-pink-300 transition" />
									<div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transform transition peer-checked:translate-x-5" />
								</label>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Dark mode toggle */}
			<div className="rounded-xl border border-pink-200 bg-white shadow-lg max-w-[48rem] w-full p-6 mx-auto">
				<div className="flex items-center justify-between">
					<div>
						<h3 className="font-semibold">Dark Mode</h3>
						<p className="text-sm text-gray-600">
							Toggle dark mode for the app
						</p>
					</div>
					<button
						onClick={toggleDarkMode}
						className="px-4 py-2 rounded-xl bg-pink-500 text-white font-semibold hover:bg-pink-600 active:scale-95 transition focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
					>
						{dark ? 'Disable Dark Mode' : 'Enable Dark Mode'}
					</button>
				</div>
			</div>
		</div>
	);
};

export default Settings;
