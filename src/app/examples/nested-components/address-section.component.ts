import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { errorMessage } from '../demo-utils';

export interface AddressInfo {
  street: string;
  city: string;
  zipCode: string;
}

@Component({
  selector: 'app-address-section',
  imports: [FormField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <fieldset class="grid gap-4 rounded-sm border border-zinc-950/10 bg-zinc-50 p-4">
      <legend class="demo-label px-1">Address</legend>

      <label class="grid gap-2">
        <span class="demo-label">Street</span>
        <input class="demo-input" placeholder="123 Babbage Lane" [formField]="section().street" />
        @if (section().street().touched() && section().street().invalid()) {
          @for (err of section().street().errors(); track $index) {
            <p class="demo-error">{{ message(err) }}</p>
          }
        }
      </label>

      <div class="grid gap-4 sm:grid-cols-2">
        <label class="grid gap-2">
          <span class="demo-label">City</span>
          <input class="demo-input" placeholder="London" [formField]="section().city" />
          @if (section().city().touched() && section().city().invalid()) {
            @for (err of section().city().errors(); track $index) {
              <p class="demo-error">{{ message(err) }}</p>
            }
          }
        </label>

        <label class="grid gap-2">
          <span class="demo-label">ZIP code</span>
          <input class="demo-input" placeholder="SW1A 1AA" [formField]="section().zipCode" />
          @if (section().zipCode().touched() && section().zipCode().invalid()) {
            @for (err of section().zipCode().errors(); track $index) {
              <p class="demo-error">{{ message(err) }}</p>
            }
          }
        </label>
      </div>
    </fieldset>
  `,
})
export class AddressSectionComponent {
  readonly section = input.required<FieldTree<AddressInfo>>();
  protected readonly message = errorMessage;
}
