import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Character } from '../../models/character.model';
import { FavorisService } from '../../services/favoris.service';
import { StatusPipe } from '../../pipes/status.pipe';
import { TruncatePipe } from '../../pipes/truncate.pipe';

@Component({
  selector: 'app-character-card',
  standalone: true,
  imports: [RouterLink, StatusPipe, TruncatePipe],
  template: `
    <article class="card">
      <a [routerLink]="['/characters', character().id]" class="card__link">
        <img [src]="character().image" [alt]="character().name" class="card__img" />
        <div class="card__body">
          <h3>{{ character().name }}</h3>
          <p>{{ character().status | status }}</p>
          <p class="card__meta">{{ character().species | truncate:40 }}</p>
        </div>
      </a>
      <button
        type="button"
        class="card__fav"
        [class.card__fav--active]="isFavoriActive()"
        [attr.aria-label]="isFavoriActive() ? 'Retirer des favoris' : 'Ajouter aux favoris'"
        (click)="toggleFavori.emit(character()); $event.stopPropagation()"
      >
        {{ isFavoriActive() ? '★' : '☆' }}
      </button>
    </article>
  `,
  styles: `
    .card {
      position: relative;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      overflow: hidden;
      transition: transform 0.15s, box-shadow 0.15s;
    }
    .card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow);
    }
    .card__link {
      display: block;
      text-decoration: none;
      color: inherit;
    }
    .card__img {
      width: 100%;
      aspect-ratio: 1;
      object-fit: cover;
    }
    .card__body {
      padding: 1rem;
    }
    .card__body h3 {
      margin: 0 0 0.35rem;
      font-size: 1.1rem;
    }
    .card__body p {
      margin: 0.15rem 0;
      font-size: 0.9rem;
    }
    .card__meta {
      color: var(--text-muted);
    }
    .card__fav {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      width: 2.25rem;
      height: 2.25rem;
      border: none;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.6);
      color: #fff;
      font-size: 1.25rem;
      cursor: pointer;
      line-height: 1;
    }
    .card__fav--active {
      color: #fbbf24;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterCardComponent {
  private readonly favorisService = inject(FavorisService);

  readonly character = input.required<Character>();
  readonly toggleFavori = output<Character>();

  isFavoriActive(): boolean {
    return this.favorisService
      .favoris()
      .some((c) => c.id === this.character().id);
  }
}
