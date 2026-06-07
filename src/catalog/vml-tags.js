/**
 * VML and Office XML tag names used in HTML email (identifier allowlist).
 * sources: VML specification element names, Outlook email markup patterns
 */

/** @type {ReadonlySet<string>} */
export const VML_TAG_NAMES = new Set(
    [
        'o:AllowPNG',
        'o:BlockQuote',
        'o:BrowserSettings',
        'o:Callout',
        'o:Diagram',
        'o:Extrusion',
        'o:Lock',
        'o:OfficeDocumentSettings',
        'o:PixelsPerInch',
        'o:Skew',
        'o:TopLeftCell',
        'v:arc',
        'v:background',
        'v:curve',
        'v:fill',
        'v:formulas',
        'v:group',
        'v:handles',
        'v:image',
        'v:imagedata',
        'v:line',
        'v:oval',
        'v:path',
        'v:polyline',
        'v:rect',
        'v:roundrect',
        'v:shadow',
        'v:shape',
        'v:shapetype',
        'v:stroke',
        'v:textbox',
        'v:textpath',
        'w:AnchorLock',
        'w:BorderColor',
        'w:DontUseAdvancedTypographyReadingMail',
        'w:WordDocument',
        'xml',
    ].toSorted(),
);

/** @type {ReadonlySet<string>} */
export const VML_NAMESPACE_PREFIXES = new Set(['v', 'o', 'w']);

/** @type {Record<string, string>} */
export const VML_NAMESPACE_DECLARATIONS = {
    v: 'xmlns:v="urn:schemas-microsoft-com:vml"',
    o: 'xmlns:o="urn:schemas-microsoft-com:office:office"',
    w: 'xmlns:w="urn:schemas-microsoft-com:office:word"',
};
