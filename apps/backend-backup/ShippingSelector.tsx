'use client';

import * as React from 'react';

export type ShippingCarrier = 'USPS' | 'UPS' | 'FedEx' | 'DHL';
export type ShippingSpeed = 'Economy' | 'Standard' | 'Expedited' | 'Priority' | 'Overnight';
export type PackageType = 'Envelope' | 'Pak' | 'Tube' | 'Box' | 'Pallet';
export type ShippingOption = 'Insurance' | 'SignatureRequired';

export interface ShippingState {
  carrier?: ShippingCarrier;
  speed?: ShippingSpeed;
  packageType?: PackageType;
  insurance?: boolean;
  signatureRequired?: boolean;
  options?: ShippingOption[];
}

export interface ShippingSelectorProps {
  value: ShippingState;
  onChange: (shipping: ShippingState) => void;
}

const CARRIER_OPTIONS = [
  { id: 'USPS', name: 'USPS', icon: '📮', description: 'United States Postal Service' },
  { id: 'UPS', name: 'UPS', icon: '📦', description: 'United Parcel Service' },
  { id: 'FedEx', name: 'FedEx', icon: '🚚', description: 'Federal Express' },
  { id: 'DHL', name: 'DHL', icon: '✈️', description: 'DHL Express' },
];

const SPEED_OPTIONS = [
  { id: 'Economy', name: 'Economy', days: '7-10', price: '$8.99', description: 'Slowest, most economical' },
  { id: 'Standard', name: 'Standard', days: '3-5', price: '$14.99', description: 'Regular delivery' },
  { id: 'Expedited', name: 'Expedited', days: '2-3', price: '$24.99', description: 'Faster delivery' },
  { id: 'Priority', name: 'Priority', days: '1-2', price: '$34.99', description: 'Priority handling' },
  { id: 'Overnight', name: 'Overnight', days: '1', price: '$49.99', description: 'Next day delivery' },
];

const PACKAGE_OPTIONS = [
  { id: 'Envelope', name: 'Envelope', maxWeight: '1 lb', price: '+$0.00', description: 'Document envelope' },
  { id: 'Pak', name: 'Pak', maxWeight: '10 lb', price: '+$5.00', description: 'Padded envelope' },
  { id: 'Tube', name: 'Tube', maxWeight: '20 lb', price: '+$10.00', description: 'Cardboard tube' },
  { id: 'Box', name: 'Box', maxWeight: '70 lb', price: '+$15.00', description: 'Cardboard box' },
  { id: 'Pallet', name: 'Pallet', maxWeight: '1000 lb', price: '+$100.00', description: 'Shipping pallet' },
];

export default function ShippingSelector({ value, onChange }: ShippingSelectorProps) {
  const { carrier, speed, packageType, insurance = false, signatureRequired = false } = value;

  const updateField = (field: keyof ShippingState, fieldValue: any) => {
    onChange({ ...value, [field]: fieldValue });
  };

  return (
    <div className="space-y-8">
      {/* Carrier Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Carrier</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CARRIER_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => updateField('carrier', option.id)}
              className={`
                flex flex-col items-center justify-center p-4 rounded-xl border-2
                transition-all duration-200 hover:scale-105 text-center
                ${carrier === option.id 
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                }
              `}
            >
              <span className="text-2xl mb-2">{option.icon}</span>
              <span className="font-medium text-sm mb-1">{option.name}</span>
              <span className="text-xs opacity-75">{option.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Speed Selection */}
      {carrier && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Speed</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {SPEED_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => updateField('speed', option.id)}
                className={`
                  flex flex-col items-center justify-center p-4 rounded-lg border-2
                  transition-all duration-200 hover:scale-105 text-center
                  ${speed === option.id 
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                  }
                `}
              >
                <span className="font-bold text-lg mb-1">{option.days}</span>
                <span className="font-medium text-sm mb-1">{option.name}</span>
                <span className="text-xs opacity-75 mb-2">{option.description}</span>
                <span className="font-bold">{option.price}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Package Type */}
      {speed && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Package Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {PACKAGE_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => updateField('packageType', option.id)}
                className={`
                  flex flex-col items-center justify-center p-4 rounded-lg border-2
                  transition-all duration-200 hover:scale-105 text-center
                  ${packageType === option.id 
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                  }
                `}
              >
                <span className="font-bold text-lg mb-1">{option.maxWeight}</span>
                <span className="font-medium text-sm mb-1">{option.name}</span>
                <span className="text-xs opacity-75 mb-2">{option.description}</span>
                <span className="font-bold">{option.price}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Options */}
      {packageType && (
        <div className="bg-gray-50 p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Options</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">💰</div>
                <div>
                  <h4 className="font-medium text-gray-900">Insurance</h4>
                  <p className="text-sm text-gray-600">Up to $5,000 coverage</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => updateField('insurance', !insurance)}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full
                  ${insurance ? 'bg-blue-600' : 'bg-gray-200'}
                `}
              >
                <span className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition
                  ${insurance ? 'translate-x-6' : 'translate-x-1'}
                `} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">✍️</div>
                <div>
                  <h4 className="font-medium text-gray-900">Signature Required</h4>
                  <p className="text-sm text-gray-600">Require signature upon delivery</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => updateField('signatureRequired', !signatureRequired)}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full
                  ${signatureRequired ? 'bg-blue-600' : 'bg-gray-200'}
                `}
              >
                <span className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition
                  ${signatureRequired ? 'translate-x-6' : 'translate-x-1'}
                `} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      {(carrier || speed || packageType) && (
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Summary</h3>
          <div className="space-y-4">
            {carrier && (
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Carrier:</span>
                <span className="font-medium">{carrier}</span>
              </div>
            )}
            {speed && (
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Speed:</span>
                <span className="font-medium">{speed} ({SPEED_OPTIONS.find(s => s.id === speed)?.days} days)</span>
              </div>
            )}
            {packageType && (
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Package:</span>
                <span className="font-medium">{packageType} ({PACKAGE_OPTIONS.find(p => p.id === packageType)?.maxWeight})</span>
              </div>
            )}
            {insurance && (
              <div className="flex items-center justify-between text-blue-600">
                <span>Insurance:</span>
                <span className="font-medium">+$5.00</span>
              </div>
            )}
            {signatureRequired && (
              <div className="flex items-center justify-between text-blue-600">
                <span>Signature Required:</span>
                <span className="font-medium">+$3.00</span>
              </div>
            )}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">Estimated Total:</span>
                <span className="font-bold text-lg text-gray-900">
                  ${(() => {
                    const speedPrice = SPEED_OPTIONS.find(s => s.id === speed)?.price?.replace('$', '') || '0';
                    const packagePrice = PACKAGE_OPTIONS.find(p => p.id === packageType)?.price?.match(/\$([\d.]+)/)?.[1] || '0';
                    const insurancePrice = insurance ? 5 : 0;
                    const signaturePrice = signatureRequired ? 3 : 0;
                    return (parseFloat(speedPrice) + parseFloat(packagePrice) + insurancePrice + signaturePrice).toFixed(2);
                  })()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shipping Information */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h4 className="font-medium text-blue-800 mb-2">Shipping Information</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>USPS:</strong> Best for lightweight items, most economical</li>
          <li>• <strong>UPS/FedEx:</strong> Best for packages 1-70 lbs, reliable tracking</li>
          <li>• <strong>DHL:</strong> Best for international shipping</li>
          <li>• Insurance recommended for items over $500</li>
          <li>• Signature required for high-value items</li>
          <li>• Shipping costs are estimates, final cost may vary</li>
        </ul>
      </div>
    </div>
  );
}
