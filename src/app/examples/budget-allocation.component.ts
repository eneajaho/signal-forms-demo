import { JsonPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormField, form as signalForm, max, min, validateTree } from '@angular/forms/signals';
import { errorMessage } from './demo-utils';

@Component({
  selector: 'app-budget-allocation',
  imports: [FormField, JsonPipe],
  template: `
    <div class="demo-page">
      <section class="demo-hero">
        <div class="h-2 bg-gradient-to-r from-lime-500 to-emerald-600"></div>
        <div class="p-6 md:p-8">
          <p class="demo-label">Cross-field</p>
          <h1 class="mt-3 text-4xl font-black md:text-6xl">validateTree sees the group.</h1>
          <p class="mt-4 max-w-3xl text-lg font-semibold leading-8 text-zinc-600">
            No single field can validate this split. The root rule checks the whole object.
          </p>
        </div>
      </section>

      <section class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <form class="demo-panel grid gap-5">
          <label class="grid gap-2">
            <span class="demo-label">Marketing</span>
            <input class="demo-input" type="number" [formField]="budgetForm.marketing" />
          </label>
          <label class="grid gap-2">
            <span class="demo-label">Engineering</span>
            <input class="demo-input" type="number" [formField]="budgetForm.engineering" />
          </label>
          <label class="grid gap-2">
            <span class="demo-label">Sales</span>
            <input class="demo-input" type="number" [formField]="budgetForm.sales" />
          </label>

          <div class="grid gap-2">
            <div class="h-4 overflow-hidden rounded-sm bg-zinc-100">
              <div class="h-full bg-cyan-500" [style.width.%]="budgetForm.marketing().value()"></div>
            </div>
            <div class="h-4 overflow-hidden rounded-sm bg-zinc-100">
              <div class="h-full bg-amber-400" [style.width.%]="budgetForm.engineering().value()"></div>
            </div>
            <div class="h-4 overflow-hidden rounded-sm bg-zinc-100">
              <div class="h-full bg-emerald-500" [style.width.%]="budgetForm.sales().value()"></div>
            </div>
          </div>

          @for (error of budgetForm().errors(); track $index) {
            <p class="demo-error">{{ message(error) }}</p>
          }

          @if (budgetForm().valid()) {
            <p class="demo-ok">The budget totals exactly 100 percent.</p>
          }
        </form>

        <aside class="grid gap-4">
          <div class="demo-panel">
            <p class="demo-label">Total</p>
            <p class="mt-3 text-6xl font-black">{{ total() }}%</p>
          </div>

          <div class="demo-panel">
            <p class="demo-label">Model</p>
            <pre class="demo-code mt-3">{{ budgetModel() | json }}</pre>
          </div>
        </aside>
      </section>
    </div>
  `,
})
export class BudgetAllocationComponent {
  protected readonly budgetModel = signal({ marketing: 40, engineering: 40, sales: 20 });
  protected readonly budgetForm = signalForm(this.budgetModel, (path) => {
    min(path.marketing, 0, { message: 'Use 0 or higher.' });
    max(path.marketing, 100, { message: 'Use 100 or lower.' });
    min(path.engineering, 0, { message: 'Use 0 or higher.' });
    max(path.engineering, 100, { message: 'Use 100 or lower.' });
    min(path.sales, 0, { message: 'Use 0 or higher.' });
    max(path.sales, 100, { message: 'Use 100 or lower.' });
    validateTree(path, ({ value }) => {
      const { marketing, engineering, sales } = value();
      const total = marketing + engineering + sales;

      return total === 100
        ? null
        : { kind: 'allocation', message: `Must total 100 percent. Current total: ${total} percent.` };
    });
  });
  protected readonly total = computed(() => {
    const { marketing, engineering, sales } = this.budgetModel();
    return marketing + engineering + sales;
  });
  protected readonly message = errorMessage;
}
