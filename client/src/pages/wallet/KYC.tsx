import React, { useState } from 'react';
import { 
    CloudArrowUpIcon, 
    IdentificationIcon, 
    ShieldCheckIcon,
    CheckBadgeIcon,
    ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import { motion } from 'framer-motion';

const KYC: React.FC = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [idType, setIdType] = useState('aadhaar');
    const [idNumber, setIdNumber] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            showToast('Please select a file to upload', 'warning');
            return;
        }

        const formData = new FormData();
        formData.append('idType', idType);
        formData.append('idNumber', idNumber);
        formData.append('document', file);

        setLoading(true);
        try {
            await api.post('/wallet/kyc', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            showToast('KYC Documents submitted for review!', 'success');
        } catch (err: any) {
            showToast(err.response?.data?.message || 'Upload failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <header>
                <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
                    Identity <span className="text-teal not-italic">Verification</span>
                </h1>
                <p className="text-muted text-sm mt-1">Complete your KYC to unlock full withdrawal capabilities.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Info Card */}
                <div className="md:col-span-1 space-y-6">
                    <div className="glass p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden bg-gradient-to-br from-indigo-500/10 to-transparent">
                        <ShieldCheckIcon className="w-12 h-12 text-teal mb-4" />
                        <h3 className="text-white font-black italic uppercase tracking-tight text-xl">Privacy First</h3>
                        <p className="text-xs text-muted mt-2 leading-relaxed">
                            Your data is encrypted and stored securely. We only use this information to verify your identity for financial transactions.
                        </p>
                    </div>

                    <div className="glass p-6 rounded-[2rem] border border-white/5 space-y-4">
                        <div className="flex items-center gap-3">
                            <CheckBadgeIcon className="w-5 h-5 text-teal" />
                            <span className="text-xs text-white font-bold italic">Fast Review (12-24h)</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckBadgeIcon className="w-5 h-5 text-teal" />
                            <span className="text-xs text-white font-bold italic">Standard Bank Encryption</span>
                        </div>
                    </div>
                </div>

                {/* Form Area */}
                <div className="md:col-span-2">
                    <div className="glass p-8 rounded-[2.5rem] border border-white/5">
                        <form onSubmit={handleUpload} className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted mb-2 block">ID Document Type</label>
                                <select 
                                    value={idType}
                                    onChange={(e) => setIdType(e.target.value)}
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white font-bold focus:ring-4 focus:ring-teal/10 focus:border-teal/30 outline-none"
                                >
                                    <option value="aadhaar" className="bg-navy text-white">Aadhaar Card</option>
                                    <option value="pan" className="bg-navy text-white">PAN Card</option>
                                    <option value="passport" className="bg-navy text-white">Passport</option>
                                    <option value="voter_id" className="bg-navy text-white">Voter ID</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted mb-2 block">ID Number</label>
                                <input 
                                    type="text"
                                    value={idNumber}
                                    onChange={(e) => setIdNumber(e.target.value)}
                                    placeholder="Enter your card number"
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white font-bold focus:ring-4 focus:ring-teal/10 focus:border-teal/30 focus:bg-white/10 transition-all outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted mb-2 block">Upload Photo of ID</label>
                                <div className="relative group">
                                    <input 
                                        type="file"
                                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                                        className="hidden"
                                        id="kyc-file"
                                        accept="image/*"
                                        required
                                    />
                                    <label 
                                        htmlFor="kyc-file"
                                        className="w-full h-48 border-2 border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer group-hover:border-teal/40 group-hover:bg-teal/5 transition-all text-center p-6"
                                    >
                                        {file ? (
                                            <div className="flex flex-col items-center text-teal">
                                                <div className="w-12 h-12 bg-teal/20 rounded-full flex items-center justify-center mb-2">
                                                    <CheckBadgeIcon className="w-6 h-6" />
                                                </div>
                                                <p className="font-bold italic">{file.name}</p>
                                                <p className="text-[10px] uppercase font-black tracking-widest mt-1">Tap to change file</p>
                                            </div>
                                        ) : (
                                            <>
                                                <CloudArrowUpIcon className="w-12 h-12 text-muted group-hover:text-teal transition-colors mb-2" />
                                                <p className="text-white font-bold italic">Drop your file here or browse</p>
                                                <p className="text-[10px] text-muted uppercase font-black tracking-widest mt-1">Supports PNG, JPG (Max 5MB)</p>
                                            </>
                                        )}
                                    </label>
                                </div>
                            </div>

                            <button 
                                type="submit"
                                disabled={loading}
                                className="w-full py-6 bg-teal text-navy font-black italic uppercase tracking-widest rounded-[2rem] hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-50"
                            >
                                {loading ? 'Submitting...' : 'Submit Documents →'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KYC;
