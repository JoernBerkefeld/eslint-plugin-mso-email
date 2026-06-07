# Rules

All rules use the `mso/` plugin prefix (for example `mso/valid-mso-condition`).

| Rule | Default | Fixable | Doc |
|---|---|---|---|
| [`mso/valid-mso-condition`](valid-mso-condition.md) | error | partial | Opener syntax validation |
| [`mso/matching-mso-endif`](matching-mso-endif.md) | error | no | Opener/closer pairing |
| [`mso/matching-mso-endif-type`](matching-mso-endif-type.md) | warn | yes | Closer variant matches opener style |
| [`mso/no-unknown-mso-property`](no-unknown-mso-property.md) | warn | yes | Unknown `mso-*` CSS properties |
| [`mso/vml-requires-namespace`](vml-requires-namespace.md) | warn | yes | `xmlns:*` on `<html>` when VML is used |
| [`mso/no-unknown-vml-tag`](no-unknown-vml-tag.md) | warn | yes | Unknown `v:` / `o:` / `w:` tag names |
| [`mso/no-unknown-vml-attribute`](no-unknown-vml-attribute.md) | warn | yes | Unknown attributes on known VML tags |
| [`mso/table-presentation-role`](table-presentation-role.md) | warn | yes | Layout tables need presentation role |

**Fixable legend**

| Value | Meaning |
|---|---|
| **yes** | ESLint can auto-fix every reported violation for that rule (with default options). |
| **partial** | Auto-fix applies only when the parser supplies a single deterministic replacement (for example `mos` → `mso`). |
| **no** | Report only — inserting or removing structural comment markers is unsafe. |
