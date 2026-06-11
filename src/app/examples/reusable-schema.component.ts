import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormField, apply, email, form as signalForm, required, schema } from '@angular/forms/signals';
import { errorMessage } from './demo-utils';

interface NameModel {
  first: string;
  last: string;
}

const nameSchema = schema<NameModel>((name) => {
  required(name.first, { message: 'First name is required.' });
  required(name.last, { message: 'Last name is required.' });
});

@Component({
  selector: 'app-reusable-schema',
  imports: [FormField, JsonPipe],
  template: `
    <div class="demo-page">
      <section class="demo-hero">
        <div class="h-2 bg-gradient-to-r from-sky-500 to-cyan-600"></div>
        <div class="p-6 md:p-8">
          <p class="demo-label">Schemas</p>
          <h1 class="mt-3 text-4xl font-black md:text-6xl">Write once. Reuse everywhere.</h1>
          <p class="mt-4 max-w-3xl text-lg font-semibold leading-8 text-zinc-600">
            The same name schema is applied to a compact profile form and a larger registration form.
          </p>
        </div>
      </section>

      <section class="grid gap-6 xl:grid-cols-2">
        <form class="demo-panel grid gap-4">
          <p class="demo-label">Profile</p>
          <label class="grid gap-2">
            <span class="demo-label">First</span>
            <input class="demo-input" [formField]="profileForm.name.first" />
          </label>
          <label class="grid gap-2">
            <span class="demo-label">Last</span>
            <input class="demo-input" [formField]="profileForm.name.last" />
          </label>
          @for (error of profileForm().errorSummary(); track $index) {
            <p class="demo-error">{{ message(error) }}</p>
          }
          <pre class="demo-code">{{ profileModel() | json }}</pre>
        </form>

        <form class="demo-panel grid gap-4">
          <p class="demo-label">Registration</p>
          <label class="grid gap-2">
            <span class="demo-label">First</span>
            <input class="demo-input" [formField]="registrationForm.name.first" />
          </label>
          <label class="grid gap-2">
            <span class="demo-label">Last</span>
            <input class="demo-input" [formField]="registrationForm.name.last" />
          </label>
          <label class="grid gap-2">
            <span class="demo-label">Email</span>
            <input class="demo-input" type="email" [formField]="registrationForm.email" />
          </label>
          @for (error of registrationForm().errorSummary(); track $index) {
            <p class="demo-error">{{ message(error) }}</p>
          }
          <pre class="demo-code">{{ registrationModel() | json }}</pre>
        </form>
      </section>
    </div>
  `,
})
export class ReusableSchemaComponent {
  protected readonly profileModel = signal({ name: { first: '', last: '' } });
  protected readonly registrationModel = signal({ name: { first: '', last: '' }, email: '' });

  protected readonly profileForm = signalForm(this.profileModel, (path) => {
    apply(path.name, nameSchema);
  });

  protected readonly registrationForm = signalForm(this.registrationModel, (path) => {
    apply(path.name, nameSchema);
    required(path.email, { message: 'Email is required.' });
    email(path.email, { message: 'Enter a valid email.' });
  });

  protected readonly message = errorMessage;
}
