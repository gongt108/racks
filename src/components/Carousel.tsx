import { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { garmentTypes } from '@/constants/garmentTypes';

const ItemCarousel = ({ item, id }) => {
	const photos = item.photoUrls || [];
	const [currentIndex, setCurrentIndex] = useState(0);

	const findIcon = (type: string) => {
		const garment = garmentTypes.find((g) => g.value === type);

		if (!garment) return null;

		const Icon = garment.icon;
		return <Icon className="h-10 w-10 text-gray-500" />;
	};

	if (photos.length === 0) {
		return (
			<div className="h-40 w-full bg-gray-100 rounded-md mb-2 flex items-center justify-center">
				{findIcon(item.category)}
			</div>
		);
	}

	const prevSlide = () => {
		setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
	};

	const nextSlide = () => {
		setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
	};

	return (
		<div className="relative h-40 w-full rounded-md mb-2 overflow-hidden bg-gray-100 flex items-center justify-center">
			{/* Image */}
			<img
				src={photos[currentIndex]}
				alt={`Item ${id + 1}`}
				className="h-full w-full object-contain"
			/>

			{/* Left arrow */}
			{photos.length > 1 && (
				<button
					onClick={prevSlide}
					className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-80 text-gray-700 p-2 rounded-full"
				>
					<FaChevronLeft />
				</button>
			)}

			{/* Right arrow */}
			{photos.length > 1 && (
				<button
					onClick={nextSlide}
					className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-80 text-gray-700 p-2 rounded-full"
				>
					<FaChevronRight />
				</button>
			)}

			{/* Dots */}
			{photos.length > 1 && (
				<div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
					{photos.map((_, index) => (
						<div
							key={index}
							className={`h-2 w-2 rounded-full ${
								index === currentIndex ? 'bg-pink-400' : 'bg-gray-300'
							}`}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default ItemCarousel;
