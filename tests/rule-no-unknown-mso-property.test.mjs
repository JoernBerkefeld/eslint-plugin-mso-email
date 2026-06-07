import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { RuleTester } from 'eslint';
import htmlEslintParser from '../src/html-eslint-parser.js';
import noUnknownMsoProperty from '../src/rules/no-unknown-mso-property.js';

const ruleTester = new RuleTester({
    languageOptions: { parser: htmlEslintParser },
});

describe('no-unknown-mso-property rule', () => {
    ruleTester.run('no-unknown-mso-property', noUnknownMsoProperty, {
        valid: [
            {
                code: '<div style="mso-line-height-rule:exactly; mso-padding-alt:0;"></div>',
            },
        ],
        invalid: [
            {
                code: '<div style="mso-line-hieght-rule:exactly;"></div>',
                errors: [{ messageId: 'unknownPropertyHint' }],
                output: '<div style="mso-line-height-rule:exactly;"></div>',
            },
            {
                code: '<div style="mso-totally-made-up:1;"></div>',
                errors: [{ messageId: 'unknownProperty' }],
                options: [{ fixTypos: false }],
            },
        ],
    });

    it('ruleTester ran without throwing', () => {
        assert.ok(true);
    });
});
