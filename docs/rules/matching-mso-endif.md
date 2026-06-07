# `mso-conditionals/matching-mso-endif`

**Category:** problem  
**Default severity:** `error`  
**Fixable:** no

Ensures every MSO conditional comment opener is closed by a matching `[endif]`, and every `[endif]` closer has a corresponding opener. Unmatched pairs cause Outlook to misinterpret layout and are a common source of rendering bugs.

## What counts as an opener

Any of the following patterns is treated as an opener:

- `<!--[if mso]>` — standard conditional comment
- `<!--[if gte mso 14]><!--` — downlevel-hidden variant
- `<![if mso]>` — non-standard short form

## What counts as a closer

Any of the following patterns is treated as a closer:

- `<![endif]-->` — standard close
- `<!--<![endif]-->` — downlevel-hidden close
- `<![endif]>` — non-standard short form

## Examples

### Correct

```html
<!--[if mso]>
  <p>Outlook content</p>
<![endif]-->

<!--[if gte mso 14]><!--
  <p>Non-Outlook, hidden from Outlook 2010+</p>
<!--<![endif]-->
```

Nested pairs are also valid:

```html
<!--[if mso]>
  <!--[if gte mso 14]>
    <p>Outlook 2010+</p>
  <![endif]-->
<![endif]-->
```

### Incorrect

Missing `[endif]`:

```html
<!--[if mso]>
  <p>Outlook content</p>
<!-- ✗ missing <![endif]--> -->
```

Closer without an opener:

```html
<p>Regular content</p>
<![endif]-->   <!-- ✗ no matching opener above -->
```

Mismatched nesting:

```html
<!--[if mso]>
  <!--[if gte mso 14]>
<![endif]-->  <!-- ✗ closes the outer block while inner is still open -->
```

## When to disable

Disable per-file if you have template fragments that intentionally contain only half of a pair:

```js
// eslint.config.js
{
  rules: {
    'mso-conditionals/matching-mso-endif': 'warn',
  },
}
```

Or disable for a specific file with an `eslint-disable` comment in the HTML (requires the processor to be active):

```html
<!-- eslint-disable mso-conditionals/matching-mso-endif -->
```
