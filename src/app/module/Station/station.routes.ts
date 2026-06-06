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
  {
    path: 'produits-services',
    loadChildren: () => import('./produits-services/produits-services.routes').then((m) => m.PRODUITS_SERVICES_ROUTES),
  },
  {
    path: 'client',
    loadChildren: () => import('./client/client.routes').then((m) => m.CLIENT_ROUTES),
  },
  {
    path: 'fournisseur',
    loadChildren: () => import('./fournisseur/fournisseur.routes').then((m) => m.FOURNISSEUR_ROUTES),
  },
];
