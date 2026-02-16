'use client';

import * as React from 'react';
import Image from 'next/image';

// Import Phase 3 types
import type { ShippingState } from '../phase3/ShippingSelector';
import type { PaymentState } from '../phase3/PaymentSelector';
import type { ConverterState } from '../phase3/CurrencyConverter';
import type { EscrowState } from '../phase3/EscrowTerms';

export type MetalType = 'Gold' | 'Silver' | 'Platinum' | 'Palladium';
export type MetalForm = 'Bar' | 'Coin' | 'Jewelry' | 'Other';
export type Purity = '24K' | '22K' | '18K' | '14K' | 'Sterling';

export interface AuctionItem {
  id: string;
  metalType: MetalType;
  metalForm: MetalForm;
  weight: number; // in troy ounces
  purity: Purity;
  description: string;
  imageUrl?: string;
  spotPriceUSD: number; // current spot price per troy ounce
  premiumPercent: number; // seller's premium over spot
}

export interface OrderSummaryProps {
  auctionItem: AuctionItem;
  shipping: ShippingState;
  payment: PaymentState;
  converter: ConverterState;
  escrow?: EscrowState;
  onEditShipping?: () => void;
  onEditPayment?: () => void;
  onEditEscrow?: () => void;
  onConfirm?: () => void;
}

// Helper to format currency
const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  if (currency === 'USD' || currency === 'rUSD') {
    return `$${amount.toFixed(2)}`;
  }
  return `${amount.toFixed(4)} ${currency}`;
};

// Helper to get metal color
const getMetalColor = (metalType: MetalType): string => {
  switch (metalType) {
    case 'Gold': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'Silver': return 'text-gray-600 bg-gray-50 border-gray-200';
    case 'Platinum': return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'Palladium': return 'text-purple-600 bg-purple-50 border-purple-200';
  }
};

// Helper to get metal icon
const getMetalIcon = (metalType: MetalType): string => {
  switch (metalType) {
    case 'Gold': return '🟡';
    case 'Silver': return '⚪';
    case 'Platinum': return '🔷';
    case 'Palladium': return '🟣';
  }
};

// Helper to calculate values
const calculateOrderDetails = (
  auctionItem: AuctionItem,
  shipping: ShippingState,
  payment: PaymentState,
  converter: ConverterState,
  escrow?: EscrowState
) => {
  // Metal value
  const metalValueUSD = auctionItem.weight * auctionItem.spotPriceUSD;
  const premiumAmount = metalValueUSD * (auctionItem.premiumPercent / 100);
  const subtotalUSD = metalValueUSD + premiumAmount;
  
  // Shipping cost (simplified)
  const shippingCostUSD = 25.00; // Would come from shipping API
  
  // Payment fees
  const getPaymentFeePercent = () => {
    switch (payment.method) {
      case 'XRP': return 0.01;
      case 'SOLO': return 0.02;
      case 'COREUM': return 0.015;
      case 'USDT': return 0.03;
      default: return 0.02;
    }
  };
  
  const paymentFeePercent = getPaymentFeePercent();
  const paymentFeeUSD = subtotalUSD * (paymentFeePercent / 100);
  
  // Escrow fee
  const escrowFeeUSD = escrow ? (subtotalUSD * (escrow.amount * (escrow.level === 'basic' ? 0.015 : escrow.level === 'standard' ? 0.025 : 0.035))) : 0;
  
  // Platform fee
  const platformFeeUSD = subtotalUSD * 0.01; // 1% platform fee
  
  // Total
  const totalUSD = subtotalUSD + shippingCostUSD + paymentFeeUSD + escrowFeeUSD + platformFeeUSD;
  
  // Convert to selected currency
  const convertToCurrency = (amountUSD: number, targetCurrency: string) => {
    const rate = converter.exchangeRates[targetCurrency as keyof typeof converter.exchangeRates] || 1;
    return amountUSD / rate;
  };
  
  const targetCurrency = payment.method === 'USDT' ? 'USDT' : payment.method || 'XRP';
  const totalInTarget = convertToCurrency(totalUSD, targetCurrency);
  
  return {
    metalValueUSD,
    premiumAmount,
    subtotalUSD,
    shippingCostUSD,
    paymentFeePercent,
    paymentFeeUSD,
    escrowFeeUSD,
    platformFeeUSD,
    totalUSD,
    totalInTarget,
    targetCurrency,
  };
};

export default function OrderSummary({
  auctionItem,
  shipping,
  payment,
  converter,
  escrow,
  onEditShipping,
  onEditPayment,
  onEditEscrow,
  onConfirm,
}: OrderSummaryProps) {
  const details = calculateOrderDetails(auctionItem, shipping, payment, converter, escrow);
  const metalColor = getMetalColor(auctionItem.metalType);
  const metalIcon = getMetalIcon(auctionItem.metalType);
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>
        <p className="text-gray-600">Review your transaction details before confirming</p>
      </div>
      
      {/* Item Details */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Item Details</h3>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Item Image */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-lg bg-gray-100 border flex items-center justify-center">
              {auctionItem.imageUrl ? (
                <Image
                  src={auctionItem.imageUrl}
                  alt={auctionItem.description}
                  width={128}
                  height={128}
                  className="rounded-lg object-cover"
                />
              ) : (
                <div className="text-4xl">{metalIcon}</div>
              )}
            </div>
          </div>
          
          {/* Item Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${metalColor} border`}>
                  {auctionItem.metalType}
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mt-2">
                  {auctionItem.metalForm} - {auctionItem.weight.toFixed(2)} oz
                </h4>
                <p className="text-gray-600 mt-1">{auctionItem.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <div className="text-sm text-gray-500">Purity</div>
                    <div className="font-medium">{auctionItem.purity}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Weight</div>
                    <div className="font-medium">{auctionItem.weight.toFixed(3)} troy oz</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Spot Price</div>
                    <div className="font-medium">${auctionItem.spotPriceUSD.toFixed(2)}/oz</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Premium</div>
                    <div className="font-medium">{auctionItem.premiumPercent}%</div>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-gray-500">Metal Value</div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(details.metalValueUSD)}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {formatCurrency(details.metalValueUSD / converter.exchangeRates.XRP, 'XRP')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Pricing Breakdown */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Breakdown</h3>
        
        <div className="space-y-3">
          {/* Metal Value */}
          <div className="flex justify-between items-center">
            <div className="text-gray-700">Metal Value ({auctionItem.weight.toFixed(3)} oz)</div>
            <div className="font-medium">{formatCurrency(details.metalValueUSD)}</div>
          </div>
          
          {/* Premium */}
          <div className="flex justify-between items-center">
            <div className="text-gray-700">Seller Premium ({auctionItem.premiumPercent}%)</div>
            <div className="font-medium text-blue-600">+{formatCurrency(details.premiumAmount)}</div>
          </div>
          
          {/* Subtotal */}
          <div className="flex justify-between items-center pt-3 border-t">
            <div className="font-medium text-gray-900">Subtotal</div>
            <div className="font-bold">{formatCurrency(details.subtotalUSD)}</div>
          </div>
          
          {/* Shipping */}
          <div className="flex justify-between items-center">
            <div>
              <div className="text-gray-700">Shipping</div>
              {shipping.carrier && (
                <div className="text-sm text-gray-500">
                  {shipping.carrier} • {shipping.speed} • {shipping.packageType}
                  {onEditShipping && (
                    <button
                      onClick={onEditShipping}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="font-medium">+{formatCurrency(details.shippingCostUSD)}</div>
          </div>
          
          {/* Payment Fee */}
          {payment.method && (
            <div className="flex justify-between items-center">
              <div>
                <div className="text-gray-700">Payment Processing ({details.paymentFeePercent}%)</div>
                <div className="text-sm text-gray-500">
                  {payment.method}
                  {onEditPayment && (
                    <button
                      onClick={onEditPayment}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
              <div className="font-medium text-yellow-600">+{formatCurrency(details.paymentFeeUSD)}</div>
            </div>
          )}
          
          {/* Escrow Fee */}
          {escrow && (
            <div className="flex justify-between items-center">
              <div>
                <div className="text-gray-700">Escrow Protection</div>
                <div className="text-sm text-gray-500">
                  {escrow.level.charAt(0).toUpperCase() + escrow.level.slice(1)} Level
                  {onEditEscrow && (
                    <button
                      onClick={onEditEscrow}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
              <div className="font-medium text-purple-600">+{formatCurrency(details.escrowFeeUSD)}</div>
            </div>
          )}
          
          {/* Platform Fee */}
          <div className="flex justify-between items-center">
            <div className="text-gray-700">Platform Fee (1%)</div>
            <div className="font-medium text-gray-600">+{formatCurrency(details.platformFeeUSD)}</div>
          </div>
          
          {/* Total */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div>
              <div className="text-lg font-bold text-gray-900">Total Amount</div>
              <div className="text-sm text-gray-600">
                Payable in {payment.method || 'XRP'}
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">
                {formatCurrency(details.totalInTarget, details.targetCurrency)}
              </div>
              <div className="text-sm text-gray-600">
                ≈ {formatCurrency(details.totalUSD)}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Conversion Rate */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-blue-800">Conversion Rate</div>
            <div className="text-sm text-blue-700">
              1 {details.targetCurrency} = {formatCurrency(converter.exchangeRates[details.targetCurrency as keyof typeof converter.exchangeRates] || 1)} USD
            </div>
          </div>
          <div className="text-sm text-blue-700">
            Rate updated: {converter.lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      {onConfirm && (
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button
            onClick={onConfirm}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity"
          >
            Confirm & Place Order
          </button>
          <button className="px-6 py-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            Save for Later
          </button>
        </div>
      )}
      
      {/* Order Notes */}
      <div className="text-sm text-gray-500 space-y-2">
        <p>• By confirming this order, you agree to PhoenixPME's Terms of Service</p>
        <p>• Metal prices are based on real-time spot prices and may fluctuate</p>
        <p>• Shipping times are estimates and may vary based on carrier</p>
        <p>• Payments are processed on-chain and cannot be reversed</p>
        {escrow && (
          <p>• Escrow funds will be released according to the smart contract terms</p>
        )}
      </div>
    </div>
  );
}
