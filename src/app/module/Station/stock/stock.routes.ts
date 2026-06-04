import { Routes } from '@angular/router';
import { PistoletsCuvesStatusPage } from './pages/pistolets-cuves-status/pistolets-cuves-status.page';

export const STOCK_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'gestion' },
  { path: 'pistolets-cuves', component: PistoletsCuvesStatusPage },
  { path: 'gestion', loadComponent: () => import('./pages/stock-gestion/stock-gestion.page').then((m) => m.StockGestionPage) },
];
