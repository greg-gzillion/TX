'use client';

import { useAuctionForm } from './create/hooks/useAuctionForm';
import { useWallet } from '@/hooks/useWallet';
import HonestyBanner from './create/displays/HonestyBanner';
import PriceBanner from './create/displays/PriceBanner';
import BasicInfoStep from './create/steps/BasicInfoStep';
import WeightPurityStep from './create/steps/WeightPurityStep';
import CertificationStep from './create/steps/CertificationStep';
import DetailsPhotosStep from './create/steps/DetailsPhotosStep';
import PricingAndSettingsStep from './create/steps/PricingAndSettingsStep';
import EstimatedValueDisplay from './create/displays/EstimatedValueDisplay';
import FeeDisplay from './create/displays/FeeDisplay';
import SubmitButton from './create/displays/SubmitButton';

export default function CreateAuctionForm() {
  const { address, isConnected } = useWallet();
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

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-yellow-800 mb-4">Wallet Not Connected</h2>
            <p className="text-yellow-700 mb-6">
              Please connect your wallet using the button in the top right corner.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: '2rem 1rem',
      position: 'relative'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        gap: '2rem'
      }}>
        {/* Left column - Form (60%) */}
        <div style={{ flex: '6' }}>
          {/* Wallet indicator */}
          <div style={{
            marginBottom: '1rem',
            padding: '0.5rem',
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            color: '#166534'
          }}>
            ✅ Connected: {address?.slice(0,8)}...{address?.slice(-4)}
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
              Create Precious Metals Auction
            </h1>
            <p style={{ fontSize: '1rem', color: '#4b5563', marginBottom: '1rem' }}>
              List your items for sale
            </p>
            
            <HonestyBanner />
            <PriceBanner spotPrices={spotPrices} lastUpdated={lastUpdated} />
          </div>

          <form onSubmit={handleSubmit}>
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
              formType={formState.formType}
            />

            <DetailsPhotosStep
              serialNumber={formState.serialNumber}
              setSerialNumber={setters.setSerialNumber}
              images={formState.images}
              setImages={setters.setImages}
              videoUrl={formState.videoUrl}
              setVideoUrl={setters.setVideoUrl}
            />

            {/* Combined Pricing & Settings Step */}
            <PricingAndSettingsStep
              metalType={formState.metalType}
              weight={formState.weight}
              weightUnit={formState.weightUnit}
              purity={formState.purity}
              spotPrice={getCurrentSpotPrice()}
              onPriceUpdate={setters.setEstimatedValue}
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

        {/* Right column - Phoenix image (40%) */}
        <div style={{ flex: '4', position: 'relative' }}>
          <div style={{
            position: 'sticky',
            top: '100px',
            textAlign: 'center',
            padding: '1rem'
          }}>
            <img 
              src="/Phoenix-sketch002.png?v=3" 
              alt="PhoenixPME" 
              style={{
                width: '100%',
                maxWidth: '350px',
                height: 'auto',
                opacity: '0.8',
                margin: '0 auto',
                filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'
              }}
            />
            <div style={{
              marginTop: '1.5rem',
              fontSize: '1rem',
              color: '#4b5563',
              fontWeight: '500',
              lineHeight: '1.6'
            }}>
              <div style={{ fontSize: '1.125rem', color: '#d97706', marginBottom: '0.25rem' }}>TX blockchain</div>
              <div style={{ color: '#6b7280' }}>gold · silver · platinum · palladium</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
