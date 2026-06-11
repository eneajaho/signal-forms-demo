import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormField, FormRoot, form, minLength, required } from '@angular/forms/signals';
import { errorMessage, wait } from './demo-utils';

@Component({
  selector: 'app-server-errors',
  imports: [FormField, FormRoot, JsonPipe],
  template: `
    <div class="demo-page">
      <section class="demo-hero">
        <div class="h-2 bg-gradient-to-r from-red-500 to-rose-700"></div>
        <div class="p-6 md:p-8">
          <p class="demo-label">Submission</p>
          <h1 class="mt-3 text-4xl font-black md:text-6xl">Server errors land on fields.</h1>
          <p class="mt-4 max-w-3xl text-lg font-semibold leading-8 text-zinc-600">
            Return an error with fieldTree and Signal Forms attaches it to the exact field.
          </p>
        </div>
      </section>

      <section class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <form class="demo-panel grid gap-5" [formRoot]="registrationForm">
          <label class="grid gap-2">
            <span class="demo-label">Username</span>
            <input
              class="demo-input"
              placeholder="try enea, admin, or a new name"
              [formField]="registrationForm.username"
            />
            @if (registrationForm.username().touched()) {
              @for (error of registrationForm.username().errors(); track $index) {
                <span class="demo-error">{{ message(error) }}</span>
              }
            }
          </label>

          <label class="grid gap-2">
            <span class="demo-label">Password</span>
            <input class="demo-input" type="password" [formField]="registrationForm.password" />
            @if (registrationForm.password().touched()) {
              @for (error of registrationForm.password().errors(); track $index) {
                <span class="demo-error">{{ message(error) }}</span>
              }
            }
          </label>

          <button class="demo-button" type="submit" [disabled]="registrationForm().submitting()">
            {{ registrationForm().submitting() ? 'Creating account...' : 'Create account' }}
          </button>
        </form>

        <aside class="grid gap-4">
          <div class="demo-panel">
            <p class="demo-label">Reserved usernames</p>
            <p class="mt-3 text-lg font-black">{{ reservedNamesText }}</p>
          </div>

          <div class="demo-panel">
            <p class="demo-label">Result</p>
            <p class="mt-3 text-2xl font-black leading-tight">{{ result() }}</p>
          </div>

          <div class="demo-panel">
            <p class="demo-label">Model</p>
            <pre class="demo-code mt-3">{{ registrationModel() | json }}</pre>
          </div>
        </aside>
      </section>
    </div>
  `,
})
export class ServerErrorsComponent {
  protected readonly reservedNames = new Set(['enea', 'admin', 'angular']);
  protected readonly reservedNamesText = [...this.reservedNames].join(', ');
  protected readonly result = signal('Submit a reserved username to see a server error.');
  protected readonly registrationModel = signal({ username: 'enea', password: 'password123' });

  protected readonly registrationForm = form(
    this.registrationModel,
    (path) => {
      required(path.username, { message: 'Username is required.' });
      required(path.password, { message: 'Password is required.' });
      minLength(path.password, 8, { message: 'Use at least 8 characters.' });
    },
    {
      submission: {
        action: async (field) => {
          this.result.set('Talking to the server...');
          await wait(800);
          const username = this.registrationModel().username.trim().toLowerCase();

          if (this.reservedNames.has(username)) {
            this.result.set('The server rejected the username.');
            return {
              fieldTree: field.username,
              kind: 'server',
              message: `"${username}" is already taken on the server.`,
            };
          }

          this.result.set(`Created account for ${username}.`);
          return undefined;
        },
      },
    },
  );
  protected readonly message = errorMessage;
}
