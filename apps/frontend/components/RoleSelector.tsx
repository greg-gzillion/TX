'use client';

interface Role {
  name: string;
  address: string;
  role: 'treasury' | 'deployer' | 'insurance' | 'user';
}

// These are the wallet addresses we want to add
const ROLES: Role[] = [
  {
    name: 'Treasury (Admin)',
    address: 'testcore1xa352f6gtgc4g7c9rrdgl4wn9vaw9r25v47jen',
    role: 'treasury'
  },
  {
    name: 'Deployer',
    address: 'testcore14qkw9fplr9xplfl5qwz8rr8f3uxhja8yuf0z6l',
    role: 'deployer'
  },
  {
    name: 'Insurance Pool',
    address: 'testcore1urvw6ta906qphvvrmcuwwxy3z2fqns56er2agu',
    role: 'insurance'
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
      <div className="space-y-3">
        {ROLES.map((role) => (
          <button
            key={role.role}
            onClick={() => onSelectRole(role)}
            disabled={disabled}
            className={`w-full p-4 text-left border rounded-lg transition ${
              selectedRole?.role === role.role
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="font-medium">{role.name}</div>
            <div className="text-sm text-gray-600 font-mono mt-1 break-all">
              {role.address}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}