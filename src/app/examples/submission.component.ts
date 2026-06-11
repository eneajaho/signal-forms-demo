import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormField, FormRoot, email, form as signalForm, minLength, required } from '@angular/forms/signals';
import { errorMessage, wait } from './demo-utils';

@Component({
  selector: 'app-submission',
  imports: [FormField, FormRoot, JsonPipe],
  template: `
    <div class="demo-page">
      <section class="demo-hero">
        <div class="h-2 bg-gradient-to-r from-violet-500 to-indigo-700"></div>
        <div class="p-6 md:p-8">
          <p class="demo-label">Submission</p>
          <h1 class="mt-3 text-4xl font-black md:text-6xl">submit() handles the boring parts.</h1>
          <p class="mt-4 max-w-3xl text-lg font-semibold leading-8 text-zinc-600">
            FormRoot prevents default, marks fields as touched, skips invalid actions, and tracks submitting.
          </p>
        </div>
      </section>

      <section class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <form class="demo-panel grid gap-5" [formRoot]="loginForm">
          <label class="grid gap-2">
            <span class="demo-label">Email</span>
            <input class="demo-input" type="email" placeholder="demo@angular.dev" [formField]="loginForm.email" />
            @if (loginForm.email().touched()) {
              @for (error of loginForm.email().errors(); track $index) {
                <span class="demo-error">{{ message(error) }}</span>
              }
            }
          </label>

          <label class="grid gap-2">
            <span class="demo-label">Password</span>
            <input class="demo-input" type="password" placeholder="password123" [formField]="loginForm.password" />
            @if (loginForm.password().touched()) {
              @for (error of loginForm.password().errors(); track $index) {
                <span class="demo-error">{{ message(error) }}</span>
              }
            }
          </label>

          <button class="demo-button" type="submit" [disabled]="loginForm().submitting()">
            {{ loginForm().submitting() ? 'Signing in...' : 'Sign in' }}
          </button>
        </form>

        <aside class="grid gap-4">
          <div class="demo-panel">
            <p class="demo-label">Result</p>
            <p class="mt-3 text-2xl font-black leading-tight">{{ result() }}</p>
          </div>

          <div class="demo-panel">
            <p class="demo-label">Submitting</p>
            <p class="mt-3 text-6xl font-black">{{ loginForm().submitting() }}</p>
          </div>

          <div class="demo-panel">
            <p class="demo-label">Model</p>
            <pre class="demo-code mt-3">{{ loginModel() | json }}</pre>
          </div>
        </aside>
      </section>
    </div>
  `,
})
export class SubmissionComponent {
  protected readonly result = signal('Submit with an invalid form first; the action will not run.');
  protected readonly loginModel = signal({ email: '', password: '' });
  protected readonly loginForm = signalForm(
    this.loginModel,
    (path) => {
      required(path.email, { message: 'Email is required.' });
      email(path.email, { message: 'Enter a valid email.' });
      required(path.password, { message: 'Password is required.' });
      minLength(path.password, 8, { message: 'Use at least 8 characters.' });
    },
    {
      submission: {
        action: async () => {
          this.result.set('Authenticating...');
          await wait(900);
          this.result.set(`Signed in as ${this.loginModel().email}.`);
        },
        onInvalid: () => {
          this.result.set('The form is invalid, so the action was skipped.');
        },
      },
    },
  );
  protected readonly message = errorMessage;
}
