# Angular Signal Forms Lab

An interactive demo app showcasing the experimental **Signal Forms** API (`@angular/forms/signals`) introduced in Angular 21. Each route is a self-contained example that can be used for reference snippet.

## Stack

- **Angular 21** with standalone components and `ChangeDetectionStrategy.OnPush` throughout
- **`@angular/forms/signals`** — the experimental signal-based forms API
- **Tailwind CSS v4** for styling
- **Vitest** for unit tests

## Running locally

```bash
pnpm install
pnpm start        # ng serve → http://localhost:4200
```

## Examples

| Route | What it shows |
|---|---|
| `/login-basics` | Signal model + `form()` + `[formField]` binding |
| `/built-in-validation` | `required`, `email`, `minLength`, `maxLength`, `min`, `max`, `pattern` |
| `/custom-validator` | Writing a custom `validate()` rule |
| `/field-logic` | `disabled()`, `hidden()`, `readonly()` reactive rules |
| `/password-match` | Cross-field validation reading a sibling value |
| `/budget-allocation` | Group validation with `validateTree()` |
| `/reusable-schema` | Composable schemas with `schema()` + `apply()` |
| `/conditional-schema` | Switching required fields on a union with `applyWhenValue()` |
| `/array-items` | Per-item rules on growing arrays with `applyEach()` |
| `/async-username` | Async availability check with `validateAsync()` |
| `/metadata-hints` | Reactive helper text via `metadata()` |
| `/custom-control` | A component implementing `FormValueControl<T>` |
| `/submission` | `FormRoot` + `submit()` + submitting state |
| `/server-errors` | Attaching server errors to specific fields |
| `/nested-components` | One form split across three child components via `FieldTree<T>` inputs |
| `/compat-form` | Bridging a `FormControl` into a signal form with `compatForm()` |
| `/signal-form-control` | Dropping a `SignalFormControl` into an existing `FormGroup` |
| `/template-migration` | Side-by-side: `ngModel` → signal model |

## Project structure

```
src/app/
├── examples/
│   ├── nested-components.component.ts   ← root page for the nested-components example
│   ├── nested-components/
│   │   ├── personal-section.component.ts
│   │   ├── address-section.component.ts
│   │   └── account-section.component.ts
│   ├── demo-utils.ts                    ← shared errorMessage helper
│   └── *.component.ts                   ← one file per example
├── app.routes.ts                        ← lazy-loaded routes
├── demo-nav.ts                          ← sidebar nav metadata
└── app.ts / app.html                    ← shell
```

## Key API surface

```ts
// Create a form from a signal model
const myForm = form(myModel, (path) => {
  required(path.name);
  email(path.email);
  minLength(path.password, 8);
});

// Bind in the template
<input [formField]="myForm.email" />

// Read reactive state
myForm.email().valid()
myForm.email().errors()
myForm().valid()

// Pass a section to a child component
readonly section = input.required<FieldTree<AddressInfo>>();
<input [formField]="section().street" />
```

## Building

```bash
pnpm run build    # production build → dist/
```

## Tests

```bash
pnpm test         # vitest
```
