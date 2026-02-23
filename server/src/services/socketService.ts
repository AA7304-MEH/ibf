import { Server } from 'socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import http from 'http';

class SocketService {
    private io: Server | null = null;

    init(server: http.Server) {
        this.io = new Server(server, {
            cors: {
                origin: "*", // Adjust for production
                methods: ["GET", "POST"]
            }
        });

        this.setupRedisAdapter();
        this.setupListeners();

        console.log('Socket.io initialized');
        return this.io;
    }

    private async setupRedisAdapter() {
        if (process.env.REDIS_URL) {
            try {
                const pubClient = createClient({ url: process.env.REDIS_URL });
                const subClient = pubClient.duplicate();

                await Promise.all([pubClient.connect(), subClient.connect()]);

                this.io?.adapter(createAdapter(pubClient, subClient));
                console.log('Socket.io Redis adapter connected');
            } catch (err) {
                console.error('Socket.io Redis adapter failed to connect, falling back to in-memory:', err);
            }
        }
    }

    private setupListeners() {
        if (!this.io) return;

        this.io.on('connection', (socket) => {
            console.log(`User connected: ${socket.id}`);

            // Project collaboration rooms
            socket.on('join_project', (projectId: string) => {
                socket.join(`project_${projectId}`);
                console.log(`User ${socket.id} joined project room: ${projectId}`);
            });

            socket.on('move_block', (data: { projectId: string, blockId: string, x: number, y: number }) => {
                // Broadcast to everyone else in the project room
                socket.to(`project_${data.projectId}`).emit('block_moved', {
                    blockId: data.blockId,
                    x: data.x,
                    y: data.y,
                    userId: socket.id
                });
            });

            socket.on('send_message', (data: { projectId: string, text: string, sender: string }) => {
                const message = {
                    ...data,
                    timestamp: new Date().toISOString(),
                    id: Math.random().toString(36).substring(7)
                };
                this.io?.to(`project_${data.projectId}`).emit('new_message', message);
            });

            // Multiverse HQ Events
            socket.on('join_office', (data: { room: string, name: string }) => {
                socket.join(data.room);
                console.log(`User ${socket.id} joined office room: ${data.room}`);

                // Track user in room (mock state for now)
                // In production, we'd use Redis or a DB to track positions
            });

            socket.on('move', (data: { room: string, position: [number, number, number] }) => {
                socket.to(data.room).emit('player_moved', {
                    id: socket.id,
                    position: data.position
                });
            });

            socket.on('chat_message', (data: { room: string, text: string, sender: string }) => {
                const message = {
                    ...data,
                    id: Date.now().toString(),
                    timestamp: new Date().toLocaleTimeString()
                };
                socket.to(data.room).emit('new_chat', message);
            });

            socket.on('disconnect', () => {
                console.log(`User disconnected: ${socket.id}`);
            });
        });
    }

    // Generic helper to send notifications
    emitToUser(userId: string, event: string, data: any) {
        this.io?.to(`user_${userId}`).emit(event, data);
    }

    emitToModule(moduleName: string, event: string, data: any) {
        this.io?.to(`module_${moduleName}`).emit(event, data);
    }

    getIO() {
        return this.io;
    }
}

export const socketService = new SocketService();
