import { preprocess } from '../../src/processor.js';

/**
 * @param {string} html - Raw HTML source.
 * @returns {string} Virtual MSO comment file content.
 */
export function extractMsoVirtualFile(html) {
    const result = preprocess(html, 'test.html');
    const msoFile = result.find(
        (entry) => typeof entry !== 'string' && entry.filename.endsWith('.mso'),
    );
    if (msoFile) {
        return msoFile.text;
    }

    if (typeof result[0] === 'string') {
        return result[0];
    }

    return result[0].text;
}

/**
 * @param {string} html - Raw HTML source.
 * @returns {string} Full HTML document text returned by the processor.
 */
export function extractProcessedHtml(html) {
    const result = preprocess(html, 'test.html');
    if (result.length === 1 && typeof result[0] === 'string') {
        return result[0];
    }

    const htmlFile = result.find((entry) => entry.filename === 'document.msohtml');
    return htmlFile?.text ?? html;
}
