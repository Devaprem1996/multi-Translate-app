// components/Translation/LanguageSelector.jsx
import React, { useState } from 'react';

export function LanguageSelector({ languages, selected, onSelect }) {
    const [hoveredLang, setHoveredLang] = useState(null);

    return (
        <div className="language-selector">
            <div className="language-grid">
                {languages.map((lang) => (
                    <button
                        key={lang.code}
                        className={`language-card ${selected?.code === lang.code ? 'selected' : ''}`}
                        onClick={() => onSelect(lang)}
                        onMouseEnter={() => setHoveredLang(lang.code)}
                        onMouseLeave={() => setHoveredLang(null)}
                    >
                        {/* Glow Effect */}
                        <div className="card-glow"></div>

                        {/* Card Content */}
                        <div className="card-content">
                            {/* Flag */}
                            <span className="lang-flag">{lang.flag}</span>

                            {/* Language Info */}
                            <div className="lang-info">
                                <span className="lang-name">{lang.name}</span>
                                <span className="lang-native">{lang.native}</span>
                            </div>

                            {/* Region Badge */}
                            <span className="region-badge">{lang.region}</span>

                            {/* Selection Indicator */}
                            {selected?.code === lang.code && (
                                <div className="selected-indicator">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                    </svg>
                                </div>
                            )}
                        </div>

                        {/* Hover Preview */}
                        {hoveredLang === lang.code && (
                            <div className="hover-preview">
                                <span className="preview-text">
                                    {getPreviewText(lang.code)}
                                </span>
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}

// Preview translations of "Hello, World!"
function getPreviewText(langCode) {
    const previews = {
        ta: 'வணக்கம், உலகம்!',
        hi: 'नमस्ते, दुनिया!',
        ru: 'Привет, мир!',
        ja: 'こんにちは、世界！',
        es: '¡Hola, Mundo!'
    };
    return previews[langCode] || 'Hello, World!';
}