/**
 * Rule: vml-requires-namespace
 *
 * Requires xmlns declarations on html when VML/Office tags are used.
 */

import {
    VML_NAMESPACE_DECLARATIONS,
    VML_NAMESPACE_PREFIXES,
    VML_TAG_NAMES,
} from '../catalog/vml-tags.js';
import { iterateMatches, readXmlNamespaces } from '../lib/html-scan.js';
import { replaceRange } from '../lib/text-fix.js';

const HTML_OPEN_PATTERN = /<html\b([^>]*)>/i;
const VML_OPEN_TAG_PATTERN = /<([vow]:[A-Za-z][A-Za-z0-9_-]*)([^>]*)>/g;

export default {
    meta: {
        type: 'problem',
        docs: {
            description:
                'Require xmlns declarations on html when VML or Office XML tags are present',
            recommended: true,
        },
        fixable: 'code',
        messages: {
            missingNamespace: 'Tag <{{tag}}> requires {{declaration}} on the html element',
        },
        schema: [],
    },

    create(context) {
        return {
            Program() {
                const sourceCode = context.sourceCode;
                const text = sourceCode.getText();
                const htmlMatch = HTML_OPEN_PATTERN.exec(text);
                if (!htmlMatch) {
                    return;
                }

                const declared = readXmlNamespaces(htmlMatch[1]);
                const usedPrefixes = new Set();

                for (const { match } of iterateMatches(text, VML_OPEN_TAG_PATTERN)) {
                    const tagName = match[1];
                    if (!VML_TAG_NAMES.has(tagName) && !tagName.includes(':')) {
                        continue;
                    }

                    const prefix = tagName.split(':')[0]?.toLowerCase();
                    if (VML_NAMESPACE_PREFIXES.has(prefix)) {
                        usedPrefixes.add(prefix);
                    }
                }

                if (usedPrefixes.size === 0) {
                    return;
                }

                const htmlStart = htmlMatch.index;
                const htmlEnd = htmlStart + htmlMatch[0].length;
                const insertPos = htmlEnd - 1;

                for (const prefix of usedPrefixes) {
                    if (declared.has(prefix)) {
                        continue;
                    }

                    const declaration = VML_NAMESPACE_DECLARATIONS[prefix];
                    context.report({
                        loc: {
                            start: sourceCode.getLocFromIndex(htmlStart),
                            end: sourceCode.getLocFromIndex(htmlEnd),
                        },
                        messageId: 'missingNamespace',
                        data: { tag: `${prefix}:*`, declaration },
                        fix(fixer) {
                            return replaceRange(fixer, insertPos, insertPos, ` ${declaration}`);
                        },
                    });
                }
            },
        };
    },
};
