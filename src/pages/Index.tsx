import { ImageIcon, UploadIcon } from '@radix-ui/react-icons';

const Index = () => {

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto py-4 px-8 w-full md:w-[56rem] border rounded-lg border-gray-500 hover:border-rose-600 transition-transform duration-200 hover:-translate-y-[2px]">
          <div className="flex flex-col md:flex-row space-x-2">
            <div className="bg-purple-600 p-3 rounded-md">
              <ImageIcon className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col space-between">
              <h1 className="text-xl font-bold">Bulk Upload</h1>
              <p className="text-md">Upload multiple items at once from your gallery</p>
            </div>
          </div>
          <div className="rounded-lg bg-gray-200 border-dashed flex flex-col items-center text-center m-4 p-4 space-y-2">
            <UploadIcon />
            <h2 className="font-semibold text-lg">Select Photos</h2>
            <p>Choose multiple images</p>
          </div>
        </div>
      </main>

    </div>
  );
};

export default Index;
