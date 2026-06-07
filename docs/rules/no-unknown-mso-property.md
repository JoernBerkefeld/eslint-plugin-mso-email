# `mso/no-unknown-mso-property`

**Category:** problem  
**Default severity:** `warn`  
**Fixable:** yes

Flags `mso-*` CSS property names in inline `style` attributes (and anywhere else they appear as declaration names) that are not in the curated Outlook property allowlist.

When a likely typo is within edit distance of a known property, the message includes a **Did you mean** hint.

## Options

| Option | Type | Default | Description |
|---|---|---|---|
| `maxDistance` | `integer` | `3` | Maximum edit distance for typo suggestions. |
| `suggestTypos` | `boolean` | `true` | Include **Did you mean** hints in messages. |
| `fixTypos` | `boolean` | `true` | Replace the property name when a hint exists. Requires `suggestTypos`. Set to `false` to keep diagnostics without auto-fix. |

## What the fix changes

Replaces only the **property name token** (for example `mso-line-hieght-rule` → `mso-line-height-rule`). Values and surrounding CSS are untouched.

## Examples

### Correct

```html
<td style="mso-line-height-rule:exactly; mso-padding-alt:0;"></td>
```

### Incorrect

```html
<td style="mso-line-hieght-rule:exactly;"></td>
```

With default options, ESLint suggests and can fix `mso-line-height-rule`.

Unknown names with no close allowlist match are reported without a fix:

```html
<td style="mso-totally-made-up:1;"></td>
```

## When to disable

```js
// eslint.config.js
{
  rules: {
    'mso/no-unknown-mso-property': 'off',
  },
}
```
