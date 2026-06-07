import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ESLint } from 'eslint';
import plugin from '../src/index.js';

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
