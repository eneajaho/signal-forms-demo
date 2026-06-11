import { JsonPipe } from '@angular/common';
import { Component, input, model, signal } from '@angular/core';
import { FormField, type FormValueControl, form, min, required } from '@angular/forms/signals';
import { errorMessage } from './demo-utils';

@Component({
  selector: 'app-star-rating',
  template: `
    <div class="flex flex-wrap gap-2" role="group" aria-label="Rating">
      @for (star of stars; track star) {
        <button
          class="grid size-12 place-items-center rounded-sm border-2 border-zinc-950/15 bg-white text-2xl font-black transition hover:-translate-y-0.5 hover:border-zinc-950 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-300"
          type="button"
          [disabled]="disabled()"
          [attr.aria-label]="'Rate ' + star"
          (click)="rate(star)"
        >
          {{ star <= value() ? '★' : '☆' }}
        </button>
      }
    </div>
  `,
})
export class StarRatingComponent implements FormValueControl<number> {
  readonly value = model(0);
  readonly disabled = input(false);
  readonly touched = model(false);
  protected readonly stars = [1, 2, 3, 4, 5];

  protected rate(star: number): void {
    if (this.disabled()) {
      return;
    }

    this.value.set(star);
    this.touched.set(true);
  }
}

@Component({
  selector: 'app-custom-control',
  imports: [FormField, JsonPipe, StarRatingComponent],
  template: `
    <div class="demo-page">
      <section class="demo-hero">
        <div class="h-2 bg-gradient-to-r from-orange-500 to-pink-600"></div>
        <div class="p-6 md:p-8">
          <p class="demo-label">Controls</p>
          <h1 class="mt-3 text-4xl font-black md:text-6xl">
            Custom controls wire up the same way.
          </h1>
          <p class="mt-4 max-w-3xl text-lg font-semibold leading-8 text-zinc-600">
            The star component exposes a value model and implements FormValueControl.
          </p>
        </div>
      </section>

      <section class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <form class="demo-panel grid gap-5">
          <label class="grid gap-2">
            <span class="demo-label">Review title</span>
            <input
              class="demo-input"
              placeholder="Signal Forms clicked for me"
              [formField]="reviewForm.title"
            />
          </label>

          <div class="grid gap-2">
            <span class="demo-label">Rating</span>
            <app-star-rating [formField]="reviewForm.rating" />
          </div>

          @if (reviewForm.rating().touched()) {
            @for (error of reviewForm.rating().errors(); track $index) {
              <p class="demo-error">{{ message(error) }}</p>
            }
          }

          @if (reviewForm().valid()) {
            <p class="demo-ok">Review is ready to submit.</p>
          }
        </form>

        <aside class="grid gap-4">
          <div class="demo-panel">
            <p class="demo-label">Control value</p>
            <p class="mt-3 text-6xl font-black">{{ reviewForm.rating().value() }}/5</p>
          </div>

          <div class="demo-panel">
            <p class="demo-label">Model</p>
            <pre class="demo-code mt-3">{{ reviewModel() | json }}</pre>
          </div>
        </aside>
      </section>
    </div>
  `,
})
export class CustomControlComponent {
  protected readonly reviewModel = signal({ title: '', rating: 0 });
  protected readonly reviewForm = form(this.reviewModel, (path) => {
    required(path.title, { message: 'Review title is required.' });
    min(path.rating, 4, { message: 'Give this demo at least 4 stars.' });
  });
  protected readonly message = errorMessage;
}
