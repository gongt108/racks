const Index = () => {

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto py-4 px-8 w-64 sm:w-fit border rounded-lg border-gray-500 hover:border-rose-600 transition-transform duration-200 hover:-translate-y-[2px]">
          <div className="flex flex-row sm:flex-col space-x-2">
            <div>Icon</div>
            <div className="flex flex-col space-between">
              <h1 className="text-xl font-bold">Bulk Upload</h1>
              <p className="text-md">Upload multiple items at once from your gallery</p>
            </div>
          </div>
          <div className="rounded-lg bg-gray-200 border-dashed flex flex-col items-center text-center m-4 p-4 space-y-2">
            <div>icon</div>
            <h2 className="font-semibold text-lg">Select Photos</h2>
            <p>Choose multiple images</p>
          </div>
        </div>
      </main>

    </div>
  );
};

export default Index;
