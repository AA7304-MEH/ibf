import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LightBulbIcon, FireIcon, HandThumbUpIcon, ChatBubbleLeftRightIcon, SparklesIcon, PaperAirplaneIcon } from '@heroicons/react/24/solid';

const FounderCopilot: React.FC = () => {
    const [messages, setMessages] = useState<any[]>([
        { role: 'ai', text: "I've detected a high-stress pattern in your recent communications. You have a board meeting in 48 hours.", recommendation: "Schedule a 2-hour 'Deep Work' block tomorrow morning to finalize the deck. I've drafted 3 key talking points for the 'Revenue Miss' objection." }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [cognitiveLoad, setCognitiveLoad] = useState(75);
    const [mentalState, setMentalState] = useState('Peak Performance');

    useEffect(() => {
        const interval = setInterval(() => {
            setCognitiveLoad(prev => Math.min(100, Math.max(0, prev + (Math.random() * 4 - 2))));
            const states = ['Peak Performance', 'Flow State', 'Cognitive Fatigue', 'Strategic Focus'];
            setMentalState(states[Math.floor(Math.random() * states.length)]);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleSend = async (text?: string) => {
        const msgText = text || input;
        if (!msgText.trim()) return;

        const newMessages = [...messages, { role: 'user', text: msgText }];
        setMessages(newMessages);
        setInput('');
        setIsTyping(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/incubator/copilot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ prompt: msgText, startupId: 'startup_001' }) // Mock startupId for dev
            });

            const data = await response.json();
            setIsTyping(false);

            if (data.advice) {
                setMessages((prev: any[]) => [...prev, { role: 'ai', text: data.advice }]);
            } else {
                setMessages((prev: any[]) => [...prev, { role: 'ai', text: "I'm processing that. Let's dig deeper into your strategy." }]);
            }
        } catch (error) {
            console.error('Copilot Error:', error);
            setIsTyping(false);
            setMessages((prev: any[]) => [...prev, { role: 'ai', text: "Connection error. Please check your neural link." }]);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 border-b-2 border-indigo-500 inline-block mb-1">Founder OS: Cognitive Augmentation</h1>
                    <p className="text-gray-500">Neural support for high-stakes decision making.</p>
                </div>
                <div className="text-right">
                    <span className="text-xs font-bold text-gray-400 uppercase">System Status</span>
                    <div className="flex items-center gap-2 text-green-500 font-mono text-sm">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        Neural Link Stable
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main AI Chat Interface */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex flex-col h-[650px]">
                    <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-4 text-white flex justify-between items-center">
                        <div className="flex items-center">
                            <LightBulbIcon className="w-6 h-6 mr-2" />
                            <span className="font-bold text-lg">CEO Copilot v4.2</span>
                        </div>
                        <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
                            Mental State: {mentalState}
                        </span>
                    </div>

                    <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-gray-50/50">
                        {messages.map((msg: any, idx: number) => (
                            <div key={idx} className={`flex items-start ${msg.role === 'user' ? 'justify-end' : ''}`}>
                                {msg.role === 'ai' && (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-4 flex-shrink-0 shadow-lg border-2 border-white">
                                        <SparklesIcon className="w-5 h-5 text-white" />
                                    </div>
                                )}
                                <div className={`p-4 rounded-2xl shadow-sm border ${msg.role === 'user'
                                    ? 'bg-indigo-600 text-white rounded-tr-none border-indigo-500 max-w-lg'
                                    : 'bg-white text-gray-800 rounded-tl-none border-gray-100 max-w-xl'
                                    }`}>
                                    <p className={msg.role === 'user' ? 'text-white' : 'text-gray-800'}>{msg.text}</p>

                                    {msg.recommendation && (
                                        <div className="mt-4 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                                            <p className="text-xs font-bold text-indigo-800 uppercase mb-1 flex items-center gap-1">
                                                <FireIcon className="w-3 h-3" /> Proactive Insight
                                            </p>
                                            <p className="text-sm text-indigo-700 leading-relaxed font-medium">{msg.recommendation}</p>
                                        </div>
                                    )}

                                    {msg.items && msg.items.length > 0 && (
                                        <div className="mt-4 space-y-2">
                                            {msg.items.map((item: any, i: number) => (
                                                <button
                                                    key={i}
                                                    onClick={() => handleSend(`Tell me more about ${item.title}`)}
                                                    className="w-full text-left p-3 hover:bg-gray-50 bg-white border border-gray-200 rounded-xl transition flex items-start group"
                                                >
                                                    <ChatBubbleLeftRightIcon className="w-5 h-5 text-gray-400 mr-3 mt-0.5 group-hover:text-indigo-500 transition-colors" />
                                                    <div>
                                                        <p className="font-bold text-sm text-gray-900">{item.title}</p>
                                                        <p className="text-xs text-gray-500">{item.desc}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {msg.role === 'user' && (
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center ml-4 flex-shrink-0 border-2 border-white shadow-md">
                                        👤
                                    </div>
                                )}
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex items-center gap-2 text-gray-400 text-sm font-medium ml-14">
                                <span className="animate-bounce">●</span>
                                <span className="animate-bounce [animation-delay:0.2s]">●</span>
                                <span className="animate-bounce [animation-delay:0.4s]">●</span>
                                <span className="ml-1">Synthesizing strategy...</span>
                            </div>
                        )}
                    </div>

                    <div className="p-4 bg-white border-t border-gray-200">
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Command CEO Copilot (e.g. 'Analyze burn rate' or 'Prep board deck')..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-full pl-6 pr-14 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                            />
                            <button
                                onClick={() => handleSend()}
                                disabled={!input.trim() || isTyping}
                                className="absolute right-2 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition disabled:opacity-50"
                            >
                                <PaperAirplaneIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="mt-3 flex gap-4 overflow-x-auto pb-1 no-scrollbar">
                            <button
                                onClick={() => handleSend("Analyze our current burn rate")}
                                className="whitespace-nowrap px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-bold text-gray-600 transition"
                            >
                                📉 Burn Rate Scan
                            </button>
                            <button
                                onClick={() => handleSend("Show board objection handlers")}
                                className="whitespace-nowrap px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-bold text-gray-600 transition"
                            >
                                🛡️ Objection Handlers
                            </button>
                            <button
                                onClick={() => handleSend("Simulate next funding round")}
                                className="whitespace-nowrap px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-bold text-gray-600 transition"
                            >
                                🚀 Fundraise Simulation
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-6">
                    {/* Burnout Meter */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-900 uppercase tracking-tight text-sm">Cognitive Load</h3>
                            <FireIcon className={`w-5 h-5 ${cognitiveLoad > 70 ? 'text-orange-500 animate-pulse' : 'text-green-500'}`} />
                        </div>
                        <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${cognitiveLoad}%` }}
                                className={`absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-orange-500 transition-all duration-1000`}
                            />
                        </div>
                        <div className="flex justify-between mt-2 text-[10px] font-bold text-gray-400 uppercase">
                            <span>Fresh</span>
                            <span className={cognitiveLoad > 70 ? 'text-orange-600' : 'text-green-600'}>
                                {cognitiveLoad > 70 ? 'High' : 'Normal'} ({cognitiveLoad}%)
                            </span>
                            <span>Critical</span>
                        </div>
                        <div className="mt-4 p-3 bg-orange-50 rounded-xl border border-orange-100">
                            <p className="text-xs text-orange-800 italic leading-relaxed font-medium">
                                "You've been in meetings for 6 hours. I've automatically moved your 4 PM sync to tomorrow to preserve executive function."
                            </p>
                        </div>
                    </motion.div>

                    {/* Skill Calibration */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-900 uppercase tracking-tight text-sm">Leadership DNA</h3>
                            <HandThumbUpIcon className="w-5 h-5 text-indigo-500" />
                        </div>
                        <div className="space-y-4">
                            {[
                                { label: 'Strategic Vision', val: 92, color: 'bg-indigo-600' },
                                { label: 'Operational Discipline', val: 65, color: 'bg-amber-500' },
                                { label: 'Mental Fortitude', val: 88, color: 'bg-purple-600' },
                                { label: 'Investor Relations', val: 74, color: 'bg-blue-600' }
                            ].map((skill, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-xs font-bold mb-1.5 text-gray-600">
                                        <span>{skill.label}</span>
                                        <span>{skill.val}/100</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${skill.val}%` }}
                                            transition={{ duration: 1.5, delay: 0.5 + (i * 0.1) }}
                                            className={`h-full ${skill.color} rounded-full`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-2 border-2 border-indigo-50 hover:bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold transition-colors uppercase tracking-widest">
                            Run Full Neural Audit
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default FounderCopilot;
