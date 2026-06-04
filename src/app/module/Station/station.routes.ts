import { Routes } from '@angular/router';

export const STATION_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'stock' },
  {
    path: 'stock',
    loadChildren: () => import('./stock/stock.routes').then((m) => m.STOCK_ROUTES),
  },
  {
    path: 'ventes',
    loadChildren: () => import('./ventes/ventes.routes').then((m) => m.VENTES_ROUTES),
  },
  {
    path: 'achat',
    loadChildren: () => import('./achat/achat.routes').then((m) => m.ACHAT_ROUTES),
  },
];
