import type { ValidationError } from '@angular/forms/signals';

export type DemoError = Pick<ValidationError, 'kind' | 'message'>;

export function errorMessage(error: DemoError): string {
  return error.message ?? fallbackMessages[error.kind] ?? error.kind;
}

export function json(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

export function wait(ms: number, abortSignal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(resolve, ms);

    abortSignal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timeout);
        reject(new DOMException('The operation was aborted.', 'AbortError'));
      },
      { once: true },
    );
  });
}

const fallbackMessages: Record<string, string> = {
  required: 'This field is required.',
  email: 'Enter a valid email address.',
  min: 'The value is too low.',
  max: 'The value is too high.',
  minLength: 'The value is too short.',
  maxLength: 'The value is too long.',
  pattern: 'The value does not match the expected format.',
};
