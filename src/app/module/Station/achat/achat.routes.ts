import { Routes } from '@angular/router';
import { AchatAvoirsListPage } from './pages/achat/avoirs-list/avoirs-list.page';
import { AchatCommandesListPage } from './pages/achat/commandes-list/commandes-list.page';
import { AchatDevisListPage } from './pages/achat/devis-list/devis-list.page';
import { AchatFacturesListPage } from './pages/achat/factures-list/factures-list.page';
import { AchatLivraisonsListPage } from './pages/achat/livraisons-list/livraisons-list.page';
import { AchatRetoursListPage } from './pages/achat/retours-list/retours-list.page';

export const ACHAT_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'devis' },
  { path: 'devis', component: AchatDevisListPage },
  { path: 'commandes', component: AchatCommandesListPage },
  { path: 'livraisons', component: AchatLivraisonsListPage },
  { path: 'factures', component: AchatFacturesListPage },
  { path: 'avoirs', component: AchatAvoirsListPage },
  { path: 'retours', component: AchatRetoursListPage },
];
