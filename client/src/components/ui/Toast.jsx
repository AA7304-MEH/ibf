import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
        error: <AlertCircle className="w-5 h-5 text-red-500" />,
        warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
        info: <Info className="w-5 h-5 text-primary" />,
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={cn(
                "fixed bottom-10 right-10 z-[100] flex items-center gap-4 px-6 py-4 rounded-2xl border border-border shadow-2xl bg-background-surface max-w-sm"
            )}
        >
            <div className="p-2 bg-border/30 rounded-xl">
                {icons[type]}
            </div>
            <p className="text-sm font-black text-white italic tracking-tight uppercase">{message}</p>
            <button
                onClick={onClose}
                className="ml-auto p-2 bg-border/20 hover:bg-border/50 rounded-lg text-foreground-muted hover:text-white transition-all"
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
};

export default Toast;
