import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormField, disabled, form as signalForm, hidden, readonly } from '@angular/forms/signals';

@Component({
  selector: 'app-field-logic',
  imports: [FormField, JsonPipe],
  template: `
    <div class="demo-page">
      <section class="demo-hero">
        <div class="h-2 bg-gradient-to-r from-fuchsia-500 to-rose-600"></div>
        <div class="p-6 md:p-8">
          <p class="demo-label">Form Logic</p>
          <h1 class="mt-3 text-4xl font-black md:text-6xl">Disable, hide, readonly.</h1>
          <p class="mt-4 max-w-3xl text-lg font-semibold leading-8 text-zinc-600">
            Availability rules live in the schema and re-run when their dependencies change.
          </p>
        </div>
      </section>

      <section class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <form class="demo-panel grid gap-5">
          <label class="grid gap-2">
            <span class="demo-label">Order total</span>
            <input class="demo-input" type="number" [formField]="orderForm.total" />
          </label>

          <div class="flex flex-wrap gap-2">
            <button class="demo-ghost-button" type="button" (click)="orderForm.total().value.set(24)">Set $24</button>
            <button class="demo-ghost-button" type="button" (click)="orderForm.total().value.set(74)">Set $74</button>
          </div>

          <label class="grid gap-2">
            <span class="demo-label">Coupon code</span>
            <input class="demo-input" placeholder="SIGNALS20" [formField]="orderForm.couponCode" />
            @for (reason of orderForm.couponCode().disabledReasons(); track $index) {
              <span class="rounded-sm bg-amber-50 px-3 py-2 text-sm font-bold text-amber-800">{{ reason.message }}</span>
            }
          </label>

          <label class="flex items-center gap-3 rounded-sm border border-zinc-950/10 bg-zinc-50 p-3">
            <input class="size-5 accent-zinc-950" type="checkbox" [formField]="orderForm.isPublic" />
            <span class="font-black">Publish order page</span>
          </label>

          @if (!orderForm.publicUrl().hidden()) {
            <label class="grid gap-2">
              <span class="demo-label">Public URL</span>
              <input class="demo-input" [formField]="orderForm.publicUrl" />
            </label>
          }

          <label class="grid gap-2">
            <span class="demo-label">Account username</span>
            <input class="demo-input" [formField]="orderForm.username" />
            <span class="text-sm font-bold text-zinc-500">Readonly comes from the schema, not a template flag.</span>
          </label>
        </form>

        <aside class="grid gap-4">
          <div class="demo-panel">
            <p class="demo-label">State</p>
            <div class="mt-3 grid gap-2 text-sm font-bold">
              <p>Coupon disabled: {{ orderForm.couponCode().disabled() }}</p>
              <p>URL hidden: {{ orderForm.publicUrl().hidden() }}</p>
              <p>Username readonly: {{ orderForm.username().readonly() }}</p>
            </div>
          </div>

          <div class="demo-panel">
            <p class="demo-label">Model</p>
            <pre class="demo-code mt-3">{{ orderModel() | json }}</pre>
          </div>
        </aside>
      </section>
    </div>
  `,
})
export class FieldLogicComponent {
  protected readonly orderModel = signal({
    total: 32,
    couponCode: '',
    publicUrl: 'https://demo.angular.dev/orders/4821',
    isPublic: false,
    username: 'enea',
  });

  protected readonly orderForm = signalForm(this.orderModel, (path) => {
    disabled(path.couponCode, ({ valueOf }) =>
      valueOf(path.total) < 50 ? 'Order must be at least $50 to use a coupon.' : false,
    );
    hidden(path.publicUrl, ({ valueOf }) => !valueOf(path.isPublic));
    readonly(path.username);
  });
}
