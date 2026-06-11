import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DEMO_NAV } from '../demo-nav';

@Component({
  selector: 'app-overview',
  imports: [RouterLink],
  template: `
    <div class="demo-page">
      <section class="demo-hero">
        <div class="grid gap-6 p-6 md:grid-cols-[1.1fr_0.9fr] md:p-8">
          <div class="flex min-h-[360px] flex-col justify-between">
            <div>
              <p class="demo-label">Code-first tour</p>
              <h1 class="mt-4 max-w-3xl text-5xl font-black leading-[0.95] md:text-7xl">
                100X better forms, now demoable.
              </h1>
              <p class="mt-5 max-w-2xl text-lg font-semibold leading-8 text-zinc-600">
                Every Angular Signal Forms example from the deck has a route, a working form, and a live state panel so you can present by changing code and typing in the UI.
              </p>
            </div>

            <div class="mt-8 flex flex-wrap gap-3">
              <a routerLink="/login-basics" class="demo-button">Open first route</a>
              <a routerLink="/submission" class="demo-ghost-button">Jump to submit</a>
            </div>
          </div>

          <div class="grid content-between gap-3 rounded-sm bg-zinc-950 p-4 text-white">
            <div class="grid grid-cols-2 gap-3">
              <div class="rounded-sm bg-cyan-400 p-4 text-zinc-950">
                <div class="text-4xl font-black">17</div>
                <div class="text-xs font-black uppercase tracking-[0.16em]">Routes</div>
              </div>
              <div class="rounded-sm bg-amber-300 p-4 text-zinc-950">
                <div class="text-4xl font-black">1</div>
                <div class="text-xs font-black uppercase tracking-[0.16em]">Signal model</div>
              </div>
              <div class="rounded-sm bg-emerald-400 p-4 text-zinc-950">
                <div class="text-4xl font-black">0</div>
                <div class="text-xs font-black uppercase tracking-[0.16em]">FormControls needed</div>
              </div>
              <div class="rounded-sm bg-rose-400 p-4 text-zinc-950">
                <div class="text-4xl font-black">DX</div>
                <div class="text-xs font-black uppercase tracking-[0.16em]">Typed paths</div>
              </div>
            </div>

            <pre class="overflow-hidden rounded-sm border border-white/15 p-4 text-xs text-zinc-300"><code>model = signal(&#123; email: '', password: '' &#125;);
form = form(model, (path) => &#123;
  required(path.email);
  email(path.email);
&#125;);</code></pre>
          </div>
        </div>
      </section>

      <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        @for (demo of demos; track demo.path) {
          <a
            [routerLink]="demo.path"
            class="group overflow-hidden rounded-sm border border-zinc-950/10 bg-white transition hover:-translate-y-1 hover:shadow-[6px_6px_0_#18181b]"
          >
            <div [class]="'h-2 bg-gradient-to-r ' + demo.accent"></div>
            <div class="p-5">
              <p class="demo-label">{{ demo.eyebrow }}</p>
              <h2 class="mt-3 text-xl font-black">{{ demo.title }}</h2>
              <p class="mt-3 text-sm font-semibold leading-6 text-zinc-600">{{ demo.summary }}</p>
            </div>
          </a>
        }
      </section>
    </div>
  `,
})
export class OverviewComponent {
  protected readonly demos = DEMO_NAV;
}
