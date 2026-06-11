import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { email, form, minLength, required } from '@angular/forms/signals';
import {
  AccountSectionComponent,
  type AccountInfo,
} from './nested-components/account-section.component';
import {
  AddressSectionComponent,
  type AddressInfo,
} from './nested-components/address-section.component';
import {
  PersonalSectionComponent,
  type PersonalInfo,
} from './nested-components/personal-section.component';

interface RegistrationModel {
  personal: PersonalInfo;
  address: AddressInfo;
  account: AccountInfo;
}

@Component({
  selector: 'app-nested-components',
  imports: [PersonalSectionComponent, AddressSectionComponent, AccountSectionComponent, JsonPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="demo-page">
      <section class="demo-hero">
        <div class="h-2 bg-linear-to-r from-violet-500 to-fuchsia-600"></div>
        <div class="p-6 md:p-8">
          <p class="demo-label">Components</p>
          <h1 class="mt-3 text-4xl font-black md:text-6xl">One form. Three components.</h1>
          <p class="mt-4 max-w-3xl text-lg font-semibold leading-8 text-zinc-600">
            Pass a slice of the field tree to each child component as an input typed
            <code class="rounded bg-zinc-200 px-1 py-0.5 text-sm">FieldTree&lt;T&gt;</code>. The
            root form stays the single source of truth.
          </p>
        </div>
      </section>

      <section class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <form class="demo-panel grid gap-5">
          <app-personal-section [section]="registrationForm.personal" />
          <app-address-section [section]="registrationForm.address" />
          <app-account-section [section]="registrationForm.account" />

          <div
            class="flex items-center justify-between rounded-sm border border-zinc-950/10 bg-zinc-50 px-4 py-3"
          >
            <span class="text-sm font-bold">Form valid</span>
            <span class="text-lg font-black">{{ registrationForm().valid() }}</span>
          </div>
        </form>

        <aside class="grid gap-4 self-start">
          <div class="demo-panel">
            <p class="demo-label">Code shape</p>
            <pre class="demo-code mt-3"><code>&lt;app-personal-section
  [section]="form.personal"
/&gt;

&lt;!-- personal-section.component.ts --&gt;
readonly section =
  input.required&lt;FieldTree&lt;PersonalInfo&gt;&gt;();

&lt;input [formField]="section().email" /&gt;</code></pre>
          </div>

          <div class="demo-panel">
            <p class="demo-label">Signal model</p>
            <pre class="demo-code mt-3">{{ registrationModel() | json }}</pre>
          </div>
        </aside>
      </section>
    </div>
  `,
})
export class NestedComponentsComponent {
  protected readonly registrationModel = signal<RegistrationModel>({
    personal: { firstName: '', lastName: '', email: '' },
    address: { street: '', city: '', zipCode: '' },
    account: { username: '', password: '' },
  });

  protected readonly registrationForm = form(this.registrationModel, (path) => {
    required(path.personal.firstName, { message: 'First name is required.' });
    required(path.personal.lastName, { message: 'Last name is required.' });
    required(path.personal.email, { message: 'Email is required.' });
    email(path.personal.email, { message: 'Use a valid email address.' });

    required(path.address.street, { message: 'Street is required.' });
    required(path.address.city, { message: 'City is required.' });
    required(path.address.zipCode, { message: 'ZIP code is required.' });

    required(path.account.username, { message: 'Username is required.' });
    required(path.account.password, { message: 'Password is required.' });
    minLength(path.account.password, 8, { message: 'Use at least 8 characters.' });
  });
}
