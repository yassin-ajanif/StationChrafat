import { Routes } from '@angular/router';

export const STATION_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'stock' },
  {
    path: '',
    loadChildren: () =>
      import('./erp/erp.routes').then((m) => m.ERP_ROUTES),
  },
];
