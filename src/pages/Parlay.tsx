import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Layers, Search, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useAccount } from '../context/AccountContext';
import { useMarkets } from '../hooks/useMarkets';

export const Parlay: React.FC = () => {
    const { isConnected, connect, signer, fetchBalance } = useWallet();
    const { balance, recordBet } = useAccount();
    const { markets, loading } = useMarkets();
    const [selectedLegs, setSelectedLegs] = useState<string[]>([]);
    const [amount, setAmount] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const availableMarkets = markets
        .filter((market) => market.status === 'Open')
        .filter((market) => market.id !== 'c10')
        .filter((market) => {
            if (!searchQuery.trim()) return true;
            const query = searchQuery.toLowerCase();
            return market.title.toLowerCase().includes(query) || market.category.toLowerCase().includes(query);
        })
        .map((market) => {
            const totalPool = market.yesPool + market.noPool;
            const yesProbability = totalPool > 0 ? market.yesPool / totalPool : 0.5;
            const normalizedProbability = Math.min(0.95, Math.max(0.05, yesProbability));
            const multiplier = 1 / normalizedProbability;

            return {
                id: market.id,
                title: market.title,
                category: market.category,
                odds: normalizedProbability,
                multiplier,
            };
        });

    const toggleLeg = (id: string) => {
        if (selectedLegs.includes(id)) {
            setSelectedLegs(selectedLegs.filter(l => l !== id));
        } else {
            setSelectedLegs([...selectedLegs, id]);
        }
    };

    const calculateParlayMultiplier = () => {
        if (selectedLegs.length === 0) return 1;
        return selectedLegs.reduce((acc, currId) => {
            const market = availableMarkets.find(m => m.id === currId);
            return acc * (market?.multiplier || 1);
        }, 1);
    };

    const multiplierNum = calculateParlayMultiplier();
    const estPayoutNum = (amount && !isNaN(parseFloat(amount)))
        ? (parseFloat(amount) * multiplierNum)
        : 0;

    const parsedAmount = parseFloat(amount);
    const isAmountValid = !isNaN(parsedAmount) && parsedAmount > 0;

    const setAmountByPercent = (percent: number) => {
        if (!balance || balance <= 0) {
            setAmount('');
            return;
        }

        setAmount((balance * percent).toFixed(4));
    };

    const handleParlay = async () => {
        if (!isConnected || !signer) {
            await connect();
            return;
        }

        setError(null);
        setSuccess(false);

        if (selectedLegs.length < 2) {
            setError('Select at least 2 legs');
            return;
        }

        if (!isAmountValid) {
            setError('Enter a valid SHM amount');
            return;
        }

        if (parsedAmount > balance) {
            setError('Insufficient SHM Balance');
            return;
        }

        setIsLoading(true);

        try {
            const protocolAddress = "0x000000000000000000000000000000000000dEaD";
            const tx = await signer.sendTransaction({
                to: protocolAddress,
                value: ethers.parseEther(parsedAmount.toString())
            });

            await tx.wait();
            await recordBet({
                type: 'parlay',
                market: `Parlay Ticket (${selectedLegs.length} legs)`,
                side: 'PARLAY',
                amount: parsedAmount,
                payout: estPayoutNum,
                txHash: tx.hash,
                details: selectedMarketTitles,
            });
            await fetchBalance();
            setSuccess(true);
            setAmount('');
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            console.error("Parlay transaction failed:", err);
            const msg = err?.info?.error?.message || err?.message || 'Transaction failed or rejected';
            setError(msg.length > 50 ? msg.substring(0, 50) + "..." : msg);
        } finally {
            setIsLoading(false);
        }
    };

    const selectedMarketTitles = availableMarkets
        .filter((market) => selectedLegs.includes(market.id))
        .map((market) => market.title)
        .join(' | ');

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-brand-accent">
                    <Layers size={16} />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Combinatorial Markets</span>
                </div>
                <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-tight">
                    Parlay Engine
                </h1>
                <p className="text-brand-muted text-sm font-bold uppercase tracking-widest">
                    Combine independent predictions for exponential payouts. Multiplicative risk.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-4">
                    <div className="flex flex-col gap-3">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand-muted">Select Legs</h3>
                        <div className="relative max-w-md">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search live markets..."
                                className="w-full bg-brand-bg border border-brand-border py-3 pl-9 pr-4 text-xs uppercase tracking-wider outline-none focus:border-brand-accent transition-colors"
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        {loading ? (
                            <div className="bg-brand-card border border-brand-border p-6 text-brand-muted text-xs font-bold uppercase tracking-widest">
                                Loading markets...
                            </div>
                        ) : availableMarkets.length === 0 ? (
                            <div className="bg-brand-card border border-brand-border p-6 text-brand-muted text-xs font-bold uppercase tracking-widest">
                                No live markets match your search.
                            </div>
                        ) : availableMarkets.map(market => {
                            const isSelected = selectedLegs.includes(market.id);
                            return (
                                <div
                                    key={market.id}
                                    onClick={() => toggleLeg(market.id)}
                                    className={`bg-brand-card border p-6 cursor-pointer transition-all flex items-center justify-between group ${isSelected
                                            ? 'border-brand-accent shadow-[0_0_15px_rgba(255,209,102,0.1)]'
                                            : 'border-brand-border hover:border-brand-muted'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-5 h-5 flex items-center justify-center border transition-all ${isSelected ? 'bg-brand-accent border-brand-accent text-black' : 'border-brand-muted group-hover:bg-white/10'
                                            }`}>
                                            {isSelected && <span className="text-[10px] font-black">✓</span>}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm uppercase tracking-widest">{market.title}</h4>
                                            <span className="text-[10px] text-brand-muted uppercase font-bold mono mt-1 block">
                                                {market.category} | Implied Probability: {(market.odds * 100).toFixed(0)}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-brand-accent font-black mono text-xl">{market.multiplier}x</span>
                                        <span className="text-[9px] text-brand-muted uppercase font-bold tracking-widest">Multiplier</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-brand-card border border-brand-border flex flex-col sticky top-24">
                        <div className="p-4 border-b border-brand-border flex items-center justify-between bg-brand-accent/5">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-accent">Parlay Ticket</h3>
                            <span className="text-[10px] bg-brand-accent text-black px-2 py-0.5 font-black mono">{selectedLegs.length} LEGS</span>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between items-end border-b border-brand-border pb-2">
                                    <span className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">Total Multiplier</span>
                                    <span className="text-2xl font-black text-white mono">{multiplierNum.toFixed(2)}x</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <label className="text-[9px] font-bold text-brand-muted uppercase tracking-widest">Bet Size</label>
                                    <span className="text-[9px] font-bold text-brand-accent uppercase tracking-widest mono">Balance: {balance.toLocaleString()} SHM</span>
                                </div>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => {
                                            setAmount(e.target.value);
                                            setError(null);
                                        }}
                                        placeholder="0.00"
                                        className="w-full bg-brand-bg border border-brand-border rounded-none py-4 px-4 mono text-xl focus:outline-none focus:border-brand-accent transition-colors"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted font-bold text-xs mono">SHM</div>
                                </div>
                                <div className="grid grid-cols-4 gap-1">
                                    <button onClick={() => setAmountByPercent(0.25)} className="bg-brand-bg border border-brand-border py-1 text-[9px] font-bold text-brand-muted hover:border-brand-accent hover:text-white transition-all">25%</button>
                                    <button onClick={() => setAmountByPercent(0.5)} className="bg-brand-bg border border-brand-border py-1 text-[9px] font-bold text-brand-muted hover:border-brand-accent hover:text-white transition-all">50%</button>
                                    <button onClick={() => setAmountByPercent(0.75)} className="bg-brand-bg border border-brand-border py-1 text-[9px] font-bold text-brand-muted hover:border-brand-accent hover:text-white transition-all">75%</button>
                                    <button onClick={() => setAmountByPercent(1)} className="bg-brand-bg border border-brand-border py-1 text-[9px] font-bold text-brand-muted hover:border-brand-accent hover:text-white transition-all">MAX</button>
                                </div>
                            </div>

                            <div className="bg-brand-bg border border-brand-border p-4 space-y-3">
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                                    <span className="text-brand-muted">Est. Payout</span>
                                    <span className="mono text-brand-yes text-sm">{estPayoutNum.toFixed(2)} SHM</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                                    <span className="text-brand-muted">Selected Legs</span>
                                    <span className="mono text-white">{selectedLegs.length}</span>
                                </div>
                            </div>

                            {selectedMarketTitles && (
                                <div className="bg-brand-bg border border-brand-border p-4 text-[10px] font-bold uppercase tracking-widest text-brand-muted leading-relaxed">
                                    {selectedMarketTitles}
                                </div>
                            )}

                            <div className="flex flex-col gap-2">
                                {error && (
                                    <div className="bg-brand-no/10 border border-brand-no/20 p-3 flex items-center gap-2 text-brand-no text-[10px] font-bold uppercase tracking-widest">
                                        <AlertCircle size={14} />
                                        {error}
                                    </div>
                                )}
                                {success && (
                                    <div className="bg-brand-yes/10 border border-brand-yes/20 p-3 flex items-center gap-2 text-brand-yes text-[10px] font-bold uppercase tracking-widest">
                                        <CheckCircle2 size={14} />
                                        Parlay Locked Successfully!
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleParlay}
                                disabled={isLoading || (isConnected && !isAmountValid) || selectedLegs.length < 2}
                                className={`w-full py-4 font-bold text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-2 ${isLoading || (isConnected && !isAmountValid) || selectedLegs.length < 2
                                        ? 'bg-brand-border text-brand-muted cursor-not-allowed'
                                        : 'bg-brand-accent hover:bg-brand-accent-hover text-black'
                                    }`}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Confirming in Wallet...
                                    </>
                                ) : !isConnected ? 'Connect Wallet' : selectedLegs.length < 2 ? 'Select >1 Leg' : 'Lock Ticket'}
                            </button>

                            <div className="flex items-start gap-2 p-3 bg-brand-no/10 border border-brand-no/20 text-brand-yes">
                                <p className="text-[9px] uppercase font-bold leading-relaxed">
                                    All selected legs must resolve to 'YES' for this ticket to payout. Partial successes result in a total loss of principal.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
