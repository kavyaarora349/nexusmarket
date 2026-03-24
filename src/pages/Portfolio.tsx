import React from 'react';
import { motion } from 'motion/react';
import { Wallet, TrendingUp, History, Award, ArrowUpRight, ArrowDownRight, Zap } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

export const Portfolio: React.FC = () => {
  const { isConnected, connect, address } = useWallet();

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6 text-center">
        <div className="w-20 h-20 bg-brand-card border border-brand-border flex items-center justify-center text-brand-accent">
          <Wallet size={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black italic uppercase tracking-tighter">Terminal Locked</h2>
          <p className="text-brand-muted text-[10px] font-bold uppercase tracking-widest">Connect wallet to access your trading portfolio</p>
        </div>
        <button
          onClick={connect}
          className="bg-brand-accent hover:bg-brand-accent-hover text-black px-10 py-4 font-black uppercase tracking-[0.3em] transition-all"
        >
          Initialize Connection
        </button>
      </div>
    );
  }

  const stats = [
    { label: 'Net Worth', value: '4,280.50 SHM', change: '+12.5%', isPositive: true },
    { label: 'Active Positions', value: '12', change: '3 Pending', isPositive: true },
    { label: 'Total Profit', value: '842.20 SHM', change: '+24.2%', isPositive: true },
    { label: 'Win Rate', value: '68%', change: '-2.1%', isPositive: false },
  ];

  const positions = [
    { id: 1, market: 'Will SHM reach $5 by end of 2024?', side: 'YES', amount: '500 SHM', value: '620 SHM', pnl: '+120 SHM', status: 'Active' },
    { id: 2, market: 'Will Ethereum 2.0 reach 100M staked ETH?', side: 'NO', amount: '200 SHM', value: '180 SHM', pnl: '-20 SHM', status: 'Active' },
    { id: 3, market: 'Will Bitcoin break $100k in Q1?', side: 'YES', amount: '1000 SHM', value: '1450 SHM', pnl: '+450 SHM', status: 'Resolved' },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-brand-accent">
            <Zap size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Portfolio Terminal</span>
          </div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-tight">
            Account Overview
          </h1>
          <p className="text-brand-muted text-[10px] font-bold uppercase tracking-widest mono">
            {address}
          </p>
        </div>
        <div className="flex gap-px bg-brand-border border border-brand-border">
          <button className="bg-brand-card hover:bg-white/5 px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all border-r border-brand-border">
            Withdraw
          </button>
          <button className="bg-brand-accent text-black px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all">
            Deposit
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-brand-border border border-brand-border">
        {stats.map((stat, i) => (
          <div key={i} className="bg-brand-card p-6 space-y-2">
            <span className="text-[9px] text-brand-muted uppercase font-bold tracking-widest block">{stat.label}</span>
            <div className="flex items-end justify-between">
              <span className="mono text-xl font-black text-white">{stat.value}</span>
              <span className={`text-[10px] font-bold mono flex items-center gap-0.5 ${stat.isPositive ? 'text-brand-yes' : 'text-brand-no'}`}>
                {stat.isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Positions Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-brand-border pb-2">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand-muted">Active Positions</h3>
          <button className="text-[10px] font-bold text-brand-accent uppercase tracking-widest hover:underline">View History</button>
        </div>
        
        <div className="bg-brand-card border border-brand-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-brand-border bg-white/5">
                  <th className="p-4 text-[9px] font-black uppercase tracking-widest text-brand-muted">Market Proposition</th>
                  <th className="p-4 text-[9px] font-black uppercase tracking-widest text-brand-muted">Side</th>
                  <th className="p-4 text-[9px] font-black uppercase tracking-widest text-brand-muted">Investment</th>
                  <th className="p-4 text-[9px] font-black uppercase tracking-widest text-brand-muted">Current Value</th>
                  <th className="p-4 text-[9px] font-black uppercase tracking-widest text-brand-muted">P/L</th>
                  <th className="p-4 text-[9px] font-black uppercase tracking-widest text-brand-muted text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {positions.map((pos) => (
                  <tr key={pos.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4">
                      <span className="text-xs font-bold text-white group-hover:text-brand-accent transition-colors">{pos.market}</span>
                    </td>
                    <td className="p-4">
                      <span className={`text-[10px] font-black px-2 py-0.5 ${pos.side === 'YES' ? 'bg-brand-yes/20 text-brand-yes' : 'bg-brand-no/20 text-brand-no'}`}>
                        {pos.side}
                      </span>
                    </td>
                    <td className="p-4 text-xs mono font-bold text-brand-muted">{pos.amount}</td>
                    <td className="p-4 text-xs mono font-bold text-white">{pos.value}</td>
                    <td className={`p-4 text-xs mono font-bold ${pos.pnl.startsWith('+') ? 'text-brand-yes' : 'text-brand-no'}`}>
                      {pos.pnl}
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-[9px] font-black uppercase tracking-widest bg-brand-bg border border-brand-border px-3 py-1 hover:border-brand-accent hover:text-brand-accent transition-all">
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
