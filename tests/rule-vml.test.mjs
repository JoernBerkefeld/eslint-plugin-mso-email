import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { RuleTester } from 'eslint';
import htmlEslintParser from '../src/html-eslint-parser.js';
import noUnknownVmlAttribute from '../src/rules/no-unknown-vml-attribute.js';
import noUnknownVmlTag from '../src/rules/no-unknown-vml-tag.js';
import vmlRequiresNamespace from '../src/rules/vml-requires-namespace.js';

const ruleTester = new RuleTester({
    languageOptions: { parser: htmlEslintParser },
});

describe('VML rules', () => {
    ruleTester.run('vml-requires-namespace', vmlRequiresNamespace, {
        valid: [
            {
                code: '<html xmlns:v="urn:schemas-microsoft-com:vml"><body><v:rect></v:rect></body></html>',
            },
        ],
        invalid: [
            {
                code: '<html><body><v:rect></v:rect></body></html>',
                errors: [{ messageId: 'missingNamespace' }],
                output: '<html xmlns:v="urn:schemas-microsoft-com:vml"><body><v:rect></v:rect></body></html>',
            },
        ],
    });

    ruleTester.run('no-unknown-vml-tag', noUnknownVmlTag, {
        valid: [{ code: '<v:rect></v:rect>' }],
        invalid: [
            {
                code: '<v:rct />',
                errors: [{ messageId: 'unknownTagHint' }],
                output: '<v:rect />',
            },
        ],
    });

    ruleTester.run('no-unknown-vml-attribute', noUnknownVmlAttribute, {
        valid: [{ code: '<v:rect fillcolor="#fff"></v:rect>' }],
        invalid: [
            {
                code: '<v:rect filcolor="#fff"></v:rect>',
                errors: [{ messageId: 'unknownAttributeHint' }],
                output: '<v:rect fillcolor="#fff"></v:rect>',
            },
        ],
    });

    it('ruleTester ran without throwing', () => {
        assert.ok(true);
    });
});
