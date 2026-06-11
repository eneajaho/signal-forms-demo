import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormField, applyWhenValue, form as signalForm, required } from '@angular/forms/signals';
import { errorMessage } from './demo-utils';

type PaymentType = 'card' | 'bank';

interface PaymentMethod {
  type: PaymentType;
  cardNumber: string;
  cvv: string;
  accountNumber: string;
  routingNumber: string;
}

interface CardPayment extends PaymentMethod {
  type: 'card';
}

interface BankPayment extends PaymentMethod {
  type: 'bank';
}

function isCard(value: PaymentMethod): value is CardPayment {
  return value.type === 'card';
}

function isBank(value: PaymentMethod): value is BankPayment {
  return value.type === 'bank';
}

@Component({
  selector: 'app-conditional-schema',
  imports: [FormField, JsonPipe],
  template: `
    <div class="demo-page">
      <section class="demo-hero">
        <div class="h-2 bg-gradient-to-r from-rose-500 to-red-600"></div>
        <div class="p-6 md:p-8">
          <p class="demo-label">Schemas</p>
          <h1 class="mt-3 text-4xl font-black md:text-6xl">Conditional rules follow the value.</h1>
          <p class="mt-4 max-w-3xl text-lg font-semibold leading-8 text-zinc-600">
            applyWhenValue narrows by payment type and only applies the branch rules that matter.
          </p>
        </div>
      </section>

      <section class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <form class="demo-panel grid gap-5">
          <label class="grid gap-2">
            <span class="demo-label">Payment method</span>
            <select class="demo-input" [formField]="paymentForm.type">
              <option value="card">Credit card</option>
              <option value="bank">Bank transfer</option>
            </select>
          </label>

          @if (paymentForm.type().value() === 'card') {
            <div class="grid gap-4 md:grid-cols-2">
              <label class="grid gap-2">
                <span class="demo-label">Card number</span>
                <input class="demo-input" placeholder="4242 4242 4242 4242" [formField]="paymentForm.cardNumber" />
                @for (error of paymentForm.cardNumber().errors(); track $index) {
                  <span class="demo-error">{{ message(error) }}</span>
                }
              </label>
              <label class="grid gap-2">
                <span class="demo-label">CVV</span>
                <input class="demo-input" placeholder="123" [formField]="paymentForm.cvv" />
                @for (error of paymentForm.cvv().errors(); track $index) {
                  <span class="demo-error">{{ message(error) }}</span>
                }
              </label>
            </div>
          } @else {
            <div class="grid gap-4 md:grid-cols-2">
              <label class="grid gap-2">
                <span class="demo-label">Account number</span>
                <input class="demo-input" placeholder="00012345" [formField]="paymentForm.accountNumber" />
                @for (error of paymentForm.accountNumber().errors(); track $index) {
                  <span class="demo-error">{{ message(error) }}</span>
                }
              </label>
              <label class="grid gap-2">
                <span class="demo-label">Routing number</span>
                <input class="demo-input" placeholder="021000021" [formField]="paymentForm.routingNumber" />
                @for (error of paymentForm.routingNumber().errors(); track $index) {
                  <span class="demo-error">{{ message(error) }}</span>
                }
              </label>
            </div>
          }
        </form>

        <aside class="grid gap-4">
          <div class="demo-panel">
            <p class="demo-label">Active branch</p>
            <p class="mt-3 text-4xl font-black">{{ paymentForm.type().value() }}</p>
            <p class="mt-2 text-sm font-bold text-zinc-500">Only this branch contributes validation errors.</p>
          </div>

          <div class="demo-panel">
            <p class="demo-label">Model</p>
            <pre class="demo-code mt-3">{{ paymentModel() | json }}</pre>
          </div>
        </aside>
      </section>
    </div>
  `,
})
export class ConditionalSchemaComponent {
  protected readonly paymentModel = signal<PaymentMethod>({
    type: 'card',
    cardNumber: '',
    cvv: '',
    accountNumber: '',
    routingNumber: '',
  });

  protected readonly paymentForm = signalForm(this.paymentModel, (path) => {
    applyWhenValue(path, isCard, (card) => {
      required(card.cardNumber, { message: 'Card number is required.' });
      required(card.cvv, { message: 'CVV is required.' });
    });

    applyWhenValue(path, isBank, (bank) => {
      required(bank.accountNumber, { message: 'Account number is required.' });
      required(bank.routingNumber, { message: 'Routing number is required.' });
    });
  });

  protected readonly message = errorMessage;
}
