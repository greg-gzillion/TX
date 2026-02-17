'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WalletContextType {
  walletAddress: string | null;
  walletType: 'keplr' | 'leap' | null;
  chainId: string | null;
  connectWallet: (type: 'keplr' | 'leap') => Promise<void>;
  disconnectWallet: () => void;
  isConnected: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<'keplr' | 'leap' | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);

  const CHAIN_ID = 'coreum-testnet-1';
  const CHAIN_NAME = 'Coreum Testnet';
  const RPC_ENDPOINT = 'https://full-node.testnet-1.coreum.dev:26657';
  const REST_ENDPOINT = 'https://rest-full-node.testnet-1.coreum.dev';
  const BECH32_PREFIX = 'testcore';
  const COIN_TYPE = 990;

  // Load saved wallet on mount
  useEffect(() => {
    const saved = localStorage.getItem('wallet-connected');
    if (saved) {
      const { address, type, chain } = JSON.parse(saved);
      setWalletAddress(address);
      setWalletType(type);
      setChainId(chain);
    }
  }, []);

  const connectKeplr = async () => {
    if (!window.keplr) {
      throw new Error('Keplr not installed');
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
        bech32PrefixConsPub: `${BECH32_PREFIX}valconspub`
      },
      currencies: [{ coinDenom: 'TESTCORE', coinMinimalDenom: 'utestcore', coinDecimals: 6 }],
      feeCurrencies: [{ coinDenom: 'TESTCORE', coinMinimalDenom: 'utestcore', coinDecimals: 6 }],
      stakeCurrency: { coinDenom: 'TESTCORE', coinMinimalDenom: 'utestcore', coinDecimals: 6 },
      coinType: COIN_TYPE,
      features: ['ibc-transfer', 'ibc-go']
    });

    await window.keplr.enable(CHAIN_ID);
    const key = await window.keplr.getKey(CHAIN_ID);
    return key.bech32Address;
  };

  const connectLeap = async () => {
    if (!window.leap) {
      throw new Error('Leap not installed');
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
        bech32PrefixConsPub: `${BECH32_PREFIX}valconspub`
      },
      currencies: [{ coinDenom: 'TESTCORE', coinMinimalDenom: 'utestcore', coinDecimals: 6 }],
      feeCurrencies: [{ coinDenom: 'TESTCORE', coinMinimalDenom: 'utestcore', coinDecimals: 6 }],
      stakeCurrency: { coinDenom: 'TESTCORE', coinMinimalDenom: 'utestcore', coinDecimals: 6 },
      coinType: COIN_TYPE,
      features: ['ibc-transfer', 'ibc-go']
    });

    await window.leap.enable(CHAIN_ID);
    const key = await window.leap.getKey(CHAIN_ID);
    return key.bech32Address;
  };

  const connectWallet = async (type: 'keplr' | 'leap') => {
    try {
      let address;
      if (type === 'keplr') {
        address = await connectKeplr();
      } else {
        address = await connectLeap();
      }

      setWalletAddress(address);
      setWalletType(type);
      setChainId(CHAIN_ID);
      
      localStorage.setItem('wallet-connected', JSON.stringify({
        address,
        type,
        chain: CHAIN_ID
      }));

      console.log(`✅ Connected to ${type}: ${address}`);
    } catch (error) {
      console.error('Connection failed:', error);
      throw error;
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setWalletType(null);
    setChainId(null);
    localStorage.removeItem('wallet-connected');
  };

  return (
    <WalletContext.Provider value={{
      walletAddress,
      walletType,
      chainId,
      connectWallet,
      disconnectWallet,
      isConnected: !!walletAddress
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
