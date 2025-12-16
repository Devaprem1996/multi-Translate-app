// utils/errorCodes.js

export const ERROR_CODES = {
    // File Errors
    FILE_MISSING: {
        title: 'No File Selected',
        message: 'Please select a document to translate.',
        action: 'Select a file'
    },
    FILE_EMPTY: {
        title: 'Empty File',
        message: 'The selected file appears to be empty.',
        action: 'Choose a different file'
    },
    FILE_TOO_LARGE: {
        title: 'File Too Large',
        message: 'The file exceeds the maximum size limit of 10MB.',
        action: 'Choose a smaller file'
    },
    INVALID_FILE_TYPE: {
        title: 'Unsupported Format',
        message: 'This file format is not supported.',
        action: 'Use PDF, DOCX, DOC, TXT, or RTF'
    },

    // Language Errors
    LANGUAGE_MISSING: {
        title: 'Language Not Selected',
        message: 'Please select a target language for translation.',
        action: 'Select a language'
    },
    LANGUAGE_UNSUPPORTED: {
        title: 'Unsupported Language',
        message: 'The selected language is not currently supported.',
        action: 'Choose a different language'
    },

    // Translation Errors
    EXTRACTION_ERROR: {
        title: 'Text Extraction Failed',
        message: 'Could not extract text from the document.',
        action: 'Try a different file format'
    },
    TRANSLATION_ERROR: {
        title: 'Translation Failed',
        message: 'An error occurred during translation.',
        action: 'Please try again'
    },
    PARTIAL_TRANSLATION: {
        title: 'Partial Translation',
        message: 'Some sections could not be translated.',
        action: 'Review the translated document'
    },

    // Network Errors
    NETWORK_ERROR: {
        title: 'Network Error',
        message: 'Could not connect to the translation service.',
        action: 'Check your internet connection'
    },
    TIMEOUT: {
        title: 'Request Timeout',
        message: 'The translation is taking too long.',
        action: 'Try a smaller document'
    },

    // Server Errors
    SERVER_ERROR: {
        title: 'Server Error',
        message: 'The translation service encountered an error.',
        action: 'Please try again later'
    },
    SERVICE_UNAVAILABLE: {
        title: 'Service Unavailable',
        message: 'The translation service is temporarily unavailable.',
        action: 'Please try again later'
    },

    // Default
    UNKNOWN_ERROR: {
        title: 'Unexpected Error',
        message: 'Something went wrong.',
        action: 'Please try again'
    }
};

export function getErrorInfo(code) {
    return ERROR_CODES[code] || ERROR_CODES.UNKNOWN_ERROR;
}

export function formatErrorMessage(error) {
    if (typeof error === 'string') {
        return error;
    }

    const errorInfo = getErrorInfo(error.code);
    return `${errorInfo.title}: ${error.message || errorInfo.message}`;
}