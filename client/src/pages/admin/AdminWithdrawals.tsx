import React, { useState, useEffect } from 'react';
import { CurrencyDollarIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';

const AdminWithdrawals: React.FC = () => {
    const [withdrawals, setWithdrawals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWithdrawals();
    }, []);

    const fetchWithdrawals = async () => {
        try {
            const res = await api.get('/wallet/admin/withdrawals');
            setWithdrawals(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleProcess = async (id: string, status: 'approved' | 'rejected' | 'paid', notes: string) => {
        try {
            await api.post(`/wallet/admin/withdrawals/${id}/process`, { status, notes });
            fetchWithdrawals();
        } catch (error) {
            alert('Error processing withdrawal');
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
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                        <CurrencyDollarIcon className="w-8 h-8 text-amber-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">
                            Treasury <span className="text-teal not-italic">Ops</span>
                        </h1>
                        <p className="text-muted text-sm mt-1">Review and authorize pending withdrawal requests.</p>
                    </div>
                </div>
            </header>

            <div className="glass rounded-[2.5rem] border border-white/5 overflow-hidden">
                <div className="px-10 py-6 border-b border-white/5 bg-white/5">
                    <h2 className="font-black italic uppercase tracking-tighter text-white">Pending Requests</h2>
                </div>
                
                <div className="overflow-x-auto">
                    {withdrawals.length === 0 ? (
                        <div className="p-20 text-center text-muted font-bold italic uppercase tracking-widest">No outstanding payouts in the queue.</div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted">Beneficiary</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted">Amount</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted">Method & Details</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {withdrawals.map((w: any) => (
                                    <tr key={w._id} className="group hover:bg-white/5 transition-colors">
                                        <td className="px-10 py-6">
                                            <p className="font-bold text-white group-hover:text-teal transition-colors">
                                                {w.userId?.firstName} {w.userId?.lastName}
                                            </p>
                                            <p className="text-[10px] text-muted uppercase tracking-widest">{w.userId?.email}</p>
                                        </td>
                                        <td className="px-10 py-6">
                                            <p className="text-xl font-black italic text-teal">₹{(w.amount / 100).toFixed(2)}</p>
                                            <p className="text-[10px] text-muted uppercase tracking-widest font-bold">Requested on {new Date(w.createdAt).toLocaleDateString()}</p>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className="px-3 py-1 bg-white/5 text-white/60 text-[10px] font-black uppercase tracking-widest rounded-lg border border-white/10 mb-2 inline-block">
                                                {w.method}
                                            </span>
                                            <pre className="text-[10px] font-mono text-muted bg-black/20 p-3 rounded-xl border border-white/5 max-w-xs overflow-hidden">
                                                {JSON.stringify(w.accountDetails, null, 2)}
                                            </pre>
                                        </td>
                                        <td className="px-10 py-6 text-right space-x-3">
                                            <button 
                                                onClick={() => handleProcess(w._id, 'paid', 'Payout successful')}
                                                className="px-6 py-3 bg-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-widest rounded-xl border border-green-500/30 hover:bg-green-500/30 transition-all"
                                            >
                                                Mark as Paid
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    const notes = prompt('Reason for rejection:');
                                                    if (notes) handleProcess(w._id, 'rejected', notes);
                                                }}
                                                className="px-6 py-3 bg-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest rounded-xl border border-red-500/30 hover:bg-red-500/30 transition-all"
                                            >
                                                Reject
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminWithdrawals;
