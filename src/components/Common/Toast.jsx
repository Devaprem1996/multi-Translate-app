// components/Common/Toast.jsx
import React, { useEffect, useState } from 'react';

export function Toast({ type, message, onClose }) {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        // Trigger enter animation
        requestAnimationFrame(() => {
            setIsVisible(true);
        });
    }, []);

    const handleClose = () => {
        setIsLeaving(true);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    const icons = {
        error: '❌',
        success: '✅',
        warning: '⚠️',
        info: 'ℹ️'
    };

    return (
        <div
            className={`toast toast-${type} ${isVisible ? 'visible' : ''} ${isLeaving ? 'leaving' : ''}`}
        >
            <span className="toast-icon">{icons[type]}</span>
            <span className="toast-message">{message}</span>
            <button className="toast-close" onClick={handleClose}>
                ✕
            </button>
            <div className="toast-progress"></div>
        </div>
    );
}