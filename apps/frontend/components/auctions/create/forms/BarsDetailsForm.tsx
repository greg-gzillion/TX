"use client";

interface BarsDetailsFormProps {
  barDetails: {
    manufacturer: string;
    serialNumber: string;
    assay: boolean;
    assayNumber: string;
    dimensions: string;
    shape: "bar" | "ingot" | "wafer" | "odd";
    features: string[];
  };
  onChange: (details: any) => void;
}

export default function BarsDetailsForm({
  barDetails,
  onChange,
}: BarsDetailsFormProps) {
  const updateField = (field: string, value: any) => {
    onChange({ ...barDetails, [field]: value });
  };

  const shapes = [
    { value: "bar", label: "Standard Bar" },
    { value: "ingot", label: "Ingot" },
    { value: "wafer", label: "Wafer" },
    { value: "odd", label: "Odd Shape" },
  ];

  const commonFeatures = [
    "Serial numbered",
    "Hallmarked",
    "Cast",
    "Pressed",
    "Certified",
    "Original packaging",
    "With assay card",
  ];

  const toggleFeature = (feature: string) => {
    const current = barDetails.features || [];
    if (current.includes(feature)) {
      updateField(
        "features",
        current.filter((f) => f !== feature),
      );
    } else {
      updateField("features", [...current, feature]);
    }
  };

  return (
    <div className="mt-4 p-4 bg-gray-100 rounded-lg border border-gray-300">
      <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <span className="text-xl">⬜</span>
        Bar Details
      </h3>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Manufacturer */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Manufacturer / Refiner
          </label>
          <select
            value={barDetails.manufacturer}
            onChange={(e) => updateField("manufacturer", e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Select refiner...</option>
            <option value="PAMP Suisse">PAMP Suisse</option>
            <option value="Credit Suisse">Credit Suisse</option>
            <option value="Valcambi">Valcambi</option>
            <option value="Perth Mint">Perth Mint</option>
            <option value="Royal Canadian Mint">Royal Canadian Mint</option>
            <option value="Johnson Matthey">Johnson Matthey</option>
            <option value="Engelhard">Engelhard</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Serial Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Serial Number
          </label>
          <input
            type="text"
            value={barDetails.serialNumber}
            onChange={(e) => updateField("serialNumber", e.target.value)}
            placeholder="If applicable"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        {/* Shape */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Shape
          </label>
          <select
            value={barDetails.shape}
            onChange={(e) => updateField("shape", e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          >
            {shapes.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Dimensions (optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dimensions (optional)
          </label>
          <input
            type="text"
            value={barDetails.dimensions}
            onChange={(e) => updateField("dimensions", e.target.value)}
            placeholder="e.g., 50mm x 28mm"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </div>

      {/* Assay Card */}
      <div className="mt-3">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={barDetails.assay}
            onChange={(e) => updateField("assay", e.target.checked)}
            className="rounded border-gray-300"
          />
          <span className="text-sm font-medium">
            Includes assay card / certificate
          </span>
        </label>
      </div>

      {/* Assay Number */}
      {barDetails.assay && (
        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assay / Certificate Number
          </label>
          <input
            type="text"
            value={barDetails.assayNumber}
            onChange={(e) => updateField("assayNumber", e.target.value)}
            placeholder="If available"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      )}

      {/* Bar Features */}
      <div className="mt-3">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bar Features
        </label>
        <div className="flex flex-wrap gap-2">
          {commonFeatures.map((feature) => (
            <button
              key={feature}
              type="button"
              onClick={() => toggleFeature(feature)}
              className={`px-3 py-1 text-xs rounded-full border ${
                (barDetails.features || []).includes(feature)
                  ? "bg-gray-700 text-white border-gray-700"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {feature}
            </button>
          ))}
        </div>
      </div>

      {/* Helper text */}
      <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
        <p>💡 Premium bars often include:</p>
        <ul className="list-disc ml-4 mt-1">
          <li>Original assay card (increases value)</li>
          <li>Serial numbers matching assay</li>
          <li>Government refiner markings</li>
          <li>Original sealed packaging</li>
        </ul>
      </div>
    </div>
  );
}
