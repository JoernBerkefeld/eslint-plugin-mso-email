/**
 * Rule: table-presentation-role
 *
 * Layout tables in HTML email should expose presentation semantics for AT.
 */

import { iterateMatches } from '../lib/html-scan.js';
import { replaceRange } from '../lib/text-fix.js';

const TABLE_OPEN_PATTERN = /<table\b[^>]*>/gi;
const PRESENTATION_ROLE_PATTERN = /\brole\s*=\s*["'](?:presentation|none)["']/i;

export default {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Require layout tables to declare role="presentation" or role="none"',
            recommended: true,
        },
        fixable: 'code',
        messages: {
            missingRole:
                'Layout table should include role="{{role}}" so assistive technology skips table semantics',
        },
        schema: [
            {
                type: 'object',
                properties: {
                    preferredRole: {
                        enum: ['presentation', 'none'],
                    },
                },
                additionalProperties: false,
            },
        ],
    },

    create(context) {
        const preferredRole =
            context.options[0]?.preferredRole === 'none' ? 'none' : 'presentation';

        return {
            Program() {
                const sourceCode = context.sourceCode;
                const text = sourceCode.getText();

                for (const { match, index } of iterateMatches(text, TABLE_OPEN_PATTERN)) {
                    if (PRESENTATION_ROLE_PATTERN.test(match[0])) {
                        continue;
                    }

                    const start = index;
                    const end = index + match[0].length;
                    const tableToken = '<table';

                    context.report({
                        loc: {
                            start: sourceCode.getLocFromIndex(start),
                            end: sourceCode.getLocFromIndex(end),
                        },
                        messageId: 'missingRole',
                        data: { role: preferredRole },
                        fix(fixer) {
                            const insertAt = text.indexOf(tableToken, index) + tableToken.length;
                            return replaceRange(
                                fixer,
                                insertAt,
                                insertAt,
                                ` role="${preferredRole}"`,
                            );
                        },
                    });
                }
            },
        };
    },
};
