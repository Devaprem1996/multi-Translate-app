// src/utils/constants.js

export const APP_CONFIG = {
    name: 'DocTranslate',
    version: '1.0.0',
    description: 'AI-Powered Document Translation'
};

export const API_CONFIG = {
    baseUrl: import.meta.env.VITE_API_URL,
    timeout: 120000, // 2 minutes
    retryAttempts: 3,
    retryDelay: 1000
};

export const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

export const FILE_CONFIG = {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['pdf', 'doc', 'docx', 'txt', 'rtf'],
    allowedMimeTypes: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'application/rtf'
    ]
};

export const LANGUAGES = [
    {
        code: 'ta',
        name: 'Tamil',
        native: 'தமிழ்',
        flag: '🇮🇳',
        region: 'South Asia',
        script: 'Tamil',
        rtl: false
    },
    {
        code: 'hi',
        name: 'Hindi',
        native: 'हिन्दी',
        flag: '🇮🇳',
        region: 'South Asia',
        script: 'Devanagari',
        rtl: false
    },
    {
        code: 'ru',
        name: 'Russian',
        native: 'Русский',
        flag: '🇷🇺',
        region: 'Europe',
        script: 'Cyrillic',
        rtl: false
    },
    {
        code: 'ja',
        name: 'Japanese',
        native: '日本語',
        flag: '🇯🇵',
        region: 'East Asia',
        script: 'Kanji/Hiragana',
        rtl: false
    },
    {
        code: 'es',
        name: 'Spanish',
        native: 'Español',
        flag: '🇪🇸',
        region: 'Europe/Americas',
        script: 'Latin',
        rtl: false
    }
];

export const OUTPUT_FORMATS = [
    { id: 'txt', name: 'Plain Text', ext: '.txt', mime: 'text/plain' },
    { id: 'html', name: 'HTML', ext: '.html', mime: 'text/html' },
    { id: 'json', name: 'JSON', ext: '.json', mime: 'application/json' },
    { id: 'md', name: 'Markdown', ext: '.md', mime: 'text/markdown' }
];

export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection.',
    TIMEOUT: 'The request took too long. Please try again.',
    FILE_TOO_LARGE: 'The file is too large. Maximum size is 10MB.',
    INVALID_FILE_TYPE: 'This file type is not supported.',
    TRANSLATION_FAILED: 'Translation failed. Please try again.',
    UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.'
};

export const TRANSLATION_STAGES = {
    IDLE: 'idle',
    UPLOADING: 'uploading',
    EXTRACTING: 'extracting',
    TRANSLATING: 'translating',
    BUILDING: 'building',
    COMPLETE: 'complete',
    ERROR: 'error'
};

export const STORAGE_KEYS = {
    THEME: 'docTranslate_theme',
    LANGUAGE: 'docTranslate_lastLanguage',
    FORMAT: 'docTranslate_lastFormat',
    HISTORY: 'docTranslate_history'
};