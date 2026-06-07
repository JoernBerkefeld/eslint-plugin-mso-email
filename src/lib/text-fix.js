/**
 * Small helpers for ESLint text fixers.
 */

/**
 * Applies a single range replacement fix.
 *
 * @param {import('eslint').Rule.RuleFixer} fixer - ESLint fixer instance.
 * @param {number} start - Start index in source text.
 * @param {number} end - End index in source text.
 * @param {string} replacement - Replacement text.
 * @returns {import('eslint').Rule.Fix} ESLint fix object.
 */
export function replaceRange(fixer, start, end, replacement) {
    return fixer.replaceTextRange([start, end], replacement);
}
