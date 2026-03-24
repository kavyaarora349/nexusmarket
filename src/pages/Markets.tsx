import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  ChevronRight, 
  TrendingUp, 
  Users, 
  Activity, 
  CheckCircle2, 
  Globe, 
  Zap, 
  LayoutGrid, 
  List, 
  Filter, 
  ArrowUpDown,
  Clock,
  Coins,
  AlertCircle
} from 'lucide-react';
import { useMarkets, Market } from '../hooks/useMarkets';
import { MarketCard } from '../components/MarketCard';

export const Markets: React.FC = () => {
  const { markets, loading } = useMarkets();
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'volume' | 'newest' | 'ending'>('volume');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const stats = [
    { label: 'Total Volume', value: '1,245,000 SHM', icon: TrendingUp, color: 'text-brand-accent' },
    { label: 'Active Markets', value: '542', icon: Activity, color: 'text-brand-yes' },
    { label: 'Participants', value: '8,902', icon: Users, color: 'text-white' },
    { label: 'Resolved', value: '1,156', icon: CheckCircle2, color: 'text-brand-muted' },
  ];

  const categories = [
    { name: 'All', icon: LayoutGrid },
    { name: 'Crypto', icon: Coins },
    { name: 'Politics', icon: Globe },
    { name: 'Sports', icon: Activity },
    { name: 'Tech', icon: Zap },
    { name: 'Custom', icon: Filter },
  ];

  const filteredAndSortedMarkets = useMemo(() => {
    let result = [...markets];

    // Category Filter
    if (filter !== 'All') {
      result = result.filter(m => m.category === filter);
    }

    // Search Query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(m => 
        m.title.toLowerCase().includes(query) || 
        m.category.toLowerCase().includes(query)
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'volume') {
        return (b.yesPool + b.noPool) - (a.yesPool + a.noPool);
      }
      if (sortBy === 'newest') {
        return b.id - a.id; // Assuming higher ID is newer
      }
      if (sortBy === 'ending') {
        return a.endDate - b.endDate;
      }
      return 0;
    });

    return result;
  }, [markets, filter, searchQuery, sortBy]);

  return (
    <div className="space-y-10">
      {/* Terminal Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-brand-border pb-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-brand-accent">
            <Zap size={20} className="fill-brand-accent animate-pulse" />
            <span className="text-xs font-black uppercase tracking-[0.3em] mono">Live Protocol Feed</span>
          </div>
          <h1 className="text-6xl font-black uppercase italic tracking-tighter leading-none">
            Nexus <br /> <span className="text-brand-accent">Terminal</span>
          </h1>
          <p className="text-brand-muted text-sm font-medium max-w-md leading-relaxed">
            Professional-grade decentralized prediction markets. Trade on the future of the Shardeum ecosystem with zero-latency execution.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
          {stats.slice(0, 2).map((stat) => (
            <motion.div 
              key={stat.label} 
              whileHover={{ scale: 1.02 }}
              className="bg-brand-card border border-brand-border p-4 min-w-[200px] group cursor-default"
            >
              <span className="text-[9px] text-brand-muted uppercase font-bold tracking-widest block mb-1 group-hover:text-brand-accent transition-colors">{stat.label}</span>
              <div className="flex items-center justify-between">
                <span className="mono text-xl font-bold">{stat.value}</span>
                <stat.icon size={16} className={`${stat.color} group-hover:scale-110 transition-transform`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Market Controls */}
      <div className="flex flex-col xl:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="xl:w-72 shrink-0 space-y-8">
          <div className="space-y-3">
            <span className="text-[10px] text-brand-muted uppercase font-black tracking-widest flex items-center gap-2">
              <Filter size={12} />
              Categories
            </span>
            <div className="flex flex-wrap xl:flex-col gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setFilter(cat.name)}
                  className={`flex items-center justify-between px-4 py-3 text-[11px] font-bold uppercase tracking-wider transition-all border group ${
                    filter === cat.name
                      ? 'bg-brand-accent text-black border-brand-accent'
                      : 'bg-transparent text-brand-muted border-brand-border hover:border-brand-accent/50 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <cat.icon size={14} className={filter === cat.name ? 'text-black' : 'text-brand-muted group-hover:text-brand-accent'} />
                    {cat.name}
                  </div>
                  <ChevronRight size={12} className={filter === cat.name ? 'text-black' : 'text-brand-border'} />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] text-brand-muted uppercase font-black tracking-widest flex items-center gap-2">
              <Search size={12} />
              Search Terminal
            </span>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted group-focus-within:text-brand-accent transition-colors" size={14} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ticker or Event..."
                className="input-terminal w-full pl-9 text-[11px] h-11"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-white text-[10px] font-bold"
                >
                  CLEAR
                </button>
              )}
            </div>
          </div>

          <div className="p-5 border border-brand-border bg-brand-accent/5 space-y-4 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-brand-accent opacity-50" />
            <div className="flex items-center gap-2 text-brand-accent">
              <Globe size={14} className="animate-spin-slow" />
              <span className="text-[10px] font-black uppercase tracking-widest">Network Status</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[9px] font-bold uppercase">
                <span className="text-brand-muted">Block Height</span>
                <span className="mono text-white">#1,245,892</span>
              </div>
              <div className="flex justify-between text-[9px] font-bold uppercase">
                <span className="text-brand-muted">TPS</span>
                <span className="mono text-brand-yes">124.5</span>
              </div>
              <div className="flex justify-between text-[9px] font-bold uppercase">
                <span className="text-brand-muted">Gas Price</span>
                <span className="mono text-brand-accent">0.0001 SHM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Market Grid */}
        <div className="flex-1 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border pb-4">
            <div className="flex items-center gap-4">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand-muted">
                Active Orderbook: <span className="text-white">{filter}</span>
              </h3>
              {filteredAndSortedMarkets.length > 0 && (
                <span className="text-[10px] font-bold mono bg-brand-accent/10 text-brand-accent px-2 py-0.5 border border-brand-accent/20">
                  {filteredAndSortedMarkets.length} RESULTS
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <ArrowUpDown size={12} className="text-brand-muted" />
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-[10px] font-bold uppercase tracking-widest text-white outline-none cursor-pointer hover:text-brand-accent transition-colors"
                >
                  <option value="volume" className="bg-brand-card">Sort: Volume</option>
                  <option value="newest" className="bg-brand-card">Sort: Newest</option>
                  <option value="ending" className="bg-brand-card">Sort: Ending Soon</option>
                </select>
              </div>

              <div className="w-px h-4 bg-brand-border hidden sm:block" />

              <div className="flex items-center gap-1 bg-brand-card border border-brand-border p-1">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 transition-all ${viewMode === 'grid' ? 'bg-brand-accent text-black' : 'text-brand-muted hover:text-white'}`}
                >
                  <LayoutGrid size={14} />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 transition-all ${viewMode === 'list' ? 'bg-brand-accent text-black' : 'text-brand-muted hover:text-white'}`}
                >
                  <List size={14} />
                </button>
              </div>
            </div>
          </div>

          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-px bg-brand-border border border-brand-border"
              : "flex flex-col gap-px bg-brand-border border border-brand-border"
          }>
            <AnimatePresence mode="popLayout">
              {loading ? (
                Array(6).fill(0).map((_, i) => (
                  <div key={i} className="h-[280px] bg-brand-card animate-pulse" />
                ))
              ) : filteredAndSortedMarkets.length > 0 ? (
                filteredAndSortedMarkets.map((market) => (
                  <motion.div
                    key={market.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MarketCard market={market} viewMode={viewMode} />
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full py-20 bg-brand-card flex flex-col items-center justify-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-brand-border flex items-center justify-center">
                    <AlertCircle size={32} className="text-brand-muted" />
                  </div>
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-white uppercase tracking-tighter">No Markets Found</h4>
                    <p className="text-brand-muted text-[10px] font-bold uppercase tracking-widest">Try adjusting your filters or search query</p>
                  </div>
                  <button 
                    onClick={() => { setFilter('All'); setSearchQuery(''); }}
                    className="btn-secondary py-2 px-4"
                  >
                    Reset Filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style>{`
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
