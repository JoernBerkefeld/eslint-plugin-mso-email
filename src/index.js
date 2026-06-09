/**
 * eslint-plugin-mso-email
 *
 * ESLint plugin for Outlook/HTML email markup: conditional comments, MSO CSS,
 * VML namespaces, and layout table accessibility.
 */

import { DOCUMENT_VIRTUAL_BASENAME, MSO_VIRTUAL_BASENAME } from './lib/mso-comment-pattern.js';
import htmlEslintParser from './html-eslint-parser.js';
import msoEslintParser from './mso-eslint-parser.js';
import processor from './processor.js';
import matchingMsoEndif from './rules/matching-mso-endif.js';
import matchingMsoEndifType from './rules/matching-mso-endif-type.js';
import noUnknownMsoProperty from './rules/no-unknown-mso-property.js';
import noUnknownVmlAttribute from './rules/no-unknown-vml-attribute.js';
import noUnknownVmlTag from './rules/no-unknown-vml-tag.js';
import tablePresentationRole from './rules/table-presentation-role.js';
import validMsoCondition from './rules/valid-mso-condition.js';
import vmlRequiresNamespace from './rules/vml-requires-namespace.js';

const plugin = {
    meta: {
        name: 'eslint-plugin-mso-email',
        version: '1.0.0',
    },

    rules: {
        'valid-mso-condition': validMsoCondition,
        'matching-mso-endif': matchingMsoEndif,
        'matching-mso-endif-type': matchingMsoEndifType,
        'no-unknown-mso-property': noUnknownMsoProperty,
        'vml-requires-namespace': vmlRequiresNamespace,
        'no-unknown-vml-tag': noUnknownVmlTag,
        'no-unknown-vml-attribute': noUnknownVmlAttribute,
        'table-presentation-role': tablePresentationRole,
    },

    processors: {
        html: processor,
    },

    configs: {},
};

/** ESLint joins virtual blocks as `{parent}/{index}_{basename}`. */
const virtualMsoFiles = [
    `**/*.html/*_${MSO_VIRTUAL_BASENAME}`,
    `**/*.amp/*_${MSO_VIRTUAL_BASENAME}`,
    `**/*.ampscript/*_${MSO_VIRTUAL_BASENAME}`,
];
const virtualDocumentFiles = [
    `**/*.html/*_${DOCUMENT_VIRTUAL_BASENAME}`,
    `**/*.amp/*_${DOCUMENT_VIRTUAL_BASENAME}`,
    `**/*.ampscript/*_${DOCUMENT_VIRTUAL_BASENAME}`,
];

Object.assign(plugin.configs, {
    recommended: [
        {
            name: 'mso/html-processor',
            plugins: { mso: plugin },
            files: ['**/*.html', '**/*.amp', '**/*.ampscript'],
            ignores: [...virtualMsoFiles, ...virtualDocumentFiles],
            processor: 'mso/html',
        },
        {
            name: 'mso/conditional-rules',
            plugins: { mso: plugin },
            files: virtualMsoFiles,
            languageOptions: { parser: msoEslintParser },
            rules: {
                'mso/valid-mso-condition': 'error',
                'mso/matching-mso-endif': 'error',
                'mso/matching-mso-endif-type': 'warn',
            },
        },
        {
            name: 'mso/document-rules',
            plugins: { mso: plugin },
            files: virtualDocumentFiles,
            languageOptions: { parser: htmlEslintParser },
            rules: {
                'mso/no-unknown-mso-property': 'warn',
                'mso/vml-requires-namespace': 'warn',
                'mso/no-unknown-vml-tag': 'warn',
                'mso/no-unknown-vml-attribute': 'warn',
                'mso/table-presentation-role': 'warn',
            },
        },
    ],
});

export default plugin;
