// components/Download/DownloadPanel.jsx
import React, { useState } from 'react';

const DOWNLOAD_FORMATS = [
    { id: 'txt', name: 'Plain Text', ext: '.txt', icon: '📄', description: 'Simple text file' },
    { id: 'html', name: 'HTML', ext: '.html', icon: '🌐', description: 'Formatted web page' },
    { id: 'json', name: 'JSON', ext: '.json', icon: '📋', description: 'Structured data' }
];

export function DownloadPanel({ result, fileName, language }) {
    const [selectedFormat, setSelectedFormat] = useState('txt');
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);

    const handleDownload = async () => {
        setIsDownloading(true);
        setDownloadProgress(0);

        try {
            // Simulate progress
            const progressInterval = setInterval(() => {
                setDownloadProgress(prev => Math.min(prev + 20, 90));
            }, 200);

            // Create the file content
            const format = DOWNLOAD_FORMATS.find(f => f.id === selectedFormat);
            let content = '';
            let mimeType = '';

            switch (selectedFormat) {
                case 'txt':
                    content = result.translatedText;
                    mimeType = 'text/plain';
                    break;
                case 'html':
                    content = generateHTML(result, fileName, language);
                    mimeType = 'text/html';
                    break;
                case 'json':
                    content = JSON.stringify({
                        metadata: {
                            originalFile: fileName,
                            targetLanguage: language.code,
                            languageName: language.name,
                            generatedAt: new Date().toISOString(),
                            metrics: result.metrics
                        },
                        translation: result.translatedText
                    }, null, 2);
                    mimeType = 'application/json';
                    break;
            }

            clearInterval(progressInterval);
            setDownloadProgress(100);

            // Create and trigger download
            const blob = new Blob([content], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            const baseName = fileName.replace(/\.[^/.]+$/, '');
            link.href = url;
            link.download = `${baseName}_${language.code}${format.ext}`;
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
        </div>
    );
}

// Helper function to generate HTML
function generateHTML(result, fileName, language) {
    // Convert text to paragraphs
    const paragraphs = result.translatedText
        .split(/\n\s*\n/)
        .map(p => p.trim())
        .filter(p => p)
        .map(p => `<p>${p}</p>`)
        .join('\n');

    return `<!DOCTYPE html>
<html lang="${language.code}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${fileName} - ${language.name} Translation</title>
  <style>
    :root {
      --primary: #6366f1;
      --bg: #ffffff;
      --text: #1e293b;
      --text-light: #64748b;
      --border: #e2e8f0;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #0f172a;
        --text: #f1f5f9;
        --text-light: #94a3b8;
        --border: #334155;
      }
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.8;
      min-height: 100vh;
      padding: 2rem;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: var(--bg);
    }
    header {
      text-align: center;
      margin-bottom: 4rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid var(--border);
    }
    h1 {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 1rem;
      letter-spacing: -0.02em;
    }
    .meta {
      color: var(--text-light);
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .content {
      font-size: 1.1rem;
    }
    p {
      margin-bottom: 1.5rem;
      text-align: justify;
    }
    footer {
      margin-top: 5rem;
      padding-top: 2rem;
      border-top: 1px solid var(--border);
      text-align: center;
      color: var(--text-light);
      font-size: 0.85rem;
    }
    @media print {
      body { background: white; color: black; }
      header, footer { border-color: #ddd; }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>${language.flag} ${language.name} Translation</h1>
      <p class="meta">Original: ${fileName} • ${new Date().toLocaleDateString()}</p>
    </header>
    <main class="content">
      ${paragraphs}
    </main>
    <footer>
      <p>Translated with DocTranslator • Confidence: ${(result.metrics?.averageConfidence * 100).toFixed(1)}%</p>
    </footer>
  </div>
</body>
</html>`;
}