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
import { Location } from '../../models/location.model';
import { LocationService } from '../../services/location.service';
import { PaginatorComponent } from '../../components/paginator/paginator.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ErrorMessageComponent } from '../../components/error-message/error-message.component';
import { TruncatePipe } from '../../pipes/truncate.pipe';

@Component({
  selector: 'app-locations-list',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    PaginatorComponent,
    LoaderComponent,
    ErrorMessageComponent,
    TruncatePipe,
  ],
  templateUrl: './locations-list.component.html',
  styleUrl: './locations-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationsListComponent {
  private readonly locationService = inject(LocationService);

  readonly currentPage = signal(1);
  private readonly page$ = new BehaviorSubject<number>(1);

  readonly state$ = this.page$.pipe(
    switchMap((page) =>
      this.locationService.getAll(page).pipe(
        map((res) => ({
          loading: false,
          error: null as string | null,
          locations: res.results,
          info: res.info,
        })),
        startWith({
          loading: true,
          error: null,
          locations: [] as Location[],
          info: null,
        }),
        catchError(() =>
          of({
            loading: false,
            error: 'Erreur lors du chargement des lieux.',
            locations: [] as Location[],
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
