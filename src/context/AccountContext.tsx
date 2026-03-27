import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useWallet } from './WalletContext';
import { supabase } from '../utils/supabase';

export interface Bet {
  id: string;
  type: 'market' | 'parlay' | 'syndicate';
  market: string;
  side: string;
  amount: number;
  payout: number;
  timestamp: number;
  status: 'Active' | 'Resolved';
  result?: 'YES' | 'NO';
  txHash?: string | null;
  details?: string | null;
}

interface RecordBetInput {
  type: 'market' | 'parlay' | 'syndicate';
  market: string;
  side: string;
  amount: number;
  payout: number;
  status?: 'Active' | 'Resolved';
  result?: 'YES' | 'NO';
  txHash?: string | null;
  details?: string | null;
}

interface AccountContextType {
  balance: number;
  history: Bet[];
  isHistoryLoading: boolean;
  recordBet: (bet: RecordBetInput) => Promise<{ success: boolean; error?: string }>;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

interface BetRow {
  id: string;
  type: 'market' | 'parlay' | 'syndicate';
  market: string;
  side: string;
  amount: number;
  payout: number;
  status: 'Active' | 'Resolved';
  result: 'YES' | 'NO' | null;
  tx_hash: string | null;
  details: string | null;
  created_at: string;
}

const GUEST_STORAGE_KEY = 'nexus_account_guest_history';

const mapRowToBet = (row: BetRow): Bet => ({
  id: row.id,
  type: row.type,
  market: row.market,
  side: row.side,
  amount: Number(row.amount),
  payout: Number(row.payout),
  timestamp: new Date(row.created_at).getTime(),
  status: row.status,
  result: row.result ?? undefined,
  txHash: row.tx_hash,
  details: row.details,
});

export const AccountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { balance: walletBalance } = useWallet();
  const [balance, setBalance] = useState<number>(0);
  const [history, setHistory] = useState<Bet[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      setIsHistoryLoading(true);

      if (!user) {
        const saved = localStorage.getItem(GUEST_STORAGE_KEY);
        if (saved) {
          try {
            setHistory(JSON.parse(saved));
          } catch (error) {
            console.error('Failed to parse guest bet history', error);
            setHistory([]);
          }
        } else {
          setHistory([]);
        }
        setIsHistoryLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('bets')
        .select('id, type, market, side, amount, payout, status, result, tx_hash, details, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to load bet history from Supabase', error);
        setHistory([]);
        setIsHistoryLoading(false);
        return;
      }

      setHistory(((data || []) as BetRow[]).map(mapRowToBet));
      setIsHistoryLoading(false);
    };

    loadHistory();
  }, [user]);

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

  useEffect(() => {
    if (!user) {
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(history));
    }
  }, [history, user]);

  const recordBet = async ({
    type,
    market,
    side,
    amount,
    payout,
    status = 'Active',
    result,
    txHash = null,
    details = null,
  }: RecordBetInput) => {
    if (amount > balance) {
      return { success: false, error: 'Insufficient Balance' };
    }

    const newBet: Bet = {
      id: crypto.randomUUID(),
      type,
      market,
      side,
      amount,
      payout,
      timestamp: Date.now(),
      status,
      result,
      txHash,
      details,
    };

    if (!user) {
      setHistory(prev => [newBet, ...prev]);
      return { success: true };
    }

    const { data, error } = await supabase
      .from('bets')
      .insert({
        user_id: user.id,
        type,
        market,
        side,
        amount,
        payout,
        status,
        result: result ?? null,
        tx_hash: txHash,
        details,
      })
      .select('id, type, market, side, amount, payout, status, result, tx_hash, details, created_at')
      .single();

    if (error) {
      console.error('Failed to save bet to Supabase, falling back to local cache', error);
      setHistory(prev => [newBet, ...prev]);
      return { success: true };
    }

    setHistory(prev => [mapRowToBet(data as BetRow), ...prev]);
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
