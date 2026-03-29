import React from 'react';
import { useWallet } from '../context/WalletContext';
import { ShieldAlert, RefreshCw, Zap } from 'lucide-react';
import { SHARDEUM_SPHINX } from '../utils/shardeum';

export const NetworkGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isConnected, isCorrectNetwork } = useWallet();

  const handleSwitch = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: SHARDEUM_SPHINX.chainId }],
        });
        window.location.reload();
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [SHARDEUM_SPHINX],
            });
            window.location.reload();
          } catch (addError: any) {
            console.error("Error adding chain:", addError);
            alert(`Failed to add Shardeum network to MetaMask: ${addError.message || addError.code}`);
          }
        } else {
          console.error("Error switching chain:", switchError);
          alert(`Failed to switch network in MetaMask: ${switchError.message || switchError.code}`);
        }
      }
    } else {
      alert("MetaMask not found!");
    }
  };

  if (isConnected && !isCorrectNetwork) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-6">
        <div className="bg-brand-card border border-brand-border p-10 max-w-md w-full text-center space-y-8 shadow-2xl shadow-brand-no/5">
          <div className="w-24 h-24 bg-brand-no/5 text-brand-no flex items-center justify-center mx-auto border border-brand-no/20">
            <ShieldAlert size={48} strokeWidth={1.5} />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Network Error</h2>
            <p className="text-[10px] text-brand-muted font-bold uppercase tracking-[0.2em] leading-relaxed">
              NexusMarket protocol is strictly deployed on <span className="text-brand-accent">Shardeum EVM Testnet</span>. Please switch your provider network to continue.
            </p>
          </div>
          <button
            onClick={handleSwitch}
            className="w-full flex items-center justify-center gap-3 bg-brand-accent hover:bg-brand-accent-hover text-black py-4 font-black text-xs uppercase tracking-[0.2em] transition-all"
          >
            <RefreshCw size={18} />
            Switch to Shardeum
          </button>

          <div className="pt-4 flex items-center justify-center gap-2 text-brand-muted mono text-[9px] font-bold uppercase tracking-widest">
            <Zap size={12} className="fill-brand-muted" />
            Chain ID: {SHARDEUM_SPHINX.chainId}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
