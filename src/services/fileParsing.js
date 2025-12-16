// services/fileParsing.js
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * Extracts text from various file formats
 * @param {File} file - The file to parse
 * @returns {Promise<{text: string, type: string}>}
 */
export async function parseFile(file) {
    const fileType = file.name.split('.').pop().toLowerCase();

    try {
        switch (fileType) {
            case 'txt':
                return await parseTxt(file);
            case 'pdf':
                return await parsePdf(file);
            case 'docx':
            case 'doc':
                return await parseDocx(file);
            default:
                throw new Error(`Unsupported file type: .${fileType}`);
        }
    } catch (error) {
        console.error('File parsing error:', error);
        throw new Error(`Failed to read file: ${error.message}`);
    }
}

async function parseTxt(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve({ text: e.target.result, type: 'txt' });
        reader.onerror = (e) => reject(new Error('Failed to read text file'));
        reader.readAsText(file);
    });
}

async function parsePdf(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n\n';
    }

    return { text: fullText.trim(), type: 'pdf' };
}

async function parseDocx(file) {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return { text: result.value.trim(), type: 'docx' };
}
