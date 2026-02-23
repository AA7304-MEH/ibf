import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
    OrbitControls,
    PerspectiveCamera,
    Environment,
    Float,
    RoundedBox,
    Text,
    ContactShadows,
    Html,
    Line
} from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ClockIcon,
    PaperAirplaneIcon,
    UserGroupIcon,
    CheckCircleIcon,
    XCircleIcon,
    Bars3Icon,
    ChatBubbleLeftRightIcon,
    CubeIcon,
    CpuChipIcon
} from '@heroicons/react/24/outline';
import { io, Socket } from 'socket.io-client';
import api from '../../../services/api';
import * as THREE from 'three';

// --- Types ---
interface Block {
    id: string;
    title: string;
    position: [number, number, number];
    color: string;
    status: 'OK' | 'LOAD' | 'FAIL';
}

// --- 3D Components ---

const ArchitectureBlock = ({
    block,
    isDragging,
    onPointerDown
}: {
    block: Block,
    isDragging: boolean,
    onPointerDown: (e: any) => void
}) => {
    return (
        <group position={block.position}>
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                <RoundedBox
                    args={[2, 1.2, 0.4]}
                    radius={0.1}
                    smoothness={4}
                    onPointerDown={onPointerDown}
                >
                    <meshStandardMaterial
                        color={block.color}
                        roughness={0.1}
                        metalness={0.8}
                        emissive={block.color}
                        emissiveIntensity={0.2}
                    />
                </RoundedBox>
                <Text
                    position={[0, 0, 0.21]}
                    fontSize={0.15}
                    color="white"
                    font="/fonts/Inter-Bold.woff"
                    anchorX="center"
                    anchorY="middle"
                >
                    {block.title.toUpperCase()}
                </Text>

                {/* Status Indicator */}
                <mesh position={[0.7, 0.4, 0.21]}>
                    <sphereGeometry args={[0.05, 16, 16]} />
                    <meshStandardMaterial color={block.status === 'OK' ? '#10b981' : '#f59e0b'} />
                </mesh>
            </Float>

            {/* Label in 3D Space */}
            <Html position={[0, -0.8, 0]} center distanceFactor={8}>
                <div className="px-2 py-0.5 rounded bg-black/50 text-[8px] text-white uppercase tracking-widest border border-white/10 whitespace-nowrap">
                    Node: {block.id} • Latency: 12ms
                </div>
            </Html>
        </group>
    );
};

// --- Main Assistant Component for Dragging ---
const DragController = ({
    blocks,
    updateBlock
}: {
    blocks: Block[],
    updateBlock: (id: string, pos: [number, number, number]) => void
}) => {
    const { camera, raycaster, mouse, size } = useThree();
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const planeIntersect = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

    const onPointerMove = (e: any) => {
        if (!draggingId) return;

        raycaster.setFromCamera(mouse, camera);
        const intersectPoint = new THREE.Vector3();
        raycaster.ray.intersectPlane(planeIntersect, intersectPoint);

        updateBlock(draggingId, [intersectPoint.x, intersectPoint.y, 0]);
    };

    const onPointerUp = () => setDraggingId(null);

    useEffect(() => {
        window.addEventListener('pointerup', onPointerUp);
        return () => window.removeEventListener('pointerup', onPointerUp);
    }, []);

    return (
        <group onPointerMove={onPointerMove}>
            {blocks.map(block => (
                <ArchitectureBlock
                    key={block.id}
                    block={block}
                    isDragging={draggingId === block.id}
                    onPointerDown={() => setDraggingId(block.id)}
                />
            ))}
        </group>
    );
};

const ProjectWarRoom3D: React.FC = () => {
    const projectId = "alpha-protocol";
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [showChat, setShowChat] = useState(true);
    const [activeTab, setActiveTab] = useState<'system' | 'chat'>('system');

    const [blocks, setBlocks] = useState<Block[]>([
        { id: 'auth', title: 'Auth Service', position: [-3, 2, 0], color: '#3b82f6', status: 'OK' },
        { id: 'gateway', title: 'API Gateway', position: [0, 0, 0], color: '#6366f1', status: 'OK' },
        { id: 'payment', title: 'Razor-Free Pay', position: [3, -2, 0], color: '#ec4899', status: 'LOAD' },
        { id: 'db', title: 'Main Cluster', position: [4, 2, 0], color: '#10b981', status: 'OK' }
    ]);

    useEffect(() => {
        const socketUrl = import.meta.env.VITE_API_URL
            ? import.meta.env.VITE_API_URL.replace('/api', '')
            : 'http://localhost:5001';

        const s = io(socketUrl);
        setSocket(s);

        s.emit('join_project', projectId);

        s.on('block_moved', (data) => {
            setBlocks(prev => prev.map(b =>
                b.id === data.blockId ? { ...b, position: [data.x, data.y, 0] } : b
            ));
        });

        s.on('new_message', (msg) => {
            setMessages(prev => [...prev, msg].slice(-50));
        });

        return () => {
            s.disconnect();
        };
    }, []);

    const updateBlockPos = (id: string, pos: [number, number, number]) => {
        setBlocks(prev => prev.map(b => b.id === id ? { ...b, position: pos } : b));
        socket?.emit('move_block', {
            projectId,
            blockId: id,
            x: pos[0],
            y: pos[1]
        });
    };

    const sendMessage = () => {
        if (!input.trim() || !socket) return;
        const msg = {
            id: Date.now().toString(),
            sender: 'Founder',
            text: input,
            timestamp: new Date().toISOString()
        };
        socket.emit('send_message', { projectId, ...msg });
        setMessages(prev => [...prev, msg]);
        setInput('');
    };

    return (
        <div className="h-screen w-full bg-[#0a0a0c] overflow-hidden relative font-mono">
            {/* 3D Viewport */}
            <div className="absolute inset-0">
                <Canvas shadows>
                    <Suspense fallback={null}>
                        <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={50} />
                        <OrbitControls
                            enableRotate={true}
                            enablePan={false}
                            maxDistance={20}
                            minDistance={5}
                            maxPolarAngle={Math.PI / 1.5}
                        />

                        <ambientLight intensity={0.2} />
                        <pointLight position={[10, 10, 10]} intensity={1.5} color="#4f46e5" />
                        <pointLight position={[-10, -10, -10]} intensity={1} color="#ec4899" />

                        <Environment preset="night" />

                        {/* Grid Ground */}
                        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]} receiveShadow>
                            <planeGeometry args={[50, 50]} />
                            <meshStandardMaterial color="#050505" roughness={0.9} transparent opacity={0.5} />
                        </mesh>
                        <gridHelper args={[50, 50, "#1a1a1e", "#0a0a0c"]} position={[0, -4.99, 0]} />

                        <DragController blocks={blocks} updateBlock={updateBlockPos} />

                        {/* Connection Lines */}
                        {blocks.slice(1).map((b, i) => (
                            <Line
                                key={i}
                                points={[blocks[0].position, b.position]}
                                color="#4f46e5"
                                lineWidth={1}
                                transparent
                                opacity={0.2}
                            />
                        ))}

                        <ContactShadows position={[0, -4.95, 0]} opacity={0.4} scale={30} blur={2.5} far={10} />
                    </Suspense>
                </Canvas>
            </div>

            {/* UI Overlays */}

            {/* Top Bar */}
            <header className="absolute top-6 left-6 right-6 flex justify-between items-start pointer-events-none">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-black/40 backdrop-blur-xl p-4 rounded-2xl border border-white/10 pointer-events-auto"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <CpuChipIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                War Room: Spatial Protocol
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            </h1>
                            <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em]">Alpha Channel • AES-256 Cryptography</p>
                        </div>
                    </div>
                </motion.div>

                <div className="flex gap-4 pointer-events-auto">
                    <div className="bg-black/40 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 flex items-center gap-3">
                        <UserGroupIcon className="w-4 h-4 text-indigo-400" />
                        <span className="text-xs font-bold text-white uppercase tracking-widest">3 Nodes Active</span>
                    </div>
                </div>
            </header>

            {/* Sidebar Controls */}
            <div className="absolute left-6 bottom-6 top-32 w-72 flex flex-col gap-4 pointer-events-none">
                {/* System Diagnostics */}
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-black/40 backdrop-blur-xl p-5 rounded-2xl border border-white/10 pointer-events-auto flex-1 overflow-hidden flex flex-col"
                >
                    <div className="flex items-center gap-2 mb-6 text-gray-400">
                        <ClockIcon className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">System Telemetry</span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 text-[10px]">
                        <div className="pl-3 border-l border-green-500/50">
                            <p className="text-gray-500 text-[8px]">14:20:01 • KERNEL</p>
                            <p className="text-gray-300">Spatial environment mapping complete.</p>
                        </div>
                        <div className="pl-3 border-l border-indigo-500/50">
                            <p className="text-gray-500 text-[8px]">14:21:45 • NETWORK</p>
                            <p className="text-gray-300">P2P Uplink verified with Node_Founder.</p>
                        </div>
                        {messages.slice(-3).map((msg, i) => (
                            <div key={i} className="pl-3 border-l border-white/20">
                                <p className="text-gray-500 text-[8px] uppercase">{msg.sender} • Broadcast</p>
                                <p className="text-gray-300 line-clamp-1">{msg.text}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Interaction Instruction */}
                <div className="bg-indigo-600/10 backdrop-blur-sm p-4 rounded-2xl border border-indigo-500/20 pointer-events-none">
                    <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest leading-relaxed">
                        Drag nodes to rearrange architecture. Changes sync in real-time across the pod.
                    </p>
                </div>
            </div>

            {/* Chat Overlay (Bottom Right) */}
            <div className="absolute right-6 bottom-6 w-80 pointer-events-none">
                <AnimatePresence>
                    {showChat && (
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            className="bg-black/60 backdrop-blur-2xl rounded-3xl border border-white/10 overflow-hidden pointer-events-auto shadow-2xl"
                        >
                            <div className="p-4 bg-white/5 border-b border-white/5 flex justify-between items-center">
                                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-400">Neural Uplink</span>
                                <button className="text-gray-500 hover:text-white transition">
                                    <Bars3Icon className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="h-64 overflow-y-auto p-4 space-y-4 text-[11px]">
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`flex flex-col ${msg.sender === 'Founder' ? 'items-end' : 'items-start'}`}>
                                        <div className={`px-3 py-2 rounded-xl max-w-[90%] ${msg.sender === 'Founder' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white/10 text-gray-200 rounded-tl-none'}`}>
                                            <p>{msg.text}</p>
                                        </div>
                                        <span className="text-[7px] text-gray-600 mt-1 uppercase tracking-tighter">{msg.sender}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="p-4 bg-white/5">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                        placeholder="TRANSMIT..."
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-[10px] text-white focus:outline-none focus:border-indigo-500/50"
                                    />
                                    <button
                                        onClick={sendMessage}
                                        className="absolute right-2 top-1.5 p-1 text-indigo-500 hover:text-indigo-400"
                                    >
                                        <PaperAirplaneIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="mt-4 flex justify-end">
                    <button
                        onClick={() => setShowChat(!showChat)}
                        className={`p-4 rounded-full transition-all shadow-xl pointer-events-auto ${showChat ? 'bg-indigo-600 text-white' : 'bg-black/80 text-gray-400 border border-white/10'}`}
                    >
                        <ChatBubbleLeftRightIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProjectWarRoom3D;
