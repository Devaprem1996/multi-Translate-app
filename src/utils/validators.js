// utils/validators.js

export const validators = {
    file: {
        isValidType(file) {
            const allowedMimes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'text/plain',
                'application/rtf'
            ];

            const allowedExts = ['pdf', 'doc', 'docx', 'txt', 'rtf'];
            const ext = file.name.split('.').pop().toLowerCase();

            return allowedMimes.includes(file.type) || allowedExts.includes(ext);
        },

        isValidSize(file, maxSizeMB = 10) {
            return file.size <= maxSizeMB * 1024 * 1024;
        },

        isNotEmpty(file) {
            return file.size > 0;
        },

        validate(file) {
            const errors = [];

            if (!file) {
                errors.push({ code: 'FILE_MISSING', message: 'No file provided' });
                return errors;
            }

            if (!this.isNotEmpty(file)) {
                errors.push({ code: 'FILE_EMPTY', message: 'File is empty' });
            }

            if (!this.isValidSize(file)) {
                errors.push({
                    code: 'FILE_TOO_LARGE',
                    message: `File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds limit`
                });
            }

            if (!this.isValidType(file)) {
                errors.push({
                    code: 'INVALID_FILE_TYPE',
                    message: `File type not supported`
                });
            }

            return errors;
        }
    },

    language: {
        supportedCodes: ['ta', 'hi', 'ru', 'ja', 'es'],

        isSupported(code) {
            return this.supportedCodes.includes(code);
        },

        validate(code) {
            const errors = [];

            if (!code) {
                errors.push({ code: 'LANGUAGE_MISSING', message: 'No language selected' });
                return errors;
            }

            if (!this.isSupported(code)) {
                errors.push({
                    code: 'LANGUAGE_UNSUPPORTED',
                    message: `Language '${code}' not supported`
                });
            }

            return errors;
        }
    }
};