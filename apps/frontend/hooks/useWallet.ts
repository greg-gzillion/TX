// hooks/useWallet.ts
import { useState } from 'react';

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(false);  // Add this

  const connect = async () => {
    setLoading(true);  // Add this
    // Mock for now - real Keplr integration coming next
    setTimeout(() => {  // Simulate async
      setAddress("core1mockaddress123456789");
      setIsConnected(true);
      setClient({});
      setLoading(false);  // Add this
      console.log("Mock wallet connected");
    }, 500);
  };

  const disconnect = () => {
    setAddress(null);
    setIsConnected(false);
    setClient(null);
    setLoading(false);
  };

  return {
    address,
    isConnected,
    client,
    loading,  // Add this
    connect,
    disconnect
  };
}
