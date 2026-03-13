import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatBubbleLeftRightIcon, XMarkIcon } from '@heroicons/react/24/solid';

const LiveChatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);

    const toggleFullScreen = () => setIsFullScreen(!isFullScreen);

    return (
        <div className={`fixed z-[60] font-sans transition-all duration-300 ${
            isFullScreen 
            ? 'inset-0 m-0 w-full h-full' 
            : 'bottom-6 right-6'
        }`}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className={`bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col transition-all duration-300 ${
                            isFullScreen 
                            ? 'w-full h-full rounded-0' 
                            : 'mb-4 w-[350px] md:w-[400px] h-[500px] md:h-[600px] rounded-2xl'
                        }`}
                    >
                        {/* Header */}
                        <div className="bg-blue-600 p-4 flex justify-between items-center text-white shrink-0">
                            <div className="flex items-center">
                                <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
                                <span className="font-bold">IBF Live Support</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={toggleFullScreen}
                                    className="hover:bg-white/20 rounded-full p-1 transition-colors"
                                    title={isFullScreen ? "Minimize" : "Full Screen"}
                                >
                                    {isFullScreen ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3 3m12 6V4.5M15 9h4.5M15 9l6-6M9 15v4.5M9 15H4.5M9 15l-6 6m12-6v4.5M15 15h4.5M15 15l6 6" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                                        </svg>
                                    )}
                                </button>
                                <button 
                                    onClick={() => {
                                        setIsOpen(false);
                                        setIsFullScreen(false);
                                    }} 
                                    className="hover:bg-white/20 rounded-full p-1 transition-colors"
                                >
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Iframe Body - Cropped to hide "Made with Replit" badge */}
                        <div className="flex-1 bg-gray-50 dark:bg-gray-800 relative overflow-hidden">
                            <div className="absolute inset-x-0 top-0 bottom-[-50px]">
                                <iframe
                                    src="https://chatbot-live--adityamehra001.replit.app/"
                                    title="IBF Live Chatbot"
                                    className="w-full h-full border-none"
                                />
                            </div>
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
