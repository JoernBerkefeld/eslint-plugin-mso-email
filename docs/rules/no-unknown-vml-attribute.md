# `mso/no-unknown-vml-attribute`

**Category:** problem  
**Default severity:** `warn`  
**Fixable:** partial (typo hints)

On **known** VML tags, validates attribute names against the curated allowlist. Standard HTML attributes (`class`, `id`, `style`, …), `data-*`, and `aria-*` are ignored.

## Options

| Option | Type | Default | Description |
|---|---|---|---|
| `maxDistance` | `integer` | `2` | Maximum edit distance for typo suggestions. |
| `fixTypos` | `boolean` | `true` | Replace the attribute name when a hint exists. |

## What the fix changes

Replaces only the **attribute name** (for example `fillcolr` → `fillcolor`). Values are untouched.

## Examples

### Correct

```html
<v:rect fillcolor="#0072C6" strokecolor="#0072C6"></v:rect>
```

### Incorrect

```html
<v:rect fillcolr="#0072C6"></v:rect>
```

With default options, ESLint suggests and can fix `fillcolor`.

Unknown attributes with no close allowlist match are still reported, but without an auto-fix.

## When to disable

```js
// eslint.config.js
{
  rules: {
    'mso/no-unknown-vml-attribute': 'off',
  },
}
```
