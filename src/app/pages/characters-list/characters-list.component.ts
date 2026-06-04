import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import { Character } from '../../models/character.model';
import { Info } from '../../models/info.model';
import { CharacterCardComponent } from '../../components/character-card/character-card.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { PaginatorComponent } from '../../components/paginator/paginator.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ErrorMessageComponent } from '../../components/error-message/error-message.component';
import { CharacterGraphqlService } from '../../services/character-graphql.service';
import { FavorisService } from '../../services/favoris.service';

interface CharactersListState {
  loading: boolean;
  error: string | null;
  characters: Character[];
  info: Info | null;
}

@Component({
  selector: 'app-characters-list',
  standalone: true,
  imports: [
    AsyncPipe,
    CharacterCardComponent,
    SearchBarComponent,
    PaginatorComponent,
    LoaderComponent,
    ErrorMessageComponent,
  ],
  templateUrl: './characters-list.component.html',
  styleUrl: './characters-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharactersListComponent {
  private readonly graphql = inject(CharacterGraphqlService);
  readonly favorisService = inject(FavorisService);

  private readonly search$ = new BehaviorSubject<string>('');
  private readonly status$ = new BehaviorSubject<string>('');
  readonly currentPage = signal(1);
  private readonly page$ = new BehaviorSubject<number>(1);

  readonly state$ = combineLatest([
    this.search$.pipe(debounceTime(300), distinctUntilChanged()),
    this.status$.pipe(distinctUntilChanged()),
    this.page$,
  ]).pipe(
    switchMap(([name, status, page]) =>
      this.graphql
        .getAll(page, name || undefined, status || undefined)
        .pipe(
          map(
            (res): CharactersListState => ({
              loading: false,
              error: null,
              characters: res.results,
              info: res.info,
            })
          ),
          catchError((err: unknown) => {
            const detail =
              err instanceof Error ? err.message : 'Erreur inconnue';
            return of<CharactersListState>({
              loading: false,
              error: `Erreur lors du chargement des personnages (GraphQL) : ${detail}`,
              characters: [],
              info: null,
            });
          }),
          startWith<CharactersListState>({
            loading: true,
            error: null,
            characters: [],
            info: null,
          })
        )
    )
  );

  onSearch(term: string): void {
    this.search$.next(term);
    this.goToPage(1);
  }

  onStatusChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.status$.next(value);
    this.goToPage(1);
  }

  onToggleFavori(character: Character): void {
    this.favorisService.toggle(character);
  }

  prevPage(): void {
    const page = this.currentPage();
    if (page > 1) {
      this.goToPage(page - 1);
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
