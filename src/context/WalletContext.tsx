import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { SHARDEUM_SPHINX, HARDHAT_LOCAL, isShardeumNetwork, isHardhatNetwork } from '../utils/shardeum';

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  isCorrectNetwork: boolean;
  balance: string;
  fetchBalance: () => Promise<void>;
  connect: () => Promise<void>;
  connectWeb3Auth: () => Promise<void>;
  disconnect: () => void;
  provider: ethers.BrowserProvider | ethers.JsonRpcProvider | null;
  signer: ethers.Signer | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | ethers.JsonRpcProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const [balance, setBalance] = useState("0");

  const fetchBalance = useCallback(async (addr?: string | null, p?: ethers.Provider | null) => {
    const fetchAddr = addr !== undefined ? addr : address;
    const fetchProvider = p !== undefined ? p : provider;
    
    if (fetchAddr && fetchProvider) {
      try {
        console.log("Fetching balance for", fetchAddr);
        const bal = await fetchProvider.getBalance(fetchAddr);
        const formatted = ethers.formatEther(bal);
        console.log("Balance fetched:", formatted);
        setBalance(formatted);
      } catch (err: any) {
        console.error("Failed to fetch balance:", err?.code, err?.message);
        // Don't set to "0" on error - keep the previous balance
        // This helps during RPC downtime
      }
    } else {
      console.warn("Missing address or provider for balance fetch");
    }
  }, [address, provider]);

  const checkNetwork = useCallback(async (p: ethers.BrowserProvider) => {
    const network = await p.getNetwork();
    const chainId = Number(network.chainId);
    const supported = isShardeumNetwork(chainId) || isHardhatNetwork(chainId);
    setIsCorrectNetwork(supported);
    return supported;
  }, []);

  const ensureCorrectNetwork = useCallback(async (p: ethers.BrowserProvider) => {
    const alreadySupported = await checkNetwork(p);
    if (alreadySupported) {
      return p;
    }

    if (!window.ethereum) {
      return p;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SHARDEUM_SPHINX.chainId }],
      });
      const refreshedProvider = new ethers.BrowserProvider(window.ethereum);
      await checkNetwork(refreshedProvider);
      return refreshedProvider;
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [SHARDEUM_SPHINX],
        });
        const refreshedProvider = new ethers.BrowserProvider(window.ethereum);
        await checkNetwork(refreshedProvider);
        return refreshedProvider;
      }

      console.warn("Failed to switch to supported network", switchError);
      return p;
    }
  }, [checkNetwork]);

  const connect = async () => {
    if (window.ethereum) {
      try {
        let browserProvider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await browserProvider.send("eth_requestAccounts", []);
        browserProvider = await ensureCorrectNetwork(browserProvider);
        const s = await browserProvider.getSigner();
        const selectedAddress = accounts[0];

        console.log("Connected account:", selectedAddress);
        setProvider(browserProvider);
        setSigner(s);
        setAddress(selectedAddress);
        await checkNetwork(browserProvider);

        // Fetch balance with retry logic after the final network is selected
        let retries = 0;
        const maxRetries = 3;
        while (retries < maxRetries) {
          try {
            const bal = await browserProvider.getBalance(selectedAddress);
            const formatted = ethers.formatEther(bal);
            console.log("Initial balance:", formatted);
            setBalance(formatted);
            break;
          } catch (balErr: any) {
            retries++;
            if (retries < maxRetries) {
              console.log(`Balance fetch failed, retry ${retries}/${maxRetries}...`);
              await new Promise(resolve => setTimeout(resolve, 1000 * retries));
            } else {
              console.error("Failed to fetch initial balance after retries:", balErr?.message);
              setBalance("0.00");
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
    setBalance("0");
    localStorage.removeItem('web3auth_mock_key');
  };

  const connectWeb3Auth = async () => {
    // Simulates Web3Auth / Biconomy Account Abstraction login (Gasless/Email)
    try {
      let privKey = localStorage.getItem('web3auth_mock_key');
      if (!privKey) {
        const wallet = ethers.Wallet.createRandom();
        privKey = wallet.privateKey;
        localStorage.setItem('web3auth_mock_key', privKey);
      }

      const rpcProvider = new ethers.JsonRpcProvider(SHARDEUM_SPHINX.rpcUrls[0]);
      const walletSigner = new ethers.Wallet(privKey, rpcProvider);

      setProvider(rpcProvider);
      setSigner(walletSigner);
      setAddress(walletSigner.address);
      setIsCorrectNetwork(true); // Assuming testnet rpc works
      await fetchBalance(walletSigner.address, rpcProvider);
    } catch (error) {
      console.error("Web3Auth Connection error", error);
    }
  };

  useEffect(() => {
    // Auto-connect if web3auth mock key exists
    if (localStorage.getItem('web3auth_mock_key')) {
      connectWeb3Auth();
    }
  }, []);

  // Periodically refresh balance if connected
  useEffect(() => {
    if (address && provider) {
      console.log("Setting up balance refresh interval");
      let failureCount = 0;
      
      const refreshBalance = async () => {
        try {
          const bal = await provider.getBalance(address);
          const formatted = ethers.formatEther(bal);
          setBalance(formatted);
          failureCount = 0; // Reset on success
        } catch (err: any) {
          failureCount++;
          console.warn(`Balance refresh failed (${failureCount} times):`, err?.code);
          
          // After multiple failures, try again more aggressively
          if (failureCount > 5) {
            console.warn("RPC seems down, will retry more frequently");
            failureCount = 0; // Reset to try again sooner
          }
        }
      };

      // Fetch balance immediately
      refreshBalance();

      // Refresh every 30 seconds initially
      const interval = setInterval(refreshBalance, 30000);

      return () => clearInterval(interval);
    }
  }, [address, provider]);

  // Listen for MetaMask account and chain changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = async (accounts: string[]) => {
        if (accounts.length > 0) {
          try {
            const nextProvider = new ethers.BrowserProvider(window.ethereum);
            const nextSigner = await nextProvider.getSigner();
            setProvider(nextProvider);
            setSigner(nextSigner);
            setAddress(accounts[0]);
            await checkNetwork(nextProvider);
            await fetchBalance(accounts[0], nextProvider);
          } catch (error) {
            console.error("Failed to refresh wallet after account change", error);
          }
        } else {
          disconnect();
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [checkNetwork, fetchBalance]);

  return (
    <WalletContext.Provider value={{
      address,
      isConnected: !!address,
      isCorrectNetwork,
      balance,
      fetchBalance,
      connect,
      connectWeb3Auth,
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
