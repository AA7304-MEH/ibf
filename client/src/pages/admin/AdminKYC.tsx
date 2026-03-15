import React, { useState, useEffect } from 'react';
import { IdentificationIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';

const AdminKYC: React.FC = () => {
    const [kycRequests, setKycRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchKYC();
    }, []);

    const fetchKYC = async () => {
        try {
            const res = await api.get('/admin/kyc/pending');
            setKycRequests(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleProcess = async (userId: string, status: 'verified' | 'rejected', notes: string) => {
        try {
            await api.post(`/admin/kyc/${userId}/approve`, { status, notes });
            fetchKYC();
        } catch (error) {
            alert('Error processing KYC');
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
                    <div className="p-3 bg-teal/10 rounded-2xl border border-teal/20">
                        <IdentificationIcon className="w-8 h-8 text-teal" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">
                            KYC <span className="text-teal not-italic">Validation</span>
                        </h1>
                        <p className="text-muted text-sm mt-1">Review and approve user identity documents.</p>
                    </div>
                </div>
            </header>

            <div className="glass rounded-[2.5rem] border border-white/5 overflow-hidden">
                <div className="px-10 py-6 border-b border-white/5 bg-white/5">
                    <h2 className="font-black italic uppercase tracking-tighter text-white">Pending Verification</h2>
                </div>
                
                <div className="overflow-x-auto">
                    {kycRequests.length === 0 ? (
                        <div className="p-20 text-center text-muted font-bold italic uppercase tracking-widest">Global verification queue is clear.</div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted">Aspirant</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted">ID Particulars</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted">Evidence</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {kycRequests.map((req: any) => (
                                    <tr key={req._id} className="group hover:bg-white/5 transition-colors">
                                        <td className="px-10 py-6">
                                            <p className="font-bold text-white group-hover:text-teal transition-colors">
                                                {req.firstName} {req.lastName}
                                            </p>
                                            <p className="text-[10px] text-muted uppercase tracking-widest">{req.email}</p>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className="px-3 py-1 bg-white/5 text-white/80 text-[10px] font-black uppercase tracking-widest rounded-lg border border-white/10 mb-1 inline-block">
                                                {req.kycData?.idType}
                                            </span>
                                            <p className="text-sm font-mono text-white/50">{req.kycData?.idNumber}</p>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex gap-3">
                                                {req.kycData?.idDocumentUrl && (
                                                    <a 
                                                        href={req.kycData.idDocumentUrl} 
                                                        target="_blank" rel="noreferrer" 
                                                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-teal hover:bg-teal hover:text-navy transition-all"
                                                    >
                                                        ID File
                                                    </a>
                                                )}
                                                {req.kycData?.selfieUrl && (
                                                    <a 
                                                        href={req.kycData.selfieUrl} 
                                                        target="_blank" rel="noreferrer" 
                                                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-teal hover:bg-teal hover:text-navy transition-all"
                                                    >
                                                        Selfie
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 text-right space-x-3">
                                            <button 
                                                onClick={() => handleProcess(req._id, 'verified', '')}
                                                className="px-6 py-3 bg-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-widest rounded-xl border border-green-500/30 hover:bg-green-500/30 transition-all"
                                            >
                                                Approve
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    const notes = prompt('Reason for rejection:');
                                                    if (notes) handleProcess(req._id, 'rejected', notes);
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

export default AdminKYC;
