export const STATUS_OPTIONS = {
  listed: {
    label: 'Listed',
    bgColor: 'bg-rose-600',
  },
  sanitized: {
    label: 'Sanitized',
    bgColor: 'bg-violet-500',
  },
  racked: {
    label: 'Racked',
    bgColor: 'bg-purple-600',
  },
  itemized: {
    label: 'Itemized',
    bgColor: 'bg-pink-400',
  },
  sold: {
    label: 'Sold',
    bgColor: 'bg-green-600',
  },
  missingInfo: {
    label: 'Missing Info',
    bgColor: 'bg-red-500',
  },
} as const;

export type StatusKey = keyof typeof STATUS_OPTIONS;
