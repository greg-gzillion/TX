"use client";

export default function SimpleListingForm() {
  // ONLY these fields for MVP:
  const fields = [
    { 
      id: 'metalType', 
      label: 'Metal Type', 
      type: 'select', 
      options: ['Gold', 'Silver', 'Platinum', 'Palladium', 'Rhodium', 'Copper'] 
    },
    { 
      id: 'weight', 
      label: 'Weight (oz)', 
      type: 'number', 
      min: 0.01,
      step: 0.01 
    },
    { 
      id: 'purity', 
      label: 'Purity', 
      type: 'text', 
      placeholder: '999.9 or .999 fine' 
    },
    { 
      id: 'description', 
      label: 'Description', 
      type: 'textarea', 
      rows: 3,
      placeholder: 'Describe the item, include any certificates or markings...' 
    },
    { 
      id: 'photos', 
      label: 'Photos', 
      type: 'file', 
      accept: 'image/*',
      multiple: true 
    },
    { 
      id: 'price', 
      label: 'Price (TESTUSD)', 
      type: 'number', 
      min: 1,
      step: 0.01 
    },
    { 
      id: 'auctionDays', 
      label: 'Auction Days (0 = Buy Now Only)', 
      type: 'number', 
      min: 0, 
      max: 30,
      defaultValue: 7 
    }
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted - will connect to smart contract later');
    // TODO: Connect to escrow smart contract
  };
  
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">List Physical Metal for Auction</h2>
      <p className="text-gray-600 mb-6">
        Simple listing for PhoenixPME MVP. Connect your wallet first to list items.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {fields.map(field => (
          <div key={field.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
            </label>
            
            {field.type === 'select' ? (
              <select 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select {field.label}</option>
                {field.options?.map(opt => (
                  <option key={opt} value={opt.toLowerCase()}>{opt}</option>
                ))}
              </select>
            ) : field.type === 'textarea' ? (
              <textarea 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={field.rows}
                placeholder={field.placeholder}
                required
              />
            ) : field.type === 'file' ? (
              <div className="space-y-2">
                <input 
                  type="file" 
                  className="w-full p-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  accept={field.accept}
                  multiple={field.multiple}
                />
                <p className="text-xs text-gray-500">Upload clear photos of the item from multiple angles</p>
              </div>
            ) : (
              <input 
                type={field.type}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={field.placeholder}
                min={field.min}
                max={field.max}
                step={field.step}
                defaultValue={field.defaultValue}
                required
              />
            )}
          </div>
        ))}
        
        <div className="pt-4">
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            List Item for Auction
          </button>
          <p className="text-xs text-gray-500 text-center mt-2">
            Listing requires wallet connection and will create an escrow contract
          </p>
        </div>
      </form>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-2">🎯 MVP Focus</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Simple listing only - no complex inventory system</li>
          <li>• Basic Buy Now or 1-30 day auction</li>
          <li>• TESTUSD payments for development</li>
          <li>• 1.1% fee auto-deducted to insurance pool</li>
          <li>• No collectibles registry features yet</li>
        </ul>
      </div>
    </div>
  );
}
