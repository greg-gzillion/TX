import { KeplrWallet } from './wallets/keplr';
import { Wallet, WalletState } from './wallet-types';

export class WalletService {
  private wallets: Record<string, Wallet> = {
    keplr: KeplrWallet,
    // Add XUMM, Ledger, etc. when ready
  };

  private state: WalletState = {
    address: null,
    walletType: null,
    network: null,
    balance: '0',
    isConnected: false,
  };

  getWallet(walletType: string): Wallet | null {
    return this.wallets[walletType] || null;
  }

  async connect(walletType: string): Promise<WalletState> {
    console.log(`Connecting to ${walletType}...`);
    
    const wallet = this.getWallet(walletType);
    if (!wallet) {
      throw new Error(`Wallet ${walletType} not supported. Use Keplr.`);
    }

    if (!wallet.isInstalled()) {
      throw new Error(`${wallet.name} wallet not installed. Get it at https://www.keplr.app/`);
    }

    try {
      const address = await wallet.connect();
      const balance = await wallet.getBalance();
      const network = await wallet.getNetwork();

      this.state = {
        address,
        walletType,
        network,
        balance,
        isConnected: true,
      };

      console.log('Connected:', this.state);
      return this.state;
    } catch (error: any) {
      console.error('Connection failed:', error);
      throw new Error(`Failed to connect: ${error.message}`);
    }
  }

  getState(): WalletState {
    return this.state;
  }

  async disconnect(): Promise<void> {
    const wallet = this.state.walletType 
      ? this.getWallet(this.state.walletType) 
      : null;
    
    if (wallet) {
      await wallet.disconnect();
    }

    this.state = {
      address: null,
      walletType: null,
      network: null,
      balance: '0',
      isConnected: false,
    };
  }

  async refreshBalance(): Promise<string> {
    if (!this.state.isConnected || !this.state.walletType) {
      return 'Not connected';
    }

    const wallet = this.getWallet(this.state.walletType);
    if (!wallet) {
      return 'Wallet not found';
    }

    try {
      const balance = await wallet.getBalance();
      this.state.balance = balance;
      return balance;
    } catch (error) {
      console.error('Failed to refresh balance:', error);
      return 'Error';
    }
  }
}

export const walletService = new WalletService();
