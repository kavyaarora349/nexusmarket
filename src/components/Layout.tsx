import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { WalletConnect } from './WalletConnect';
import { LayoutGrid, PlusSquare, User, Activity, Zap, Layers, Users, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from './AuthModal';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { user, setAuthModalView, setAuthModalOpen, signOut } = useAuth();

  const navItems = [
    { path: '/markets', label: 'Markets', icon: LayoutGrid },
    { path: '/parlay', label: 'Parlays', icon: Layers },
    { path: '/syndicates', label: 'Syndicates', icon: Users },
    { path: '/create', label: 'Create', icon: PlusSquare },
    { path: '/portfolio', label: 'Portfolio', icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      {/* Top Bar - Ticker Style */}
      <div className="bg-brand-accent text-black py-1 px-4 overflow-hidden whitespace-nowrap border-b border-black">
        <div className="flex items-center gap-8 animate-marquee font-mono text-[10px] font-bold uppercase tracking-widest">
          <span>SHM/USD: $0.85 (+2.4%)</span>
          <span>BTC/USD: $68,420 (-1.2%)</span>
          <span>ETH/USD: $3,540 (+0.8%)</span>
          <span>ACTIVE MARKETS: 542</span>
          <span>TOTAL VOLUME: 12.4M SHM</span>
          <span>SHARDEUM SPHINX 1.X LIVE</span>
          {/* Repeat for seamless loop */}
          <span>SHM/USD: $0.85 (+2.4%)</span>
          <span>BTC/USD: $68,420 (-1.2%)</span>
          <span>ETH/USD: $3,540 (+0.8%)</span>
        </div>
      </div>

      <header className="sticky top-0 z-40 bg-brand-bg border-b border-brand-border">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-accent flex items-center justify-center">
              <Zap className="text-black fill-black" size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight leading-none uppercase">NEXUSMARKET</span>
              <span className="text-[9px] text-brand-accent font-bold tracking-[0.2em] uppercase mono">Terminal v1.0</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 select-none ${location.pathname === item.path
                  ? 'text-brand-accent border-brand-accent bg-brand-accent/5'
                  : 'text-brand-muted border-transparent hover:text-white hover:bg-white/5'
                  }`}
              >
                <item.icon size={14} />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden xl:flex items-center gap-4 px-4 border-l border-brand-border h-full">
              <div className="flex flex-col items-end">
                <span className="text-[9px] text-brand-muted uppercase font-bold tracking-widest">Network</span>
                <span className="text-[10px] font-bold text-brand-yes flex items-center gap-1">
                  <Activity size={10} />
                  SPHINX 1.X
                </span>
              </div>
            </div>

            {/* Auth Controls */}
            {user ? (
              <div className="flex items-center gap-3 px-4 py-1.5 bg-brand-accent/5 border border-brand-accent/20 rounded text-brand-accent">
                <div className="w-6 h-6 rounded-full bg-brand-accent text-black flex items-center justify-center">
                  <User size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold leading-none">{user.email?.split('@')[0]}</span>
                  <span className="text-[9px] uppercase tracking-wider">Online</span>
                </div>
                <button
                  onClick={signOut}
                  className="ml-2 hover:text-white transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setAuthModalView('login'); setAuthModalOpen(true); }}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:text-brand-accent transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setAuthModalView('signup'); setAuthModalOpen(true); }}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-brand-accent text-black rounded hover:bg-brand-accent/90 transition-colors"
                >
                  Register
                </button>
              </div>
            )}

            <WalletConnect />
          </div>
        </div>
      </header>

      <AuthModal />

      <main className="flex-1 max-w-[1600px] mx-auto w-full px-6 py-6">
        {children}
      </main>

      <footer className="border-t border-brand-border py-8 bg-brand-card">
        <div className="max-w-[1600px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Zap className="text-brand-accent" size={16} />
              <span className="text-sm font-black tracking-tight uppercase">NEXUSMARKET</span>
            </div>
            <div className="h-4 w-px bg-brand-border" />
            <p className="text-brand-muted text-[10px] font-bold uppercase tracking-widest">
              Decentralized Prediction Protocol
            </p>
          </div>

          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-brand-muted">
            <a href="#" className="hover:text-brand-accent transition-colors">Docs</a>
            <a href="#" className="hover:text-brand-accent transition-colors">Github</a>
            <a href="#" className="hover:text-brand-accent transition-colors">Twitter</a>
            <a href="#" className="hover:text-brand-accent transition-colors">Discord</a>
          </div>

          <div className="text-brand-muted text-[9px] font-bold uppercase tracking-[0.2em]">
            &copy; 2026 NEXUSMARKET TERMINAL
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
};
