import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SparklesIcon, XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/solid';

const AICopilot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'ai', text: "Hello! I'm your Quantum Learning Companion. I noticed you're exploring the Digital Twin Workspace. Need a quick tour?" }
    ]);
    const [input, setInput] = useState('');

    const toggle = () => setIsOpen(!isOpen);

    const sendMessage = () => {
        if (!input.trim()) return;
        setMessages([...messages, { role: 'user', text: input }]);
        setInput('');

        // Mock AI Response with Micro-Learning Injection
        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: 'ai',
                text: "I'm analyzing your request... This simulation suggests focusing on the Design Dimensions first.",
                hasMicroLearning: true,
                microLesson: "💡 Micro-Lesson: 'Prototyping' is the process of creating a preliminary model of a product. Try using the 3D tool!"
            }]);
        }, 1000);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="mb-4 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-4 flex justify-between items-center text-white">
                            <div className="flex items-center">
                                <SparklesIcon className="w-5 h-5 mr-2" />
                                <span className="font-bold">Co-Pilot AI</span>
                            </div>
                            <button onClick={toggle} className="hover:bg-white/20 rounded-full p-1">
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Chat Body */}
                        <div className="h-64 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-800/50">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${msg.role === 'user'
                                            ? 'bg-blue-600 text-white rounded-br-none'
                                            : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm border border-gray-100 dark:border-gray-600 rounded-bl-none'
                                        }`}>
                                        {msg.text}
                                        {(msg as any).hasMicroLearning && (
                                            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600 text-xs text-indigo-400 font-bold">
                                                {(msg as any).microLesson}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex items-center">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                placeholder="Ask me anything..."
                                className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                            />
                            <button
                                onClick={sendMessage}
                                className="ml-2 bg-violet-600 text-white p-2 rounded-full hover:bg-violet-700 transition-colors"
                            >
                                <PaperAirplaneIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Trigger Button */}
            {!isOpen && (
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggle}
                    className="w-14 h-14 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full shadow-lg flex items-center justify-center text-white border-4 border-white dark:border-gray-800"
                >
                    <SparklesIcon className="w-7 h-7" />
                </motion.button>
            )}
        </div>
    );
};

export default AICopilot;
