# `mso/matching-mso-endif-type`

**Category:** problem  
**Default severity:** `warn`  
**Fixable:** yes

After openers and closers are stack-matched, checks that each closer uses the **variant** expected for its opener style (for example downlevel-hidden `<!--[if mso]>` with `<![endif]-->`, not `<![endif]>`).

Pairing of openers to closers is handled by [`mso/matching-mso-endif`](matching-mso-endif.md). This rule only flags **type mismatches** on already matched pairs.

## What the fix changes

Replaces the closer token with the expected literal for the matched opener (for example `<![endif]>` → `<![endif]-->`).

## Examples

### Correct

```html
<!--[if mso]>
  <td></td>
<![endif]-->
```

```html
<![if mso]>
  <td></td>
<![endif]>
```

### Incorrect

Downlevel-hidden opener with revealed-style closer:

```html
<!--[if mso]>
  <td></td>
<![endif]>
```

Auto-fix rewrites the closer to `<![endif]-->`.

## When to disable

```js
// eslint.config.js
{
  rules: {
    'mso/matching-mso-endif-type': 'off',
  },
}
```
