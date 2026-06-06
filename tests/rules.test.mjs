import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { RuleTester } from 'eslint';
import msoEslintParser, { visitorKeys } from '../src/mso-eslint-parser.js';
import { preprocess, postprocess } from '../src/processor.js';
import validMsoCondition from '../src/rules/valid-mso-condition.js';
import matchingMsoEndif from '../src/rules/matching-mso-endif.js';

// ── Helper ──────────────────────────────────────────────────────────────────

/**
 * Simulates running the processor on HTML text, returning the virtual .mso
 * file text (or the original text when no MSO comments are found).
 *
 * @param {string} html - Raw HTML source.
 * @returns {string} Virtual .mso file content.
 */
function extractMsoVirtualFile(html) {
    const result = preprocess(html, 'test.html');
    if (result.length === 1 && typeof result[0] === 'string') {
        return result[0];
    }

    return result[0].text;
}

const ruleTester = new RuleTester({
    languageOptions: { parser: msoEslintParser },
});

// ── processor ────────────────────────────────────────────────────────────────

describe('processor — preprocess', () => {
    it('returns original text when no MSO comments are present', () => {
        const result = preprocess('<div>Hello</div>', 'test.html');
        assert.equal(result.length, 1);
        assert.equal(typeof result[0], 'string');
    });

    it('extracts a downlevel-hidden opener', () => {
        const result = preprocess('<!--[if mso]>\n<p>test</p>\n<![endif]-->', 'test.html');
        assert.equal(result.length, 1);
        assert.ok(result[0].filename.endsWith('.mso'));
        assert.ok(result[0].text.includes('<!--[if mso]>'));
        assert.ok(result[0].text.includes('<![endif]-->'));
    });

    it('preserves line offsets via newline padding', () => {
        const html = 'line1\nline2\n<!--[if mso]>';
        const result = preprocess(html, 'test.html');
        // The MSO comment is on line 3 (index 2), so virtual file should have 2 newlines before it
        const text = result[0].text;
        const lines = text.split('\n');
        assert.equal(lines[2], '<!--[if mso]>');
    });

    it('extracts both opener and closer', () => {
        const html = '<!--[if mso]>\n<td></td>\n<![endif]-->';
        const result = preprocess(html, 'test.html');
        const text = result[0].text;
        assert.ok(text.includes('<!--[if mso]>'));
        assert.ok(text.includes('<![endif]-->'));
    });

    it('postprocess flattens message arrays', () => {
        const msgs = [[{ message: 'a' }], [{ message: 'b' }]];
        const result = postprocess(msgs);
        assert.equal(result.length, 2);
    });
});

// ── mso-eslint-parser ────────────────────────────────────────────────────────

describe('mso-eslint-parser', () => {
    it('produces a Program with MsoComment body nodes', () => {
        const text = extractMsoVirtualFile('<!--[if mso]>\n<p></p>\n<![endif]-->');
        const ast = msoEslintParser.parse(text, {});
        assert.equal(ast.type, 'Program');
        assert.ok(ast.body.length >= 1);
        assert.equal(ast.body[0].type, 'MsoComment');
    });

    it('attaches parsed result to opener nodes', () => {
        const text = extractMsoVirtualFile('<!--[if gte mso 16]>');
        const ast = msoEslintParser.parse(text, {});
        const node = ast.body[0];
        assert.equal(node.parsed.type, 'downlevel-hidden');
        assert.equal(node.parsed.condition, 'gte mso 16');
    });

    it('returns empty body for text with no comments', () => {
        const ast = msoEslintParser.parse('', {});
        assert.equal(ast.body.length, 0);
    });
});

// ── valid-mso-condition rule ─────────────────────────────────────────────────

describe('valid-mso-condition rule', () => {
    ruleTester.run('valid-mso-condition', validMsoCondition, {
        valid: [
            { code: extractMsoVirtualFile('<!--[if mso]>\n<td></td>\n<![endif]-->') },
            { code: extractMsoVirtualFile('<!--[if gte mso 16]>\n<td></td>\n<![endif]-->') },
            { code: extractMsoVirtualFile('<!--[if !mso]><!-->') },
            { code: extractMsoVirtualFile('<![if mso]>') },
            { code: extractMsoVirtualFile('<!--[if (gte mso 9)&(lte mso 15)]>') },
            // Closers should not be flagged
            { code: extractMsoVirtualFile('<![endif]-->') },
        ],
        invalid: [
            {
                code: extractMsoVirtualFile('<!--[if mos]>'),
                errors: [{ messageId: 'invalidCondition' }],
            },
            {
                code: extractMsoVirtualFile('<!--[if mso 13]>'),
                errors: [{ messageId: 'invalidCondition' }],
            },
            {
                code: extractMsoVirtualFile('<!--[if gte mso]>'),
                errors: [{ messageId: 'invalidCondition' }],
            },
        ],
    });

    it('ruleTester ran without throwing', () => {
        assert.ok(true);
    });
});

// ── matching-mso-endif rule ──────────────────────────────────────────────────

describe('matching-mso-endif rule', () => {
    ruleTester.run('matching-mso-endif', matchingMsoEndif, {
        valid: [
            // Matched pair
            { code: extractMsoVirtualFile('<!--[if mso]>\n<td></td>\n<![endif]-->') },
            // Nested (open open close close)
            {
                code: extractMsoVirtualFile(
                    '<!--[if mso]>\n<!--[if gte mso 16]>\n<td></td>\n<![endif]-->\n<![endif]-->',
                ),
            },
            // No MSO comments
            { code: '<div>Hello</div>' },
            // Non-standard pair: <![if …]> / <![endif]>
            {
                code: extractMsoVirtualFile('<![if mso]>\n<td></td>\n<![endif]>'),
            },
        ],
        invalid: [
            {
                // Opener without closer
                code: extractMsoVirtualFile('<!--[if mso]>'),
                errors: [{ messageId: 'unclosedConditional' }],
            },
            {
                // Closer without opener
                code: extractMsoVirtualFile('<![endif]-->'),
                errors: [{ messageId: 'unmatchedEndif' }],
            },
            {
                // Two openers, no closers — should produce two errors
                code: extractMsoVirtualFile('<!--[if mso]>\n<!--[if gte mso 16]>'),
                errors: [
                    { messageId: 'unclosedConditional' },
                    { messageId: 'unclosedConditional' },
                ],
            },
            {
                // Extra closer after a complete pair
                code: extractMsoVirtualFile('<!--[if mso]>\n<td></td>\n<![endif]-->\n<![endif]-->'),
                errors: [{ messageId: 'unmatchedEndif' }],
            },
        ],
    });

    it('ruleTester ran without throwing', () => {
        assert.ok(true);
    });
});

// ── processor — additional coverage ──────────────────────────────────────────

describe('processor — additional coverage', () => {
    it('extracts multiple MSO comments on different lines', () => {
        const html =
            '<!--[if mso]>\n<p>hello</p>\n<![endif]-->\n<p>other</p>\n<!--[if gte mso 16]>\n<p>x</p>\n<![endif]-->';
        const result = preprocess(html, 'test.html');
        assert.equal(result[0].filename.endsWith('.mso'), true);
        const text = result[0].text;
        assert.ok(text.includes('<!--[if mso]>'));
        assert.ok(text.includes('<!--[if gte mso 16]>'));
        // Both openers appear and the second is after the first
        assert.ok(text.indexOf('<!--[if gte mso 16]>') > text.indexOf('<!--[if mso]>'));
    });

    it('extracts revealed opener <!--[if !mso]><!-- and preserves it', () => {
        const html = '<!--[if !mso]><!--\n<p>revealed</p>\n<!--<![endif]-->';
        const result = preprocess(html, 'test.html');
        const text = result[0].text;
        assert.ok(text.includes('<!--[if !mso]><!--'));
        assert.ok(text.includes('<!--<![endif]-->'));
    });

    it('postprocess([]) returns an empty array without throwing', () => {
        const result = postprocess([]);
        assert.deepEqual(result, []);
    });
});

// ── mso-eslint-parser — additional coverage ───────────────────────────────────

describe('mso-eslint-parser — additional coverage', () => {
    it('visitorKeys exports Program and MsoComment as arrays', () => {
        assert.ok(Array.isArray(visitorKeys.Program));
        assert.ok(Array.isArray(visitorKeys.MsoComment));
        assert.ok(visitorKeys.Program.includes('body'));
    });

    it('closer node has parsed.isClosing === true and correct type', () => {
        const text = extractMsoVirtualFile('<!--[if mso]>\n<td></td>\n<![endif]-->');
        const ast = msoEslintParser.parse(text, {});
        const closerNode = ast.body.find((n) => n.parsed && n.parsed.isClosing);
        assert.ok(closerNode, 'closer node should exist in the AST');
        assert.equal(closerNode.parsed.isClosing, true);
        assert.equal(closerNode.parsed.type, 'downlevel-hidden-end');
    });
});

// ── valid-mso-condition — additional coverage ─────────────────────────────────

describe('valid-mso-condition — additional coverage', () => {
    ruleTester.run('valid-mso-condition — extra valid', validMsoCondition, {
        valid: [
            // eq operator
            { code: extractMsoVirtualFile('<!--[if eq mso 16]>') },
            // negated exact version
            { code: extractMsoVirtualFile('<!--[if !mso 12]>') },
        ],
        invalid: [
            // compound with one invalid sub-part
            {
                code: extractMsoVirtualFile('<!--[if (gte mso 9)&(mso 13)]>'),
                errors: [{ messageId: 'invalidCondition' }],
            },
        ],
    });

    it('ruleTester ran without throwing', () => {
        assert.ok(true);
    });
});
