/**
 * Rule: no-unknown-vml-attribute
 */

import { VML_ATTRIBUTE_NAMES } from '../catalog/vml-attributes.js';
import { VML_TAG_NAMES } from '../catalog/vml-tags.js';
import { closestAllowlistMatch, isGenericHtmlAttribute, iterateMatches } from '../lib/html-scan.js';
import { replaceRange } from '../lib/text-fix.js';

const VML_OPEN_TAG_PATTERN = /<([vow]:[A-Za-z][A-Za-z0-9_-]*)([^>]*)>/g;
const ATTRIBUTE_PATTERN = /([A-Za-z_:][A-Za-z0-9_:.-]*)\s*(?:=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?/g;

export default {
    meta: {
        type: 'problem',
        docs: {
            description: 'Disallow unknown attributes on known VML tags',
            recommended: true,
        },
        fixable: 'code',
        messages: {
            unknownAttribute: 'Unknown attribute "{{name}}" on <{{tag}}>',
            unknownAttributeHint:
                'Unknown attribute "{{name}}" on <{{tag}}>. Did you mean "{{hint}}"?',
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
                    if (!VML_TAG_NAMES.has(tagName)) {
                        continue;
                    }

                    const attributesText = match[2] ?? '';
                    const attributesStart = index + 1 + tagName.length;
                    ATTRIBUTE_PATTERN.lastIndex = 0;
                    let attributeMatch = ATTRIBUTE_PATTERN.exec(attributesText);
                    while (attributeMatch !== null) {
                        const attributeName = attributeMatch[1];
                        if (
                            !isGenericHtmlAttribute(attributeName) &&
                            !VML_ATTRIBUTE_NAMES.has(attributeName)
                        ) {
                            const hint = closestAllowlistMatch(
                                attributeName,
                                VML_ATTRIBUTE_NAMES,
                                maxDistance,
                            );
                            const nameStart = attributesStart + attributeMatch.index;
                            const nameEnd = nameStart + attributeName.length;

                            context.report({
                                loc: {
                                    start: sourceCode.getLocFromIndex(nameStart),
                                    end: sourceCode.getLocFromIndex(nameEnd),
                                },
                                messageId: hint ? 'unknownAttributeHint' : 'unknownAttribute',
                                data: { name: attributeName, tag: tagName, hint: hint ?? '' },
                                fix:
                                    hint && fixTypos
                                        ? (fixer) => replaceRange(fixer, nameStart, nameEnd, hint)
                                        : null,
                            });
                        }

                        attributeMatch = ATTRIBUTE_PATTERN.exec(attributesText);
                    }
                }
            },
        };
    },
};
