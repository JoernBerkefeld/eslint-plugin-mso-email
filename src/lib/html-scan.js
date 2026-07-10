/**
 * Text scanning helpers for HTML email lint rules.
 */

/**
 * Iterates regex matches in source text with stable index advancement.
 *
 * @param {string} text - Document text.
 * @param {RegExp} pattern - Global regular expression.
 * @yields {{ match: RegExpExecArray, index: number, length: number }}
 */
export function* iterateMatches(text, pattern) {
    if (!pattern.global) {
        throw new Error('iterateMatches requires a global RegExp');
    }

    pattern.lastIndex = 0;
    let match = pattern.exec(text);
    while (match !== null) {
        const index = match.index;
        const length = match[0].length;
        yield { match, index, length };
        if (length === 0) {
            pattern.lastIndex = index + 1;
        }

        match = pattern.exec(text);
    }
}

/**
 * Computes edit distance between two strings.
 *
 * @param {string} left - First string.
 * @param {string} right - Second string.
 * @returns {number} Levenshtein distance.
 */
export function editDistance(left, right) {
    if (left === right) {
        return 0;
    }

    if (left.length === 0) {
        return right.length;
    }

    if (right.length === 0) {
        return left.length;
    }

    const previous = Array.from({ length: right.length + 1 }, (_, index) => index);

    for (let index = 1; index <= left.length; index++) {
        let diagonal = previous[0];
        previous[0] = index;

        for (let index_ = 1; index_ <= right.length; index_++) {
            const saved = previous[index_];
            const substitutionCost = left[index - 1] === right[index_ - 1] ? 0 : 1;
            previous[index_] = Math.min(
                previous[index_] + 1,
                previous[index_ - 1] + 1,
                diagonal + substitutionCost,
            );
            diagonal = saved;
        }
    }

    return previous[right.length];
}

/**
 * Finds the closest allowlist entry within a maximum edit distance.
 *
 * @param {string} candidate - User-provided identifier.
 * @param {Iterable<string>} allowlist - Known-good identifiers.
 * @param {number} maxDistance - Maximum allowed edit distance.
 * @returns {string|null} Closest allowlist entry, if any.
 */
export function closestAllowlistMatch(candidate, allowlist, maxDistance) {
    let best = null;
    let bestDistance = maxDistance + 1;

    for (const entry of allowlist) {
        const distance = editDistance(candidate, entry);
        if (distance <= maxDistance && distance < bestDistance) {
            best = entry;
            bestDistance = distance;
        }
    }

    return best;
}

/**
 * Reads declared XML namespace prefixes from an html open tag attribute string.
 *
 * @param {string} attributeText - Inner portion of the html tag.
 * @returns {Set<string>} Lowercase namespace prefixes (v, o, w, ...).
 */
export function readXmlNamespaces(attributeText) {
    const namespaces = new Set();
    const xmlnsPattern = /xmlns:([a-z]+)\s*=/gi;
    let match = xmlnsPattern.exec(attributeText);
    while (match !== null) {
        namespaces.add(match[1].toLowerCase());
        match = xmlnsPattern.exec(attributeText);
    }

    return namespaces;
}

/**
 * Whether an attribute name is treated as a generic HTML attribute.
 *
 * @param {string} name - Attribute name.
 * @returns {boolean} True when the attribute should not be validated as VML-specific.
 */
const GENERIC_HTML_ATTRIBUTES = new Set([
    'id',
    'class',
    'style',
    'title',
    'lang',
    'dir',
    'hidden',
    'tabindex',
    'role',
    'alt',
    'src',
    'href',
    'target',
    'rel',
    'name',
    'value',
    'type',
]);

export function isGenericHtmlAttribute(name) {
    const lower = name.toLowerCase();
    if (GENERIC_HTML_ATTRIBUTES.has(lower)) {
        return true;
    }

    return lower.startsWith('data-') || lower.startsWith('aria-');
}
