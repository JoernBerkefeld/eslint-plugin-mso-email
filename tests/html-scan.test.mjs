import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
    closestAllowlistMatch,
    editDistance,
    iterateMatches,
    readXmlNamespaces,
} from '../src/lib/html-scan.js';

describe('html-scan helpers', () => {
    it('iterates regex matches and skips zero-length loops', () => {
        const matches = [...iterateMatches('a mso-hide: b', /\bmso-[a-z-]+\b/g)];
        assert.equal(matches.length, 1);
        assert.equal(matches[0].match[0], 'mso-hide');
    });

    it('computes edit distance', () => {
        assert.equal(editDistance('kitten', 'sitting'), 3);
        assert.equal(editDistance('mso-hide', 'mso-hide'), 0);
    });

    it('finds closest allowlist matches within threshold', () => {
        const allowlist = ['mso-line-height-rule', 'mso-padding-alt'];
        assert.equal(
            closestAllowlistMatch('mso-line-hieght-rule', allowlist, 3),
            'mso-line-height-rule',
        );
        assert.equal(closestAllowlistMatch('totally-unknown', allowlist, 2), null);
    });

    it('reads xmlns prefixes from html attributes', () => {
        const namespaces = readXmlNamespaces(' xmlns:v="urn:schemas-microsoft-com:vml" lang="en"');
        assert.ok(namespaces.has('v'));
        assert.equal(namespaces.has('o'), false);
    });
});
