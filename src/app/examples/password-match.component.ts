import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormField, form as signalForm, minLength, required, validate } from '@angular/forms/signals';
import { errorMessage } from './demo-utils';

@Component({
  selector: 'app-password-match',
  imports: [FormField, JsonPipe],
  template: `
    <div class="demo-page">
      <section class="demo-hero">
        <div class="h-2 bg-gradient-to-r from-indigo-500 to-violet-600"></div>
        <div class="p-6 md:p-8">
          <p class="demo-label">Cross-field</p>
          <h1 class="mt-3 text-4xl font-black md:text-6xl">Passwords must match.</h1>
          <p class="mt-4 max-w-3xl text-lg font-semibold leading-8 text-zinc-600">
            The confirm field reads the password value from inside the schema with valueOf().
          </p>
        </div>
      </section>

      <section class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <form class="demo-panel grid gap-5">
          <label class="grid gap-2">
            <span class="demo-label">Password</span>
            <input class="demo-input" type="password" [formField]="passwordForm.password" />
            @if (passwordForm.password().touched()) {
              @for (error of passwordForm.password().errors(); track $index) {
                <span class="demo-error">{{ message(error) }}</span>
              }
            }
          </label>

          <label class="grid gap-2">
            <span class="demo-label">Confirm password</span>
            <input class="demo-input" type="password" [formField]="passwordForm.confirmPassword" />
            @if (passwordForm.confirmPassword().touched()) {
              @for (error of passwordForm.confirmPassword().errors(); track $index) {
                <span class="demo-error">{{ message(error) }}</span>
              }
            }
          </label>

          @if (passwordForm().valid()) {
            <p class="demo-ok">Both fields are valid and match.</p>
          }
        </form>

        <aside class="grid gap-4">
          <div class="demo-panel">
            <p class="demo-label">Cross-field status</p>
            <div class="mt-3 grid gap-2 text-sm font-bold">
              <p>Password touched: {{ passwordForm.password().touched() }}</p>
              <p>Confirm invalid: {{ passwordForm.confirmPassword().invalid() }}</p>
              <p>Form valid: {{ passwordForm().valid() }}</p>
            </div>
          </div>

          <div class="demo-panel">
            <p class="demo-label">Model</p>
            <pre class="demo-code mt-3">{{ passwordModel() | json }}</pre>
          </div>
        </aside>
      </section>
    </div>
  `,
})
export class PasswordMatchComponent {
  protected readonly passwordModel = signal({ password: '', confirmPassword: '' });
  protected readonly passwordForm = signalForm(this.passwordModel, (path) => {
    required(path.password, { message: 'Password is required.' });
    minLength(path.password, 8, { message: 'Use at least 8 characters.' });
    required(path.confirmPassword, { message: 'Confirm the password.' });
    validate(path.confirmPassword, ({ value, valueOf }) => {
      const password = valueOf(path.password);
      const confirmation = value();

      if (!password || !confirmation) {
        return null;
      }

      return confirmation === password
        ? null
        : { kind: 'mismatch', message: 'Passwords do not match.' };
    });
  });
  protected readonly message = errorMessage;
}
