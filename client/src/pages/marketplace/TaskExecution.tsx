import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, CheckCircleIcon, ExclamationTriangleIcon, ArrowPathIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';

const TaskExecution: React.FC = () => {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [task, setTask] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form states
    const [answers, setAnswers] = useState<any>({});
    const [proofUrl, setProofUrl] = useState('');
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetchTask();
    }, [taskId]);

    const fetchTask = async () => {
        try {
            const res = await api.get(`/marketplace/task/${taskId}`);
            setTask(res.data);
            
            // Try reserving it
            await api.post(`/marketplace/task/${taskId}/start`);
        } catch (error: any) {
            console.error(error);
            if (error.response?.data?.message === 'You have already attempted this task') {
                setStatusMessage({ type: 'error', text: 'You have already submitted an attempt for this task.' });
            } else {
                setStatusMessage({ type: 'error', text: 'Task is no longer available.' });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setAnswers(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setStatusMessage(null);

        try {
            const payload = {
                answers: task.type === 'captcha' ? Object.values(answers)[0] : answers,
                proofUrl: task.config?.fileRequired ? proofUrl : undefined
            };

            const res = await api.post(`/marketplace/task/${taskId}/submit`, payload);
            setStatusMessage({ type: 'success', text: res.data.message });
            showToast('Mission accomplished!', 'success');
            
            setTimeout(() => {
                navigate(-1);
            }, 3000);
        } catch (error: any) {
            setStatusMessage({ type: 'error', text: error.response?.data?.message || 'Error submitting task' });
            showToast(error.response?.data?.message || 'Submission failed', 'error');
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-[400px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal"></div>
        </div>
    );
    
    if (!task) return (
        <div className="text-center py-20">
            <h2 className="text-2xl font-black text-white italic uppercase">Mission Not Found</h2>
            <button onClick={() => navigate(-1)} className="mt-4 text-teal font-bold uppercase tracking-widest text-xs">Back to Marketplace</button>
        </div>
    );

    const isDone = statusMessage?.type === 'success' || statusMessage?.text.includes('already attempted');

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted hover:text-white transition-colors mb-6 text-xs font-bold uppercase tracking-widest">
                <ArrowLeftIcon className="w-4 h-4" /> Abort Mission
            </button>

            <div className="glass rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
                {/* Task Header */}
                <div className="p-10 bg-gradient-to-br from-teal-500/10 to-indigo-500/10 border-b border-white/5 relative">
                    <div className="absolute top-0 right-0 p-4">
                        <div className="text-right">
                             <p className="text-[10px] font-black uppercase tracking-widest text-muted">Bounty</p>
                             <p className="text-3xl font-black text-teal italic">₹{(task.reward / 100).toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mb-6">
                        <span className="px-4 py-1 bg-white/5 border border-white/10 text-teal text-[10px] font-black uppercase tracking-widest rounded-lg">
                            {task.type.replace('_', ' ')}
                        </span>
                        {task.verificationType === 'auto' && (
                            <span className="px-4 py-1 bg-teal text-navy text-[10px] font-black uppercase tracking-widest rounded-lg shadow-[0_0_15px_rgba(0,245,212,0.3)]">
                                Instant Pay
                            </span>
                        )}
                    </div>

                    <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-tight max-w-2xl">{task.title}</h1>
                    <p className="text-muted text-sm mt-4 leading-relaxed max-w-2xl">{task.description}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3">
                    {/* Instructions Area */}
                    <div className="lg:col-span-1 p-8 bg-white/5 border-r border-white/5">
                        <h3 className="text-[10px] font-black text-teal uppercase tracking-widest mb-6">Briefing / Instructions</h3>
                        <div className="space-y-4">
                            {task.instructions.split('\n').map((line: string, i: number) => (
                                <p key={i} className="text-xs text-muted leading-relaxed flex gap-2">
                                    <span className="text-teal font-black">/</span> {line}
                                </p>
                            ))}
                        </div>

                        {task.mediaUrl && (
                            <div className="mt-8 rounded-2xl overflow-hidden border border-white/10 group relative">
                                <img src={task.mediaUrl} alt="Briefing Material" className="w-full h-auto group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            </div>
                        )}
                    </div>

                    {/* Submission Area */}
                    <div className="lg:col-span-2 p-10">
                        {statusMessage && (
                            <div className={`p-6 rounded-[2rem] flex items-center gap-4 mb-8 border ${statusMessage.type === 'success' ? 'bg-teal/10 border-teal/20 text-teal' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                                {statusMessage.type === 'success' ? <CheckCircleIcon className="w-8 h-8" /> : <ExclamationTriangleIcon className="w-8 h-8" />}
                                <div>
                                    <p className="font-bold italic uppercase tracking-tight">{statusMessage.type === 'success' ? 'Mission Success' : 'Mission Failed'}</p>
                                    <p className="text-xs opacity-80">{statusMessage.text}</p>
                                </div>
                            </div>
                        )}

                        {!isDone && (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Dynamic Fields */}
                                {task.type === 'captcha' ? (
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted mb-3 block">Solve Captcha</label>
                                        <div className="mb-4 p-6 bg-navy rounded-2xl border border-white/10 text-center select-none">
                                            <span className="text-3xl font-black italic tracking-[0.5em] text-white/20 line-through decoration-teal/30">
                                                {task.config?.captchaText || 'MOCKED'}
                                            </span>
                                        </div>
                                        <input 
                                            type="text" required
                                            onChange={e => handleInputChange('captcha', e.target.value)}
                                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white font-bold italic focus:ring-4 focus:ring-teal/10 focus:border-teal/30 focus:bg-white/10 transition-all outline-none"
                                            placeholder="Type characters exactly..."
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted mb-1 block">Your Submission</label>
                                        <textarea 
                                            required
                                            onChange={e => handleInputChange('main', e.target.value)}
                                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white font-bold focus:ring-4 focus:ring-teal/10 focus:border-teal/30 focus:bg-white/10 transition-all outline-none min-h-[150px]"
                                            placeholder="Input your findings or required data points here..."
                                        />
                                    </div>
                                )}

                                {task.config?.fileRequired && (
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted mb-3 block">Upload Proof (URL)</label>
                                        <div className="relative group">
                                            <input 
                                                type="url" required
                                                value={proofUrl} onChange={e => setProofUrl(e.target.value)}
                                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white font-bold focus:ring-4 focus:ring-teal/10 focus:border-teal/30 focus:bg-white/10 transition-all outline-none"
                                                placeholder="https://imgur.com/your-proof.png"
                                            />
                                        </div>
                                    </div>
                                )}

                                <button 
                                    type="submit" 
                                    disabled={submitting}
                                    className="w-full py-6 bg-teal rounded-[2rem] text-navy font-black italic uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
                                >
                                    {submitting ? (
                                        <ArrowPathIcon className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <>Complete Mission <ArrowRightIcon className="w-5 h-5" /></>
                                    )}
                                </button>
                                
                                <p className="text-[10px] text-center text-muted font-bold uppercase tracking-tight">
                                    By submitting, you agree that your work is original and accurate. False submissions may lead to account ban.
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskExecution;
