import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  FormField,
  form as signalForm,
  required,
  validate,
  type SchemaPath,
} from '@angular/forms/signals';
import { errorMessage } from './demo-utils';

interface UrlValidatorConfig {
  protocol?: 'https:' | 'http:';
  host?: string;
  message?: string;
}

function urlValidator(path: SchemaPath<string>, config: UrlValidatorConfig = {}): void {
  validate(path, ({ value }) => {
    const rawUrl = value().trim();

    if (rawUrl === '') {
      return null;
    }

    let url: URL;

    try {
      url = new URL(rawUrl);
    } catch {
      return {
        kind: 'url',
        message: config.message ?? 'Enter a valid absolute URL.',
      };
    }

    if (config.protocol && url.protocol !== config.protocol) {
      return {
        kind: 'urlProtocol',
        message: config.message ?? `URL must use ${config.protocol.replace(':', '')}.`,
      };
    }

    if (config.host && url.hostname !== config.host) {
      return {
        kind: 'urlHost',
        message: config.message ?? `URL must be hosted on ${config.host}.`,
      };
    }

    return null;
  });
}

@Component({
  selector: 'app-custom-validator',
  imports: [FormField, JsonPipe],
  template: `
    <div class="demo-page">
      <section class="demo-hero">
        <div class="h-2 bg-gradient-to-r from-amber-500 to-orange-600"></div>
        <div class="p-6 md:p-8">
          <p class="demo-label">Validation</p>
          <h1 class="mt-3 text-4xl font-black md:text-6xl">Custom rules are tiny.</h1>
          <p class="mt-4 max-w-3xl text-lg font-semibold leading-8 text-zinc-600">
            Start inline, then extract the rule into a reusable validator with config.
          </p>
        </div>
      </section>

      <section class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_460px]">
        <form class="demo-panel grid gap-5">
          <label class="grid gap-2">
            <span class="demo-label">Inline HTTPS check</span>
            <input
              class="demo-input"
              placeholder="https://push-based.io"
              [formField]="profileForm.website"
            />
          </label>

          @if (profileForm.website().touched() && profileForm.website().invalid()) {
            @for (error of profileForm.website().errors(); track $index) {
              <p class="demo-error">{{ message(error) }}</p>
            }
          }

          @if (profileForm.website().valid()) {
            <p class="demo-ok">HTTPS URL accepted.</p>
          }

          <div class="my-1 h-px bg-zinc-950/10"></div>

          <label class="grid gap-2">
            <span class="demo-label">Reusable validator: docs URL</span>
            <input
              class="demo-input"
              placeholder="https://angular.dev/guide/forms/signals"
              [formField]="profileForm.docsUrl"
            />
            <span class="text-sm font-bold text-zinc-500">Config: protocol must be https.</span>
          </label>

          @if (profileForm.docsUrl().touched() && profileForm.docsUrl().invalid()) {
            @for (error of profileForm.docsUrl().errors(); track $index) {
              <p class="demo-error">{{ message(error) }}</p>
            }
          }

          <label class="grid gap-2">
            <span class="demo-label">Reusable validator: callback URL</span>
            <input
              class="demo-input"
              placeholder="https://app.local/callback"
              [formField]="profileForm.callbackUrl"
            />
            <span class="text-sm font-bold text-zinc-500"
              >Config: protocol must be https and host must be app.local.</span
            >
          </label>

          @if (profileForm.callbackUrl().touched() && profileForm.callbackUrl().invalid()) {
            @for (error of profileForm.callbackUrl().errors(); track $index) {
              <p class="demo-error">{{ message(error) }}</p>
            }
          }

          @if (profileForm.docsUrl().valid() && profileForm.callbackUrl().valid()) {
            <p class="demo-ok">Both extracted validator instances pass with different config.</p>
          }
        </form>

        <aside class="grid gap-4">
          <div class="demo-panel">
            <p class="demo-label">Model</p>
            <pre class="demo-code mt-3">{{ profileModel() | json }}</pre>
          </div>

          <div class="demo-panel">
            <p class="demo-label">Inline contract</p>
            <pre
              class="demo-code mt-3"
            ><code>validate(path.website, (&#123; value &#125;) =&gt; &#123;
  return value().startsWith('https://')
    ? null
    : &#123; kind: 'https', message: '...' &#125;;
&#125;);</code></pre>
          </div>

          <div class="demo-panel">
            <p class="demo-label">Extracted version</p>
            <pre class="demo-code mt-3"><code>urlValidator(path.docsUrl, &#123;
  protocol: 'https:'
&#125;);

urlValidator(path.callbackUrl, &#123;
  protocol: 'https:',
  host: 'app.local'
&#125;);</code></pre>
          </div>
        </aside>
      </section>
    </div>
  `,
})
export class CustomValidatorComponent {
  protected readonly profileModel = signal({
    website: 'http://example.com',
    docsUrl: 'http://angular.dev/guide/forms/signals',
    callbackUrl: 'https://example.com/callback',
  });

  protected readonly profileForm = signalForm(this.profileModel, (path) => {
    required(path.website, { message: 'Website is required.' });
    validate(path.website, ({ value }) => {
      const website = value().trim();

      return website === '' || website.startsWith('https://')
        ? null
        : { kind: 'https', message: 'URL must start with https://.' };
    });

    required(path.docsUrl, { message: 'Docs URL is required.' });
    urlValidator(path.docsUrl, {
      protocol: 'https:',
      message: 'Docs URL must be a valid https URL.',
    });

    required(path.callbackUrl, { message: 'Callback URL is required.' });
    urlValidator(path.callbackUrl, {
      protocol: 'https:',
      host: 'app.local',
      message: 'Callback URL must be https://app.local/...',
    });
  });

  protected readonly message = errorMessage;
}
