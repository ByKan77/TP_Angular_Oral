import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  catchError,
  map,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import { Character } from '../../models/character.model';
import { Episode } from '../../models/episode.model';
import { EpisodeService } from '../../services/episode.service';
import { CharacterService } from '../../services/character.service';
import { idsFromUrls } from '../../utils/url-id.util';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ErrorMessageComponent } from '../../components/error-message/error-message.component';
import { CharacterCardComponent } from '../../components/character-card/character-card.component';
import { FavorisService } from '../../services/favoris.service';

interface EpisodeDetailState {
  loading: boolean;
  error: string | null;
  episode: Episode | null;
  characters: Character[];
}

@Component({
  selector: 'app-episode-detail',
  standalone: true,
  imports: [
    AsyncPipe,
    LoaderComponent,
    ErrorMessageComponent,
    CharacterCardComponent,
  ],
  templateUrl: './episode-detail.component.html',
  styleUrl: './episode-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EpisodeDetailComponent {
  readonly id = input.required<string>();

  private readonly episodeService = inject(EpisodeService);
  private readonly characterService = inject(CharacterService);
  readonly favorisService = inject(FavorisService);

  readonly state$ = toObservable(this.id).pipe(
    switchMap((routeId) =>
      this.episodeService.getById(Number(routeId)).pipe(
        switchMap((episode) => {
          const ids = idsFromUrls(episode.characters);
          const characters$ =
            ids.length > 0
              ? this.characterService.getMany(ids)
              : of<Character[]>([]);
          return characters$.pipe(
            map(
              (characters): EpisodeDetailState => ({
                loading: false,
                error: null,
                episode,
                characters,
              })
            )
          );
        }),
        startWith<EpisodeDetailState>({
          loading: true,
          error: null,
          episode: null,
          characters: [],
        }),
        catchError(() =>
          of<EpisodeDetailState>({
            loading: false,
            error: 'Épisode introuvable.',
            episode: null,
            characters: [],
          })
        )
      )
    )
  );

  reload(): void {
    window.location.reload();
  }
}
