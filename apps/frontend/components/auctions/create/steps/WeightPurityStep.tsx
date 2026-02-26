'use client';

import WeightInput from '@/components/shared/forms/inputs/WeightInput';
import PuritySelector from '@/components/shared/forms/inputs/PuritySelector';

interface WeightPurityStepProps {
  weight: number;
  setWeight: (value: number) => void;
  weightUnit: 'troy_oz' | 'grams' | 'ounces';
  setWeightUnit: (value: 'troy_oz' | 'grams' | 'ounces') => void;
  purity: number;
  setPurity: (value: number) => void;
  metalType: 'Gold' | 'Silver' | 'Platinum' | 'Palladium' | 'Other';  // ✅ Fix this line
}

export default function WeightPurityStep({
  weight,
  setWeight,
  weightUnit,
  setWeightUnit,
  purity,
  setPurity,
  metalType
}: WeightPurityStepProps) {
  return (
    <section className="bg-white p-6 rounded-xl border shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">2. Weight & Purity</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <WeightInput
            value={weight}
            unit={weightUnit}
            onChange={(newValue, newUnit) => {
              setWeight(newValue);
              setWeightUnit(newUnit);
            }}
          />
        </div>
        <div>
          <PuritySelector 
            metalType={metalType} 
            value={purity} 
            onChange={setPurity} 
          />
        </div>
      </div>
    </section>
  );
}