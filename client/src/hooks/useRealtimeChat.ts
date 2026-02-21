import { useState, useEffect, useCallback, useRef } from 'react';

// Types
export interface ChatMessage {
    id: string;
    senderId: string;
    senderName: string;
    senderAvatar?: string;
    content: string;
    timestamp: Date;
    type: 'text' | 'file' | 'system';
    readBy: string[];
}

export interface ChatRoom {
    id: string;
    name: string;
    type: 'direct' | 'group' | 'team';
    participants: string[];
    lastMessage?: ChatMessage;
    unreadCount: number;
}

export interface UseRealtimeChatOptions {
    roomId: string;
    userId: string;
    userName: string;
    onNewMessage?: (message: ChatMessage) => void;
    onTyping?: (userId: string, isTyping: boolean) => void;
    onUserJoined?: (userId: string) => void;
    onUserLeft?: (userId: string) => void;
}

// Mock WebSocket for demonstration (replace with actual Socket.io in production)
class MockWebSocket {
    private listeners: Record<string, Function[]> = {};
    private isConnected = false;

    connect() {
        this.isConnected = true;
        setTimeout(() => this.emit('connect', {}), 100);
    }

    disconnect() {
        this.isConnected = false;
        this.emit('disconnect', {});
    }

    on(event: string, callback: Function) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    off(event: string, callback: Function) {
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
        }
    }

    emit(event: string, data: any) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(cb => cb(data));
        }
    }

    send(event: string, data: any) {
        // Simulate server echo for messages
        if (event === 'message') {
            setTimeout(() => {
                this.emit('message', {
                    ...data,
                    id: `msg_${Date.now()}`,
                    timestamp: new Date()
                });
            }, 50);
        }
    }
}

const mockSocket = new MockWebSocket();

export const useRealtimeChat = (options: UseRealtimeChatOptions) => {
    const { roomId, userId, userName, onNewMessage, onTyping, onUserJoined, onUserLeft } = options;

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [isTyping, setIsTyping] = useState<Record<string, boolean>>({});
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    const typingTimeoutRef = useRef<NodeJS.Timeout>();

    // Connect to chat room
    useEffect(() => {
        mockSocket.connect();

        mockSocket.on('connect', () => {
            setIsConnected(true);
            setLoading(false);
            // Join room
            mockSocket.send('join', { roomId, userId, userName });
        });

        mockSocket.on('disconnect', () => {
            setIsConnected(false);
        });

        mockSocket.on('message', (message: ChatMessage) => {
            setMessages(prev => [...prev, message]);
            onNewMessage?.(message);
        });

        mockSocket.on('typing', ({ userId: typingUserId, isTyping: typing }: { userId: string; isTyping: boolean }) => {
            setIsTyping(prev => ({ ...prev, [typingUserId]: typing }));
            onTyping?.(typingUserId, typing);
        });

        mockSocket.on('user_joined', ({ userId: joinedUserId }: { userId: string }) => {
            setOnlineUsers(prev => [...prev, joinedUserId]);
            onUserJoined?.(joinedUserId);
        });

        mockSocket.on('user_left', ({ userId: leftUserId }: { userId: string }) => {
            setOnlineUsers(prev => prev.filter(id => id !== leftUserId));
            onUserLeft?.(leftUserId);
        });

        // Load initial messages (mock)
        setMessages([
            {
                id: 'init_1',
                senderId: 'mentor_1',
                senderName: 'Sarah Chen',
                content: 'Welcome to the project chat! Feel free to ask any questions.',
                timestamp: new Date(Date.now() - 3600000),
                type: 'text',
                readBy: [userId]
            },
            {
                id: 'init_2',
                senderId: 'student_2',
                senderName: 'Alex Kim',
                content: 'Thanks! Just finished the first milestone 🎉',
                timestamp: new Date(Date.now() - 1800000),
                type: 'text',
                readBy: [userId]
            }
        ]);
        setOnlineUsers(['mentor_1', 'student_2']);
        setLoading(false);

        return () => {
            mockSocket.disconnect();
        };
    }, [roomId, userId, userName, onNewMessage, onTyping, onUserJoined, onUserLeft]);

    // Send message
    const sendMessage = useCallback((content: string, type: 'text' | 'file' = 'text') => {
        if (!content.trim()) return;

        const message: ChatMessage = {
            id: `temp_${Date.now()}`,
            senderId: userId,
            senderName: userName,
            content,
            timestamp: new Date(),
            type,
            readBy: [userId]
        };

        mockSocket.send('message', message);
    }, [userId, userName]);

    // Send typing indicator
    const sendTypingIndicator = useCallback((isTypingNow: boolean) => {
        mockSocket.send('typing', { roomId, userId, isTyping: isTypingNow });

        // Auto-stop typing after 3 seconds
        if (isTypingNow) {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            typingTimeoutRef.current = setTimeout(() => {
                mockSocket.send('typing', { roomId, userId, isTyping: false });
            }, 3000);
        }
    }, [roomId, userId]);

    // Mark messages as read
    const markAsRead = useCallback((messageIds: string[]) => {
        mockSocket.send('read', { roomId, userId, messageIds });
    }, [roomId, userId]);

    return {
        messages,
        isConnected,
        isTyping,
        onlineUsers,
        loading,
        sendMessage,
        sendTypingIndicator,
        markAsRead
    };
};

// Hook for managing chat rooms
export const useChatRooms = (userId: string) => {
    const [rooms, setRooms] = useState<ChatRoom[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock rooms - in production, fetch from API
        setRooms([
            {
                id: 'team_1',
                name: 'UI Design Project',
                type: 'team',
                participants: ['mentor_1', userId, 'student_2'],
                lastMessage: {
                    id: 'last_1',
                    senderId: 'mentor_1',
                    senderName: 'Sarah Chen',
                    content: 'Great progress today!',
                    timestamp: new Date(Date.now() - 300000),
                    type: 'text',
                    readBy: []
                },
                unreadCount: 2
            },
            {
                id: 'direct_1',
                name: 'Sarah Chen',
                type: 'direct',
                participants: ['mentor_1', userId],
                lastMessage: {
                    id: 'last_2',
                    senderId: 'mentor_1',
                    senderName: 'Sarah Chen',
                    content: 'Let me know if you need help!',
                    timestamp: new Date(Date.now() - 600000),
                    type: 'text',
                    readBy: [userId]
                },
                unreadCount: 0
            }
        ]);
        setLoading(false);
    }, [userId]);

    const createRoom = useCallback((name: string, type: 'direct' | 'group' | 'team', participants: string[]) => {
        const newRoom: ChatRoom = {
            id: `room_${Date.now()}`,
            name,
            type,
            participants: [...participants, userId],
            unreadCount: 0
        };
        setRooms(prev => [newRoom, ...prev]);
        return newRoom;
    }, [userId]);

    return { rooms, loading, createRoom };
};

export default useRealtimeChat;
