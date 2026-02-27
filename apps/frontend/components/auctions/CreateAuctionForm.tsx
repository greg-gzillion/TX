'use client';

import { useAuctionForm } from './create/hooks/useAuctionForm';
import { useWallet } from '@/hooks/useWallet';
import HonestyBanner from './create/displays/HonestyBanner';
import PriceBanner from './create/displays/PriceBanner';
import BasicInfoStep from './create/steps/BasicInfoStep';
import WeightPurityStep from './create/steps/WeightPurityStep';
import CertificationStep from './create/steps/CertificationStep';
import DetailsPhotosStep from './create/steps/DetailsPhotosStep';
import PricingStep from './create/steps/PricingStep';
import AuctionSettingsStep from './create/steps/AuctionSettingsStep';
import EstimatedValueDisplay from './create/displays/EstimatedValueDisplay';
import FeeDisplay from './create/displays/FeeDisplay';
import SubmitButton from './create/displays/SubmitButton';

export default function CreateAuctionForm() {
  const { address, isConnected, walletType } = useWallet();
  const {
    formState,
    setters,
    isSubmitting,
    spotPrices,
    lastUpdated,
    estimatedValue,
    getCurrentSpotPrice,
    handleSubmit
  } = useAuctionForm();

  console.log('CreateAuctionForm - wallet:', { address, isConnected, walletType });

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-yellow-800 mb-4">Wallet Not Connected</h2>
            <p className="text-yellow-700 mb-6">
              Please connect your wallet using the button in the top right corner.
            </p>
            <div className="text-sm text-gray-500">
              Current wallet state: {isConnected ? 'Connected' : 'Disconnected'}
              {address && ` (${address.slice(0,6)}...)`}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Simple wallet indicator */}
        <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 flex justify-between items-center">
          <span>
            ✅ Connected: {address?.slice(0,8)}...{address?.slice(-4)} 
            {walletType && ` (${walletType})`}
          </span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Precious Metals Auction</h1>
          <p className="text-gray-600 mt-2">List your items for sale</p>
          
          <HonestyBanner />
          <PriceBanner spotPrices={spotPrices} lastUpdated={lastUpdated} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <BasicInfoStep 
            metalType={formState.metalType}
            setMetalType={setters.setMetalType}
            formType={formState.formType}
            setFormType={setters.setFormType}
            coinDetails={formState.coinDetails}
            setCoinDetails={setters.setCoinDetails}
            roundDetails={formState.roundDetails}
            setRoundDetails={setters.setRoundDetails}
            barDetails={formState.barDetails}
            setBarDetails={setters.setBarDetails}
            jewelryDetails={formState.jewelryDetails}
            setJewelryDetails={setters.setJewelryDetails}
          />

          <WeightPurityStep
            weight={formState.weight}
            setWeight={setters.setWeight}
            weightUnit={formState.weightUnit}
            setWeightUnit={setters.setWeightUnit}
            purity={formState.purity}
            setPurity={setters.setPurity}
            metalType={formState.metalType}
          />

          <CertificationStep
            certification={formState.certification}
            onChange={setters.setCertification}
          />

          <DetailsPhotosStep
            serialNumber={formState.serialNumber}
            setSerialNumber={setters.setSerialNumber}
            images={formState.images}
            setImages={setters.setImages}
            videoUrl={formState.videoUrl}
            setVideoUrl={setters.setVideoUrl}
          />

          <PricingStep
            metalType={formState.metalType}
            weight={formState.weight}
            weightUnit={formState.weightUnit}
            purity={formState.purity}
            spotPrice={getCurrentSpotPrice()}
            onPriceUpdate={setters.setEstimatedValue}
          />

          <AuctionSettingsStep
            startingPrice={formState.startingPrice}
            setStartingPrice={setters.setStartingPrice}
            buyNowPrice={formState.buyNowPrice}
            setBuyNowPrice={setters.setBuyNowPrice}
          />

          <EstimatedValueDisplay estimatedValue={estimatedValue} />
          <FeeDisplay estimatedValue={estimatedValue} />
          <SubmitButton isSubmitting={isSubmitting} />
        </form>
      </div>
    </div>
  );
}
