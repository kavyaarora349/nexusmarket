import React from 'react';
import { useWallet } from '../context/WalletContext';
import { Wallet, LogOut, ShieldAlert, ChevronDown } from 'lucide-react';

export const WalletConnect: React.FC = () => {
  const { address, isConnected, isCorrectNetwork, connect, disconnect } = useWallet();

  if (!isConnected) {
    return (
      <button
        onClick={connect}
        className="flex items-center gap-2 bg-brand-accent hover:bg-brand-accent-hover text-black px-4 py-2 rounded font-bold text-xs uppercase tracking-widest transition-all"
      >
        <Wallet size={14} />
        Connect Wallet
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {!isCorrectNetwork && (
        <div className="flex items-center gap-1 text-brand-no bg-brand-no/10 px-2 py-1 rounded border border-brand-no/20 text-[10px] font-bold uppercase tracking-wider">
          <ShieldAlert size={12} />
          Network Error
        </div>
      )}
      <div className="flex items-center gap-3 bg-brand-card border border-brand-border px-3 py-1.5 rounded hover:border-brand-accent transition-all group cursor-pointer">
        <div className="w-1.5 h-1.5 rounded-full bg-brand-yes shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
        <span className="mono text-[11px] font-bold text-white">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
        <ChevronDown size={12} className="text-brand-muted group-hover:text-brand-accent transition-colors" />
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            disconnect();
          }}
          className="text-brand-muted hover:text-brand-no transition-colors ml-1"
          title="Disconnect"
        >
          <LogOut size={12} />
        </button>
      </div>
    </div>
  );
};
