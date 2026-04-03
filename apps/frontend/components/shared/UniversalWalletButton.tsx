"use client";

import { useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { usePathname } from "next/navigation";

export default function UniversalWalletButton() {
  const { address, isConnected, walletType, connect, disconnect } = useWallet();
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = useState(false);
  const isSandbox = pathname?.includes("/sandbox");

  // Don't show on sandbox pages
  if (isSandbox) {
    return null;
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-lg">
          <span className="text-sm">
            {walletType === "keplr" && "🪐"}
            {walletType === "leap" && "🐆"}
            {walletType === "metamask" && "🦊"}
            {walletType === "phantom" && "👻"}
          </span>
          <span className="text-sm font-mono">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
        <button
          onClick={disconnect}
          className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
          title="Disconnect"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="bg-amber-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-amber-600 transition flex items-center gap-2"
      >
        Connect Wallet
        <span className="text-xs">▼</span>
      </button>

      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
          />

          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border z-50 overflow-hidden">
            <WalletOptions onClose={() => setShowDropdown(false)} />
          </div>
        </>
      )}
    </div>
  );
}

function WalletOptions({ onClose }: { onClose: () => void }) {
  const { connect } = useWallet();
  const [connecting, setConnecting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const wallets = [
    { id: "keplr", name: "Keplr", icon: "🪐" },
    { id: "leap", name: "Leap", icon: "🐆" },
    { id: "metamask", name: "MetaMask", icon: "🦊" },
    { id: "phantom", name: "Phantom", icon: "👻" },
  ];

  const handleConnect = async (walletId: string) => {
    setConnecting(walletId);
    setError(null);
    try {
      console.log(`Attempting to connect to ${walletId}...`);
      await connect(walletId);
      console.log(`Connected to ${walletId} successfully`);
      onClose();
    } catch (error: any) {
      console.error(`Connection failed for ${walletId}:`, error);
      setError(
        error?.message || "Connection failed. Check console for details.",
      );
    } finally {
      setConnecting(null);
    }
  };

  return (
    <div className="p-2">
      {error && (
        <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
          {error}
        </div>
      )}

      {wallets.map((wallet) => (
        <button
          key={wallet.id}
          onClick={() => handleConnect(wallet.id)}
          disabled={connecting === wallet.id}
          className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition disabled:opacity-50"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{wallet.icon}</span>
            <span className="font-medium">{wallet.name}</span>
          </div>
          {connecting === wallet.id ? (
            <span className="text-sm text-gray-400">Connecting...</span>
          ) : (
            <span className="text-sm text-amber-600">Connect →</span>
          )}
        </button>
      ))}

      <div className="border-t mt-2 pt-2 px-3 pb-1">
        <p className="text-xs text-gray-500">
          Don't have a wallet?
          <a
            href="https://www.keplr.app/download"
            target="_blank"
            className="text-amber-600 ml-1"
          >
            Install
          </a>
        </p>
      </div>
    </div>
  );
}
