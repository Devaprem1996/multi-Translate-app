// components/Translation/TranslationProgress.jsx
import React, { useEffect, useState } from 'react';

export function TranslationProgress({ progress, file, language }) {
    const [dots, setDots] = useState('');
    const [particles, setParticles] = useState([]);

    // Animated dots
    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.');
        }, 500);
        return () => clearInterval(interval);
    }, []);

    // Generate particles for animation
    useEffect(() => {
        const newParticles = Array.from({ length: 20 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 6 + 2,
            duration: Math.random() * 3 + 2
        }));
        setParticles(newParticles);
    }, []);

    const getStatusMessage = () => {
        if (progress < 20) return 'Uploading document';
        if (progress < 40) return 'Extracting text';
        if (progress < 70) return 'Translating content';
        if (progress < 90) return 'Building document';
        return 'Finalizing';
    };

    return (
        <div className="translation-progress">
            {/* Animated Background */}
            <div className="progress-particles">
                {particles.map(p => (
                    <div
                        key={p.id}
                        className="particle"
                        style={{
                            left: `${p.x}%`,
                            top: `${p.y}%`,
                            width: `${p.size}px`,
                            height: `${p.size}px`,
                            animationDuration: `${p.duration}s`
                        }}
                    />
                ))}
            </div>

            {/* Progress Circle */}
            <div className="progress-circle-container">
                <svg className="progress-circle" viewBox="0 0 100 100">
                    {/* Background Circle */}
                    <circle
                        className="progress-bg"
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        strokeWidth="6"
                    />
                    {/* Progress Arc */}
                    <circle
                        className="progress-bar"
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        strokeWidth="6"
                        strokeDasharray={`${2 * Math.PI * 45}`}
                        strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                        strokeLinecap="round"
                    />
                </svg>

                {/* Percentage */}
                <div className="progress-text">
                    <span className="progress-number">{Math.round(progress)}</span>
                    <span className="progress-percent">%</span>
                </div>
            </div>

            {/* Status Info */}
            <div className="progress-info">
                <h3 className="status-message">
                    {getStatusMessage()}{dots}
                </h3>

                <div className="translation-details">
                    <div className="detail-item">
                        <span className="detail-icon">📄</span>
                        <span className="detail-text">{file?.name}</span>
                    </div>
                    <div className="detail-separator">→</div>
                    <div className="detail-item">
                        <span className="detail-icon">{language?.flag}</span>
                        <span className="detail-text">{language?.name}</span>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="linear-progress">
                <div
                    className="linear-progress-bar"
                    style={{ width: `${progress}%` }}
                >
                    <div className="progress-shimmer"></div>
                </div>
            </div>

            {/* Tips */}
            <div className="progress-tip">
                💡 Tip: Translation quality depends on document complexity
            </div>
        </div>
    );
}