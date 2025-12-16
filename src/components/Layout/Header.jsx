// components/Layout/Header.jsx
import React from 'react';

export function Header({ onReset }) {
    return (
        <header className="app-header">
            <div className="header-content">
                {/* Logo */}
                <div className="logo" onClick={onReset} style={{ cursor: 'pointer' }}>
                    <div className="logo-icon">
                        <svg viewBox="0 0 40 40" fill="none">
                            <defs>
                                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#6366f1" />
                                    <stop offset="100%" stopColor="#8b5cf6" />
                                </linearGradient>
                            </defs>
                            <rect x="4" y="4" width="32" height="32" rx="8" fill="url(#logoGradient)" />
                            <path
                                d="M12 14h16M12 20h12M12 26h8"
                                stroke="white"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                            />
                            <circle cx="28" cy="26" r="6" fill="white" fillOpacity="0.9" />
                            <path
                                d="M26 26h4M28 24v4"
                                stroke="url(#logoGradient)"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                            />
                        </svg>
                    </div>
                    <div className="logo-text">
                        <span className="logo-title">DocTranslate</span>
                        <span className="logo-subtitle">AI-Powered Translation</span>
                    </div>
                </div>
            </div>

            {/* Animated Background Line */}
            <div className="header-line">
                <div className="line-glow"></div>
            </div>
        </header>
    );
}