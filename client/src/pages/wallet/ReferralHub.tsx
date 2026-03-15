import { UserGroupIcon, LinkIcon, DocumentDuplicateIcon, ArrowTrendingUpIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const ReferralHub: React.FC = () => {
    const { user } = useAuth();
    const [referrals, setReferrals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReferrals();
    }, []);

    const fetchReferrals = async () => {
        try {
            const res = await api.get('/wallet/referrals');
            setReferrals(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const referralLink = `${window.location.origin}/register?ref=${user?._id}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(referralLink);
    };

    const totalReferralEarnings = user?.referralEarnings || 0;

    return (
        <div className="space-y-8 pb-12">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">
                        Referral <span className="text-teal not-italic">Hub</span>
                    </h1>
                    <p className="text-muted text-sm mt-1">Build your network and earn passive income forever.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Invite Card */}
                <div className="lg:col-span-2 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 p-10 rounded-[2.5rem] border border-indigo-500/20 relative overflow-hidden group">
                    <UserGroupIcon className="absolute -bottom-10 -right-10 w-64 h-64 text-indigo-500/10 group-hover:scale-110 transition-transform duration-700" />
                    
                    <div className="relative z-10 max-w-lg">
                        <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none mb-6">
                            Earn 5% Lifetime <br />
                            <span className="text-indigo-400 not-italic">Commission.</span>
                        </h2>
                        <p className="text-white/60 text-lg leading-relaxed mb-8">
                            Every time someone you refer completes a mission, you get <span className="text-white font-black italic">5%</span> of their reward 
                            deposited instantly into your wallet. No limits. No catch.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-3">
                            <div className="w-full flex items-center gap-3 bg-navy/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 group-focus-within:border-indigo-500/50 transition-all">
                                <LinkIcon className="w-5 h-5 text-indigo-400" />
                                <input 
                                    type="text"
                                    readOnly
                                    value={referralLink}
                                    className="bg-transparent border-none focus:ring-0 text-white font-bold text-xs truncate flex-1 outline-none"
                                />
                            </div>
                            <button 
                                onClick={copyToClipboard}
                                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white font-black italic uppercase tracking-widest rounded-2xl hover:bg-indigo-500 hover:shadow-[0_0_30px_rgba(79,70,229,0.4)] transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                <DocumentDuplicateIcon className="w-5 h-5" /> Copy Link
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Summary */}
                <div className="space-y-6">
                    <div className="glass p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
                        <ArrowTrendingUpIcon className="absolute -top-4 -right-4 w-24 h-24 text-teal/5" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted">Passive Earnings</p>
                        <p className="text-4xl font-black text-teal italic mt-2">₹{(totalReferralEarnings/100).toFixed(2)}</p>
                        <p className="text-[10px] text-white/40 font-bold uppercase mt-1">Updated in real-time</p>
                    </div>

                    <div className="glass p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted">Total Network</p>
                        <p className="text-4xl font-black text-white italic mt-2">{referrals.length}</p>
                        <p className="text-[10px] text-white/40 font-bold uppercase mt-1">Active Innovators</p>
                    </div>

                    <div className="p-8 rounded-[2.5rem] bg-white/5 border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mb-4">
                            <RocketLaunchIcon className="w-6 h-6 text-indigo-400" />
                        </div>
                        <p className="text-xs text-muted font-bold leading-relaxed px-4">
                            Your network grows faster when you share on LinkedIn and Twitter.
                        </p>
                    </div>
                </div>
            </div>

            {/* Referrals List */}
            <div className="glass rounded-[2.5rem] border border-white/5 overflow-hidden">
                <div className="px-10 py-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
                    <h2 className="font-black italic uppercase tracking-tighter text-white">Your Network <span className="text-muted not-italic">(Recent activity)</span></h2>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted">Innovator</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted text-center">Status</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted text-right">Commission Earned</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr><td colSpan={3} className="px-10 py-20 text-center text-muted font-bold italic uppercase animate-pulse">Scanning Neural Network...</td></tr>
                            ) : referrals.length === 0 ? (
                                <tr><td colSpan={3} className="px-10 py-20 text-center text-muted font-bold italic uppercase">Your network is empty. Start inviting!</td></tr>
                            ) : (
                                referrals.map((ref: any) => (
                                    <tr key={ref._id} className="group hover:bg-white/5 transition-colors">
                                        <td className="px-10 py-6 flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-white italic">
                                                {ref.referredId?.firstName?.charAt(0) || 'I'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white group-hover:text-teal transition-colors">{ref.referredId?.firstName || 'Innovator'}</p>
                                                <p className="text-[10px] text-muted uppercase tracking-widest">Active Member</p>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 text-center">
                                            <span className="px-3 py-1 bg-teal/10 text-teal text-[10px] font-black uppercase tracking-widest rounded-lg border border-teal/20">Active</span>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <p className="text-lg font-black text-teal italic">₹{(ref.earnings / 100).toFixed(2)}</p>
                                            <p className="text-[10px] text-white/20 font-bold uppercase">Lifetime Total</p>
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

export default ReferralHub;
