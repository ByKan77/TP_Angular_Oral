import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  map,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import { Episode } from '../../models/episode.model';
import { EpisodeService } from '../../services/episode.service';
import { PaginatorComponent } from '../../components/paginator/paginator.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ErrorMessageComponent } from '../../components/error-message/error-message.component';
import { TruncatePipe } from '../../pipes/truncate.pipe';

@Component({
  selector: 'app-episodes-list',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    PaginatorComponent,
    LoaderComponent,
    ErrorMessageComponent,
    TruncatePipe,
  ],
  templateUrl: './episodes-list.component.html',
  styleUrl: './episodes-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EpisodesListComponent {
  private readonly episodeService = inject(EpisodeService);

  readonly currentPage = signal(1);
  private readonly page$ = new BehaviorSubject<number>(1);

  readonly state$ = this.page$.pipe(
    switchMap((page) =>
      this.episodeService.getAll(page).pipe(
        map((res) => ({
          loading: false,
          error: null as string | null,
          episodes: res.results,
          info: res.info,
        })),
        startWith({
          loading: true,
          error: null,
          episodes: [] as Episode[],
          info: null,
        }),
        catchError(() =>
          of({
            loading: false,
            error: 'Erreur lors du chargement des épisodes.',
            episodes: [] as Episode[],
            info: null,
          })
        )
      )
    )
  );

  prevPage(): void {
    if (this.currentPage() > 1) {
      this.goToPage(this.currentPage() - 1);
    }
  }

  nextPage(): void {
    this.goToPage(this.currentPage() + 1);
  }

  reload(): void {
    this.page$.next(this.currentPage());
  }

  private goToPage(page: number): void {
    this.currentPage.set(page);
    this.page$.next(page);
  }
}
