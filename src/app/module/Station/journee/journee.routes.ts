import { Routes } from '@angular/router';
import { ConfigurationStep1Page } from './pages/configuration-step1/configuration-step1.page';
import { IndexPistolesStep2Page } from './pages/index-pistoles-step2/index-pistoles-step2.page';
import { BonsStep3Page } from './pages/bons-step3/bons-step3.page';
import { EncaissementsStep5Page } from './pages/encaissements-step4/encaissements-step4.page';
import { DepensesStep5Page } from './pages/depenses-step5/depenses-step5.page';
import { ControleStockStep6Page } from './pages/controle-stock-step6/controle-stock-step6.page';
import { ValidationStep7Page } from './pages/validation-step7/validation-step7.page';
import { JourneeListPage } from './pages/journee-list/journee-list.page';
import { JourneeWizardPage } from './pages/journee-wizard/journee-wizard.page';

const wizardChildRoutes: Routes = [
  { path: 'configuration-step1', component: ConfigurationStep1Page },
  { path: 'index-pistoles-step2', component: IndexPistolesStep2Page },
  { path: 'bons-step3', component: BonsStep3Page },
  { path: 'encaissements-step4', component: EncaissementsStep5Page },
  { path: 'depenses-step5', component: DepensesStep5Page },
  { path: 'controle-stock-step6', component: ControleStockStep6Page },
  { path: 'validation-step7', component: ValidationStep7Page },
  { path: 'validation-step6', redirectTo: 'validation-step7', pathMatch: 'full' },
  { path: '', redirectTo: 'configuration-step1', pathMatch: 'full' },
];

export const JOURNEE_ROUTES: Routes = [
  { path: '', component: JourneeListPage },
  {
    path: 'nouvelle',
    component: JourneeWizardPage,
    children: wizardChildRoutes,
  },
  // Legacy URLs (wizard used to live directly under /journees/*)
  ...wizardChildRoutes
    .filter((route) => route.path !== '')
    .map((route) => ({
      path: route.path!,
      redirectTo: `nouvelle/${route.path}`,
      pathMatch: 'full' as const,
    })),
];
