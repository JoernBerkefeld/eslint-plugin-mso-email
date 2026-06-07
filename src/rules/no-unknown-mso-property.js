/**
 * Rule: no-unknown-mso-property
 *
 * Flags Outlook-specific CSS properties that are not in the curated allowlist.
 */

import { MSO_CSS_PROPERTIES } from '../catalog/mso-css-properties.js';
import { closestAllowlistMatch, iterateMatches } from '../lib/html-scan.js';
import { replaceRange } from '../lib/text-fix.js';

const MSO_PROPERTY_PATTERN = /\b(mso-[a-z][a-z0-9-]*)\s*:/gi;

export default {
    meta: {
        type: 'problem',
        docs: {
            description: 'Disallow unknown mso-* CSS property names in HTML email markup',
            recommended: true,
        },
        fixable: 'code',
        messages: {
            unknownProperty: 'Unknown Outlook CSS property "{{name}}"',
            unknownPropertyHint:
                'Unknown Outlook CSS property "{{name}}". Did you mean "{{hint}}"?',
        },
        schema: [
            {
                type: 'object',
                properties: {
                    maxDistance: { type: 'integer', minimum: 0 },
                    suggestTypos: { type: 'boolean' },
                    fixTypos: { type: 'boolean' },
                },
                additionalProperties: false,
            },
        ],
    },

    create(context) {
        const options = context.options[0] ?? {};
        const maxDistance = options.maxDistance ?? 3;
        const suggestTypos = options.suggestTypos !== false;
        const fixTypos = options.fixTypos !== false && suggestTypos;

        return {
            Program() {
                const sourceCode = context.sourceCode;
                const text = sourceCode.getText();

                for (const { match, index } of iterateMatches(text, MSO_PROPERTY_PATTERN)) {
                    const name = match[1];
                    if (MSO_CSS_PROPERTIES.has(name)) {
                        continue;
                    }

                    const hint =
                        suggestTypos &&
                        closestAllowlistMatch(name, MSO_CSS_PROPERTIES, maxDistance);
                    const nameStart = index + match[0].indexOf(name);
                    const nameEnd = nameStart + name.length;

                    context.report({
                        loc: {
                            start: sourceCode.getLocFromIndex(nameStart),
                            end: sourceCode.getLocFromIndex(nameEnd),
                        },
                        messageId: hint ? 'unknownPropertyHint' : 'unknownProperty',
                        data: { name, hint: hint ?? '' },
                        fix:
                            hint && fixTypos
                                ? (fixer) => replaceRange(fixer, nameStart, nameEnd, hint)
                                : null,
                    });
                }
            },
        };
    },
};
