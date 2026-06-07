/**
 * Rule: matching-mso-endif-type
 *
 * Ensures conditional comment closers match the opener variant.
 */

/**
 * @param {object} node - MsoComment AST node for an opener.
 * @returns {{ type: string, text: string }} Expected closer type and literal text.
 */
function expectedCloserForOpener(node) {
    if (node.parsed.type === 'downlevel-hidden') {
        return { type: 'downlevel-hidden-end', text: '<![endif]-->' };
    }

    if (node.raw.includes('<!--[if') && node.raw.endsWith('<!--')) {
        return { type: 'downlevel-hidden-end', text: '<!--<![endif]-->' };
    }

    return { type: 'downlevel-revealed-end', text: '<![endif]>' };
}

export default {
    meta: {
        type: 'problem',
        docs: {
            description: 'Ensure MSO conditional comment closers match their opener style',
            recommended: true,
        },
        fixable: 'code',
        messages: {
            wrongCloser:
                'Closer does not match opener style for "{{raw}}". Expected {{expectedCloser}}',
        },
        schema: [],
    },

    create(context) {
        /** @type {{ node: object, expected: { type: string, text: string } }[]} */
        const stack = [];

        return {
            MsoComment(node) {
                if (!node.parsed) {
                    return;
                }

                if (node.parsed.isClosing) {
                    const opener = stack.pop();
                    if (!opener) {
                        return;
                    }

                    const actual = node.parsed.type;
                    if (actual !== opener.expected.type || node.raw !== opener.expected.text) {
                        context.report({
                            node,
                            messageId: 'wrongCloser',
                            data: {
                                raw: opener.node.raw,
                                expectedCloser: opener.expected.text,
                            },
                            fix(fixer) {
                                return fixer.replaceTextRange(node.range, opener.expected.text);
                            },
                        });
                    }

                    return;
                }

                stack.push({
                    node,
                    expected: expectedCloserForOpener(node),
                });
            },
        };
    },
};
