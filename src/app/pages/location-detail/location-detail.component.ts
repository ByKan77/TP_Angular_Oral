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
import { LocationService } from '../../services/location.service';
import { CharacterService } from '../../services/character.service';
import { idsFromUrls } from '../../utils/url-id.util';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ErrorMessageComponent } from '../../components/error-message/error-message.component';
import { CharacterCardComponent } from '../../components/character-card/character-card.component';
import { FavorisService } from '../../services/favoris.service';
import { Location } from '../../models/location.model';

interface LocationDetailState {
  loading: boolean;
  error: string | null;
  location: Location | null;
  residents: Character[];
}

@Component({
  selector: 'app-location-detail',
  standalone: true,
  imports: [
    AsyncPipe,
    LoaderComponent,
    ErrorMessageComponent,
    CharacterCardComponent,
  ],
  templateUrl: './location-detail.component.html',
  styleUrl: './location-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationDetailComponent {
  readonly id = input.required<string>();

  private readonly locationService = inject(LocationService);
  private readonly characterService = inject(CharacterService);
  readonly favorisService = inject(FavorisService);

  readonly state$ = toObservable(this.id).pipe(
    switchMap((routeId) =>
      this.locationService.getById(Number(routeId)).pipe(
        switchMap((location) => {
          const ids = idsFromUrls(location.residents);
          const residents$ =
            ids.length > 0
              ? this.characterService.getMany(ids)
              : of<Character[]>([]);
          return residents$.pipe(
            map(
              (residents): LocationDetailState => ({
                loading: false,
                error: null,
                location,
                residents,
              })
            )
          );
        }),
        startWith<LocationDetailState>({
          loading: true,
          error: null,
          location: null,
          residents: [],
        }),
        catchError(() =>
          of<LocationDetailState>({
            loading: false,
            error: 'Lieu introuvable.',
            location: null,
            residents: [],
          })
        )
      )
    )
  );

  reload(): void {
    window.location.reload();
  }
}
