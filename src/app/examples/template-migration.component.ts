import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormField, email, form as signalForm, min, required } from '@angular/forms/signals';
import { errorMessage } from './demo-utils';

@Component({
  selector: 'app-template-migration',
  imports: [FormField, FormsModule, JsonPipe],
  template: `
    <div class="demo-page">
      <section class="demo-hero">
        <div class="h-2 bg-gradient-to-r from-purple-500 to-sky-600"></div>
        <div class="p-6 md:p-8">
          <p class="demo-label">Migration</p>
          <h1 class="mt-3 text-4xl font-black md:text-6xl">From ngModel to schema.</h1>
          <p class="mt-4 max-w-3xl text-lg font-semibold leading-8 text-zinc-600">
            Two-way binding stays familiar, but validation moves into typed Signal Forms rules.
          </p>
        </div>
      </section>

      <section class="grid gap-6 xl:grid-cols-2">
        <form class="demo-panel grid gap-4" #legacyForm="ngForm">
          <p class="demo-label">Before: template-driven</p>
          <label class="grid gap-2">
            <span class="demo-label">Email</span>
            <input
              class="demo-input"
              name="legacyEmail"
              type="email"
              required
              email
              [(ngModel)]="legacyEmail"
              #legacyEmailRef="ngModel"
            />
            @if (legacyEmailRef.touched && legacyEmailRef.errors?.['email']) {
              <span class="demo-error">Invalid email via template ref string lookup.</span>
            }
          </label>

          <label class="grid gap-2">
            <span class="demo-label">Age</span>
            <input class="demo-input" name="legacyAge" type="number" min="18" [(ngModel)]="legacyAge" #legacyAgeRef="ngModel" />
            @if (legacyAgeRef.touched && legacyAgeRef.errors?.['min']) {
              <span class="demo-error">Minimum age is 18.</span>
            }
          </label>

          <pre class="demo-code">{{ legacySnapshot() | json }}</pre>
        </form>

        <form class="demo-panel grid gap-4">
          <p class="demo-label">After: signal model + schema</p>
          <label class="grid gap-2">
            <span class="demo-label">Email</span>
            <input class="demo-input" type="email" [formField]="migratedForm.email" />
            @if (migratedForm.email().touched()) {
              @for (error of migratedForm.email().errors(); track $index) {
                <span class="demo-error">{{ message(error) }}</span>
              }
            }
          </label>

          <label class="grid gap-2">
            <span class="demo-label">Age</span>
            <input class="demo-input" type="number" [formField]="migratedForm.age" />
            @if (migratedForm.age().touched()) {
              @for (error of migratedForm.age().errors(); track $index) {
                <span class="demo-error">{{ message(error) }}</span>
              }
            }
          </label>

          <pre class="demo-code">{{ migratedModel() | json }}</pre>
        </form>
      </section>
    </div>
  `,
})
export class TemplateMigrationComponent {
  protected legacyEmail = '';
  protected legacyAge = 16;
  protected readonly migratedModel = signal({ email: '', age: 16 });
  protected readonly migratedForm = signalForm(this.migratedModel, (path) => {
    required(path.email, { message: 'Email is required.' });
    email(path.email, { message: 'Enter a valid email.' });
    min(path.age, 18, { message: 'Minimum age is 18.' });
  });
  protected readonly message = errorMessage;

  protected legacySnapshot() {
    return {
      email: this.legacyEmail,
      age: this.legacyAge,
    };
  }
}
