import React from 'react';
import { motion } from 'motion/react';
import { Wallet, TrendingUp, History, Award, ArrowUpRight, ArrowDownRight, Zap, ShieldCheck, Clock } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useAccount } from '../context/AccountContext';

export const Portfolio: React.FC = () => {
  const { isConnected, connect, address } = useWallet();
  const { balance, history, isHistoryLoading } = useAccount();
  const [showDeposit, setShowDeposit] = React.useState(false);
  const [showWithdraw, setShowWithdraw] = React.useState(false);

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

  const activeBets = history.filter(b => b.status === 'Active');
  const resolvedBets = history.filter(b => b.status === 'Resolved');

  const stats = [
    { label: 'Net Worth', value: `${balance.toLocaleString()} SHM`, change: '+0%', isPositive: true },
    { label: 'Active Positions', value: activeBets.length.toString(), change: `${resolvedBets.length} Resolved`, isPositive: true },
    { label: 'Total P/L', value: '0 SHM', change: '0%', isPositive: true },
    { label: 'Bet Count', value: history.length.toString(), change: 'Live', isPositive: true },
  ];

  // No mock positions needed anymore as we use history


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
          <button onClick={() => setShowWithdraw(true)} className="bg-brand-card hover:bg-white/5 px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all border-r border-brand-border">
            Withdraw
          </button>
          <button onClick={() => setShowDeposit(true)} className="bg-brand-accent text-black px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-white">
            Deposit
          </button>
        </div>
      </div>

      {/* Soulbound Badges */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-brand-border pb-2">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand-muted">Soulbound Credentials</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-brand-card border border-brand-accent p-4 relative overflow-hidden group">
            <div className="absolute inset-0 bg-brand-accent/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <div className="relative z-10 flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 rounded-full border border-brand-accent flex items-center justify-center bg-brand-accent/10 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                <Zap size={20} className="text-brand-accent" />
              </div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-accent">Early Adopter</h4>
              <span className="text-[8px] font-bold text-brand-muted uppercase tracking-wider">Soulbound NFT</span>
            </div>
          </div>
          <div className="bg-brand-card border border-brand-yes p-4 relative overflow-hidden group">
            <div className="absolute inset-0 bg-brand-yes/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <div className="relative z-10 flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 rounded-full border border-brand-yes flex items-center justify-center bg-brand-yes/10 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                <ShieldCheck size={20} className="text-brand-yes" />
              </div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-yes">First Victory</h4>
              <span className="text-[8px] font-bold text-brand-muted uppercase tracking-wider">Soulbound NFT</span>
            </div>
          </div>
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
          <div className="flex items-center gap-3">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand-muted">Active Positions</h3>
            <span className="bg-brand-yes/10 text-brand-yes border border-brand-yes px-2 py-0.5 text-[8px] font-black uppercase tracking-widest animate-pulse">
              Earnings: 12.4% APY
            </span>
          </div>
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
                {isHistoryLoading ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-brand-muted text-[10px] font-bold uppercase tracking-[0.2em]">
                      <div className="flex flex-col items-center gap-3">
                        <Clock size={24} className="opacity-20 animate-pulse" />
                        Loading transaction history
                      </div>
                    </td>
                  </tr>
                ) : history.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-brand-muted text-[10px] font-bold uppercase tracking-[0.2em]">
                      <div className="flex flex-col items-center gap-3">
                        <Clock size={24} className="opacity-20" />
                        No transaction history found
                      </div>
                    </td>
                  </tr>
                ) : (
                  history.map((pos) => (
                    <tr key={pos.id} className="hover:bg-white/5 transition-colors group">
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-white group-hover:text-brand-accent transition-colors">{pos.market}</span>
                          <span className="text-[8px] text-brand-muted uppercase font-bold mt-1">
                            {new Date(pos.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`text-[10px] font-black px-2 py-0.5 ${pos.side === 'YES'
                            ? 'bg-brand-yes/20 text-brand-yes'
                            : pos.side === 'NO'
                              ? 'bg-brand-no/20 text-brand-no'
                              : 'bg-brand-accent/20 text-brand-accent'
                          }`}>
                          {pos.side}
                        </span>
                      </td>
                      <td className="p-4 text-xs mono font-bold text-brand-muted">{pos.amount} SHM</td>
                      <td className="p-4 text-xs mono font-bold text-white">{pos.payout} SHM</td>
                      <td className={`p-4 text-xs mono font-bold text-brand-accent`}>
                        {pos.status}
                      </td>
                      <td className="p-4 text-right">
                        <button className="text-[9px] font-black uppercase tracking-widest bg-brand-bg border border-brand-border px-3 py-1 hover:border-brand-accent hover:text-brand-accent transition-all">
                          Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Global Leaderboard */}
      <div className="space-y-4 pt-10">
        <div className="flex items-center justify-between border-b border-brand-border pb-2">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand-accent">Global Leaderboard</h3>
          <span className="text-[10px] font-bold text-brand-muted uppercase tracking-widest hover:underline cursor-pointer">Full Rankings</span>
        </div>

        <div className="bg-brand-card border border-brand-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-brand-border bg-white/5">
                  <th className="p-4 text-[9px] font-black uppercase tracking-widest text-brand-muted">Rank</th>
                  <th className="p-4 text-[9px] font-black uppercase tracking-widest text-brand-muted">Trader</th>
                  <th className="p-4 text-[9px] font-black uppercase tracking-widest text-brand-muted">Total Volume</th>
                  <th className="p-4 text-[9px] font-black uppercase tracking-widest text-brand-muted text-right">Net Profit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {[
                  { rank: 1, trader: '0x8fC...4a1B', vol: '142,500 SHM', pnl: '+42,180 SHM' },
                  { rank: 2, trader: '0x32A...9c9D', vol: '88,200 SHM', pnl: '+18,450 SHM' },
                  { rank: 3, trader: '0x99B...1f2E', vol: '54,100 SHM', pnl: '+11,200 SHM' },
                  { rank: 4, trader: '0x1Ed...77cC', vol: '31,000 SHM', pnl: '+8,900 SHM' },
                  { rank: 5, trader: '0x44F...00aA', vol: '19,500 SHM', pnl: '+4,200 SHM' }
                ].map((row) => (
                  <tr key={row.rank} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4">
                      <span className={`text-xs font-black px-2 py-0.5 ${row.rank === 1 ? 'bg-brand-yes/20 text-brand-yes' : 'text-brand-muted'}`}>
                        #{row.rank}
                      </span>
                    </td>
                    <td className="p-4 mono text-xs font-bold text-white group-hover:text-brand-accent transition-colors cursor-pointer">{row.trader}</td>
                    <td className="p-4 text-xs font-bold text-brand-muted">{row.vol}</td>
                    <td className="p-4 text-xs mono font-black text-brand-yes text-right">{row.pnl}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showDeposit && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowDeposit(false)}>
          <div className="bg-brand-bg border border-brand-border p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-black italic uppercase tracking-widest mb-2 text-white">Deposit Funds</h2>
            <p className="text-brand-muted text-[10px] font-bold tracking-widest uppercase mb-6">Testnet environment active</p>

            <div className="bg-brand-card p-6 border border-brand-border mb-6 flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 border border-brand-accent rounded p-2 bg-brand-accent/5 flex items-center justify-center">
                <Zap size={24} className="text-brand-accent" />
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">Your Deposit Address</span>
                <span className="block break-all mono text-xs font-bold text-white bg-black p-3 border border-brand-border">
                  {address}
                </span>
              </div>
            </div>

            <a href="https://docs.shardeum.org/docs/developer/faucet" target="_blank" rel="noreferrer" className="block text-center border border-brand-accent text-brand-accent font-black uppercase tracking-[0.2em] py-4 hover:bg-brand-accent hover:text-black transition-colors text-xs w-full">
              Get Testnet SHM
            </a>
          </div>
        </div>
      )}

      {showWithdraw && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowWithdraw(false)}>
          <div className="bg-brand-bg border border-brand-border p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-black italic uppercase tracking-widest mb-2 text-white">Withdraw Funds</h2>
            <p className="text-brand-muted text-[10px] font-bold tracking-widest uppercase mb-6">Transfer SHM to address</p>
            <input type="text" placeholder="Recipient Address 0x..." className="w-full bg-brand-card border border-brand-border text-white p-4 mb-4 mono text-xs outline-none focus:border-brand-accent transition-colors" />
            <input type="number" placeholder="Amount (SHM)" className="w-full bg-brand-card border border-brand-border text-white p-4 mb-6 mono text-xs outline-none focus:border-brand-accent transition-colors" />
            <button onClick={() => { alert('Transaction initiated via wallet provider'); setShowWithdraw(false); }} className="w-full bg-brand-card border border-brand-border text-brand-muted font-black uppercase tracking-[0.2em] py-4 hover:border-brand-accent hover:text-brand-accent transition-all">
              Submit Transfer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
