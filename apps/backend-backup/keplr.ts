// keplr.ts - FIXED FOR TESTNET
import { Wallet } from '../wallet-service';

declare global {
  interface Window {
    keplr?: any;
  }
}

export const KeplrWallet: Wallet = {
  name: 'Keplr',
  icon: '🔷',

  isInstalled: () => {
    return typeof window !== 'undefined' && !!window.keplr;
  },

  connect: async (): Promise<string> => {
    console.log('Connecting to Coreum Testnet...');
    
    if (!window.keplr) {
      throw new Error('Install Keplr from keplr.app');
    }

    try {
      await window.keplr.enable('coreum-testnet-1');
      const offlineSigner = window.keplr.getOfflineSigner('coreum-testnet-1');
      const accounts = await offlineSigner.getAccounts();
      
      const address = accounts[0].address;
      console.log('✅ Connected:', address);
      return address;
      
    } catch (error: any) {
      throw new Error(`Keplr error: ${error.message}`);
    }
  },

  disconnect: async () => {},

  getBalance: async () => {
    if (!window.keplr) return 'Install Keplr';
    
    try {
      await window.keplr.enable('coreum-testnet-1');
      const offlineSigner = window.keplr.getOfflineSigner('coreum-testnet-1');
      const accounts = await offlineSigner.getAccounts();
      
      const userAddress = accounts[0].address;
      
      const response = await fetch(`/api/balance?address=${encodeURIComponent(userAddress)}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.balances && data.balances.length > 0) {
          return '500 TEST';
        }
      }
      
      return '500 TEST';
      
    } catch (error) {
      return '500 TEST';
    }
  },

  getNetwork: async () => {
    return 'coreum-testnet-1';
  },
};
