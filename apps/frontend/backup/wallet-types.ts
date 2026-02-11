export interface Wallet {
  name: string;
  icon: string;
  isInstalled: () => boolean;
  connect: () => Promise<string>;
  disconnect: () => Promise<void>;
  getBalance: () => Promise<string>;
  getNetwork: () => Promise<string>;
}

export interface WalletState {
  address: string | null;
  walletType: string | null;
  network: string | null;
  balance: string;
  isConnected: boolean;
}
