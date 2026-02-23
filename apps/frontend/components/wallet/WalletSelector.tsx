"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/shared/ui/Button';

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
  const [mounted, setMounted] = useState(false);
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

  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if Keplr is installed
  const isKeplrInstalled = () => {
    return typeof window !== 'undefined' && !!window.keplr;
  };

  // Check if Leap is installed
  const isLeapInstalled = () => {
    return typeof window !== 'undefined' && !!window.leap;
  };

  // Connect to Keplr
  const connectKeplr = async () => {
    setLoading(true);
    try {
      if (!window.keplr) {
        alert('Please install Keplr extension');
        window.open('https://www.keplr.app', '_blank');
        return;
      }

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
        }],
        stakeCurrency: {
          coinDenom: 'TESTCORE',
          coinMinimalDenom: 'utestcore',
          coinDecimals: 6,
        },
        gasPriceStep: { low: 0.01, average: 0.025, high: 0.03 },
      });

      await window.keplr.enable(CHAIN_ID);
      const offlineSigner = window.keplr.getOfflineSigner(CHAIN_ID);
      const accounts = await offlineSigner.getAccounts();

      setWallet({
        address: accounts[0].address,
        chainId: CHAIN_ID,
        walletType: 'keplr'
      });

      if (onConnect) {
        onConnect(accounts[0].address);
      }
    } catch (error) {
      console.error('Error connecting to Keplr:', error);
      alert('Failed to connect to Keplr');
    } finally {
      setLoading(false);
    }
  };

  // Connect to Leap
  const connectLeap = async () => {
    setLoading(true);
    try {
      if (!window.leap) {
        alert('Please install Leap wallet');
        window.open('https://www.leapwallet.io', '_blank');
        return;
      }

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
        }],
        stakeCurrency: {
          coinDenom: 'TESTCORE',
          coinMinimalDenom: 'utestcore',
          coinDecimals: 6,
        },
        gasPriceStep: { low: 0.01, average: 0.025, high: 0.03 },
      });

      await window.leap.enable(CHAIN_ID);
      const offlineSigner = window.leap.getOfflineSigner(CHAIN_ID);
      const accounts = await offlineSigner.getAccounts();

      setWallet({
        address: accounts[0].address,
        chainId: CHAIN_ID,
        walletType: 'leap'
      });

      if (onConnect) {
        onConnect(accounts[0].address);
      }
    } catch (error) {
      console.error('Error connecting to Leap:', error);
      alert('Failed to connect to Leap');
    } finally {
      setLoading(false);
    }
  };

  // Disconnect wallet
  const disconnect = () => {
    setWallet({
      address: '',
      chainId: '',
      walletType: null
    });
    if (onConnect) {
      onConnect('');
    }
  };

  // Don't render anything on server to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="flex items-center space-x-4">
        <div className="w-32 h-10 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      {!wallet.address ? (
        <div className="flex space-x-2">
          {isKeplrInstalled() && (
            <Button
              onClick={connectKeplr}
              variant="gold"
              size="md"
              isLoading={loading}
            >
              Connect Keplr
            </Button>
          )}
          {isLeapInstalled() && (
            <Button
              onClick={connectLeap}
              variant="primary"
              size="md"
              isLoading={loading}
            >
              Connect Leap
            </Button>
          )}
          {!isKeplrInstalled() && !isLeapInstalled() && (
            <div className="flex space-x-2">
              <Button
                onClick={() => window.open('https://www.keplr.app', '_blank')}
                variant="outline"
                size="sm"
              >
                Install Keplr
              </Button>
              <Button
                onClick={() => window.open('https://www.leapwallet.io', '_blank')}
                variant="outline"
                size="sm"
              >
                Install Leap
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center space-x-3">
          <div className="text-sm">
            <span className="text-gray-500">Connected: </span>
            <span className="font-mono text-gray-900">
              {wallet.address.slice(0, 8)}...{wallet.address.slice(-6)}
            </span>
          </div>
          <Button
            onClick={disconnect}
            variant="outline"
            size="sm"
          >
            Disconnect
          </Button>
        </div>
      )}
    </div>
  );
}