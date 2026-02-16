getBalance: async () => {
  // Important: This only runs in browser, not in bash!
  if (typeof window === 'undefined' || !window.leap) {
    return 'Install Leap Wallet';
  }

  try {
    // Get current account from Leap
    const accounts = await window.leap.getAccounts();
    const userAddress = accounts[0]?.address;
    
    if (!userAddress) return 'Not connected';

    // Query Coreum testnet - FIXED URL (no https:// in nano)
    const response = await fetch(
      `https://rest.testnet-1.coreum.dev:1317/cosmos/bank/v1beta1/balances/${userAddress}`
    );

    if (!response.ok) {
      console.error('API error:', response.status);
      return 'API Error';
    }

    const data = await response.json();
    
    // Coreum testnet token is usually 'utestcore' (micro-testcore)
    const testToken = data.balances?.find((b: any) => 
      b.denom === 'utestcore' || b.denom.includes('test')
    );

    // Convert from micro (utestcore) to TEST (divide by 1,000,000)
    if (testToken && testToken.amount) {
      const amountInTest = parseInt(testToken.amount) / 1000000;
      return `${amountInTest.toString()} TEST`;
    }
    
    return '0 TEST';
  } catch (error) {
    console.error('Balance fetch error:', error);
    return 'Network Error';
  }
},
