// components/Download/DownloadPanel.jsx
import React, { useState } from 'react';

const DOWNLOAD_FORMATS = [
  { id: 'docx', name: 'Word Document', ext: '.docx', icon: '📝', description: 'Microsoft Word compatible' },
  { id: 'pdf', name: 'PDF Document', ext: '.pdf', icon: '📕', description: 'Portable Document Format' },
  { id: 'txt', name: 'Plain Text', ext: '.txt', icon: '📄', description: 'Simple text file' },
  { id: 'html', name: 'HTML', ext: '.html', icon: '🌐', description: 'Formatted web page' },
  { id: 'json', name: 'JSON', ext: '.json', icon: '📋', description: 'Structured data' }
];

import { PreviewModal } from '../Preview/PreviewModal';
import { documentGenerator } from '../../services/documentGenerator';

export function DownloadPanel({ result, fileName, language }) {
  const [selectedFormat, setSelectedFormat] = useState('docx');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      // Simulate progress while generating
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      // Use the generator service
      const { blob, ext } = await documentGenerator.generate(selectedFormat, result, fileName, language);

      clearInterval(progressInterval);
      setDownloadProgress(100);

      // Create and trigger download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const baseName = fileName.replace(/\.[^/.]+$/, '');
      link.href = url;
      link.download = `${baseName}_${language.code}${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Reset after short delay
      setTimeout(() => {
        setIsDownloading(false);
        setDownloadProgress(0);
      }, 1000);

    } catch (error) {
      console.error('Download failed:', error);
      setIsDownloading(false);
    }
  };

  return (
    <div className="download-panel">
      <div className="panel-header">
        <h3 className="panel-title">
          <span className="title-icon">💾</span>
          Download Translation
        </h3>
        <button
          className="btn btn-secondary"
          onClick={() => setIsPreviewOpen(true)}
          style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem' }}
        >
          👁️ Preview
        </button>
      </div>

      {/* Format Selection */}
      <div className="format-grid">
        {DOWNLOAD_FORMATS.map(format => (
          <button
            key={format.id}
            className={`format-card ${selectedFormat === format.id ? 'selected' : ''}`}
            onClick={() => setSelectedFormat(format.id)}
          >
            <span className="format-icon">{format.icon}</span>
            <div className="format-info">
              <span className="format-name">{format.name}</span>
              <span className="format-ext">{format.ext}</span>
            </div>
            <span className="format-desc">{format.description}</span>

            {selectedFormat === format.id && (
              <div className="selected-check">✓</div>
            )}
          </button>
        ))}
      </div>

      {/* Download Button */}
      <button
        className={`download-btn ${isDownloading ? 'downloading' : ''}`}
        onClick={handleDownload}
        disabled={isDownloading}
      >
        {isDownloading ? (
          <>
            <div
              className="download-progress-bar"
              style={{ width: `${downloadProgress}%` }}
            />
            <span className="download-text">
              {downloadProgress < 100 ? 'Preparing...' : 'Complete!'}
            </span>
          </>
        ) : (
          <>
            <svg className="download-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span className="download-text">Download Translation</span>
          </>
        )}
      </button>

      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        result={result}
        fileName={fileName}
        language={language}
      />
    </div>
  );
}