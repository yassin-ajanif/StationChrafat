import { Routes } from '@angular/router';
import { ConfigurationStep1Page } from './pages/configuration-step1/configuration-step1.page';
import { BonLavageStep3Page } from './pages/bon-lavage-step3/bon-lavage-step3.page';
import { BonVidangeStep4Page } from './pages/bon-vidange-step4/bon-vidange-step4.page';
import { DepensesStep6Page } from './pages/depenses-step6/depenses-step6.page';
import { EncaissementsStep5Page } from './pages/encaissements-step5/encaissements-step5.page';
import { ValidationStep7Page } from './pages/validation-step7/validation-step7.page';
import { IndexPistolesStep2Page } from './pages/index-pistoles-step2/index-pistoles-step2.page';
import { JourneeListPage } from './pages/journee-list/journee-list.page';
import { JourneeWizardPage } from './pages/journee-wizard/journee-wizard.page';

export const JOURNEE_ROUTES: Routes = [
  { path: '', component: JourneeListPage },
  {
    path: 'nouvelle',
    component: JourneeWizardPage,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'configuration-step1' },
      { path: 'configuration-step1', component: ConfigurationStep1Page },
      { path: 'index-pistoles-step2', component: IndexPistolesStep2Page },
      { path: 'bon-lavage-step3', component: BonLavageStep3Page },
      { path: 'bon-vidange-step4', component: BonVidangeStep4Page },
      { path: 'encaissements-step5', component: EncaissementsStep5Page },
      { path: 'depenses-step6', component: DepensesStep6Page },
      { path: 'validation-step7', component: ValidationStep7Page },
    ],
  },
];
