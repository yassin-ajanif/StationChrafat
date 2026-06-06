import { Component, input } from '@angular/core';
import { TranslatePipe } from '../../../core/i18n';

export interface WizardStepError {
  key: string;
  params?: Record<string, string | number>;
}

@Component({
  selector: 'app-wizard-step-errors',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './wizard-step-errors.component.html',
  styleUrl: './wizard-step-errors.component.scss',
})
export class WizardStepErrorsComponent {
  readonly errors = input.required<readonly WizardStepError[]>();
}
