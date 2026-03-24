import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Info, Clock, CheckCircle2, XCircle, AlertTriangle, Zap, ExternalLink } from 'lucide-react';

export const Resolve: React.FC = () => {
  const [voted, setVoted] = useState(false);

  const pendingMarket = {
    id: '1',
    title: 'Will SHM reach $10 by end of 2026?',
    description: 'Prediction on Shardeum native token price.',
    evidence: 'https://coinmarketcap.com/currencies/shardeum/',
    yesVotes: 150000,
    noVotes: 50000,
    endsIn: Date.now() + 3600000 * 5,
  };

  const totalVotes = pendingMarket.yesVotes + pendingMarket.noVotes;
  const yesPercent = (pendingMarket.yesVotes / totalVotes) * 100;
  const noPercent = 100 - yesPercent;

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-brand-accent">
          <ShieldCheck size={16} />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Consensus Protocol</span>
        </div>
        <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-tight">
          Resolution Center
        </h1>
        <p className="text-brand-muted text-[10px] font-bold uppercase tracking-widest">
          Participate in decentralized oracle consensus and earn protocol reputation.
        </p>
      </div>

      <div className="bg-brand-card border border-brand-border flex flex-col">
        <div className="border-b border-brand-border p-6 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-3">
            <Zap className="text-brand-accent fill-brand-accent" size={18} />
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Pending Resolution Task</h3>
          </div>
          <div className="flex items-center gap-2 text-brand-accent mono text-xs font-bold uppercase tracking-widest">
            <Clock size={14} />
            Ends in 04:59:21
          </div>
        </div>

        <div className="p-8 space-y-10">
          <div className="space-y-4">
            <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-tight tracking-tight">{pendingMarket.title}</h2>
            <p className="text-brand-muted text-sm font-bold uppercase tracking-widest leading-relaxed">{pendingMarket.description}</p>
            <a 
              href={pendingMarket.evidence} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-brand-accent hover:underline text-[10px] font-black uppercase tracking-[0.2em]"
            >
              <ExternalLink size={14} />
              Verify Evidence Source
            </a>
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em]">
                <span className="text-brand-yes">YES Consensus ({yesPercent.toFixed(1)}%)</span>
                <span className="text-brand-no">NO Consensus ({noPercent.toFixed(1)}%)</span>
              </div>
              <div className="h-2 w-full bg-brand-bg flex border border-brand-border">
                <div className="h-full bg-brand-yes transition-all" style={{ width: `${yesPercent}%` }} />
                <div className="h-full bg-brand-no transition-all" style={{ width: `${noPercent}%` }} />
              </div>
              <div className="flex justify-between mono text-[9px] text-brand-muted font-bold uppercase tracking-widest">
                <span>{pendingMarket.yesVotes.toLocaleString()} SHM Staked</span>
                <span>{pendingMarket.noVotes.toLocaleString()} SHM Staked</span>
              </div>
            </div>

            {voted ? (
              <div className="bg-brand-yes/10 border border-brand-yes p-8 text-center space-y-4">
                <CheckCircle2 className="text-brand-yes mx-auto" size={40} />
                <div className="space-y-2">
                  <h4 className="text-xl font-black italic uppercase tracking-tighter text-brand-yes">Consensus Submitted</h4>
                  <p className="text-[10px] text-brand-muted font-bold uppercase tracking-widest leading-relaxed">
                    Your vote has been recorded on the Shardeum network. Rewards will be claimable after the 24h dispute window closes.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-brand-border border border-brand-border">
                <button
                  onClick={() => setVoted(true)}
                  className="group relative bg-brand-card hover:bg-brand-yes p-10 transition-all text-center space-y-4"
                >
                  <CheckCircle2 className="text-brand-yes group-hover:text-black mx-auto transition-colors" size={48} />
                  <div className="space-y-1">
                    <span className="block text-2xl font-black text-brand-yes group-hover:text-black uppercase italic tracking-tighter transition-colors">Resolve YES</span>
                    <p className="text-[9px] text-brand-muted group-hover:text-black/70 font-bold uppercase tracking-widest transition-colors">Outcome verified as positive</p>
                  </div>
                </button>
                <button
                  onClick={() => setVoted(true)}
                  className="group relative bg-brand-card hover:bg-brand-no p-10 transition-all text-center space-y-4"
                >
                  <XCircle className="text-brand-no group-hover:text-white mx-auto transition-colors" size={48} />
                  <div className="space-y-1">
                    <span className="block text-2xl font-black text-brand-no group-hover:text-white uppercase italic tracking-tighter transition-colors">Resolve NO</span>
                    <p className="text-[9px] text-brand-muted group-hover:text-white/70 font-bold uppercase tracking-widest transition-colors">Outcome verified as negative</p>
                  </div>
                </button>
              </div>
            )}
          </div>

          <div className="bg-brand-bg border border-brand-border p-6 flex items-start gap-4">
            <AlertTriangle className="text-brand-no shrink-0 mt-1" size={20} />
            <div className="space-y-1">
              <h4 className="text-brand-no font-black uppercase text-[10px] tracking-[0.2em]">Protocol Integrity Warning</h4>
              <p className="text-[11px] text-brand-muted leading-relaxed font-bold uppercase">
                Submitting a false resolution vote may result in the loss of your reputation stake. Please verify the evidence link before voting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
