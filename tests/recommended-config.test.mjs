import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ESLint } from 'eslint';
import plugin from '../src/index.js';
import { fileURLToPath } from 'node:url';

it('repository autofix preserves starred multiline JSDoc', async () => {
    const eslint = new ESLint({
        cwd: fileURLToPath(new URL('..', import.meta.url)),
        fix: true,
    });
    const filePath = 'src/jsdoc-regression.js';
    const rule = 'unicorn/no-asterisk-prefix-in-documentation-comments';
    const config = await eslint.calculateConfigForFile(filePath);
    assert.equal(config.rules[rule][0], 0);
    const comment =
        '/**\n * A representative documentation comment.\n * A second starred line.\n */';
    const code = `${comment}\nexport const answer = 42;\n`;
    const [result] = await eslint.lintText(code, { filePath });
    assert.equal(result.fatalErrorCount, 0);
    assert.ok((result.output ?? code).includes(comment));
    assert.ok(result.messages.every((message) => message.ruleId !== rule));
});

describe('recommended config smoke', () => {
    it('lints HTML with conditional and document rules enabled', async () => {
        const eslint = new ESLint({
            overrideConfigFile: true,
            overrideConfig: [...plugin.configs.recommended],
        });
        const code = [
            '<html xmlns:v="urn:schemas-microsoft-com:vml">',
            '<table><tr><td style="mso-line-hieght-rule:exactly;">',
            '<!--[if mso]><v:rect></v:rect><![endif]-->',
            '</td></tr></table>',
            '</html>',
        ].join('\n');

        const results = await eslint.lintText(code, { filePath: 'email.html' });
        const ruleIds = new Set(
            results.flatMap((result) => result.messages.map((message) => message.ruleId)),
        );

        assert.ok(ruleIds.has('mso/table-presentation-role'));
        assert.ok(ruleIds.has('mso/no-unknown-mso-property'));
        assert.ok(!ruleIds.has('mso/matching-mso-endif'));
    });
});
