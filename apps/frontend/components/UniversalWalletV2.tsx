'use client';

import { useState, useEffect } from 'react';

// Add type declarations for all wallets
declare global {
  interface Window {
    ethereum?: any;
    keplr?: any;
    leap?: any;
    phantom?: {
      connect: () => Promise<any>;
      isPhantom?: boolean;
    };
    solana?: any;
  }
}

interface WalletOption {
  name: string;
  icon: string;
  connect: () => Promise<any>;
  installed: boolean;
}

interface UniversalWalletV2Props {
  onConnect: (wallet: any) => void;
  className?: string;
}

export default function UniversalWalletV2({ onConnect, className = '' }: UniversalWalletV2Props) {
  const [wallets, setWallets] = useState<WalletOption[]>([]);
  const [connecting, setConnecting] = useState<string | null>(null);

  useEffect(() => {
    detectWallets();
  }, []);

  const detectWallets = () => {
    const detected: WalletOption[] = [];

    // Keplr (Cosmos)
    if (window.keplr) {
      detected.push({
        name: 'Keplr',
        icon: '🪐',
        installed: true,
        connect: async () => {
          try {
            await window.keplr.enable('coreum-testnet-1');
            const offlineSigner = window.keplr.getOfflineSigner('coreum-testnet-1');
            const accounts = await offlineSigner.getAccounts();
            return {
              name: 'Keplr',
              address: accounts[0].address,
              signer: offlineSigner
            };
          } catch (error) {
            console.error('Keplr connection error:', error);
            throw error;
          }
        }
      });
    }

    // Leap (Cosmos)
    if (window.leap) {
      detected.push({
        name: 'Leap',
        icon: '🐆',
        installed: true,
        connect: async () => {
          try {
            await window.leap.enable('coreum-testnet-1');
            const offlineSigner = window.leap.getOfflineSigner('coreum-testnet-1');
            const accounts = await offlineSigner.getAccounts();
            return {
              name: 'Leap',
              address: accounts[0].address,
              signer: offlineSigner
            };
          } catch (error) {
            console.error('Leap connection error:', error);
            throw error;
          }
        }
      });
    }

    // MetaMask (EVM)
    if (window.ethereum) {
      detected.push({
        name: 'MetaMask',
        icon: '🦊',
        installed: true,
        connect: async () => {
          try {
            const accounts = await window.ethereum.request({ 
              method: 'eth_requestAccounts' 
            });
            return {
              name: 'MetaMask',
              address: accounts[0],
              provider: window.ethereum
            };
          } catch (error) {
            console.error('MetaMask connection error:', error);
            throw error;
          }
        }
      });
    }

    // Phantom (Solana)
    if (window.phantom?.isPhantom) {
      detected.push({
        name: 'Phantom',
        icon: '👻',
        installed: true,
        connect: async () => {
          try {
            // Safe check for phantom
            if (!window.phantom) {
              throw new Error('Phantom wallet not detected');
            }
            
            const response = await window.phantom.connect();
            return {
              name: 'Phantom',
              address: response.publicKey.toString(),
              provider: window.phantom
            };
          } catch (error) {
            console.error('Phantom connection error:', error);
            throw error;
          }
        }
      });
    }

    setWallets(detected);
  };

  const handleConnect = async (wallet: WalletOption) => {
    setConnecting(wallet.name);
    try {
      const account = await wallet.connect();
      onConnect({
        ...account,
        walletName: wallet.name,
        walletIcon: wallet.icon
      });
    } catch (error) {
      console.error('Connection failed:', error);
      alert(`Failed to connect to ${wallet.name}`);
    } finally {
      setConnecting(null);
    }
  };

  const installWallet = (name: string) => {
    const urls: Record<string, string> = {
      Keplr: 'https://www.keplr.app/download',
      Leap: 'https://www.leapwallet.io/download',
      MetaMask: 'https://metamask.io/download/',
      Phantom: 'https://phantom.app/download'
    };
    window.open(urls[name], '_blank');
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {wallets.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-gray-500 mb-3">No wallet extensions detected</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {['Keplr', 'Leap', 'MetaMask', 'Phantom'].map(name => (
              <button
                key={name}
                onClick={() => installWallet(name)}
                className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm hover:bg-amber-200 transition"
              >
                Install {name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        wallets.map((wallet) => (
          <button
            key={wallet.name}
            onClick={() => handleConnect(wallet)}
            disabled={connecting === wallet.name}
            className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-amber-500 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{wallet.icon}</span>
              <span className="font-medium">{wallet.name}</span>
            </div>
            {connecting === wallet.name ? (
              <span className="text-sm text-gray-500">Connecting...</span>
            ) : (
              <span className="text-amber-600 text-sm font-medium">Connect →</span>
            )}
          </button>
        ))
      )}
    </div>
  );
}
