// src/utils/formatters.js

export const formatters = {
    /**
     * Format file size to human readable string
     */
    fileSize(bytes) {
        if (bytes === 0) return '0 B';

        const units = ['B', 'KB', 'MB', 'GB'];
        const k = 1024;
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${units[i]}`;
    },

    /**
     * Format date to locale string
     */
    date(date, options = {}) {
        const defaultOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        };

        return new Date(date).toLocaleDateString(
            undefined,
            { ...defaultOptions, ...options }
        );
    },

    /**
     * Format time duration
     */
    duration(seconds) {
        if (seconds < 60) return `${seconds}s`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    },

    /**
     * Format number with thousand separators
     */
    number(num) {
        return num.toLocaleString();
    },

    /**
     * Format percentage
     */
    percentage(value, decimals = 1) {
        return `${(value * 100).toFixed(decimals)}%`;
    },

    /**
     * Truncate text with ellipsis
     */
    truncate(text, maxLength = 50) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - 3) + '...';
    },

    /**
     * Format word count
     */
    wordCount(text) {
        const count = text.trim().split(/\s+/).filter(word => word.length > 0).length;
        return `${this.number(count)} word${count !== 1 ? 's' : ''}`;
    },

    /**
     * Format character count
     */
    charCount(text) {
        const count = text.length;
        return `${this.number(count)} character${count !== 1 ? 's' : ''}`;
    },

    /**
     * Get file extension
     */
    fileExtension(filename) {
        return filename.split('.').pop().toLowerCase();
    },

    /**
     * Get filename without extension
     */
    fileBasename(filename) {
        return filename.replace(/\.[^/.]+$/, '');
    },

    /**
     * Format language name with flag
     */
    languageWithFlag(code) {
        const languages = {
            ta: { name: 'Tamil', flag: '🇮🇳' },
            hi: { name: 'Hindi', flag: '🇮🇳' },
            ru: { name: 'Russian', flag: '🇷🇺' },
            ja: { name: 'Japanese', flag: '🇯🇵' },
            es: { name: 'Spanish', flag: '🇪🇸' },
            en: { name: 'English', flag: '🇬🇧' }
        };

        const lang = languages[code];
        return lang ? `${lang.flag} ${lang.name}` : code;
    }
};