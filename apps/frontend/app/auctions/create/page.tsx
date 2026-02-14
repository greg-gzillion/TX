'use client';

import { useState } from 'react';
import WalletSelector from '../../components/WalletSelector';
import RoleSelector from '../../components/RoleSelector';
import CreateAuctionForm from '../../CreateAuctionForm';

export default function CreateAuctionPage() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold mb-8">Create New Auction</h1>
      
      {/* Step 1: Connect Wallet */}
      <WalletSelector onConnect={setWalletAddress} />
      
      {/* Step 2: Select Role (only after wallet connected) */}
      {walletAddress && (
        <RoleSelector 
          selectedRole={selectedRole}
          onSelectRole={setSelectedRole}
        />
      )}
      
      {/* Step 3: Show Auction Form (only after role selected) */}
      {selectedRole && (
        <CreateAuctionForm selectedRole={selectedRole} />
      )}
    </div>
  );
}
