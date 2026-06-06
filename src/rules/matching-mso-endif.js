/**
 * Rule: matching-mso-endif
 *
 * Validates that every MSO conditional comment opener has a matching
 * closer ([endif]) and that no [endif] appears without an opening comment.
 *
 * Uses a stack to track nested conditionals across the entire virtual
 * .mso file (one file per source HTML file). Reports unclosed openers
 * at Program:exit.
 */

export default {
    meta: {
        type: 'problem',
        docs: {
            description:
                'Ensure every MSO conditional comment opener has a matching closing [endif]',
            recommended: true,
        },
        messages: {
            unclosedConditional: 'MSO conditional "{{raw}}" is never closed with [endif]',
            unmatchedEndif: 'Found [endif] with no matching MSO conditional opener',
        },
        schema: [],
    },

    create(context) {
        /** @type {object[]} */
        const stack = [];

        return {
            MsoComment(node) {
                if (!node.parsed) {
                    return;
                }

                if (node.parsed.isClosing) {
                    if (stack.length === 0) {
                        context.report({ node, messageId: 'unmatchedEndif' });
                    } else {
                        stack.pop();
                    }
                } else {
                    // opener
                    stack.push(node);
                }
            },

            'Program:exit'() {
                for (const opener of stack) {
                    context.report({
                        node: opener,
                        messageId: 'unclosedConditional',
                        data: { raw: opener.raw },
                    });
                }
            },
        };
    },
};
