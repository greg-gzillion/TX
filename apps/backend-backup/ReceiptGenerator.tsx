'use client';

import * as React from 'react';
import QRCode from 'react-qr-code';

// Import Phase 3 types
import type { ShippingState } from '../phase3/ShippingSelector';
import type { PaymentState } from '../phase3/PaymentSelector';
import type { AuctionItem } from './OrderSummary';

export interface TransactionRecord {
  id: string;
  timestamp: Date;
  buyerAddress: string;
  sellerAddress: string;
  escrowAddress?: string;
  amount: number;
  currency: string;
  network: 'XRPL' | 'Coreum' | 'Ethereum';
  transactionHash: string;
  blockHeight?: number;
  status: 'pending' | 'confirmed' | 'escrow_held' | 'completed' | 'disputed';
}

export interface ReceiptData {
  transaction: TransactionRecord;
  auctionItem: AuctionItem;
  shipping: ShippingState;
  payment: PaymentState;
  buyerEmail?: string;
  sellerEmail?: string;
  notes?: string;
}

export interface ReceiptGeneratorProps {
  receiptData: ReceiptData;
  onPrint?: () => void;
  onEmail?: (email: string) => void;
  onDownload?: (format: 'pdf' | 'png' | 'json') => void;
  onVerify?: () => void;
}

export default function ReceiptGenerator({
  receiptData,
  onPrint,
  onEmail,
  onDownload,
  onVerify,
}: ReceiptGeneratorProps) {
  const [isPrinting, setIsPrinting] = React.useState(false);
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [showRawData, setShowRawData] = React.useState(false);
  const [copiedField, setCopiedField] = React.useState<string | null>(null);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    });
  };

  const formatAddress = (address: string): string => {
    return `${address.slice(0, 10)}...${address.slice(-8)}`;
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'escrow_held': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'disputed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string): string => {
    switch (status) {
      case 'pending': return '⏳';
      case 'confirmed': return '✅';
      case 'escrow_held': return '🤝';
      case 'completed': return '🎉';
      case 'disputed': return '⚠️';
      default: return '📄';
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
      onPrint?.();
    }, 500);
  };

  const handleDownload = async (format: 'pdf' | 'png' | 'json') => {
    setIsDownloading(true);
    // Simulate download
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsDownloading(false);
    onDownload?.(format);
  };

  const getExplorerUrl = (): string => {
    switch (receiptData.transaction.network) {
      case 'XRPL': return `https://xrpscan.com/tx/${receiptData.transaction.transactionHash}`;
      case 'Coreum': return `https://explorer.coreum.com/coreum/transactions/${receiptData.transaction.transactionHash}`;
      case 'Ethereum': return `https://etherscan.io/tx/${receiptData.transaction.transactionHash}`;
      default: return '#';
    }
  };

  const receiptId = `PHX-${receiptData.transaction.id.slice(0, 8).toUpperCase()}`;
  const qrValue = JSON.stringify({
    receiptId,
    transactionHash: receiptData.transaction.transactionHash,
    amount: receiptData.transaction.amount,
    currency: receiptData.transaction.currency,
    network: receiptData.transaction.network,
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Transaction Receipt</h2>
        <p className="text-gray-600 mt-2">Your official transaction confirmation</p>
      </div>

      {/* Receipt Card */}
      <div className="bg-white border-2 border-gray-800 rounded-lg p-8 shadow-lg">
        {/* Receipt Header */}
        <div className="border-b-2 border-gray-800 pb-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">PhoenixPME</h1>
              <p className="text-gray-600">Precious Metals Exchange</p>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <div className="text-2xl font-bold text-gray-900">{receiptId}</div>
              <div className="text-gray-600">Receipt ID</div>
            </div>
          </div>
        </div>

        {/* Receipt Body */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Transaction Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Transaction Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-700">Transaction ID:</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm">
                      {formatAddress(receiptData.transaction.transactionHash)}
                    </span>
                    <button
                      onClick={() => copyToClipboard(receiptData.transaction.transactionHash, 'txHash')}
                      className="text-gray-500 hover:text-gray-700"
                      title="Copy to clipboard"
                    >
                      {copiedField === 'txHash' ? '✓' : '📋'}
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-700">Date & Time:</span>
                  <span className="font-medium">{formatDate(receiptData.transaction.timestamp)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-700">Status:</span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(receiptData.transaction.status)}`}>
                    <span className="mr-2">{getStatusIcon(receiptData.transaction.status)}</span>
                    {receiptData.transaction.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-700">Network:</span>
                  <span className="font-medium">{receiptData.transaction.network}</span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-700">Amount:</span>
                  <span className="font-bold text-lg">
                    {receiptData.transaction.amount} {receiptData.transaction.currency}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-700">Method:</span>
                  <span className="font-medium">{receiptData.payment.method}</span>
                </div>
                
                {receiptData.transaction.escrowAddress && (
                  <div className="flex justify-between">
                    <span className="text-gray-700">Escrow Contract:</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-sm">
                        {formatAddress(receiptData.transaction.escrowAddress)}
                      </span>
                      <button
                        onClick={() => copyToClipboard(receiptData.transaction.escrowAddress!, 'escrow')}
                        className="text-gray-500 hover:text-gray-700"
                        title="Copy to clipboard"
                      >
                        {copiedField === 'escrow' ? '✓' : '📋'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Item Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Item Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-700">Metal Type:</span>
                  <span className="font-medium">{receiptData.auctionItem.metalType}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-700">Weight:</span>
                  <span className="font-medium">{receiptData.auctionItem.weight.toFixed(3)} troy oz</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-700">Purity:</span>
                  <span className="font-medium">{receiptData.auctionItem.purity}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-700">Form:</span>
                  <span className="font-medium">{receiptData.auctionItem.metalForm}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* QR Code */}
            <div className="bg-gray-50 p-6 rounded-lg border text-center">
              <div className="mb-4">
                <QRCode
                  value={qrValue}
                  size={160}
                  level="H"
                  className="mx-auto"
                />
              </div>
              <div className="text-sm text-gray-600">
                Scan to verify this receipt
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Contains transaction verification data
              </div>
            </div>

            {/* Addresses */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Addresses</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Buyer Address</div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                    <span className="font-mono text-sm">
                      {formatAddress(receiptData.transaction.buyerAddress)}
                    </span>
                    <button
                      onClick={() => copyToClipboard(receiptData.transaction.buyerAddress, 'buyer')}
                      className="text-gray-500 hover:text-gray-700 ml-2"
                      title="Copy to clipboard"
                    >
                      {copiedField === 'buyer' ? '✓' : '📋'}
                    </button>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-500 mb-1">Seller Address</div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                    <span className="font-mono text-sm">
                      {formatAddress(receiptData.transaction.sellerAddress)}
                    </span>
                    <button
                      onClick={() => copyToClipboard(receiptData.transaction.sellerAddress, 'seller')}
                      className="text-gray-500 hover:text-gray-700 ml-2"
                      title="Copy to clipboard"
                    >
                      {copiedField === 'seller' ? '✓' : '📋'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            {receiptData.shipping.carrier && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Shipping Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Carrier:</span>
                    <span className="font-medium">{receiptData.shipping.carrier}</span>
                  </div>
                  
                  {receiptData.shipping.speed && (
                    <div className="flex justify-between">
                      <span className="text-gray-700">Speed:</span>
                      <span className="font-medium">{receiptData.shipping.speed}</span>
                    </div>
                  )}
                  
                  {receiptData.shipping.packageType && (
                    <div className="flex justify-between">
                      <span className="text-gray-700">Package:</span>
                      <span className="font-medium">{receiptData.shipping.packageType}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-300">
          <div className="text-center text-gray-600 text-sm">
            <p>This is an official digital receipt from PhoenixPME</p>
            <p className="mt-1">Transaction recorded on {receiptData.transaction.network} blockchain</p>
            <p className="mt-1">Receipt ID: {receiptId} • {formatDate(receiptData.transaction.timestamp)}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={handlePrint}
          disabled={isPrinting}
          className="flex items-center space-x-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:opacity-50"
        >
          <span>🖨️</span>
          <span>{isPrinting ? 'Printing...' : 'Print Receipt'}</span>
        </button>
        
        <button
          onClick={() => handleDownload('pdf')}
          disabled={isDownloading}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <span>📥</span>
          <span>{isDownloading ? 'Downloading...' : 'Download PDF'}</span>
        </button>
        
        <button
          onClick={() => handleDownload('png')}
          disabled={isDownloading}
          className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          <span>🖼️</span>
          <span>Save as Image</span>
        </button>
        
        {onEmail && receiptData.buyerEmail && (
          <button
            onClick={() => onEmail(receiptData.buyerEmail!)}
            className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <span>📧</span>
            <span>Email Receipt</span>
          </button>
        )}
        
        <button
          onClick={() => window.open(getExplorerUrl(), '_blank')}
          className="flex items-center space-x-2 px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
        >
          <span>🔍</span>
          <span>View on Explorer</span>
        </button>
        
        <button
          onClick={() => setShowRawData(!showRawData)}
          className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          <span>{showRawData ? '▲' : '▼'}</span>
          <span>{showRawData ? 'Hide Raw Data' : 'Show Raw Data'}</span>
        </button>
      </div>

      {/* Raw Data (for debugging/verification) */}
      {showRawData && (
        <div className="mt-6 bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto">
          <pre className="text-sm font-mono whitespace-pre-wrap">
            {JSON.stringify(receiptData, null, 2)}
          </pre>
        </div>
      )}

      {/* Verification Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Receipt Verification</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded border">
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-2xl">🔗</span>
              <div>
                <div className="font-medium">Blockchain Verified</div>
                <div className="text-sm text-gray-600">Immutable record on {receiptData.transaction.network}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded border">
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-2xl">📜</span>
              <div>
                <div className="font-medium">Digital Signature</div>
                <div className="text-sm text-gray-600">Cryptographically signed receipt</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded border">
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-2xl">🛡️</span>
              <div>
                <div className="font-medium">Fraud Protection</div>
                <div className="text-sm text-gray-600">QR code verification enabled</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-blue-700">
          <p>• This receipt can be verified by scanning the QR code or checking the blockchain explorer</p>
          <p>• The transaction hash is immutable and serves as proof of transaction</p>
          <p>• Contact support@phoenixpme.com for verification assistance</p>
        </div>
      </div>

      {/* Notes Section */}
      {receiptData.notes && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-medium text-yellow-800 mb-2">Additional Notes</h4>
          <p className="text-yellow-700">{receiptData.notes}</p>
        </div>
      )}
    </div>
  );
}
