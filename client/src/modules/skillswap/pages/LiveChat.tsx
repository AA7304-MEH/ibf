import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChatBubbleLeftRightIcon,
    PaperAirplaneIcon,
    PaperClipIcon,
    FaceSmileIcon,
    UserGroupIcon,
    PhoneIcon,
    VideoCameraIcon,
    EllipsisHorizontalIcon,
    MagnifyingGlassIcon,
    XMarkIcon,
    PlusIcon,
    CheckIcon
} from '@heroicons/react/24/outline';

interface ChatMessage {
    id: string;
    senderId: string;
    senderName: string;
    content: string;
    timestamp: Date;
    type: 'text' | 'system';
}

interface ChatRoom {
    id: string;
    name: string;
    type: 'direct' | 'group' | 'team';
    participants: string[];
    lastMessage?: string;
    lastMessageTime?: Date;
    unreadCount: number;
    avatar?: string;
}

const LiveChat: React.FC = () => {
    const [rooms, setRooms] = useState<ChatRoom[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [showRooms, setShowRooms] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const userId = 'current_user';
    const userName = 'You';

    useEffect(() => {
        // Load mock rooms
        setTimeout(() => {
            setRooms([
                { id: '1', name: 'UI Design Project', type: 'team', participants: ['Sarah Chen', 'Alex Kim', 'You'], lastMessage: 'Great progress today!', lastMessageTime: new Date(Date.now() - 300000), unreadCount: 2 },
                { id: '2', name: 'Sarah Chen', type: 'direct', participants: ['Sarah Chen'], lastMessage: 'Let me know if you need help!', lastMessageTime: new Date(Date.now() - 600000), unreadCount: 0 },
                { id: '3', name: 'React Study Group', type: 'group', participants: ['Maya Patel', 'Jordan Lee', 'Riley Kim', 'You'], lastMessage: 'Check out this tutorial', lastMessageTime: new Date(Date.now() - 3600000), unreadCount: 5 },
                { id: '4', name: 'Mentor: David Brown', type: 'direct', participants: ['David Brown'], lastMessage: 'Your project looks great!', lastMessageTime: new Date(Date.now() - 7200000), unreadCount: 0 },
            ]);
            setLoading(false);
        }, 500);
    }, []);

    useEffect(() => {
        // Load messages when room changes
        if (selectedRoom) {
            setMessages([
                { id: '1', senderId: 'mentor_1', senderName: 'Sarah Chen', content: 'Welcome to the project chat! Feel free to ask any questions.', timestamp: new Date(Date.now() - 3600000), type: 'text' },
                { id: '2', senderId: 'student_2', senderName: 'Alex Kim', content: 'Thanks! Just finished the first milestone 🎉', timestamp: new Date(Date.now() - 1800000), type: 'text' },
                { id: '3', senderId: 'mentor_1', senderName: 'Sarah Chen', content: 'Great work! The UI looks really polished.', timestamp: new Date(Date.now() - 900000), type: 'text' },
                { id: '4', senderId: 'current_user', senderName: 'You', content: 'Should we schedule a review call?', timestamp: new Date(Date.now() - 600000), type: 'text' },
                { id: '5', senderId: 'mentor_1', senderName: 'Sarah Chen', content: 'Good idea! How about tomorrow at 3 PM?', timestamp: new Date(Date.now() - 300000), type: 'text' },
            ]);
            // Mark as read
            setRooms(prev => prev.map(r => r.id === selectedRoom.id ? { ...r, unreadCount: 0 } : r));
        }
    }, [selectedRoom]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (!newMessage.trim() || !selectedRoom) return;

        const newMsg: ChatMessage = {
            id: `msg_${Date.now()}`,
            senderId: userId,
            senderName: userName,
            content: newMessage,
            timestamp: new Date(),
            type: 'text'
        };

        setMessages(prev => [...prev, newMsg]);
        setNewMessage('');

        // Update room last message
        setRooms(prev => prev.map(r =>
            r.id === selectedRoom.id
                ? { ...r, lastMessage: newMessage, lastMessageTime: new Date() }
                : r
        ));

        // Simulate response after a delay
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            const responses = [
                'That sounds great!',
                'I agree with that approach.',
                'Let me think about it...',
                'Good point! 👍',
                'I\'ll get back to you on that.'
            ];
            const responseMsg: ChatMessage = {
                id: `msg_${Date.now() + 1}`,
                senderId: 'mentor_1',
                senderName: 'Sarah Chen',
                content: responses[Math.floor(Math.random() * responses.length)],
                timestamp: new Date(),
                type: 'text'
            };
            setMessages(prev => [...prev, responseMsg]);
        }, 1500);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const formatTime = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return date.toLocaleDateString();
    };

    const filteredRooms = rooms.filter(r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white text-lg">Loading chats...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="h-[calc(100vh-8rem)] bg-gray-800 rounded-2xl shadow-lg border border-gray-700 flex overflow-hidden">
                {/* Sidebar - Chat Rooms */}
                <AnimatePresence>
                    {showRooms && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 320, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className="border-r border-gray-700 flex flex-col bg-gray-850"
                        >
                            {/* Rooms Header */}
                            <div className="p-4 border-b border-gray-700">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-bold flex items-center gap-2">
                                        <ChatBubbleLeftRightIcon className="w-6 h-6 text-indigo-400" />
                                        Messages
                                    </h2>
                                    <button className="p-2 bg-indigo-600 rounded-lg hover:bg-indigo-700">
                                        <PlusIcon className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="relative">
                                    <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search conversations..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Room List */}
                            <div className="flex-1 overflow-y-auto">
                                {filteredRooms.map((room) => (
                                    <button
                                        key={room.id}
                                        onClick={() => setSelectedRoom(room)}
                                        className={`w-full p-4 flex items-center gap-3 hover:bg-gray-700/50 transition-colors ${selectedRoom?.id === room.id ? 'bg-indigo-600/20' : ''
                                            }`}
                                    >
                                        <div className="relative">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${room.type === 'team' ? 'bg-gradient-to-br from-indigo-400 to-purple-500' :
                                                    room.type === 'group' ? 'bg-gradient-to-br from-green-400 to-teal-500' :
                                                        'bg-gradient-to-br from-pink-400 to-rose-500'
                                                }`}>
                                                {room.type === 'team' ? (
                                                    <UserGroupIcon className="w-6 h-6" />
                                                ) : room.type === 'group' ? (
                                                    <UserGroupIcon className="w-6 h-6" />
                                                ) : (
                                                    room.name.charAt(0)
                                                )}
                                            </div>
                                            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-gray-800"></div>
                                        </div>
                                        <div className="flex-1 min-w-0 text-left">
                                            <div className="flex justify-between items-center">
                                                <p className="font-medium truncate">{room.name}</p>
                                                {room.lastMessageTime && (
                                                    <span className="text-xs text-gray-400">
                                                        {formatTime(room.lastMessageTime)}
                                                    </span>
                                                )}
                                            </div>
                                            {room.lastMessage && (
                                                <p className="text-sm text-gray-400 truncate">{room.lastMessage}</p>
                                            )}
                                        </div>
                                        {room.unreadCount > 0 && (
                                            <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                {room.unreadCount}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col">
                    {selectedRoom ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setShowRooms(!showRooms)}
                                        className="lg:hidden p-2 hover:bg-gray-700 rounded-lg"
                                    >
                                        <ChatBubbleLeftRightIcon className="w-5 h-5" />
                                    </button>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${selectedRoom.type === 'team' ? 'bg-gradient-to-br from-indigo-400 to-purple-500' :
                                            selectedRoom.type === 'group' ? 'bg-gradient-to-br from-green-400 to-teal-500' :
                                                'bg-gradient-to-br from-pink-400 to-rose-500'
                                        }`}>
                                        {selectedRoom.type !== 'direct' ? (
                                            <UserGroupIcon className="w-5 h-5" />
                                        ) : (
                                            selectedRoom.name.charAt(0)
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold">{selectedRoom.name}</p>
                                        <p className="text-xs text-gray-400">
                                            {selectedRoom.participants.length} members • {isTyping ? 'typing...' : 'online'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-2 hover:bg-gray-700 rounded-lg text-gray-400">
                                        <PhoneIcon className="w-5 h-5" />
                                    </button>
                                    <button className="p-2 hover:bg-gray-700 rounded-lg text-gray-400">
                                        <VideoCameraIcon className="w-5 h-5" />
                                    </button>
                                    <button className="p-2 hover:bg-gray-700 rounded-lg text-gray-400">
                                        <EllipsisHorizontalIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages.map((message) => {
                                    const isOwn = message.senderId === userId;
                                    return (
                                        <motion.div
                                            key={message.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`flex gap-2 max-w-[70%] ${isOwn ? 'flex-row-reverse' : ''}`}>
                                                {!isOwn && (
                                                    <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                        {message.senderName.charAt(0)}
                                                    </div>
                                                )}
                                                <div>
                                                    {!isOwn && (
                                                        <p className="text-xs text-gray-400 mb-1">{message.senderName}</p>
                                                    )}
                                                    <div
                                                        className={`rounded-2xl px-4 py-2 ${isOwn
                                                                ? 'bg-indigo-600 text-white rounded-br-none'
                                                                : 'bg-gray-700 text-white rounded-bl-none'
                                                            }`}
                                                    >
                                                        <p>{message.content}</p>
                                                    </div>
                                                    <p className={`text-xs text-gray-500 mt-1 ${isOwn ? 'text-right' : ''}`}>
                                                        {formatTime(message.timestamp)}
                                                        {isOwn && <CheckIcon className="w-3 h-3 inline ml-1 text-indigo-400" />}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}

                                {/* Typing Indicator */}
                                {isTyping && (
                                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                        <span>Sarah is typing...</span>
                                    </div>
                                )}
                                <div ref={messagesEndRef}></div>
                            </div>

                            {/* Message Input */}
                            <div className="p-4 border-t border-gray-700">
                                <div className="flex items-center gap-3">
                                    <button className="p-2 hover:bg-gray-700 rounded-lg text-gray-400">
                                        <PaperClipIcon className="w-5 h-5" />
                                    </button>
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Type a message..."
                                        className="flex-1 bg-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    />
                                    <button className="p-2 hover:bg-gray-700 rounded-lg text-gray-400">
                                        <FaceSmileIcon className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={handleSend}
                                        disabled={!newMessage.trim()}
                                        className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <PaperAirplaneIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-400">
                            <div className="text-center">
                                <ChatBubbleLeftRightIcon className="w-20 h-20 mx-auto mb-4 text-gray-600" />
                                <p className="text-xl font-medium mb-2">Select a conversation</p>
                                <p className="text-gray-500">Choose a chat from the sidebar to start messaging</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LiveChat;
