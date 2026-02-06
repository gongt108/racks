export const STATUS_OPTIONS = {
	listed: {
		label: 'Listed',
		textColor: 'text-rose-600',
		borderColor: 'border-rose-200',
		bgColor: 'bg-rose-50',
	},
	sanitized: {
		label: 'Sanitized',
		textColor: 'text-violet-500',
		borderColor: 'border-violet-200',
		bgColor: 'bg-violet-50',
	},
	racked: {
		label: 'Racked',
		textColor: 'text-purple-600',
		borderColor: 'border-purple-200',
		bgColor: 'bg-purple-50',
	},
	itemized: {
		label: 'Itemized',
		textColor: 'text-pink-400',
		borderColor: 'border-pink-200',
		bgColor: 'bg-pink-50',
	},
	sold: {
		label: 'Sold',
		textColor: 'text-green-600',
		borderColor: 'border-green-200',
		bgColor: 'bg-green-50',
	},
	missing: {
		label: 'Missing Info',
		textColor: 'text-red-500',
		borderColor: 'border-red-200',
		bgColor: 'bg-red-50',
	},
} as const;

export type StatusKey = keyof typeof STATUS_OPTIONS;
