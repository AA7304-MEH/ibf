import React, { useState } from 'react';
import { IdentificationIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const KYCSubmission: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        idType: 'Aadhar',
        idNumber: '',
        idDocumentUrl: '',
        selfieUrl: ''
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/wallet/kyc', formData);
            alert('KYC documents submitted successfully. They will be reviewed shortly.');
            navigate('/wallet');
        } catch (error: any) {
            alert(error.response?.data?.message || 'Error submitting KYC');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-navy py-12 px-4 flex justify-center items-start">
            <div className="w-full max-w-xl bg-white dark:bg-navy-card rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-navy-border">
                <div className="p-8 border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5">
                    <div className="w-16 h-16 bg-teal/20 text-teal rounded-2xl flex items-center justify-center mb-6 shadow-inner shadow-teal/50">
                        <IdentificationIcon className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Identity Verification</h2>
                    <p className="text-gray-500 dark:text-muted mt-2">
                        To comply with financial regulations and enable payouts, we need to verify your identity.
                    </p>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2 dark:text-white">Document Type</label>
                            <select 
                                value={formData.idType} onChange={e => setFormData({...formData, idType: e.target.value})}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 dark:bg-navy dark:text-white focus:ring-2 focus:ring-teal"
                            >
                                <option value="Aadhar">Aadhar Card</option>
                                <option value="PAN">PAN Card</option>
                                <option value="Driving_License">Driving License</option>
                                <option value="Passport">Passport</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-semibold mb-2 dark:text-white">Document Number</label>
                            <input 
                                type="text" required
                                value={formData.idNumber} onChange={e => setFormData({...formData, idNumber: e.target.value})}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 dark:bg-navy dark:text-white focus:ring-2 focus:ring-teal"
                                placeholder={`Enter your ${formData.idType} number`}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2 dark:text-white">Document Image URL</label>
                            <input 
                                type="url" required
                                value={formData.idDocumentUrl} onChange={e => setFormData({...formData, idDocumentUrl: e.target.value})}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 dark:bg-navy dark:text-white focus:ring-2 focus:ring-teal"
                                placeholder="Link to document image (e.g., https://imgur.com/...)"
                            />
                            <p className="text-xs text-muted mt-2 mt-1">For MVP, provide a direct URL to an image.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2 dark:text-white">Selfie Image URL</label>
                            <input 
                                type="url" required
                                value={formData.selfieUrl} onChange={e => setFormData({...formData, selfieUrl: e.target.value})}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 dark:bg-navy dark:text-white focus:ring-2 focus:ring-teal"
                                placeholder="Link to a clear selfie"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="btn-teal w-full px-6 py-4 rounded-xl text-lg disabled:opacity-50"
                    >
                        {loading ? 'Submitting...' : 'Submit Verification'}
                    </button>
                    <p className="text-xs text-center text-muted mt-4">
                        Your data is encrypted and stored securely.
                    </p>
                </form>
            </div>
        </div>
    );
};

export default KYCSubmission;
