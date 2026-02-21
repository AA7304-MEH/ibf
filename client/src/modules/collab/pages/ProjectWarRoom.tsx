import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ClockIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { io, Socket } from 'socket.io-client';

const ProjectWarRoom: React.FC = () => {
    const projectId = "alpha-protocol"; // Scalable: get from URL params
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [blocks, setBlocks] = useState([
        { id: 'auth', title: 'AuthService', x: 100, y: 100, color: 'blue' },
        { id: 'payment', title: 'PaymentGateway', x: 400, y: 300, color: 'purple' }
    ]);

    useEffect(() => {
        const s = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
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

        return () => {
            s.disconnect();
        };
    }, []);

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
                    <div className="absolute top-4 left-4 z-10 bg-gray-900/80 px-3 py-1 rounded text-[10px] text-green-400 border border-green-900 font-bold uppercase tracking-widest">
                        Neural Architecture Spatializer v1.0
                    </div>

                    <div className="absolute inset-0 p-8">
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
