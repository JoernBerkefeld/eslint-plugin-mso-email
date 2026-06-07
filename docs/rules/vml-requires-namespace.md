# `mso/vml-requires-namespace`

**Category:** problem  
**Default severity:** `warn`  
**Fixable:** yes

When the document uses VML or Office XML tags with prefixes `v:`, `o:`, or `w:`, requires matching `xmlns:*` declarations on the opening `<html>` tag.

## Fragment policy

If there is **no** `<html>` root (common for email partials), the rule does not report and does not apply a fix.

## What the fix changes

Inserts missing namespace declarations on the `<html>` open tag (standard URIs for each prefix). One diagnostic per missing prefix; fixes can add multiple declarations when several prefixes are used.

## Examples

### Correct

```html
<html xmlns:v="urn:schemas-microsoft-com:vml">
  <body><v:rect></v:rect></body>
</html>
```

### Incorrect

```html
<html>
  <body><v:rect></v:rect></body>
</html>
```

Auto-fix adds `xmlns:v="urn:schemas-microsoft-com:vml"` to `<html>`.

## When to disable

```js
// eslint.config.js
{
  rules: {
    'mso/vml-requires-namespace': 'off',
  },
}
```
