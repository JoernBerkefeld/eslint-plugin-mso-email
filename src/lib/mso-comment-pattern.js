/**
 * Regex that matches any MSO conditional comment (opener or closer) in HTML.
 */
export const MSO_COMMENT_PATTERN =
    /<!--\[if\s[^\]]*\]>(?:<!--)?|<!\[if\s[^\]]*\]>|(?:<!--)?<!\[endif\]-->|<!\[endif\]>/g;

/** Basenames for virtual files returned from the HTML processor (ESLint prefixes `{index}_`). */
export const MSO_VIRTUAL_BASENAME = 'mso-comments.mso';
/** Must not end in `.html` — ESLint skips config re-resolution when the extension matches the parent file. */
export const DOCUMENT_VIRTUAL_BASENAME = 'document.msohtml';
