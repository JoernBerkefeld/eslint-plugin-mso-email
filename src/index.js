/**
 * eslint-plugin-mso-conditionals
 *
 * ESLint plugin for validating MSO (Outlook) conditional comments in HTML email.
 * Provides a processor that extracts MSO comments from HTML and a custom parser
 * that turns them into an AST, enabling rules to validate their syntax and structure.
 */

import msoEslintParser from './mso-eslint-parser.js';
import processor from './processor.js';
import validMsoCondition from './rules/valid-mso-condition.js';
import matchingMsoEndif from './rules/matching-mso-endif.js';

const plugin = {
    meta: {
        name: 'eslint-plugin-mso-conditionals',
        version: '1.0.0',
    },

    rules: {
        'valid-mso-condition': validMsoCondition,
        'matching-mso-endif': matchingMsoEndif,
    },

    processors: {
        html: processor,
    },

    configs: {},
};

Object.assign(plugin.configs, {
    /**
     * Recommended config for HTML files containing MSO conditional comments.
     * Returns an array of two config objects (processor + rules), following the
     * same flat-config pattern as eslint-plugin-sfmc's `configs.embedded`.
     */
    recommended: [
        {
            name: 'mso-conditionals/html-processor',
            plugins: { 'mso-conditionals': plugin },
            files: ['**/*.html', '**/*.amp', '**/*.ampscript'],
            processor: 'mso-conditionals/html',
        },
        {
            name: 'mso-conditionals/mso-rules',
            plugins: { 'mso-conditionals': plugin },
            files: ['**/*.html/*.mso', '**/*.amp/*.mso', '**/*.ampscript/*.mso'],
            languageOptions: { parser: msoEslintParser },
            rules: {
                'mso-conditionals/valid-mso-condition': 'error',
                'mso-conditionals/matching-mso-endif': 'error',
            },
        },
    ],
});

export default plugin;
