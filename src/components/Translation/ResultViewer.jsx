// components/Translation/ResultViewer.jsx
import React, { useState } from 'react';

export function ResultViewer({ result, originalFile, targetLanguage }) {
    const [viewMode, setViewMode] = useState('side-by-side'); // 'side-by-side', 'translated', 'original'
    const [fontSize, setFontSize] = useState('medium'); // 'small', 'medium', 'large'

    const fontSizes = {
        small: '14px',
        medium: '16px',
        large: '18px'
    };

    return (
        <div className="result-viewer">
            {/* Toolbar */}
            <div className="viewer-toolbar">
                {/* Metrics */}
                <div className="translation-metrics" style={{ marginLeft: 0 }}>
                    <div className="metric">
                        <span className="metric-label">Confidence</span>
                        <span className="metric-value confidence-high">
                            {(result.metrics?.averageConfidence * 100).toFixed(1)}%
                        </span>
                    </div>
                    <div className="metric">
                        <span className="metric-label">Words</span>
                        <span className="metric-value">
                            {result.metrics?.translatedWordCount?.toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className={`viewer-content ${viewMode}`}>
                {(viewMode === 'side-by-side' || viewMode === 'original') && (
                    <div className="content-panel original-panel">
                        <div className="panel-header">
                            <span className="panel-title">🇬🇧 Original (English)</span>
                        </div>
                        <div
                            className="panel-content"
                            style={{ fontSize: fontSizes[fontSize] }}
                        >
                            {formatContent(result.originalText || 'Original text not available')}
                        </div>
                    </div>
                )}

                {(viewMode === 'side-by-side' || viewMode === 'translated') && (
                    <div className="content-panel translated-panel">
                        <div className="panel-header">
                            <span className="panel-title">
                                {targetLanguage?.flag} Translated ({targetLanguage?.name})
                            </span>
                        </div>
                        <div
                            className="panel-content"
                            style={{ fontSize: fontSizes[fontSize] }}
                        >
                            {formatContent(result.translatedText)}
                        </div>
                    </div>
                )}
            </div>

            {/* Warnings */}
            {result.warnings && result.warnings.length > 0 && (
                <div className="warnings-section">
                    {result.warnings.map((warning, index) => (
                        <div key={index} className={`warning-item ${warning.type.toLowerCase()}`}>
                            <span className="warning-icon">⚠️</span>
                            <span className="warning-message">{warning.message}</span>
                            {warning.recommendation && (
                                <span className="warning-recommendation">
                                    💡 {warning.recommendation}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// Helper to format text into paragraphs
function formatContent(text) {
    if (!text) return 'No content available';

    // Split by double newline or simple newline
    // First, split by double newlines to find clear paragraphs
    return text.split(/\n\s*\n/).map((paragraph, index) => {
        // Trim whitespace
        const cleanParagraph = paragraph.trim();
        if (!cleanParagraph) return null;

        return (
            <p key={index} className="translation-paragraph">
                {cleanParagraph}
            </p>
        );
    }).filter(Boolean);
}