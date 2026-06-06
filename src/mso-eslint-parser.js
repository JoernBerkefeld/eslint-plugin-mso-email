/**
 * ESLint-compatible parser for virtual `.mso` files produced by the processor.
 *
 * Receives a text where each non-empty line contains one raw MSO comment
 * string (opener or closer). Produces a minimal ESLint `Program` AST with
 * one `MsoComment` node per line, carrying both the raw text and the parsed
 * result from `mso-conditional-parser`.
 *
 * Exports `visitorKeys` so ESLint's traversal engine knows the tree shape.
 */

import { parseMsoComment, parseMsoEndComment } from 'mso-conditional-parser';

/**
 * Visitor keys for all node types in the MSO AST.
 * MsoComment has no child nodes — it is a leaf.
 *
 * @type {Record<string, string[]>}
 */
export const visitorKeys = {
    Program: ['body'],
    MsoComment: [],
};

/**
 * Builds a line/column offset table for the given text.
 *
 * @param {string} text - Source text.
 * @returns {number[]} Array where index i holds the character offset of line i.
 */
function buildLineStarts(text) {
    const starts = [0];
    for (const match of text.matchAll(/\n/g)) {
        starts.push(match.index + 1);
    }

    return starts;
}

/**
 * Parses a virtual `.mso` file into an ESLint-compatible Program AST.
 *
 * @param {string} text - Text of the virtual `.mso` file.
 * @param {{ loc?: boolean, range?: boolean, tokens?: boolean, comment?: boolean }} _options - ESLint parse options (unused but required by interface).
 * @returns {{ type: 'Program', body: object[], tokens: [], comments: [], range: number[], loc: object, visitorKeys: Record<string, string[]> }} ESLint-compatible Program AST.
 */
export function parse(text, _options) {
    const lineStarts = buildLineStarts(text);
    const lines = text.split('\n');
    const body = [];

    for (const [lineIndex, line] of lines.entries()) {
        const raw = line.trim();
        if (!raw) {
            continue;
        }

        const lineStart = lineStarts[lineIndex] ?? text.length;
        const start = lineStart;
        const end = lineStart + line.length;

        const parsed = parseMsoComment(raw) ?? parseMsoEndComment(raw);

        body.push({
            type: 'MsoComment',
            raw,
            parsed,
            range: [start, end],
            loc: {
                start: { line: lineIndex + 1, column: 0 },
                end: { line: lineIndex + 1, column: line.length },
            },
        });
    }

    const programEnd = text.length;

    return {
        type: 'Program',
        body,
        tokens: [],
        comments: [],
        range: [0, programEnd],
        loc: {
            start: { line: 1, column: 0 },
            end: { line: lines.length, column: 0 },
        },
        visitorKeys,
    };
}

export default { parse, visitorKeys };
