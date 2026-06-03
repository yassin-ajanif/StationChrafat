import { Routes } from '@angular/router';
import { AchatAvoirsListPage } from './pages/achat/avoirs-list/avoirs-list.page';
import { AchatCommandesListPage } from './pages/achat/commandes-list/commandes-list.page';
import { AchatDevisListPage } from './pages/achat/devis-list/devis-list.page';
import { AchatFacturesListPage } from './pages/achat/factures-list/factures-list.page';
import { AchatLivraisonsListPage } from './pages/achat/livraisons-list/livraisons-list.page';
import { StockOverviewPage } from './pages/stock-overview/stock-overview.page';
import { VentesAvoirsListPage } from './pages/ventes/avoirs-list/avoirs-list.page';
import { VentesCommandesListPage } from './pages/ventes/commandes-list/commandes-list.page';
import { VentesDevisListPage } from './pages/ventes/devis-list/devis-list.page';
import { VentesFacturesListPage } from './pages/ventes/factures-list/factures-list.page';
import { VentesLivraisonsListPage } from './pages/ventes/livraisons-list/livraisons-list.page';

export const VIDANGE_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'stock' },
  { path: 'stock', component: StockOverviewPage },
  { path: 'ventes/devis', component: VentesDevisListPage },
  { path: 'ventes/commandes', component: VentesCommandesListPage },
  { path: 'ventes/livraisons', component: VentesLivraisonsListPage },
  { path: 'ventes/factures', component: VentesFacturesListPage },
  { path: 'ventes/avoirs', component: VentesAvoirsListPage },
  { path: 'achat/devis', component: AchatDevisListPage },
  { path: 'achat/commandes', component: AchatCommandesListPage },
  { path: 'achat/livraisons', component: AchatLivraisonsListPage },
  { path: 'achat/factures', component: AchatFacturesListPage },
  { path: 'achat/avoirs', component: AchatAvoirsListPage },
];
