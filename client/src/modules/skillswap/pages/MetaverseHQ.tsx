import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BuildingOffice2Icon,
    UserGroupIcon,
    ChatBubbleLeftRightIcon,
    CalendarIcon,
    SparklesIcon,
    CubeIcon,
    VideoCameraIcon,
    BookOpenIcon,
    TrophyIcon,
    ArrowRightIcon,
    XMarkIcon,
    MicrophoneIcon,
    SpeakerWaveIcon,
    Cog6ToothIcon,
    PlusIcon,
    VideoCameraSlashIcon,
    PhoneXMarkIcon,
    ComputerDesktopIcon,
    PaperAirplaneIcon,
    ShareIcon,
    LinkIcon,
    ClipboardDocumentIcon,
    CheckIcon,
    HandRaisedIcon,
    FaceSmileIcon,
    InformationCircleIcon,
    ExclamationTriangleIcon,
    GlobeAltIcon
} from '@heroicons/react/24/outline';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Text, PerspectiveCamera, OrbitControls, Environment, ContactShadows, Stars, Line } from '@react-three/drei';
import * as THREE from 'three';

interface Room {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    occupancy: number;
    maxOccupancy: number;
    isLive: boolean;
    nextEvent?: string;
    isCustom?: boolean;
    type?: 'social' | 'study' | 'challenge' | 'event';
    resources?: RoomResource[];
}

interface RoomResource {
    id: string;
    title: string;
    type: 'doc' | 'drive' | 'link' | 'video';
    url: string;
    addedBy: string;
}

interface OnlineUser {
    id: string;
    name: string;
    avatar?: string;
    status: 'online' | 'busy' | 'away';
    activity: string;
    handRaised?: boolean;
}

interface ChatMessage {
    id: string;
    sender: string;
    content: string;
    timestamp: Date;
}

interface Reaction {
    id: string;
    emoji: string;
    senderId: string;
    timestamp: number;
}

// --- 3D Components for Ecosystem Brain ---

const RoomNode = ({
    room,
    position,
    isSelected,
    onClick
}: {
    room: Room,
    position: [number, number, number],
    isSelected: boolean,
    onClick: () => void
}) => {
    return (
        <group position={position}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <Sphere args={[0.7, 32, 32]} onClick={(e) => { e.stopPropagation(); onClick(); }}>
                    <meshStandardMaterial
                        color={isSelected ? "#6366f1" : "#1e293b"}
                        emissive={isSelected ? "#6366f1" : "#000000"}
                        emissiveIntensity={0.5}
                        roughness={0.1}
                        metalness={0.9}
                    />
                </Sphere>
                <Text
                    position={[0, 0, 0.72]}
                    fontSize={0.4}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                >
                    {room.icon}
                </Text>
            </Float>
            <Text
                position={[0, 1.2, 0]}
                fontSize={0.2}
                color={isSelected ? "#818cf8" : "#94a3b8"}
                anchorX="center"
                anchorY="middle"
            >
                {room.name.toUpperCase()}
            </Text>
            <Text
                position={[0, -1.2, 0]}
                fontSize={0.15}
                color="#64748b"
                anchorX="center"
                anchorY="middle"
            >
                {room.occupancy}/{room.maxOccupancy}
            </Text>
        </group>
    );
};

const EcosystemBrain = ({ rooms, onSelectRoom, selectedRoomId }: {
    rooms: Room[],
    onSelectRoom: (room: Room) => void,
    selectedRoomId?: string
}) => {
    // Distribute rooms in a spherical layout
    const positions = useMemo(() => {
        return rooms.map((_, i) => {
            const phi = Math.acos(-1 + (2 * i) / rooms.length);
            const theta = Math.sqrt(rooms.length * Math.PI) * phi;
            const r = 5;
            return [
                r * Math.cos(theta) * Math.sin(phi),
                r * Math.sin(theta) * Math.sin(phi),
                r * Math.cos(phi)
            ] as [number, number, number];
        });
    }, [rooms]);

    return (
        <group>
            {rooms.map((room, i) => (
                <React.Fragment key={room.id}>
                    <RoomNode
                        room={room}
                        position={positions[i]}
                        isSelected={selectedRoomId === room.id}
                        onClick={() => onSelectRoom(room)}
                    />
                    {/* Neural filaments between nodes */}
                    {i > 0 && (
                        <Line
                            points={[positions[0], positions[i]]}
                            color="#4f46e5"
                            lineWidth={1}
                            transparent
                            opacity={0.1}
                        />
                    )}
                </React.Fragment>
            ))}
        </group>
    );
};

const MetaverseHQ: React.FC = () => {
    // ... (existing hooks)
    const { roomId } = useParams<{ roomId?: string }>();
    const navigate = useNavigate();

    const [rooms, setRooms] = useState<Room[]>([]);
    const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [isJoining, setIsJoining] = useState(false);
    const [joinedRoom, setJoinedRoom] = useState<Room | null>(null);
    const [micEnabled, setMicEnabled] = useState(true);
    const [speakerEnabled, setSpeakerEnabled] = useState(true);
    const [videoEnabled, setVideoEnabled] = useState(true);
    const [showCreateRoom, setShowCreateRoom] = useState(false);
    const [showVideoCall, setShowVideoCall] = useState(false);
    const [newRoom, setNewRoom] = useState({ name: '', description: '', icon: '🎯', maxOccupancy: 20 });
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [newChatMessage, setNewChatMessage] = useState('');
    const [showChat, setShowChat] = useState(true);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [linkCopied, setLinkCopied] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showResources, setShowResources] = useState(false);
    const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');

    // Settings & Notifications
    const [showSettings, setShowSettings] = useState(false);
    const [settings, setSettings] = useState({ camera: 'Default Camera', microphone: 'Default Microphone', output: 'Default Output' });
    const [toast, setToast] = useState<{ msg: string, type: 'info' | 'success' | 'error' } | null>(null);

    const showToastMsg = (msg: string, type: 'info' | 'success' | 'error' = 'info') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    // Team Meeting Features
    const [handRaised, setHandRaised] = useState(false);
    const [reactions, setReactions] = useState<Reaction[]>([]);
    const [showReactionMenu, setShowReactionMenu] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const screenRef = useRef<HTMLVideoElement>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const emojis = ['👍', '❤️', '😂', '🎉', '👏', '😮'];

    const roomIcons = ['🎯', '💻', '🎨', '🎓', '⚔️', '🎭', '🎵', '📚', '🚀', '💡', '🌟', '🎮'];
    const roomColors = [
        'from-indigo-500 to-purple-500',
        'from-blue-500 to-cyan-500',
        'from-pink-500 to-rose-500',
        'from-green-500 to-emerald-500',
        'from-amber-500 to-orange-500',
        'from-purple-500 to-violet-500',
        'from-red-500 to-pink-500',
        'from-teal-500 to-cyan-500'
    ];

    // Memoize particle positions
    const particles = useMemo(() =>
        Array.from({ length: 8 }, (_, i) => ({
            id: i,
            left: `${(i * 12) + 5}%`,
            top: `${(i * 10) + 10}%`,
            duration: 3 + (i % 3),
            delay: i * 0.3
        })), []
    );

    useEffect(() => {
        setTimeout(() => {
            setRooms([
                {
                    id: '1',
                    name: 'Main Lobby',
                    description: 'Welcome hub for all learners',
                    icon: '🏛️',
                    color: 'from-indigo-500 to-purple-500',
                    occupancy: 24,
                    maxOccupancy: 100,
                    isLive: true,
                    type: 'social',
                    resources: [
                        { id: 'r1', title: 'Community Guidelines', type: 'doc', url: '#', addedBy: 'Admin' },
                        { id: 'r2', title: 'Event Schedule', type: 'link', url: '#', addedBy: 'Admin' }
                    ]
                },
                {
                    id: '2',
                    name: 'Tech Lab',
                    description: 'Code together, learn together',
                    icon: '💻',
                    color: 'from-blue-500 to-cyan-500',
                    occupancy: 12,
                    maxOccupancy: 30,
                    isLive: true,
                    nextEvent: 'React Workshop at 3 PM',
                    type: 'study',
                    resources: [
                        { id: 'r3', title: 'React Documentation', type: 'doc', url: '#', addedBy: 'Sarah' },
                        { id: 'r4', title: 'Code Snippets Repository', type: 'drive', url: '#', addedBy: 'Mike' },
                        { id: 'r5', title: 'VS Code Setup Guide', type: 'video', url: '#', addedBy: 'Admin' }
                    ]
                },
                {
                    id: '3',
                    name: 'Design Studio',
                    description: 'Creative collaboration space',
                    icon: '🎨',
                    color: 'from-pink-500 to-rose-500',
                    occupancy: 8,
                    maxOccupancy: 20,
                    isLive: true,
                    type: 'study',
                    resources: [
                        { id: 'r6', title: 'Figma Assets', type: 'drive', url: '#', addedBy: 'DesignTeam' },
                        { id: 'r7', title: 'Color Palette Guide', type: 'doc', url: '#', addedBy: 'Admin' }
                    ]
                },
                {
                    id: '4',
                    name: 'Mentor Lounge',
                    description: 'Connect with industry mentors',
                    icon: '🎓',
                    color: 'from-green-500 to-emerald-500',
                    occupancy: 5,
                    maxOccupancy: 15,
                    isLive: true,
                    nextEvent: 'Career Q&A at 4 PM',
                    type: 'social',
                    resources: []
                },
                {
                    id: '5',
                    name: 'Arena',
                    description: 'Compete in skill challenges',
                    icon: '⚔️',
                    color: 'from-amber-500 to-orange-500',
                    occupancy: 18,
                    maxOccupancy: 50,
                    isLive: true,
                    nextEvent: 'Coding Battle starting soon!',
                    type: 'challenge',
                    resources: [
                        { id: 'r8', title: 'Battle Rules', type: 'doc', url: '#', addedBy: 'Admin' },
                        { id: 'r9', title: 'Leaderboard', type: 'link', url: '#', addedBy: 'System' },
                        { id: 'r10', title: 'Past Challenge Solutions', type: 'drive', url: '#', addedBy: 'Admin' }
                    ]
                },
                {
                    id: '6',
                    name: 'Auditorium',
                    description: 'Live events and webinars',
                    icon: '🎭',
                    color: 'from-purple-500 to-violet-500',
                    occupancy: 0,
                    maxOccupancy: 200,
                    isLive: false,
                    nextEvent: 'Guest Speaker at 5 PM',
                    type: 'event',
                    resources: []
                }
            ]);
            setOnlineUsers([
                { id: '1', name: 'Alex Chen', status: 'online', activity: 'In Tech Lab', handRaised: false },
                { id: '2', name: 'Maya Patel', status: 'busy', activity: 'Coding Challenge', handRaised: false },
                { id: '3', name: 'Jordan Lee', status: 'online', activity: 'Design Studio', handRaised: false },
                { id: '5', name: 'Riley Kim', status: 'online', activity: 'Main Lobby', handRaised: false }
            ]);

            // Initialize User in Main Lobby
            setJoinedRoom({
                id: '1',
                name: 'Main Lobby',
                description: 'Welcome hub for all learners',
                icon: '🏛️',
                color: 'from-indigo-500 to-purple-500',
                occupancy: 24,
                maxOccupancy: 100,
                isLive: true,
                type: 'social',
                resources: [
                    { id: 'r1', title: 'Community Guidelines', type: 'doc', url: '#', addedBy: 'Admin' },
                    { id: 'r2', title: 'Event Schedule', type: 'link', url: '#', addedBy: 'Admin' }
                ]
            });

            setLoading(false);
        }, 500);
    }, []);

    // Cleanup streams on unmount
    useEffect(() => {
        return () => {
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
            if (screenStream) {
                screenStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [localStream, screenStream]);

    // Auto-scroll chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    // Attach video stream to video element
    useEffect(() => {
        if (videoRef.current && localStream) {
            videoRef.current.srcObject = localStream;
        }
    }, [localStream, showVideoCall]);

    // Attach screen stream
    useEffect(() => {
        if (screenRef.current && screenStream) {
            screenRef.current.srcObject = screenStream;
        }
    }, [screenStream]);

    // Auto-join room from URL parameter
    useEffect(() => {
        if (roomId && rooms.length > 0 && !joinedRoom && !loading) {
            const room = rooms.find(r => r.id === roomId);
            if (room && room.isLive) {
                handleJoinRoom(room);
            }
        }
    }, [roomId, rooms, loading]);

    // Generate shareable room link
    const getRoomShareLink = useCallback((room: Room) => {
        const baseUrl = window.location.origin;
        return `${baseUrl}/skillswap/metaverse/room/${room.id}`;
    }, []);

    // Copy room link to clipboard
    const copyRoomLink = useCallback(async (room: Room) => {
        const link = getRoomShareLink(room);
        try {
            await navigator.clipboard.writeText(link);
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 3000);
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = link;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 3000);
        }
    }, [getRoomShareLink]);

    // Web Share API for native sharing
    const shareRoom = useCallback(async (room: Room) => {
        const link = getRoomShareLink(room);
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Join ${room.name} on SkillSwap`,
                    text: `Join me in ${room.name}: ${room.description}`,
                    url: link
                });
            } catch (err) {
                // User cancelled or error
                copyRoomLink(room);
            }
        } else {
            setShowShareModal(true);
        }
    }, [getRoomShareLink, copyRoomLink]);

    const handleJoinRoom = (room: Room) => {
        setIsJoining(true);
        setTimeout(() => {
            setJoinedRoom(room);
            setSelectedRoom(null);
            setIsJoining(false);
            setRooms(prev => prev.map(r =>
                r.id === room.id ? { ...r, occupancy: r.occupancy + 1 } : r
            ));
            // Update URL to shareable link
            navigate(`/skillswap/metaverse/room/${room.id}`, { replace: true });
        }, 1500);
    };

    const handleLeaveRoom = () => {
        if (joinedRoom) {
            stopVideoCall();
            setRooms(prev => prev.map(r =>
                r.id === joinedRoom.id ? { ...r, occupancy: Math.max(0, r.occupancy - 1) } : r
            ));
            setJoinedRoom(null);
            setChatMessages([]);
            setHandRaised(false);
            setReactions([]);
            // Navigate back to main metaverse page
            navigate('/skillswap/metaverse', { replace: true });
        }
    };

    // Toggle Hand Raise
    const toggleHand = useCallback(() => {
        setHandRaised(prev => {
            const newState = !prev;
            if (newState) {
                setChatMessages(prevMsgs => [...prevMsgs, {
                    id: `sys_${Date.now()}`,
                    sender: 'System',
                    content: 'You raised your hand ✋',
                    timestamp: new Date()
                }]);
            }
            return newState;
        });
    }, []);

    // Send Reaction
    const sendReaction = useCallback((emoji: string) => {
        const newReaction: Reaction = {
            id: `react_${Date.now()}`,
            emoji,
            senderId: 'local',
            timestamp: Date.now()
        };
        setReactions(prev => [...prev, newReaction]);
        setShowReactionMenu(false);
    }, []);

    // Cleanup old reactions
    useEffect(() => {
        if (reactions.length === 0) return;

        const timer = setInterval(() => {
            const now = Date.now();
            setReactions(prev => prev.filter(r => now - r.timestamp < 3000));
        }, 1000);

        return () => clearInterval(timer);
    }, [reactions]);

    // Simulate incoming reactions/hand raises
    useEffect(() => {
        if (!showVideoCall || onlineUsers.length === 0) return;

        const interval = setInterval(() => {
            if (Math.random() > 0.7) {
                const randomUser = onlineUsers[Math.floor(Math.random() * onlineUsers.length)];
                const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

                setReactions(prev => [...prev, {
                    id: `react_${Date.now()}_${randomUser.id}`,
                    emoji: randomEmoji,
                    senderId: randomUser.id,
                    timestamp: Date.now()
                }]);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [showVideoCall, onlineUsers]);

    const handleCreateRoom = () => {
        if (!newRoom.name.trim()) return;

        const room: Room = {
            id: `custom_${Date.now()}`,
            name: newRoom.name,
            description: newRoom.description || 'Custom room',
            icon: newRoom.icon,
            color: roomColors[Math.floor(Math.random() * roomColors.length)],
            occupancy: 0,
            maxOccupancy: newRoom.maxOccupancy,
            isLive: true,
            isCustom: true
        };

        setRooms(prev => [room, ...prev]);
        setShowCreateRoom(false);
        setNewRoom({ name: '', description: '', icon: '🎯', maxOccupancy: 20 });
    };

    const startVideoCall = useCallback(async () => {
        setCameraError(null);
        try {
            // Request camera and microphone with optimal settings
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'user'
                },
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });

            setLocalStream(stream);
            setVideoEnabled(true);
            setMicEnabled(true);
            setShowVideoCall(true);

            // Add initial chat messages
            setChatMessages([
                { id: '1', sender: 'System', content: 'Video call started. Camera and microphone are active.', timestamp: new Date() },
                { id: '2', sender: 'Alex Chen', content: 'Hey! Great to see you here! 👋', timestamp: new Date(Date.now() + 1000) }
            ]);

        } catch (err: any) {
            console.error('Error accessing camera/microphone:', err);
            if (err.name === 'NotAllowedError') {
                setCameraError('Camera/microphone permission denied. Please allow access in your browser settings.');
            } else if (err.name === 'NotFoundError') {
                setCameraError('No camera or microphone found. Please connect a device.');
            } else {
                setCameraError(`Could not access camera: ${err.message}`);
            }
        }
    }, []);

    const stopVideoCall = useCallback(() => {
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
            setLocalStream(null);
        }
        if (screenStream) {
            screenStream.getTracks().forEach(track => track.stop());
            setScreenStream(null);
        }
        setVideoEnabled(false);
        setShowVideoCall(false);
        setIsScreenSharing(false);
        setChatMessages([]);
    }, [localStream, screenStream]);

    const toggleMic = useCallback(() => {
        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setMicEnabled(audioTrack.enabled);
            }
        }
    }, [localStream]);

    const toggleVideo = useCallback(() => {
        if (localStream) {
            const videoTrack = localStream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setVideoEnabled(videoTrack.enabled);
            }
        }
    }, [localStream]);

    const toggleScreenShare = useCallback(async () => {
        if (isScreenSharing && screenStream) {
            screenStream.getTracks().forEach(track => track.stop());
            setScreenStream(null);
            setIsScreenSharing(false);
        } else {
            try {
                const stream = await navigator.mediaDevices.getDisplayMedia({
                    video: {
                        width: { ideal: 1920 },
                        height: { ideal: 1080 }
                    }
                });

                // Handle when user stops sharing from browser UI
                stream.getVideoTracks()[0].onended = () => {
                    setScreenStream(null);
                    setIsScreenSharing(false);
                };

                setScreenStream(stream);
                setIsScreenSharing(true);

                setChatMessages(prev => [...prev, {
                    id: `msg_${Date.now()}`,
                    sender: 'System',
                    content: 'You are now sharing your screen.',
                    timestamp: new Date()
                }]);
            } catch (err) {
                console.error('Screen share error:', err);
            }
        }
    }, [isScreenSharing, screenStream]);

    const sendChatMessage = () => {
        if (!newChatMessage.trim()) return;

        setChatMessages(prev => [...prev, {
            id: `msg_${Date.now()}`,
            sender: 'You',
            content: newChatMessage,
            timestamp: new Date()
        }]);
        setNewChatMessage('');

        // Simulate response
        setTimeout(() => {
            const responses = [
                'That\'s a great point!',
                'I agree with that approach.',
                'Can you explain more?',
                'Interesting! 🤔',
                'Let me share my screen to show you.'
            ];
            setChatMessages(prev => [...prev, {
                id: `msg_${Date.now()}`,
                sender: onlineUsers[Math.floor(Math.random() * 3)].name,
                content: responses[Math.floor(Math.random() * responses.length)],
                timestamp: new Date()
            }]);
        }, 1500);
    };

    const sharedModals = (
        <>
            {/* Toast Notifications */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: 20, x: '-50%' }}
                        className={`fixed bottom-8 left-1/2 z-[100] px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 border ${toast.type === 'error' ? 'bg-red-900/90 border-red-500 text-white' :
                            toast.type === 'success' ? 'bg-green-900/90 border-green-500 text-white' :
                                'bg-gray-800/90 border-gray-600 text-white'
                            } backdrop-blur-md`}
                    >
                        {toast.type === 'success' && <CheckIcon className="w-5 h-5 text-green-400" />}
                        {toast.type === 'error' && <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />}
                        {toast.type === 'info' && <InformationCircleIcon className="w-5 h-5 text-blue-400" />}
                        <span className="font-medium">{toast.msg}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Settings Modal */}
            <AnimatePresence>
                {showSettings && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowSettings(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            className="bg-gray-800 rounded-2xl max-w-md w-full p-6 border border-gray-700 shadow-xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <Cog6ToothIcon className="w-6 h-6 text-gray-400" />
                                    Settings
                                </h2>
                                <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-gray-700 rounded-full">
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                                        <VideoCameraIcon className="w-4 h-4" /> Camera
                                    </label>
                                    <select
                                        value={settings.camera}
                                        onChange={e => setSettings({ ...settings, camera: e.target.value })}
                                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    >
                                        <option>Default Camera (Built-in)</option>
                                        <option>Logitech C920</option>
                                        <option>OBS Virtual Camera</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                                        <MicrophoneIcon className="w-4 h-4" /> Microphone
                                    </label>
                                    <select
                                        value={settings.microphone}
                                        onChange={e => setSettings({ ...settings, microphone: e.target.value })}
                                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    >
                                        <option>Default Microphone (Built-in)</option>
                                        <option>Blue Yeti</option>
                                        <option>AirPods Pro</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                                        <SpeakerWaveIcon className="w-4 h-4" /> Output
                                    </label>
                                    <select
                                        value={settings.output}
                                        onChange={e => setSettings({ ...settings, output: e.target.value })}
                                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    >
                                        <option>Default Output (Built-in)</option>
                                        <option>External Monitors</option>
                                        <option>Headphones</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button
                                    onClick={() => {
                                        showToastMsg("Settings saved successfully", "success");
                                        setShowSettings(false);
                                    }}
                                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Room Preview Modal */}
            <AnimatePresence>
                {selectedRoom && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setSelectedRoom(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-gray-800 rounded-3xl max-w-lg w-full overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className={`bg-gradient-to-r ${selectedRoom.color} p-6 text-center relative`}>
                                <button
                                    onClick={() => setSelectedRoom(null)}
                                    className="absolute top-4 right-4 p-2 bg-black/20 rounded-full hover:bg-black/40"
                                >
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                                <div className="text-6xl mb-4">{selectedRoom.icon}</div>
                                <h2 className="text-2xl font-bold">{selectedRoom.name}</h2>
                                <p className="text-white/70">{selectedRoom.description}</p>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Occupancy</span>
                                    <div className="flex items-center gap-2">
                                        <UserGroupIcon className="w-5 h-5 text-indigo-400" />
                                        <span className="font-bold">{selectedRoom.occupancy} / {selectedRoom.maxOccupancy}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Status</span>
                                    {selectedRoom.isLive ? (
                                        <span className="flex items-center gap-2 text-green-400">
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                            Active
                                        </span>
                                    ) : (
                                        <span className="text-gray-500">Offline</span>
                                    )}
                                </div>
                                {selectedRoom.nextEvent && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">Next Event</span>
                                        <span className="text-amber-400">{selectedRoom.nextEvent}</span>
                                    </div>
                                )}

                                <div className="pt-2 text-center text-sm text-gray-400">
                                    📹 Camera & 🎤 Microphone access will be requested
                                </div>

                                <button
                                    onClick={() => handleJoinRoom(selectedRoom)}
                                    disabled={!selectedRoom.isLive || isJoining}
                                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${selectedRoom.isLive
                                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    {isJoining ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Joining...
                                        </span>
                                    ) : selectedRoom.isLive ? (
                                        'Enter Room'
                                    ) : (
                                        'Room Offline'
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white text-lg">Entering Metaverse...</p>
                </div>
            </div>
        );
    }

    // VIDEO CALL VIEW - Real camera/mic active
    if (joinedRoom && showVideoCall) {
        return (
            <div className="h-screen bg-gray-900 text-white flex flex-col overflow-hidden">
                {/* Video Call Header */}
                <div className={`bg-gradient-to-r ${joinedRoom.color} p-3 flex-shrink-0`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">{joinedRoom.icon}</span>
                            <div>
                                <h1 className="text-lg font-bold">{joinedRoom.name} - Live Call</h1>
                                <div className="flex items-center gap-2 text-sm text-white/70">
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                    <span>Recording • {Math.floor((Date.now() % 3600000) / 60000)}:{String(Math.floor((Date.now() % 60000) / 1000)).padStart(2, '0')}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowChat(!showChat)}
                                className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${showChat ? 'bg-white/20' : 'bg-white/10'}`}
                            >
                                <ChatBubbleLeftRightIcon className="w-5 h-5" />
                                Chat
                            </button>
                            <button
                                onClick={stopVideoCall}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-600 flex items-center gap-2"
                            >
                                <PhoneXMarkIcon className="w-5 h-5" />
                                End
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Video Grid */}
                    <div className={`flex-1 p-4 transition-all ${showChat ? 'mr-80' : ''}`}>
                        <div className="h-full grid grid-cols-2 grid-rows-2 gap-3">
                            {/* Your Video (Large) - REAL CAMERA */}
                            <div className="col-span-2 row-span-1 relative bg-gray-800 rounded-2xl overflow-hidden">
                                {isScreenSharing && screenStream ? (
                                    <video
                                        ref={screenRef}
                                        autoPlay
                                        playsInline
                                        className="w-full h-full object-contain bg-black"
                                    />
                                ) : (
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        className="w-full h-full object-cover transform scale-x-[-1]"
                                    />
                                )}

                                {!videoEnabled && !isScreenSharing && (
                                    <div className="absolute inset-0 bg-gray-800 flex flex-col items-center justify-center">
                                        <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-4xl font-bold mb-4">
                                            Y
                                        </div>
                                        <p className="text-gray-400">Camera is off</p>
                                    </div>
                                )}

                                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full text-sm flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="font-medium">You</span>
                                    {!micEnabled && <span className="text-red-400">🔇</span>}
                                    {isScreenSharing && <span className="text-blue-400">📺 Sharing</span>}
                                </div>

                                {handRaised && (
                                    <div className="absolute top-4 left-4 bg-amber-500 text-white p-2 rounded-full shadow-lg animate-bounce z-20">
                                        <HandRaisedIcon className="w-6 h-6" />
                                    </div>
                                )}
                                <AnimatePresence>
                                    {reactions.filter(r => r.senderId === 'local').map(reaction => (
                                        <motion.div
                                            key={reaction.id}
                                            initial={{ y: 0, opacity: 1, scale: 0.5 }}
                                            animate={{ y: -100, opacity: 0, scale: 1.5 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 2 }}
                                            className="absolute bottom-10 right-10 text-6xl"
                                        >
                                            {reaction.emoji}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* Small self-view when screen sharing */}
                            {isScreenSharing && (
                                <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-900 rounded-xl overflow-hidden shadow-xl border-2 border-gray-700">
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        className="w-full h-full object-cover transform scale-x-[-1]"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Simulated Participants */}
                        {onlineUsers.slice(0, 2).map((user, idx) => (
                            <div key={user.id} className="relative bg-gray-800 rounded-2xl overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 flex items-center justify-center">
                                    <motion.div
                                        animate={{ scale: [1, 1.05, 1] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: idx * 0.5 }}
                                        className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-3xl font-bold"
                                    >
                                        {user.name.charAt(0)}
                                    </motion.div>
                                </div>
                                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${user.status === 'online' ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                                </div>

                                {/* Participant Hand Raise (Simulated for demo) */}
                                {Math.random() > 0.8 && (
                                    <div className="absolute top-3 left-3 bg-amber-500 text-white p-1.5 rounded-full shadow-lg z-20">
                                        <HandRaisedIcon className="w-5 h-5" />
                                    </div>
                                )}

                                {/* Reaction Display for Participants */}
                                <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
                                    <AnimatePresence>
                                        {reactions.filter(r => r.senderId === user.id).map(reaction => (
                                            <motion.div
                                                key={reaction.id}
                                                initial={{ y: 0, opacity: 1, scale: 0.5 }}
                                                animate={{ y: -100, opacity: 0, scale: 1.5 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 2 }}
                                                className="absolute bottom-10 right-10 text-6xl"
                                            >
                                                {reaction.emoji}
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>


                                {/* Simulated audio indicator */}
                                {idx === 0 && (
                                    <div className="absolute top-3 right-3 flex gap-1">
                                        {[...Array(3)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                className="w-1 bg-green-500 rounded-full"
                                                animate={{ height: [8, 16, 8] }}
                                                transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>


                    {/* Chat Panel */}
                    <AnimatePresence>
                        {
                            showChat && (
                                <motion.div
                                    initial={{ x: 320, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: 320, opacity: 0 }}
                                    className="absolute right-0 top-[60px] bottom-[80px] w-80 bg-gray-800 border-l border-gray-700 flex flex-col"
                                >
                                    <div className="p-3 border-b border-gray-700">
                                        <h3 className="font-bold">In-Call Chat</h3>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-3 space-y-3">
                                        {chatMessages.map((msg) => (
                                            <div key={msg.id} className={`${msg.sender === 'You' ? 'text-right' : ''}`}>
                                                {msg.sender !== 'You' && (
                                                    <p className="text-xs text-gray-400 mb-1">{msg.sender}</p>
                                                )}
                                                <div className={`inline-block px-3 py-2 rounded-xl max-w-[90%] ${msg.sender === 'You'
                                                    ? 'bg-indigo-600 text-white'
                                                    : msg.sender === 'System'
                                                        ? 'bg-gray-700 text-gray-300 text-xs italic'
                                                        : 'bg-gray-700 text-white'
                                                    }`}>
                                                    <p className="text-sm">{msg.content}</p>
                                                </div>
                                            </div>
                                        ))}
                                        <div ref={chatEndRef}></div>
                                    </div>

                                    <div className="p-3 border-t border-gray-700">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newChatMessage}
                                                onChange={(e) => setNewChatMessage(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                                                placeholder="Type a message..."
                                                className="flex-1 bg-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                            <button
                                                onClick={sendChatMessage}
                                                className="p-2 bg-indigo-600 rounded-lg hover:bg-indigo-700"
                                            >
                                                <PaperAirplaneIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        }
                    </AnimatePresence>                </div>

                {/* Video Controls */}
                <div className="flex-shrink-0 p-4 bg-gray-800/80 backdrop-blur-sm border-t border-gray-700">
                    <div className="flex items-center justify-center gap-3">
                        <button
                            onClick={toggleMic}
                            className={`p-4 rounded-full transition-colors ${micEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}
                            title={micEnabled ? 'Mute' : 'Unmute'}
                        >
                            <MicrophoneIcon className="w-6 h-6" />
                        </button>
                        <button
                            onClick={toggleVideo}
                            className={`p-4 rounded-full transition-colors ${videoEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}
                            title={videoEnabled ? 'Turn off camera' : 'Turn on camera'}
                        >
                            {videoEnabled ? (
                                <VideoCameraIcon className="w-6 h-6" />
                            ) : (
                                <VideoCameraSlashIcon className="w-6 h-6" />
                            )}
                        </button>
                        <button
                            onClick={toggleHand}
                            className={`p-4 rounded-full transition-colors ${handRaised ? 'bg-amber-500 hover:bg-amber-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                            title={handRaised ? 'Lower Hand' : 'Raise Hand'}
                        >
                            <HandRaisedIcon className="w-6 h-6" />
                        </button>
                        <div className="relative">
                            <button
                                onClick={() => setShowReactionMenu(!showReactionMenu)}
                                className={`p-4 rounded-full transition-colors ${showReactionMenu ? 'bg-indigo-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                                title="Reactions"
                            >
                                <FaceSmileIcon className="w-6 h-6" />
                            </button>
                            <AnimatePresence>
                                {showReactionMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 bg-gray-800 rounded-xl p-2 flex gap-1 shadow-xl border border-gray-700"
                                    >
                                        {emojis.map(emoji => (
                                            <button
                                                key={emoji}
                                                onClick={() => sendReaction(emoji)}
                                                className="p-2 hover:bg-gray-700 rounded-lg text-2xl transition-transform hover:scale-110"
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <button
                            onClick={toggleScreenShare}
                            className={`p-4 rounded-full transition-colors ${isScreenSharing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'}`}
                            title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
                        >
                            <ComputerDesktopIcon className="w-6 h-6" />
                        </button>
                        <button
                            onClick={() => setSpeakerEnabled(!speakerEnabled)}
                            className={`p-4 rounded-full transition-colors ${speakerEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}
                            title={speakerEnabled ? 'Mute speakers' : 'Unmute speakers'}
                        >
                            <SpeakerWaveIcon className="w-6 h-6" />
                        </button>
                        <div className="w-px h-10 bg-gray-600 mx-2"></div>
                        <button
                            className="p-4 rounded-full bg-gray-700 hover:bg-gray-600"
                            title="Settings"
                            onClick={() => setShowSettings(true)}
                        >
                            <Cog6ToothIcon className="w-6 h-6" />
                        </button>
                        <button
                            onClick={stopVideoCall}
                            className="px-6 py-4 rounded-full bg-red-600 hover:bg-red-700 flex items-center gap-2"
                            title="Leave call"
                        >
                            <PhoneXMarkIcon className="w-6 h-6" />
                            <span className="font-medium">Leave</span>
                        </button>
                    </div>
                </div >
                {sharedModals}
            </div >
        );
    }

    // ROOM VIEW (not in video call)
    if (joinedRoom) {
        return (
            <div className="min-h-screen bg-gray-900 text-white">
                {/* Room Header */}
                <div className={`bg-gradient-to-r ${joinedRoom.color} p-6`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="text-5xl">{joinedRoom.icon}</span>
                            <div>
                                <h1 className="text-3xl font-bold">{joinedRoom.name}</h1>
                                <p className="text-white/70">{joinedRoom.description}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => shareRoom(joinedRoom)}
                                className="bg-white/20 text-white px-4 py-2 rounded-xl font-bold hover:bg-white/30 flex items-center gap-2"
                            >
                                <ShareIcon className="w-5 h-5" />
                                Share
                            </button>
                            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                                <UserGroupIcon className="w-5 h-5" />
                                <span>{joinedRoom.occupancy} / {joinedRoom.maxOccupancy}</span>
                            </div>
                            <button
                                onClick={handleLeaveRoom}
                                className="bg-red-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-red-600"
                            >
                                Leave Room
                            </button>
                        </div>
                    </div>
                </div>

                {/* Room Content */}
                <div className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Main Area */}
                    <div className="lg:col-span-3">
                        {cameraError && (
                            <div className="mb-4 bg-red-900/50 border border-red-500 rounded-xl p-4 text-red-200">
                                <p className="font-medium">⚠️ {cameraError}</p>
                                <p className="text-sm mt-1">Try refreshing the page or check your browser's camera permissions.</p>
                            </div>
                        )}

                        <div className="bg-gray-800 rounded-2xl p-8 min-h-[500px] flex items-center justify-center">
                            <div className="text-center">
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="text-8xl mb-6"
                                >
                                    {joinedRoom.icon}
                                </motion.div>
                                <h2 className="text-2xl font-bold mb-2">You're in {joinedRoom.name}!</h2>
                                <p className="text-gray-400 mb-6">Click Start Video to begin a call with real camera & audio</p>

                                {/* Activity Cards */}
                                <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto">
                                    <button
                                        onClick={startVideoCall}
                                        className="bg-indigo-600/30 p-4 rounded-xl hover:bg-indigo-600/50 transition-colors border-2 border-transparent hover:border-indigo-500 group"
                                    >
                                        <VideoCameraIcon className="w-8 h-8 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                                        <span className="text-sm font-medium">Start Video</span>
                                        <p className="text-xs text-gray-400 mt-1">Uses real camera</p>
                                    </button>
                                    <button
                                        onClick={() => setShowChat(!showChat)}
                                        className="bg-green-600/30 p-4 rounded-xl hover:bg-green-600/50 transition-colors border-2 border-transparent hover:border-green-500"
                                    >
                                        <ChatBubbleLeftRightIcon className="w-8 h-8 mx-auto mb-2" />
                                        <span className="text-sm font-medium">Open Chat</span>
                                    </button>
                                    <button
                                        onClick={() => setShowResources(true)}
                                        className="bg-purple-600/30 p-4 rounded-xl hover:bg-purple-600/50 transition-colors border-2 border-transparent hover:border-purple-500"
                                    >
                                        <BookOpenIcon className="w-8 h-8 mx-auto mb-2" />
                                        <span className="text-sm font-medium">Resources</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="mt-4 bg-gray-800 rounded-2xl p-4 flex items-center justify-center gap-4">
                            <button
                                onClick={toggleMic}
                                className={`p-4 rounded-full ${micEnabled ? 'bg-indigo-600' : 'bg-red-600'}`}
                            >
                                <MicrophoneIcon className="w-6 h-6" />
                            </button>
                            <button
                                onClick={() => setSpeakerEnabled(!speakerEnabled)}
                                className={`p-4 rounded-full ${speakerEnabled ? 'bg-indigo-600' : 'bg-red-600'}`}
                            >
                                <SpeakerWaveIcon className="w-6 h-6" />
                            </button>
                            <button
                                onClick={() => setShowSettings(true)}
                                className="p-4 rounded-full bg-gray-700 hover:bg-gray-600"
                            >
                                <Cog6ToothIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Sidebar - People in Room */}
                    <div className="bg-gray-800 rounded-2xl p-6">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <UserGroupIcon className="w-5 h-5 text-green-400" />
                            People Here ({joinedRoom?.occupancy || 0})
                        </h3>
                        <div className="space-y-3">
                            {/* Current user */}
                            <div className="flex items-center gap-3 bg-indigo-600/20 rounded-xl p-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center font-bold">
                                    Y
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-sm">You</p>
                                    <p className="text-xs text-green-400">Ready</p>
                                </div>
                            </div>
                            {/* Other users */}
                            {onlineUsers.slice(0, 4).map((user) => (
                                <div key={user.id} className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-white font-bold">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gray-800 ${user.status === 'online' ? 'bg-green-500' :
                                            user.status === 'busy' ? 'bg-red-500' : 'bg-gray-500'
                                            }`}></div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm truncate">{user.name}</p>
                                        <p className="text-xs text-gray-400">{user.status}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-700">
                            <h4 className="text-sm font-medium text-gray-400 mb-3">Quick Actions</h4>
                            <button
                                onClick={startVideoCall}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-xl font-medium flex items-center justify-center gap-2"
                            >
                                <VideoCameraIcon className="w-5 h-5" />
                                Start Video Call
                            </button>
                            <button
                                onClick={() => {
                                    const available = rooms.filter(r => r.type === 'study');
                                    if (available.length === 0) return;
                                    const currentIdx = available.findIndex(r => r.id === joinedRoom?.id);
                                    const nextRoom = available[(currentIdx + 1) % available.length];
                                    if (nextRoom.id !== joinedRoom?.id) {
                                        showToastMsg(`Switching to ${nextRoom.name}...`, 'success');
                                        setSelectedRoom(nextRoom);
                                    } else {
                                        showToastMsg("You are already in the active Study Group!", 'info');
                                    }
                                }}
                                className="w-full bg-gray-700 hover:bg-gray-600 py-3 rounded-xl font-medium flex items-center justify-center gap-2 text-gray-300"
                            >
                                <BookOpenIcon className="w-5 h-5" />
                                Join Study Group
                            </button>
                            <button
                                onClick={() => {
                                    const challengeRoom = rooms.find(r => r.type === 'challenge');
                                    if (challengeRoom) {
                                        if (challengeRoom.id !== joinedRoom?.id) {
                                            showToastMsg(`Entering ${challengeRoom.name}...`, 'success');
                                            setSelectedRoom(challengeRoom);
                                        } else {
                                            showToastMsg("You are already in the Challenge Arena!", 'info');
                                        }
                                    }
                                }}
                                className="w-full bg-gray-700 hover:bg-gray-600 py-3 rounded-xl font-medium flex items-center justify-center gap-2 text-gray-300"
                            >
                                <TrophyIcon className="w-5 h-5" />
                                Enter Challenge
                            </button>
                        </div>
                    </div>
                </div>

                {/* Shared Chat Panel (Slide Over) */}
                <AnimatePresence>
                    {showChat && (
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            className="fixed inset-y-0 right-0 w-96 bg-gray-800 border-l border-gray-700 shadow-2xl z-50 flex flex-col"
                        >
                            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                                <h3 className="font-bold">Lobby Chat</h3>
                                <button onClick={() => setShowChat(false)} className="p-2 hover:bg-gray-700 rounded-full">
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {chatMessages.map((msg) => (
                                    <div key={msg.id} className={`${msg.sender === 'You' ? 'text-right' : ''}`}>
                                        <div className={`inline-block px-3 py-2 rounded-xl max-w-[85%] ${msg.sender === 'You' ? 'bg-indigo-600' : 'bg-gray-700'}`}>
                                            <p className="text-sm">{msg.content}</p>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">{msg.sender}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 border-t border-gray-700">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newChatMessage}
                                        onChange={(e) => setNewChatMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                                        placeholder="Type a message..."
                                        className="flex-1 bg-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none"
                                    />
                                    <button onClick={sendChatMessage} className="p-2 bg-indigo-600 rounded-lg">
                                        <PaperAirplaneIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {showResources && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                            onClick={() => setShowResources(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.9 }}
                                className="bg-gray-800 rounded-2xl max-w-2xl w-full p-6"
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold flex items-center gap-2">
                                        <BookOpenIcon className="w-6 h-6 text-purple-400" />
                                        Room Resources
                                    </h2>
                                    <button onClick={() => setShowResources(false)} className="p-2 hover:bg-gray-700 rounded-full">
                                        <XMarkIcon className="w-6 h-6" />
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {(joinedRoom.resources && joinedRoom.resources.length > 0) ? (
                                        joinedRoom.resources.map((resource) => (
                                            <a
                                                key={resource.id}
                                                href={resource.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-between p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-colors cursor-pointer group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-purple-900/50 rounded-lg flex items-center justify-center text-purple-300 font-bold">
                                                        {resource.type === 'doc' ? 'DOC' :
                                                            resource.type === 'drive' ? 'DRV' :
                                                                resource.type === 'video' ? 'VID' : 'LNK'}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{resource.title}</p>
                                                        <p className="text-xs text-gray-400">Added by {resource.addedBy}</p>
                                                    </div>
                                                </div>
                                                <LinkIcon className="w-5 h-5 text-gray-500 group-hover:text-white" />
                                            </a>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-gray-400">
                                            <p>No resources available for this room.</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {sharedModals}

            </div >
        );
    }

    // MAIN LOBBY VIEW
    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-3xl mb-8"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 40%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 40%)'
                    }}></div>
                    {particles.map((particle) => (
                        <motion.div
                            key={particle.id}
                            className="absolute w-2 h-2 bg-white/20 rounded-full"
                            style={{ left: particle.left, top: particle.top }}
                            animate={{ y: [0, -15, 0], opacity: [0.2, 0.4, 0.2] }}
                            transition={{ duration: particle.duration, repeat: Infinity, delay: particle.delay, ease: "easeInOut" }}
                        />
                    ))}
                </div>

                <div className="relative z-10 p-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <CubeIcon className="w-12 h-12" />
                            <div>
                                <h1 className="text-4xl font-bold">Metaverse HQ</h1>
                                <p className="text-white/70">Your virtual campus for learning and collaboration</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex bg-black/20 p-1 rounded-xl">
                                <button
                                    onClick={() => setViewMode('2d')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === '2d' ? 'bg-white text-indigo-600 shadow-lg' : 'text-white/50 hover:text-white'}`}
                                >
                                    2D GRID
                                </button>
                                <button
                                    onClick={() => setViewMode('3d')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === '3d' ? 'bg-white text-indigo-600 shadow-lg' : 'text-white/50 hover:text-white'}`}
                                >
                                    3D BRAIN
                                </button>
                            </div>
                            <button
                                onClick={() => setShowCreateRoom(true)}
                                className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors"
                            >
                                <PlusIcon className="w-5 h-5" />
                                Create Room
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                            <span>{onlineUsers.filter(u => u.status === 'online').length} Online Now</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <BuildingOffice2Icon className="w-5 h-5" />
                            <span>{rooms.filter(r => r.isLive).length} Rooms Active</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CalendarIcon className="w-5 h-5" />
                            <span>3 Events Today</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Rooms Grid */}
                <div className="lg:col-span-3">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <BuildingOffice2Icon className="w-6 h-6 text-indigo-400" />
                        {viewMode === '2d' ? 'Virtual Spaces' : 'Ecosystem Brain'}
                    </h2>

                    {viewMode === '3d' ? (
                        <div className="bg-black/40 rounded-3xl h-[600px] relative overflow-hidden border border-white/5 shadow-2xl">
                            <Canvas shadows>
                                <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={50} />
                                <OrbitControls enablePan={false} maxDistance={20} minDistance={5} autoRotate autoRotateSpeed={0.5} />
                                <ambientLight intensity={0.2} />
                                <pointLight position={[10, 10, 10]} intensity={1.5} color="#4f46e5" />
                                <Environment preset="night" />
                                <Stars speed={1} factor={4} saturation={0} fade />

                                <EcosystemBrain
                                    rooms={rooms}
                                    onSelectRoom={setSelectedRoom}
                                    selectedRoomId={selectedRoom?.id}
                                />

                                <ContactShadows position={[0, -6, 0]} opacity={0.4} scale={30} blur={2.5} far={10} />
                            </Canvas>
                            <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-white/50 font-mono tracking-widest uppercase pointer-events-none">
                                Mode: Immersive Spatial Visualization
                            </div>
                            <div className="absolute bottom-4 left-4 right-4 flex justify-center pointer-events-none">
                                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-[0.2em] bg-indigo-900/20 px-4 py-1.5 rounded-full border border-indigo-500/20">
                                    Click nodes to preview spaces • Drag to rotate ecosystem
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {rooms.map((room, idx) => (
                                <motion.div
                                    key={room.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    whileHover={{ scale: 1.03, y: -5 }}
                                    className="relative overflow-hidden rounded-2xl cursor-pointer group"
                                    onClick={() => setSelectedRoom(room)}
                                >
                                    {room.isCustom && (
                                        <div className="absolute top-2 right-2 z-20 bg-indigo-600 text-xs px-2 py-1 rounded-full">
                                            Custom
                                        </div>
                                    )}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${room.color} opacity-90`}></div>
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>

                                    <div className="relative z-10 p-6">
                                        <div className="text-5xl mb-4">{room.icon}</div>
                                        <h3 className="text-xl font-bold mb-1">{room.name}</h3>
                                        <p className="text-white/70 text-sm mb-4">{room.description}</p>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <UserGroupIcon className="w-5 h-5" />
                                                <span className="text-sm">{room.occupancy}/{room.maxOccupancy}</span>
                                            </div>
                                            {room.isLive ? (
                                                <div className="flex items-center gap-1 text-green-300">
                                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                                    <span className="text-xs font-medium">LIVE</span>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-white/50">Offline</span>
                                            )}
                                        </div>

                                        {room.nextEvent && (
                                            <div className="mt-4 pt-4 border-t border-white/20">
                                                <p className="text-xs text-white/70">
                                                    <SparklesIcon className="w-4 h-4 inline mr-1" />
                                                    {room.nextEvent}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                                            <ArrowRightIcon className="w-5 h-5" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Online Users */}
                    <div className="bg-gray-800 rounded-2xl p-6">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <UserGroupIcon className="w-5 h-5 text-green-400" />
                            Friends Online
                        </h3>
                        <div className="space-y-3">
                            {onlineUsers.map((user) => (
                                <div key={user.id} className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-gray-800 ${user.status === 'online' ? 'bg-green-500' :
                                            user.status === 'busy' ? 'bg-red-500' : 'bg-gray-500'
                                            }`}></div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm truncate">{user.name}</p>
                                        <p className="text-xs text-gray-400 truncate">{user.activity}</p>
                                    </div>
                                    <button className="p-2 hover:bg-gray-700 rounded-lg">
                                        <ChatBubbleLeftRightIcon className="w-4 h-4 text-gray-400" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-gray-800 rounded-2xl p-6">
                        <h3 className="font-bold mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => setSelectedRoom(rooms[0])}
                                className="w-full flex items-center gap-3 p-3 bg-indigo-600/30 text-indigo-300 rounded-xl hover:bg-indigo-600/50 transition-colors"
                            >
                                <VideoCameraIcon className="w-5 h-5" />
                                Start Video Call
                            </button>
                            <button
                                onClick={() => setSelectedRoom(rooms[1])}
                                className="w-full flex items-center gap-3 p-3 bg-gray-700/50 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors"
                            >
                                <BookOpenIcon className="w-5 h-5" />
                                Join Study Group
                            </button>
                            <button
                                onClick={() => setSelectedRoom(rooms[4])}
                                className="w-full flex items-center gap-3 p-3 bg-gray-700/50 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors"
                            >
                                <TrophyIcon className="w-5 h-5" />
                                Enter Challenge
                            </button>
                        </div>
                    </div>

                    {/* Upcoming Events */}
                    <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-2xl p-6 border border-purple-500/30">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <CalendarIcon className="w-5 h-5 text-purple-400" />
                            Next Event
                        </h3>
                        <div className="text-center">
                            <p className="text-3xl mb-2">🎤</p>
                            <p className="font-bold text-lg">Guest Speaker</p>
                            <p className="text-gray-400 text-sm mb-3">Industry Insights with CEO</p>
                            <p className="text-purple-300 font-mono">Starts in 2h 30m</p>
                            <button className="w-full mt-4 bg-purple-600 text-white py-2 rounded-xl font-medium hover:bg-purple-700">
                                Set Reminder
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {sharedModals}

            {/* Create Room Modal */}
            <AnimatePresence>
                {showCreateRoom && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowCreateRoom(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-gray-800 rounded-3xl max-w-lg w-full overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 relative">
                                <button
                                    onClick={() => setShowCreateRoom(false)}
                                    className="absolute top-4 right-4 p-2 bg-black/20 rounded-full hover:bg-black/40"
                                >
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                                <div className="flex items-center gap-3">
                                    <PlusIcon className="w-10 h-10" />
                                    <div>
                                        <h2 className="text-2xl font-bold">Create New Room</h2>
                                        <p className="text-white/70">Start your own virtual space</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                {/* Room Icon Picker */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Room Icon</label>
                                    <div className="flex flex-wrap gap-2">
                                        {roomIcons.map((icon) => (
                                            <button
                                                key={icon}
                                                onClick={() => setNewRoom(prev => ({ ...prev, icon }))}
                                                className={`w-12 h-12 text-2xl rounded-xl flex items-center justify-center transition-all ${newRoom.icon === icon
                                                    ? 'bg-indigo-600 ring-2 ring-indigo-400'
                                                    : 'bg-gray-700 hover:bg-gray-600'
                                                    }`}
                                            >
                                                {icon}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Room Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Room Name *</label>
                                    <input
                                        type="text"
                                        value={newRoom.name}
                                        onChange={(e) => setNewRoom(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="e.g., JavaScript Study Group"
                                        className="w-full bg-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                                    <textarea
                                        value={newRoom.description}
                                        onChange={(e) => setNewRoom(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="What's this room about?"
                                        rows={3}
                                        className="w-full bg-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                                    />
                                </div>

                                {/* Max Occupancy */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Max Participants: {newRoom.maxOccupancy}</label>
                                    <input
                                        type="range"
                                        min="5"
                                        max="100"
                                        step="5"
                                        value={newRoom.maxOccupancy}
                                        onChange={(e) => setNewRoom(prev => ({ ...prev, maxOccupancy: parseInt(e.target.value) }))}
                                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>5</span>
                                        <span>100</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCreateRoom}
                                    disabled={!newRoom.name.trim()}
                                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${newRoom.name.trim()
                                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    Create Room
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Share Room Modal */}
            <AnimatePresence>
                {showShareModal && joinedRoom && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowShareModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-gray-800 rounded-3xl max-w-md w-full overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className={`bg-gradient-to-r ${joinedRoom.color} p-6 relative`}>
                                <button
                                    onClick={() => setShowShareModal(false)}
                                    className="absolute top-4 right-4 p-2 bg-black/20 rounded-full hover:bg-black/40"
                                >
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                                <div className="flex items-center gap-3">
                                    <ShareIcon className="w-8 h-8" />
                                    <div>
                                        <h2 className="text-xl font-bold">Share Room</h2>
                                        <p className="text-white/70">Invite friends to join</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="flex flex-col gap-4">
                                    <div className="bg-gray-900 rounded-xl p-4 flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-xl">
                                                {joinedRoom.icon}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold truncate">{joinedRoom.name}</p>
                                                <p className="text-xs text-gray-400 truncate">skillswap.app</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <input
                                            type="text"
                                            readOnly
                                            value={getRoomShareLink(joinedRoom)}
                                            className="w-full bg-gray-700 rounded-xl pl-4 pr-12 py-3 text-sm text-gray-300 focus:outline-none"
                                        />
                                        <button
                                            onClick={() => copyRoomLink(joinedRoom)}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-600 rounded-lg text-indigo-400"
                                        >
                                            {linkCopied ? <CheckIcon className="w-5 h-5" /> : <ClipboardDocumentIcon className="w-5 h-5" />}
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => copyRoomLink(joinedRoom)}
                                            className="py-3 bg-indigo-600 rounded-xl font-bold hover:bg-indigo-700 flex items-center justify-center gap-2"
                                        >
                                            <LinkIcon className="w-5 h-5" />
                                            {linkCopied ? 'Copied!' : 'Copy Link'}
                                        </button>
                                        <button
                                            onClick={() => {
                                                window.open(`mailto:?subject=Join me in ${joinedRoom.name}&body=Hey! Join me in the ${joinedRoom.name} room on SkillSwap: ${getRoomShareLink(joinedRoom)}`);
                                            }}
                                            className="py-3 bg-gray-700 rounded-xl font-bold hover:bg-gray-600 flex items-center justify-center gap-2"
                                        >
                                            <PaperAirplaneIcon className="w-5 h-5" />
                                            Email
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
};

export default MetaverseHQ;
