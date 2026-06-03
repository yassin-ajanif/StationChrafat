import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./shared/components/app-shell/app-shell.component').then((m) => m.AppShellComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'journees' },
      {
        path: 'journees',
        loadChildren: () =>
          import('./module/Station/journee/journee.routes').then((m) => m.JOURNEE_ROUTES),
      },
      { path: 'lavage', redirectTo: 'station/lavage' },
      { path: 'vidange', redirectTo: 'station/vidange' },
      {
        path: 'station',
        loadChildren: () =>
          import('./module/Station/station.routes').then((m) => m.STATION_ROUTES),
      },
    ],
  },
  { path: '**', redirectTo: 'journees' },
];
