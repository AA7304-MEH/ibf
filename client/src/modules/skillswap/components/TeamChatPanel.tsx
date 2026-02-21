import React, { useState, useEffect, useRef } from 'react';
import { ChatBubbleLeftRightIcon, PaperAirplaneIcon, UserCircleIcon, PaperClipIcon } from '@heroicons/react/24/outline';

interface Message {
    id: string;
    sender: 'user' | 'mentor';
    senderName: string;
    content: string;
    timestamp: Date;
}

const TeamChatPanel: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', sender: 'mentor', senderName: 'Sarah (Mentor)', content: 'Hey! How\'s the landing page coming along?', timestamp: new Date(Date.now() - 3600000) },
        { id: '2', sender: 'user', senderName: 'You', content: 'Great! Just finished the hero section. Working on responsiveness now.', timestamp: new Date(Date.now() - 3000000) },
        { id: '3', sender: 'mentor', senderName: 'Sarah (Mentor)', content: 'Awesome! Remember to test on mobile. Let me know if you need any design assets.', timestamp: new Date(Date.now() - 1800000) },
    ]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = () => {
        if (!newMessage.trim()) return;
        setMessages([...messages, {
            id: Date.now().toString(),
            sender: 'user',
            senderName: 'You',
            content: newMessage,
            timestamp: new Date()
        }]);
        setNewMessage('');

        // Simulate mentor response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                sender: 'mentor',
                senderName: 'Sarah (Mentor)',
                content: 'Got it! Keep up the great work! 🚀',
                timestamp: new Date()
            }]);
        }, 2000);
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-[400px]">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <ChatBubbleLeftRightIcon className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white">Team Chat</h3>
                    <p className="text-xs text-gray-500">TechStartup Inc. • Landing Page Project</p>
                </div>
                <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-xs text-gray-500">Online</span>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[75%] ${msg.sender === 'user' ? 'order-2' : ''}`}>
                            <div className="flex items-center gap-2 mb-1">
                                {msg.sender === 'mentor' && (
                                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                        S
                                    </div>
                                )}
                                <span className="text-xs text-gray-500">{msg.senderName}</span>
                                <span className="text-xs text-gray-400">{formatTime(msg.timestamp)}</span>
                            </div>
                            <div
                                className={`p-3 rounded-2xl ${msg.sender === 'user'
                                    ? 'bg-indigo-600 text-white rounded-br-none'
                                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none shadow-sm'
                                    }`}
                            >
                                <p className="text-sm">{msg.content}</p>
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                        <PaperClipIcon className="w-5 h-5" />
                    </button>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <button
                        onClick={sendMessage}
                        className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
                    >
                        <PaperAirplaneIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TeamChatPanel;
