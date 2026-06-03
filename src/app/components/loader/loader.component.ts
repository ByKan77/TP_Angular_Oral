import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  template: `
    <div class="loader" role="status" aria-label="Chargement">
      <div class="loader__spinner"></div>
      <p>Chargement…</p>
    </div>
  `,
  styles: `
    .loader {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding: 2rem;
      color: var(--text-muted);
    }
    .loader__spinner {
      width: 48px;
      height: 48px;
      border: 4px solid var(--border);
      border-top-color: var(--accent);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent {}
