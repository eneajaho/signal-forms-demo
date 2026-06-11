import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./examples/overview.component').then((m) => m.OverviewComponent),
  },
  {
    path: 'login-basics',
    loadComponent: () =>
      import('./examples/login-basics.component').then((m) => m.LoginBasicsComponent),
  },
  {
    path: 'built-in-validation',
    loadComponent: () =>
      import('./examples/built-in-validation.component').then((m) => m.BuiltInValidationComponent),
  },
  {
    path: 'custom-validator',
    loadComponent: () =>
      import('./examples/custom-validator.component').then((m) => m.CustomValidatorComponent),
  },
  {
    path: 'field-logic',
    loadComponent: () =>
      import('./examples/field-logic.component').then((m) => m.FieldLogicComponent),
  },
  {
    path: 'password-match',
    loadComponent: () =>
      import('./examples/password-match.component').then((m) => m.PasswordMatchComponent),
  },
  {
    path: 'budget-allocation',
    loadComponent: () =>
      import('./examples/budget-allocation.component').then((m) => m.BudgetAllocationComponent),
  },
  {
    path: 'reusable-schema',
    loadComponent: () =>
      import('./examples/reusable-schema.component').then((m) => m.ReusableSchemaComponent),
  },
  {
    path: 'conditional-schema',
    loadComponent: () =>
      import('./examples/conditional-schema.component').then((m) => m.ConditionalSchemaComponent),
  },
  {
    path: 'array-items',
    loadComponent: () =>
      import('./examples/array-items.component').then((m) => m.ArrayItemsComponent),
  },
  {
    path: 'async-username',
    loadComponent: () =>
      import('./examples/async-username.component').then((m) => m.AsyncUsernameComponent),
  },
  {
    path: 'metadata-hints',
    loadComponent: () =>
      import('./examples/metadata-hints.component').then((m) => m.MetadataHintsComponent),
  },
  {
    path: 'custom-control',
    loadComponent: () =>
      import('./examples/custom-control.component').then((m) => m.CustomControlComponent),
  },
  {
    path: 'submission',
    loadComponent: () =>
      import('./examples/submission.component').then((m) => m.SubmissionComponent),
  },
  {
    path: 'server-errors',
    loadComponent: () =>
      import('./examples/server-errors.component').then((m) => m.ServerErrorsComponent),
  },
  {
    path: 'compat-form',
    loadComponent: () =>
      import('./examples/compat-form.component').then((m) => m.CompatFormComponent),
  },
  {
    path: 'signal-form-control',
    loadComponent: () =>
      import('./examples/signal-form-control.component').then((m) => m.SignalFormControlComponent),
  },
  {
    path: 'template-migration',
    loadComponent: () =>
      import('./examples/template-migration.component').then((m) => m.TemplateMigrationComponent),
  },
  {
    path: 'nested-components',
    loadComponent: () =>
      import('./examples/nested-components.component').then((m) => m.NestedComponentsComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
