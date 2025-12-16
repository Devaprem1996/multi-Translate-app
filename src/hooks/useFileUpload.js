// src/hooks/useFileUpload.js
import { useState, useCallback } from 'react';
import { validators } from '../utils/validators';

export function useFileUpload(options = {}) {
    const {
        maxSize = 10 * 1024 * 1024, // 10MB
        allowedTypes = ['pdf', 'doc', 'docx', 'txt', 'rtf'],
        onSuccess,
        onError
    } = options;

    const [file, setFile] = useState(null);
    const [isValidating, setIsValidating] = useState(false);
    const [error, setError] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const validateFile = useCallback((file) => {
        const errors = [];

        if (!file) {
            errors.push({ code: 'FILE_MISSING', message: 'No file selected' });
            return errors;
        }

        // Check size
        if (file.size > maxSize) {
            errors.push({
                code: 'FILE_TOO_LARGE',
                message: `File size exceeds ${maxSize / 1024 / 1024}MB limit`
            });
        }

        // Check type
        const ext = file.name.split('.').pop().toLowerCase();
        if (!allowedTypes.includes(ext)) {
            errors.push({
                code: 'INVALID_FILE_TYPE',
                message: `File type .${ext} is not supported`
            });
        }

        // Check if empty
        if (file.size === 0) {
            errors.push({
                code: 'FILE_EMPTY',
                message: 'File is empty'
            });
        }

        return errors;
    }, [maxSize, allowedTypes]);

    const handleFile = useCallback(async (selectedFile) => {
        setIsValidating(true);
        setError(null);

        try {
            const validationErrors = validateFile(selectedFile);

            if (validationErrors.length > 0) {
                const errorMessage = validationErrors.map(e => e.message).join('. ');
                setError(errorMessage);
                onError?.(validationErrors);
                return false;
            }

            setFile(selectedFile);
            onSuccess?.(selectedFile);
            return true;

        } catch (err) {
            const message = err.message || 'Failed to process file';
            setError(message);
            onError?.([{ code: 'UNKNOWN', message }]);
            return false;

        } finally {
            setIsValidating(false);
        }
    }, [validateFile, onSuccess, onError]);

    const handleDragEnter = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const droppedFile = e.dataTransfer?.files?.[0];
        if (droppedFile) {
            handleFile(droppedFile);
        }
    }, [handleFile]);

    const handleInputChange = useCallback((e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            handleFile(selectedFile);
        }
        // Reset input
        e.target.value = '';
    }, [handleFile]);

    const clearFile = useCallback(() => {
        setFile(null);
        setError(null);
    }, []);

    return {
        file,
        error,
        isValidating,
        isDragging,
        handleFile,
        handleDragEnter,
        handleDragLeave,
        handleDragOver,
        handleDrop,
        handleInputChange,
        clearFile
    };
}