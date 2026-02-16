import { Wallet } from '../wallet-service';

declare global {
  interface Window {
    leap?: any;
  }
}

export const LeapWalletSimple: Wallet = {
  name: 'Leap',
  icon: '🦘',

  isInstalled: () => {
    return typeof window !== 'undefined' && !!window.leap;
  },

  connect: async (): Promise<string> => {
    console.log('=== LEAP WALLET CONNECTION ===');

    if (typeof window === 'undefined') {
      console.error('Cannot connect: Running on server side');
      throw new Error('Please open in a browser');
    }

    if (!window.leap) {
      console.error('Leap wallet not found in browser');
      throw new Error('Please install Leap Wallet from https://www.leapwallet.io/');
    }

    try {
      console.log('Requesting Leap connection...');
      await window.leap.enable('phoenix-pme');
      console.log('✅ Leap connection approved');
      
      const accounts = await window.leap.getAccounts();
      console.log('Leap accounts response:', accounts);
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found in Leap wallet');
      }
      
      const userAddress = accounts[0].address;
      console.log('✅ Connected with address:', userAddress);
      
      return userAddress;
      
    } catch (error: any) {
      console.error('Leap connection failed:', error);
      throw new Error(`Failed to connect Leap: ${error.message}`);
    }
  },

  disconnect: async () => {
    console.log('Leap disconnect requested');
  },

  getBalance: async () => {
    console.log('=== GETTING REAL BALANCE ===');
    
    if (typeof window === 'undefined') {
      return 'Open in browser';
    }
    
    if (!window.leap) {
      return 'Install Leap';
    }

    try {
      const accounts = await window.leap.getAccounts();
      
      if (!accounts || accounts.length === 0) {
        return 'Not connected';
      }
      
      const userAddress = accounts[0].address;
      console.log('Querying balance for:', userAddress);
      
      const apiUrl = `https://rest.testnet-1.coreum.dev:1317/cosmos/bank/v1beta1/balances/${userAddress}`;
      console.log('API URL:', apiUrl);
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        console.error('API Error:', response.status, response.statusText);
        return 'API Error';
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      
      const testToken = data.balances?.find((b: any) => 
        b.denom === 'utestcore' || (b.denom && b.denom.includes('test'))
      );
      
      if (testToken && testToken.amount) {
        const amount = parseInt(testToken.amount) / 1000000;
        console.log(`✅ Real balance found: ${amount} TEST`);
        return `${amount} TEST`;
      }
      
      console.log('No TEST tokens found');
      return '0 TEST';
      
    } catch (error) {
      console.error('Balance fetch error:', error);
      return 'Network Error';
    }
  },

  getNetwork: async () => {
    if (typeof window === 'undefined' || !window.leap) {
      return 'unknown';
    }
    
    try {
      const chainId = await window.leap.getChainId();
      return chainId || 'unknown';
    } catch (error) {
      console.error('Network error:', error);
      return 'error';
    }
  },
};
