import { Routes } from '@angular/router';

export const STATION_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'carburant/stock' },
  {
    path: 'lavage',
    loadChildren: () =>
      import('./lavage/lavage.routes').then((m) => m.LAVAGE_ROUTES),
  },
  {
    path: 'vidange',
    loadChildren: () =>
      import('./vidange/vidange.routes').then((m) => m.VIDANGE_ROUTES),
  },
  {
    path: 'carburant',
    loadChildren: () =>
      import('./carburant/carburant.routes').then((m) => m.CARBURANT_ROUTES),
  },
];
