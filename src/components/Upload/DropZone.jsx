// components/Upload/DropZone.jsx
import React, { useState, useCallback, useRef } from 'react';

const ALLOWED_TYPES = {
    'application/pdf': { ext: 'pdf', name: 'PDF' },
    'application/msword': { ext: 'doc', name: 'Word' },
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { ext: 'docx', name: 'Word' },
    'text/plain': { ext: 'txt', name: 'Text' },
    'application/rtf': { ext: 'rtf', name: 'RTF' }
};

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export function DropZone({ onFileSelect, onError }) {
    const [isDragActive, setIsDragActive] = useState(false);
    const [isValidating, setIsValidating] = useState(false);
    const inputRef = useRef(null);

    const validateFile = useCallback((file) => {
        const errors = [];

        // Check file type
        if (!ALLOWED_TYPES[file.type]) {
            const ext = file.name.split('.').pop().toLowerCase();
            const allowedExts = Object.values(ALLOWED_TYPES).map(t => t.ext);
            if (!allowedExts.includes(ext)) {
                errors.push(`File type not supported. Allowed: ${allowedExts.join(', ')}`);
            }
        }

        // Check file size
        if (file.size > MAX_SIZE) {
            errors.push(`File too large. Maximum size: 10MB`);
        }

        // Check if file is empty
        if (file.size === 0) {
            errors.push('File is empty');
        }

        return errors;
    }, []);

    const handleFile = useCallback(async (file) => {
        setIsValidating(true);

        try {
            const errors = validateFile(file);

            if (errors.length > 0) {
                onError(errors.join('. '));
                return;
            }

            // Optional: Validate file content
            if (file.type === 'text/plain') {
                const text = await file.text();
                if (text.trim().length === 0) {
                    onError('Document appears to be empty');
                    return;
                }
            }

            onFileSelect(file);
        } catch (err) {
            onError('Failed to process file');
        } finally {
            setIsValidating(false);
        }
    }, [validateFile, onFileSelect, onError]);

    const handleDragEnter = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
    }, []);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);

        const files = e.dataTransfer?.files;
        if (files && files.length > 0) {
            handleFile(files[0]);
        }
    }, [handleFile]);

    const handleClick = useCallback(() => {
        inputRef.current?.click();
    }, []);

    const handleInputChange = useCallback((e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFile(files[0]);
        }
        // Reset input
        e.target.value = '';
    }, [handleFile]);

    return (
        <div
            className={`drop-zone ${isDragActive ? 'drag-active' : ''} ${isValidating ? 'validating' : ''}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleClick}
        >
            <input
                ref={inputRef}
                type="file"
                className="hidden-input"
                accept=".pdf,.doc,.docx,.txt,.rtf"
                onChange={handleInputChange}
            />

            <div className="drop-zone-content">
                {isValidating ? (
                    <div className="validating-state">
                        <div className="spinner"></div>
                        <span>Validating file...</span>
                    </div>
                ) : (
                    <>
                        <div className="upload-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                        </div>

                        <div className="upload-text">
                            <span className="primary-text">
                                {isDragActive ? 'Drop your file here' : 'Drag & drop your document'}
                            </span>
                            <span className="secondary-text">or click to browse</span>
                        </div>

                        <div className="file-types">
                            <span className="file-type-badge">PDF</span>
                            <span className="file-type-badge">DOCX</span>
                            <span className="file-type-badge">DOC</span>
                            <span className="file-type-badge">TXT</span>
                            <span className="file-type-badge">RTF</span>
                        </div>

                        <span className="size-limit">Maximum file size: 10MB</span>
                    </>
                )}
            </div>

            {/* Animated Border */}
            <div className="animated-border"></div>
        </div>
    );
}