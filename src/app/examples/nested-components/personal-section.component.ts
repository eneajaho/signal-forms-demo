import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { errorMessage } from '../demo-utils';

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
}

@Component({
  selector: 'app-personal-section',
  imports: [FormField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <fieldset class="grid gap-4 rounded-sm border border-zinc-950/10 bg-zinc-50 p-4">
      <legend class="demo-label px-1">Personal info</legend>

      <div class="grid gap-4 sm:grid-cols-2">
        <label class="grid gap-2">
          <span class="demo-label">First name</span>
          <input class="demo-input" placeholder="Ada" [formField]="section().firstName" />
          @if (section().firstName().touched() && section().firstName().invalid()) {
            @for (err of section().firstName().errors(); track $index) {
              <p class="demo-error">{{ message(err) }}</p>
            }
          }
        </label>

        <label class="grid gap-2">
          <span class="demo-label">Last name</span>
          <input class="demo-input" placeholder="Lovelace" [formField]="section().lastName" />
          @if (section().lastName().touched() && section().lastName().invalid()) {
            @for (err of section().lastName().errors(); track $index) {
              <p class="demo-error">{{ message(err) }}</p>
            }
          }
        </label>
      </div>

      <label class="grid gap-2">
        <span class="demo-label">Email</span>
        <input
          class="demo-input"
          type="email"
          placeholder="ada@angular.dev"
          [formField]="section().email"
        />
        @if (section().email().touched() && section().email().invalid()) {
          @for (err of section().email().errors(); track $index) {
            <p class="demo-error">{{ message(err) }}</p>
          }
        }
      </label>
    </fieldset>
  `,
})
export class PersonalSectionComponent {
  readonly section = input.required<FieldTree<PersonalInfo>>();
  protected readonly message = errorMessage;
}
