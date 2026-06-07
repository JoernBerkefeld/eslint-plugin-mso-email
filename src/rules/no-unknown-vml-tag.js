/**
 * Rule: no-unknown-vml-tag
 */

import { VML_TAG_NAMES } from '../catalog/vml-tags.js';
import { closestAllowlistMatch, iterateMatches } from '../lib/html-scan.js';
import { replaceRange } from '../lib/text-fix.js';

const VML_OPEN_TAG_PATTERN = /<([vow]:[A-Za-z][A-Za-z0-9_-]*)([^>]*)>/g;

export default {
    meta: {
        type: 'problem',
        docs: {
            description: 'Disallow unknown VML or Office XML tag names',
            recommended: true,
        },
        fixable: 'code',
        messages: {
            unknownTag: 'Unknown VML tag <{{tag}}>',
            unknownTagHint: 'Unknown VML tag <{{tag}}>. Did you mean <{{hint}}>?',
        },
        schema: [
            {
                type: 'object',
                properties: {
                    maxDistance: { type: 'integer', minimum: 0 },
                    fixTypos: { type: 'boolean' },
                },
                additionalProperties: false,
            },
        ],
    },

    create(context) {
        const options = context.options[0] ?? {};
        const maxDistance = options.maxDistance ?? 2;
        const fixTypos = options.fixTypos !== false;

        return {
            Program() {
                const sourceCode = context.sourceCode;
                const text = sourceCode.getText();

                for (const { match, index } of iterateMatches(text, VML_OPEN_TAG_PATTERN)) {
                    const tagName = match[1];
                    if (VML_TAG_NAMES.has(tagName)) {
                        continue;
                    }

                    const hint = closestAllowlistMatch(tagName, VML_TAG_NAMES, maxDistance);
                    if (!hint) {
                        continue;
                    }

                    const nameStart = index + 1;
                    const nameEnd = nameStart + tagName.length;

                    context.report({
                        loc: {
                            start: sourceCode.getLocFromIndex(nameStart),
                            end: sourceCode.getLocFromIndex(nameEnd),
                        },
                        messageId: 'unknownTagHint',
                        data: { tag: tagName, hint },
                        fix: fixTypos
                            ? (fixer) => replaceRange(fixer, nameStart, nameEnd, hint)
                            : null,
                    });
                }
            },
        };
    },
};
