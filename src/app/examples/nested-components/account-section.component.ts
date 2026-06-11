import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { errorMessage } from '../demo-utils';

export interface AccountInfo {
  username: string;
  password: string;
}

@Component({
  selector: 'app-account-section',
  imports: [FormField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <fieldset class="grid gap-4 rounded-sm border border-zinc-950/10 bg-zinc-50 p-4">
      <legend class="demo-label px-1">Account</legend>

      <label class="grid gap-2">
        <span class="demo-label">Username</span>
        <input class="demo-input" placeholder="ada_lovelace" [formField]="section().username" />
        @if (section().username().touched() && section().username().invalid()) {
          @for (err of section().username().errors(); track $index) {
            <p class="demo-error">{{ message(err) }}</p>
          }
        }
      </label>

      <label class="grid gap-2">
        <span class="demo-label">Password</span>
        <input
          class="demo-input"
          type="password"
          placeholder="8+ characters"
          [formField]="section().password"
        />
        @if (section().password().touched() && section().password().invalid()) {
          @for (err of section().password().errors(); track $index) {
            <p class="demo-error">{{ message(err) }}</p>
          }
        }
      </label>
    </fieldset>
  `,
})
export class AccountSectionComponent {
  readonly section = input.required<FieldTree<AccountInfo>>();
  protected readonly message = errorMessage;
}
