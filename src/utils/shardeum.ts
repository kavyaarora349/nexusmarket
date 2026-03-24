export const SHARDEUM_SPHINX = {
  chainId: '0x1f92', // 8082 in hex
  chainName: 'Shardeum Sphinx 1.X',
  nativeCurrency: {
    name: 'SHM',
    symbol: 'SHM',
    decimals: 18,
  },
  rpcUrls: ['https://sphinx.shardeum.org/'],
  blockExplorerUrls: ['https://explorer-sphinx.shardeum.org/'],
};

export const isShardeumNetwork = (chainId: string | number) => {
  const hexChainId = typeof chainId === 'number' ? `0x${chainId.toString(16)}` : chainId;
  return hexChainId.toLowerCase() === SHARDEUM_SPHINX.chainId.toLowerCase();
};
