import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  catchError,
  map,
  of,
  switchMap,
  startWith,
} from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { CharacterService } from '../../services/character.service';
import { EpisodeService } from '../../services/episode.service';
import { FavorisService } from '../../services/favoris.service';
import { idsFromUrls, idFromUrl } from '../../utils/url-id.util';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ErrorMessageComponent } from '../../components/error-message/error-message.component';
import { StatusPipe } from '../../pipes/status.pipe';
import { Episode } from '../../models/episode.model';
import { Character } from '../../models/character.model';

interface CharacterDetailState {
  loading: boolean;
  error: string | null;
  character: Character | null;
  episodes: Episode[];
  originId: number | null;
  locationId: number | null;
}

@Component({
  selector: 'app-character-detail',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    LoaderComponent,
    ErrorMessageComponent,
    StatusPipe,
  ],
  templateUrl: './character-detail.component.html',
  styleUrl: './character-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterDetailComponent {
  readonly id = input.required<string>();

  private readonly characterService = inject(CharacterService);
  private readonly episodeService = inject(EpisodeService);
  readonly favorisService = inject(FavorisService);

  readonly state$ = toObservable(this.id).pipe(
    switchMap((routeId) => {
      const numId = Number(routeId);
      return this.characterService.getById(numId).pipe(
        switchMap((character) => {
          const episodeIds = idsFromUrls(character.episode);
          const episodes$ =
            episodeIds.length > 0
              ? this.episodeService.getMany(episodeIds)
              : of<Episode[]>([]);
          return episodes$.pipe(
            map(
              (episodes): CharacterDetailState => ({
                loading: false,
                error: null,
                character,
                episodes,
                originId: idFromUrl(character.origin.url),
                locationId: idFromUrl(character.location.url),
              })
            )
          );
        }),
        startWith<CharacterDetailState>({
          loading: true,
          error: null,
          character: null,
          episodes: [],
          originId: null,
          locationId: null,
        }),
        catchError(() =>
          of<CharacterDetailState>({
            loading: false,
            error: 'Personnage introuvable.',
            character: null,
            episodes: [],
            originId: null,
            locationId: null,
          })
        )
      );
    })
  );

  toggleFavori(character: Character): void {
    this.favorisService.toggle(character);
  }

  reload(): void {
    window.location.reload();
  }
}
