'use client';

import HonestyBanner from './displays/HonestyBanner';
import PriceBanner from './displays/PriceBanner';
import BasicInfoStep from './steps/BasicInfoStep';
import WeightPurityStep from './steps/WeightPurityStep';
import CertificationStep from './steps/CertificationStep';
import DetailsPhotosStep from './steps/DetailsPhotosStep';
import PricingStep from './steps/PricingStep';
import AuctionSettingsStep from './steps/AuctionSettingsStep';
import EstimatedValueDisplay from './displays/EstimatedValueDisplay';
import FeeDisplay from './displays/FeeDisplay';
import SubmitButton from './displays/SubmitButton';

export default function CreateAuctionForm() {
  const {
    formState,
    setters,
    isSandbox,
    isSubmitting,
    spotPrices,
    lastUpdated,
    estimatedValue,
    getCurrentSpotPrice,
    handleSubmit
  } = useAuctionForm();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Sandbox Banner */}
        {isSandbox && (
          <div className="max-w-4xl mx-auto mb-4">
            <div className="bg-purple-100 border-2 border-purple-300 rounded-lg p-4">
              <p className="text-purple-800 flex items-center">
                <span className="text-2xl mr-3">🧪</span>
                <span className="font-semibold">SANDBOX MODE:</span>
                <span className="ml-2">Creating a TEST auction - no real funds will be used</span>
              </p>
              <p className="text-xs text-purple-600 mt-2 border-t border-purple-200 pt-2">
                All prices shown in TESTUSD
              </p>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Precious Metals Auction</h1>
          <p className="text-gray-600 mt-2">
            {isSandbox ? "🧪 Test listing - no real value" : "Design your listing for the TX blockchain"}
          </p>
          
          <HonestyBanner isSandbox={isSandbox} />
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
            isSandbox={isSandbox}
            startingPrice={formState.startingPrice}
            setStartingPrice={setters.setStartingPrice}
            buyNowPrice={formState.buyNowPrice}
            setBuyNowPrice={setters.setBuyNowPrice}
          />

          <EstimatedValueDisplay
            estimatedValue={estimatedValue}
            isSandbox={isSandbox}
          />

          <FeeDisplay
            estimatedValue={estimatedValue}
            isSandbox={isSandbox}
          />

          <SubmitButton
            isSandbox={isSandbox}
            isSubmitting={isSubmitting}
          />
        </form>
      </div>
    </div>
  );
}
