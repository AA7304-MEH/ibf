import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    BanknotesIcon, 
    ArrowPathIcon, 
    CheckBadgeIcon, 
    ExclamationCircleIcon,
    ArrowUpCircleIcon,
    ArrowDownCircleIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const WalletDashboard: React.FC = () => {
    const { user } = useAuth();
    const [wallet, setWallet] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [withdrawMethod, setWithdrawMethod] = useState('upi');
    const [upiId, setUpiId] = useState('');

    useEffect(() => {
        fetchWalletData();
    }, []);

    const fetchWalletData = async () => {
        try {
            const res = await api.get('/wallet');
            setWallet(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-[400px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal"></div>
        </div>
    );

    return (
        <div className="space-y-8 pb-12">
            <header>
                <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">
                    Financial <span className="text-teal not-italic">Control</span>
                </h1>
                <p className="text-muted text-sm mt-1">Track your earnings, manage your wallet and payouts.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Stats Card */}
                <div className="lg:col-span-2 glass rounded-[2.5rem] p-10 border border-white/5 relative overflow-hidden group bg-gradient-to-br from-teal-500/5 to-transparent">
                    <div className="absolute top-0 right-0 p-40 bg-teal/10 blur-[100px] rounded-full pointer-events-none"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-2">Available for Payout</p>
                            <h2 className="text-6xl font-black text-white italic tracking-tighter mb-4">
                                ₹{(wallet.balance / 100).toFixed(2)}
                            </h2>
                            <div className="flex items-center gap-4">
                                <Link 
                                    to="/withdraw" 
                                    className="px-8 py-4 bg-teal text-navy font-black italic uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl"
                                >
                                    Withdraw Now
                                </Link>
                                <div className="text-left">
                                    <p className="text-[10px] font-black text-muted uppercase tracking-widest">Lifetime Earned</p>
                                    <p className="text-xl font-bold text-white italic">₹{(wallet.totalEarned / 100).toFixed(2)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 text-center">
                                <ArrowTrendingUpIcon className="w-8 h-8 text-teal mx-auto mb-2" />
                                <p className="text-white font-black italic text-xl">Earnings</p>
                                <p className="text-blue-200 text-[10px] font-bold uppercase tracking-widest">Growth 12%</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* KYC & Verification Card */}
                <div className="glass p-8 rounded-[2.5rem] border border-white/5 flex flex-col justify-between items-center text-center relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-muted mb-8">Verification Status</h3>
                        
                        {wallet.kycStatus === 'verified' ? (
                            <div className="space-y-4">
                                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto ring-8 ring-green-500/5">
                                    <CheckBadgeIcon className="w-10 h-10 text-green-400" />
                                </div>
                                <div>
                                    <p className="text-white font-black italic uppercase text-lg">Verified Identity</p>
                                    <p className="text-xs text-muted mt-1 leading-relaxed px-6">Your account is fully authorized for high-value transactions.</p>
                                </div>
                            </div>
                        ) : wallet.kycStatus === 'pending' ? (
                            <div className="space-y-4">
                                <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto ring-8 ring-amber-500/5">
                                    <ArrowPathIcon className="w-10 h-10 text-amber-400 animate-spin-slow" />
                                </div>
                                <p className="text-white font-black italic uppercase text-lg">Manual Review</p>
                                <p className="text-xs text-muted mt-1">Our team is verifying your documents.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto ring-8 ring-red-500/5">
                                    <ExclamationCircleIcon className="w-10 h-10 text-red-500" />
                                </div>
                                <p className="text-white font-black italic uppercase text-lg">KYC Required</p>
                                <p className="text-xs text-muted mt-1 italic">Verification is needed for payouts.</p>
                                <Link to="/wallet/kyc" className="mt-4 block px-6 py-3 bg-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest rounded-xl border border-red-500/30 hover:bg-red-500/30 transition-all">Verify Now</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Transactions History */}
            <div className="glass rounded-[2.5rem] border border-white/5 overflow-hidden">
                <div className="px-10 py-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
                    <h2 className="font-black italic uppercase tracking-tighter text-white">Neural Ledger <span className="text-muted not-italic">(Transactions)</span></h2>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted">Details</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted text-center">Type</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {wallet.recentTransactions.length === 0 ? (
                                <tr><td colSpan={3} className="px-10 py-20 text-center text-muted font-bold italic uppercase">No data points recorded in the ledger.</td></tr>
                            ) : (
                                wallet.recentTransactions.map((tx: any) => (
                                    <tr key={tx._id} className="group hover:bg-white/5 transition-colors">
                                        <td className="px-10 py-6 flex items-center gap-4">
                                            <div className={`p-3 rounded-xl ${tx.amount > 0 ? 'bg-teal/10 text-teal' : 'bg-white/5 text-muted'}`}>
                                                {tx.amount > 0 ? <ArrowDownCircleIcon className="w-6 h-6" /> : <ArrowUpCircleIcon className="w-6 h-6" />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white group-hover:text-teal transition-colors">{tx.description}</p>
                                                <p className="text-[10px] text-muted uppercase tracking-widest">
                                                    {new Date(tx.createdAt).toLocaleDateString()} • {new Date(tx.createdAt).toLocaleTimeString()}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 text-center">
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${tx.amount > 0 ? 'bg-teal/10 text-teal border-teal/20' : 'bg-white/5 text-muted border-white/10'}`}>
                                                {tx.amount > 0 ? 'Income' : 'Withdrawal'}
                                            </span>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <p className={`text-lg font-black italic ${tx.amount > 0 ? 'text-teal' : 'text-white'}`}>
                                                {tx.amount > 0 ? '+' : ''}₹{(tx.amount / 100).toFixed(2)}
                                            </p>
                                            <p className="text-[10px] text-white/20 font-bold uppercase">Bal: ₹{(tx.balanceAfter / 100).toFixed(2)}</p>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default WalletDashboard;
