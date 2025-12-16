// services/api.js
import { API_CONFIG } from '../utils/constants';



class ApiError extends Error {
    constructor(message, code, details = {}) {
        super(message);
        this.name = 'ApiError';
        this.code = code;
        this.details = details;
    }
}

async function fetchWithRetry(url, options, attempts = API_CONFIG.retryAttempts) {
    for (let i = 0; i < attempts; i++) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new ApiError(
                    errorData.message || `HTTP ${response.status}`,
                    errorData.code || 'HTTP_ERROR',
                    errorData
                );
            }

            return response;
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new ApiError('Request timeout', 'TIMEOUT');
            }

            if (i === attempts - 1) throw error;

            // Exponential backoff
            await new Promise(resolve =>
                setTimeout(resolve, API_CONFIG.retryDelay * Math.pow(2, i))
            );
        }
    }
}

export const api = {
    async translateDocument(file, targetLanguage, onProgress) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('targetLanguage', targetLanguage);

        // Use XMLHttpRequest for progress tracking
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable && onProgress) {
                    const percent = Math.round((event.loaded / event.total) * 30);
                    onProgress(percent, 'uploading');
                }
            });

            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        let response = JSON.parse(xhr.responseText);

                        // Handle array response
                        if (Array.isArray(response)) {
                            response = response[0];
                        }

                        if (response.success) {
                            resolve(response);
                        } else {
                            reject(new ApiError(
                                response.errors?.[0]?.message || 'Translation failed',
                                response.errors?.[0]?.code || 'TRANSLATION_ERROR',
                                response
                            ));
                        }
                    } catch (e) {
                        reject(new ApiError('Invalid response format', 'PARSE_ERROR'));
                    }
                } else {
                    try {
                        const errorData = JSON.parse(xhr.responseText);
                        reject(new ApiError(
                            errorData.errors?.[0]?.message || `HTTP ${xhr.status}`,
                            errorData.errors?.[0]?.code || 'HTTP_ERROR',
                            errorData
                        ));
                    } catch {
                        reject(new ApiError(`HTTP ${xhr.status}`, 'HTTP_ERROR'));
                    }
                }
            });

            xhr.addEventListener('error', () => {
                reject(new ApiError('Network error', 'NETWORK_ERROR'));
            });

            xhr.addEventListener('timeout', () => {
                reject(new ApiError('Request timeout', 'TIMEOUT'));
            });

            xhr.open('POST', `${API_CONFIG.baseUrl}/translate-document`);
            xhr.timeout = API_CONFIG.timeout;
            xhr.send(formData);
        });
    },

    async generateDocument(translatedText, targetLanguage, outputFormat, fileName) {
        const response = await fetchWithRetry(
            `${API_CONFIG.baseUrl}/generate-document`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    translatedText,
                    targetLanguage,
                    outputFormat,
                    fileName
                })
            }
        );

        return response.blob();
    },

    async getLanguages() {
        const response = await fetchWithRetry(
            `${API_CONFIG.baseUrl}/languages`,
            { method: 'GET' }
        );

        return response.json();
    },

    async healthCheck() {
        try {
            const response = await fetch(`${API_CONFIG.baseUrl}/health`, {
                method: 'GET',
                timeout: 5000
            });
            return response.ok;
        } catch {
            return false;
        }
    }
};

export { ApiError };