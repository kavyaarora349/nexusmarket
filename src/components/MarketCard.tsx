import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Clock, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Market } from '../hooks/useMarkets';

export const MarketCard: React.FC<{ market: Market; viewMode?: 'grid' | 'list' }> = ({ market, viewMode = 'grid' }) => {
  const totalPool = market.yesPool + market.noPool;
  const yesPercent = totalPool > 0 ? (market.yesPool / totalPool) * 100 : 50;
  const noPercent = 100 - yesPercent;

  const [timeLeft, setTimeLeft] = React.useState('');

  React.useEffect(() => {
    const update = () => {
      const diff = market.endDate - Date.now();
      if (diff <= 0) {
        setTimeLeft('EXPIRED');
        return;
      }
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      
      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h`);
      } else {
        setTimeLeft(`${hours}h ${mins}m ${secs}s`);
      }
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [market.endDate]);

  if (viewMode === 'list') {
    return (
      <div className="bg-brand-card hover:bg-white/5 transition-colors flex items-center p-4 gap-6 group relative">
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-brand-accent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="w-24 shrink-0">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-accent mono block mb-1">
            {market.category}
          </span>
          <div className="flex items-center gap-1 text-brand-muted text-[10px] font-bold mono">
            <Users size={10} />
            {market.participants}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <Link to={`/market/${market.id}`} className="text-sm font-bold hover:text-brand-accent transition-colors truncate block">
            {market.title}
          </Link>
        </div>

        <div className="w-48 shrink-0 flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-brand-border flex overflow-hidden rounded-full">
            <div className="h-full bg-brand-yes" style={{ width: `${yesPercent}%` }} />
            <div className="h-full bg-brand-no" style={{ width: `${noPercent}%` }} />
          </div>
          <div className="flex gap-3 mono text-[11px] font-black w-20">
            <span className="text-brand-yes">{yesPercent.toFixed(0)}%</span>
            <span className="text-brand-no">{noPercent.toFixed(0)}%</span>
          </div>
        </div>

        <div className="w-32 shrink-0 text-right">
          <span className="text-[9px] text-brand-muted uppercase font-bold tracking-widest block">Liquidity</span>
          <span className="mono font-bold text-xs text-white">{totalPool.toLocaleString()} SHM</span>
        </div>

        <div className="w-32 shrink-0 text-right">
          <span className="text-[9px] text-brand-muted uppercase font-bold tracking-widest block">Time Left</span>
          <span className="mono font-bold text-xs text-brand-accent">{timeLeft}</span>
        </div>

        <Link
          to={`/market/${market.id}`}
          className="p-2 text-brand-muted hover:text-brand-accent transition-colors"
        >
          <ArrowUpRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-brand-card border border-brand-border h-full flex flex-col group relative overflow-hidden">
      {/* Accent Bar */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-brand-border group-hover:bg-brand-accent transition-colors" />

      <div className="p-5 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-accent mono">
            {market.category}
          </span>
          <div className="flex items-center gap-1 text-brand-muted text-[10px] font-bold mono">
            <Users size={10} />
            {market.participants}
          </div>
        </div>

        <h3 className="text-base font-bold leading-snug min-h-[3rem]">
          {market.title}
        </h3>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-px bg-brand-border border border-brand-border overflow-hidden">
            <div className="bg-brand-bg/50 p-3 flex flex-col items-center justify-center">
              <span className="text-[9px] font-black uppercase tracking-widest text-brand-yes mb-1">YES</span>
              <span className="text-2xl font-black mono tracking-tighter text-white">{yesPercent.toFixed(0)}%</span>
            </div>
            <div className="bg-brand-bg/50 p-3 flex flex-col items-center justify-center">
              <span className="text-[9px] font-black uppercase tracking-widest text-brand-no mb-1">NO</span>
              <span className="text-2xl font-black mono tracking-tighter text-white">{noPercent.toFixed(0)}%</span>
            </div>
          </div>
          <div className="h-1 w-full bg-brand-border flex">
            <div className="h-full bg-brand-yes transition-all duration-500" style={{ width: `${yesPercent}%` }} />
            <div className="h-full bg-brand-no transition-all duration-500" style={{ width: `${noPercent}%` }} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-brand-border">
          <div className="flex flex-col">
            <span className="text-[9px] text-brand-muted uppercase font-bold tracking-widest">Liquidity</span>
            <span className="mono font-bold text-xs text-white">{totalPool.toLocaleString()} SHM</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[9px] text-brand-muted uppercase font-bold tracking-widest">Time Left</span>
            <div className="flex items-center gap-1 text-xs mono font-bold text-brand-accent">
              <Clock size={10} className="animate-pulse" />
              {timeLeft}
            </div>
          </div>
        </div>
      </div>

      <Link
        to={`/market/${market.id}`}
        className="w-full bg-brand-border hover:bg-brand-accent text-white hover:text-black py-3 font-bold text-[10px] uppercase tracking-[0.2em] transition-all text-center flex items-center justify-center gap-2 border-t border-brand-border"
      >
        Trade Market
        <ArrowUpRight size={12} />
      </Link>
    </div>
  );
};
