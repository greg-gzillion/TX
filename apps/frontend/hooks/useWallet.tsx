'use client';

import { useState, useEffect, createContext, useContext } from 'react';

declare global {
  interface Window {
    ethereum?: any;
    keplr?: any;
    leap?: any;
    phantom?: {
      connect: () => Promise<any>;
      isPhantom?: boolean;
    };
  }
}

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  walletType: string | null;
  connect: (walletType?: string) => Promise<void>;
  disconnect: () => void;
  client: any;
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  isConnected: false,
  walletType: null,
  connect: async () => {},
  disconnect: () => {},
  client: null,
});

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [client, setClient] = useState<any>(null);
  const [walletType, setWalletType] = useState<string | null>(null);

  // Log state changes
  useEffect(() => {
    console.log('🔵 WalletProvider state:', { address, walletType, isConnected: !!address });
  }, [address, walletType]);

  const connect = async (type: string = 'keplr') => {
    console.log(`🔵 Attempting to connect with ${type}...`);
    try {
      switch(type) {
        case 'keplr':
          if (!window.keplr) {
            console.log('🔴 Keplr not installed');
            window.open('https://www.keplr.app/download', '_blank');
            return;
          }
          console.log('✅ Keplr found, enabling...');
          await window.keplr.enable('coreum-testnet-1');
          const keplrSigner = window.keplr.getOfflineSigner('coreum-testnet-1');
          const keplrAccounts = await keplrSigner.getAccounts();
          console.log('✅ Keplr connected:', keplrAccounts[0].address);
          setAddress(keplrAccounts[0].address);
          setClient(window.keplr);
          setWalletType('keplr');
          break;

        case 'leap':
          if (!window.leap) {
            console.log('🔴 Leap not installed');
            window.open('https://www.leapwallet.io/download', '_blank');
            return;
          }
          console.log('✅ Leap found, enabling...');
          await window.leap.enable('coreum-testnet-1');
          const leapSigner = window.leap.getOfflineSigner('coreum-testnet-1');
          const leapAccounts = await leapSigner.getAccounts();
          console.log('✅ Leap connected:', leapAccounts[0].address);
          setAddress(leapAccounts[0].address);
          setClient(window.leap);
          setWalletType('leap');
          break;

        case 'metamask':
          if (!window.ethereum) {
            console.log('🔴 MetaMask not installed');
            window.open('https://metamask.io/download/', '_blank');
            return;
          }
          console.log('✅ MetaMask found, requesting accounts...');
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          console.log('✅ MetaMask connected:', accounts[0]);
          setAddress(accounts[0]);
          setClient(window.ethereum);
          setWalletType('metamask');
          break;

        case 'phantom':
          if (!window.phantom?.isPhantom) {
            console.log('🔴 Phantom not installed');
            window.open('https://phantom.app/download', '_blank');
            return;
          }
          console.log('✅ Phantom found, connecting...');
          const response = await window.phantom.connect();
          console.log('✅ Phantom connected:', response.publicKey.toString());
          setAddress(response.publicKey.toString());
          setClient(window.phantom);
          setWalletType('phantom');
          break;
      }
    } catch (error) {
      console.error('🔴 Error connecting wallet:', error);
      throw error;
    }
  };

  const disconnect = () => {
    console.log('🔵 Disconnecting wallet...');
    setAddress(null);
    setClient(null);
    setWalletType(null);
  };

  const value = {
    address,
    isConnected: !!address,
    walletType,
    connect,
    disconnect,
    client,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
}
