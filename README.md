# eslint-plugin-mso-email

ESLint plugin for **Outlook/HTML email** markup: MSO conditional comments, Outlook CSS properties, VML namespaces, and layout table accessibility.

Extracts conditional comments into a virtual file for AST-based rules, and lints full HTML documents for MSO CSS, VML, and table semantics.

## Installation

```bash
npm install eslint-plugin-mso-email --save-dev
```

Requires ESLint 9+ (flat config) and Node.js 18+.

## Quick Start

```js
// eslint.config.js
import mso from 'eslint-plugin-mso-email';

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

All rules use the `mso/` plugin prefix.

| Rule | Default | Fixable | Description |
|---|---|---|---|
| [`mso/valid-mso-condition`](docs/rules/valid-mso-condition.md) | error | partial (deterministic typos) | Validate MSO conditional opener syntax |
| [`mso/matching-mso-endif`](docs/rules/matching-mso-endif.md) | error | no | Match openers and `[endif]` closers |
| [`mso/matching-mso-endif-type`](docs/rules/matching-mso-endif-type.md) | warn | yes | Match closer variant to opener style |
| [`mso/no-unknown-mso-property`](docs/rules/no-unknown-mso-property.md) | warn | partial (typo hints) | Disallow unknown `mso-*` CSS properties |
| [`mso/vml-requires-namespace`](docs/rules/vml-requires-namespace.md) | warn | yes | Require `xmlns:*` on `html` when using VML |
| [`mso/no-unknown-vml-tag`](docs/rules/no-unknown-vml-tag.md) | warn | yes | Disallow unknown VML tag names |
| [`mso/no-unknown-vml-attribute`](docs/rules/no-unknown-vml-attribute.md) | warn | partial (typo hints) | Disallow unknown VML attributes |
| [`mso/table-presentation-role`](docs/rules/table-presentation-role.md) | warn | yes | Require `role="presentation"` on layout tables |

**Fixable legend**

| Value | Meaning |
|---|---|
| **yes** | ESLint can auto-fix every reported violation for that rule (with default options). |
| **partial (deterministic typos)** | Auto-fix only when the parser returns a single deterministic replacement for the condition substring (for example `mos` → `mso`). Invalid operators, unknown versions, and ambiguous conditions are reported without a fix. |
| **partial (typo hints)** | Auto-fix only when the property, tag, or attribute name has a close allowlist match within edit distance. Unknown names with no hint are still reported, but not auto-fixed. |
| **no** | Report only — inserting or removing structural comment markers is unsafe. |

## Migration from eslint-plugin-mso-conditionals

```js
// Before
import msoConditionals from 'eslint-plugin-mso-conditionals';

// After
import mso from 'eslint-plugin-mso-email';
```

Replace rule IDs `mso-conditionals/…` with `mso/…`.

## License

MIT
