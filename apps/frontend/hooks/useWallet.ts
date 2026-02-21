// hooks/useWallet.ts
import { useState } from 'react';

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [client, setClient] = useState<any>(null);

  const connect = async () => {
    // Mock for now - real Keplr integration coming next
    setAddress("core1mockaddress123456789");
    setIsConnected(true);
    setClient({});
    console.log("Mock wallet connected");
  };

  const disconnect = () => {
    setAddress(null);
    setIsConnected(false);
    setClient(null);
  };

  return {
    address,
    isConnected,
    client,
    connect,
    disconnect
  };
}
