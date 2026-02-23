import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ClockIcon, PaperAirplaneIcon, UserGroupIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { io, Socket } from 'socket.io-client';
import api from '../../../services/api';

const ProjectWarRoom: React.FC = () => {
    const projectId = "alpha-protocol"; // Scalable: get from URL params
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [applicants, setApplicants] = useState<any[]>([]);
    const [hiredTalent, setHiredTalent] = useState<any>(null);
    const [activeView, setActiveView] = useState<'collab' | 'applicants'>('collab');

    const [blocks, setBlocks] = useState([
        { id: 'auth', title: 'AuthService', x: 100, y: 100, color: 'blue' },
        { id: 'payment', title: 'PaymentGateway', x: 400, y: 300, color: 'purple' }
    ]);

    useEffect(() => {
        const socketUrl = import.meta.env.VITE_API_URL
            ? import.meta.env.VITE_API_URL.replace('/api', '')
            : 'http://localhost:5001';

        const s = io(socketUrl);
        setSocket(s);

        s.emit('join_project', projectId);

        s.on('block_moved', (data) => {
            setBlocks(prev => prev.map(b =>
                b.id === data.blockId ? { ...b, x: data.x, y: data.y } : b
            ));
        });

        s.on('new_message', (msg) => {
            setMessages(prev => [...prev, msg]);
        });

        const fetchApplicants = async () => {
            try {
                const res = await api.get(`/collab/projects/${projectId}/applications`);
                setApplicants(res.data);
            } catch (err) {
                console.error('Failed to fetch applicants');
            }
        };

        fetchApplicants();
        return () => {
            s.disconnect();
        };
    }, []);

    const handleHire = async (appId: string) => {
        try {
            const res = await api.post('/collab/projects/hire', { applicationId: appId });
            setHiredTalent(res.data.project.hiredTalentId);
            setApplicants(prev => prev.map(a =>
                a._id === appId ? { ...a, status: 'accepted' } : { ...a, status: 'rejected' }
            ));
        } catch (err) {
            alert('Hiring failed');
        }
    };

    const handleDrag = (id: string, info: any) => {
        if (!socket) return;
        const block = blocks.find(b => b.id === id);
        if (!block) return;

        const newX = block.x + info.delta.x;
        const newY = block.y + info.delta.y;

        // Optimistic update locally
        setBlocks(prev => prev.map(b =>
            b.id === id ? { ...b, x: newX, y: newY } : b
        ));

        socket.emit('move_block', {
            projectId,
            blockId: id,
            x: newX,
            y: newY
        });
    };

    const sendMessage = () => {
        if (!input.trim() || !socket) return;
        socket.emit('send_message', {
            projectId,
            text: input,
            sender: 'User' // Replace with actual user name
        });
        setInput('');
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 lg:p-8 font-mono">
            <header className="mb-8 flex justify-between items-center bg-gray-800 p-4 rounded-xl border border-gray-700">
                <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse" />
                    <h1 className="text-xl font-bold uppercase tracking-wider">War Room: {projectId}</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-xs text-gray-500 hidden md:block">
                        LATENCY: 24MS | ENCRYPTION: AES-256
                    </div>
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full bg-indigo-600 border-2 border-gray-800 flex items-center justify-center text-[10px] font-bold">
                                {String.fromCharCode(64 + i)}
                            </div>
                        ))}
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-140px)]">
                {/* Visual Code Architecture (Left) */}
                <div className="lg:col-span-3 bg-black rounded-xl border border-gray-800 relative overflow-hidden group">
                    <div className="absolute top-4 left-4 z-10 flex gap-4">
                        <button
                            onClick={() => setActiveView('collab')}
                            className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest border transition ${activeView === 'collab' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-gray-900/80 text-gray-500 border-gray-800'}`}
                        >
                            Neural Spatializer
                        </button>
                        <button
                            onClick={() => setActiveView('applicants')}
                            className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest border transition ${activeView === 'applicants' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-gray-900/80 text-gray-500 border-gray-800'}`}
                        >
                            Applicant Console ({applicants.length})
                        </button>
                    </div>

                    <div className="absolute inset-0 p-8 flex items-center justify-center">
                        {activeView === 'collab' ? (
                            <>
                                {blocks.map(block => (
                                    <motion.div
                                        key={block.id}
                                        drag
                                        onDrag={(e, info) => handleDrag(block.id, info)}
                                        style={{ x: block.x, y: block.y }}
                                        className={`absolute w-56 h-36 bg-${block.color}-900/20 border border-${block.color}-500/50 rounded-xl p-4 cursor-move backdrop-blur-md shadow-2xl transition-colors hover:bg-${block.color}-900/30`}
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <p className={`text-${block.color}-400 text-xs font-bold uppercase`}>{block.title}</p>
                                            <div className={`w-2 h-2 rounded-full bg-${block.color}-400 animate-pulse`} />
                                        </div>
                                        <div className="space-y-2">
                                            <div className={`h-1.5 w-full bg-${block.color}-500/20 rounded-full overflow-hidden`}>
                                                <div className={`h-full bg-${block.color}-500/40 w-3/4`} />
                                            </div>
                                            <div className={`h-1 w-1/2 bg-${block.color}-500/20 rounded-full`} />
                                            <div className={`h-1 w-2/3 bg-${block.color}-500/20 rounded-full`} />
                                        </div>
                                        <div className="mt-4 flex justify-between items-center opacity-40">
                                            <div className="text-[8px]">LOG: OK</div>
                                            <div className="text-[8px]">POS: {Math.round(block.x)}, {Math.round(block.y)}</div>
                                        </div>
                                    </motion.div>
                                ))}

                                {/* Connection Visualizer */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                                    <motion.path
                                        d={`M ${blocks[0].x + 112} ${blocks[0].y + 72} Q ${(blocks[0].x + blocks[1].x) / 2 + 100} ${(blocks[0].y + blocks[1].y) / 2} ${blocks[1].x + 112} ${blocks[1].y + 72}`}
                                        stroke="white" strokeWidth="1" fill="none" strokeDasharray="5,5"
                                    />
                                </svg>
                            </>
                        ) : (
                            <div className="w-full h-full mt-10 overflow-y-auto pr-4 space-y-4">
                                {applicants.map((app) => (
                                    <div key={app._id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 flex justify-between items-center group hover:bg-gray-800 transition">
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-xl">
                                                {app.applicant?.firstName?.[0] || 'T'}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-indigo-400">{app.applicant?.firstName} {app.applicant?.lastName || 'Talent'}</h4>
                                                <p className="text-xs text-gray-500 uppercase tracking-widest">{app.applicant?.headline || 'Expert Contributor'}</p>
                                                <p className="text-sm text-gray-300 mt-2 max-w-xl line-clamp-2 italic">"{app.coverLetter}"</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-white">${app.proposedRate}/hr</p>
                                            <p className="text-xs text-gray-500 mb-4">{app.estimatedDuration}</p>
                                            {app.status === 'accepted' ? (
                                                <span className="flex items-center gap-2 text-green-500 font-bold uppercase text-xs">
                                                    <CheckCircleIcon className="w-5 h-5" /> Hired
                                                </span>
                                            ) : app.status === 'rejected' ? (
                                                <span className="flex items-center gap-2 text-red-500 font-bold uppercase text-xs">
                                                    <XCircleIcon className="w-5 h-5" /> Rejected
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => handleHire(app._id)}
                                                    className="px-6 py-2 bg-indigo-600 rounded-lg font-bold hover:bg-indigo-700 transition"
                                                >
                                                    Accept & Hire
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {applicants.length === 0 && (
                                    <div className="text-center py-20 text-gray-600">
                                        <UserGroupIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                        <p className="uppercase tracking-[0.3em]">No frequency matches found yet</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Simulation & Chat (Right) */}
                <div className="space-y-4 flex flex-col h-full overflow-hidden">
                    {/* Decision Memory (Log) */}
                    <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 h-[250px] flex flex-col backdrop-blur-sm">
                        <div className="flex items-center mb-4">
                            <ClockIcon className="w-5 h-5 text-yellow-500 mr-2" />
                            <h3 className="font-bold text-xs uppercase tracking-widest text-gray-400">System Feed</h3>
                        </div>
                        <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar text-[11px]">
                            <div className="border-l-2 border-green-500 pl-3 py-1">
                                <p className="text-gray-500 uppercase">10:42:01 • CORE</p>
                                <p className="text-gray-300">Initialized spatial environment.</p>
                            </div>
                            <div className="border-l-2 border-indigo-500 pl-3 py-1">
                                <p className="text-gray-500 uppercase">11:15:22 • NETWORK</p>
                                <p className="text-gray-300">P2P Link established with 3 nodes.</p>
                            </div>
                            {messages.slice(-5).map((msg, i) => (
                                <div key={i} className="border-l-2 border-purple-500 pl-3 py-1">
                                    <p className="text-gray-500 uppercase">{msg.timestamp.split('T')[1].split('.')[0]} • {msg.sender}</p>
                                    <p className="text-gray-300">Broadcast: {msg.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Team Chat */}
                    <div className="bg-gray-800/80 p-4 rounded-xl border border-gray-700 flex-1 flex flex-col backdrop-blur-md">
                        <h3 className="font-bold text-[10px] mb-4 text-gray-500 uppercase tracking-[0.2em]">Neural Uplink</h3>
                        <div className="flex-1 overflow-y-auto mb-4 space-y-3 pr-2 custom-scrollbar">
                            {messages.map((msg, idx) => (
                                <div key={msg.id || idx} className={`flex flex-col ${msg.sender === 'User' ? 'items-end' : 'items-start'}`}>
                                    <div className={`max-w-[80%] rounded-lg p-2 text-xs ${msg.sender === 'User' ? 'bg-indigo-600' : 'bg-gray-700'
                                        }`}>
                                        <p>{msg.text}</p>
                                    </div>
                                    <span className="text-[8px] text-gray-600 mt-1 uppercase">{msg.sender}</span>
                                </div>
                            ))}
                            {messages.length === 0 && (
                                <p className="text-center text-[10px] text-gray-600 mt-10">NO DATA TRANSFERRED</p>
                            )}
                        </div>
                        <div className="relative">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                className="bg-black/50 border border-gray-700 rounded-lg px-3 py-2 text-xs w-full focus:outline-none focus:border-indigo-500 transition-colors"
                                placeholder="SEND SIGNAL..."
                            />
                            <button
                                onClick={sendMessage}
                                className="absolute right-2 top-1.5 p-1 text-indigo-500 hover:text-indigo-400"
                            >
                                <PaperAirplaneIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectWarRoom;
