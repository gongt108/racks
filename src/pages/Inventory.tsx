import * as React from 'react';
import { Box, Card, Typography, Chip, Stack } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import GridViewIcon from '@mui/icons-material/GridView';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

type Stage = {
	label: string;
	count: number;
	amount: number;
	icon: React.ReactNode;
	bgColor: string;
	iconBg: string;
	amountColor?: string;
};

const stages: Stage[] = [
	{
		label: 'Missing Info',
		count: 0,
		amount: 0,
		icon: <WarningAmberIcon />,
		bgColor: '#FDECEC',
		iconBg: '#E53935',
	},
	{
		label: 'Itemized',
		count: 0,
		amount: 0,
		icon: <ListAltIcon />,
		bgColor: '#FCE4EC',
		iconBg: '#EC407A',
	},
	{
		label: 'Sanitize',
		count: 0,
		amount: 0,
		icon: <AutoAwesomeIcon />,
		bgColor: '#F3E5F5',
		iconBg: '#AB47BC',
	},
	{
		label: 'Racked',
		count: 0,
		amount: 0,
		icon: <GridViewIcon />,
		bgColor: '#EDE7F6',
		iconBg: '#7E57C2',
	},
	{
		label: 'Listed',
		count: 0,
		amount: 0,
		icon: <LocalOfferIcon />,
		bgColor: '#FCE4EC',
		iconBg: '#F06292',
	},
	{
		label: 'Sold',
		count: 0,
		amount: 0,
		icon: <CheckCircleIcon />,
		bgColor: '#E8F5E9',
		iconBg: '#2E7D32',
		amountColor: '#2E7D32',
	},
];

export default function InventoryPipeline() {
	return (
		<div className="flex-1">
			<Card className="rounded-xl border border-pink-200 shadow-lg max-w-[72rem] p-6 mx-auto">
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
				<Stack
					direction={{ xs: 'column', sm: 'row' }}
					spacing={2}
					justifyContent="space-between"
				>
					{stages.map((stage) => (
						<Card
							key={stage.label}
							sx={{
								flex: 1,
								borderRadius: 3,
								backgroundColor: stage.bgColor,
								p: 2,
								textAlign: 'center',
							}}
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
								{stage.count}
							</Typography>
							<Chip
								label={`$${stage.amount.toFixed(2)}`}
								sx={{
									mt: 1.5,
									fontWeight: 500,
									bgcolor: stage.amountColor
										? 'rgba(46, 125, 50, 0.12)'
										: 'rgba(0,0,0,0.08)',
									color: stage.amountColor ?? 'text.primary',
								}}
							/>
						</Card>
					))}
				</Stack>
			</Card>
		</div>
	);
}
