// src/components/Download/FormatSelector.jsx
import React from 'react';

const FORMATS = [
    {
        id: 'docx',
        name: 'Word Document',
        extension: '.docx',
        icon: '📝',
        description: 'Microsoft Word compatible document',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    },
    {
        id: 'pdf',
        name: 'PDF Document',
        extension: '.pdf',
        icon: '📕',
        description: 'Portable Document Format',
        mimeType: 'application/pdf'
    },
    {
        id: 'txt',
        name: 'Plain Text',
        extension: '.txt',
        icon: '📄',
        description: 'Simple text file, compatible with all editors',
        mimeType: 'text/plain'
    },
    {
        id: 'html',
        name: 'HTML Document',
        extension: '.html',
        icon: '🌐',
        description: 'Formatted web page with styling',
        mimeType: 'text/html'
    },
    {
        id: 'json',
        name: 'JSON Data',
        extension: '.json',
        icon: '📋',
        description: 'Structured data format for developers',
        mimeType: 'application/json'
    }
];

export function FormatSelector({
    selected,
    onSelect,
    disabled = false,
    showDescription = true
}) {
    return (
        <div className="format-selector">
            <label className="format-label">Output Format</label>

            <div className="format-options">
                {FORMATS.map(format => (
                    <button
                        key={format.id}
                        className={`format-option ${selected === format.id ? 'selected' : ''}`}
                        onClick={() => onSelect(format.id)}
                        disabled={disabled}
                        title={format.description}
                    >
                        <div className="format-option-content">
                            <span className="format-icon">{format.icon}</span>
                            <div className="format-text">
                                <span className="format-name">{format.name}</span>
                                <span className="format-ext">{format.extension}</span>
                            </div>
                        </div>

                        {selected === format.id && (
                            <span className="format-check">✓</span>
                        )}
                    </button>
                ))}
            </div>

            {showDescription && selected && (
                <p className="format-description">
                    {FORMATS.find(f => f.id === selected)?.description}
                </p>
            )}
        </div>
    );
}

export { FORMATS };