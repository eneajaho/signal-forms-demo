import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  FormField,
  createMetadataKey,
  form as signalForm,
  metadata,
  minLength,
  required,
} from '@angular/forms/signals';
import { errorMessage } from './demo-utils';

const USERNAME_HELP = createMetadataKey<string>();

@Component({
  selector: 'app-metadata-hints',
  imports: [FormField, JsonPipe],
  template: `
    <div class="demo-page">
      <section class="demo-hero">
        <div class="h-2 bg-gradient-to-r from-yellow-500 to-amber-600"></div>
        <div class="p-6 md:p-8">
          <p class="demo-label">Metadata</p>
          <h1 class="mt-3 text-4xl font-black md:text-6xl">Fields can carry reactive data.</h1>
          <p class="mt-4 max-w-3xl text-lg font-semibold leading-8 text-zinc-600">
            Metadata is useful for hints, severity, previews, or anything else the UI needs.
          </p>
        </div>
      </section>

      <section class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <form class="demo-panel grid gap-5">
          <label class="grid gap-2">
            <span class="demo-label">Username</span>
            <input class="demo-input" placeholder="formshero" [formField]="usernameForm.username" />
            <span class="rounded-sm bg-amber-50 px-3 py-2 text-sm font-black text-amber-900">{{ helpText() }}</span>
          </label>

          @if (usernameForm.username().touched()) {
            @for (error of usernameForm.username().errors(); track $index) {
              <p class="demo-error">{{ message(error) }}</p>
            }
          }
        </form>

        <aside class="grid gap-4">
          <div class="demo-panel">
            <p class="demo-label">Metadata read</p>
            <p class="mt-3 text-2xl font-black leading-tight">{{ helpText() }}</p>
          </div>

          <div class="demo-panel">
            <p class="demo-label">Model</p>
            <pre class="demo-code mt-3">{{ usernameModel() | json }}</pre>
          </div>
        </aside>
      </section>
    </div>
  `,
})
export class MetadataHintsComponent {
  protected readonly usernameModel = signal({ username: '' });
  protected readonly usernameForm = signalForm(this.usernameModel, (path) => {
    required(path.username, { message: 'Username is required.' });
    minLength(path.username, 3, { message: 'Use at least 3 characters.' });
    metadata(path.username, USERNAME_HELP, ({ value }) => {
      if (value().length === 0) {
        return 'Pick a memorable username.';
      }

      if (value().length < 3) {
        return 'At least 3 characters.';
      }

      return 'Looks polished.';
    });
  });

  protected readonly message = errorMessage;

  protected helpText(): string {
    return this.usernameForm.username().metadata(USERNAME_HELP)?.() ?? '';
  }
}
