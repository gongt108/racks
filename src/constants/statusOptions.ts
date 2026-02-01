export const STATUS_OPTIONS = {
	listed: {
		label: 'Listed',
		textColor: 'text-rose-600',
		bgColor: 'bg-rose-100',
	},
	sanitized: {
		label: 'Sanitized',
		textColor: 'text-violet-500',
		bgColor: 'bg-violet-100',
	},
	racked: {
		label: 'Racked',
		textColor: 'text-purple-600',
		bgColor: 'bg-purple-100',
	},
	itemized: {
		label: 'Itemized',
		textColor: 'text-pink-400',
		bgColor: 'bg-pink-100',
	},
	sold: {
		label: 'Sold',
		textColor: 'text-green-600',
		bgColor: 'bg-green-100',
	},
	missingInfo: {
		label: 'Missing Info',
		textColor: 'text-red-500',
		bgColor: 'bg-red-100',
	},
} as const;

export type StatusKey = keyof typeof STATUS_OPTIONS;
