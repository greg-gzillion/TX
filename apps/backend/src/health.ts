export function checkHealth() {
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'phoenixpme-backend',
    blockchain: 'ready',
    database: 'optional', // Change from 'required' to 'optional'
    features: [
      'auction-management',
      'wallet-integration', 
      'blockchain-settlement',
      'postgres-caching'
    ]
  };
}
