/**
 * ESLint processor that extracts MSO conditional comments from HTML files.
 *
 * Scans HTML for all MSO comment patterns (openers and closers) and
 * extracts them into a single virtual `.mso` file. Padding newlines
 * preserve original line numbers so ESLint reports errors at the correct
 * positions in the source file.
 *
 * Pattern overview:
 *   Openers: <!--[if …]>  <!--[if …]><!--  <![if …]>
 *   Closers: <![endif]-->  <!--<![endif]-->  <![endif]>
 */

import {
    MSO_COMMENT_PATTERN,
    DOCUMENT_VIRTUAL_BASENAME,
    MSO_VIRTUAL_BASENAME,
} from './lib/mso-comment-pattern.js';

/**
 * Regex that matches any MSO comment (opener or closer) on a single line.
 * Named capture groups:
 *   comment — the full raw comment string
 */
const MSO_COMMENT_RE = MSO_COMMENT_PATTERN;

/**
 * Counts newline characters before a given position in text.
 *
 * @param {string} text - The source text.
 * @param {number} pos - The character offset.
 * @returns {number} Number of newlines before pos.
 */
function countNewlinesBefore(text, pos) {
    let count = 0;
    for (let index = 0; index < pos; index++) {
        if (text[index] === '\n') {
            count++;
        }
    }

    return count;
}

/**
 * Preprocesses an HTML file by extracting all MSO comments into a single
 * virtual `.mso` file, preserving line offsets.
 *
 * @param {string} text - Full source text of the HTML file.
 * @param {string} _filename - Original filename (reserved for future path-aware virtual names).
 * @returns {{text: string, filename: string}[]} Array of virtual file objects.
 */
export function preprocess(text, _filename) {
    const lines = [];
    let maxLine = 0;

    MSO_COMMENT_RE.lastIndex = 0;
    let match;
    while ((match = MSO_COMMENT_RE.exec(text)) !== null) {
        const line = countNewlinesBefore(text, match.index);
        lines.push({ line, text: match[0] });
        if (line > maxLine) {
            maxLine = line;
        }
    }

    if (lines.length === 0) {
        return [{ text, filename: DOCUMENT_VIRTUAL_BASENAME }];
    }

    // Build a single virtual file: place each comment at its original line number
    // using padding newlines so that column/line errors map back correctly.
    const rows = Array.from({ length: maxLine + 1 }, () => '');
    for (const entry of lines) {
        rows[entry.line] = rows[entry.line] ? `${rows[entry.line]}${entry.text}` : entry.text;
    }

    return [
        { text: rows.join('\n'), filename: MSO_VIRTUAL_BASENAME },
        { text, filename: DOCUMENT_VIRTUAL_BASENAME },
    ];
}

/**
 * Postprocesses messages from linting the virtual `.mso` file.
 *
 * @param {import('eslint').Linter.LintMessage[][]} messages - Nested message arrays.
 * @returns {import('eslint').Linter.LintMessage[]} Flat array of lint messages.
 */
export function postprocess(messages) {
    return messages.flat();
}

export default { preprocess, postprocess, supportsAutofix: true };
