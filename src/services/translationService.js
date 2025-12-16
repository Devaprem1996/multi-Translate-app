// services/translationService.js

import { api, ApiError } from './api';

const TRANSLATION_STAGES = {
    UPLOADING: { min: 0, max: 30, label: 'Uploading document' },
    EXTRACTING: { min: 30, max: 50, label: 'Extracting text' },
    TRANSLATING: { min: 50, max: 85, label: 'Translating content' },
    BUILDING: { min: 85, max: 95, label: 'Building document' },
    FINALIZING: { min: 95, max: 100, label: 'Finalizing' }
};

export class TranslationService {
    constructor() {
        this.abortController = null;
        this.progressCallback = null;
    }

    setProgressCallback(callback) {
        this.progressCallback = callback;
    }

    updateProgress(percent, stage) {
        if (this.progressCallback) {
            this.progressCallback(percent, stage);
        }
    }

    async translate(file, targetLanguage) {
        this.abortController = new AbortController();

        try {
            // Validate inputs
            this.validateFile(file);
            this.validateLanguage(targetLanguage);

            // Start translation
            this.updateProgress(0, TRANSLATION_STAGES.UPLOADING.label);

            const result = await api.translateDocument(
                file,
                targetLanguage,
                (percent, stage) => {
                    const stageConfig = TRANSLATION_STAGES[stage.toUpperCase()] || TRANSLATION_STAGES.UPLOADING;
                    const adjustedPercent = stageConfig.min + (percent / 100) * (stageConfig.max - stageConfig.min);
                    this.updateProgress(Math.round(adjustedPercent), stageConfig.label);
                }
            );

            this.updateProgress(100, TRANSLATION_STAGES.FINALIZING.label);

            return {
                success: true,
                ...result
            };

        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                error.message || 'Translation failed',
                'UNKNOWN_ERROR'
            );
        }
    }

    validateFile(file) {
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain',
            'application/rtf'
        ];

        const maxSize = 10 * 1024 * 1024; // 10MB

        if (!file) {
            throw new ApiError('No file provided', 'FILE_MISSING');
        }

        if (file.size === 0) {
            throw new ApiError('File is empty', 'FILE_EMPTY');
        }

        if (file.size > maxSize) {
            throw new ApiError(
                `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds limit of 10MB`,
                'FILE_TOO_LARGE'
            );
        }

        // Check by extension if MIME type detection fails
        const ext = file.name.split('.').pop().toLowerCase();
        const allowedExts = ['pdf', 'doc', 'docx', 'txt', 'rtf'];

        if (!allowedTypes.includes(file.type) && !allowedExts.includes(ext)) {
            throw new ApiError(
                `File type not supported. Allowed: ${allowedExts.join(', ')}`,
                'INVALID_FILE_TYPE'
            );
        }
    }

    validateLanguage(langCode) {
        const supportedLanguages = ['ta', 'hi', 'ru', 'ja', 'es'];

        if (!langCode) {
            throw new ApiError('Target language not specified', 'LANGUAGE_MISSING');
        }

        if (!supportedLanguages.includes(langCode)) {
            throw new ApiError(
                `Language '${langCode}' not supported. Available: ${supportedLanguages.join(', ')}`,
                'LANGUAGE_UNSUPPORTED'
            );
        }
    }

    abort() {
        if (this.abortController) {
            this.abortController.abort();
        }
    }
}

export const translationService = new TranslationService();