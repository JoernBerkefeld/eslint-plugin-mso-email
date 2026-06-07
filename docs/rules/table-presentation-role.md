# `mso/table-presentation-role`

**Category:** suggestion  
**Default severity:** `warn`  
**Fixable:** yes

Layout tables in HTML email should declare `role="presentation"` or `role="none"` so assistive technology treats them as presentational, not data tables.

## Options

| Option | Type | Default | Description |
|---|---|---|---|
| `preferredRole` | `'presentation' \| 'none'` | `'presentation'` | Role inserted by the auto-fix. |

## What the fix changes

Inserts ` role="presentation"` (or `role="none"` when configured) immediately after `<table` on the opening tag.

## Examples

### Correct

```html
<table role="presentation"><tr><td>Cell</td></tr></table>
<table role="none"><tr><td>Cell</td></tr></table>
```

### Incorrect

```html
<table><tr><td>Cell</td></tr></table>
```

Auto-fix:

```html
<table role="presentation"><tr><td>Cell</td></tr></table>
```

## When to disable

Use for templates where tabular data must remain semantic:

```js
// eslint.config.js
{
  rules: {
    'mso/table-presentation-role': 'off',
  },
}
```
