import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import htmlEslintParser from '../src/html-eslint-parser.js';

describe('html-eslint-parser', () => {
    it('returns a Program node spanning the document', () => {
        const code = '<html><body></body></html>';
        const ast = htmlEslintParser.parse(code, {});
        assert.equal(ast.type, 'Program');
        assert.deepEqual(ast.body, []);
        assert.equal(ast.range[1], code.length);
    });
});
