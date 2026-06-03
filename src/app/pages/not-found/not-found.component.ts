import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="not-found">
      <h1>404</h1>
      <p>Cette dimension n'existe pas…</p>
      <a routerLink="/dashboard" class="btn">Retour au tableau de bord</a>
    </div>
  `,
  styles: `
    .not-found {
      text-align: center;
      padding: 3rem 1rem;
    }
    .not-found h1 {
      font-size: 4rem;
      margin: 0;
      color: var(--accent);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {}
