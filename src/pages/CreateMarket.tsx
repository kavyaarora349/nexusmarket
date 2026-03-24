import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Info, Calendar, Tag, FileText, AlertTriangle, Zap, ShieldCheck, Loader2, CheckCircle2 } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

export const CreateMarket: React.FC = () => {
  const { isConnected, connect } = useWallet();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Crypto',
    endDate: '',
    initialLiquidity: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      connect();
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-8">
        <div className="w-24 h-24 bg-brand-yes/10 text-brand-yes border border-brand-yes flex items-center justify-center mx-auto">
          <CheckCircle2 size={48} />
        </div>
        <div className="space-y-2">
          <h2 className="text-5xl font-black italic uppercase tracking-tighter">Market Deployed</h2>
          <p className="text-brand-muted text-[10px] font-bold uppercase tracking-widest">Your prediction market is now live on Shardeum Sphinx.</p>
        </div>
        <div className="bg-brand-card border border-brand-border p-6 mono text-xs text-brand-accent break-all">
          TX_HASH: 0x72a1b89c23f4e5d6a7b8c9d0e1f2a3b4c5d6e7f8
        </div>
        <button
          onClick={() => window.location.href = '/'}
          className="bg-brand-accent hover:bg-brand-accent-hover text-black px-10 py-4 font-black uppercase tracking-[0.3em] transition-all"
        >
          Return to Terminal
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-brand-accent">
          <Plus size={16} />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Protocol Expansion</span>
        </div>
        <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-tight">
          Initialize New Market
        </h1>
        <p className="text-brand-muted text-sm font-bold uppercase tracking-widest">
          Deploy a decentralized prediction market on Shardeum Sphinx.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-6">
          <div className="bg-brand-card border border-brand-border p-8 space-y-8">
            {/* Market Title */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-brand-muted">
                <FileText size={14} className="text-brand-accent" />
                Market Proposition
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Will SHM exceed $5.00 by EOY 2026?"
                className="w-full bg-brand-bg border border-brand-border py-4 px-4 text-white focus:outline-none focus:border-brand-accent transition-colors font-bold"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            {/* Description */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-brand-muted">
                <Info size={14} className="text-brand-accent" />
                Resolution Criteria
              </label>
              <textarea
                required
                rows={4}
                placeholder="Define clear, binary resolution rules..."
                className="w-full bg-brand-bg border border-brand-border py-4 px-4 text-white focus:outline-none focus:border-brand-accent transition-colors text-sm"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Category */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-brand-muted">
                  <Tag size={14} className="text-brand-accent" />
                  Sector
                </label>
                <select
                  className="w-full bg-brand-bg border border-brand-border py-4 px-4 text-white focus:outline-none focus:border-brand-accent transition-colors font-bold appearance-none"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option>Crypto</option>
                  <option>Politics</option>
                  <option>Sports</option>
                  <option>Tech</option>
                  <option>Science</option>
                </select>
              </div>

              {/* End Date */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-brand-muted">
                  <Calendar size={14} className="text-brand-accent" />
                  Expiration Timestamp
                </label>
                <input
                  type="date"
                  required
                  className="w-full bg-brand-bg border border-brand-border py-4 px-4 text-white focus:outline-none focus:border-brand-accent transition-colors font-bold"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>

            {/* Initial Liquidity */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-brand-muted">
                <Plus size={14} className="text-brand-accent" />
                Initial Liquidity Seed (SHM)
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  placeholder="Min. 100 SHM"
                  className="w-full bg-brand-bg border border-brand-border py-4 px-4 text-white focus:outline-none focus:border-brand-accent transition-colors font-bold mono"
                  value={formData.initialLiquidity}
                  onChange={(e) => setFormData({ ...formData, initialLiquidity: e.target.value })}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted font-bold mono text-xs">SHM</div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-accent hover:bg-brand-accent-hover text-black py-6 font-black uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-3"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : isConnected ? (
              'Broadcast Market Proposal'
            ) : (
              'Connect Wallet to Initialize'
            )}
          </button>
        </form>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-brand-card border border-brand-border p-6 space-y-4">
            <div className="flex items-center gap-2 text-brand-no">
              <AlertTriangle size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Risk Warning</span>
            </div>
            <p className="text-[11px] text-brand-muted leading-relaxed font-bold uppercase">
              Market creation requires a non-refundable protocol fee of 10 SHM. Ensure resolution criteria are objective and verifiable.
            </p>
          </div>

          <div className="bg-brand-card border border-brand-border p-6 space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-accent">Deployment Preview</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-brand-border pb-2">
                <span className="text-[9px] text-brand-muted uppercase font-bold">Protocol Fee</span>
                <span className="mono text-xs font-bold">10.00 SHM</span>
              </div>
              <div className="flex justify-between items-center border-b border-brand-border pb-2">
                <span className="text-[9px] text-brand-muted uppercase font-bold">Gas Est.</span>
                <span className="mono text-xs font-bold">~0.42 SHM</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-[9px] text-brand-accent uppercase font-black">Total Required</span>
                <span className="mono text-lg font-black text-brand-accent">
                  {formData.initialLiquidity ? (parseFloat(formData.initialLiquidity) + 10.42).toFixed(2) : '10.42'} SHM
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
