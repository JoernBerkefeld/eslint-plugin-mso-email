import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { RuleTester } from 'eslint';
import msoEslintParser from '../src/mso-eslint-parser.js';
import matchingMsoEndifType from '../src/rules/matching-mso-endif-type.js';
import { extractMsoVirtualFile } from './helpers/extract-files.js';

const ruleTester = new RuleTester({
    languageOptions: { parser: msoEslintParser },
});

describe('matching-mso-endif-type rule', () => {
    ruleTester.run('matching-mso-endif-type', matchingMsoEndifType, {
        valid: [
            {
                code: extractMsoVirtualFile('<!--[if mso]>\n<td></td>\n<![endif]-->'),
            },
            {
                code: extractMsoVirtualFile('<![if mso]>\n<td></td>\n<![endif]>'),
            },
        ],
        invalid: [
            {
                code: extractMsoVirtualFile('<!--[if mso]>\n<td></td>\n<![endif]>'),
                errors: [{ messageId: 'wrongCloser' }],
                output: extractMsoVirtualFile('<!--[if mso]>\n<td></td>\n<![endif]-->'),
            },
        ],
    });

    it('ruleTester ran without throwing', () => {
        assert.ok(true);
    });
});
