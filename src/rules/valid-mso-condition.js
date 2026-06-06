/**
 * Rule: valid-mso-condition
 *
 * Validates that every MSO conditional comment opener uses correct syntax:
 * - known keyword (mso, not mos)
 * - valid comparison operator (gte, gt, lte, lt, eq)
 * - valid version number (9, 10, 11, 12, 14, 15, 16 — no 13)
 * - operator has a version number when required
 */

export default {
    meta: {
        type: 'problem',
        docs: {
            description:
                'Ensure MSO conditional comments use valid syntax (correct keyword, operator, and version number)',
            recommended: true,
        },
        messages: {
            invalidCondition: 'Invalid MSO conditional comment: {{error}}. Found: "{{raw}}"',
        },
        schema: [],
    },

    create(context) {
        return {
            MsoComment(node) {
                if (!node.parsed) {
                    return;
                }

                // Closers have no condition to validate
                if (node.parsed.isClosing) {
                    return;
                }

                if (!node.parsed.isValid) {
                    context.report({
                        node,
                        messageId: 'invalidCondition',
                        data: {
                            error: node.parsed.error ?? 'unknown error',
                            raw: node.raw,
                        },
                    });
                }
            },
        };
    },
};
