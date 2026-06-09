# `mso/valid-mso-condition`

**Category:** problem  
**Default severity:** `error`  
**Fixable:** partial (deterministic typos)

Validates MSO conditional comment openers:

- keyword is `mso` (not `mos` or similar typos)
- comparison operator is one of `gte`, `gt`, `lte`, `lt`, `eq`
- version number is a known Outlook MSO version (9, 10, 11, 12, 14, 15, 16)
- an operator is always paired with a version number
- legacy `IE` / `!IE` conditions are accepted

## Options

| Option | Type | Default | Description |
|---|---|---|---|
| `fixTypos` | `boolean` | `true` | Apply auto-fix when the parser returns a deterministic replacement for the condition substring. |

## What the fix changes

When `fixTypos` is enabled and the parser supplies a replacement (for example `mos` → `mso`), only the **condition text inside the opener** is rewritten. Invalid version numbers, unknown operators, and ambiguous compound conditions are **not** auto-fixed.

## Examples

### Correct

```html
<!--[if mso]><p>All Outlook versions</p><![endif]-->
<!--[if gte mso 14]><p>Outlook 2010+</p><![endif]-->
<!--[if mso 16]><p>Outlook 2016/2019/365</p><![endif]-->
<!--[if IE]><p>Legacy IE targeting</p><![endif]-->
<!--[if !mso]><!--><p>Non-Outlook clients</p><!--<![endif]-->
```

### Incorrect

```html
<!--[if mos]>         <!-- typo: mos → mso (fixable when fixTypos is true) -->
<!--[if newer mso 16]> <!-- unknown operator -->
<!--[if gte mso 13]>  <!-- version 13 does not exist -->
<!--[if gte mso]>     <!-- operator without version -->
```

## Valid Outlook MSO versions

| MSO version | Outlook product |
|---|---|
| 9 | Outlook 2000 |
| 10 | Outlook 2002 |
| 11 | Outlook 2003 |
| 12 | Outlook 2007 |
| 14 | Outlook 2010 |
| 15 | Outlook 2013 |
| 16 | Outlook 2016, 2019, and 365 |

> There is no MSO version 13 — Outlook skips from 12 (2007) to 14 (2010).

## When to disable

```js
// eslint.config.js
{
  rules: {
    'mso/valid-mso-condition': 'off',
  },
}
```
