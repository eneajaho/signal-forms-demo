import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FormField, email, required } from '@angular/forms/signals';
import { compatForm } from '@angular/forms/signals/compat';
import { errorMessage } from './demo-utils';

@Component({
  selector: 'app-compat-form',
  imports: [FormField, JsonPipe],
  template: `
    <div class="demo-page">
      <section class="demo-hero">
        <div class="h-2 bg-gradient-to-r from-stone-600 to-zinc-900"></div>
        <div class="p-6 md:p-8">
          <p class="demo-label">Migration</p>
          <h1 class="mt-3 text-4xl font-black md:text-6xl">Keep a legacy FormControl.</h1>
          <p class="mt-4 max-w-3xl text-lg font-semibold leading-8 text-zinc-600">
            compatForm proxies reactive controls into the signal field tree while the rest of the model can be plain data.
          </p>
        </div>
      </section>

      <section class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <form class="demo-panel grid gap-5">
          <label class="grid gap-2">
            <span class="demo-label">New signal field</span>
            <input class="demo-input" type="email" [formField]="userForm.email" />
            @for (error of userForm.email().errors(); track $index) {
              <span class="demo-error">{{ message(error) }}</span>
            }
          </label>

          <label class="grid gap-2">
            <span class="demo-label">Existing FormControl</span>
            <input class="demo-input" type="password" [formField]="userForm.password" />
            @if (legacyPasswordControl.touched && legacyPasswordControl.invalid) {
              <span class="demo-error">Legacy validators still run: required + minLength(8).</span>
            }
          </label>

          <button class="demo-ghost-button justify-self-start" type="button" (click)="legacyPasswordControl.setValue('legacy123')">
            Set legacy control
          </button>
        </form>

        <aside class="grid gap-4">
          <div class="demo-panel">
            <p class="demo-label">Compat field state</p>
            <div class="mt-3 grid gap-2 text-sm font-bold">
              <p>Password value: {{ userForm.password().value() }}</p>
              <p>Password valid: {{ userForm.password().valid() }}</p>
              <p>Control status: {{ userForm.password().control().status }}</p>
            </div>
          </div>

          <div class="demo-panel">
            <p class="demo-label">Signal model</p>
            <pre class="demo-code mt-3">{{ modelSnapshot() | json }}</pre>
          </div>
        </aside>
      </section>
    </div>
  `,
})
export class CompatFormComponent {
  protected readonly legacyPasswordControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(8)],
  });

  protected readonly userModel = signal({
    email: '',
    password: this.legacyPasswordControl,
  });

  protected readonly userForm = compatForm(this.userModel, (path) => {
    required(path.email, { message: 'Email is required.' });
    email(path.email, { message: 'Enter a valid email.' });
  });

  protected readonly message = errorMessage;

  protected modelSnapshot() {
    return {
      email: this.userModel().email,
      passwordControlValue: this.legacyPasswordControl.value,
      passwordControlStatus: this.legacyPasswordControl.status,
    };
  }
}
