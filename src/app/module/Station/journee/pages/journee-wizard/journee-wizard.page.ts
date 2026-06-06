import { Component, OnInit, inject, signal } from '@angular/core';
import { TranslatePipe } from '../../../../../core/i18n';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs';
import { WizardStepperComponent } from '../../../../../shared/components/wizard-stepper/wizard-stepper.component';
import { JOURNEE_WIZARD_STEPS } from '../../journee-wizard.steps';
import { JourneeActions } from '../../state/journee.actions';
import { selectWizardStepValidityByPath } from '../../state/journee.selectors';

@Component({
  selector: 'app-journee-wizard-page',
  standalone: true,
  imports: [RouterOutlet, WizardStepperComponent, TranslatePipe],
  templateUrl: './journee-wizard.page.html',
  styleUrl: './journee-wizard.page.scss',
})
export class JourneeWizardPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(Store);

  readonly steps = JOURNEE_WIZARD_STEPS;
  readonly currentPath = signal('configuration-step1');
  readonly stepValidityByPath = this.store.selectSignal(selectWizardStepValidityByPath);

  ngOnInit(): void {
    this.store.dispatch(JourneeActions.resetDraft());
    this.syncPath();
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => this.syncPath());
  }

  private syncPath(): void {
    const path = this.route.firstChild?.snapshot.url[0]?.path ?? 'configuration-step1';
    this.currentPath.set(path);
  }
}
