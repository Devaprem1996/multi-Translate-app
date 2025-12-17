import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { jsPDF } from 'jspdf';

/**
 * Service to handle client-side document generation
 */
export const documentGenerator = {
    /**
     * Generate a file blob for the specified format
     */
    async generate(format, result, fileName, language) {
        switch (format) {
            case 'docx':
                return await this.generateDOCX(result, fileName, language);
            case 'pdf':
                return await this.generatePDF(result, fileName, language);
            case 'txt':
                return this.generateTXT(result);
            case 'html':
                return this.generateHTML(result, fileName, language);
            case 'json':
                return this.generateJSON(result, fileName, language);
            default:
                throw new Error(`Unsupported format: ${format}`);
        }
    },

    /**
     * Helper to format text with new lines after periods
     */
    formatText(text) {
        if (!text) return [];
        // Split by period followed by space or newline, but keep the period
        return text.replace(/([.!?])\s+/g, '$1|').split('|').map(line => line.trim()).filter(line => line);
    },

    /**
     * Generate DOCX file
     */
    async generateDOCX(result, fileName, language) {
        // Use formatted text split by sentences
        const lines = this.formatText(result.translatedText);

        const paragraphs = lines.map(text =>
            new Paragraph({
                children: [new TextRun({ text: text, size: 24 })], // 12pt
                spacing: { after: 200 }, // Add spacing between sentences
                alignment: AlignmentType.BOTH
            })
        );

        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    new Paragraph({
                        text: `${language.name} Translation`,
                        heading: HeadingLevel.HEADING_1,
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 400 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `Original File: ${fileName}`,
                                italics: true,
                                color: "666666"
                            }),
                            new TextRun({
                                text: ` • Generated: ${new Date().toLocaleDateString()}`,
                                italics: true,
                                color: "666666"
                            })
                        ],
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 600 }
                    }),
                    ...paragraphs,
                    new Paragraph({
                        text: `Translated with DocTranslator • Confidence: ${(result.metrics?.averageConfidence * 100).toFixed(1)}%`,
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 800 },
                        children: [new TextRun({ size: 16, color: "888888" })] // 8pt
                    })
                ]
            }]
        });

        const blob = await Packer.toBlob(doc);
        return { blob, mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', ext: '.docx' };
    },

    /**
     * Generate PDF file using HTML2Canvas for full font support
     */
    async generatePDF(result, fileName, language) {
        // Create a temporary container for rendering
        const container = document.createElement('div');
        // Fixed positioning to ensure it's rendered by the browser but hidden
        container.style.position = 'fixed';
        container.style.left = '0';
        container.style.top = '0';
        container.style.zIndex = '-9999';

        // Use standard A4 width approx in pixels (794px at 96dpi)
        // We set a slightly smaller width to ensure safe margins
        const a4WidthPx = 750;
        container.style.width = `${a4WidthPx}px`;
        container.style.padding = '40px';
        container.style.backgroundColor = 'white';
        container.style.color = '#000';
        // Enforce font stack that supports the target language
        container.style.fontFamily = '"Noto Sans Tamil", "Noto Sans Devanagari", "Noto Sans JP", sans-serif';

        // Format text: New line after every period
        const formattedLines = this.formatText(result.translatedText);

        const contentHtml = formattedLines
            .map(line => `<p style="margin-bottom: 1em; text-align: justify; line-height: 1.6; font-size: 14px;">${line}</p>`)
            .join('');

        container.innerHTML = `
            <div style="text-align: center; margin-bottom: 40px;">
                <h1 style="font-size: 24px; margin-bottom: 10px;">${language.name} Translation</h1>
                <div style="font-size: 12px; color: #666; border-bottom: 1px solid #ddd; padding-bottom: 20px; margin-bottom: 30px;">
                    <p style="margin: 5px 0;"><strong>Original File:</strong> ${fileName}</p>
                    <p style="margin: 5px 0;"><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
                </div>
            </div>
            <div style="font-size: 14px;">
                ${contentHtml}
            </div>
            <div style="text-align: center; margin-top: 50px; padding-top: 15px; border-top: 1px solid #eee; color: #888; font-size: 10px;">
                Translated with DocTranslator • Confidence: ${(result.metrics?.averageConfidence * 100).toFixed(1)}%
            </div>
        `;

        document.body.appendChild(container);

        try {
            // Import html2canvas dynamically
            const html2canvas = (await import('html2canvas')).default;

            // Capture the entire content as one canvas
            // Scale 1.5 offers good balance of speed vs clarity (standard is 1, high res is 2)
            const canvas = await html2canvas(container, {
                scale: 1.5,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            const pdf = new jsPDF('p', 'mm', 'a4');

            const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
            const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm

            const imgProps = pdf.getImageProperties(imgData);
            const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

            let heightLeft = imgHeight;
            let position = 0;

            // First page
            pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;

            // Subsequent pages
            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
                heightLeft -= pdfHeight;
            }

            return { blob: pdf.output('blob'), mimeType: 'application/pdf', ext: '.pdf' };

        } finally {
            document.body.removeChild(container);
        }
    },

    generateTXT(result) {
        return {
            blob: new Blob([result.translatedText], { type: 'text/plain' }),
            mimeType: 'text/plain',
            ext: '.txt'
        };
    },

    generateHTML(result, fileName, language) {
        const paragraphs = result.translatedText
            .split(/\n\s*\n/)
            .map(p => p.trim())
            .filter(p => p)
            .map(p => `<p>${p}</p>`)
            .join('\n');

        const html = `<!DOCTYPE html>
<html lang="${language.code}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${fileName} - ${language.name} Translation</title>
  <style>
    body { font-family: system-ui, sans-serif; padding: 2rem; max-width: 800px; margin: 0 auto; line-height: 1.6; }
    h1 { text-align: center; }
    .meta { text-align: center; color: #666; font-size: 0.9em; margin-bottom: 2rem; }
    p { margin-bottom: 1em; text-align: justify; }
    footer { text-align: center; margin-top: 3rem; font-size: 0.8em; color: #888; }
  </style>
</head>
<body>
  <h1>${language.flag} ${language.name} Translation</h1>
  <p class="meta">Original: ${fileName}</p>
  ${paragraphs}
  <footer>Translated with DocTranslator</footer>
</body>
</html>`;

        return {
            blob: new Blob([html], { type: 'text/html' }),
            mimeType: 'text/html',
            ext: '.html'
        };
    },

    generateJSON(result, fileName, language) {
        const json = JSON.stringify({
            metadata: {
                originalFile: fileName,
                targetLanguage: language.code,
                generatedAt: new Date().toISOString(),
                metrics: result.metrics
            },
            translation: result.translatedText
        }, null, 2);

        return {
            blob: new Blob([json], { type: 'application/json' }),
            mimeType: 'application/json',
            ext: '.json'
        };
    }
};
