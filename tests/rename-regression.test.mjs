import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import plugin from '../src/index.js';

describe('rename regression', () => {
    it('registers eslint-plugin-mso-email metadata', () => {
        assert.equal(plugin.meta.name, 'eslint-plugin-mso-email');
    });

    it('exposes rules under the mso namespace in recommended config', () => {
        const conditionalConfig = plugin.configs.recommended.find(
            (entry) => entry.name === 'mso/conditional-rules',
        );
        assert.ok(conditionalConfig.rules['mso/valid-mso-condition']);
        assert.ok(conditionalConfig.rules['mso/matching-mso-endif']);
    });

    it('registers the html processor as mso/html', () => {
        const processorConfig = plugin.configs.recommended.find(
            (entry) => entry.name === 'mso/html-processor',
        );
        assert.equal(processorConfig.processor, 'mso/html');
    });

    it('targets ESLint virtual document blocks with a non-.html extension', () => {
        const documentConfig = plugin.configs.recommended.find(
            (entry) => entry.name === 'mso/document-rules',
        );
        assert.ok(documentConfig.files.some((pattern) => pattern.includes('document.msohtml')));
    });

    it('registers all eight rules', () => {
        assert.equal(Object.keys(plugin.rules).length, 8);
    });
});
