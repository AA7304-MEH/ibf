import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
    OrbitControls,
    PerspectiveCamera,
    ContactShadows,
    Environment,
    Float,
    Text,
    RoundedBox,
    Html
} from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { io, Socket } from 'socket.io-client';
import {
    ChatBubbleLeftRightIcon,
    UserGroupIcon,
    VideoCameraIcon,
    MicrophoneIcon,
    XMarkIcon,
    PaperAirplaneIcon,
    HandRaisedIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';

// --- Types ---
interface Player {
    id: string;
    name: string;
    position: [number, number, number];
    color: string;
}

// --- 3D Components ---

const Avatar = ({ name, position, color, isLocal = false }: { name: string, position: [number, number, number], color: string, isLocal?: boolean }) => {
    return (
        <group position={position}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <mesh castShadow receiveShadow>
                    <capsuleGeometry args={[0.3, 0.7, 4, 16]} />
                    <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
                </mesh>
                <mesh position={[0, 0.6, 0]} castShadow>
                    <sphereGeometry args={[0.25, 32, 32]} />
                    <meshStandardMaterial color={color} roughness={0.3} />
                </mesh>
            </Float>
            <Html position={[0, 1.2, 0]} center distanceFactor={10}>
                <div className={`px-2 py-1 rounded bg-black/70 text-white text-[10px] whitespace-nowrap border ${isLocal ? 'border-indigo-500' : 'border-gray-600'}`}>
                    {name} {isLocal && '(You)'}
                </div>
            </Html>
        </group>
    );
};

const OfficeScene = () => {
    return (
        <group>
            {/* Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
                <planeGeometry args={[20, 20]} />
                <meshStandardMaterial color="#1f2937" roughness={0.8} />
            </mesh>
            <gridHelper args={[20, 20, "#374151", "#111827"]} position={[0, 0.01, 0]} />

            {/* Meeting Table Zone */}
            <group position={[-4, 0, -4]}>
                <RoundedBox args={[4, 0.5, 3]} radius={0.1} position={[0, 0.4, 0]} castShadow>
                    <meshStandardMaterial color="#374151" />
                </RoundedBox>
                <Text position={[0, 1.2, 0]} fontSize={0.3} color="white">Meeting Zone</Text>
            </group>

            {/* Lounge Zone */}
            <group position={[4, 0, 4]}>
                <RoundedBox args={[3, 0.2, 3]} radius={0.5} position={[0, 0.1, 0]}>
                    <meshStandardMaterial color="#4f46e5" opacity={0.3} transparent />
                </RoundedBox>
                <Text position={[0, 1.2, 0]} fontSize={0.3} color="white">Lounge</Text>
            </group>

            {/* Logo/Icon in the middle */}
            <Float speed={3} rotationIntensity={2} floatIntensity={2}>
                <mesh position={[0, 2, 0]} castShadow>
                    <octahedronGeometry args={[0.5]} />
                    <meshStandardMaterial color="#818cf8" emissive="#4f46e5" emissiveIntensity={0.5} />
                </mesh>
            </Float>
        </group>
    );
};

// --- Main Component ---

const MultiverseHQ: React.FC = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [localPos, setLocalPos] = useState<[number, number, number]>([0, 0.5, 0]);
    const [showChat, setShowChat] = useState(false);
    const [chatMessages, setChatMessages] = useState<any[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOn, setIsVideoOn] = useState(true);

    const startupId = "incubator-prime"; // Mock

    useEffect(() => {
        const socketUrl = import.meta.env.VITE_API_URL
            ? import.meta.env.VITE_API_URL.replace('/api', '')
            : 'http://localhost:5001';

        const newSocket = io(socketUrl);
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to Multiverse Socket');
            newSocket.emit('join_office', { room: `office_${startupId}`, name: 'Founder' });
        });

        newSocket.on('room_players', (data: Player[]) => {
            setPlayers(data.filter(p => p.id !== newSocket.id));
        });

        newSocket.on('player_moved', (data: Player) => {
            setPlayers(prev => prev.map(p => p.id === data.id ? data : p));
        });

        newSocket.on('new_chat', (msg: any) => {
            setChatMessages(prev => [...prev, msg].slice(-50));
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    const moveLocal = (direction: 'up' | 'down' | 'left' | 'right') => {
        setLocalPos(prev => {
            let next: [number, number, number] = [...prev];
            const step = 0.5;
            if (direction === 'up') next[2] -= step;
            if (direction === 'down') next[2] += step;
            if (direction === 'left') next[0] -= step;
            if (direction === 'right') next[0] += step;

            socket?.emit('move', { room: `office_${startupId}`, position: next });
            return next;
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowUp' || e.key === 'w') moveLocal('up');
        if (e.key === 'ArrowDown' || e.key === 's') moveLocal('down');
        if (e.key === 'ArrowLeft' || e.key === 'a') moveLocal('left');
        if (e.key === 'ArrowRight' || e.key === 'd') moveLocal('right');
    };

    const sendMessage = () => {
        if (!inputMessage.trim()) return;
        const msg = {
            id: Date.now().toString(),
            sender: 'You',
            text: inputMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        socket?.emit('chat_message', { room: `office_${startupId}`, ...msg });
        setChatMessages(prev => [...prev, msg]);
        setInputMessage('');
    };

    return (
        <div
            className="h-screen w-full bg-slate-900 overflow-hidden relative"
            onKeyDown={handleKeyDown}
            tabIndex={0}
        >
            {/* 3D Canvas */}
            <Canvas shadows gl={{ antialias: true }}>
                <Suspense fallback={null}>
                    <PerspectiveCamera makeDefault position={[10, 10, 10]} fov={50} />
                    <OrbitControls
                        enablePan={false}
                        maxPolarAngle={Math.PI / 2.1}
                        minDistance={5}
                        maxDistance={25}
                    />

                    <ambientLight intensity={0.5} />
                    <directionalLight
                        position={[5, 10, 5]}
                        intensity={1}
                        castShadow
                        shadow-mapSize={[1024, 1024]}
                    />
                    <Environment preset="city" />

                    <OfficeScene />

                    {/* Local Player */}
                    <Avatar name="You" position={localPos} color="#4f46e5" isLocal />

                    {/* Remote Players */}
                    {players.map(p => (
                        <Avatar key={p.id} name={p.name} position={p.position} color={p.color} />
                    ))}

                    <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.2} far={1} />
                </Suspense>
            </Canvas>

            {/* UI Overlay: Header */}
            <div className="absolute top-0 left-0 right-0 p-6 pointer-events-none flex justify-between items-start">
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="bg-slate-800/80 backdrop-blur-md p-4 rounded-2xl border border-slate-700 shadow-xl pointer-events-auto"
                >
                    <div className="flex items-center gap-3">
                        <SparklesIcon className="w-8 h-8 text-indigo-400" />
                        <div>
                            <h1 className="text-xl font-bold text-white">Multiverse HQ</h1>
                            <p className="text-xs text-slate-400">Virtual Office • Project Alpha</p>
                        </div>
                    </div>
                </motion.div>

                <div className="flex gap-4 pointer-events-auto">
                    <div className="bg-slate-800/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-700 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-xs font-medium text-white">{players.length + 1} People Here</span>
                    </div>
                </div>
            </div>

            {/* UI Overlay: Bottom Controls */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-slate-800/90 backdrop-blur-md p-3 rounded-2xl border border-slate-700 shadow-2xl">
                <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-3 rounded-xl transition-all ${isMuted ? 'bg-red-500/20 text-red-400' : 'hover:bg-slate-700 text-white'}`}
                >
                    <MicrophoneIcon className="w-6 h-6" />
                </button>
                <button
                    onClick={() => setIsVideoOn(!isVideoOn)}
                    className={`p-3 rounded-xl transition-all ${!isVideoOn ? 'bg-red-500/20 text-red-400' : 'hover:bg-slate-700 text-white'}`}
                >
                    <VideoCameraIcon className="w-6 h-6" />
                </button>
                <div className="h-8 w-px bg-slate-700 mx-2" />
                <button
                    onClick={() => setShowChat(!showChat)}
                    className={`p-3 rounded-xl transition-all ${showChat ? 'bg-indigo-600 text-white' : 'hover:bg-slate-700 text-white'}`}
                >
                    <ChatBubbleLeftRightIcon className="w-6 h-6" />
                </button>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2">
                    <UserGroupIcon className="w-5 h-5" />
                    Invite
                </button>
            </div>

            {/* Side Chat */}
            <AnimatePresence>
                {showChat && (
                    <motion.div
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 300, opacity: 0 }}
                        className="absolute right-6 top-24 bottom-24 w-80 bg-slate-800/90 backdrop-blur-md flex flex-col rounded-3xl border border-slate-700 shadow-2xl overflow-hidden"
                    >
                        <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-slate-800">
                            <h3 className="font-bold text-white">Office Chat</h3>
                            <button onClick={() => setShowChat(false)} className="p-1 hover:bg-slate-700 rounded-lg text-slate-400">
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {chatMessages.map((msg) => (
                                <div key={msg.id} className={`${msg.sender === 'You' ? 'ml-auto' : ''} max-w-[80%]`}>
                                    <div className={`p-3 rounded-2xl text-sm ${msg.sender === 'You' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-700 text-slate-100 rounded-tl-none'}`}>
                                        <p>{msg.text}</p>
                                    </div>
                                    <p className="text-[10px] text-slate-500 mt-1 px-1">
                                        {msg.sender === 'You' ? '' : msg.sender + ' • '}{msg.timestamp}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 bg-slate-900/50">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-slate-800 border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <button
                                    onClick={sendMessage}
                                    className="p-2 bg-indigo-600 rounded-xl text-white hover:bg-indigo-700"
                                >
                                    <PaperAirplaneIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Instruction Overlay */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="absolute top-24 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full pointer-events-none"
            >
                <p className="text-white text-xs font-medium">Use WASD or Arrows to move your Avatar</p>
            </motion.div>
        </div>
    );
};

export default MultiverseHQ;
