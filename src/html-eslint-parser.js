/**
 * Minimal ESLint parser for full HTML email documents.
 */

/** @type {Record<string, string[]>} */
export const visitorKeys = {
    Program: ['body'],
};

/**
 * Parses HTML into a single Program node for text-scanning rules.
 *
 * @param {string} code - Full HTML source text.
 * @returns {object} ESLint-compatible Program AST.
 */
export function parse(code) {
    const lines = code.split('\n');
    const lastLine = lines.at(-1) ?? '';

    return {
        type: 'Program',
        body: [],
        tokens: [],
        comments: [],
        range: [0, code.length],
        loc: {
            start: { line: 1, column: 0 },
            end: { line: lines.length, column: lastLine.length },
        },
        visitorKeys,
    };
}

export default { parse, visitorKeys };
