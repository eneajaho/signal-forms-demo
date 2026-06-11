import { JsonPipe } from '@angular/common';
import { Component, resource, signal } from '@angular/core';
import {
  FormField,
  debounce,
  form as signalForm,
  minLength,
  required,
  validateAsync,
} from '@angular/forms/signals';
import { errorMessage, wait } from './demo-utils';

interface UsernameResult {
  username: string;
  taken: boolean;
  suggestions: string[];
}

@Component({
  selector: 'app-async-username',
  imports: [FormField, JsonPipe],
  template: `
    <div class="demo-page">
      <section class="demo-hero">
        <div class="h-2 bg-gradient-to-r from-blue-500 to-slate-700"></div>
        <div class="p-6 md:p-8">
          <p class="demo-label">Async</p>
          <h1 class="mt-3 text-4xl font-black md:text-6xl">Is this username taken?</h1>
          <p class="mt-4 max-w-3xl text-lg font-semibold leading-8 text-zinc-600">
            validateAsync waits for sync rules, runs a resource, and exposes pending state.
          </p>
        </div>
      </section>

      <section class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <form class="demo-panel grid gap-5">
          <label class="grid gap-2">
            <span class="demo-label">Username</span>
            <input class="demo-input" placeholder="try angular, admin, signals" [formField]="signupForm.username" />
          </label>

          @if (signupForm.username().pending()) {
            <p class="rounded-sm border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-bold text-blue-800">
              Checking availability...
            </p>
          }

          @if (signupForm.username().touched()) {
            @for (error of signupForm.username().errors(); track $index) {
              <p class="demo-error">{{ message(error) }}</p>
            }
          }

          @if (signupForm.username().valid()) {
            <p class="demo-ok">{{ signupForm.username().value() }} is available.</p>
          }
        </form>

        <aside class="grid gap-4">
          <div class="demo-panel">
            <p class="demo-label">Try these</p>
            <div class="mt-3 flex flex-wrap gap-2">
              @for (name of takenNamesList; track name) {
                <button class="demo-ghost-button" type="button" (click)="signupForm.username().value.set(name)">{{ name }}</button>
              }
              <button class="demo-ghost-button" type="button" (click)="signupForm.username().value.set('formwizard')">formwizard</button>
            </div>
          </div>

          <div class="demo-panel">
            <p class="demo-label">Field state</p>
            <pre class="demo-code mt-3">{{ stateSnapshot() | json }}</pre>
          </div>
        </aside>
      </section>
    </div>
  `,
})
export class AsyncUsernameComponent {
  protected readonly takenNames = new Set(['admin', 'root', 'angular', 'signals']);
  protected readonly takenNamesList = [...this.takenNames];
  protected readonly signupModel = signal({ username: 'angular' });

  protected readonly signupForm = signalForm(this.signupModel, (path) => {
    required(path.username, { message: 'Choose a username.' });
    minLength(path.username, 3, { message: 'Use at least 3 characters.' });
    debounce(path.username, 350);
    validateAsync(path.username, {
      params: ({ value }) => value().trim().toLowerCase(),
      factory: (params) =>
        resource<UsernameResult, string | undefined>({
          params,
          loader: async ({ params: username, abortSignal }) => {
            await wait(750, abortSignal);
            const name = username ?? '';

            return {
              username: name,
              taken: this.takenNames.has(name),
              suggestions: [`${name}-dev`, `${name}-hq`, `${name}-forms`],
            };
          },
        }),
      onSuccess: (result) =>
        result.taken
          ? {
              kind: 'taken',
              message: `${result.username} is already taken. Try ${result.suggestions[0]}.`,
            }
          : null,
      onError: () => ({ kind: 'network', message: 'Could not check the username right now.' }),
    });
  });

  protected readonly message = errorMessage;

  protected stateSnapshot() {
    return {
      value: this.signupForm.username().value(),
      pending: this.signupForm.username().pending(),
      valid: this.signupForm.username().valid(),
      invalid: this.signupForm.username().invalid(),
      errors: this.signupForm.username().errors().map((error) => ({
        kind: error.kind,
        message: error.message,
      })),
    };
  }
}
