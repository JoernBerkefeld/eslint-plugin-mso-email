import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Verifies the package subpath exports declared in package.json resolve and
// expose the symbols consumers (e.g. eslint-plugin-sfmc) rely on.

describe('package subpath exports', () => {
    it('./processor exposes preprocess/postprocess', async () => {
        const mod = await import('eslint-plugin-mso-email/processor');
        assert.equal(typeof mod.preprocess, 'function');
        assert.equal(typeof mod.postprocess, 'function');
        assert.equal(typeof mod.default.preprocess, 'function');
        assert.equal(typeof mod.default.postprocess, 'function');
    });

    it('./mso-parser exposes parse and visitorKeys', async () => {
        const mod = await import('eslint-plugin-mso-email/mso-parser');
        assert.equal(typeof mod.parse, 'function');
        assert.equal(typeof mod.visitorKeys, 'object');
        assert.equal(typeof mod.default.parse, 'function');
    });

    it('./html-parser exposes parse and visitorKeys', async () => {
        const mod = await import('eslint-plugin-mso-email/html-parser');
        assert.equal(typeof mod.parse, 'function');
        assert.equal(typeof mod.visitorKeys, 'object');
        assert.equal(typeof mod.default.parse, 'function');
    });

    it('./comment-pattern exposes the pattern and virtual basenames', async () => {
        const mod = await import('eslint-plugin-mso-email/comment-pattern');
        assert.ok(mod.MSO_COMMENT_PATTERN instanceof RegExp);
        assert.equal(typeof mod.MSO_VIRTUAL_BASENAME, 'string');
        assert.equal(typeof mod.DOCUMENT_VIRTUAL_BASENAME, 'string');
    });
});
