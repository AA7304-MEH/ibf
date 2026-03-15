import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

// Using the same URL as the API base URL but parsed
const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001';

export const GlobalSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        if (!user) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
            return;
        }

        // Connect socket
        const newSocket = io(SOCKET_URL, {
            // Optional: add auth token if backend requires it
        });

        newSocket.on('connect', () => {
            console.log('Connected to socket server');
            newSocket.emit('join', user._id);
        });

        // Event Listeners
        newSocket.on('balance_update', (data: { amount: number, message: string }) => {
            const prefix = data.amount > 0 ? '+' : '';
            showToast(`${data.message}: ${prefix}₹${(data.amount / 100).toFixed(2)}`, 'info');
        });

        newSocket.on('kyc_update', (data: { status: string, message: string }) => {
            showToast(data.message, data.status === 'verified' ? 'success' : 'error');
        });

        newSocket.on('task_approved', (data: { message: string, reward: number }) => {
            showToast(`${data.message} (+₹${(data.reward / 100).toFixed(2)})`, 'success');
        });

        newSocket.on('referral_bonus', (data: { message: string, amount: number }) => {
            showToast(`${data.message} (+₹${(data.amount / 100).toFixed(2)})`, 'success');
        });

        newSocket.on('withdrawal_processed', (data: { message: string, status: string }) => {
            showToast(data.message, data.status === 'paid' ? 'success' : 'info');
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [user, showToast]);

    return <>{children}</>;
};
