import { JsonPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormField, applyEach, form as signalForm, min, required } from '@angular/forms/signals';
import { errorMessage } from './demo-utils';

interface OrderItem {
  name: string;
  quantity: number;
}

@Component({
  selector: 'app-array-items',
  imports: [FormField, JsonPipe],
  template: `
    <div class="demo-page">
      <section class="demo-hero">
        <div class="h-2 bg-gradient-to-r from-teal-500 to-green-600"></div>
        <div class="p-6 md:p-8">
          <p class="demo-label">Schemas</p>
          <h1 class="mt-3 text-4xl font-black md:text-6xl">Arrays validate as they grow.</h1>
          <p class="mt-4 max-w-3xl text-lg font-semibold leading-8 text-zinc-600">
            applyEach attaches the same rules to every item, including rows added after startup.
          </p>
        </div>
      </section>

      <section class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <form class="demo-panel grid gap-4">
          <div class="flex items-center justify-between gap-3">
            <p class="demo-label">Line items</p>
            <button class="demo-button" type="button" (click)="addItem()">Add item</button>
          </div>

          @for (item of orderForm.items; track $index; let i = $index) {
            <div class="grid gap-3 rounded-sm border border-zinc-950/10 bg-zinc-50 p-4 md:grid-cols-[minmax(0,1fr)_130px_auto]">
              <label class="grid gap-2">
                <span class="demo-label">Item {{ i + 1 }}</span>
                <input class="demo-input" placeholder="Workshop ticket" [formField]="item.name" />
                @for (error of item.name().errors(); track $index) {
                  <span class="demo-error">{{ message(error) }}</span>
                }
              </label>
              <label class="grid gap-2">
                <span class="demo-label">Qty</span>
                <input class="demo-input" type="number" [formField]="item.quantity" />
                @for (error of item.quantity().errors(); track $index) {
                  <span class="demo-error">{{ message(error) }}</span>
                }
              </label>
              <button class="demo-ghost-button self-end" type="button" (click)="removeItem(i)">Remove</button>
            </div>
          }
        </form>

        <aside class="grid gap-4">
          <div class="demo-panel">
            <p class="demo-label">Items</p>
            <p class="mt-3 text-6xl font-black">{{ itemCount() }}</p>
            <p class="mt-2 text-sm font-bold text-zinc-500">Form valid: {{ orderForm().valid() }}</p>
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
export class ArrayItemsComponent {
  protected readonly orderModel = signal<{ items: OrderItem[] }>({
    items: [
      { name: 'Angular workshop', quantity: 1 },
      { name: '', quantity: 0 },
    ],
  });

  protected readonly orderForm = signalForm(this.orderModel, (path) => {
    applyEach(path.items, (item) => {
      required(item.name, { message: 'Item name is required.' });
      min(item.quantity, 1, { message: 'Quantity must be at least 1.' });
    });
  });

  protected readonly itemCount = computed(() => this.orderModel().items.length);
  protected readonly message = errorMessage;

  protected addItem(): void {
    this.orderModel.update((order) => ({
      items: [...order.items, { name: '', quantity: 1 }],
    }));
  }

  protected removeItem(index: number): void {
    this.orderModel.update((order) => ({
      items: order.items.filter((_, itemIndex) => itemIndex !== index),
    }));
  }
}
