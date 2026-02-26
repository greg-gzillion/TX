'use client';

import PriceCalculator from '@/components/shared/forms/inputs/PriceCalculator';

interface PricingStepProps {
  metalType: string;
  weight: number;
  weightUnit: 'troy_oz' | 'grams' | 'ounces';
  purity: number;
  spotPrice: number;
  onPriceUpdate: (value: number) => void;
}

export default function PricingStep({
  metalType,
  weight,
  weightUnit,
  purity,
  spotPrice,
  onPriceUpdate
}: PricingStepProps) {
  return (
    <section className="bg-white p-6 rounded-xl border shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Set Your Price</h2>
      <PriceCalculator
        metalType={metalType}
        weight={weight}
        weightUnit={weightUnit}
        purity={purity}
        spotPrice={spotPrice}
        onPriceUpdate={onPriceUpdate}
      />
    </section>
  );
}
