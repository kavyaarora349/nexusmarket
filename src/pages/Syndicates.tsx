import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Users, TrendingUp, ShieldCheck, Activity, ArrowRight, Wallet } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useAccount } from '../context/AccountContext';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export const Syndicates: React.FC = () => {
    const { isConnected, connect, signer, fetchBalance } = useWallet();
    const { balance, recordBet } = useAccount();
    const [selectedSyndicate, setSelectedSyndicate] = useState<number | null>(null);
    const [amount, setAmount] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const syndicates = [
        { id: 1, name: 'Alpha Quant Fund', trader: '0x8fC...4a1B', winRate: '78.4%', aum: '142,500 SHM', fee: '5%', tags: ['Crypto', 'Macro'] },
        { id: 2, name: 'Nexus Whales', trader: '0x32A...9c9D', winRate: '64.2%', aum: '88,200 SHM', fee: '2.5%', tags: ['Politics', 'Tech'] },
        { id: 3, name: 'Degen Spartan', trader: '0x99B...1f2E', winRate: '51.1%', aum: '12,100 SHM', fee: '0%', tags: ['High Risk', 'Sports'] },
    ];

    const parsedAmount = parseFloat(amount);
    const isAmountValid = !isNaN(parsedAmount) && parsedAmount > 0;

    const setAmountByPercent = (percent: number) => {
        if (!balance || balance <= 0) {
            setAmount('');
            return;
        }

        setAmount((balance * percent).toFixed(4));
    };

    const handleDeposit = async () => {
        if (!isConnected || !signer) {
            await connect();
            return;
        }

        setError(null);
        setSuccess(false);

        if (!selectedSyndicate) {
            setError('Select a syndicate first');
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
            const selectedFund = syndicates.find((fund) => fund.id === selectedSyndicate);
            const protocolAddress = "0x000000000000000000000000000000000000dEaD";
            const tx = await signer.sendTransaction({
                to: protocolAddress,
                value: ethers.parseEther(parsedAmount.toString())
            });

            await tx.wait();
            await recordBet({
                type: 'syndicate',
                market: selectedFund?.name || 'Syndicate Allocation',
                side: 'ALLOCATE',
                amount: parsedAmount,
                payout: parsedAmount,
                txHash: tx.hash,
                details: selectedFund ? `${selectedFund.trader} | Fee ${selectedFund.fee}` : null,
            });
            await fetchBalance();
            setSuccess(true);
            setAmount('');
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            console.error("Syndicate deposit failed:", err);
            const msg = err?.info?.error?.message || err?.message || 'Transaction failed or rejected';
            setError(msg.length > 50 ? msg.substring(0, 50) + "..." : msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-brand-accent">
                    <Users size={16} />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Copy-Trading Protocol</span>
                </div>
                <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-tight">
                    Smart Syndicates
                </h1>
                <p className="text-brand-muted text-sm font-bold uppercase tracking-widest max-w-2xl">
                    Deposit SHM into managed smart contracts. Automatically mirror the bets of top-tier predictors on autopilot.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Explorer */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center justify-between border-b border-brand-border pb-2">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand-muted">Active Syndicates</h3>
                        <span className="text-[10px] bg-brand-accent text-black px-2 py-0.5 font-black uppercase tracking-widest">
                            Live on Sphinx
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {syndicates.map(fund => (
                            <div
                                key={fund.id}
                                onClick={() => setSelectedSyndicate(fund.id)}
                                className={`bg-brand-card border p-6 cursor-pointer transition-all group ${selectedSyndicate === fund.id
                                        ? 'border-brand-accent shadow-[0_0_15px_rgba(255,209,102,0.1)]'
                                        : 'border-brand-border hover:border-brand-muted'
                                    }`}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <h4 className="font-black text-xl italic uppercase tracking-widest">{fund.name}</h4>
                                            {fund.id === 1 && (
                                                <div className="flex items-center gap-1 bg-brand-yes/10 text-brand-yes px-2 py-0.5 border border-brand-yes/20">
                                                    <ShieldCheck size={10} />
                                                    <span className="text-[8px] font-black uppercase tracking-widest">Audited</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest mono text-brand-muted">
                                            <span>Manager: {fund.trader}</span>
                                            <span>•</span>
                                            <span>Fee: {fund.fee}</span>
                                        </div>
                                        <div className="flex gap-2 pt-2">
                                            {fund.tags.map(tag => (
                                                <span key={tag} className="text-[8px] border border-brand-border px-2 py-0.5 text-brand-muted uppercase font-black">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex sm:flex-col gap-4 sm:gap-1 sm:text-right border-t sm:border-t-0 border-brand-border pt-4 sm:pt-0 mt-4 sm:mt-0">
                                        <div>
                                            <span className="block text-brand-yes font-black mono text-2xl">{fund.winRate}</span>
                                            <span className="text-[9px] text-brand-muted uppercase font-bold tracking-widest flex sm:justify-end items-center gap-1">
                                                <TrendingUp size={10} /> Win Rate
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-white font-bold mono text-sm">{fund.aum}</span>
                                            <span className="text-[8px] text-brand-muted uppercase font-bold tracking-widest">
                                                Assets Under Management
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Deposit Panel */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-brand-card border border-brand-border flex flex-col sticky top-24">
                        <div className="p-4 border-b border-brand-border flex items-center justify-between bg-brand-accent/5">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-accent">Deposit to Syndicate</h3>
                            <Wallet size={14} className="text-brand-accent" />
                        </div>

                        {selectedSyndicate ? (
                            <div className="p-6 space-y-6">
                                <div className="space-y-2 border-b border-brand-border pb-4">
                                    <h4 className="font-black italic uppercase text-lg">
                                        {syndicates.find(s => s.id === selectedSyndicate)?.name}
                                    </h4>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">
                                        Smart contract will mirror trader's positions automatically.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <label className="text-[9px] font-bold text-brand-muted uppercase tracking-widest">Allocation Size</label>
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
                                        min="0"
                                        className="w-full bg-brand-bg border border-brand-border rounded-none py-4 px-4 mono text-xl focus:outline-none focus:border-brand-accent transition-colors"
                                    />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted font-bold text-xs mono">SHM</div>
                                    </div>
                                    <div className="flex gap-1 pt-1">
                                        <button onClick={() => setAmountByPercent(0.25)} className="flex-1 bg-brand-bg border border-brand-border py-2 text-[9px] font-black text-brand-muted hover:border-brand-accent hover:text-white transition-all uppercase tracking-widest">25%</button>
                                        <button onClick={() => setAmountByPercent(0.5)} className="flex-1 bg-brand-bg border border-brand-border py-2 text-[9px] font-black text-brand-muted hover:border-brand-accent hover:text-white transition-all uppercase tracking-widest">50%</button>
                                        <button onClick={() => setAmountByPercent(1)} className="flex-1 bg-brand-bg border border-brand-border py-2 text-[9px] font-black text-brand-muted hover:border-brand-accent hover:text-white transition-all uppercase tracking-widest">MAX</button>
                                    </div>
                                </div>

                                <div className="bg-brand-bg border border-brand-border p-4 space-y-3">
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                                        <span className="text-brand-muted">Performance Fee</span>
                                        <span className="mono text-brand-no">{syndicates.find(s => s.id === selectedSyndicate)?.fee}</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                                        <span className="text-brand-muted">Lockup Period</span>
                                        <span className="mono text-white">None (Liquid)</span>
                                    </div>
                                </div>

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
                                            Deposit Authorized Successfully!
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={handleDeposit}
                                    disabled={isLoading || (isConnected && !isAmountValid)}
                                    className={`w-full py-4 font-bold text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-2 ${isLoading || (isConnected && !isAmountValid)
                                            ? 'bg-brand-border text-brand-muted cursor-not-allowed'
                                            : 'bg-brand-accent hover:bg-brand-accent-hover text-black'
                                        }`}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            Confirming in Wallet...
                                        </>
                                    ) : (
                                        <>
                                            {!isConnected ? 'Connect Wallet' : 'Authorize Deposit'}
                                            {isConnected && isAmountValid && <ArrowRight size={14} />}
                                        </>
                                    )}
                                </button>

                                <p className="text-[8px] text-brand-muted uppercase font-bold text-center leading-relaxed px-4">
                                    By allocating funds, you authorize the syndicate manager to deploy your liquidity across prediction markets. Capital is at risk.
                                </p>
                            </div>
                        ) : (
                            <div className="p-10 flex flex-col items-center text-center gap-4 text-brand-muted">
                                <Activity size={32} className="opacity-50" />
                                <span className="text-[10px] font-black uppercase tracking-widest">
                                    Select a Syndicate<br />to review details and allocate capital.
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
