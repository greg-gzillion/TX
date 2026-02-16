'use client';

import * as React from 'react';

export type PaymentMethod = 'XRP' | 'SOLO' | 'COREUM' | 'USDT' | 'Escrow';
export type ConversionType = 'direct' | 'converted';

export interface PaymentState {
  method?: PaymentMethod;
  conversionType?: ConversionType;
  useEscrow?: boolean;
  escrowFeePercent?: number;
}

export interface PaymentSelectorProps {
  value: PaymentState;
  onChange: (payment: PaymentState) => void;
}

export default function PaymentSelector({ value, onChange }: PaymentSelectorProps) {
  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold">Payment Selector</h3>
      <p>Working component</p>
    </div>
  );
}
