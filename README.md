# eslint-plugin-mso-conditionals

ESLint plugin for validating **MSO (Outlook) conditional comments** in HTML email.

Extracts `<!--[if mso]>` … `<![endif]-->` blocks from HTML files and lints them for valid syntax and matched pairs using a custom processor and AST parser.

## Installation

```bash
npm install eslint-plugin-mso-conditionals --save-dev
```

Requires ESLint 9+ (flat config) and Node.js 18+.

## Quick Start

```js
// eslint.config.js
import msoConditionals from 'eslint-plugin-mso-conditionals';

export default [
  ...msoConditionals.configs.recommended,
];
```

This lints MSO conditional comments inside `**/*.html`, `**/*.amp`, and `**/*.ampscript` files.

## VS Code Setup

To see `eslint(mso-conditionals/...)` diagnostics inline in VS Code, the [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) must be configured to validate HTML files:

```json
{
  "eslint.validate": ["html", "javascript"]
}
```

The [MSO Conditional Comments](https://marketplace.visualstudio.com/items?itemName=joernberkefeld.mso-conditionals) VS Code extension provides the same diagnostics without requiring ESLint. Use this plugin when you want linting in CI or in editors other than VS Code.

## Rules

| Rule | Default | Description |
|---|---|---|
| [`mso-conditionals/valid-mso-condition`](docs/rules/valid-mso-condition.md) | `error` | Validate MSO condition syntax — correct keyword, operator, and version |
| [`mso-conditionals/matching-mso-endif`](docs/rules/matching-mso-endif.md) | `error` | Ensure every opener has a matching `[endif]` and vice versa |

## Processor

| Processor | Files | Purpose |
|---|---|---|
| `mso-conditionals/html` | `**/*.html`, `**/*.amp`, `**/*.ampscript` | Extracts MSO conditional comment strings for linting |

The processor emits a virtual `.mso` file per source file containing one MSO comment per line, preserving line offsets so reported locations map back to the original file.

## Config

### `msoConditionals.configs.recommended`

An array of two flat config objects:

1. **Processor config** — registers `mso-conditionals/html` on HTML/AMP files.
2. **Rules config** — applies `valid-mso-condition` and `matching-mso-endif` at `error` severity on the extracted `.mso` virtual files.

Spread it in your config:

```js
export default [
  ...msoConditionals.configs.recommended,
  // your other rules...
];
```

To adjust severity, override individual rules after spreading:

```js
export default [
  ...msoConditionals.configs.recommended,
  {
    rules: {
      'mso-conditionals/matching-mso-endif': 'warn',
    },
  },
];
```

## License

MIT
