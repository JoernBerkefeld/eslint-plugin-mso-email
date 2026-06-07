import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { RuleTester } from 'eslint';
import htmlEslintParser from '../src/html-eslint-parser.js';
import tablePresentationRole from '../src/rules/table-presentation-role.js';

const ruleTester = new RuleTester({
    languageOptions: { parser: htmlEslintParser },
});

describe('table-presentation-role rule', () => {
    ruleTester.run('table-presentation-role', tablePresentationRole, {
        valid: [
            { code: '<table role="presentation"><tr><td></td></tr></table>' },
            { code: '<table role="none"><tr><td></td></tr></table>' },
        ],
        invalid: [
            {
                code: '<table><tr><td></td></tr></table>',
                errors: [{ messageId: 'missingRole' }],
                output: '<table role="presentation"><tr><td></td></tr></table>',
            },
        ],
    });

    it('ruleTester ran without throwing', () => {
        assert.ok(true);
    });
});
