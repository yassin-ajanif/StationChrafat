import { Routes } from '@angular/router';
import { StockOverviewPage } from './pages/stock-overview/stock-overview.page';

export const STOCK_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'stock' },
  { path: 'stock', component: StockOverviewPage },
];
