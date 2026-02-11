'use client';

import * as React from 'react';

// Import Phase 3 types
import type { PaymentState } from '../phase3/PaymentSelector';
import type { EscrowState } from '../phase3/EscrowTerms';

export type WalletType = 'xumm' | 'keplr' | 'gemwallet' | 'crossmark';
export type NetworkType = 'XRPL' | 'Coreum' | 'Ethereum' | 'Solana';
export type TransactionStatus = 'idle' | 'connecting' | 'signing' | 'broadcasting' | 'confirmed' | 'failed';

export interface WalletInfo {
  type: WalletType;
  address: string;
  network: NetworkType;
  balance: number;
  currency: string;
  isConnected: boolean;
}

export interface TransactionDetails {
  amount: number;
  currency: string;
  destinationAddress: string;
  memo?: string;
  fee: number;
  networkFee: number;
  total: number;
  escrowContractAddress?: string;
}

export interface PaymentProcessorProps {
  payment: PaymentState;
  escrow?: EscrowState;
  transaction: TransactionDetails;
  onPaymentComplete: (transactionId: string) => void;
  onPaymentFailed: (error: string) => void;
  onBack: () => void;
}

export default function PaymentProcessor({
  payment,
  escrow,
  transaction,
  onPaymentComplete,
  onPaymentFailed,
  onBack,
}: PaymentProcessorProps) {
  const [wallet, setWallet] = React.useState<WalletInfo | null>(null);
  const [status, setStatus] = React.useState<TransactionStatus>('idle');
  const [transactionId, setTransactionId] = React.useState<string>('');
  const [error, setError] = React.useState<string>('');
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const [countdown, setCountdown] = React.useState(300); // 5 minutes

  // Countdown timer
  React.useEffect(() => {
    if (status === 'signing' || status === 'broadcasting') {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 0) {
            clearInterval(timer);
            handlePaymentFailed('Transaction timeout');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [status]);

  const getWalletForPaymentMethod = (): WalletType => {
    switch (payment.method) {
      case 'XRP':
      case 'SOLO':
        return 'xumm'; // XRPL wallets
      case 'COREUM':
      case 'rUSD':
        return 'keplr'; // Coreum wallets
      case 'USDT':
        return payment.conversionType === 'direct' ? 'xumm' : 'gemwallet'; // USDT on XRPL or EVM
      default:
        return 'xumm';
    }
  };

  const getNetworkForPaymentMethod = (): NetworkType => {
    switch (payment.method) {
      case 'XRP':
      case 'SOLO':
        return 'XRPL';
      case 'COREUM':
      case 'rUSD':
        return 'Coreum';
      case 'USDT':
        return payment.conversionType === 'direct' ? 'XRPL' : 'Ethereum';
      default:
        return 'XRPL';
    }
  };

  const connectWallet = async () => {
    try {
      setStatus('connecting');
      setError('');

      const walletType = getWalletForPaymentMethod();
      const network = getNetworkForPaymentMethod();

      // Simulate wallet connection
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockWallet: WalletInfo = {
        type: walletType,
        address: `addr_${Math.random().toString(36).substr(2, 9)}`,
        network,
        balance: 1000, // Mock balance
        currency: payment.method || 'XRP',
        isConnected: true,
      };

      setWallet(mockWallet);
      setStatus('idle');
    } catch (err) {
      setError(`Failed to connect wallet: ${err}`);
      setStatus('idle');
    }
  };

  const handlePayment = async () => {
    if (!wallet) {
      setError('Please connect your wallet first');
      return;
    }

    if (wallet.balance < transaction.total) {
      setError(`Insufficient balance. Need ${transaction.total} ${wallet.currency}, have ${wallet.balance}`);
      return;
    }

    try {
      setStatus('signing');
      setError('');

      // Simulate transaction signing
      await new Promise(resolve => setTimeout(resolve, 2000));

      setStatus('broadcasting');

      // Simulate network broadcast
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Generate mock transaction ID
      const mockTxId = `tx_${Math.random().toString(36).substr(2, 16)}_${Date.now()}`;
      setTransactionId(mockTxId);
      setStatus('confirmed');

      // Notify parent component
      setTimeout(() => onPaymentComplete(mockTxId), 1000);
    } catch (err) {
      handlePaymentFailed(`Payment failed: ${err}`);
    }
  };

  const handlePaymentFailed = (errorMessage: string) => {
    setError(errorMessage);
    setStatus('failed');
    onPaymentFailed(errorMessage);
  };

  const formatCountdown = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'idle': return '💰';
      case 'connecting': return '🔗';
      case 'signing': return '✍️';
      case 'broadcasting': return '📡';
      case 'confirmed': return '✅';
      case 'failed': return '❌';
      default: return '💰';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'idle': return 'text-gray-600 bg-gray-100';
      case 'connecting': return 'text-blue-600 bg-blue-100';
      case 'signing': return 'text-yellow-600 bg-yellow-100';
      case 'broadcasting': return 'text-purple-600 bg-purple-100';
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getWalletIcon = (walletType?: WalletType) => {
    switch (walletType) {
      case 'xumm': return '📱';
      case 'keplr': return '🔷';
      case 'gemwallet': return '💎';
      case 'crossmark': return '✖️';
      default: return '👛';
    }
  };

  const getNetworkIcon = (network?: NetworkType) => {
    switch (network) {
      case 'XRPL': return '⚡';
      case 'Coreum': return '🟣';
      case 'Ethereum': return '🔶';
      case 'Solana': return '🟢';
      default: return '🌐';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Payment Processing</h2>
        <p className="text-gray-600 mt-2">Complete your payment using your crypto wallet</p>
      </div>

      {/* Status Indicator */}
      <div className="bg-white border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${getStatusColor()}`}>
              {getStatusIcon()}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 capitalize">{status} Payment</h3>
              <p className="text-sm text-gray-600">
                {status === 'idle' && 'Ready to process payment'}
                {status === 'connecting' && 'Connecting to your wallet...'}
                {status === 'signing' && 'Signing transaction...'}
                {status === 'broadcasting' && 'Broadcasting to network...'}
                {status === 'confirmed' && 'Payment confirmed!'}
                {status === 'failed' && 'Payment failed'}
              </p>
            </div>
          </div>
          
          {(status === 'signing' || status === 'broadcasting') && (
            <div className="text-center">
              <div className="text-2xl font-mono font-bold text-gray-900">
                {formatCountdown(countdown)}
              </div>
              <div className="text-sm text-gray-600">Time remaining</div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-500"
            style={{ 
              width: status === 'idle' ? '0%' :
                     status === 'connecting' ? '25%' :
                     status === 'signing' ? '50%' :
                     status === 'broadcasting' ? '75%' :
                     status === 'confirmed' ? '100%' : '0%'
            }}
          ></div>
        </div>
        
        <div className="flex justify-between text-sm text-gray-600">
          <span>Connect</span>
          <span>Sign</span>
          <span>Broadcast</span>
          <span>Confirm</span>
        </div>
      </div>

      {/* Wallet Connection */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Wallet Connection</h3>
        
        {!wallet ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">👛</div>
            <p className="text-gray-600 mb-6">Connect your wallet to proceed with payment</p>
            <button
              onClick={connectWallet}
              disabled={status !== 'idle'}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-8 rounded-lg font-bold hover:opacity-90 disabled:opacity-50"
            >
              Connect {getWalletForPaymentMethod().toUpperCase()} Wallet
            </button>
            <p className="text-sm text-gray-500 mt-4">
              Required for {getNetworkForPaymentMethod()} network
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{getWalletIcon(wallet.type)}</div>
                <div>
                  <div className="font-medium">{wallet.type.toUpperCase()} Wallet</div>
                  <div className="text-sm text-gray-600">
                    {wallet.address.slice(0, 8)}...{wallet.address.slice(-8)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">{wallet.balance.toFixed(2)} {wallet.currency}</div>
                <div className="text-sm text-gray-600">Available</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xl">{getNetworkIcon(wallet.network)}</span>
                  <div className="font-medium">Network</div>
                </div>
                <div className="text-sm text-blue-700">{wallet.network}</div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xl">💱</span>
                  <div className="font-medium">Payment Method</div>
                </div>
                <div className="text-sm text-green-700">{payment.method}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Details */}
      <div className="bg-white border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Transaction Details</h3>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="text-gray-700">Amount</div>
            <div className="font-medium">{transaction.amount} {transaction.currency}</div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-gray-700">Network Fee</div>
            <div className="font-medium">{transaction.networkFee} {transaction.currency}</div>
          </div>
          
          {transaction.fee > 0 && (
            <div className="flex justify-between items-center">
              <div className="text-gray-700">Service Fee</div>
              <div className="font-medium text-yellow-600">+{transaction.fee} {transaction.currency}</div>
            </div>
          )}

          {escrow && (
            <div className="flex justify-between items-center">
              <div className="text-gray-700">Escrow Deposit</div>
              <div className="font-medium text-purple-600">+{escrow.amount} {transaction.currency}</div>
            </div>
          )}

          <div className="flex justify-between items-center pt-3 border-t">
            <div className="font-bold text-gray-900">Total to Pay</div>
            <div className="text-2xl font-bold text-gray-900">
              {transaction.total} {transaction.currency}
            </div>
          </div>

          {showAdvanced && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Destination:</span>
                <span className="font-mono">{transaction.destinationAddress.slice(0, 16)}...</span>
              </div>
              {transaction.escrowContractAddress && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Escrow Contract:</span>
                  <span className="font-mono">{transaction.escrowContractAddress.slice(0, 16)}...</span>
                </div>
              )}
              {transaction.memo && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Memo:</span>
                  <span>{transaction.memo}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Balance Check */}
      {wallet && (
        <div className={`p-4 rounded-lg border ${
          wallet.balance >= transaction.total
            ? 'bg-green-50 border-green-200'
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">
                {wallet.balance >= transaction.total ? '✅' : '❌'}
              </span>
              <div>
                <div className="font-medium">
                  {wallet.balance >= transaction.total ? 'Sufficient Balance' : 'Insufficient Balance'}
                </div>
                <div className="text-sm">
                  Wallet: {wallet.balance.toFixed(2)} {wallet.currency} • 
                  Needed: {transaction.total.toFixed(2)} {wallet.currency}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className={`font-bold ${
                wallet.balance >= transaction.total ? 'text-green-700' : 'text-red-700'
              }`}>
                {Math.abs(wallet.balance - transaction.total).toFixed(2)} {wallet.currency}
              </div>
              <div className="text-sm">
                {wallet.balance >= transaction.total ? 'Surplus' : 'Shortfall'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">⚠️</span>
            <div className="text-red-700">{error}</div>
          </div>
        </div>
      )}

      {/* Transaction ID Display */}
      {transactionId && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">���</span>
            <div className="flex-1">
              <div className="font-medium text-green-800">Transaction Confirmed!</div>
              <div className="text-sm text-green-700 font-mono mt-1">{transactionId}</div>
              <div className="text-xs text-green-600 mt-2">
                View on explorer: {getNetworkForPaymentMethod() === 'XRPL' ? 'xrpscan.com' : 'explorer.coreum.com'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button
          onClick={onBack}
          disabled={status !== 'idle'}
          className="px-6 py-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          ← Back to Confirmation
        </button>
        
        <button
          onClick={handlePayment}
          disabled={!wallet || wallet.balance < transaction.total || status !== 'idle'}
          className={`flex-1 py-4 px-6 rounded-lg font-bold text-lg ${
            wallet && wallet.balance >= transaction.total && status === 'idle'
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:opacity-90'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          {status === 'idle' ? (
            `Pay ${transaction.total} ${transaction.currency}`
          ) : (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              {status === 'connecting' && 'Connecting...'}
              {status === 'signing' && 'Signing...'}
              {status === 'broadcasting' && 'Broadcasting...'}
              {status === 'confirmed' && 'Confirmed!'}
              {status === 'failed' && 'Failed'}
            </div>
          )}
        </button>
      </div>

      {/* Security Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <span className="text-2xl">🔒</span>
          <div>
            <h4 className="font-medium text-yellow-800">Security Notice</h4>
            <ul className="text-sm text-yellow-700 space-y-1 mt-1">
              <li>• Only sign transactions from trusted applications</li>
              <li>• Verify the destination address matches PhoenixPME</li>
              <li>• Never share your private keys or recovery phrase</li>
              <li>• This transaction is irreversible once confirmed</li>
              <li>• Keep a record of your transaction ID for support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
