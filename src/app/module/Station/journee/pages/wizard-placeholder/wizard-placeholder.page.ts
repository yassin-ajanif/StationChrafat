import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { journeeWizardStepByPath, nextWizardStep, prevWizardStep } from '../../journee-wizard.steps';

@Component({
  selector: 'app-wizard-placeholder-page',
  standalone: true,
  imports: [RouterLink, ButtonComponent],
  templateUrl: './wizard-placeholder.page.html',
  styleUrl: './wizard-placeholder.page.scss',
})
export class WizardPlaceholderPage {
  private readonly route = inject(ActivatedRoute);

  readonly stepPath = this.route.snapshot.url.at(-1)?.path ?? '';

  readonly step = journeeWizardStepByPath(this.stepPath);
  readonly prevStep = prevWizardStep(this.stepPath);
  readonly nextStep = nextWizardStep(this.stepPath);

  title(): string {
    return this.step?.label ?? 'Étape';
  }

  prevLink(): string[] {
    return this.prevStep
      ? ['/journees', 'nouvelle', this.prevStep.path]
      : ['/journees', 'nouvelle', 'configuration-step1'];
  }

  nextLink(): string[] {
    return this.nextStep ? ['/journees', 'nouvelle', this.nextStep.path] : ['/journees'];
  }
}
