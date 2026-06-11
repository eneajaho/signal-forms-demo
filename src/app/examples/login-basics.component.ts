import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormField, email, form as signalForm, minLength, required } from '@angular/forms/signals';
import { errorMessage } from './demo-utils';

@Component({
  selector: 'app-login-basics',
  imports: [FormField, JsonPipe],
  template: `
    <div class="demo-page">
      <section class="demo-hero">
        <div class="h-2 bg-linear-to-r from-cyan-500 to-blue-600"></div>
        <div class="p-6 md:p-8">
          <p class="demo-label">Signal Forms</p>
          <h1 class="mt-3 text-4xl font-black md:text-6xl">A form is just a signal.</h1>
          <p class="mt-4 max-w-3xl text-lg font-semibold leading-8 text-zinc-600">
            The model is the source of truth. The form tree mirrors it, and each field exposes
            reactive state.
          </p>
        </div>
      </section>

      <section class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <form class="demo-panel grid gap-5">
          <label class="grid gap-2">
            <span class="demo-label">Email</span>
            <input
              class="demo-input"
              type="email"
              placeholder="you@angular.dev"
              [formField]="loginForm.email"
            />

            @if (loginForm.email().touched() && loginForm.email().invalid()) {
              @for (error of loginForm.email().errors(); track $index) {
                <p class="demo-error">{{ message(error) }}</p>
              }
            }
          </label>

          <label class="grid gap-2">
            <span class="demo-label">Password</span>
            <input
              class="demo-input"
              type="password"
              placeholder="8+ characters"
              [formField]="loginForm.password"
            />

            @if (loginForm.password().touched() && loginForm.password().invalid()) {
              @for (error of loginForm.password().errors(); track $index) {
                <p class="demo-error">{{ message(error) }}</p>
              }
            }
          </label>

          <div class="grid gap-3 md:grid-cols-3">
            <div class="rounded-sm bg-cyan-50 p-4">
              <p class="demo-label">Email valid</p>
              <p class="mt-2 text-2xl font-black">{{ loginForm.email().valid() }}</p>
            </div>
            <div class="rounded-sm bg-amber-50 p-4">
              <p class="demo-label">Touched</p>
              <p class="mt-2 text-2xl font-black">{{ loginForm.email().touched() }}</p>
            </div>
            <div class="rounded-sm bg-emerald-50 p-4">
              <p class="demo-label">Form valid</p>
              <p class="mt-2 text-2xl font-black">{{ loginForm().valid() }}</p>
            </div>
          </div>

          @if (loginForm.email().valid()) {
            <p class="demo-ok">Email field looks good.</p>
          }
        </form>

        <aside class="grid gap-4">
          <div class="demo-panel">
            <p class="demo-label">Signal model</p>
            <pre class="demo-code mt-3">{{ loginModel() | json }}</pre>
          </div>

          <div class="demo-panel">
            <p class="demo-label">Code shape</p>
            <pre class="demo-code mt-3"><code>loginModel = signal(&#123;
  email: '',
  password: ''
&#125;);

loginForm = form(loginModel);

&lt;input [formField]="loginForm.email" /&gt;</code></pre>
          </div>
        </aside>
      </section>
    </div>
  `,
})
export class LoginBasicsComponent {
  protected readonly loginModel = signal({ email: '', password: '' });
  protected readonly loginForm = signalForm(this.loginModel, (path) => {
    required(path.email, { message: 'Email is required.' });
    email(path.email, { message: 'Use a real email address.' });
    required(path.password, { message: 'Password is required.' });
    minLength(path.password, 8, { message: 'Use at least 8 characters.' });
  });
  protected readonly message = errorMessage;
}
