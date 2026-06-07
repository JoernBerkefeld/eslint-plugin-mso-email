# `mso-conditionals/valid-mso-condition`

**Category:** problem  
**Default severity:** `error`  
**Fixable:** no

Validates that every MSO conditional comment opener uses correct syntax:

- keyword is `mso` (not `mos` or similar typos)
- comparison operator is one of `gte`, `gt`, `lte`, `lt`, `eq`
- version number is a known Outlook version (9, 10, 11, 12, 14, 15, 16)
- an operator is always paired with a version number

## Examples

### Correct

```html
<!--[if mso]>      <p>All Outlook versions</p>  <![endif]-->
<!--[if gte mso 14]>  <p>Outlook 2010+</p>      <![endif]-->
<!--[if mso 16]>   <p>Outlook 2016/2019/365</p> <![endif]-->
<!--[if !mso]><!--><p>Non-Outlook clients</p>   <!--<![endif]-->
<![if !mso]>       <p>Non-Outlook (non-standard)</p> <![endif]>
```

### Incorrect

```html
<!--[if mos]>         <!-- ✗ typo: 'mos' should be 'mso' -->
<!--[if newer mso 16]><!-- ✗ unknown operator 'newer' -->
<!--[if gte mso 13]>  <!-- ✗ version 13 does not exist (jumps 12→14) -->
<!--[if gte mso]>     <!-- ✗ operator 'gte' requires a version number -->
<!--[if xyz]>         <!-- ✗ unrecognized condition -->
```

## Valid Outlook versions

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

## Valid operators

| Operator | Meaning |
|---|---|
| `gte` | greater than or equal |
| `gt` | greater than |
| `lte` | less than or equal |
| `lt` | less than |
| `eq` | equal |

## When to disable

This rule can be disabled per-file if you intentionally use non-standard or proprietary MSO condition syntax not covered by the known set:

```js
// eslint.config.js
{
  rules: {
    'mso-conditionals/valid-mso-condition': 'off',
  },
}
```
