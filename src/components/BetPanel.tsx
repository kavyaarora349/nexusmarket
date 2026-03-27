import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../context/WalletContext';
import { useAccount } from '../context/AccountContext';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export const BetPanel: React.FC<{ marketId: string }> = ({ marketId }) => {
  const { isConnected, connect, signer, fetchBalance } = useWallet();
  const { balance, recordBet } = useAccount();
  const [side, setSide] = useState<'YES' | 'NO'>('YES');
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // AMM CPMM slippage simulation (k = x * y)
  const yesPool = 50000;
  const noPool = 30000;

  let priceImpact = "< 0.1%";
  let payout = "0.00";
  let roi = "0%";

  if (amount && parseFloat(amount) > 0) {
    const amt = parseFloat(amount);
    const targetPool = side === 'YES' ? yesPool : noPool;
    const impact = (amt / (targetPool + amt)) * 100;

    priceImpact = impact < 0.1 ? "< 0.1%" : `~${impact.toFixed(2)}%`;

    const impliedOdds = targetPool / (yesPool + noPool);
    const effectiveOdds = Math.min(0.99, impliedOdds + (impact / 100));
    const shares = amt / effectiveOdds;

    payout = shares.toFixed(2);
    roi = (((shares - amt) / amt) * 100).toFixed(1) + "%";
  }

  const handleBet = async () => {
    if (!isConnected || !signer) {
      connect();
      return;
    }
    
    setError(null);
    setSuccess(false);
    
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) return;
    
    if (amt > balance) {
      setError('Insufficient SHM Balance');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate calling a PredictionMarket contract by sending SHM to a protocol pool address (burn/fee address)
      // This ensures the transaction goes through MetaMask and consumes the actual testnet SHM.
      const protocolAddress = "0x000000000000000000000000000000000000dEaD";
      const tx = await signer.sendTransaction({
        to: protocolAddress,
        value: ethers.parseEther(amt.toString())
      });
      
      // Wait for transaction confirmation
      await tx.wait();

      // Transcation successful: update local state & record bet history
      const result = await recordBet({
        type: 'market',
        market: marketId,
        side,
        amount: amt,
        payout: parseFloat(payout),
        txHash: tx.hash,
      });
      
      if (result.success) {
        setSuccess(true);
        setAmount('');
        // Refresh wallet balance to reflect new consumed amount quickly
        await fetchBalance();
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.error || 'Failed to save bet');
      }
    } catch (err: any) {
      console.error("Bet transaction failed:", err);
      // Clean up common MetaMask error messages
      const msg = err?.info?.error?.message || err?.message || 'Transaction failed or rejected';
      setError(msg.length > 50 ? msg.substring(0, 50) + "..." : msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-brand-card border border-brand-border flex flex-col">
      <div className="p-4 border-b border-brand-border flex items-center justify-between">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-muted">Execute Trade</h3>
        <span className="text-[8px] border border-brand-accent text-brand-accent px-2 py-0.5 uppercase font-bold tracking-widest hidden sm:block">CPMM AMM Router</span>
      </div>

      <div className="p-6 space-y-6">
        <div className="flex gap-px bg-brand-border border border-brand-border">
          <button
            onClick={() => setSide('YES')}
            className={`flex-1 py-3 font-bold text-xs uppercase tracking-widest transition-all ${side === 'YES'
              ? 'bg-brand-yes text-black'
              : 'bg-brand-card text-brand-muted hover:text-white'
              }`}
          >
            BUY YES
          </button>
          <button
            onClick={() => setSide('NO')}
            className={`flex-1 py-3 font-bold text-xs uppercase tracking-widest transition-all ${side === 'NO'
              ? 'bg-brand-no text-white'
              : 'bg-brand-card text-brand-muted hover:text-white'
              }`}
          >
            BUY NO
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <label className="text-[9px] font-bold text-brand-muted uppercase tracking-widest">Order Size</label>
            <span className="text-[9px] font-bold text-brand-accent uppercase tracking-widest mono">Balance: {balance.toLocaleString()} SHM</span>
          </div>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-brand-bg border border-brand-border rounded-none py-4 px-4 mono text-xl focus:outline-none focus:border-brand-accent transition-colors"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted font-bold text-xs mono">SHM</div>
          </div>
          <div className="grid grid-cols-4 gap-1">
            {['25%', '50%', '75%', 'MAX'].map(p => (
              <button key={p} className="bg-brand-bg border border-brand-border py-1 text-[9px] font-bold text-brand-muted hover:border-brand-accent hover:text-white transition-all">
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-brand-bg border border-brand-border p-4 space-y-3">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
            <span className="text-brand-muted">Est. Payout</span>
            <span className="mono text-brand-yes">{payout} SHM</span>
          </div>
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
            <span className="text-brand-muted">Price Impact</span>
            <span className="mono text-brand-accent">{'< 0.1%'}</span>
          </div>
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
            <span className="text-brand-muted">ROI</span>
            <span className="mono text-white">{roi}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {error && (
            <div className="bg-brand-no/10 border border-brand-no/20 p-3 flex items-center gap-2 text-brand-no text-[10px] font-bold uppercase tracking-widest">
              <AlertCircle size={14} />
              {error}
            </div>
          )}
          {success && (
            <div className="bg-brand-yes/10 border border-brand-yes/20 p-3 flex items-center gap-2 text-brand-yes text-[10px] font-bold uppercase tracking-widest">
              <CheckCircle2 size={14} />
              Bet Placed Successfully!
            </div>
          )}
          <button
            onClick={handleBet}
            disabled={!amount || parseFloat(amount) <= 0 || isLoading}
            className={`w-full py-4 font-bold text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-2 ${
              !amount || parseFloat(amount) <= 0 || isLoading
                ? 'bg-brand-border text-brand-muted cursor-not-allowed'
                : 'bg-brand-accent hover:bg-brand-accent-hover text-black'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Confirming in Wallet...
              </>
            ) : isConnected ? (
              `Confirm ${side} Order`
            ) : (
              'Connect Wallet'
            )}
          </button>
        </div>

        <p className="text-[9px] text-brand-muted uppercase font-bold text-center leading-relaxed">
          Execution is final. Protocol fees apply.
        </p>
      </div>
    </div>
  );
};
