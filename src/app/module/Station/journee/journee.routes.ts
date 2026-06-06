import { Routes } from '@angular/router';
import { ConfigurationStep1Page } from './pages/configuration-step1/configuration-step1.page';
import { IndexPistolesStep2Page } from './pages/index-pistoles-step2/index-pistoles-step2.page';
import { BonsStep3Page } from './pages/bons-step3/bons-step3.page';
import { EncaissementsStep5Page } from './pages/encaissements-step4/encaissements-step4.page';
import { DepensesStep5Page } from './pages/depenses-step5/depenses-step5.page';
import { ValidationStep6Page } from './pages/validation-step6/validation-step6.page';
import { JourneeWizardPage } from './pages/journee-wizard/journee-wizard.page';

export const JOURNEE_ROUTES: Routes = [
  {
    path: '',
    component: JourneeWizardPage,
    children: [
      { path: 'configuration-step1', component: ConfigurationStep1Page },
      { path: 'index-pistoles-step2', component: IndexPistolesStep2Page },
      { path: 'bons-step3', component: BonsStep3Page },
      { path: 'encaissements-step4', component: EncaissementsStep5Page },
      { path: 'depenses-step5', component: DepensesStep5Page },
      { path: 'validation-step6', component: ValidationStep6Page },
      { path: '', redirectTo: 'configuration-step1', pathMatch: 'full' },
    ],
  },
];
