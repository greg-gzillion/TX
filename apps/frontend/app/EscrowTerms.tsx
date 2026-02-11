'use client';

import * as React from 'react';

export type EscrowLevel = 'basic' | 'standard' | 'premium';
export type EscrowStatus = 'not_started' | 'funded' | 'shipped' | 'delivered' | 'released' | 'disputed';

export interface EscrowState {
  level: EscrowLevel;
  buyerAddress?: string;
  sellerAddress?: string;
  escrowAddress?: string;
  amount: number;
  currency: string;
  releaseConditions: string[];
  disputeTimeoutDays: number;
}

export interface EscrowTermsProps {
  value: EscrowState;
  onChange: (terms: EscrowState) => void;
  readOnly?: boolean;
}

export default function EscrowTerms({ value, onChange, readOnly = false }: EscrowTermsProps) {
  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold">Escrow Terms</h3>
      <p>Smart contract display</p>
    </div>
  );
}
