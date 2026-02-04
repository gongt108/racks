import {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from 'react';
import { supabase } from '@/supabaseClient';

type SettingsContextType = {
	percentageMarkup: number | '';
	fixedMarkup: number | '';
	isPercentage: boolean;
	emailNotification: boolean;
	toastNotification: boolean;
	setPercentageMarkup: (value: number | '') => void;
	setFixedMarkup: (value: number | '') => void;
	setIsPercentage: (value: boolean) => void;
	setEmailNotification: (value: boolean) => void;
	setToastNotification: (value: boolean) => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(
	undefined,
);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
	const [percentageMarkup, setPercentageMarkup] = useState<number | ''>(200);
	const [fixedMarkup, setFixedMarkup] = useState<number | ''>(10);
	const [isPercentage, setIsPercentage] = useState(true);
	const [emailNotification, setEmailNotification] = useState(true);
	const [toastNotification, setToastNotification] = useState(true);

	return (
		<SettingsContext.Provider
			value={{
				percentageMarkup,
				fixedMarkup,
				isPercentage,
				setPercentageMarkup,
				setFixedMarkup,
				setIsPercentage,
				emailNotification,
				toastNotification,
				setEmailNotification,
				setToastNotification,
			}}
		>
			{children}
		</SettingsContext.Provider>
	);
};

// Custom hook for convenience
export const useSettings = () => {
	const context = useContext(SettingsContext);
	if (!context)
		throw new Error('useSettings must be used within a SettingsProvider');
	return context;
};
