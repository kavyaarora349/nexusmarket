import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useWallet } from './WalletContext';

export interface Bet {
  id: string;
  market: string;
  side: 'YES' | 'NO';
  amount: number;
  payout: number;
  timestamp: number;
  status: 'Active' | 'Resolved';
  result?: 'YES' | 'NO';
}

interface AccountContextType {
  balance: number;
  history: Bet[];
  placeBet: (market: string, side: 'YES' | 'NO', amount: number, payout: number) => { success: boolean; error?: string };
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const AccountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { balance: walletBalance } = useWallet();
  const [balance, setBalance] = useState<number>(0);
  const [history, setHistory] = useState<Bet[]>([]);

  // Each user has their own local storage key
  const storageKey = user ? `nexus_account_${user.id}` : 'nexus_account_guest';

  // Load state from localStorage on mount or user change
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const { history: savedHistory } = JSON.parse(saved);
      setHistory(savedHistory);
    } else {
      // Initialize for new user
      setHistory([]);
    }
  }, [storageKey]);

  // Update balance from wallet
  useEffect(() => {
    if (walletBalance) {
      try {
        const balanceNum = parseFloat(walletBalance);
        setBalance(isNaN(balanceNum) ? 0 : balanceNum);
      } catch (e) {
        setBalance(0);
      }
    }
  }, [walletBalance]);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify({ history }));
  }, [history, storageKey]);

  const placeBet = (market: string, side: 'YES' | 'NO', amount: number, payout: number) => {
    if (amount > balance) {
      return { success: false, error: 'Insufficient Balance' };
    }

    const newBet: Bet = {
      id: Math.random().toString(36).substring(7),
      market,
      side,
      amount,
      payout,
      timestamp: Date.now(),
      status: 'Active'
    };

    setBalance(prev => prev - amount);
    setHistory(prev => [newBet, ...prev]);

    return { success: true };
  };

  return (
    <AccountContext.Provider value={{ balance, history, placeBet }}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
};
