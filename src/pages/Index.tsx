import { useState } from 'react';
import UploadIcon from '@mui/icons-material/Upload';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { FaShirt, FaBoxesStacked } from 'react-icons/fa6';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const Index = () => {
	const [garmentType, setGarmentType] = useState('');

  const handleTypeSelection = (event) => {
    setGarmentType(event.target.value);
  };
	return (
		<div className="min-h-screen">
			<main className="container mx-auto px-4 py-8 flex flex-col space-y-8">
				<div className="mx-auto py-8 px-8 w-full md:w-[48rem] border-2 rounded-lg shadow-md border-gray-200 hover:border-rose-600 transition-transform duration-200 hover:-translate-y-[2px]">
					<div className="flex flex-col items-center text-center md:items-start md:text-start md:flex-row">
						<div className="bg-purple-600 shadow-lg shadow-purple-500/50 w-fit p-3 rounded-md md:mr-2">
							<PhotoLibraryIcon
								className="w-6 h-6 text-white"
								fontSize="large"
							/>
						</div>
						<div className="flex flex-col space-between">
							<h1 className="text-xl font-bold">Bulk Upload</h1>
							<p className="text-md">
								Upload multiple items at once from your gallery
							</p>
						</div>
					</div>
					<div className="rounded-lg bg-gray-100 border-2 border-pink-200 border-dashed flex flex-col items-center text-center mx-4 mt-16 mb-8 py-8 px-4 space-y-2">
						<UploadIcon className="text-pink-300 w-6 h-6" fontSize="large" />
						<h2 className="font-semibold text-lg">Select Photos</h2>
						<p>Choose multiple images</p>
					</div>
				</div>
				<div className="mx-auto py-8 px-8 w-full md:w-[48rem] border-2 rounded-lg border-gray-200 hover:border-rose-600 transition-transform duration-200 hover:-translate-y-[2px]">
					<div className="flex flex-col md:flex-row">
						<div className="bg-rose-600 shadow-lg shadow-rose-500/50 w-fit p-3 rounded-md md:mr-2">
							<CameraAltIcon className="w-6 h-6 text-white" fontSize="large" />
						</div>
						<div className="flex flex-col space-between">
							<h1 className="text-xl font-bold">Single Item</h1>
							<p className="text-md">Add one item with detailed information</p>
						</div>
					</div>
					<p className="font-semibold mt-6 mx-4">Item Photos (up to 5)</p>
					<div className="rounded-lg bg-gray-200 border-dashed flex flex-col items-center text-center mx-4 mt-2 mb-6 p-4 space-y-2">
						<UploadIcon className="text-pink-300" />
						<p>Upload from device</p>
					</div>
					<div className="rounded-lg bg-gray-200 border-dashed flex flex-col items-center text-center mx-4 my-6 p-4 space-y-2">
						<CameraAltIcon className="text-pink-300" />
						<p>Take photo</p>
					</div>
					<div className="rounded-lg bg-blue-200 border flex flex-col items-center text-center mx-4 my-6 p-4 space-y-2">
						<FaShirt className="text-purple-300" />
						<h2 className="font-semibold text-lg">Item Classification</h2>
						<p className="font-semibold">Garment type <span className="text-red-500">*</span></p>
						<FormControl fullWidth className="w-64"> {/* Apply a Tailwind width utility */}
	      <InputLabel id="select-label">Select Garment type...</InputLabel>
	      <Select
	        labelId="select-label"
	        id="simple-select"
	        value={garmentType}
	        onChange={handleTypeSelection}
	        className="text-sm border-gray-300 rounded-lg shadow-sm" // Apply Tailwind styles
	      >
	        <MenuItem value={10}>Shirt</MenuItem>
	        <MenuItem value={20}>Skirt</MenuItem>
	        <MenuItem value={30}>Dress</MenuItem>
	      </Select>
	    </FormControl>
						<p>Required for inventory tracking and analytics</p>
					</div>
				</div>
			</main>
		</div>
	);
};

export default Index;
