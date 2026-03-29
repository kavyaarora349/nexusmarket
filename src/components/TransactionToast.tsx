import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, Loader2, ExternalLink, Zap } from 'lucide-react';

interface ToastProps {
  status: 'pending' | 'success' | 'error';
  hash?: string;
  message?: string;
  onClose: () => void;
}

export const TransactionToast: React.FC<ToastProps> = ({ status, hash, message, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="fixed bottom-8 right-8 z-50 bg-brand-card border border-brand-border p-6 shadow-2xl shadow-black/80 max-w-sm w-full space-y-4"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {status === 'pending' && <Loader2 className="text-brand-accent animate-spin" size={20} />}
          {status === 'success' && <CheckCircle2 className="text-brand-yes" size={20} />}
          {status === 'error' && <XCircle className="text-brand-no" size={20} />}
          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white">
            {status === 'pending' ? 'TX_PENDING' : status === 'success' ? 'TX_CONFIRMED' : 'TX_FAILED'}
          </h4>
        </div>
        <button onClick={onClose} className="text-brand-muted hover:text-brand-accent transition-colors">
          <XCircle size={16} />
        </button>
      </div>

      <div className="space-y-4">
        <p className="text-[10px] text-brand-muted font-bold uppercase tracking-widest leading-relaxed">
          {message || (status === 'pending' ? 'Processing transaction on Shardeum EVM Testnet...' : status === 'success' ? 'Transaction successfully recorded on-chain.' : 'Transaction execution reverted by EVM.')}
        </p>

        {hash && (
          <a
            href={`https://explorer-mezame.shardeum.org/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-brand-bg border border-brand-border hover:border-brand-accent py-2 text-[9px] font-black mono text-brand-accent uppercase tracking-[0.2em] transition-all"
          >
            <Zap size={10} className="fill-brand-accent" />
            View on Explorer
            <ExternalLink size={10} />
          </a>
        )}
      </div>
      
      <div className="h-1 w-full bg-brand-bg relative overflow-hidden">
        <motion.div 
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: 5, ease: "linear" }}
          className={`h-full ${status === 'success' ? 'bg-brand-yes' : status === 'error' ? 'bg-brand-no' : 'bg-brand-accent'}`}
        />
      </div>
    </motion.div>
  );
};
