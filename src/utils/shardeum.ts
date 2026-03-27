export const SHARDEUM_SPHINX = {
  chainId: '0x1fb7', // 8119 in hex
  chainName: 'Shardeum EVM Testnet',
  nativeCurrency: {
    name: 'SHM',
    symbol: 'SHM',
    decimals: 18,
  },
  rpcUrls: [
    'https://api-mezame.shardeum.org',
  ],
  blockExplorerUrls: ['https://explorer-mezame.shardeum.org'],
};

export const HARDHAT_LOCAL = {
  chainId: '0x7a69', // 31337 in hex
  chainName: 'Hardhat Local Network',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['http://localhost:8545'],
  blockExplorerUrls: [],
};

export const isShardeumNetwork = (chainId: string | number) => {
  const hexChainId = typeof chainId === 'number' ? `0x${chainId.toString(16)}` : chainId;
  return hexChainId.toLowerCase() === SHARDEUM_SPHINX.chainId.toLowerCase();
};

export const isHardhatNetwork = (chainId: string | number) => {
  const hexChainId = typeof chainId === 'number' ? `0x${chainId.toString(16)}` : chainId;
  return hexChainId.toLowerCase() === HARDHAT_LOCAL.chainId.toLowerCase();
};
