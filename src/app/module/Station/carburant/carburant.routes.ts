import { Routes } from '@angular/router';

export const CARBURANT_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'stock' },
  {
    path: 'stock',
    loadChildren: () =>
      import('./stock/stock.routes').then((m) => m.STOCK_ROUTES),
  },
  {
    path: 'ventes',
    loadChildren: () =>
      import('./ventes/ventes.routes').then((m) => m.CARBURANT_VENTES_ROUTES),
  },
];
