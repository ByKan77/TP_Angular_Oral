import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { CharacterService } from '../../services/character.service';
import { EpisodeService } from '../../services/episode.service';
import { FavorisService } from '../../services/favoris.service';
import { LocationService } from '../../services/location.service';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ErrorMessageComponent } from '../../components/error-message/error-message.component';

interface DashboardStats {
  characters: number;
  locations: number;
  episodes: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [LoaderComponent, ErrorMessageComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private readonly characterService = inject(CharacterService);
  private readonly locationService = inject(LocationService);
  private readonly episodeService = inject(EpisodeService);
  private readonly destroyRef = inject(DestroyRef);
  readonly favorisService = inject(FavorisService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly totals = signal<DashboardStats | null>(null);

  readonly nombreFavoris = this.favorisService.nombre;
  readonly repartitionFavoris = this.favorisService.repartitionParStatut;

  readonly totalGeneral = computed(() => {
    const t = this.totals();
    if (!t) {
      return 0;
    }
    return t.characters + t.locations + t.episodes;
  });

  constructor() {
    this.loadStats();
  }

  loadStats(): void {
    this.loading.set(true);
    this.error.set(null);
    forkJoin({
      characters: this.characterService.getInfoCount(),
      locations: this.locationService.getInfoCount(),
      episodes: this.episodeService.getInfoCount(),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.totals.set(data);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Impossible de charger les statistiques.');
          this.loading.set(false);
        },
      });
  }
}
