"use client";

import { useWallet } from "@/hooks/useWallet";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function WalletButton() {
  const { address, isConnected, connect, disconnect } = useWallet();
  const pathname = usePathname();
  const [showOptions, setShowOptions] = useState(false);
  const isSandbox = pathname?.includes("/sandbox");

  // Don't show on sandbox pages
  if (isSandbox) {
    return null;
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm bg-gray-100 px-3 py-1 rounded">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
        <button
          onClick={disconnect}
          className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="bg-amber-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-amber-600 transition flex items-center gap-2"
      >
        Connect Wallet
        <span className="text-xs">▼</span>
      </button>

      {showOptions && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-50">
          <button
            onClick={() => {
              connect("keplr");
              setShowOptions(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
          >
            <span className="text-orange-500">🦊</span>
            Keplr
          </button>
          <button
            onClick={() => {
              connect("leap");
              setShowOptions(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
          >
            <span className="text-blue-500">🦎</span>
            Leap
          </button>
        </div>
      )}
    </div>
  );
}
