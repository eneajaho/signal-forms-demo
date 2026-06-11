import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormField, email, required } from '@angular/forms/signals';
import { SignalFormControl } from '@angular/forms/signals/compat';
import { errorMessage } from './demo-utils';

@Component({
  selector: 'app-signal-form-control',
  imports: [FormField, JsonPipe, ReactiveFormsModule],
  template: `
    <div class="demo-page">
      <section class="demo-hero">
        <div class="h-2 bg-gradient-to-r from-cyan-600 to-emerald-700"></div>
        <div class="p-6 md:p-8">
          <p class="demo-label">Migration</p>
          <h1 class="mt-3 text-4xl font-black md:text-6xl">Drop Signal Forms into FormGroup.</h1>
          <p class="mt-4 max-w-3xl text-lg font-semibold leading-8 text-zinc-600">
            SignalFormControl lets a signal-backed field participate in existing reactive forms.
          </p>
        </div>
      </section>

      <section class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <form class="demo-panel grid gap-5" [formGroup]="profileForm">
          <label class="grid gap-2">
            <span class="demo-label">Reactive FormControl</span>
            <input class="demo-input" formControlName="name" />
          </label>

          <label class="grid gap-2">
            <span class="demo-label">SignalFormControl fieldTree</span>
            <input class="demo-input" type="email" [formField]="emailControl.fieldTree" />
            @if (emailControl.touched) {
              @for (error of emailControl.fieldTree().errors(); track $index) {
                <span class="demo-error">{{ message(error) }}</span>
              }
            }
          </label>

          <div class="flex flex-wrap gap-2">
            <button class="demo-ghost-button" type="button" (click)="patchReactive()">Patch via FormGroup</button>
            <button class="demo-ghost-button" type="button" (click)="patchSignal()">Patch via fieldTree</button>
          </div>
        </form>

        <aside class="grid gap-4">
          <div class="demo-panel">
            <p class="demo-label">Reactive form value</p>
            <pre class="demo-code mt-3">{{ profileForm.value | json }}</pre>
          </div>

          <div class="demo-panel">
            <p class="demo-label">Signal field state</p>
            <div class="mt-3 grid gap-2 text-sm font-bold">
              <p>Value: {{ emailControl.fieldTree().value() }}</p>
              <p>Valid: {{ emailControl.fieldTree().valid() }}</p>
              <p>Control status: {{ emailControl.status }}</p>
            </div>
          </div>
        </aside>
      </section>
    </div>
  `,
})
export class SignalFormControlComponent {
  protected readonly emailControl = new SignalFormControl('', (path) => {
    required(path, { message: 'Email is required.' });
    email(path, { message: 'Enter a valid email address.' });
  });

  protected readonly profileForm = new FormGroup({
    name: new FormControl('Enea', { nonNullable: true }),
    email: this.emailControl,
  });

  protected readonly message = errorMessage;

  protected patchReactive(): void {
    this.profileForm.patchValue({ email: 'reactive@angular.dev' });
  }

  protected patchSignal(): void {
    this.emailControl.fieldTree().value.set('signal@angular.dev');
  }
}
