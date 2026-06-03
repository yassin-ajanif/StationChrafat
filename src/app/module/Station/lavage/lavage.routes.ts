import { Routes } from '@angular/router';

export const LAVAGE_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'ventes/devis' },
  {
    path: 'ventes',
    loadChildren: () =>
      import('./ventes/ventes.routes').then((m) => m.LAVAGE_VENTES_ROUTES),
  },
];
