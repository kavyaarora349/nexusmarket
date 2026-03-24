import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';

export const BetPanel: React.FC<{ marketId: string }> = ({ marketId }) => {
  const { isConnected, connect } = useWallet();
  const [side, setSide] = useState<'YES' | 'NO'>('YES');
  const [amount, setAmount] = useState<string>('');

  const payout = amount ? (parseFloat(amount) * 1.8).toFixed(2) : '0.00';
  const roi = '80%';

  const handleBet = () => {
    if (!isConnected) {
      connect();
      return;
    }
    alert(`Placing ${amount} SHM bet on ${side} for market ${marketId}`);
  };

  return (
    <div className="bg-brand-card border border-brand-border flex flex-col">
      <div className="p-4 border-b border-brand-border">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-muted">Execute Trade</h3>
      </div>

      <div className="p-6 space-y-6">
        <div className="flex gap-px bg-brand-border border border-brand-border">
          <button
            onClick={() => setSide('YES')}
            className={`flex-1 py-3 font-bold text-xs uppercase tracking-widest transition-all ${
              side === 'YES' 
                ? 'bg-brand-yes text-black' 
                : 'bg-brand-card text-brand-muted hover:text-white'
            }`}
          >
            BUY YES
          </button>
          <button
            onClick={() => setSide('NO')}
            className={`flex-1 py-3 font-bold text-xs uppercase tracking-widest transition-all ${
              side === 'NO' 
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
            <span className="text-[9px] font-bold text-brand-accent uppercase tracking-widest mono">Balance: 1,240 SHM</span>
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

        <button
          onClick={handleBet}
          disabled={!amount || parseFloat(amount) <= 0}
          className={`w-full py-4 font-bold text-xs uppercase tracking-[0.3em] transition-all ${
            !amount || parseFloat(amount) <= 0
              ? 'bg-brand-border text-brand-muted cursor-not-allowed'
              : 'bg-brand-accent hover:bg-brand-accent-hover text-black'
          }`}
        >
          {isConnected ? `Confirm ${side} Order` : 'Connect Wallet'}
        </button>

        <p className="text-[9px] text-brand-muted uppercase font-bold text-center leading-relaxed">
          Execution is final. Protocol fees apply.
        </p>
      </div>
    </div>
  );
};
