'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';

declare global {
  interface Window {
    keplr?: any;
    leap?: any;
  }
}

interface Wallet {
  name: string;
  address: string;
  balance: string;
}

interface WalletSelectorProps {
  onSelect: (wallet: Wallet | null) => void;
}

export function WalletSelector({ onSelect }: WalletSelectorProps) {
  const [address, setAddress] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<string>('');

  const CHAIN_ID = 'coreum-testnet-1';

  // Check if already connected
  useEffect(() => {
    const savedAddress = localStorage.getItem('walletAddress');
    if (savedAddress) {
      setAddress(savedAddress);
      fetchBalance(savedAddress);
      onSelect({
        name: 'Connected Wallet',
        address: savedAddress,
        balance: balance || '5,000,000'
      });
    }
  }, []);

  const fetchBalance = async (addr: string) => {
    try {
      // Mock balance for now
      setBalance('5,000,000');
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const connectKeplr = async () => {
    setLoading(true);
    try {
      if (!window.keplr) {
        window.open('https://www.keplr.app', '_blank');
        return;
      }

      await window.keplr.enable(CHAIN_ID);
      const offlineSigner = window.keplr.getOfflineSigner(CHAIN_ID);
      const accounts = await offlineSigner.getAccounts();
      
      setAddress(accounts[0].address);
      localStorage.setItem('walletAddress', accounts[0].address);
      await fetchBalance(accounts[0].address);
      
      onSelect({
        name: 'Connected Wallet',
        address: accounts[0].address,
        balance: '5,000,000'
      });
      
    } catch (error) {
      console.error('Error connecting:', error);
    } finally {
      setLoading(false);
    }
  };

  const connectLeap = async () => {
    setLoading(true);
    try {
      if (!window.leap) {
        window.open('https://www.leapwallet.io', '_blank');
        return;
      }

      await window.leap.enable(CHAIN_ID);
      const offlineSigner = window.leap.getOfflineSigner(CHAIN_ID);
      const accounts = await offlineSigner.getAccounts();
      
      setAddress(accounts[0].address);
      localStorage.setItem('walletAddress', accounts[0].address);
      await fetchBalance(accounts[0].address);
      
      onSelect({
        name: 'Connected Wallet',
        address: accounts[0].address,
        balance: '5,000,000'
      });
      
    } catch (error) {
      console.error('Error connecting:', error);
    } finally {
      setLoading(false);
    }
  };

  const disconnect = () => {
    setAddress('');
    setBalance('');
    localStorage.removeItem('walletAddress');
    onSelect(null);
  };

  if (!address) {
    return (
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Connect Wallet</h3>
        <p className="text-sm text-gray-600 mb-4">
          Connect your wallet to start testing
        </p>
        <div className="flex gap-3">
          <Button
            onClick={connectKeplr}
            variant="gold"
            size="md"
            isLoading={loading}
          >
            Connect Keplr
          </Button>
          <Button
            onClick={connectLeap}
            variant="outline"
            size="md"
            isLoading={loading}
          >
            Connect Leap
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Connected Wallet</h3>
        <Button onClick={disconnect} variant="outline" size="sm">
          Disconnect
        </Button>
      </div>
      <div className="space-y-2">
        <div className="text-sm font-mono bg-gray-50 p-2 rounded">
          {address.slice(0, 8)}...{address.slice(-6)}
        </div>
        {balance && (
          <div className="text-sm text-gray-600">
            Balance: {balance} TESTUSD
          </div>
        )}
      </div>
    </div>
  );
}
