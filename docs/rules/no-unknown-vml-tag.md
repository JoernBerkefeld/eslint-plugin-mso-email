# `mso/no-unknown-vml-tag`

**Category:** problem  
**Default severity:** `warn`  
**Fixable:** yes

Flags unknown namespaced tag names (`v:`, `o:`, `w:`) that closely resemble a known VML or Office XML tag in the allowlist.

Tags that are not in the catalog **and** have no close allowlist match within `maxDistance` are not reported (to avoid noise on deliberate custom markup).

## Options

| Option | Type | Default | Description |
|---|---|---|---|
| `maxDistance` | `integer` | `2` | Maximum edit distance for typo detection and suggestions. |
| `fixTypos` | `boolean` | `true` | Replace the tag name when a hint exists. |

## What the fix changes

Replaces the tag name in the opening tag only (for example `v:rct` → `v:rect`). Closing tags on other lines are not rewritten.

## Examples

### Correct

```html
<v:rect></v:rect>
```

### Incorrect

```html
<v:rct />
```

With default options, ESLint suggests and can fix `v:rect`.

## When to disable

```js
// eslint.config.js
{
  rules: {
    'mso/no-unknown-vml-tag': 'off',
  },
}
```
