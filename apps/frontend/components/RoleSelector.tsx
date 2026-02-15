'use client';

export interface Role {
  name: string;
  address: string;
  role: 'treasury' | 'deployer' | 'insurance' | 'seller' | 'alice' | 'bob' | 'charlie';
  balance?: string;
}
const ROLES: Role[] = [
  // MOCK institutional wallets
  {
    name: 'Treasury (Admin)',
    address: 'testcore1mocktreasuryaddress12345',
    role: 'treasury',
    balance: '13,000,000'
  },
  {
    name: 'Deployer',
    address: 'testcore1mockdeployeraddress67890',
    role: 'deployer',
    balance: '5,000,000'
  },
    {
    name: 'Insurance Pool',
    address: 'testcore1mockinsurancepool66666',
    role: 'insurance',
    balance: '0'  // ← Changed from 3,000,000 to 0
  },
  // REAL user wallets
  {
    name: 'Seller',
    address: 'testcore1xa352f6gtgc4g7c9rrdgl4wn9vaw9r25v47jen',
    role: 'seller',
    balance: '5,000,000'
  },
  {
    name: 'Alice',
    address: 'testcore14qkw9fplr9xplfl5qwz8rr8f3uxhja8yuf0z6l',
    role: 'alice',
    balance: '1,000,000'
  },
  {
    name: 'Bob',
    address: 'testcore1afmlm9ra7m555vurve6ek4754rnv7max2hl6en',
    role: 'bob',
    balance: '2,000,000'
  },
  {
    name: 'Charlie',
    address: 'testcore1urvw6ta906qphvvrmcuwwxy3z2fqns56er2agu',
    role: 'charlie',
    balance: '3,000,000'
  }
];

interface RoleSelectorProps {
  selectedRole: Role | null;
  onSelectRole: (role: Role) => void;
  disabled?: boolean;
}

export default function RoleSelector({ selectedRole, onSelectRole, disabled }: RoleSelectorProps) {
  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Wallet Role</h3>
      <p className="text-sm text-gray-600 mb-4">
        Choose which wallet address to use for this action
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {ROLES.map((role) => (
          <button
            key={role.role}
            onClick={() => onSelectRole(role)}
            disabled={disabled}
            className={`w-full p-4 text-left border rounded-lg transition ${
              selectedRole?.role === role.role
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="font-medium flex items-center justify-between">
              <span>{role.name}</span>
              {role.balance && (
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {role.balance}
                </span>
              )}
            </div>
            <div className="text-sm text-gray-600 font-mono mt-1 break-all">
              {role.address}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {role.role === 'seller' && '📦 Can list items'}
              {role.role === 'alice' && '💰 Can bid'}
              {role.role === 'bob' && '💰 Can bid'}
              {role.role === 'charlie' && '💰 Can bid'}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}