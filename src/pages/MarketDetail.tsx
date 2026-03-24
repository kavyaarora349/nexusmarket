import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ShieldCheck, Info, ExternalLink, Share2, Zap } from 'lucide-react';
import { useMarkets } from '../hooks/useMarkets';
import { OddsChart } from '../components/OddsChart';
import { BetPanel } from '../components/BetPanel';
import { CountdownTimer } from '../components/CountdownTimer';

export const MarketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { markets } = useMarkets();
  const market = markets.find(m => m.id === id);

  if (!market) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <h2 className="text-2xl font-bold">Market Not Found</h2>
        <Link to="/" className="text-brand-accent hover:underline">Return to Terminal</Link>
      </div>
    );
  }

  const totalPool = market.yesPool + market.noPool;

  return (
    <div className="space-y-8">
      <Link to="/" className="flex items-center gap-2 text-brand-muted hover:text-brand-accent transition-colors text-[10px] font-bold uppercase tracking-[0.2em]">
        <ArrowLeft size={14} />
        Back to Terminal
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Details & Chart */}
        <div className="lg:col-span-8 space-y-8">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-brand-accent">
                <Zap size={14} className="fill-brand-accent" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] mono">{market.category}</span>
              </div>
              <div className="h-3 w-px bg-brand-border" />
              <span className="text-brand-yes text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck size={12} />
                Oracle Verified
              </span>
              <div className="h-3 w-px bg-brand-border" />
              <span className="text-brand-muted text-[10px] font-bold mono uppercase">
                ID: {market.id}
              </span>
            </div>

            <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-tight">
              {market.title}
            </h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-brand-border border border-brand-border">
              <div className="bg-brand-card p-4">
                <span className="text-[9px] text-brand-muted uppercase font-bold tracking-widest block mb-1">Liquidity</span>
                <span className="mono text-lg font-bold text-brand-accent">{totalPool.toLocaleString()} SHM</span>
              </div>
              <div className="bg-brand-card p-4">
                <span className="text-[9px] text-brand-muted uppercase font-bold tracking-widest block mb-1">Volume 24H</span>
                <span className="mono text-lg font-bold text-white">{(totalPool * 0.15).toLocaleString()} SHM</span>
              </div>
              <div className="bg-brand-card p-4">
                <span className="text-[9px] text-brand-muted uppercase font-bold tracking-widest block mb-1">Participants</span>
                <span className="mono text-lg font-bold text-white">{market.participants}</span>
              </div>
              <div className="bg-brand-card p-4">
                <span className="text-[9px] text-brand-muted uppercase font-bold tracking-widest block mb-1">Resolution</span>
                <span className="mono text-lg font-bold text-white">
                  {new Date(market.endDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            <p className="text-brand-muted text-sm leading-relaxed border-l-2 border-brand-accent pl-4">
              {market.description}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-brand-border pb-2">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand-muted">Price Chart: YES/NO Odds</h3>
              <div className="flex items-center gap-4 text-[10px] font-bold mono uppercase">
                <span className="text-brand-yes flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-yes" /> YES
                </span>
                <span className="text-brand-no flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-no" /> NO
                </span>
              </div>
            </div>
            <OddsChart />
          </div>

          <div className="bg-brand-card border border-brand-border p-6 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand-accent">Protocol Rules</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-1 h-1 bg-brand-accent mt-1.5 shrink-0" />
                  <p className="text-[11px] text-brand-muted leading-relaxed uppercase font-bold">
                    Resolution via Shardeum Oracle Protocol v2.1.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1 h-1 bg-brand-accent mt-1.5 shrink-0" />
                  <p className="text-[11px] text-brand-muted leading-relaxed uppercase font-bold">
                    Dispute window: 24 hours post-resolution.
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-1 h-1 bg-brand-accent mt-1.5 shrink-0" />
                  <p className="text-[11px] text-brand-muted leading-relaxed uppercase font-bold">
                    Protocol fee: 0.5% on winning claims.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1 h-1 bg-brand-accent mt-1.5 shrink-0" />
                  <p className="text-[11px] text-brand-muted leading-relaxed uppercase font-bold">
                    Creator: <span className="text-white mono">{market.creator}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Betting & Countdown */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-brand-card border border-brand-border p-6 space-y-4">
            <span className="text-[9px] text-brand-muted uppercase font-bold tracking-widest block">Market Expiration</span>
            <CountdownTimer targetDate={market.endDate} />
          </div>

          <BetPanel marketId={market.id} />

          <div className="grid grid-cols-2 gap-px bg-brand-border border border-brand-border">
            <button className="bg-brand-card hover:bg-white/5 py-4 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
              <Share2 size={14} />
              Share
            </button>
            <button className="bg-brand-card hover:bg-white/5 py-4 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
              <ExternalLink size={14} />
              Explorer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
