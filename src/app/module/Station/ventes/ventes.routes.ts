import { Routes } from '@angular/router';
import { VentesAvoirsListPage } from './pages/ventes/avoirs-list/avoirs-list.page';
import { VentesCommandesListPage } from './pages/ventes/commandes-list/commandes-list.page';
import { VentesDevisListPage } from './pages/ventes/devis-list/devis-list.page';
import { VentesFacturesListPage } from './pages/ventes/factures-list/factures-list.page';
import { VentesLivraisonsListPage } from './pages/ventes/livraisons-list/livraisons-list.page';
import { VentesRetoursListPage } from './pages/ventes/retours-list/retours-list.page';

export const VENTES_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'devis' },
  { path: 'devis', component: VentesDevisListPage },
  { path: 'commandes', component: VentesCommandesListPage },
  { path: 'livraisons', component: VentesLivraisonsListPage },
  { path: 'factures', component: VentesFacturesListPage },
  { path: 'avoirs', component: VentesAvoirsListPage },
  { path: 'retours', component: VentesRetoursListPage },
];
