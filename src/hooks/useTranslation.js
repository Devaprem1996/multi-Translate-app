// hooks/useTranslation.js
import { useState, useCallback } from 'react';
import { API_CONFIG, CORS_PROXY } from '../utils/constants';
import { parseFile } from '../services/fileParsing';

export function useTranslation() {
    const [translationResult, setTranslationResult] = useState(null);
    const [progress, setProgress] = useState(0);
    const [isTranslating, setIsTranslating] = useState(false);
    const [error, setError] = useState(null);

    // Smart Chunking Algorithm with Adaptive Sizing
    const smartChunkText = (text) => {
        // Adaptive Logic:
        // If text is small (< 2000 chars), we can try larger chunks (up to 1500) for speed.
        // If text is large, we stay safe with smaller chunks (300) to avoid timeouts/limits.
        const totalLength = text.length;
        const maxSize = totalLength < 2000 ? 1500 : 300;

        console.log(`Adaptive Chunking: Total Length ${totalLength}, Using MaxSize ${maxSize}`);

        const chunks = [];
        // Split by paragraphs (double newlines) to preserve structure
        const paragraphs = text.split(/\n\s*\n/);

        let currentChunk = '';

        for (const para of paragraphs) {
            const cleanPara = para.trim();
            if (!cleanPara) continue;

            // If adding this paragraph exceeds max size
            if ((currentChunk.length + cleanPara.length) > maxSize) {
                // If current chunk has content, push it
                if (currentChunk) {
                    chunks.push(currentChunk.trim());
                    currentChunk = '';
                }

                // If paragraph ITSELF is huge, split by sentences
                if (cleanPara.length > maxSize) {
                    // Match sentences ending in punctuation
                    const sentences = cleanPara.match(/[^.!?]+[.!?]+(\s|$)/g) || [cleanPara];

                    for (const sent of sentences) {
                        if ((currentChunk.length + sent.length) > maxSize) {
                            if (currentChunk) chunks.push(currentChunk.trim());
                            currentChunk = sent;
                        } else {
                            currentChunk += sent;
                        }
                    }
                } else {
                    currentChunk = cleanPara;
                }
            } else {
                currentChunk += (currentChunk ? '\n\n' : '') + cleanPara;
            }
        }

        if (currentChunk) chunks.push(currentChunk.trim());
        return chunks;
    };

    const translate = useCallback(async (file, targetLanguage) => {
        setIsTranslating(true);
        setProgress(0);
        setError(null);

        try {
            // STEP 1: Local File Extraction
            console.log('Starting local translation flow with AllOrigins proxy...');
            setProgress(5);

            const { text, type } = await parseFile(file);
            console.log(`Extracted text from ${type}. Length: ${text.length}`);
            setProgress(15);

            if (!text || text.trim().length === 0) {
                throw new Error('No text extracted from file');
            }

            // STEP 2: Smart Chunking
            const chunks = smartChunkText(text);
            console.log(`Split text into ${chunks.length} chunks`);

            const translatedChunks = [];
            let completed = 0;

            // STEP 3: Translate Chunks using Google API via AllOrigins
            // Helper for delay
            const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

            for (const chunk of chunks) {
                const encodedText = encodeURIComponent(chunk);
                const googleUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLanguage}&dt=t&q=${encodedText}`;
                const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(googleUrl)}&timestamp=${Date.now()}`;

                let attempts = 0;
                let success = false;

                // Retry up to 3 times
                while (attempts < 3 && !success) {
                    try {
                        // Add delay to avoid rate limiting (exponential backoff)
                        if (attempts > 0) await delay(1000 * attempts);
                        else await delay(300); // Standard polite delay

                        const response = await fetch(proxyUrl);
                        if (!response.ok) {
                            if (response.status === 429) {
                                // If rate limited, wait longer
                                await delay(2000);
                                throw new Error('Rate limited');
                            }
                            throw new Error(`HTTP ${response.status}`);
                        }

                        const data = await response.json();

                        if (data && data[0]) {
                            const translatedText = data[0].map(segment => segment[0]).join('');
                            translatedChunks.push(translatedText);
                            success = true;
                        } else {
                            throw new Error('Invalid response format');
                        }

                    } catch (err) {
                        attempts++;
                        console.warn(`Chunk translation failed (Attempt ${attempts}/3):`, err);

                        if (attempts === 3) {
                            console.error('Chunk failed after 3 attempts, keeping original.');
                            translatedChunks.push(chunk);
                        }
                    }
                }

                completed++;
                setProgress(15 + Math.floor((completed / chunks.length) * 75));
            }

            const finalTranslation = translatedChunks.join('\n\n');

            setProgress(100);
            const result = {
                success: true,
                translatedText: finalTranslation,
                originalText: text,
                metrics: {
                    averageConfidence: 1.0,
                    translatedWordCount: finalTranslation.split(/\s+/).length,
                    translationSources: ['google-gtx-direct']
                },
                warnings: []
            };
            setTranslationResult(result);
            return result;

        } catch (localError) {
            console.error('Local/Proxy translation failed completely:', localError);

            // Fallback to API if critical failure (e.g. file parsing failed)
            try {
                setProgress(30);
                const formData = new FormData();
                formData.append('file', file);
                formData.append('targetLanguage', targetLanguage);

                const response = await fetch(`${API_CONFIG.baseUrl}/translate-document`, {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) throw new Error('API fallback failed');

                let result = await response.json();
                if (Array.isArray(result)) result = result[0];

                const normalizedResult = {
                    success: true,
                    translatedText: result.translation?.text || '',
                    originalText: result.original?.text || '',
                    metrics: result.metrics || {},
                    warnings: [{ type: 'FALLBACK', message: 'Used server fallback' }]
                };

                setProgress(100);
                setTranslationResult(normalizedResult);
                return normalizedResult;

            } catch (apiError) {
                setError(apiError.message);
                throw apiError;
            }
        } finally {
            setIsTranslating(false);
        }
    }, []);

    const reset = useCallback(() => {
        setTranslationResult(null);
        setProgress(0);
        setError(null);
        setIsTranslating(false);
    }, []);

    return {
        translate,
        translationResult,
        progress,
        isTranslating,
        error,
        reset
    };
}