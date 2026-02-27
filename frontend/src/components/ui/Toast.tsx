import React, { useEffect } from 'react';
import { X } from './Icons';

/**
 * Props for the Toast notification component.
 */
export interface ToastProps {
    /** The message to display in the toast. */
    message: string;
    /** The type of toast, affecting its background color. Defaults to 'info'. */
    type?: 'success' | 'error' | 'info';
    /** Callback function to close the toast. */
    onClose: () => void;
    /** Duration in milliseconds before the toast automatically closes. Set to 0 to disable. Defaults to 5000. */
    duration?: number;
}

/**
 * Animated Toast notification component that appears at the top right of the screen.
 * Automatically closes after a specified duration.
 * 
 * @param {ToastProps} props - The component props.
 * @returns {JSX.Element} The rendered toast.
 */
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
