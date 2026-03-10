import React, { useEffect } from 'react';

interface ToastProps {
    message: string;
    isVisible: boolean;
    type?: 'info' | 'warning';
    onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, isVisible, type = 'info', onClose }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 8000); // Auto close after 8 seconds
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    return (
        <div className={`toast-notification glass-panel ${type} visible`}>
            <div className="toast-icon">
                {type === 'warning' ? '⏰' : '🔔'}
            </div>
            <div className="toast-content">
                <h4>Pengingat Otomatis</h4>
                <p>{message}</p>
            </div>
            <button className="toast-close" onClick={onClose}>&times;</button>
        </div>
    );
};
