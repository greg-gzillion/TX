'use client';

import { useState, useEffect } from 'react';

declare global {
  interface Window {
    keplr?: any;
    leap?: any;
  }
}

interface WalletSelectorProps {
  onConnect?: (address: string) => void;
}

interface WalletInfo {
  address: string;
  chainId: string;
  walletType: 'keplr' | 'leap' | null;
}

export default function WalletSelector({ onConnect }: WalletSelectorProps) {
  const [wallet, setWallet] = useState<WalletInfo>({
    address: '',
    chainId: '',
    walletType: null
  });
  const [loading, setLoading] = useState(false);

  const CHAIN_ID = 'coreum-testnet-1';
  const CHAIN_NAME = 'Coreum Testnet';
  const RPC_ENDPOINT = 'https://full-node.testnet-1.coreum.dev:26657';
  const REST_ENDPOINT = 'https://rest-full-node.testnet-1.coreum.dev';
  const BECH32_PREFIX = 'testcore';
  const COIN_TYPE = 990;

  // ==================== KEPLR CONNECTION ====================
  const connectKeplr = async () => {
    if (!window.keplr) {
      alert('Please install Keplr extension');
      return;
    }

    setLoading(true);
    try {
      // Suggest the chain if not already added
      await window.keplr.experimentalSuggestChain({
        chainId: CHAIN_ID,
        chainName: CHAIN_NAME,
        rpc: RPC_ENDPOINT,
        rest: REST_ENDPOINT,
        bip44: { coinType: COIN_TYPE },
        bech32Config: {
          bech32PrefixAccAddr: BECH32_PREFIX,
          bech32PrefixAccPub: `${BECH32_PREFIX}pub`,
          bech32PrefixValAddr: `${BECH32_PREFIX}valoper`,
          bech32PrefixValPub: `${BECH32_PREFIX}valoperpub`,
          bech32PrefixConsAddr: `${BECH32_PREFIX}valcons`,
          bech32PrefixConsPub: `${BECH32_PREFIX}valconspub`,
        },
        currencies: [{
          coinDenom: 'TESTCORE',
          coinMinimalDenom: 'utestcore',
          coinDecimals: 6,
        }],
        feeCurrencies: [{
          coinDenom: 'TESTCORE',
          coinMinimalDenom: 'utestcore',
          coinDecimals: 6,
          gasPriceStep: { low: 0.0625, average: 0.25, high: 0.5 },
        }],
        stakeCurrency: {
          coinDenom: 'TESTCORE',
          coinMinimalDenom: 'utestcore',
          coinDecimals: 6,
        },
      });

      // Enable the chain
      await window.keplr.enable(CHAIN_ID);
      
      // Get the signer and accounts
      const offlineSigner = window.keplr.getOfflineSigner(CHAIN_ID);
      const accounts = await offlineSigner.getAccounts();

      setWallet({
        address: accounts[0].address,
        chainId: CHAIN_ID,
        walletType: 'keplr'
      });

      // Store in localStorage
      localStorage.setItem('wallet_address', accounts[0].address);
      localStorage.setItem('wallet_type', 'keplr');
      
      // Call onConnect callback if provided - FIXED: moved to correct location
      if (onConnect) {
        onConnect(accounts[0].address);
      }
      
    } catch (error) {
      console.error('Failed to connect Keplr:', error);
      alert('Failed to connect wallet. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  // ==================== LEAP CONNECTION ====================
  const connectLeap = async () => {
    if (!window.leap) {
      alert('Please install Leap wallet extension');
      return;
    }

    setLoading(true);
    try {
      await window.leap.experimentalSuggestChain({
        chainId: CHAIN_ID,
        chainName: CHAIN_NAME,
        rpc: RPC_ENDPOINT,
        rest: REST_ENDPOINT,
        bip44: { coinType: COIN_TYPE },
        bech32Config: {
          bech32PrefixAccAddr: BECH32_PREFIX,
          bech32PrefixAccPub: `${BECH32_PREFIX}pub`,
          bech32PrefixValAddr: `${BECH32_PREFIX}valoper`,
          bech32PrefixValPub: `${BECH32_PREFIX}valoperpub`,
          bech32PrefixConsAddr: `${BECH32_PREFIX}valcons`,
          bech32PrefixConsPub: `${BECH32_PREFIX}valconspub`,
        },
        currencies: [{
          coinDenom: 'TESTCORE',
          coinMinimalDenom: 'utestcore',
          coinDecimals: 6,
        }],
        feeCurrencies: [{
          coinDenom: 'TESTCORE',
          coinMinimalDenom: 'utestcore',
          coinDecimals: 6,
          gasPriceStep: { low: 0.0625, average: 0.25, high: 0.5 },
        }],
        stakeCurrency: {
          coinDenom: 'TESTCORE',
          coinMinimalDenom: 'utestcore',
          coinDecimals: 6,
        },
      });

      await window.leap.enable(CHAIN_ID);
      const offlineSigner = window.leap.getOfflineSigner(CHAIN_ID);
      const accounts = await offlineSigner.getAccounts();

      setWallet({
        address: accounts[0].address,
        chainId: CHAIN_ID,
        walletType: 'leap'
      });

      localStorage.setItem('wallet_address', accounts[0].address);
      localStorage.setItem('wallet_type', 'leap');

      // Call onConnect callback if provided
      if (onConnect) {
        onConnect(accounts[0].address);
      }

    } catch (error) {
      console.error('Failed to connect Leap:', error);
      alert('Failed to connect wallet. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  // ==================== DISCONNECT ====================
  const disconnect = () => {
    setWallet({ address: '', chainId: '', walletType: null });
    localStorage.removeItem('wallet_address');
    localStorage.removeItem('wallet_type');
  };

  // ==================== RESTORE SESSION ====================
  useEffect(() => {
    const savedAddress = localStorage.getItem('wallet_address');
    const savedType = localStorage.getItem('wallet_type');
    if (savedAddress && savedType) {
      setWallet({
        address: savedAddress,
        chainId: CHAIN_ID,
        walletType: savedType as 'keplr' | 'leap'
      });
    }
  }, []);

  // ==================== RENDER ====================
  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Wallet Connection</h3>
      
      {wallet.address ? (
        <div>
          <div className="bg-green-50 p-3 rounded">
            <p className="text-sm text-green-700 mb-1">
              ✅ Connected with {wallet.walletType}
            </p>
            <p className="font-mono text-xs break-all">{wallet.address}</p>
            <p className="text-xs text-gray-500 mt-2">{wallet.chainId}</p>
          </div>
          <button
            onClick={disconnect}
            className="mt-4 w-full px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <button
            onClick={connectKeplr}
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300 transition"
          >
            {loading ? 'Connecting...' : 'Connect Keplr'}
          </button>
          
          <button
            onClick={connectLeap}
            disabled={loading}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-purple-300 transition"
          >
            {loading ? 'Connecting...' : 'Connect Leap'}
          </button>
        </div>
      )}
    </div>
  );
}