import React, { useState } from 'react';
import { 
    BanknotesIcon, 
    CreditCardIcon, 
    IdentificationIcon, 
    ShieldCheckIcon,
    ChevronRightIcon,
    ArrowPathIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

const Withdraw: React.FC = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState<'upi' | 'bank'>('upi');
    const [upiId, setUpiId] = useState('');
    const [bankDetails, setBankDetails] = useState({ accountHolder: '', accountNumber: '', ifsc: '' });
    const [loading, setLoading] = useState(false);

    const MIN_WITHDRAWAL = 10000; // ₹100 in paise

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        const amountPaise = parseFloat(amount) * 100;

        if (amountPaise < MIN_WITHDRAWAL) {
            showToast('Minimum withdrawal is ₹100', 'warning');
            return;
        }

        if (amountPaise > (user?.balance || 0)) {
            showToast('Insufficient balance', 'error');
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/wallet/withdraw', {
                amount: amountPaise,
                method,
                details: method === 'upi' ? { vpa: upiId } : bankDetails
            });
            showToast('Withdrawal request submitted!', 'success');
            setAmount('');
        } catch (err: any) {
            showToast(err.response?.data?.message || 'Withdrawal failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <header>
                <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
                    Payout <span className="text-teal not-italic">Central</span>
                </h1>
                <p className="text-muted text-sm mt-1">Convert your micro-task earnings into real cash.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Balance Card */}
                <div className="md:col-span-1 space-y-6">
                    <div className="glass p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group bg-gradient-to-br from-teal-500/10 to-transparent">
                        <BanknotesIcon className="absolute -top-4 -left-4 w-24 h-24 text-teal/10 rotate-12" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted relative z-10">Withdrawable Balance</p>
                        <p className="text-4xl font-black text-teal italic mt-2 relative z-10">₹{(user?.balance / 100 || 0).toFixed(2)}</p>
                        <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-muted uppercase tracking-tight">
                            <ShieldCheckIcon className="w-3 h-3" /> Secure Payouts by Razorpay
                        </div>
                    </div>

                    <div className="glass p-6 rounded-[2rem] border border-white/5 divide-y divide-white/5">
                        <div className="py-3 flex items-center justify-between">
                            <span className="text-xs text-muted">Min Withdrawal</span>
                            <span className="text-xs font-bold text-white">₹100</span>
                        </div>
                        <div className="py-3 flex items-center justify-between">
                            <span className="text-xs text-muted">Processing Time</span>
                            <span className="text-xs font-bold text-white">2-24 Hours</span>
                        </div>
                        <div className="py-3 flex items-center justify-between">
                            <span className="text-xs text-muted">Fee</span>
                            <span className="text-xs font-bold text-teal italic">₹0.00 (Free)</span>
                        </div>
                    </div>
                </div>

                {/* Main Form Area */}
                <div className="md:col-span-2">
                    <div className="glass p-8 rounded-[2.5rem] border border-white/5">
                        <form onSubmit={handleWithdraw} className="space-y-8">
                            {/* Amount Input */}
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted mb-3 block">Amount to Withdraw (₹)</label>
                                <div className="relative group">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black italic text-teal/40 group-focus-within:text-teal transition-colors">₹</span>
                                    <input 
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full bg-white/5 border border-white/5 rounded-3xl py-6 pl-12 pr-8 text-2xl font-black italic text-white focus:ring-4 focus:ring-teal/10 focus:border-teal/30 focus:bg-white/10 transition-all outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Method Tabs */}
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted mb-3 block">Payout Method</label>
                                <div className="flex p-1.5 bg-white/5 rounded-3xl border border-white/5 gap-2">
                                    <button 
                                        type="button"
                                        onClick={() => setMethod('upi')}
                                        className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest italic transition-all ${method === 'upi' ? 'bg-teal text-navy shadow-[0_0_20px_rgba(0,245,212,0.3)]' : 'text-muted hover:text-white hover:bg-white/5'}`}
                                    >
                                        <IdentificationIcon className="w-4 h-4" /> UPI Transfer
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setMethod('bank')}
                                        className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest italic transition-all ${method === 'bank' ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]' : 'text-muted hover:text-white hover:bg-white/5'}`}
                                    >
                                        <CreditCardIcon className="w-4 h-4" /> Bank Account
                                    </button>
                                </div>
                            </div>

                            {/* Conditional Inputs */}
                            {method === 'upi' ? (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted mb-3 block">UPI ID (VPA)</label>
                                    <input 
                                        type="text"
                                        value={upiId}
                                        onChange={(e) => setUpiId(e.target.value)}
                                        placeholder="yourname@upi"
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white font-bold focus:ring-4 focus:ring-teal/10 focus:border-teal/30 focus:bg-white/10 transition-all outline-none"
                                        required
                                    />
                                </div>
                            ) : (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <input 
                                        type="text"
                                        placeholder="Account Holder Name"
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white font-bold"
                                        onChange={(e) => setBankDetails({...bankDetails, accountHolder: e.target.value})}
                                        required
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input 
                                            type="text"
                                            placeholder="Account Number"
                                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white font-bold"
                                            onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})}
                                            required
                                        />
                                        <input 
                                            type="text"
                                            placeholder="IFSC Code"
                                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white font-bold"
                                            onChange={(e) => setBankDetails({...bankDetails, ifsc: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            <button 
                                type="submit"
                                disabled={loading}
                                className="w-full py-6 bg-gradient-to-r from-teal to-blue-500 rounded-[2rem] text-navy font-black italic uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50"
                            >
                                {loading ? (
                                    <ArrowPathIcon className="w-6 h-6 animate-spin mx-auto" />
                                ) : (
                                    'Request Payout →'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Recent History (Mock) */}
            <div className="glass p-8 rounded-[2.5rem] border border-white/5">
                <h2 className="text-xl font-bold text-white mb-6">Recent Redemptions</h2>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 opacity-50">
                        <div className="flex items-center gap-3">
                            <CheckCircleIcon className="w-5 h-5 text-teal" />
                            <div>
                                <p className="text-sm font-bold text-white">₹500.00</p>
                                <p className="text-[10px] text-muted">UPI: user@okaxis • Mar 14, 2024</p>
                            </div>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-teal">Completed</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Withdraw;
