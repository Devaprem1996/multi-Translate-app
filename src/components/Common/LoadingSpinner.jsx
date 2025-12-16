// components/Common/LoadingSpinner.jsx
import React from 'react';

export function LoadingSpinner({ size = 'medium', text = '' }) {
    const sizes = {
        small: 24,
        medium: 48,
        large: 72
    };

    return (
        <div className="loading-spinner-container">
            <div
                className="loading-spinner"
                style={{
                    width: sizes[size],
                    height: sizes[size]
                }}
            >
                <svg viewBox="0 0 50 50">
                    <circle
                        className="spinner-track"
                        cx="25"
                        cy="25"
                        r="20"
                        fill="none"
                        strokeWidth="4"
                    />
                    <circle
                        className="spinner-head"
                        cx="25"
                        cy="25"
                        r="20"
                        fill="none"
                        strokeWidth="4"
                        strokeDasharray="80, 200"
                        strokeDashoffset="0"
                    />
                </svg>
            </div>
            {text && <span className="spinner-text">{text}</span>}
        </div>
    );
}