import React from 'react';
import { documentGenerator } from '../../services/documentGenerator';

export function PreviewModal({ isOpen, onClose, result, fileName, language }) {
    if (!isOpen || !result) return null;

    // content is formatted text lines
    const formattedLines = documentGenerator.formatText(result.translatedText);

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3 className="modal-title">
                        <span className="modal-icon">👁️</span>
                        Document Preview
                    </h3>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="preview-container">
                    <div className="preview-page">
                        <div className="preview-doc-header">
                            <h1>{language.name} Translation</h1>
                            <div className="preview-meta">
                                <p><strong>Original:</strong> {fileName}</p>
                                <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="preview-body">
                            {formattedLines.map((line, index) => (
                                <p key={index} className="preview-paragraph">{line}</p>
                            ))}
                        </div>

                        <div className="preview-footer">
                            Predicted confidence: {(result.metrics?.averageConfidence * 100).toFixed(1)}%
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}
