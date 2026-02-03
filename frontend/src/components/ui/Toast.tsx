import React, { useEffect } from 'react';
import { X } from './Icons';

export interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'info';
    onClose: () => void;
    duration?: number;
}

const Toast: React.FC<ToastProps> = ({
    message,
    type = 'info',
    onClose,
    duration = 5000
}) => {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const bgColors = {
        success: 'bg-green-600',
        error: 'bg-red-600',
        info: 'bg-blue-600'
    };

    return (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white transform transition-all animate-in slide-in-from-top-2 duration-300 ${bgColors[type]}`}>
            <span className="text-sm font-medium">{message}</span>
            <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Close notification"
            >
                <X size={16} />
            </button>
        </div>
    );
};

export default Toast;
