import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-error-message',
  standalone: true,
  template: `
    <div class="error" role="alert">
      <p>{{ message() }}</p>
      <button type="button" class="btn btn--secondary" (click)="retry.emit()">
        Réessayer
      </button>
    </div>
  `,
  styles: `
    .error {
      padding: 1.5rem;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid var(--danger);
      border-radius: var(--radius);
      text-align: center;
    }
    .error p {
      margin: 0 0 1rem;
      color: var(--danger);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorMessageComponent {
  readonly message = input.required<string>();
  readonly retry = output<void>();
}
