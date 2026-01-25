import React from 'react';
import { XMarkIcon, CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'info';
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    const icons = {
        success: <CheckCircleIcon className="w-6 h-6 text-green-500" />,
        error: <ExclamationCircleIcon className="w-6 h-6 text-red-500" />,
        info: <InformationCircleIcon className="w-6 h-6 text-blue-500" />
    };

    const bgColors = {
        success: 'bg-green-50 border-green-200',
        error: 'bg-red-50 border-red-200',
        info: 'bg-blue-50 border-blue-200'
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.3 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                className={`fixed bottom-4 right-4 flex items-center p-4 mb-4 rounded-lg border shadow-lg ${bgColors[type]} z-50 min-w-[300px]`}
                role="alert"
            >
                <div className="flex-shrink-0">
                    {icons[type]}
                </div>
                <div className="ml-3 text-sm font-medium text-gray-800">
                    {message}
                </div>
                <button
                    type="button"
                    className="ml-auto -mx-1.5 -my-1.5 bg-transparent text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8"
                    onClick={onClose}
                    aria-label="Close"
                >
                    <XMarkIcon className="w-5 h-5" />
                </button>
            </motion.div>
        </AnimatePresence>
    );
};

export default Toast;
