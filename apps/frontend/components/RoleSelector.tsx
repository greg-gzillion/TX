'use client';

export interface Role {
  name: string;
  address: string;
  role: 'user' | 'system';
  balance: string;
  description?: string;
}

const ROLES: Role[] = [
  // User wallets (everyone can buy/sell)
  {
    name: 'Robert',
    address: 'testcore1xa352f6gtgc4g7c9rrdgl4wn9vaw9r25v47jen',
    role: 'user',
    balance: '5,000,000',
    description: '📦 Can list items • 💰 Can bid'
  },
  {
    name: 'Alice',
    address: 'testcore14qkw9fplr9xplfl5qwz8rr8f3uxhja8yuf0z6l',
    role: 'user',
    balance: '5,000,000',
    description: '📦 Can list items • 💰 Can bid'
  },
  {
    name: 'Charlie',
    address: 'testcore1urvw6ta906qphvvrmcuwwxy3z2fqns56er2agu',
    role: 'user',
    balance: '5,000,000',
    description: '📦 Can list items • 💰 Can bid'
  },
  {
    name: 'Mike',
    address: 'testcore1rr8knhdwc9uthxh3fazt3k4keuqtycctzcvd3c',
    role: 'user',
    balance: '5,000,000',
    description: '📦 Can list items • 💰 Can bid'
  },
  
  // System wallets
  {
    name: 'Treasury',
    address: 'testcore19krrq7dtfck53dla2us9lxlmmzxg7d9wa6qkdm',
    role: 'system',
    balance: '0',
    description: 'Multi-sig, DAO treasury'
  },
  {
    name: 'Deployer',
    address: 'testcore1wvrwgqjqfu7t9qzz3h05384ltjtnzfqlrytkmj',
    role: 'system',
    balance: '0',
    description: 'Contract deployment'
  },
  {
    name: 'CRF',
    address: 'testcore1m5adn3k68tk4zqmujpnstmp9r933jafzu44tnv',
    role: 'system',
    balance: '0',
    description: 'Community Reserve Fund'
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
        {ROLES.map((role, index) => (
          <button
            key={index}
            onClick={() => onSelectRole(role)}
            disabled={disabled}
            className={`w-full p-4 text-left border rounded-lg transition ${
              selectedRole?.address === role.address
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
            {role.description && (
              <div className="text-xs text-gray-500 mt-2">
                {role.description}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}