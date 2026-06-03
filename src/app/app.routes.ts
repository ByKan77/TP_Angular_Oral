import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: 'characters',
    loadComponent: () =>
      import('./pages/characters-list/characters-list.component').then(
        (m) => m.CharactersListComponent
      ),
  },
  {
    path: 'characters/:id',
    loadComponent: () =>
      import('./pages/character-detail/character-detail.component').then(
        (m) => m.CharacterDetailComponent
      ),
  },
  {
    path: 'locations',
    loadComponent: () =>
      import('./pages/locations-list/locations-list.component').then(
        (m) => m.LocationsListComponent
      ),
  },
  {
    path: 'locations/:id',
    loadComponent: () =>
      import('./pages/location-detail/location-detail.component').then(
        (m) => m.LocationDetailComponent
      ),
  },
  {
    path: 'episodes',
    loadComponent: () =>
      import('./pages/episodes-list/episodes-list.component').then(
        (m) => m.EpisodesListComponent
      ),
  },
  {
    path: 'episodes/:id',
    loadComponent: () =>
      import('./pages/episode-detail/episode-detail.component').then(
        (m) => m.EpisodeDetailComponent
      ),
  },
  {
    path: 'favoris',
    loadComponent: () =>
      import('./pages/favoris/favoris.component').then((m) => m.FavorisComponent),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./pages/contact/contact.component').then((m) => m.ContactComponent),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
];
