'use client';

interface RoundsDetailsFormProps {
  roundDetails: {
    manufacturer: string;
    series: string;
    year: string;
    finish: 'brilliant' | 'proof' | 'burnished' | 'other';
    isLimited: boolean;
    mintage: string;
    features: string[];
  };
  onChange: (details: any) => void;
}

export default function RoundsDetailsForm({ roundDetails, onChange }: RoundsDetailsFormProps) {
  const updateField = (field: string, value: any) => {
    onChange({ ...roundDetails, [field]: value });
  };

  const finishes = [
    { value: 'brilliant', label: 'Brilliant Uncirculated (BU)' },
    { value: 'proof', label: 'Proof' },
    { value: 'burnished', label: 'Burnished' },
    { value: 'other', label: 'Other' }
  ];

  const commonFeatures = [
    'Reeded edge', 'Laser engraved', 'Antiqued finish', 
    'Colorized', 'High relief', 'Privy mark'
  ];

  const toggleFeature = (feature: string) => {
    const current = roundDetails.features || [];
    if (current.includes(feature)) {
      updateField('features', current.filter(f => f !== feature));
    } else {
      updateField('features', [...current, feature]);
    }
  };

  return (
    <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
      <h3 className="font-semibold text-indigo-800 mb-3 flex items-center gap-2">
        <span className="text-xl">⭕</span>
        Round Details
      </h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        {/* Manufacturer */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Manufacturer / Mint
          </label>
          <select
            value={roundDetails.manufacturer}
            onChange={(e) => updateField('manufacturer', e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Select manufacturer...</option>
            <option value="Silvertowne">Silvertowne</option>
            <option value="Engelhard">Engelhard</option>
            <option value="Johnson Matthey">Johnson Matthey</option>
            <option value="PAMP Suisse">PAMP Suisse</option>
            <option value="Scottsdale">Scottsdale Mint</option>
            <option value="APMEX">APMEX</option>
            <option value="JM Bullion">JM Bullion</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Series/Collection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Series / Collection
          </label>
          <input
            type="text"
            value={roundDetails.series}
            onChange={(e) => updateField('series', e.target.value)}
            placeholder="e.g., Freedom Girl, Zombucks, etc."
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        {/* Year */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Year
          </label>
          <input
            type="text"
            value={roundDetails.year}
            onChange={(e) => updateField('year', e.target.value)}
            placeholder="e.g., 2024"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        {/* Finish */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Finish
          </label>
          <select
            value={roundDetails.finish}
            onChange={(e) => updateField('finish', e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          >
            {finishes.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Limited Edition */}
      <div className="mt-3">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={roundDetails.isLimited}
            onChange={(e) => updateField('isLimited', e.target.checked)}
            className="rounded border-gray-300"
          />
          <span className="text-sm font-medium">Limited Edition / Low Mintage</span>
        </label>
      </div>

      {/* Mintage (if limited) */}
      {roundDetails.isLimited && (
        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mintage / Edition Size
          </label>
          <input
            type="text"
            value={roundDetails.mintage}
            onChange={(e) => updateField('mintage', e.target.value)}
            placeholder="e.g., 5,000"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      )}

      {/* Special Features */}
      <div className="mt-3">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Special Features
        </label>
        <div className="flex flex-wrap gap-2">
          {commonFeatures.map(feature => (
            <button
              key={feature}
              type="button"
              onClick={() => toggleFeature(feature)}
              className={`px-3 py-1 text-xs rounded-full border ${
                (roundDetails.features || []).includes(feature)
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {feature}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Other features (comma separated)"
          className="mt-2 w-full px-3 py-2 text-sm border rounded-md"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const input = e.currentTarget;
              if (input.value) {
                toggleFeature(input.value);
                input.value = '';
              }
            }
          }}
        />
      </div>

      {/* Example images / helper text */}
      <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
        <p>💡 Examples of collectible rounds:</p>
        <ul className="list-disc ml-4 mt-1">
          <li>Silvertowne Prospector (classic design)</li>
          <li>Engelhard Prospector (vintage)</li>
          <li>PAMP Fortuna (certified design)</li>
          <li>Limited edition anniversary rounds</li>
        </ul>
      </div>
    </div>
  );
}
