import { GiSkirt, GiShorts, GiPirateCoat } from 'react-icons/gi';
import {
	PiShirtFoldedDuotone,
	PiDressDuotone,
	PiPantsDuotone,
	PiBagDuotone,
	PiBeltDuotone,
	PiHighHeelDuotone,
	PiHoodieDuotone,
	PiCoatHangerDuotone,
} from 'react-icons/pi';

export const garmentTypes = [
	{ value: 'shirt', label: 'Shirt', icon: PiShirtFoldedDuotone },
	{ value: 'skirt', label: 'Skirt', icon: GiSkirt },
	{ value: 'dress', label: 'Dress', icon: PiDressDuotone },
	{ value: 'shorts', label: 'Shorts', icon: GiShorts },
	{ value: 'pants', label: 'Pants', icon: PiPantsDuotone },
	{ value: 'jacket', label: 'Jacket', icon: GiPirateCoat },
	{ value: 'bag', label: 'Bag', icon: PiBagDuotone },
	{ value: 'shoes', label: 'Shoes', icon: PiHighHeelDuotone },
	{ value: 'sweater', label: 'Sweater', icon: PiHoodieDuotone },
	{ value: 'accessories', label: 'Accessories', icon: PiBeltDuotone },
	{ value: 'other', label: 'Other', icon: PiCoatHangerDuotone },
];
