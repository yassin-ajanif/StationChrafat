import { Routes } from '@angular/router';

export const VIDANGE_VENTES_ROUTES: Routes = [
  {
    path: 'devis',
    loadComponent: () =>
      import('../pages/devis-list/devis-list.page').then((m) => m.DevisListPage),
  },
  {
    path: 'commandes',
    loadComponent: () =>
      import('../pages/commandes-list/commandes-list.page').then((m) => m.CommandesListPage),
  },
  {
    path: 'livraisons',
    loadComponent: () =>
      import('../pages/livraisons-list/livraisons-list.page').then((m) => m.LivraisonsListPage),
  },
];
