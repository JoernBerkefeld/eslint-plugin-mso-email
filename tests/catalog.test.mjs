import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { MSO_CSS_PROPERTIES } from '../src/catalog/mso-css-properties.js';
import { VML_ATTRIBUTE_NAMES } from '../src/catalog/vml-attributes.js';
import { VML_TAG_NAMES } from '../src/catalog/vml-tags.js';

describe('catalog allowlists', () => {
    it('includes staple Outlook CSS properties', () => {
        assert.ok(MSO_CSS_PROPERTIES.has('mso-line-height-rule'));
        assert.ok(MSO_CSS_PROPERTIES.has('mso-padding-alt'));
    });

    it('includes staple VML tags', () => {
        assert.ok(VML_TAG_NAMES.has('v:rect'));
        assert.ok(VML_TAG_NAMES.has('o:OfficeDocumentSettings'));
    });

    it('includes staple VML attributes', () => {
        assert.ok(VML_ATTRIBUTE_NAMES.has('fillcolor'));
        assert.ok(VML_ATTRIBUTE_NAMES.has('strokeweight'));
    });

    it('keeps MSO CSS identifiers unique', () => {
        assert.equal(MSO_CSS_PROPERTIES.size, new Set(MSO_CSS_PROPERTIES).size);
    });
});
