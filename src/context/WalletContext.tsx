import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { SHARDEUM_SPHINX, isShardeumNetwork } from '../utils/shardeum';

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  isCorrectNetwork: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);

  const checkNetwork = useCallback(async (p: ethers.BrowserProvider) => {
    const network = await p.getNetwork();
    setIsCorrectNetwork(isShardeumNetwork(Number(network.chainId)));
  }, []);

  const connect = async () => {
    if (window.ethereum) {
      try {
        const p = new ethers.BrowserProvider(window.ethereum);
        const accounts = await p.send("eth_requestAccounts", []);
        const s = await p.getSigner();
        
        setProvider(p);
        setSigner(s);
        setAddress(accounts[0]);
        await checkNetwork(p);

        // Switch network if needed
        if (!isCorrectNetwork) {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: SHARDEUM_SPHINX.chainId }],
            });
          } catch (switchError: any) {
            if (switchError.code === 4902) {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [SHARDEUM_SPHINX],
              });
            }
          }
        }
      } catch (error) {
        console.error("Connection error", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const disconnect = () => {
    setAddress(null);
    setProvider(null);
    setSigner(null);
    setIsCorrectNetwork(false);
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
        } else {
          disconnect();
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  }, []);

  return (
    <WalletContext.Provider value={{ 
      address, 
      isConnected: !!address, 
      isCorrectNetwork, 
      connect, 
      disconnect,
      provider,
      signer
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
