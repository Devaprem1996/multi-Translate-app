// hooks/useErrorHandler.js
import { useState, useCallback } from 'react';

export function useErrorHandler() {
    const [toasts, setToasts] = useState([]);

    const showError = useCallback((message, type = 'error') => {
        const id = Date.now();
        const toast = { id, message, type };

        setToasts(prev => [...prev, toast]);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 5000);

        return id;
    }, []);

    const showSuccess = useCallback((message) => {
        return showError(message, 'success');
    }, [showError]);

    const showWarning = useCallback((message) => {
        return showError(message, 'warning');
    }, [showError]);

    const clearError = useCallback((id) => {
        if (id) {
            setToasts(prev => prev.filter(t => t.id !== id));
        } else {
            setToasts([]);
        }
    }, []);

    return {
        error: toasts.find(t => t.type === 'error')?.message || null,
        toasts,
        showError,
        showSuccess,
        showWarning,
        clearError
    };
}