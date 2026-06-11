import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  FormField,
  email,
  form as signalForm,
  max,
  maxLength,
  min,
  minLength,
  pattern,
  required,
} from '@angular/forms/signals';
import { errorMessage } from './demo-utils';

@Component({
  selector: 'app-built-in-validation',
  imports: [FormField, JsonPipe],
  template: `
    <div class="demo-page">
      <section class="demo-hero">
        <div class="h-2 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
        <div class="p-6 md:p-8">
          <p class="demo-label">Validation</p>
          <h1 class="mt-3 text-4xl font-black md:text-6xl">Built-ins bind to paths.</h1>
          <p class="mt-4 max-w-3xl text-lg font-semibold leading-8 text-zinc-600">
            Type the bad values on purpose. The schema runs automatically and the form root
            aggregates child state.
          </p>
        </div>
      </section>

      <section class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <form class="demo-panel grid gap-5">
          <div class="grid gap-4 md:grid-cols-2">
            <label class="grid gap-2">
              <span class="demo-label">Email</span>
              <input
                class="demo-input"
                type="email"
                placeholder="speaker@angular.dev"
                [formField]="profileForm.email"
              />
              @if (profileForm.email().touched()) {
                @for (error of profileForm.email().errors(); track $index) {
                  <span class="demo-error">{{ message(error) }}</span>
                }
              }
            </label>

            <label class="grid gap-2">
              <span class="demo-label">Password</span>
              <input
                class="demo-input"
                type="password"
                placeholder="at least 8"
                [formField]="profileForm.password"
              />
              @if (profileForm.password().touched()) {
                @for (error of profileForm.password().errors(); track $index) {
                  <span class="demo-error">{{ message(error) }}</span>
                }
              }
            </label>
          </div>

          <label class="grid gap-2">
            <span class="demo-label">Bio</span>
            <textarea
              class="demo-input min-h-28"
              placeholder="500 characters max"
              [formField]="profileForm.bio"
            ></textarea>
            <span class="text-sm font-bold text-zinc-500"
              >{{ profileForm.bio().value().length }}/500</span
            >
            @if (profileForm.bio().touched()) {
              @for (error of profileForm.bio().errors(); track $index) {
                <span class="demo-error">{{ message(error) }}</span>
              }
            }
          </label>

          <div class="grid gap-4 md:grid-cols-2">
            <label class="grid gap-2">
              <span class="demo-label">Phone</span>
              <input
                class="demo-input"
                placeholder="555-123-4567"
                [formField]="profileForm.phone"
              />
              @if (profileForm.phone().touched()) {
                @for (error of profileForm.phone().errors(); track $index) {
                  <span class="demo-error">{{ message(error) }}</span>
                }
              }
            </label>

            <label class="grid gap-2">
              <span class="demo-label">Age</span>
              <input class="demo-input" type="number" [formField]="profileForm.age" />
              @if (profileForm.age().touched()) {
                @for (error of profileForm.age().errors(); track $index) {
                  <span class="demo-error">{{ message(error) }}</span>
                }
              }
            </label>
          </div>
        </form>

        <aside class="grid gap-4">
          <div class="demo-panel">
            <p class="demo-label">Aggregate state</p>
            <div class="mt-3 grid grid-cols-2 gap-3">
              <div class="rounded-sm bg-emerald-50 p-3">
                <p class="text-xs font-black uppercase text-emerald-700">Valid</p>
                <p class="text-2xl font-black">{{ profileForm().valid() }}</p>
              </div>
              <div class="rounded-sm bg-red-50 p-3">
                <p class="text-xs font-black uppercase text-red-700">Invalid</p>
                <p class="text-2xl font-black">{{ profileForm().invalid() }}</p>
              </div>
            </div>
          </div>

          <div class="demo-panel">
            <p class="demo-label">Model</p>
            <pre class="demo-code mt-3">{{ profileModel() | json }}</pre>
          </div>
        </aside>
      </section>
    </div>
  `,
})
export class BuiltInValidationComponent {
  protected readonly profileModel = signal({
    email: '',
    password: '',
    bio: '',
    phone: '',
    age: 16,
  });

  protected readonly profileForm = signalForm(this.profileModel, (path) => {
    required(path.email, { message: 'Email is required.' });
    email(path.email, { message: 'Enter a valid email address.' });
    required(path.password, { message: 'Password is required.' });
    minLength(path.password, 8, { message: 'Password must be at least 8 characters.' });
    maxLength(path.bio, 500, { message: 'Keep the bio under 500 characters.' });
    pattern(path.phone, /^\d{3}-\d{3}-\d{4}$/, { message: 'Use 555-123-4567 format.' });
    min(path.age, 18, { message: 'Must be at least 18.' });
    max(path.age, 120, { message: 'That age looks too high.' });
  });

  protected readonly message = errorMessage;
}
