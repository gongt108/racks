import React from 'react';
import { IconType } from 'react-icons';
import { garmentTypes } from '@/constants/garmentTypes';

export const findIcon = (type: string) => {
	const garment = garmentTypes.find((g) => g.value === type);
	if (!garment) return null;

	const Icon: IconType = garment.icon;
	return <Icon className="h-10 w-10 text-gray-500" />;
};
