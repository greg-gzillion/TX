'use client';

import { MetalType } from '@/lib/types/metals';
import MetalSelector from '@/components/shared/forms/inputs/MetalSelector';
import FormTypeSelector from '@/components/shared/forms/inputs/FormTypeSelector';
import CoinDetailsForm from '../forms/coin';
import RoundsDetailsForm from '../forms/RoundsDetailsForm';
import BarsDetailsForm from '../forms/BarsDetailsForm';
import JewelryDetailsForm from '../forms/JewelryDetailsForm';

interface BasicInfoStepProps {
  metalType: MetalType;
  setMetalType: (value: MetalType) => void;
  formType: 'coin' | 'round' | 'bar' | 'jewelry' | 'other';
  setFormType: (value: any) => void;
  coinDetails: any;
  setCoinDetails: (value: any) => void;
  roundDetails: any;
  setRoundDetails: (value: any) => void;
  barDetails: any;
  setBarDetails: (value: any) => void;
  jewelryDetails: any;
  setJewelryDetails: (value: any) => void;
}

export default function BasicInfoStep({
  metalType,
  setMetalType,
  formType,
  setFormType,
  coinDetails,
  setCoinDetails,
  roundDetails,
  setRoundDetails,
  barDetails,
  setBarDetails,
  jewelryDetails,
  setJewelryDetails
}: BasicInfoStepProps) {
  return (
    <section className="bg-white p-6 rounded-xl border shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">1. Basic Information</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">Metal Type</label>
          <MetalSelector value={metalType} onChange={setMetalType} />
        </div>
        <div>
          <FormTypeSelector value={formType} onChange={setFormType} />
        </div>
        
        {/* Coin Details - Only for numismatic coins */}
        {formType === 'coin' && (
          <CoinDetailsForm 
            coinDetails={coinDetails}
            onChange={setCoinDetails}
<<<<<<< HEAD
            metalType={metalType}  // ← THIS WAS MISSING!
=======
            metalType={metalType}
>>>>>>> 3603f0739169f2361d782d32c26ce60187fa9c5d
          />
        )}
        
        {/* Round Details - For private mint rounds/bullion */}
        {formType === 'round' && (
          <RoundsDetailsForm 
            roundDetails={roundDetails}
            onChange={setRoundDetails}
          />
        )}
        
        {/* Bar Details - For bullion bars */}
        {formType === 'bar' && (
          <BarsDetailsForm 
            barDetails={barDetails}
            onChange={setBarDetails}
          />
        )}
        
        {/* Jewelry Details - For jewelry items */}
        {formType === 'jewelry' && (
          <JewelryDetailsForm 
            jewelryDetails={jewelryDetails}
            onChange={setJewelryDetails}
          />
        )}
      </div>
    </section>
  );
}
