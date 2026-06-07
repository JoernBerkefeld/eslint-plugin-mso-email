/**
 * Rule: valid-mso-condition
 *
 * Validates MSO conditional comment opener expressions.
 */

import { replaceRange } from '../lib/text-fix.js';

export default {
    meta: {
        type: 'problem',
        docs: {
            description:
                'Ensure MSO conditional comments use valid syntax (keyword, operator, and version)',
            recommended: true,
        },
        fixable: 'code',
        messages: {
            invalidCondition: 'Invalid MSO conditional comment: {{error}}. Found: "{{raw}}"',
        },
        schema: [
            {
                type: 'object',
                properties: {
                    fixTypos: { type: 'boolean' },
                },
                additionalProperties: false,
            },
        ],
    },

    create(context) {
        const fixTypos = context.options[0]?.fixTypos !== false;

        return {
            MsoComment(node) {
                if (!node.parsed || node.parsed.isClosing) {
                    return;
                }

                if (node.parsed.isValid) {
                    return;
                }

                const conditionFix = node.parsed.conditionFix;
                const condition = node.parsed.condition;

                context.report({
                    node,
                    messageId: 'invalidCondition',
                    data: {
                        error: node.parsed.error ?? 'unknown error',
                        raw: node.raw,
                    },
                    fix:
                        conditionFix && fixTypos && condition
                            ? (fixer) => {
                                  const start = node.raw.indexOf(condition);
                                  if (start === -1) {
                                      return null;
                                  }

                                  return replaceRange(
                                      fixer,
                                      node.range[0] + start,
                                      node.range[0] + start + condition.length,
                                      conditionFix,
                                  );
                              }
                            : null,
                });
            },
        };
    },
};
