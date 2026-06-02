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
          import('./module/journee/journee.routes').then((m) => m.JOURNEE_ROUTES),
      },
      { path: 'lavage', redirectTo: 'journees' },
      { path: 'vidange', redirectTo: 'journees' },
      {
        path: 'station',
        loadChildren: () =>
          import('./module/stock/stock.routes').then((m) => m.STOCK_ROUTES),
      },
    ],
  },
  { path: '**', redirectTo: 'journees' },
];
