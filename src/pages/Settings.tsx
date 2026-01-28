import { usePricing } from '@/context/PricingContext';

const Settings = () => {
  const {
    markupValue,
    isPercentage,
    setMarkupValue,
    setIsPercentage,
  } = usePricing();

  const handleToggle = () => {
    setIsPercentage(!isPercentage);
    setMarkupValue(''); // reset when switching mode
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow only numbers and decimal
    if (/^\d*\.?\d*$/.test(value)) {
      setMarkupValue(value === '' ? '' : Number(value));
    }
  };

  return (
    <div className="py-8 flex flex-col space-y-4 w-full">
      <div className="rounded-xl border border-pink-200 bg-white shadow-lg max-w-[72rem] w-full p-6 mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <h2 className="text-lg font-semibold">Auto Pricing</h2>

          <div className="flex items-center space-x-2">
            <span className="text-sm">Percentage</span>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isPercentage}
                onChange={handleToggle}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-pink-500 peer-focus:ring-2 peer-focus:ring-pink-300 transition" />
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transform transition peer-checked:translate-x-5" />
            </label>

            <span className="text-sm">Fixed Amount</span>
          </div>
        </div>

        {/* Input */}
        <div className="mt-6 w-full md:w-1/2">
          <label className="block font-medium text-sm mb-1">
            {isPercentage ? 'Percentage Markup (%)' : 'Fixed Markup ($)'}
          </label>

          <input
            type="text"
            placeholder={isPercentage ? 'e.g. 20' : 'e.g. 5'}
            value={markupValue}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl pl-4 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
      </div>
    </div>
  );
};

export default Settings;
