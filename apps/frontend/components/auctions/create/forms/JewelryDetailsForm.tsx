'use client';

interface JewelryDetailsFormProps {
  jewelryDetails: {
    type: 'ring' | 'necklace' | 'bracelet' | 'earrings' | 'other';
    gender: 'men' | 'women' | 'unisex';
    style: string;
    gemstones: string[];
    gemstoneDetails: string;
    hallmarks: string;
    condition: string;
    includesBox: boolean;
  };
  onChange: (details: any) => void;
}

export default function JewelryDetailsForm({ jewelryDetails, onChange }: JewelryDetailsFormProps) {
  const updateField = (field: string, value: any) => {
    onChange({ ...jewelryDetails, [field]: value });
  };

  const jewelryTypes = [
    { value: 'ring', label: 'Ring' },
    { value: 'necklace', label: 'Necklace / Pendant' },
    { value: 'bracelet', label: 'Bracelet' },
    { value: 'earrings', label: 'Earrings' },
    { value: 'other', label: 'Other' }
  ];

  const commonGemstones = [
    'Diamond', 'Sapphire', 'Ruby', 'Emerald', 
    'Opal', 'Turquoise', 'Pearl', 'Cubic Zirconia'
  ];

  const toggleGemstone = (stone: string) => {
    const current = jewelryDetails.gemstones || [];
    if (current.includes(stone)) {
      updateField('gemstones', current.filter(s => s !== stone));
    } else {
      updateField('gemstones', [...current, stone]);
    }
  };

  return (
    <div className="mt-4 p-4 bg-pink-50 rounded-lg border border-pink-200">
      <h3 className="font-semibold text-pink-800 mb-3 flex items-center gap-2">
        <span className="text-xl">💎</span>
        Jewelry Details
      </h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        {/* Jewelry Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Jewelry Type
          </label>
          <select
            value={jewelryDetails.type}
            onChange={(e) => updateField('type', e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          >
            {jewelryTypes.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <select
            value={jewelryDetails.gender}
            onChange={(e) => updateField('gender', e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="men">Men's</option>
            <option value="women">Women's</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>

        {/* Style */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Style / Design
          </label>
          <input
            type="text"
            value={jewelryDetails.style}
            onChange={(e) => updateField('style', e.target.value)}
            placeholder="e.g., Tennis, Solitaire, Vintage"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        {/* Hallmarks */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hallmarks / Maker's Marks
          </label>
          <input
            type="text"
            value={jewelryDetails.hallmarks}
            onChange={(e) => updateField('hallmarks', e.target.value)}
            placeholder="e.g., 14k, 925, Tiffany & Co."
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </div>

      {/* Gemstones */}
      <div className="mt-3">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Gemstones Present
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {commonGemstones.map(stone => (
            <button
              key={stone}
              type="button"
              onClick={() => toggleGemstone(stone)}
              className={`px-3 py-1 text-xs rounded-full border ${
                (jewelryDetails.gemstones || []).includes(stone)
                  ? 'bg-pink-600 text-white border-pink-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {stone}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Other gemstones (comma separated)"
          className="w-full px-3 py-2 text-sm border rounded-md"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const input = e.currentTarget;
              if (input.value) {
                toggleGemstone(input.value);
                input.value = '';
              }
            }
          }}
        />
      </div>

      {/* Gemstone Details */}
      <div className="mt-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Gemstone Details (carats, clarity, etc.)
        </label>
        <textarea
          value={jewelryDetails.gemstoneDetails}
          onChange={(e) => updateField('gemstoneDetails', e.target.value)}
          placeholder="e.g., 1.5ct diamond, VS1 clarity"
          rows={2}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      {/* Condition */}
      <div className="mt-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Condition
        </label>
        <select
          value={jewelryDetails.condition}
          onChange={(e) => updateField('condition', e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="">Select condition...</option>
          <option value="new">New / Never Worn</option>
          <option value="excellent">Excellent - Light wear</option>
          <option value="good">Good - Normal wear</option>
          <option value="fair">Fair - Visible wear</option>
          <option value="damaged">Damaged - Needs repair</option>
        </select>
      </div>

      {/* Includes Box */}
      <div className="mt-3">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={jewelryDetails.includesBox}
            onChange={(e) => updateField('includesBox', e.target.checked)}
            className="rounded border-gray-300"
          />
          <span className="text-sm font-medium">Includes original box / packaging</span>
        </label>
      </div>

      {/* Helper text */}
      <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
        <p>💡 Jewelry value factors:</p>
        <ul className="list-disc ml-4 mt-1">
          <li>Purity of precious metal</li>
          <li>Gemstone quality (carat, clarity)</li>
          <li>Designer / Brand name</li>
          <li>Age / Vintage status</li>
          <li>Original packaging increases value</li>
        </ul>
      </div>
    </div>
  );
}
