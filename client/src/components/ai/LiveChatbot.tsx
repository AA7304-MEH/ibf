import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatBubbleLeftRightIcon, XMarkIcon } from '@heroicons/react/24/solid';

const LiveChatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-[60] font-sans">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="mb-4 w-[350px] md:w-[400px] h-[500px] md:h-[600px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="bg-blue-600 p-4 flex justify-between items-center text-white shrink-0">
                            <div className="flex items-center">
                                <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
                                <span className="font-bold">IBF Live Support</span>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)} 
                                className="hover:bg-white/20 rounded-full p-1 transition-colors"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Iframe Body */}
                        <div className="flex-1 bg-gray-50 dark:bg-gray-800">
                            <iframe
                                src="https://chatbot-live--adityamehra001.replit.app/"
                                title="IBF Live Chatbot"
                                className="w-full h-full border-none"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Trigger Button */}
            {!isOpen && (
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(true)}
                    className="w-16 h-16 bg-blue-600 rounded-full shadow-2xl flex items-center justify-center text-white border-4 border-white dark:border-gray-800 hover:bg-blue-700 transition-colors"
                >
                    <ChatBubbleLeftRightIcon className="w-8 h-8" />
                </motion.button>
            )}
        </div>
    );
};

export default LiveChatbot;
