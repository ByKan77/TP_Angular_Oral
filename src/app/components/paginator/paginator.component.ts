import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  standalone: true,
  template: `
    <nav class="paginator" aria-label="Pagination">
      <button
        type="button"
        class="btn btn--secondary"
        [disabled]="currentPage() <= 1"
        (click)="prev.emit()"
      >
        ← Précédent
      </button>
      <span class="paginator__info">
        Page {{ currentPage() }} / {{ totalPages() }}
      </span>
      <button
        type="button"
        class="btn btn--secondary"
        [disabled]="currentPage() >= totalPages()"
        (click)="next.emit()"
      >
        Suivant →
      </button>
    </nav>
  `,
  styles: `
    .paginator {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
      margin-top: 1.5rem;
    }
    .paginator__info {
      font-weight: 600;
      color: var(--text-muted);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginatorComponent {
  readonly currentPage = input.required<number>();
  readonly totalPages = input.required<number>();
  readonly prev = output<void>();
  readonly next = output<void>();
}
