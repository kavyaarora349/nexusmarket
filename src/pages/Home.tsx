import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Zap, TrendingUp, Shield, Activity, Globe } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-accent/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-brand-accent/5 blur-[120px] rounded-full" />

      <div className="relative z-10 space-y-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3 text-brand-accent">
            <Zap size={24} className="fill-brand-accent" />
            <span className="text-sm font-black uppercase tracking-[0.4em] mono">Nexus Protocol v1.0</span>
          </div>

          <h1 className="text-7xl md:text-9xl font-black uppercase italic tracking-tighter leading-[0.85] text-white">
            TRADE THE <br />
            <span className="text-brand-accent">FUTURE.</span>
          </h1>

          <p className="text-brand-muted text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
            NexusMarket is the professional-grade prediction terminal for the Shardeum ecosystem.
            Hedge risk, speculate on events, and provide liquidity with zero-latency execution.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-4"
        >
          <Link to="/markets" className="btn-primary flex items-center gap-3 px-10 py-5 text-sm">
            Launch Terminal
            <ArrowRight size={18} />
          </Link>
          <Link to="/create" className="btn-secondary flex items-center gap-3 px-10 py-5 text-sm">
            Create Market
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-brand-border"
        >
          {[
            { label: 'Volume', value: '1.2M+', icon: TrendingUp },
            { label: 'Markets', value: '500+', icon: Activity },
            { label: 'Security', value: 'Audit', icon: Shield },
            { label: 'Network', value: 'Mezame', icon: Globe },
          ].map((stat) => (
            <div key={stat.label} className="space-y-1">
              <div className="flex items-center gap-2 text-brand-muted">
                <stat.icon size={12} />
                <span className="text-[10px] font-black uppercase tracking-widest">{stat.label}</span>
              </div>
              <div className="text-xl font-black mono text-white">{stat.value}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
