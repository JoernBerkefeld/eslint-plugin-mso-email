# `mso/matching-mso-endif`

**Category:** problem  
**Default severity:** `error`  
**Fixable:** no

Ensures every MSO conditional comment opener is closed by a matching `[endif]`, and every `[endif]` closer has a corresponding opener. Unmatched pairs cause Outlook to misinterpret layout.

Inserting or deleting `[endif]` markers without author intent is unsafe, so this rule is **report only**.

## What counts as an opener

- `<!--[if mso]>` — standard conditional comment
- `<!--[if gte mso 14]><!--` — downlevel-hidden variant
- `<![if mso]>` — non-standard short form

## What counts as a closer

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
  <p>Hidden from Outlook 2010+</p>
<!--<![endif]-->
```

Nested pairs:

```html
<!--[if mso]>
  <!--[if gte mso 14]>
    <p>Outlook 2010+</p>
  <![endif]-->
<![endif]-->
```

### Incorrect

Missing closer:

```html
<!--[if mso]>
  <p>Outlook content</p>
```

Closer without opener:

```html
<p>Regular content</p>
<![endif]-->
```

## When to disable

```js
// eslint.config.js
{
  rules: {
    'mso/matching-mso-endif': 'warn',
  },
}
```

Per-file disable in HTML (requires the processor):

```html
<!-- eslint-disable mso/matching-mso-endif -->
```
