import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  template: `
    <label class="search-bar">
      <span class="search-bar__label">Rechercher par nom</span>
      <input
        type="search"
        class="input"
        placeholder="Ex : Rick, Morty…"
        [(ngModel)]="term"
        (ngModelChange)="onChange($event)"
      />
    </label>
  `,
  styles: `
    .search-bar {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      flex: 1;
      min-width: 200px;
    }
    .search-bar__label {
      font-size: 0.85rem;
      color: var(--text-muted);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarComponent {
  readonly searchChange = output<string>();
  term = '';

  onChange(value: string): void {
    this.searchChange.emit(value);
  }
}
