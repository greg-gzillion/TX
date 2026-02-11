'use client';

import * as React from 'react';

// Import Phase 3 types
import type { ShippingState } from '../phase3/ShippingSelector';
import type { PaymentState } from '../phase3/PaymentSelector';
import type { EscrowState } from '../phase3/EscrowTerms';

export interface SmartContractTerms {
  contractAddress: string;
  network: 'Coreum' | 'XRPL';
  escrowDurationDays: number;
  arbitrationProvider: string;
  releaseConditions: string[];
}

export interface LegalDocument {
  id: string;
  title: string;
  content: string;
  required: boolean;
}

export interface ConfirmationStepProps {
  shipping: ShippingState;
  payment: PaymentState;
  escrow?: EscrowState;
  smartContractTerms?: SmartContractTerms;
  legalDocuments: LegalDocument[];
  onConfirm: () => void;
  onBack: () => void;
  isLoading?: boolean;
  error?: string;
}

export default function ConfirmationStep({
  shipping,
  payment,
  escrow,
  smartContractTerms,
  legalDocuments,
  onConfirm,
  onBack,
  isLoading = false,
  error,
}: ConfirmationStepProps) {
  const [acceptedDocs, setAcceptedDocs] = React.useState<Set<string>>(new Set());
  const [showSmartContract, setShowSmartContract] = React.useState(false);
  const [showAllTerms, setShowAllTerms] = React.useState(false);

  // Auto-accept required documents
  React.useEffect(() => {
    const requiredDocIds = legalDocuments
      .filter(doc => doc.required)
      .map(doc => doc.id);
    
    setAcceptedDocs(prev => {
      const newSet = new Set(prev);
      requiredDocIds.forEach(id => newSet.add(id));
      return newSet;
    });
  }, [legalDocuments]);

  const toggleDocument = (docId: string) => {
    setAcceptedDocs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(docId)) {
        newSet.delete(docId);
      } else {
        newSet.add(docId);
      }
      return newSet;
    });
  };

  const allDocumentsAccepted = legalDocuments.every(
    doc => !doc.required || acceptedDocs.has(doc.id)
  );

  const getPaymentMethodIcon = (method?: string) => {
    switch (method) {
      case 'XRP': return '⚡';
      case 'SOLO': return '🔷';
      case 'COREUM': return '🟣';
      case 'USDT': return '💵';
      default: return '💰';
    }
  };

  const getEscrowLevelIcon = (level?: string) => {
    switch (level) {
      case 'basic': return '🛡️';
      case 'standard': return '🛡️🛡️';
      case 'premium': return '🛡️🛡️🛡️';
      default: return '🤝';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Final Confirmation</h2>
        <p className="text-gray-600 mt-2">Review and accept the terms to complete your order</p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center">
            1
          </div>
          <div className="w-24 h-1 bg-green-500"></div>
          <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center">
            2
          </div>
          <div className="w-24 h-1 bg-green-500"></div>
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
            3
          </div>
        </div>
      </div>
      <div className="flex justify-center text-sm text-gray-600">
        <div className="w-32 text-center">Order Details</div>
        <div className="w-32 text-center">Payment Info</div>
        <div className="w-32 text-center">Confirmation</div>
      </div>

      {/* Order Summary Preview */}
      <div className="bg-gray-50 p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Preview</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded border">
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-2xl">🚢</span>
              <div>
                <div className="font-medium">Shipping</div>
                <div className="text-sm text-gray-600">
                  {shipping.carrier || 'Not selected'} • {shipping.speed || 'Standard'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded border">
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-2xl">{getPaymentMethodIcon(payment.method)}</span>
              <div>
                <div className="font-medium">Payment</div>
                <div className="text-sm text-gray-600">
                  {payment.method || 'Not selected'}
                  {payment.useEscrow && ' • With Escrow'}
                </div>
              </div>
            </div>
          </div>

          {escrow && (
            <div className="bg-white p-4 rounded border">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-2xl">{getEscrowLevelIcon(escrow.level)}</span>
                <div>
                  <div className="font-medium">Escrow</div>
                  <div className="text-sm text-gray-600">
                    {escrow.level.charAt(0).toUpperCase() + escrow.level.slice(1)} Protection
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Smart Contract Terms */}
      {smartContractTerms && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg overflow-hidden">
          <div 
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-blue-100"
            onClick={() => setShowSmartContract(!showSmartContract)}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📜</span>
              <div>
                <h3 className="font-semibold text-blue-900">Smart Contract Terms</h3>
                <p className="text-sm text-blue-700">
                  {smartContractTerms.network} • {smartContractTerms.contractAddress.slice(0, 8)}...{smartContractTerms.contractAddress.slice(-8)}
                </p>
              </div>
            </div>
            <span className="text-blue-600">{showSmartContract ? '▲' : '▼'}</span>
          </div>
          
          {showSmartContract && (
            <div className="p-4 border-t border-blue-200">
              <div className="space-y-3">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-blue-700">Contract Address</div>
                    <div className="font-mono text-sm bg-white p-2 rounded border">
                      {smartContractTerms.contractAddress}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-blue-700">Network</div>
                    <div className="font-medium">{smartContractTerms.network}</div>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-blue-700 mb-2">Release Conditions</div>
                  <ul className="space-y-1">
                    {smartContractTerms.releaseConditions.map((condition, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-sm">{condition}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="text-sm text-blue-700">
                  <span className="font-medium">Escrow Duration:</span> {smartContractTerms.escrowDurationDays} days
                  <span className="mx-4">•</span>
                  <span className="font-medium">Arbitration:</span> {smartContractTerms.arbitrationProvider}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Legal Documents */}
      <div className="bg-white border rounded-lg">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Legal Agreements</h3>
          <p className="text-gray-600 text-sm mt-1">
            Please review and accept all required documents
          </p>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {legalDocuments.map((doc) => (
              <div
                key={doc.id}
                className={`p-4 rounded-lg border ${
                  acceptedDocs.has(doc.id)
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() => toggleDocument(doc.id)}
                        className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                          acceptedDocs.has(doc.id)
                            ? 'bg-green-500 text-white'
                            : 'bg-white border border-gray-300'
                        }`}
                      >
                        {acceptedDocs.has(doc.id) && '✓'}
                      </button>
                      <div>
                        <div className="font-medium text-gray-900">
                          {doc.title}
                          {doc.required && (
                            <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                              Required
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {showAllTerms || doc.id === 'terms' ? (
                            <div className="max-h-40 overflow-y-auto p-3 bg-white rounded border">
                              {doc.content}
                            </div>
                          ) : (
                            <div className="truncate">{doc.content.substring(0, 100)}...</div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {!showAllTerms && doc.id !== 'terms' && (
                      <button
                        type="button"
                        onClick={() => setShowAllTerms(true)}
                        className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                      >
                        Read full terms
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {!showAllTerms && (
            <button
              type="button"
              onClick={() => setShowAllTerms(true)}
              className="mt-4 w-full py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Show All Terms and Conditions
            </button>
          )}
        </div>
      </div>

      {/* Final Warning */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <h4 className="font-medium text-red-800">Important Warning</h4>
            <ul className="text-sm text-red-700 space-y-1 mt-1">
              <li>• Once confirmed, this transaction cannot be canceled or reversed</li>
              <li>• Payments are processed on-chain and are irreversible</li>
              <li>• You are responsible for providing accurate shipping information</li>
              <li>• Metal prices may fluctuate between order and settlement</li>
              {escrow && (
                <li>• Escrow release requires all conditions to be met</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">❌</span>
            <div className="text-red-700 font-medium">{error}</div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button
          onClick={onBack}
          disabled={isLoading}
          className="px-6 py-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          ← Back to Order Summary
        </button>
        
        <button
          onClick={onConfirm}
          disabled={!allDocumentsAccepted || isLoading}
          className={`flex-1 py-4 px-6 rounded-lg font-bold text-lg transition-all ${
            allDocumentsAccepted && !isLoading
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:opacity-90'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Processing...
            </div>
          ) : (
            `Confirm & Place Order ${payment.useEscrow ? 'with Escrow' : ''}`
          )}
        </button>
      </div>

      {/* Acceptance Status */}
      <div className="text-center">
        {allDocumentsAccepted ? (
          <div className="inline-flex items-center space-x-2 text-green-600">
            <span className="text-xl">✅</span>
            <span>All required documents accepted</span>
          </div>
        ) : (
          <div className="inline-flex items-center space-x-2 text-red-600">
            <span className="text-xl">❌</span>
            <span>Please accept all required documents</span>
          </div>
        )}
      </div>

      {/* Help Text */}
      <div className="text-sm text-gray-500 space-y-2 text-center">
        <p>Need help? Contact support at support@phoenixpme.com</p>
        <p>By confirming, you authorize PhoenixPME to execute this transaction on your behalf</p>
      </div>
    </div>
  );
}
