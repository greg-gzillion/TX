export const coreumTestnet = {
  chainId: 'coreum-testnet-1',
  chainName: 'Coreum Testnet',
  rpc: 'https://full-node.testnet-1.coreum.dev:26657',
  rest: 'https://full-node.testnet-1.coreum.dev:1317',
  stakeCurrency: {
    coinDenom: 'TESTCORE',
    coinMinimalDenom: 'utestcore',
    coinDecimals: 6,
  },
  bip44: {
    coinType: 990,
  },
  bech32Config: {
    bech32PrefixAccAddr: 'testcore',
    bech32PrefixAccPub: 'testcorepub',
    bech32PrefixValAddr: 'testcorevaloper',
    bech32PrefixValPub: 'testcorevaloperpub',
    bech32PrefixConsAddr: 'testcorevalcons',
    bech32PrefixConsPub: 'testcorevalconspub',
  },
  currencies: [
    {
      coinDenom: 'TESTCORE',
      coinMinimalDenom: 'utestcore',
      coinDecimals: 6,
    },
  ],
  feeCurrencies: [
    {
      coinDenom: 'TESTCORE',
      coinMinimalDenom: 'utestcore',
      coinDecimals: 6,
      gasPriceStep: {
        low: 0.0625,
        average: 0.1,
        high: 0.25,
      },
    },
  ],
  features: ['stargate', 'ibc-transfer', 'no-legacy-stdTx', 'ibc-go'],
};

export const supportedChains = [coreumTestnet];
