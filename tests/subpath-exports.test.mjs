import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Verifies the package subpath exports declared in package.json resolve and
// expose the symbols consumers (e.g. eslint-plugin-sfmc) rely on.

describe('package subpath exports', () => {
    it('./processor exposes preprocess/postprocess', async () => {
        const module_ = await import('eslint-plugin-mso-email/processor');
        assert.equal(typeof module_.preprocess, 'function');
        assert.equal(typeof module_.postprocess, 'function');
        assert.equal(typeof module_.default.preprocess, 'function');
        assert.equal(typeof module_.default.postprocess, 'function');
    });

    it('./mso-parser exposes parse and visitorKeys', async () => {
        const module_ = await import('eslint-plugin-mso-email/mso-parser');
        assert.equal(typeof module_.parse, 'function');
        assert.equal(typeof module_.visitorKeys, 'object');
        assert.equal(typeof module_.default.parse, 'function');
    });

    it('./html-parser exposes parse and visitorKeys', async () => {
        const module_ = await import('eslint-plugin-mso-email/html-parser');
        assert.equal(typeof module_.parse, 'function');
        assert.equal(typeof module_.visitorKeys, 'object');
        assert.equal(typeof module_.default.parse, 'function');
    });

    it('./comment-pattern exposes the pattern and virtual basenames', async () => {
        const module_ = await import('eslint-plugin-mso-email/comment-pattern');
        assert.ok(module_.MSO_COMMENT_PATTERN instanceof RegExp);
        assert.equal(typeof module_.MSO_VIRTUAL_BASENAME, 'string');
        assert.equal(typeof module_.DOCUMENT_VIRTUAL_BASENAME, 'string');
    });
});
