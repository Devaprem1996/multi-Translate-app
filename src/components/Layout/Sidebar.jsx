// src/components/Layout/Sidebar.jsx
import React, { useState } from 'react';

export function Sidebar({ isOpen, onClose }) {
    const [activeSection, setActiveSection] = useState('translate');

    const menuItems = [
        { id: 'translate', icon: '🔄', label: 'Translate', badge: null },
        { id: 'history', icon: '📋', label: 'History', badge: '3' },
        { id: 'templates', icon: '📑', label: 'Templates', badge: null },
        { id: 'settings', icon: '⚙️', label: 'Settings', badge: null },
    ];

    const languages = [
        { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
        { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
        { code: 'ru', name: 'Russian', flag: '🇷🇺' },
        { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
        { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    ];

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                {/* Header */}
                <div className="sidebar-header">
                    <h3 className="sidebar-title">Menu</h3>
                    <button className="sidebar-close" onClick={onClose}>
                        ✕
                    </button>
                </div>

                {/* Navigation */}
                <nav className="sidebar-nav">
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            className={`sidebar-item ${activeSection === item.id ? 'active' : ''}`}
                            onClick={() => setActiveSection(item.id)}
                        >
                            <span className="sidebar-icon">{item.icon}</span>
                            <span className="sidebar-label">{item.label}</span>
                            {item.badge && (
                                <span className="sidebar-badge">{item.badge}</span>
                            )}
                        </button>
                    ))}
                </nav>

                {/* Divider */}
                <div className="sidebar-divider" />

                {/* Languages */}
                <div className="sidebar-section">
                    <h4 className="sidebar-section-title">Supported Languages</h4>
                    <div className="language-list">
                        {languages.map(lang => (
                            <div key={lang.code} className="language-item">
                                <span className="language-flag">{lang.flag}</span>
                                <span className="language-name">{lang.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="sidebar-footer">
                    <div className="usage-info">
                        <div className="usage-label">Daily Usage</div>
                        <div className="usage-bar">
                            <div className="usage-fill" style={{ width: '35%' }} />
                        </div>
                        <div className="usage-text">35 / 100 translations</div>
                    </div>
                </div>
            </aside>
        </>
    );
}