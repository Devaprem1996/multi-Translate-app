// App.jsx - Main Application Component
import React, { useState, useCallback } from 'react';
import { Header } from './components/Layout/Header';
import { DropZone } from './components/Upload/DropZone';
import { LanguageSelector } from './components/Translation/LanguageSelector';
import { TranslationProgress } from './components/Translation/TranslationProgress';
import { ResultViewer } from './components/Translation/ResultViewer';
import { DownloadPanel } from './components/Download/DownloadPanel';
import { Toast } from './components/Common/Toast';
import { useTranslation } from './hooks/useTranslation';
import { useErrorHandler } from './hooks/useErrorHandler';
import './styles/globals.css';

const LANGUAGES = [
    { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳', region: 'South Asia' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳', region: 'South Asia' },
    { code: 'ru', name: 'Russian', native: 'Русский', flag: '🇷🇺', region: 'Europe' },
    { code: 'ja', name: 'Japanese', native: '日本語', flag: '🇯🇵', region: 'East Asia' },
    { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸', region: 'Europe' }
];

function App() {
    const [file, setFile] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const [currentStep, setCurrentStep] = useState('upload'); // upload, language, translating, result

    const {
        translate,
        translationResult,
        progress,
        isTranslating,
        reset: resetTranslation
    } = useTranslation();

    const {
        error,
        showError,
        clearError,
        toasts
    } = useErrorHandler();

    const handleFileSelect = useCallback((selectedFile) => {
        setFile(selectedFile);
        setCurrentStep('language');
    }, []);

    const handleLanguageSelect = useCallback((language) => {
        setSelectedLanguage(language);
    }, []);

    const handleTranslate = useCallback(async () => {
        if (!file || !selectedLanguage) {
            showError('Please select a file and target language');
            return;
        }

        setCurrentStep('translating');

        try {
            await translate(file, selectedLanguage.code);
            setCurrentStep('result');
        } catch (err) {
            showError(err.message || 'Translation failed');
            setCurrentStep('language');
        }
    }, [file, selectedLanguage, translate, showError]);

    const handleReset = useCallback(() => {
        setFile(null);
        setSelectedLanguage(null);
        setCurrentStep('upload');
        resetTranslation();
        clearError();
    }, [resetTranslation, clearError]);

    return (
        <div className="app-container">
            {/* Background Effects */}
            <div className="bg-effects">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
                <div className="gradient-orb orb-3"></div>
                <div className="grid-pattern"></div>
            </div>

            {/* Header */}
            <Header onReset={handleReset} />

            {/* Main Content */}
            <main className="main-content">
                {/* Progress Steps */}
                <StepsIndicator
                    currentStep={currentStep}
                    steps={['upload', 'language', 'translating', 'result']}
                />

                {/* Step Content */}
                <div className="content-area">
                    {currentStep === 'upload' && (
                        <section className="step-section fade-in">
                            <div className="section-header">
                                <h2 className="section-title">
                                    <span className="title-icon">📄</span>
                                    Upload Your Document
                                </h2>
                                <p className="section-subtitle">
                                    Drag & drop or click to upload your English document
                                </p>
                            </div>
                            <DropZone
                                onFileSelect={handleFileSelect}
                                onError={showError}
                            />
                        </section>
                    )}

                    {currentStep === 'language' && (
                        <section className="step-section fade-in">
                            <div className="section-header">
                                <h2 className="section-title">
                                    <span className="title-icon">🌍</span>
                                    Select Target Language
                                </h2>
                                <p className="section-subtitle">
                                    Choose the language you want to translate to
                                </p>
                            </div>

                            {/* File Preview */}
                            <FilePreviewCard file={file} onRemove={handleReset} />

                            {/* Language Grid */}
                            <LanguageSelector
                                languages={LANGUAGES}
                                selected={selectedLanguage}
                                onSelect={handleLanguageSelect}
                            />

                            {/* Translate Button */}
                            <div className="action-buttons">
                                <button
                                    className="btn btn-secondary"
                                    onClick={handleReset}
                                >
                                    ← Back
                                </button>
                                <button
                                    className="btn btn-primary btn-glow"
                                    onClick={handleTranslate}
                                    disabled={!selectedLanguage}
                                >
                                    <span className="btn-icon">🚀</span>
                                    Start Translation
                                </button>
                            </div>
                        </section>
                    )}

                    {currentStep === 'translating' && (
                        <section className="step-section fade-in">
                            <TranslationProgress
                                progress={progress}
                                file={file}
                                language={selectedLanguage}
                            />
                        </section>
                    )}

                    {currentStep === 'result' && (
                        <section className="step-section fade-in">
                            <div className="section-header">
                                <h2 className="section-title">
                                    <span className="title-icon">✨</span>
                                    Translation Complete
                                </h2>
                                <p className="section-subtitle">
                                    Your document has been successfully translated
                                </p>
                            </div>

                            <ResultViewer
                                result={translationResult}
                                originalFile={file}
                                targetLanguage={selectedLanguage}
                            />

                            <DownloadPanel
                                result={translationResult}
                                fileName={file?.name}
                                language={selectedLanguage}
                            />

                            <div className="action-buttons">
                                <button
                                    className="btn btn-secondary"
                                    onClick={handleReset}
                                >
                                    <span className="btn-icon">➕</span>
                                    Translate Another
                                </button>
                            </div>
                        </section>
                    )}
                </div>
            </main>

            {/* Toast Notifications */}
            <div className="toast-container">
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        type={toast.type}
                        message={toast.message}
                        onClose={() => clearError(toast.id)}
                    />
                ))}
            </div>
        </div>
    );
}

// Steps Indicator Component
function StepsIndicator({ currentStep, steps }) {
    const stepLabels = {
        upload: 'Upload',
        language: 'Language',
        translating: 'Translating',
        result: 'Complete'
    };

    const stepIcons = {
        upload: '📤',
        language: '🌐',
        translating: '⚙️',
        result: '✅'
    };

    const currentIndex = steps.indexOf(currentStep);

    return (
        <div className="steps-indicator">
            {steps.map((step, index) => (
                <div
                    key={step}
                    className={`step ${index === currentIndex ? 'active' : ''} ${index < currentIndex ? 'completed' : ''}`}
                >
                    <div className="step-icon">
                        {index < currentIndex ? '✓' : stepIcons[step]}
                    </div>
                    <span className="step-label">{stepLabels[step]}</span>
                    {index < steps.length - 1 && <div className="step-connector" />}
                </div>
            ))}
        </div>
    );
}

// File Preview Card Component
function FilePreviewCard({ file, onRemove }) {
    const formatSize = (bytes) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    const getFileIcon = (fileName) => {
        const ext = fileName.split('.').pop().toLowerCase();
        const icons = {
            pdf: '📕',
            doc: '📘',
            docx: '📘',
            txt: '📄',
            rtf: '📝'
        };
        return icons[ext] || '📄';
    };

    return (
        <div className="file-preview-card">
            <div className="file-icon">{getFileIcon(file.name)}</div>
            <div className="file-info">
                <span className="file-name">{file.name}</span>
                <span className="file-size">{formatSize(file.size)}</span>
            </div>
            <button className="remove-btn" onClick={onRemove}>
                ✕
            </button>
        </div>
    );
}

export default App;