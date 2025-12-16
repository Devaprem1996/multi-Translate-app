// src/components/Upload/FilePreview.jsx
import React, { useState, useEffect } from 'react';

export function FilePreview({ file, onRemove, showContent = false }) {
    const [preview, setPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (file && showContent && file.type === 'text/plain') {
            setIsLoading(true);
            const reader = new FileReader();

            reader.onload = (e) => {
                const text = e.target.result;
                // Show first 500 characters
                setPreview(text.substring(0, 500) + (text.length > 500 ? '...' : ''));
                setIsLoading(false);
            };

            reader.onerror = () => {
                setPreview('Unable to preview file');
                setIsLoading(false);
            };

            reader.readAsText(file);
        }
    }, [file, showContent]);

    const formatSize = (bytes) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    const getFileIcon = (fileName) => {
        const ext = fileName.split('.').pop().toLowerCase();
        const icons = {
            pdf: '📕',
            doc: '📘',
            docx: '📘',
            txt: '📄',
            rtf: '📝'
        };
        return icons[ext] || '📄';
    };

    const getFileColor = (fileName) => {
        const ext = fileName.split('.').pop().toLowerCase();
        const colors = {
            pdf: '#ef4444',
            doc: '#3b82f6',
            docx: '#3b82f6',
            txt: '#64748b',
            rtf: '#8b5cf6'
        };
        return colors[ext] || '#64748b';
    };

    if (!file) return null;

    return (
        <div className="file-preview">
            {/* File Card */}
            <div className="file-card">
                {/* Icon */}
                <div
                    className="file-icon-large"
                    style={{ backgroundColor: `${getFileColor(file.name)}20` }}
                >
                    <span style={{ fontSize: '2rem' }}>{getFileIcon(file.name)}</span>
                </div>

                {/* Info */}
                <div className="file-details">
                    <h4 className="file-name-full">{file.name}</h4>
                    <div className="file-meta">
                        <span className="meta-item">
                            <span className="meta-icon">📦</span>
                            {formatSize(file.size)}
                        </span>
                        <span className="meta-item">
                            <span className="meta-icon">📋</span>
                            {file.type || 'Unknown type'}
                        </span>
                        <span className="meta-item">
                            <span className="meta-icon">🕐</span>
                            {new Date(file.lastModified).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="file-actions">
                    {onRemove && (
                        <button
                            className="action-btn remove"
                            onClick={onRemove}
                            title="Remove file"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* Content Preview */}
            {showContent && (
                <div className="content-preview">
                    <div className="preview-header">
                        <span className="preview-title">📖 Content Preview</span>
                    </div>
                    <div className="preview-body">
                        {isLoading ? (
                            <div className="preview-loading">
                                <div className="spinner" />
                                <span>Loading preview...</span>
                            </div>
                        ) : preview ? (
                            <pre className="preview-text">{preview}</pre>
                        ) : (
                            <p className="preview-unavailable">
                                Preview not available for this file type
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}