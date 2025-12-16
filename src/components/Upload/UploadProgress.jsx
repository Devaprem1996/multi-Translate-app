// src/components/Upload/UploadProgress.jsx
import React from 'react';

export function UploadProgress({
    progress,
    fileName,
    status = 'uploading',
    onCancel
}) {
    const statusConfig = {
        uploading: {
            label: 'Uploading...',
            color: 'var(--primary)',
            icon: '⬆️'
        },
        processing: {
            label: 'Processing...',
            color: 'var(--secondary)',
            icon: '⚙️'
        },
        complete: {
            label: 'Complete!',
            color: 'var(--success)',
            icon: '✅'
        },
        error: {
            label: 'Failed',
            color: 'var(--error)',
            icon: '❌'
        }
    };

    const config = statusConfig[status] || statusConfig.uploading;

    return (
        <div className={`upload-progress ${status}`}>
            {/* File Info */}
            <div className="upload-file-info">
                <span className="upload-icon">{config.icon}</span>
                <div className="upload-details">
                    <span className="upload-filename">{fileName}</span>
                    <span className="upload-status">{config.label}</span>
                </div>
                {status === 'uploading' && onCancel && (
                    <button className="upload-cancel" onClick={onCancel}>
                        Cancel
                    </button>
                )}
            </div>

            {/* Progress Bar */}
            <div className="upload-bar-container">
                <div
                    className="upload-bar"
                    style={{
                        width: `${progress}%`,
                        backgroundColor: config.color
                    }}
                >
                    {status === 'uploading' && (
                        <div className="upload-bar-shimmer" />
                    )}
                </div>
            </div>

            {/* Progress Text */}
            <div className="upload-progress-text">
                <span>{progress}%</span>
                {status === 'uploading' && progress < 100 && (
                    <span className="upload-estimate">
                        Estimated time: {Math.ceil((100 - progress) / 10)}s
                    </span>
                )}
            </div>
        </div>
    );
}