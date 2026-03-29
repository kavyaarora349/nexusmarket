import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useWallet } from './WalletContext';

export interface Bet {
  id: string;
  market: string;
  side: 'YES' | 'NO' | 'PARLAY' | 'ALLOCATE';
  amount: number;
  payout: number;
  timestamp: number;
  status: 'Active' | 'Resolved';
  result?: 'YES' | 'NO';
  type?: 'market' | 'parlay' | 'syndicate';
  txHash?: string;
  details?: string | null;
}

interface RecordBetInput {
  type: 'market' | 'parlay' | 'syndicate';
  market: string;
  side: 'YES' | 'NO' | 'PARLAY' | 'ALLOCATE';
  amount: number;
  payout: number;
  txHash?: string;
  details?: string | null;
}

interface AccountContextType {
  balance: number;
  history: Bet[];
  isHistoryLoading: boolean;
  recordBet: (bet: RecordBetInput) => Promise<{ success: boolean; error?: string }>;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const AccountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { balance: walletBalance } = useWallet();
  const [balance, setBalance] = useState<number>(0);
  const [history, setHistory] = useState<Bet[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);

  // Each user has their own local storage key
  const storageKey = user ? `nexus_account_${user.id}` : 'nexus_account_guest';

  // Load state from localStorage on mount or user change
  useEffect(() => {
    setIsHistoryLoading(true);

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setHistory(Array.isArray(parsed?.history) ? parsed.history : []);
      } else {
        setHistory([]);
      }
    } catch (error) {
      setHistory([]);
    } finally {
      setIsHistoryLoading(false);
    }
  }, [storageKey]);

  // Update balance from wallet
  useEffect(() => {
    try {
      const balanceNum = parseFloat(walletBalance);
      setBalance(Number.isFinite(balanceNum) ? balanceNum : 0);
    } catch (error) {
      setBalance(0);
    }
  }, [walletBalance]);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify({ history }));
  }, [history, storageKey]);

  const recordBet = async (bet: RecordBetInput) => {
    if (bet.amount > balance) {
      return { success: false, error: 'Insufficient Balance' };
    }

    const newBet: Bet = {
      id: Math.random().toString(36).substring(7),
      ...bet,
      timestamp: Date.now(),
      status: 'Active'
    };

    setHistory(prev => [newBet, ...prev]);

    return { success: true };
  };

  return (
    <AccountContext.Provider value={{ balance, history, isHistoryLoading, recordBet }}>
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
