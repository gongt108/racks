import { CameraIcon, ImageIcon, UploadIcon } from '@radix-ui/react-icons';

const Index = () => {

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto py-8 px-8 w-full md:w-[56rem] border rounded-lg border-gray-500 hover:border-rose-600 transition-transform duration-200 hover:-translate-y-[2px]">
          <div className="flex flex-col items-center text-center md:items-start md:text-start md:flex-row">
            <div className="bg-purple-600 mx-auto p-3 rounded-md md:mr-2">
              <ImageIcon className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col space-between">
              <h1 className="text-xl font-bold">Bulk Upload</h1>
              <p className="text-md">Upload multiple items at once from your gallery</p>
            </div>
          </div>
          <div className="rounded-lg bg-gray-200 border-pink-200 border-dashed flex flex-col items-center text-center mx-4 my-6 p-4 space-y-2">
            <UploadIcon className="text-pink-300" />
            <h2 className="font-semibold text-lg">Select Photos</h2>
            <p>Choose multiple images</p>
          </div>
        </div>
        <div className="mx-auto py-8 px-8 w-full md:w-[56rem] border rounded-lg border-gray-500 hover:border-rose-600 transition-transform duration-200 hover:-translate-y-[2px]">
          <div className="flex flex-col md:flex-row">
            <div className="bg-rose-600 w-fit p-3 rounded-md md:mr-2">
              <CameraIcon className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col space-between">
              <h1 className="text-xl font-bold">Bulk Upload</h1>
              <p className="text-md">Upload multiple items at once from your gallery</p>
            </div>
          </div>
          <div className="rounded-lg bg-gray-200 border-dashed flex flex-col items-center text-center mx-4 my-6 p-4 space-y-2">
            <UploadIcon className="text-pink-300" />
            <p>Upload from device</p>
          </div>
          <div className="rounded-lg bg-gray-200 border-dashed flex flex-col items-center text-center mx-4 my-6 p-4 space-y-2">
            <CameraIcon className="text-pink-300" />
            <p>Take photo</p>
          </div>
        </div>
      </main>

    </div>
  );
};

export default Index;
