import { useMemo } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../context/WalletContext';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../utils/contract';

export const useContract = () => {
  const { signer, provider } = useWallet();

  const contract = useMemo(() => {
    if (!signer && !provider) return null;
    const target = signer || provider;
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, target);
  }, [signer, provider]);

  return contract;
};
