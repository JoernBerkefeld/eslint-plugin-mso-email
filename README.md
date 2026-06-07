# eslint-plugin-mso

ESLint plugin for **Outlook/HTML email** markup: MSO conditional comments, Outlook CSS properties, VML namespaces, and layout table accessibility.

Extracts conditional comments into a virtual file for AST-based rules, and lints full HTML documents for MSO CSS, VML, and table semantics.

## Installation

```bash
npm install eslint-plugin-mso --save-dev
```

Requires ESLint 9+ (flat config) and Node.js 18+.

## Quick Start

```js
// eslint.config.js
import mso from 'eslint-plugin-mso';

export default [...mso.configs.recommended];
```

This lints `**/*.html`, `**/*.amp`, and `**/*.ampscript` files.

## VS Code Setup

Configure the [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) to validate HTML:

```json
{
  "eslint.validate": ["html", "javascript"]
}
```

The [MSO Conditional Comments](https://marketplace.visualstudio.com/items?itemName=joernberkefeld.mso-conditionals) VS Code extension provides overlapping conditional-comment diagnostics without ESLint. Use this plugin for CI and editors with ESLint.

## Rules

| Rule | Default | Fixable | Description |
|---|---|---|---|
| `mso/valid-mso-condition` | error | yes (deterministic typos) | Validate MSO conditional opener syntax |
| `mso/matching-mso-endif` | error | no | Match openers and `[endif]` closers |
| `mso/matching-mso-endif-type` | warn | yes | Match closer variant to opener style |
| `mso/no-unknown-mso-property` | warn | yes (typo hints) | Disallow unknown `mso-*` CSS properties |
| `mso/vml-requires-namespace` | warn | yes | Require `xmlns:*` on `html` when using VML |
| `mso/no-unknown-vml-tag` | warn | yes (typo hints) | Disallow unknown VML tag names |
| `mso/no-unknown-vml-attribute` | warn | yes (typo hints) | Disallow unknown VML attributes |
| `mso/table-presentation-role` | warn | yes | Require `role="presentation"` on layout tables |

Rule details (options, fix behavior, examples): [`docs/rules/`](docs/rules/README.md).

## Migration from eslint-plugin-mso-conditionals

```js
// Before
import msoConditionals from 'eslint-plugin-mso-conditionals';

// After
import mso from 'eslint-plugin-mso';
```

Replace rule IDs `mso-conditionals/…` with `mso/…`.

## License

MIT
