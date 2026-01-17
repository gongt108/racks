const Index = () => {

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-row border rounded-lg border-gray-500 hover:border-rose-600 transition-transform duration-200 hover:-translate-y-[2px]">
          <div>Icon</div>
          <div className="flex flex-col space-between">
            <h1 className="text-xl font-bold">Bulk Upload</h1>
            <p className="text-md">Upload multiple items at once from your gallery</p>
          </div>
        </div>
      </main>

    </div>
  );
};

export default Index;
