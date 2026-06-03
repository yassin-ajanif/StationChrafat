import { Routes } from '@angular/router';

export const VIDANGE_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'ventes/devis' },
  {
    path: 'ventes',
    loadChildren: () =>
      import('./ventes/ventes.routes').then((m) => m.VIDANGE_VENTES_ROUTES),
  },
];
