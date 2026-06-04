import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { JourneeWizardStep } from '../../../module/Station/journee/journee-wizard.steps';

@Component({
  selector: 'app-wizard-stepper',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './wizard-stepper.component.html',
  styleUrl: './wizard-stepper.component.scss',
})
export class WizardStepperComponent {
  readonly steps = input.required<readonly JourneeWizardStep[]>();
  readonly currentPath = input.required<string>();
  /** Hide step labels (validation recap layout). */
  readonly compact = input(false);

  isActive(step: JourneeWizardStep): boolean {
    return step.path === this.currentPath();
  }

  isCompleted(step: JourneeWizardStep): boolean {
    const current = this.steps().find((s) => s.path === this.currentPath());
    return current != null && step.order < current.order;
  }

  formatOrder(step: JourneeWizardStep): string {
    return step.order < 10 ? `0${step.order}` : String(step.order);
  }
}
